using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using memoriza_backend.Models.Auth;

namespace memoriza_backend.Services.Auth
{
    public class JwtService : IJwtService
    {
        private readonly IConfiguration _configuration;

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(User user)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]!)
            );
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var isAdmin = user.UserGroupId == (int)UserGroupType.Admin;
            var fullName = $"{user.FirstName} {user.LastName}".Trim();

            var claims = new List<Claim>
            {
                // Identificação básica
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),

                // Nome
                new Claim("firstName", user.FirstName ?? string.Empty),
                new Claim("lastName", user.LastName ?? string.Empty),
                new Claim("fullName", fullName),

                // Grupo
                new Claim("userGroupId", user.UserGroupId.ToString()),
                new Claim(ClaimTypes.Role, user.UserGroupId.ToString()),
                new Claim("isAdmin", isAdmin.ToString().ToLowerInvariant()),

                // Origem da conta
                new Claim("authProvider",
                    string.IsNullOrWhiteSpace(user.AuthProvider) ? "Local" : user.AuthProvider)
            };

            // Campos opcionais de login social
            if (!string.IsNullOrWhiteSpace(user.ProviderUserId))
                claims.Add(new Claim("providerUserId", user.ProviderUserId));

            if (!string.IsNullOrWhiteSpace(user.ProviderEmail))
                claims.Add(new Claim("providerEmail", user.ProviderEmail));

            if (!string.IsNullOrWhiteSpace(user.PictureUrl))
                claims.Add(new Claim("pictureUrl", user.PictureUrl));

            // Auditoria opcional
            if (user.LastLoginAt.HasValue)
                claims.Add(new Claim("lastLoginAt", user.LastLoginAt.Value.ToString("o")));

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public ClaimsPrincipal? ValidateToken(string token)
        {
            try
            {
                var key = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]!)
                );
                var tokenHandler = new JwtSecurityTokenHandler();

                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = true,
                    ValidIssuer = _configuration["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = _configuration["Jwt:Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                var principal = tokenHandler.ValidateToken(token, validationParameters, out _);
                return principal;
            }
            catch
            {
                return null;
            }
        }
    }
}
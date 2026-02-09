using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using memoriza_backend.Models.Authentication;

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
            var roleName = isAdmin ? "Admin" : "User";


            var authProvider =
                !string.IsNullOrWhiteSpace(user.AuthProvider)
                    ? user.AuthProvider
                    : !string.IsNullOrWhiteSpace(user.ProviderUserId)
                        ? "Google"
                        : "Local";

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim("sub", user.Id.ToString()),
                new Claim("userGroupId", user.UserGroupId.ToString()),
                new Claim(ClaimTypes.Role, roleName),
                new Claim("isAdmin", isAdmin.ToString().ToLowerInvariant()),
                new Claim("isActive", user.IsActive.ToString().ToLower()),
                new Claim("authProvider", authProvider)
            };

            // Grupo personalizado para funcionários (se existir)
            if (user.EmployeeGroupId.HasValue)
            {
                claims.Add(new Claim("employeeGroupId", user.EmployeeGroupId.Value.ToString()));
            }

            // Campos opcionais
            if (!string.IsNullOrWhiteSpace(user.ProviderUserId))
                claims.Add(new Claim("providerUserId", user.ProviderUserId));

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    double.Parse(_configuration["Jwt:ExpiresInMinutes"] ?? "480")
                ),
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
                    ClockSkew = TimeSpan.Zero,
                    RoleClaimType = ClaimTypes.Role
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
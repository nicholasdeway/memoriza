using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using memoriza_backend.Models.Authentication;
using memoriza_backend.Services.Auth;
using memoriza_backend.Settings;
using memoriza_backend.Repositories.Auth;

namespace memoriza_backend.Controllers.Auth
{
    [ApiController]
    [Route("api/auth/google")]
    public class GoogleAuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtService _jwtService;
        private readonly GoogleSettings _googleSettings;
        private readonly ILogger<GoogleAuthController> _logger;
        private readonly string _frontendBase;

        public GoogleAuthController(
            IUserRepository userRepository,
            IJwtService jwtService,
            IOptions<GoogleSettings> googleOptions,
            IConfiguration configuration,
            ILogger<GoogleAuthController> logger)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
            _googleSettings = googleOptions.Value;
            _logger = logger;

            // tenta ler de "Google:FrontendBaseUrl" ou "FrontendBaseUrl" ou usa fallback
            _frontendBase =
                configuration["Google:FrontendBaseUrl"]
                ?? configuration["FrontendBaseUrl"]
                ?? "http://localhost:3000";
        }

        // GET /api/auth/google/login
        [HttpGet("login")]
        public IActionResult Login([FromQuery] string? returnUrl = null)
        {
            var callbackUrl = Url.Action(
                nameof(Callback),
                "GoogleAuth",
                new { returnUrl },
                Request.Scheme)!;

            var props = new AuthenticationProperties
            {
                RedirectUri = callbackUrl
            };

            return Challenge(props, GoogleDefaults.AuthenticationScheme);
        }

        // GET /api/auth/google/callback
        [HttpGet("callback")]
        public async Task<IActionResult> Callback([FromQuery] string? returnUrl = null)
        {
            // autentica o cookie externo "External" configurado no Program.cs
            var externalResult = await HttpContext.AuthenticateAsync("External");

            if (!externalResult.Succeeded || externalResult.Principal == null)
            {
                _logger.LogWarning("Falha ao autenticar cookie externo do Google.");
                return Redirect($"{_frontendBase}/login?googleError=external_auth_failed");
            }

            var principal = externalResult.Principal;

            try
            {
                // garante usuário no banco + gera JWT
                var token = await UpsertUserFromGoogleAsync(principal);

                // sempre limpar o cookie externo depois de usar
                await HttpContext.SignOutAsync("External");

                var finalReturnUrl = string.IsNullOrWhiteSpace(returnUrl) ? "/" : returnUrl;

                // monta URL para /google/callback no frontend
                // front pega o token da query e salva (ou decodifica pra pegar nome, email etc.)
                var redirectUrl = QueryHelpers.AddQueryString(
                    $"{_frontendBase}/google/callback",
                    new Dictionary<string, string?>
                    {
                        ["token"] = token,
                        ["returnUrl"] = finalReturnUrl
                    });

                return Redirect(redirectUrl);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao processar Callback do Google.");
                return Redirect($"{_frontendBase}/login?googleError=server_error");
            }
        }

        // ========= Helpers =========

        private async Task<string> UpsertUserFromGoogleAsync(ClaimsPrincipal principal)
        {
            var sub = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value
                   ?? principal.FindFirst("sub")?.Value;

            var emailRaw = principal.FindFirst(ClaimTypes.Email)?.Value ?? string.Empty;
            var email = emailRaw.Trim();
            var emailNorm = email.ToLowerInvariant();

            var displayName = principal.FindFirst(ClaimTypes.Name)?.Value;
            var picture = principal.FindFirst("picture")?.Value; // pode vir ou não

            if (string.IsNullOrWhiteSpace(sub))
                throw new InvalidOperationException("Google retornou 'sub' vazio.");

            if (string.IsNullOrWhiteSpace(emailNorm))
                throw new InvalidOperationException("Google retornou email vazio.");

            // tenta achar usuário pelo e-mail via repositório
            var user = await _userRepository.GetByEmailAsync(emailNorm);

            if (user is null)
            {
                // separa nome completo retornado pelo Google em firstName / lastName
                SplitName(displayName, out var firstName, out var lastName);

                // gera uma senha randômica só pra preencher o campo (não será usada no login)
                var randomPassword = Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N");
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(randomPassword);

                user = new User
                {
                    FirstName = firstName,
                    LastName = lastName,
                    Email = emailNorm,
                    Password = hashedPassword,
                    CreatedAt = DateTime.UtcNow,
                    PasswordResetPending = false,

                    // Origem Google
                    AuthProvider = "Google",
                    ProviderUserId = sub,
                    ProviderEmail = emailNorm,
                    PictureUrl = picture,

                    // Grupo padrão: usuário comum
                    UserGroupId = (int)UserGroupType.UsuarioComum,

                    LastLoginAt = DateTime.UtcNow
                };

                user = await _userRepository.CreateAsync(user);
            }
            else
            {
                // Usuário já existe (local ou Google) -> vincula dados do Google em memória
                if (string.IsNullOrWhiteSpace(user.AuthProvider) || user.AuthProvider == "Local")
                    user.AuthProvider = "Google";

                if (string.IsNullOrWhiteSpace(user.ProviderUserId))
                    user.ProviderUserId = sub;

                if (string.IsNullOrWhiteSpace(user.ProviderEmail))
                    user.ProviderEmail = emailNorm;

                if (!string.IsNullOrWhiteSpace(picture))
                    user.PictureUrl = picture;

                user.LastLoginAt = DateTime.UtcNow;

                user = await _userRepository.UpdateAsync(user);
            }

            // gera token com o JwtService (usa Id, Email, nomes, grupo, provedor)
            var token = _jwtService.GenerateToken(user);
            return token;
        }

        private static void SplitName(string? displayName, out string firstName, out string lastName)
        {
            if (string.IsNullOrWhiteSpace(displayName))
            {
                firstName = "Usuário";
                lastName = "Google";
                return;
            }

            var parts = displayName.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);

            if (parts.Length == 1)
            {
                firstName = parts[0];
                lastName = "";
            }
            else
            {
                firstName = parts[0];
                lastName = string.Join(' ', parts.Skip(1));
            }
        }
    }
}
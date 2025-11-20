using System.Security.Claims;
using memoriza_backend.Models.Auth;

namespace memoriza_backend.Services.Auth
{
    // Serviço responsável por gerar e validar o token JWT
    public interface IJwtService
    {
        string GenerateToken(User user);
        ClaimsPrincipal? ValidateToken(string token);
    }
}
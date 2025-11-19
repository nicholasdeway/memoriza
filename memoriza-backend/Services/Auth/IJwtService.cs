using memoriza_backend.Models.Auth;

namespace memoriza_backend.Services.Auth
{
    // Serviço responsável por gerar o token JWT
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
using System.Threading.Tasks;
using memoriza_backend.Models.DTO.Auth;

namespace memoriza_backend.Services.Auth
{
    // Contrato do serviço de usuário/autenticação
    public interface IUserService
    {
        // Registro de usuário - retorna apenas o token JWT
        Task<string> RegisterAsync(RegisterUserDto dto);

        // Login de usuário - retorna apenas o token JWT
        Task<string> LoginAsync(LoginUserDto dto);

        // Solicitação de redefinição de senha
        Task<string> RequestPasswordResetAsync(RequestPasswordResetDto dto);

        // Confirmação da redefinição de senha
        Task<string> ConfirmPasswordResetAsync(ConfirmPasswordResetDto dto);
    }
}
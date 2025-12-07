using System;
using System.Threading.Tasks;
using memoriza_backend.Models.DTO.Auth;

namespace memoriza_backend.Services.Auth
{
    public interface IUserService
    {
        Task<string> RegisterAsync(RegisterUserDto dto);
        Task<string> LoginAsync(LoginUserDto dto);
        Task<string> RequestPasswordResetAsync(RequestPasswordResetDto dto);
        Task<string> ConfirmPasswordResetAsync(ConfirmPasswordResetDto dto);
    }
}
using System;
using System.Threading.Tasks;
using memoriza_backend.Helpers;
using memoriza_backend.Models.DTO.Auth;
using memoriza_backend.Models.DTO.User.Profile;

namespace memoriza_backend.Services.Profile.UserService
{
    public interface IProfileUserService
    {
        Task<UserProfileResponse?> GetProfileAsync(Guid userId);
        Task<ServiceResult<UserProfileResponse>> UpdateProfileAsync(Guid userId, UpdateUserProfileRequest request);

        Task<ServiceResult<bool>> DeleteAccountAsync(Guid userId, DeleteAccountRequest request);

        Task<ServiceResult<bool>> ChangePasswordAsync(Guid userId, ChangePasswordDto request);
    }
}
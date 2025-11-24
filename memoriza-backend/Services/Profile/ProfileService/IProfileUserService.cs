using memoriza_backend.Models.DTO.User.Profile;
using memoriza_backend.Helpers;

namespace memoriza_backend.Services.Profile.UserService
{
    public interface IProfileUserService
    {
        Task<UserProfileResponse?> GetProfileAsync(Guid userId);
        Task<ServiceResult<UserProfileResponse>> UpdateProfileAsync(Guid userId, UpdateUserProfileRequest request);
        Task<ServiceResult<bool>> DeleteAccountAsync(Guid userId, DeleteAccountRequest request);
    }
}
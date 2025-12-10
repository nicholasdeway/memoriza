using memoriza_backend.Models.Authentication;

namespace memoriza_backend.Repositories.Interfaces
{
    public interface IProfileRepository
    {
        Task<User?> GetByIdAsync(Guid userId);
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByPhoneAsync(string phone);
        Task UpdateAsync(User user);
        Task SoftDeleteAsync(Guid userId);
    }
}
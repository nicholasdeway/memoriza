using memoriza_backend.Models.Authentication;

namespace memoriza_backend.Repositories.Interfaces
{
    public interface IProfileRepository
    {
        Task<User?> GetByIdAsync(Guid userId);
        Task<User?> GetByEmailAsync(string email);
        Task UpdateAsync(User user);
        Task SoftDeleteAsync(Guid userId);
    }
}
using memoriza_backend.Models.Admin;

namespace memoriza_backend.Repositories.Admin.Categories
{
    public interface ICategoryRepository
    {
        Task<IReadOnlyList<Category>> GetAllAsync();
        Task<Category?> GetByIdAsync(Guid id);
        Task<Category> CreateAsync(Category category);
        Task UpdateAsync(Category category);
        Task DeleteAsync(Guid id); // delete lógico (IsActive = false)
    }
}
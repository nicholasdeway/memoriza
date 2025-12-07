using memoriza_backend.Models.Admin;

namespace memoriza_backend.Repositories.Admin.Colors
{
    public interface IColorRepository
    {
        Task<IReadOnlyList<Color>> GetAllAsync();
        Task<Color?> GetByIdAsync(int id);
        Task<int> CreateAsync(Color color);
        Task UpdateAsync(Color color);
        Task DeleteAsync(int id);

        Task<bool> ExistsByNameAsync(string name);
    }
}
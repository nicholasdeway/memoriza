using System.Collections.Generic;
using System.Threading.Tasks;
using memoriza_backend.Models.Admin;

namespace memoriza_backend.Repositories.Admin.Sizes
{
    public interface ISizeRepository
    {
        Task<IReadOnlyList<Size>> GetAllAsync();
        Task<Size?> GetByIdAsync(int id);
        Task<int> CreateAsync(Size size);
        Task UpdateAsync(Size size);
        Task DeleteAsync(int id);

        Task<bool> ExistsByNameAsync(string name);
    }
}
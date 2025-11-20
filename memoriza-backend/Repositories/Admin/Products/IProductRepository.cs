using memoriza_backend.Models.Admin;

namespace memoriza_backend.Repositories.Admin.Products
{
    public interface IProductRepository
    {
        Task<IReadOnlyList<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(Guid id);
        Task<Product> CreateAsync(Product product);
        Task UpdateAsync(Product product);
        Task DeleteAsync(Guid id); // delete lógico -> is_active = false
    }
}
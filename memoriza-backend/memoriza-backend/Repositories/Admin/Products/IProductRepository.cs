using memoriza_backend.Models.Admin;

namespace memoriza_backend.Repositories.Admin.Products
{
    public interface IProductRepository
    {
        Task<IReadOnlyList<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(Guid id);
        Task<Product> CreateAsync(Product product);
        Task UpdateAsync(Product product);

        // Soft delete (mantém o registro com is_active = false)
        Task DeleteAsync(Guid id);

        // Hard delete (deleta de vez – NOVO)
        Task HardDeleteAsync(Guid id);

        // Relação Produto ⇄ Tamanhos (tabela product_sizes)
        Task<IReadOnlyList<int>> GetSizeIdsByProductIdAsync(Guid productId);
        Task<IDictionary<Guid, IReadOnlyList<int>>> GetSizeIdsByProductIdsAsync(IEnumerable<Guid> productIds);
        Task ReplaceProductSizesAsync(Guid productId, IEnumerable<int> sizeIds);

        // Cores
        Task<IReadOnlyList<int>> GetColorIdsByProductIdAsync(Guid productId);
        Task<IDictionary<Guid, IReadOnlyList<int>>> GetColorIdsByProductIdsAsync(IEnumerable<Guid> productIds);
        Task ReplaceProductColorsAsync(Guid productId, IEnumerable<int> colorIds);
    }
}
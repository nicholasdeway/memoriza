using memoriza_backend.Models.Admin;

namespace memoriza_backend.Repositories.Admin.Products
{
    public interface IProductImageRepository
    {
        Task<IReadOnlyList<ProductImage>> GetByProductIdAsync(Guid productId);
        Task<IReadOnlyList<ProductImage>> GetByProductIdsAsync(IEnumerable<Guid> productIds);
        Task<ProductImage?> GetByIdAsync(Guid id);
        Task<ProductImage> CreateAsync(ProductImage image);
        Task UpdateAsync(ProductImage image);
        Task DeleteAsync(Guid id);
        Task DeleteAllByProductIdAsync(Guid productId);
        Task ReorderImagesAsync(IEnumerable<(Guid ImageId, int DisplayOrder, bool IsPrimary)> updates);
    }
}
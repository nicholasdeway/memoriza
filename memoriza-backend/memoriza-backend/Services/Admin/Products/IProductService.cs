using memoriza_backend.Models.DTO.Admin.Product;

namespace memoriza_backend.Services.Admin.Products
{
    public interface IProductService
    {
        Task<IReadOnlyList<ProductResponseDto>> GetAllAsync();
        Task<ProductResponseDto?> GetByIdAsync(Guid id);
        Task<ProductResponseDto> CreateAsync(CreateProductDto dto);
        Task<ProductResponseDto> UpdateAsync(Guid id, UpdateProductDto dto);
        Task DeleteAsync(Guid id);

        // ---- IMAGENS ----
        Task<IReadOnlyList<ProductImageDto>> GetImagesAsync(Guid productId);
        Task<ProductImageDto> AddImageAsync(Guid productId, CreateProductImageDto dto);
        Task DeleteImageAsync(Guid imageId);

        // Drag & drop / reorder
        Task ReorderImagesAsync(Guid productId, IEnumerable<ReorderImageItemDto> items);
    }
}
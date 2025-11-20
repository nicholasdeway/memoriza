using memoriza_backend.Models.DTO.Admin.Products;

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
    }
}
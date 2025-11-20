using memoriza_backend.Models.DTO.Admin.Categories;

namespace memoriza_backend.Services.Admin.Categories
{
    public interface ICategoryService
    {
        Task<IReadOnlyList<CategoryResponseDto>> GetAllAsync();
        Task<CategoryResponseDto?> GetByIdAsync(Guid id);
        Task<CategoryResponseDto> CreateAsync(CreateCategoryDto dto);
        Task<CategoryResponseDto> UpdateAsync(Guid id, UpdateCategoryDto dto);
        Task DeleteAsync(Guid id);
    }
}
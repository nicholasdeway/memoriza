using memoriza_backend.Models.DTO.Admin.Color;

namespace memoriza_backend.Services.Admin.Colors
{
    public interface IColorService
    {
        Task<IReadOnlyList<ColorResponseDto>> GetAllAsync();
        Task<ColorResponseDto?> GetByIdAsync(int id);
        Task<ColorResponseDto> CreateAsync(CreateColorDto dto);
        Task<ColorResponseDto> UpdateAsync(int id, UpdateColorDto dto);
        Task DeleteAsync(int id);
    }
}
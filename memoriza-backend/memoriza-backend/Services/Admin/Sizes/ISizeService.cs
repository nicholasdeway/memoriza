using memoriza_backend.Models.DTO.Admin.Size;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace memoriza_backend.Services.Admin.Sizes
{
    public interface ISizeService
    {
        Task<IReadOnlyList<SizeResponseDto>> GetAllAsync();
        Task<SizeResponseDto?> GetByIdAsync(int id);
        Task<SizeResponseDto> CreateAsync(CreateSizeDto dto);
        Task<SizeResponseDto> UpdateAsync(int id, UpdateSizeDto dto);
        Task DeleteAsync(int id);
    }
}
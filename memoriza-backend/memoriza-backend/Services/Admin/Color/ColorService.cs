using memoriza_backend.Models.Admin;
using memoriza_backend.Models.DTO.Admin.Color;
using memoriza_backend.Repositories.Admin.Colors;

namespace memoriza_backend.Services.Admin.Colors
{
    public class ColorService : IColorService
    {
        private readonly IColorRepository _repository;

        public ColorService(IColorRepository repository)
        {
            _repository = repository;
        }

        // GET ALL
        public async Task<IReadOnlyList<ColorResponseDto>> GetAllAsync()
        {
            var list = await _repository.GetAllAsync();

            return list
                .Select(MapToDto)
                .ToList()
                .AsReadOnly();
        }

        // GET BY ID
        public async Task<ColorResponseDto?> GetByIdAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return entity is null ? null : MapToDto(entity);
        }

        // CREATE
        public async Task<ColorResponseDto> CreateAsync(CreateColorDto dto)
        {
            if (await _repository.ExistsByNameAsync(dto.Name))
                throw new InvalidOperationException("Já existe uma cor com esse nome.");

            var entity = new Color
            {
                Name = dto.Name.Trim(),
                HexCode = dto.HexCode,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            await _repository.CreateAsync(entity);
            return MapToDto(entity);
        }

        // UPDATE
        public async Task<ColorResponseDto> UpdateAsync(int id, UpdateColorDto dto)
        {
            var entity = await _repository.GetByIdAsync(id)
                ?? throw new ApplicationException("Cor não encontrada.");

            if (!string.Equals(entity.Name, dto.Name, StringComparison.OrdinalIgnoreCase))
            {
                if (await _repository.ExistsByNameAsync(dto.Name))
                    throw new InvalidOperationException("Já existe uma cor com esse nome.");
            }

            entity.Name = dto.Name.Trim();
            entity.HexCode = dto.HexCode;
            entity.IsActive = dto.IsActive;

            await _repository.UpdateAsync(entity);
            return MapToDto(entity);
        }

        // DELETE (regras no Repository)
        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }

        private static ColorResponseDto MapToDto(Color c) => new()
        {
            Id = c.Id,
            Name = c.Name,
            HexCode = c.HexCode,
            IsActive = c.IsActive,
            CreatedAt = c.CreatedAt
        };
    }
}
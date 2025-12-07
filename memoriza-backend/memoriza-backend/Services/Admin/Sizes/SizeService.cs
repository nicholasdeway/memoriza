using memoriza_backend.Models.Admin;
using memoriza_backend.Models.DTO.Admin.Size;
using memoriza_backend.Repositories.Admin.Sizes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace memoriza_backend.Services.Admin.Sizes
{
    public class SizeService : ISizeService
    {
        private readonly ISizeRepository _repository;

        public SizeService(ISizeRepository repository)
        {
            _repository = repository;
        }

        // ======================================================
        // GET ALL
        // ======================================================
        public async Task<IReadOnlyList<SizeResponseDto>> GetAllAsync()
        {
            var list = await _repository.GetAllAsync();

            return list
                .Select(MapToDto)
                .ToList();
        }

        // ======================================================
        // GET BY ID
        // ======================================================
        public async Task<SizeResponseDto?> GetByIdAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return entity is null ? null : MapToDto(entity);
        }

        // ======================================================
        // CREATE
        // ======================================================
        public async Task<SizeResponseDto> CreateAsync(CreateSizeDto dto)
        {
            if (await _repository.ExistsByNameAsync(dto.Name))
                throw new InvalidOperationException("Já existe um tamanho com esse nome.");

            var entity = new Size
            {
                Name = dto.Name.Trim(),
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            await _repository.CreateAsync(entity);
            return MapToDto(entity);
        }

        // ======================================================
        // UPDATE
        // ======================================================
        public async Task<SizeResponseDto> UpdateAsync(int id, UpdateSizeDto dto)
        {
            var entity = await _repository.GetByIdAsync(id)
                ?? throw new ApplicationException("Tamanho não encontrado.");

            if (!string.Equals(entity.Name, dto.Name, StringComparison.OrdinalIgnoreCase))
            {
                if (await _repository.ExistsByNameAsync(dto.Name))
                    throw new InvalidOperationException("Já existe um tamanho com esse nome.");
            }

            entity.Name = dto.Name.Trim();
            entity.IsActive = dto.IsActive;

            await _repository.UpdateAsync(entity);
            return MapToDto(entity);
        }

        // ======================================================
        // DELETE (regras implementadas no Repository)
        // ======================================================
        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }

        // ======================================================
        // MAP
        // ======================================================
        private static SizeResponseDto MapToDto(Size s) => new()
        {
            Id = s.Id,
            Name = s.Name,
            IsActive = s.IsActive,
            CreatedAt = s.CreatedAt
        };
    }
}
using memoriza_backend.Models.Admin;
using memoriza_backend.Models.DTO.Admin.Category;
using memoriza_backend.Repositories.Admin.Categories;

namespace memoriza_backend.Services.Admin.Categories
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repository;

        public CategoryService(ICategoryRepository repository)
        {
            _repository = repository;
        }

        // GET ALL
        public async Task<IReadOnlyList<CategoryResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();

            return entities
                .Select(c => new CategoryResponseDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    IsActive = c.IsActive,
                    CreatedAt = c.CreatedAt
                })
                .ToList();
        }

        // GET BY ID
        public async Task<CategoryResponseDto?> GetByIdAsync(Guid id)
        {
            var c = await _repository.GetByIdAsync(id);
            if (c == null) return null;

            return new CategoryResponseDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                IsActive = c.IsActive,
                CreatedAt = c.CreatedAt
            };
        }

        // CREATE
        public async Task<CategoryResponseDto> CreateAsync(CreateCategoryDto dto)
        {
            var category = new Category
            {
                Name = dto.Name,
                Description = dto.Description,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            category = await _repository.CreateAsync(category);

            return new CategoryResponseDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                IsActive = category.IsActive,
                CreatedAt = category.CreatedAt
            };
        }

        // UPDATE
        public async Task<CategoryResponseDto> UpdateAsync(Guid id, UpdateCategoryDto dto)
        {
            var category = await _repository.GetByIdAsync(id);
            if (category == null)
                throw new ApplicationException("Categoria não encontrada.");

            category.Name = dto.Name;
            category.Description = dto.Description;
            category.IsActive = dto.IsActive;

            await _repository.UpdateAsync(category);

            return new CategoryResponseDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                IsActive = category.IsActive,
                CreatedAt = category.CreatedAt
            };
        }

        // DELETE (Regras implementadas no Repository)
        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
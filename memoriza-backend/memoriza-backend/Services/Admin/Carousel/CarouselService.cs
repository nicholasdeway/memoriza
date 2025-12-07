using System;
using memoriza_backend.Models.Entities;
using memoriza_backend.Repositories.Admin.CarouselItems;
using memoriza_backend.Models.DTO.Admin.Product;
using memoriza_backend.Models.DTO.Admin.Carousel;

namespace memoriza_backend.Services.Admin.CarouselItems
{
    public class CarouselItemService : ICarouselItemService
    {
        private readonly ICarouselItemRepository _repository;
        private readonly IWebHostEnvironment _env;

        public CarouselItemService(
            ICarouselItemRepository repository,
            IWebHostEnvironment env)
        {
            _repository = repository;
            _env = env;
        }

        public async Task<IReadOnlyList<CarouselItem>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<CarouselItem?> GetByIdAsync(Guid id)
        {
            return await _repository.GetByIdAsync(id);
        }

        // ===========================================================
        // CREATE
        // ===========================================================
        public async Task<CarouselItem> CreateAsync(CreateCarouselItemDto dto, IFormFile? imageFile)
        {
            // 🔥 Validação: título obrigatório exceto full_image
            if (dto.TemplateType != "full_image" && string.IsNullOrWhiteSpace(dto.Title))
                throw new ApplicationException("Título é obrigatório para este template.");

            // 🔥 Validação: imagem sempre obrigatória
            if (imageFile == null)
                throw new ApplicationException("Imagem é obrigatória.");

            var displayOrder = await _repository.GetNextDisplayOrderAsync();

            var entity = new CarouselItem
            {
                Id = Guid.NewGuid(),

                // ⭐ Sempre garantir valor não nulo (full_image permite string vazia)
                Title = dto.TemplateType == "full_image"
                    ? ""
                    : dto.Title?.Trim() ?? "",

                Subtitle = dto.Subtitle,
                CtaText = dto.CtaText,
                CtaLink = dto.CtaLink,
                IsActive = dto.IsActive,
                TemplateType = dto.TemplateType,
                DisplayOrder = displayOrder,
                CreatedAt = DateTime.UtcNow,
                ImagePath = string.Empty
            };

            // Upload obrigatório
            entity.ImagePath = await SaveImageAsync(imageFile);

            entity = await _repository.CreateAsync(entity);
            return entity;
        }

        // ===========================================================
        // UPDATE
        // ===========================================================
        public async Task<CarouselItem> UpdateAsync(Guid id, UpdateCarouselItemDto dto, IFormFile? imageFile)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null)
                throw new ApplicationException("Banner não encontrado.");

            // 🔥 Validação: título obrigatório exceto full_image
            if (dto.TemplateType != "full_image" && string.IsNullOrWhiteSpace(dto.Title))
                throw new ApplicationException("Título é obrigatório para este template.");

            // Atualiza campos
            entity.Title = dto.TemplateType == "full_image"
                ? ""
                : dto.Title?.Trim() ?? "";

            entity.Subtitle = dto.Subtitle;
            entity.CtaText = dto.CtaText;
            entity.CtaLink = dto.CtaLink;
            entity.IsActive = dto.IsActive;
            entity.TemplateType = dto.TemplateType;

            // Se veio nova imagem, substitui
            if (imageFile != null)
            {
                entity.ImagePath = await SaveImageAsync(imageFile);
            }

            await _repository.UpdateAsync(entity);
            return entity;
        }

        // ===========================================================
        // DELETE
        // ===========================================================
        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }

        // ===========================================================
        // REORDER
        // ===========================================================
        public async Task ReorderAsync(IReadOnlyList<ReorderImageItemDto> items)
        {
            await _repository.ReorderAsync(items);
        }

        // ===========================================================
        // Upload de imagem
        // ===========================================================
        private async Task<string> SaveImageAsync(IFormFile file)
        {
            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "carousel");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var extension = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            await using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/uploads/carousel/{fileName}";
        }
    }
}
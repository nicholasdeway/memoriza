using System;
using memoriza_backend.Models.Entities;
using memoriza_backend.Models.DTO.Admin.Product;
using memoriza_backend.Models.DTO.Admin.Carousel;

namespace memoriza_backend.Services.Admin.CarouselItems
{
    public interface ICarouselItemService
    {
        Task<IReadOnlyList<CarouselItem>> GetAllAsync();
        Task<CarouselItem?> GetByIdAsync(Guid id);
        Task<CarouselItem> CreateAsync(CreateCarouselItemDto dto, IFormFile? imageFile);
        Task<CarouselItem> UpdateAsync(Guid id, UpdateCarouselItemDto dto, IFormFile? imageFile);
        Task DeleteAsync(Guid id);
        Task ReorderAsync(IReadOnlyList<ReorderImageItemDto> items);
    }
}
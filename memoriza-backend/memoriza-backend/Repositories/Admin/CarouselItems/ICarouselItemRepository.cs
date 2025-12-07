using memoriza_backend.Models.Entities;
using memoriza_backend.Models.DTO.Admin.Product;

namespace memoriza_backend.Repositories.Admin.CarouselItems
{
    public interface ICarouselItemRepository
    {
        Task<IReadOnlyList<CarouselItem>> GetAllAsync();
        Task<CarouselItem?> GetByIdAsync(Guid id);
        Task<CarouselItem> CreateAsync(CarouselItem item);
        Task UpdateAsync(CarouselItem item);
        Task DeleteAsync(Guid id);

        Task<int> GetNextDisplayOrderAsync();

        Task ReorderAsync(IReadOnlyList<ReorderImageItemDto> items);
    }
}
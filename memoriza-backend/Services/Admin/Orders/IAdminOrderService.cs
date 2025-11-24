using memoriza_backend.Models.Admin;
using memoriza_backend.Models.DTO.Admin;

public interface IAdminOrderService
{
    Task<IReadOnlyList<OrderListItemDto>> GetAllAsync();
    Task<OrderDetailDto?> GetByIdAsync(Guid id);
    Task<IReadOnlyList<OrderItemDto>> GetItemsAsync(Guid orderId);

    Task UpdateAsync(Guid id, AdminUpdateOrderDto dto);

    Task UpdateStatusAsync(Guid id, OrderStatus status, Guid adminUserId, string? note);
}
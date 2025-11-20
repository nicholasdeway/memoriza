using memoriza_backend.Models.Admin;

namespace memoriza_backend.Services.Admin.Orders
{
    public interface IOrderService
    {
        Task<IReadOnlyList<Order>> GetAllAsync();
        Task<Order?> GetByIdAsync(Guid id);
        Task<IReadOnlyList<OrderItem>> GetItemsAsync(Guid orderId);

        Task UpdateAsync(Order order);

        Task UpdateStatusAsync(Guid orderId, OrderStatus newStatus, Guid adminUserId, string? note = null);
    }
}
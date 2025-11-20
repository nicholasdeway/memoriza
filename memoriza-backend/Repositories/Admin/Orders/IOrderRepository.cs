using memoriza_backend.Models.Admin;

namespace memoriza_backend.Repositories.Admin.Orders
{
    public interface IOrderRepository
    {
        Task<IReadOnlyList<Order>> GetAllAsync();
        Task<Order?> GetByIdAsync(Guid id);
        Task<IReadOnlyList<OrderItem>> GetItemsByOrderIdAsync(Guid orderId);

        Task UpdateAsync(Order order);
        Task AddStatusHistoryAsync(OrderStatusHistory history);
    }
}
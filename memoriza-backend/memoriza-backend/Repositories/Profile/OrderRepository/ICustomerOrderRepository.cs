using memoriza_backend.Models.Entities;

namespace memoriza_backend.Repositories.Interfaces
{
    public interface ICustomerOrderRepository
    {
        Task<Order?> GetByIdAsync(Guid orderId, string userId);
        Task<Order?> GetByIdWithItemsAsync(Guid orderId);
        Task<List<Order>> GetUserOrdersAsync(string userId);

        Task CreateAsync(Order order);
        Task AddOrderItemsAsync(IEnumerable<OrderItem> items);

        Task UpdateRefundStatusAsync(Guid orderId, string refundStatus, string? reason = null);
        Task UpdateStatusAsync(Guid orderId, string newStatus);

        Task UpdateTrackingInfoAsync(
            Guid orderId,
            string? trackingCode,
            string? trackingCompany,
            string? trackingUrl
        );

        Task UpdateAsync(Order order);
        
        // Cancelamento automático
        Task<List<Order>> GetExpiredPendingOrdersAsync(double expirationHours);
    }
}
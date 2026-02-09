using memoriza_backend.Models.DTO.Admin.Order;

namespace memoriza_backend.Services.Admin.Orders
{
    public interface IAdminOrderService
    {
        Task<IReadOnlyList<OrderListItemDto>> GetAllAsync();
        Task<OrderDetailDto?> GetByIdAsync(Guid id);
        Task<IReadOnlyList<OrderItemDto>> GetItemsAsync(Guid orderId);

        Task UpdateAsync(Guid id, AdminUpdateOrderDto dto);

        /// <summary>
        /// Atualiza o status usando código string (Pending, Paid, InProduction…)
        /// </summary>
        Task UpdateStatusAsync(Guid id, string newStatus, Guid adminUserId, string? note);

        /// <summary>
        /// Atualiza informações de rastreio (tracking code / transportadora / URL).
        /// </summary>
        Task UpdateTrackingAsync(Guid orderId, OrderDetailDto dto);

        Task ApproveRefundAsync(Guid orderId, RefundDecisionDto dto);
        Task RejectRefundAsync(Guid orderId, RefundDecisionDto dto);
        Task<int> GetPaidOrdersCountAsync();
    }
}
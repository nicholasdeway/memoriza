using memoriza_backend.Models.DTO.User.Orders;
using memoriza_backend.Helpers;

namespace memoriza_backend.Services.Profile.OrderService
{
    public interface ICustomerOrderService
    {
        Task<IEnumerable<OrderSummaryForUserResponse>> GetOrdersForUserAsync(string userId);
        Task<OrderDetailForUserResponse?> GetOrderDetailForUserAsync(string userId, Guid orderId);
        Task<ServiceResult<RefundStatusResponse>> RequestRefundAsync(string userId, RequestRefundRequest request);
        Task<ServiceResult<OrderDetailForUserResponse>> CreateOrderFromCartAsync(
            string userId,
            CreateOrderFromCartRequest request);
    }
}
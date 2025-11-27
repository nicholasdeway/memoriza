using memoriza_backend.Models.DTO.User.Orders;
using memoriza_backend.Helpers;
using memoriza_backend.Models.DTO.Payments;

namespace memoriza_backend.Services.Profile.OrderService
{
    public interface ICustomerOrderService
    {
        Task<IEnumerable<OrderSummaryForUserResponse>> GetOrdersForUserAsync(string userId);

        Task<OrderDetailForUserResponse?> GetOrderDetailForUserAsync(string userId, Guid orderId);

        Task<ServiceResult<RefundStatusResponse>> RequestRefundAsync(
            string userId,
            RequestRefundRequest request);

        Task<ServiceResult<OrderDetailForUserResponse>> CreateOrderFromCartAsync(
            string userId,
            CreateOrderFromCartRequest request);

        // NOVO MÉTODO → CHECKOUT COMPLETO (Pedido + Mercado Pago)
        Task<ServiceResult<CheckoutInitResponse>> CheckoutAsync(
            string userId,
            CreateOrderFromCartRequest request);
    }
}
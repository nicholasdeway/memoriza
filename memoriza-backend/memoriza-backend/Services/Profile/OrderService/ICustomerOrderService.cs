using memoriza_backend.Models.DTO.User.Orders;
using memoriza_backend.Helpers;
using memoriza_backend.Models.DTO.Payments;
using memoriza_backend.Models.DTO.Profile.Orders;

namespace memoriza_backend.Services.Profile.OrderService
{
    public interface ICustomerOrderService
    {
        /// <summary>
        /// Retorna a lista de pedidos do usuário (resumo).
        /// </summary>
        Task<IEnumerable<OrderSummaryForUserResponse>> GetOrdersForUserAsync(string userId);

        /// <summary>
        /// Retorna os detalhes completos de um pedido, incluindo informações
        /// de pagamento (PreferenceId, InitPoint, CanResume, CanReopenQrCode).
        /// </summary>
        Task<OrderDetailForUserResponse?> GetOrderDetailForUserAsync(string userId, Guid orderId);

        /// <summary>
        /// Cria um pedido apenas salvando os dados, sem iniciar pagamento.
        /// </summary>
        Task<ServiceResult<OrderDetailForUserResponse>> CreateOrderFromCartAsync(
            string userId,
            CreateOrderFromCartRequest request);



        /// <summary>
        /// Processa pagamento direto via Checkout Transparente.
        /// </summary>
        Task<ServiceResult<ProcessPaymentResponse>> ProcessPaymentAsync(
            Guid orderId,
            ProcessPaymentRequest request);

        /// <summary>
        /// Processa pagamento com cartão de crédito via Checkout Transparente.
        /// </summary>
        Task<ServiceResult<ProcessPaymentResponse>> ProcessCardPaymentAsync(
            Guid orderId,
            CardPaymentRequest request);

        /// <summary>
        /// Solicita reembolso para um pedido já entregue.
        /// </summary>
        Task<ServiceResult<RefundStatusResponse>> RequestRefundAsync(
            string userId,
            RequestRefundRequest request);

        /// <summary>
        /// Cancela pedidos pendentes que expiraram (mais de X horas).
        /// Retorna o número de pedidos cancelados.
        /// </summary>
        Task<int> CancelExpiredOrdersAsync();
    }
}
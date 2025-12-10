using memoriza_backend.Models.DTO.User.Orders;
using memoriza_backend.Helpers;
using memoriza_backend.Models.DTO.Payments;

namespace memoriza_backend.Services.Profile.OrderService
{
    public interface ICustomerOrderService
    {
        // ======================================================
        // ORDERS - LISTAGEM E DETALHE
        // ======================================================

        /// <summary>
        /// Retorna a lista de pedidos do usuário (resumo).
        /// </summary>
        Task<IEnumerable<OrderSummaryForUserResponse>> GetOrdersForUserAsync(string userId);

        /// <summary>
        /// Retorna os detalhes completos de um pedido, incluindo informações
        /// de pagamento (PreferenceId, InitPoint, CanResume, CanReopenQrCode).
        /// </summary>
        Task<OrderDetailForUserResponse?> GetOrderDetailForUserAsync(string userId, Guid orderId);


        // ======================================================
        // CREATE ORDER (APENAS SALVAR)
        // ======================================================

        /// <summary>
        /// Cria um pedido apenas salvando os dados, sem iniciar pagamento.
        /// </summary>
        Task<ServiceResult<OrderDetailForUserResponse>> CreateOrderFromCartAsync(
            string userId,
            CreateOrderFromCartRequest request);


        // ======================================================
        // CHECKOUT COMPLETO (Mercado Pago)
        // ======================================================

        /// <summary>
        /// Cria o pedido, gera preferência no Mercado Pago e
        /// retorna dados para redirecionamento ao checkout.
        /// </summary>
        Task<ServiceResult<CheckoutInitResponse>> CheckoutAsync(
            string userId,
            CreateOrderFromCartRequest request);


        // ======================================================
        // REFUND
        // ======================================================

        /// <summary>
        /// Solicita reembolso para um pedido já entregue.
        /// </summary>
        Task<ServiceResult<RefundStatusResponse>> RequestRefundAsync(
            string userId,
            RequestRefundRequest request);


        // ======================================================
        // CANCELAMENTO AUTOMÁTICO
        // ======================================================

        /// <summary>
        /// Cancela pedidos pendentes que expiraram (mais de X horas).
        /// Retorna o número de pedidos cancelados.
        /// </summary>
        Task<int> CancelExpiredOrdersAsync();
    }
}
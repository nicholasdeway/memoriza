using System;

namespace memoriza_backend.Models.DTO.User.Orders
{
    /// <summary>
    /// Requisição de solicitação de reembolso de um pedido.
    /// </summary>
    public class RequestRefundRequest
    {
        /// <summary>
        /// Id do pedido a ser reembolsado.
        /// Vem da rota em OrdersController e é setado antes de chamar o service.
        /// </summary>
        public Guid OrderId { get; set; }

        /// <summary>
        /// Motivo informado pelo usuário (opcional, mas útil para o admin).
        /// </summary>
        public string? Reason { get; set; }
    }
}
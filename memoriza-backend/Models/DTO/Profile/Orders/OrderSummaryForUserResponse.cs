using System;

namespace memoriza_backend.Models.DTO.User.Orders
{
    /// <summary>
    /// Resumo de pedido para listagem do usuário.
    /// </summary>
    public class OrderSummaryForUserResponse
    {
        public Guid OrderId { get; set; }

        public string OrderNumber { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public decimal TotalAmount { get; set; }

        public string Status { get; set; } = string.Empty;

        /// <summary>
        /// Indica se o pedido ainda é elegível para reembolso (até 7 dias, etc.).
        /// </summary>
        public bool IsRefundable { get; set; }

        /// <summary>
        /// Status atual do reembolso (se houver).
        /// </summary>
        public string? RefundStatus { get; set; }
    }
}
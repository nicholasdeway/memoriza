using memoriza_backend.Helpers;
using System;
using System.Collections.Generic;

namespace memoriza_backend.Models.Entities
{
    /// <summary>
    /// Pedido concluído a partir de um carrinho.
    /// </summary>
    public class Order
    {
        public Guid Id { get; set; }

        /// <summary>
        /// Número amigável do pedido (ex: MEM-2025-0001).
        /// </summary>
        public string OrderNumber { get; set; } = string.Empty;

        public string UserId { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public decimal Subtotal { get; set; }

        public decimal ShippingAmount { get; set; }

        public decimal TotalAmount { get; set; }

        public List<OrderItem> Items { get; set; } = new();

        /// <summary>
        /// Status do pedido, puxando do Helpers/OrderStatusCodes.
        /// </summary>
        public string Status { get; set; } = OrderStatusCodes.Pending;

        /// <summary>
        /// Código da opção de frete usada (ex: SUDESTE, CENTRO_OESTE, RETIRADA).
        /// </summary>
        public string ShippingCode { get; set; } = string.Empty;

        /// <summary>
        /// Nome exibido da opção de frete.
        /// </summary>
        public string ShippingName { get; set; } = string.Empty;

        /// <summary>
        /// Prazo estimado em dias na época da compra.
        /// </summary>
        public int ShippingEstimatedDays { get; set; }

        // ---- Reembolso (RF-08) ----

        /// <summary>
        /// Indica se o pedido ainda é elegível para reembolso (até 7 dias).
        /// Essa flag pode ser calculada ou persistida.
        /// </summary>
        public bool IsRefundable { get; set; }

        /// <summary>
        /// Status do reembolso (ex: None, Requested, Approved, Rejected).
        /// </summary>
        public string? RefundStatus { get; set; }

        /// <summary>
        /// Motivo informado pelo usuário na solicitação.
        /// </summary>
        public string? RefundReason { get; set; }

        public DateTime? RefundRequestedAt { get; set; }

        public DateTime? RefundProcessedAt { get; set; }

    }
}
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

        public string OrderNumber { get; set; } = string.Empty;

        // id do usuário (uuid em texto)
        public string UserId { get; set; } = string.Empty;

        // Nome completo do cliente (JOIN em users)
        public string CustomerName { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public decimal Subtotal { get; set; }
        public decimal ShippingAmount { get; set; }
        public decimal TotalAmount { get; set; }

        public List<OrderItem> Items { get; set; } = new();

        /// <summary>
        /// Código de status em string (Pending, Paid, InProduction…)
        /// </summary>
        public string Status { get; set; } = OrderStatusCodes.Pending;

        public string ShippingCode { get; set; } = string.Empty;
        public string ShippingName { get; set; } = string.Empty;
        public int ShippingEstimatedDays { get; set; }

        // ---- Endereço de Entrega ----
        public Guid? ShippingAddressId { get; set; }
        public string ShippingStreet { get; set; } = string.Empty;
        public string ShippingNumber { get; set; } = string.Empty;
        public string? ShippingComplement { get; set; }
        public string ShippingNeighborhood { get; set; } = string.Empty;
        public string ShippingCity { get; set; } = string.Empty;
        public string ShippingState { get; set; } = string.Empty;
        public string ShippingZipCode { get; set; } = string.Empty;
        public string ShippingCountry { get; set; } = "Brasil";

        // Observações de personalização
        public string? PersonalizationNotes { get; set; }

        // ---- Entrega ----
        public DateTime? DeliveredAt { get; set; }

        // ---- Rastreamento ----
        public string? TrackingCode { get; set; }
        public string? TrackingCompany { get; set; }
        public string? TrackingUrl { get; set; }

        public bool IsRefundable { get; set; }
        public string? RefundStatus { get; set; }
        public string? RefundReason { get; set; }
        public DateTime? RefundRequestedAt { get; set; }
        public DateTime? RefundProcessedAt { get; set; }
    }
}
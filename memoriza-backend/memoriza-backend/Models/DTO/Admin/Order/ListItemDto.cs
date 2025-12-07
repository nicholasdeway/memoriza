using memoriza_backend.Helpers;

namespace memoriza_backend.Models.DTO.Admin.Order
{
    public class OrderListItemDto
    {
        public Guid Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;

        public decimal Subtotal { get; set; }
        public decimal FreightValue { get; set; }
        public decimal Total { get; set; }

        /// <summary>
        /// Código de status em string (ex: Pending, Paid, InProduction…)
        /// </summary>
        public string Status { get; set; } = OrderStatusCodes.Pending;

        public DateTime CreatedAt { get; set; }

        // Info de rastreio (para listar rápido se quiser)
        public string? TrackingCode { get; set; }
        public string? TrackingCompany { get; set; }
        public string? TrackingUrl { get; set; }
    }

    public class OrderItemDto
    {
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = null!;
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal LineTotal { get; set; }
    }

    public class OrderDetailDto
    {
        public Guid Id { get; set; }

        /// <summary>
        /// Id do usuário como string (vem direto da tabela orders.user_id).
        /// </summary>
        public string UserId { get; set; } = string.Empty;

        public string CustomerName { get; set; } = string.Empty;

        public decimal Subtotal { get; set; }
        public decimal FreightValue { get; set; }
        public decimal Total { get; set; }

        /// <summary>
        /// Código de status em string (Pending, Paid, InProduction…)
        /// </summary>
        public string Status { get; set; } = OrderStatusCodes.Pending;

        public string? PersonalizationNotes { get; set; }
        public DateTime CreatedAt { get; set; }

        // Rastreio / Entrega
        public string? TrackingCode { get; set; }
        public string? TrackingCompany { get; set; }
        public string? TrackingUrl { get; set; }
        public DateTime? DeliveredAt { get; set; }

        public List<OrderItemDto> Items { get; set; } = new();
    }

    public class UpdateOrderStatusDto
    {
        /// <summary>
        /// Novo status em string (ex: Pending, Paid, InProduction…)
        /// </summary>
        public string NewStatus { get; set; } = OrderStatusCodes.Pending;

        public string? Note { get; set; }
        public Guid AdminUserId { get; set; }
    }

    public class UpdatePersonalizationNotesDto
    {
        public string Notes { get; set; } = string.Empty;
    }

    public class RefundRequestDto
    {
        public string Reason { get; set; } = string.Empty;
    }
}
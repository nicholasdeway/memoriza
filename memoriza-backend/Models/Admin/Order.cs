namespace memoriza_backend.Models.Admin
{
    public enum OrderStatus
    {
        AguardandoPagamento = 1,
        PagamentoConfirmado = 2,
        EmProducao = 3,
        ACaminho = 4,
        Finalizado = 5,
        Reembolsado = 6
    }

    public class Order
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }

        public decimal Subtotal { get; set; }
        public decimal FreightValue { get; set; }
        public decimal Total { get; set; }

        public OrderStatus Status { get; set; } = OrderStatus.AguardandoPagamento;

        // RF-13 – Observações da personalização combinada via WhatsApp
        public string? PersonalizationNotes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? PaidAt { get; set; }
        public DateTime? ShippedAt { get; set; }
        public DateTime? FinishedAt { get; set; }
        public DateTime? RefundedAt { get; set; }
    }

    public class OrderItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid OrderId { get; set; }
        public Guid ProductId { get; set; }

        // Snapshot do nome do produto na época do pedido
        public string ProductName { get; set; } = null!;
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }

        /// <summary>
        /// Subtotal deste item (UnitPrice * Quantity).
        /// </summary>
        public decimal Subtotal { get; set; }
    }

    public class OrderStatusHistory
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid OrderId { get; set; }
        public OrderStatus Status { get; set; }
        public Guid ChangedByUserId { get; set; }
        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
        public string? Note { get; set; }
    }
}
using System;

namespace memoriza_backend.Models.Entities
{
    /// <summary>
    /// Item de um pedido.
    /// </summary>
    public class OrderItem
    {
        public Guid Id { get; set; }

        public Guid OrderId { get; set; }

        public Guid ProductId { get; set; }

        public string ProductName { get; set; } = string.Empty;

        public string? ThumbnailUrl { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        /// <summary>
        /// Subtotal deste item (UnitPrice * Quantity).
        /// </summary>
        /// <summary>
        /// Subtotal deste item (UnitPrice * Quantity).
        /// </summary>
        public decimal Subtotal { get; set; }

        public string? PersonalizationText { get; set; }

        public int? SizeId { get; set; }

        public int? ColorId { get; set; }

        public string? SizeName { get; set; }

        public string? ColorName { get; set; }

        public Order? Order { get; set; }
    }
}
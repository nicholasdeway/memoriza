using System;

namespace memoriza_backend.Models.Entities
{
    /// <summary>
    /// Item dentro de um carrinho.
    /// </summary>
    public class CartItem
    {
        public Guid Id { get; set; }

        public Guid CartId { get; set; }

        public Guid ProductId { get; set; }

        public string ProductName { get; set; } = string.Empty;

        public string? ThumbnailUrl { get; set; }

        public int Quantity { get; set; }

        /// <summary>
        /// Preço unitário definido pelo backend no momento em que o item entra no carrinho.
        /// </summary>
        public decimal UnitPrice { get; set; }

        public decimal Subtotal { get; set; }

        public Cart? Cart { get; set; }
    }
}
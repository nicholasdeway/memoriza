using System;

namespace memoriza_backend.Models.DTO.User.Cart
{
    /// <summary>
    /// Representa um item no carrinho do usuário.
    /// </summary>
    public class CartItemDto
    {
        public Guid CartItemId { get; set; }

        public Guid ProductId { get; set; }

        public string ProductName { get; set; } = string.Empty;

        /// <summary>
        /// URL opcional de imagem do produto.
        /// </summary>
        public string? ThumbnailUrl { get; set; }

        public int Quantity { get; set; }

        /// <summary>
        /// Preço unitário definido pelo backend.
        /// </summary>
        public decimal UnitPrice { get; set; }

        /// <summary>
        /// Subtotal = UnitPrice * Quantity.
        /// </summary>
        public decimal Subtotal => UnitPrice * Quantity;
    }
}
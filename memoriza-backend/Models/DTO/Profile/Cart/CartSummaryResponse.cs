using System.Collections.Generic;

namespace memoriza_backend.Models.DTO.User.Cart
{
    /// <summary>
    /// Resumo do carrinho do usuário.
    /// </summary>
    public class CartSummaryResponse
    {
        /// <summary>
        /// Lista de itens no carrinho.
        /// </summary>
        public List<CartItemDto> Items { get; set; } = new();

        /// <summary>
        /// Subtotal dos itens (sem frete).
        /// </summary>
        public decimal Subtotal { get; set; }

        /// <summary>
        /// Valor do frete atual (se já calculado).
        /// </summary>
        public decimal ShippingAmount { get; set; }

        /// <summary>
        /// Valor total (Subtotal + ShippingAmount).
        /// </summary>
        public decimal Total => Subtotal + ShippingAmount;
    }
}
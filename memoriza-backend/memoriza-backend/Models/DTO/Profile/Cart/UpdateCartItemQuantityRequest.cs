using System;

namespace memoriza_backend.Models.DTO.User.Cart
{
    /// <summary>
    /// Requisição para atualizar a quantidade de um item do carrinho.
    /// </summary>
    public class UpdateCartItemQuantityRequest
    {
        /// <summary>
        /// Id do item do carrinho.
        /// </summary>
        public Guid CartItemId { get; set; }

        /// <summary>
        /// Nova quantidade desejada.
        /// </summary>
        public int Quantity { get; set; }
    }
}
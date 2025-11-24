using System;

namespace memoriza_backend.Models.DTO.User.Cart
{
    /// <summary>
    /// Requisição para remover um item do carrinho.
    /// </summary>
    public class RemoveCartItemRequest
    {
        /// <summary>
        /// Id do item do carrinho a ser removido.
        /// </summary>
        public Guid CartItemId { get; set; }
    }
}
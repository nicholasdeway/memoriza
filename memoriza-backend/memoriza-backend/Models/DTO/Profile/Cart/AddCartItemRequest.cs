using System;

namespace memoriza_backend.Models.DTO.User.Cart
{
    /// <summary>
    /// Requisição para adicionar um item ao carrinho.
    /// </summary>
    public class AddCartItemRequest
    {
        /// <summary>
        /// Id do produto que será adicionado.
        /// </summary>
        public Guid ProductId { get; set; }

        /// <summary>
        /// Quantidade desejada.
        /// </summary>
        public int Quantity { get; set; }
    }
}
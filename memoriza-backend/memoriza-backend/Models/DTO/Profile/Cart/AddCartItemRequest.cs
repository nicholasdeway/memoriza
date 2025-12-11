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
        
        /// <summary>
        /// Id do tamanho selecionado (opcional).
        /// </summary>
        public int? SizeId { get; set; }
        
        /// <summary>
        /// Id da cor selecionada (opcional).
        /// </summary>
        public int? ColorId { get; set; }
        
        /// <summary>
        /// Texto de personalização (opcional).
        /// </summary>
        public string? PersonalizationText { get; set; }
    }
}
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
        /// Nome do tamanho selecionado (opcional).
        /// </summary>
        public string? SizeName { get; set; }

        /// <summary>
        /// Nome da cor selecionada (opcional).
        /// </summary>
        public string? ColorName { get; set; }
        
        /// <summary>
        /// Texto de personalização (opcional).
        /// </summary>
        public string? PersonalizationText { get; set; }
    }
}
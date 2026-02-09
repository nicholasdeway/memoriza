using System;

namespace memoriza_backend.Models.DTO.User.Orders
{
    /// <summary>
    /// Dados enviados para transformar o carrinho em um pedido final (checkout).
    /// </summary>
    public class CreateOrderFromCartRequest
    {
        /// <summary>
        /// Valor calculado do frete.
        /// </summary>
        public decimal ShippingAmount { get; set; }

        /// <summary>
        /// Código da opção de envio escolhida (ex: SUDESTE, RETIRADA).
        /// </summary>
        public string ShippingCode { get; set; } = string.Empty;

        /// <summary>
        /// Nome da opção de envio escolhida.
        /// </summary>
        public string ShippingName { get; set; } = string.Empty;

        /// <summary>
        /// Prazo estimado de entrega.
        /// </summary>
        public int ShippingEstimatedDays { get; set; }

        /// <summary>
        /// Se o cliente escolheu retirar em loja.
        /// </summary>
        public bool PickupInStore { get; set; }

        /// <summary>
        /// ID do endereço de entrega escolhido pelo usuário.
        /// </summary>
        public Guid ShippingAddressId { get; set; }
        
        /// <summary>
        /// Telefone de contato para entrega (preenchido no checkout).
        /// </summary>
        [System.Text.Json.Serialization.JsonPropertyName("shippingPhone")]
        public string? ShippingPhone { get; set; }
    }
}
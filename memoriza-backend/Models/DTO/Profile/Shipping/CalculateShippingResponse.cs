using System.Collections.Generic;

namespace memoriza_backend.Models.DTO.User.Shipping
{
    /// <summary>
    /// Resposta do cálculo de frete para o usuário.
    /// </summary>
    public class CalculateShippingResponse
    {
        /// <summary>
        /// Lista de opções disponíveis de frete / retirada.
        /// </summary>
        public List<ShippingOptionDto> Options { get; set; } = new();
    }
}
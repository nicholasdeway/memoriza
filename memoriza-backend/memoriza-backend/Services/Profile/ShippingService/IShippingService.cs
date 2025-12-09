using memoriza_backend.Models.DTO.User.Shipping;

namespace memoriza_backend.Services.Profile.ShippingService
{
    public interface IShippingService
    {
        Task<CalculateShippingResponse?> CalculateShippingAsync(CalculateShippingRequest request);

        /// <summary>
        /// Valida os dados de frete durante o checkout.
        /// Recalcula o frete no servidor e compara com o valor enviado pelo cliente.
        /// </summary>
        Task<(bool IsValid, string? ErrorMessage, decimal ExpectedAmount)> ValidateShippingForCheckoutAsync(
            string cep,
            bool pickupInStore,
            string shippingCode,
            decimal shippingAmount,
            decimal cartSubtotal
        );
    }
}
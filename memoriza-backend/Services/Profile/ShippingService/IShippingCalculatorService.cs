using memoriza_backend.Models.DTO.User.Shipping;

namespace memoriza_backend.Services.Profile.ShippingService
{
    public interface IShippingCalculatorService
    {
        ShippingOptionDto? GetShippingByCep(string cep);
    }
}
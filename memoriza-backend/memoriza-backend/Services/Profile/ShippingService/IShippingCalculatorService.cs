using System.Threading.Tasks;
using memoriza_backend.Models.DTO.User.Shipping;

namespace memoriza_backend.Services.Profile.ShippingService
{
    public interface IShippingCalculatorService
    {
        Task<ShippingOptionDto?> GetShippingByCepAsync(string cep);
    }
}
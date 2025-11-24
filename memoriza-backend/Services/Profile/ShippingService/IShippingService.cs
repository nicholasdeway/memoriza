using memoriza_backend.Models.DTO.User.Shipping;         
using memoriza_backend.Helpers;

namespace memoriza_backend.Services.Profile.ShippingService
{
    public interface IShippingService
    {
        Task<ServiceResult<CalculateShippingResponse>> CalculateShippingAsync(
            string userId,
            CalculateShippingRequest request);
    }
}
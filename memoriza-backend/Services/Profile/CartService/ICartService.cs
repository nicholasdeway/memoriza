using memoriza_backend.Models.DTO.User.Cart;
using memoriza_backend.Helpers;

namespace memoriza_backend.Services.Profile.CartService
{
    public interface ICartService
    {
        Task<CartSummaryResponse> GetCartAsync(string userId);

        Task<ServiceResult<CartSummaryResponse>> AddItemAsync(string userId, AddCartItemRequest request);

        Task<ServiceResult<CartSummaryResponse>> UpdateItemQuantityAsync(
            string userId,
            UpdateCartItemQuantityRequest request);

        Task<ServiceResult<CartSummaryResponse>> RemoveItemAsync(
            string userId,
            RemoveCartItemRequest request);

        Task<ServiceResult<CartSummaryResponse>> ClearCartAsync(
            string userId,
            ClearCartRequest request);
    }
}
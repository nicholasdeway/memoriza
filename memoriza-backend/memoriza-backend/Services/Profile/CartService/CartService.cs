using memoriza_backend.Models.DTO.User.Cart;
using memoriza_backend.Repositories.Interfaces;
using memoriza_backend.Helpers;

namespace memoriza_backend.Services.Profile.CartService
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _cartRepository;

        public CartService(ICartRepository cartRepository)
        {
            _cartRepository = cartRepository;
        }

        public async Task<CartSummaryResponse> GetCartAsync(string userId)
        {
            var cart = await _cartRepository.GetCartAsync(userId);
            return cart;
        }

        public async Task<ServiceResult<CartSummaryResponse>> AddItemAsync(string userId, AddCartItemRequest request)
        {
            var result = await _cartRepository.AddItemAsync(userId, request);
            return ServiceResult<CartSummaryResponse>.Ok(result);
        }

        public async Task<ServiceResult<CartSummaryResponse>> UpdateItemQuantityAsync(
            string userId,
            UpdateCartItemQuantityRequest request)
        {
            var result = await _cartRepository.UpdateItemQuantityAsync(userId, request);
            return ServiceResult<CartSummaryResponse>.Ok(result);
        }

        public async Task<ServiceResult<CartSummaryResponse>> RemoveItemAsync(
            string userId,
            RemoveCartItemRequest request)
        {
            var result = await _cartRepository.RemoveItemAsync(userId, request);
            return ServiceResult<CartSummaryResponse>.Ok(result);
        }

        public async Task<ServiceResult<CartSummaryResponse>> ClearCartAsync(
            string userId,
            ClearCartRequest request)
        {
            var result = await _cartRepository.ClearCartAsync(userId, request);
            return ServiceResult<CartSummaryResponse>.Ok(result);
        }
    }
}
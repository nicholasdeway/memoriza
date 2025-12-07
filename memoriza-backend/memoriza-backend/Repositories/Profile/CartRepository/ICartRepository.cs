using System;
using memoriza_backend.Models.Entities;
using memoriza_backend.Models.DTO.User.Cart;

namespace memoriza_backend.Repositories.Interfaces
{
    public interface ICartRepository
    {
        // Métodos de baixo nível (Entities)
        Task<Cart?> GetActiveCartAsync(string userId);
        Task<Cart> CreateCartAsync(string userId);
        Task AddItemAsync(CartItem item);
        Task UpdateItemQuantityAsync(Guid cartItemId, int quantity);
        Task RemoveItemAsync(Guid cartItemId);
        Task ClearCartAsync(Guid cartId);

        // Métodos de alto nível (DTO-based)
        Task<CartSummaryResponse> GetCartAsync(string userId);
        Task<CartSummaryResponse> AddItemAsync(string userId, AddCartItemRequest request);
        Task<CartSummaryResponse> UpdateItemQuantityAsync(string userId, UpdateCartItemQuantityRequest request);
        Task<CartSummaryResponse> RemoveItemAsync(string userId, RemoveCartItemRequest request);
        Task<CartSummaryResponse> ClearCartAsync(string userId, ClearCartRequest request);
    }
}
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Dapper;
using memoriza_backend.Models.Entities;
using memoriza_backend.Models.DTO.User.Cart;
using memoriza_backend.Repositories.Interfaces;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace memoriza_backend.Repositories.Profile
{
    public class CartRepository : ICartRepository
    {
        private readonly string _connectionString;

        public CartRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        }

        // ======================================================
        // HELPERS / MÉTODOS DE ENTIDADE (baixo nível)
        // ======================================================

        public async Task<Cart?> GetActiveCartAsync(string userId)
        {
            // Garante que o userId é um GUID válido
            if (!Guid.TryParse(userId, out var userGuid))
                throw new ArgumentException("userId inválido para GUID.", nameof(userId));

            const string sqlCart = @"
                SELECT
                    id,
                    user_id::text AS ""UserId"",
                    is_active     AS ""IsActive"",
                    created_at    AS ""CreatedAt"",
                    updated_at    AS ""UpdatedAt""
                FROM carts
                WHERE user_id = @UserId
                  AND is_active = TRUE
                LIMIT 1;
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            var cart = await conn.QueryFirstOrDefaultAsync<Cart>(sqlCart, new { UserId = userGuid });

            if (cart == null)
                return null;

            const string sqlItems = @"
                SELECT
                    id            AS ""Id"",
                    cart_id       AS ""CartId"",
                    product_id    AS ""ProductId"",
                    product_name  AS ""ProductName"",
                    thumbnail_url AS ""ThumbnailUrl"",
                    quantity      AS ""Quantity"",
                    unit_price    AS ""UnitPrice"",
                    subtotal      AS ""Subtotal""
                FROM cart_items
                WHERE cart_id = @CartId;
            ";

            var items = await conn.QueryAsync<CartItem>(sqlItems, new { CartId = cart.Id });
            cart.Items = items.ToList();

            return cart;
        }

        public async Task<Cart> CreateCartAsync(string userId)
        {
            if (!Guid.TryParse(userId, out var userGuid))
                throw new ArgumentException("userId inválido para GUID.", nameof(userId));

            const string sql = @"
                INSERT INTO carts (
                    id,
                    user_id,
                    is_active,
                    created_at,
                    updated_at
                )
                VALUES (
                    @Id,
                    @UserId,
                    TRUE,
                    NOW(),
                    NOW()
                )
                RETURNING
                    id,
                    user_id::text AS ""UserId"",
                    is_active     AS ""IsActive"",
                    created_at    AS ""CreatedAt"",
                    updated_at    AS ""UpdatedAt"";
            ";

            var newCartId = Guid.NewGuid();

            await using var conn = new NpgsqlConnection(_connectionString);
            var cart = await conn.QueryFirstAsync<Cart>(sql, new
            {
                Id = newCartId,
                UserId = userGuid
            });

            cart.Items = new List<CartItem>();
            return cart;
        }

        public async Task AddItemAsync(CartItem item)
        {
            const string sql = @"
                INSERT INTO cart_items (
                    id,
                    cart_id,
                    product_id,
                    product_name,
                    thumbnail_url,
                    quantity,
                    unit_price,
                    subtotal
                )
                VALUES (
                    @Id,
                    @CartId,
                    @ProductId,
                    @ProductName,
                    @ThumbnailUrl,
                    @Quantity,
                    @UnitPrice,
                    @Subtotal
                );
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.ExecuteAsync(sql, item);
        }

        public async Task UpdateItemQuantityAsync(Guid cartItemId, int quantity)
        {
            const string sql = @"
                UPDATE cart_items
                SET quantity = @Quantity,
                    subtotal = unit_price * @Quantity
                WHERE id = @Id;
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.ExecuteAsync(sql, new { Id = cartItemId, Quantity = quantity });
        }

        public async Task RemoveItemAsync(Guid cartItemId)
        {
            const string sql = @"DELETE FROM cart_items WHERE id = @Id;";

            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.ExecuteAsync(sql, new { Id = cartItemId });
        }

        public async Task ClearCartAsync(Guid cartId)
        {
            const string sql = @"DELETE FROM cart_items WHERE cart_id = @CartId;";

            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.ExecuteAsync(sql, new { CartId = cartId });
        }

        // ======================================================
        // PRIVATE: buscar informações do produto
        // ======================================================

        private class ProductRow
        {
            public Guid Id { get; set; }
            public string Name { get; set; } = string.Empty;
            public string? ThumbnailUrl { get; set; }
            public decimal Price { get; set; }
        }

        private async Task<ProductRow?> GetProductInfoAsync(Guid productId)
        {
            // Ajuste os nomes de coluna/tabela conforme seu banco real
            const string sql = @"
                SELECT 
                    id,
                    name,
                    price
                FROM products
                WHERE id = @Id
                LIMIT 1;
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            return await conn.QueryFirstOrDefaultAsync<ProductRow>(sql, new { Id = productId });
        }

        // ======================================================
        // MÉTODOS DE ALTO NÍVEL (DTOs usados pelo CartService)
        // ======================================================

        public async Task<CartSummaryResponse> GetCartAsync(string userId)
        {
            var cart = await GetActiveCartAsync(userId);

            if (cart == null || cart.Items.Count == 0)
            {
                return new CartSummaryResponse
                {
                    Items = new List<CartItemDto>(),
                    Subtotal = 0m,
                    ShippingAmount = 0m
                };
            }

            var itemDtos = cart.Items.Select(i => new CartItemDto
            {
                CartItemId = i.Id,
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                ThumbnailUrl = i.ThumbnailUrl,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice
                // Subtotal é calculado pela própria propriedade do DTO
            }).ToList();

            var subtotal = itemDtos.Sum(i => i.Subtotal);

            // Por enquanto, ShippingAmount = 0 aqui.
            // Quando integrar cálculo de frete, você atualiza esse campo.
            var response = new CartSummaryResponse
            {
                Items = itemDtos,
                Subtotal = subtotal,
                ShippingAmount = 0m
            };

            return response;
        }

        public async Task<CartSummaryResponse> AddItemAsync(string userId, AddCartItemRequest request)
        {
            // Garante carrinho
            var cart = await GetActiveCartAsync(userId) ?? await CreateCartAsync(userId);

            // Busca informações do produto no banco
            var product = await GetProductInfoAsync(request.ProductId);
            if (product == null)
            {
                // Você pode tratar melhor (ex: exception customizada)
                throw new ApplicationException("Produto não encontrado.");
            }

            var item = new CartItem
            {
                Id = Guid.NewGuid(),
                CartId = cart.Id,
                ProductId = product.Id,
                ProductName = product.Name,
                ThumbnailUrl = product.ThumbnailUrl, // vai ser null por enquanto
                Quantity = request.Quantity,
                UnitPrice = product.Price,
                Subtotal = product.Price * request.Quantity
            };

            await AddItemAsync(item);

            // Retorna carrinho atualizado
            return await GetCartAsync(userId);
        }

        public async Task<CartSummaryResponse> UpdateItemQuantityAsync(
            string userId,
            UpdateCartItemQuantityRequest request)
        {
            await UpdateItemQuantityAsync(request.CartItemId, request.Quantity);
            return await GetCartAsync(userId);
        }

        public async Task<CartSummaryResponse> RemoveItemAsync(
            string userId,
            RemoveCartItemRequest request)
        {
            await RemoveItemAsync(request.CartItemId);
            return await GetCartAsync(userId);
        }

        public async Task<CartSummaryResponse> ClearCartAsync(
            string userId,
            ClearCartRequest request)
        {
            if (!request.Confirm)
            {
                // Se não confirmar, apenas retorna estado atual
                return await GetCartAsync(userId);
            }

            var cart = await GetActiveCartAsync(userId);
            if (cart != null)
            {
                await ClearCartAsync(cart.Id);
            }

            return await GetCartAsync(userId);
        }
    }
}
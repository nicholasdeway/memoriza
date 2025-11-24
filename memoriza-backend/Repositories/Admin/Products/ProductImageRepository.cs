using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using memoriza_backend.Models.Admin;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace memoriza_backend.Repositories.Admin.Products
{
    public class ProductImageRepository : IProductImageRepository
    {
        private readonly string _connectionString;

        public ProductImageRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        private NpgsqlConnection GetConnection() => new NpgsqlConnection(_connectionString);

        // ======================================================
        // GET BY PRODUCT ID
        // ======================================================
        public async Task<IReadOnlyList<ProductImage>> GetByProductIdAsync(Guid productId)
        {
            const string sql = @"
                SELECT 
                    id              AS ""Id"",
                    product_id      AS ""ProductId"",
                    url             AS ""Url"",
                    alt_text        AS ""AltText"",
                    is_primary      AS ""IsPrimary"",
                    display_order   AS ""DisplayOrder"",
                    created_at      AS ""CreatedAt""
                FROM product_images
                WHERE product_id = @ProductId
                ORDER BY is_primary DESC, display_order ASC, created_at ASC;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var images = await conn.QueryAsync<ProductImage>(sql, new { ProductId = productId });

            return images.AsList();
        }

        // ======================================================
        // GET BY MULTIPLE PRODUCT IDS (BATCH)
        // ======================================================
        public async Task<IReadOnlyList<ProductImage>> GetByProductIdsAsync(IEnumerable<Guid> productIds)
        {
            var ids = productIds?
                .Distinct()
                .ToArray() ?? Array.Empty<Guid>();

            if (ids.Length == 0)
                return Array.Empty<ProductImage>();

            const string sql = @"
                SELECT 
                    id              AS ""Id"",
                    product_id      AS ""ProductId"",
                    url             AS ""Url"",
                    alt_text        AS ""AltText"",
                    is_primary      AS ""IsPrimary"",
                    display_order   AS ""DisplayOrder"",
                    created_at      AS ""CreatedAt""
                FROM product_images
                WHERE product_id = ANY(@ProductIds)
                ORDER BY is_primary DESC, display_order ASC, created_at ASC;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var images = await conn.QueryAsync<ProductImage>(sql, new { ProductIds = ids });
            return images.AsList();
        }

        // ======================================================
        // GET BY ID
        // ======================================================
        public async Task<ProductImage?> GetByIdAsync(Guid id)
        {
            const string sql = @"
                SELECT 
                    id              AS ""Id"",
                    product_id      AS ""ProductId"",
                    url             AS ""Url"",
                    alt_text        AS ""AltText"",
                    is_primary      AS ""IsPrimary"",
                    display_order   AS ""DisplayOrder"",
                    created_at      AS ""CreatedAt""
                FROM product_images
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            return await conn.QuerySingleOrDefaultAsync<ProductImage>(sql, new { Id = id });
        }

        // ======================================================
        // CREATE
        // ======================================================
        public async Task<ProductImage> CreateAsync(ProductImage image)
        {
            const string sql = @"
                INSERT INTO product_images
                    (id, product_id, url, alt_text, is_primary, display_order, created_at)
                VALUES
                    (@Id, @ProductId, @Url, @AltText, @IsPrimary, @DisplayOrder, @CreatedAt);
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new
            {
                image.Id,
                image.ProductId,
                image.Url,
                AltText = (object?)image.AltText ?? DBNull.Value,
                image.IsPrimary,
                image.DisplayOrder,
                image.CreatedAt
            });

            return image;
        }

        // ======================================================
        // UPDATE
        // ======================================================
        public async Task UpdateAsync(ProductImage image)
        {
            const string sql = @"
                UPDATE product_images
                SET url           = @Url,
                    alt_text      = @AltText,
                    is_primary    = @IsPrimary,
                    display_order = @DisplayOrder
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new
            {
                image.Id,
                image.Url,
                AltText = (object?)image.AltText ?? DBNull.Value,
                image.IsPrimary,
                image.DisplayOrder
            });
        }

        // ======================================================
        // DELETE
        // ======================================================
        public async Task DeleteAsync(Guid id)
        {
            const string sql = @"DELETE FROM product_images WHERE id = @Id;";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new { Id = id });
        }

        // ======================================================
        // DELETE ALL BY PRODUCT ID
        // ======================================================
        public async Task DeleteAllByProductIdAsync(Guid productId)
        {
            const string sql = @"DELETE FROM product_images WHERE product_id = @ProductId;";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new { ProductId = productId });
        }
    }
}
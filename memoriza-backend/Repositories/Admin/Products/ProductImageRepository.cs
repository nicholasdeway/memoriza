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

        public async Task<IReadOnlyList<ProductImage>> GetByProductIdAsync(Guid productId)
        {
            var list = new List<ProductImage>();

            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"
                SELECT id, product_id, url, alt_text, is_primary, display_order, created_at
                FROM product_images
                WHERE product_id = @product_id
                ORDER BY is_primary DESC, display_order ASC, created_at ASC;";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("product_id", productId);

            await using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new ProductImage
                {
                    Id = reader.GetGuid(0),
                    ProductId = reader.GetGuid(1),
                    Url = reader.GetString(2),
                    AltText = reader.IsDBNull(3) ? null : reader.GetString(3),
                    IsPrimary = reader.GetBoolean(4),
                    DisplayOrder = reader.GetInt32(5),
                    CreatedAt = reader.GetDateTime(6)
                });
            }

            return list;
        }

        public async Task<ProductImage?> GetByIdAsync(Guid id)
        {
            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"
                SELECT id, product_id, url, alt_text, is_primary, display_order, created_at
                FROM product_images
                WHERE id = @id;";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("id", id);

            await using var reader = await cmd.ExecuteReaderAsync();
            if (!await reader.ReadAsync())
                return null;

            return new ProductImage
            {
                Id = reader.GetGuid(0),
                ProductId = reader.GetGuid(1),
                Url = reader.GetString(2),
                AltText = reader.IsDBNull(3) ? null : reader.GetString(3),
                IsPrimary = reader.GetBoolean(4),
                DisplayOrder = reader.GetInt32(5),
                CreatedAt = reader.GetDateTime(6)
            };
        }

        public async Task<ProductImage> CreateAsync(ProductImage image)
        {
            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"
                INSERT INTO product_images
                    (id, product_id, url, alt_text, is_primary, display_order, created_at)
                VALUES
                    (@id, @product_id, @url, @alt_text, @is_primary, @display_order, @created_at);";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("id", image.Id);
            cmd.Parameters.AddWithValue("product_id", image.ProductId);
            cmd.Parameters.AddWithValue("url", image.Url);
            cmd.Parameters.AddWithValue("alt_text", (object?)image.AltText ?? DBNull.Value);
            cmd.Parameters.AddWithValue("is_primary", image.IsPrimary);
            cmd.Parameters.AddWithValue("display_order", image.DisplayOrder);
            cmd.Parameters.AddWithValue("created_at", image.CreatedAt);

            await cmd.ExecuteNonQueryAsync();
            return image;
        }

        public async Task UpdateAsync(ProductImage image)
        {
            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"
                UPDATE product_images
                SET url = @url,
                    alt_text = @alt_text,
                    is_primary = @is_primary,
                    display_order = @display_order
                WHERE id = @id;";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("id", image.Id);
            cmd.Parameters.AddWithValue("url", image.Url);
            cmd.Parameters.AddWithValue("alt_text", (object?)image.AltText ?? DBNull.Value);
            cmd.Parameters.AddWithValue("is_primary", image.IsPrimary);
            cmd.Parameters.AddWithValue("display_order", image.DisplayOrder);

            await cmd.ExecuteNonQueryAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"DELETE FROM product_images WHERE id = @id;";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("id", id);

            await cmd.ExecuteNonQueryAsync();
        }

        public async Task DeleteAllByProductIdAsync(Guid productId)
        {
            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"DELETE FROM product_images WHERE product_id = @product_id;";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("product_id", productId);

            await cmd.ExecuteNonQueryAsync();
        }
    }
}
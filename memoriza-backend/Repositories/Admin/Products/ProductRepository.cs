using memoriza_backend.Models.Admin;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace memoriza_backend.Repositories.Admin.Products
{
    public class ProductRepository : IProductRepository
    {
        private readonly string _connectionString;

        public ProductRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        private NpgsqlConnection GetConnection() => new NpgsqlConnection(_connectionString);

        public async Task<IReadOnlyList<Product>> GetAllAsync()
        {
            var list = new List<Product>();

            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"
                SELECT id, category_id, name, description, price,
                       is_personalizable, is_active, created_at
                FROM products
                ORDER BY created_at DESC;";

            await using var cmd = new NpgsqlCommand(sql, conn);
            await using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new Product
                {
                    Id = reader.GetGuid(0),
                    CategoryId = reader.GetGuid(1),
                    Name = reader.GetString(2),
                    Description = reader.IsDBNull(3) ? null : reader.GetString(3),
                    Price = reader.GetDecimal(4),
                    IsPersonalizable = reader.GetBoolean(5),
                    IsActive = reader.GetBoolean(6),
                    CreatedAt = reader.GetDateTime(7)
                });
            }

            return list;
        }

        public async Task<Product?> GetByIdAsync(Guid id)
        {
            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"
                SELECT id, category_id, name, description, price,
                       is_personalizable, is_active, created_at
                FROM products
                WHERE id = @id;";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("id", id);

            await using var reader = await cmd.ExecuteReaderAsync();
            if (!await reader.ReadAsync())
                return null;

            return new Product
            {
                Id = reader.GetGuid(0),
                CategoryId = reader.GetGuid(1),
                Name = reader.GetString(2),
                Description = reader.IsDBNull(3) ? null : reader.GetString(3),
                Price = reader.GetDecimal(4),
                IsPersonalizable = reader.GetBoolean(5),
                IsActive = reader.GetBoolean(6),
                CreatedAt = reader.GetDateTime(7)
            };
        }

        public async Task<Product> CreateAsync(Product product)
        {
            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"
                INSERT INTO products
                    (id, category_id, name, description, price,
                     is_personalizable, is_active, created_at)
                VALUES
                    (@id, @category_id, @name, @description, @price,
                     @is_personalizable, @is_active, @created_at);";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("id", product.Id);
            cmd.Parameters.AddWithValue("category_id", product.CategoryId);
            cmd.Parameters.AddWithValue("name", product.Name);
            cmd.Parameters.AddWithValue("description", (object?)product.Description ?? DBNull.Value);
            cmd.Parameters.AddWithValue("price", product.Price);
            cmd.Parameters.AddWithValue("is_personalizable", product.IsPersonalizable);
            cmd.Parameters.AddWithValue("is_active", product.IsActive);
            cmd.Parameters.AddWithValue("created_at", product.CreatedAt);

            await cmd.ExecuteNonQueryAsync();
            return product;
        }

        public async Task UpdateAsync(Product product)
        {
            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"
                UPDATE products
                SET category_id = @category_id,
                    name = @name,
                    description = @description,
                    price = @price,
                    is_personalizable = @is_personalizable,
                    is_active = @is_active
                WHERE id = @id;";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("id", product.Id);
            cmd.Parameters.AddWithValue("category_id", product.CategoryId);
            cmd.Parameters.AddWithValue("name", product.Name);
            cmd.Parameters.AddWithValue("description", (object?)product.Description ?? DBNull.Value);
            cmd.Parameters.AddWithValue("price", product.Price);
            cmd.Parameters.AddWithValue("is_personalizable", product.IsPersonalizable);
            cmd.Parameters.AddWithValue("is_active", product.IsActive);

            await cmd.ExecuteNonQueryAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"UPDATE products SET is_active = FALSE WHERE id = @id;";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("id", id);

            await cmd.ExecuteNonQueryAsync();
        }
    }
}
using memoriza_backend.Models.Admin;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace memoriza_backend.Repositories.Admin.Categories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly string _connectionString;

        public CategoryRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        private NpgsqlConnection GetConnection() => new NpgsqlConnection(_connectionString);

        public async Task<IReadOnlyList<Category>> GetAllAsync()
        {
            var list = new List<Category>();

            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"
                SELECT id, name, description, is_active, created_at
                FROM categories
                ORDER BY created_at DESC;";

            await using var cmd = new NpgsqlCommand(sql, conn);
            await using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new Category
                {
                    Id = reader.GetGuid(0),
                    Name = reader.GetString(1),
                    Description = reader.IsDBNull(2) ? null : reader.GetString(2),
                    IsActive = reader.GetBoolean(3),
                    CreatedAt = reader.GetDateTime(4)
                });
            }

            return list;
        }

        public async Task<Category?> GetByIdAsync(Guid id)
        {
            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"
                SELECT id, name, description, is_active, created_at
                FROM categories
                WHERE id = @id;";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("id", id);

            await using var reader = await cmd.ExecuteReaderAsync();
            if (!await reader.ReadAsync())
                return null;

            return new Category
            {
                Id = reader.GetGuid(0),
                Name = reader.GetString(1),
                Description = reader.IsDBNull(2) ? null : reader.GetString(2),
                IsActive = reader.GetBoolean(3),
                CreatedAt = reader.GetDateTime(4)
            };
        }

        public async Task<Category> CreateAsync(Category category)
        {
            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"
                INSERT INTO categories (id, name, description, is_active, created_at)
                VALUES (@id, @name, @description, @is_active, @created_at);";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("id", category.Id);
            cmd.Parameters.AddWithValue("name", category.Name);
            cmd.Parameters.AddWithValue("description", (object?)category.Description ?? DBNull.Value);
            cmd.Parameters.AddWithValue("is_active", category.IsActive);
            cmd.Parameters.AddWithValue("created_at", category.CreatedAt);

            await cmd.ExecuteNonQueryAsync();
            return category;
        }

        public async Task UpdateAsync(Category category)
        {
            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"
                UPDATE categories
                SET name = @name,
                    description = @description,
                    is_active = @is_active
                WHERE id = @id;";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("id", category.Id);
            cmd.Parameters.AddWithValue("name", category.Name);
            cmd.Parameters.AddWithValue("description", (object?)category.Description ?? DBNull.Value);
            cmd.Parameters.AddWithValue("is_active", category.IsActive);

            await cmd.ExecuteNonQueryAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            // delete lógico
            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"UPDATE categories SET is_active = FALSE WHERE id = @id;";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("id", id);

            await cmd.ExecuteNonQueryAsync();
        }
    }
}
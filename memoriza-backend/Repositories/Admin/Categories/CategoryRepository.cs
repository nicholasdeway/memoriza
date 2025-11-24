using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
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

        // ======================================================
        // GET ALL
        // ======================================================
        public async Task<IReadOnlyList<Category>> GetAllAsync()
        {
            const string sql = @"
                SELECT 
                    id          AS ""Id"",
                    name        AS ""Name"",
                    description AS ""Description"",
                    is_active   AS ""IsActive"",
                    created_at  AS ""CreatedAt""
                FROM categories
                ORDER BY created_at DESC;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var list = await conn.QueryAsync<Category>(sql);
            return list.AsList();
        }

        // ======================================================
        // GET BY ID
        // ======================================================
        public async Task<Category?> GetByIdAsync(Guid id)
        {
            const string sql = @"
                SELECT 
                    id          AS ""Id"",
                    name        AS ""Name"",
                    description AS ""Description"",
                    is_active   AS ""IsActive"",
                    created_at  AS ""CreatedAt""
                FROM categories
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var category = await conn.QuerySingleOrDefaultAsync<Category>(sql, new { Id = id });
            return category;
        }

        // ======================================================
        // CREATE
        // ======================================================
        public async Task<Category> CreateAsync(Category category)
        {
            const string sql = @"
                INSERT INTO categories (id, name, description, is_active, created_at)
                VALUES (@Id, @Name, @Description, @IsActive, @CreatedAt);
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new
            {
                category.Id,
                category.Name,
                Description = (object?)category.Description ?? DBNull.Value,
                category.IsActive,
                category.CreatedAt
            });

            return category;
        }

        // ======================================================
        // UPDATE
        // ======================================================
        public async Task UpdateAsync(Category category)
        {
            const string sql = @"
                UPDATE categories
                SET name        = @Name,
                    description = @Description,
                    is_active   = @IsActive
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new
            {
                category.Id,
                category.Name,
                Description = (object?)category.Description ?? DBNull.Value,
                category.IsActive
            });
        }

        // ======================================================
        // SOFT DELETE (is_active = FALSE)
        // ======================================================
        public async Task DeleteAsync(Guid id)
        {
            const string sql = @"UPDATE categories SET is_active = FALSE WHERE id = @Id;";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new { Id = id });
        }
    }
}
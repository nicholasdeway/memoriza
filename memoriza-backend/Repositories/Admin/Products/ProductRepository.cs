using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
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

        // ======================================================
        // GET ALL
        // ======================================================
        public async Task<IReadOnlyList<Product>> GetAllAsync()
        {
            const string sql = @"
                SELECT 
                    id                  AS ""Id"",
                    category_id         AS ""CategoryId"",
                    name                AS ""Name"",
                    description         AS ""Description"",
                    price               AS ""Price"",
                    is_personalizable   AS ""IsPersonalizable"",
                    is_active           AS ""IsActive"",
                    created_at          AS ""CreatedAt""
                FROM products
                ORDER BY created_at DESC;
            ";

            await using var conn = GetConnection();
            // Dapper abre a conexão automaticamente se ela estiver fechada,
            // mas não tem problema manter o OpenAsync se você preferir:
            await conn.OpenAsync();

            var list = await conn.QueryAsync<Product>(sql);
            return list.AsList();
        }

        // ======================================================
        // GET BY ID
        // ======================================================
        public async Task<Product?> GetByIdAsync(Guid id)
        {
            const string sql = @"
                SELECT 
                    id                  AS ""Id"",
                    category_id         AS ""CategoryId"",
                    name                AS ""Name"",
                    description         AS ""Description"",
                    price               AS ""Price"",
                    is_personalizable   AS ""IsPersonalizable"",
                    is_active           AS ""IsActive"",
                    created_at          AS ""CreatedAt""
                FROM products
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var product = await conn.QuerySingleOrDefaultAsync<Product>(sql, new { Id = id });
            return product;
        }

        // ======================================================
        // CREATE
        // ======================================================
        public async Task<Product> CreateAsync(Product product)
        {
            const string sql = @"
                INSERT INTO products (
                    id,
                    category_id,
                    name,
                    description,
                    price,
                    is_personalizable,
                    is_active,
                    created_at
                )
                VALUES (
                    @Id,
                    @CategoryId,
                    @Name,
                    @Description,
                    @Price,
                    @IsPersonalizable,
                    @IsActive,
                    @CreatedAt
                );
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new
            {
                product.Id,
                product.CategoryId,
                product.Name,
                Description = (object?)product.Description ?? DBNull.Value,
                product.Price,
                product.IsPersonalizable,
                product.IsActive,
                product.CreatedAt
            });

            // Mesmo comportamento anterior: apenas retorna o objeto passado
            return product;
        }

        // ======================================================
        // UPDATE
        // ======================================================
        public async Task UpdateAsync(Product product)
        {
            const string sql = @"
                UPDATE products
                SET category_id       = @CategoryId,
                    name              = @Name,
                    description       = @Description,
                    price             = @Price,
                    is_personalizable = @IsPersonalizable,
                    is_active         = @IsActive
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new
            {
                product.Id,
                product.CategoryId,
                product.Name,
                Description = (object?)product.Description ?? DBNull.Value,
                product.Price,
                product.IsPersonalizable,
                product.IsActive
            });
        }

        // ======================================================
        // SOFT DELETE (is_active = FALSE)
        // ======================================================
        public async Task DeleteAsync(Guid id)
        {
            const string sql = @"
                UPDATE products
                SET is_active = FALSE
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new { Id = id });
        }
    }
}
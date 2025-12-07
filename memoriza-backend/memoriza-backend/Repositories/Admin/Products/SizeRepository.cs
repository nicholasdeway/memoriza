using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using memoriza_backend.Models.Admin;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace memoriza_backend.Repositories.Admin.Sizes
{
    public class SizeRepository : ISizeRepository
    {
        private readonly string _connectionString;

        public SizeRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        private NpgsqlConnection GetConnection() => new NpgsqlConnection(_connectionString);

        // ======================================================
        // GET ALL
        // ======================================================
        public async Task<IReadOnlyList<Size>> GetAllAsync()
        {
            const string sql = @"
                SELECT
                    id          AS ""Id"",
                    name        AS ""Name"",
                    is_active   AS ""IsActive"",
                    created_at  AS ""CreatedAt""
                FROM sizes
                ORDER BY created_at DESC;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var list = await conn.QueryAsync<Size>(sql);
            return list.AsList();
        }

        // ======================================================
        // GET BY ID
        // ======================================================
        public async Task<Size?> GetByIdAsync(int id)
        {
            const string sql = @"
                SELECT
                    id          AS ""Id"",
                    name        AS ""Name"",
                    is_active   AS ""IsActive"",
                    created_at  AS ""CreatedAt""
                FROM sizes
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            return await conn.QuerySingleOrDefaultAsync<Size>(sql, new { Id = id });
        }

        // ======================================================
        // CREATE
        // ======================================================
        public async Task<int> CreateAsync(Size size)
        {
            const string sql = @"
                INSERT INTO sizes (name, is_active, created_at)
                VALUES (@Name, @IsActive, @CreatedAt)
                RETURNING id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var id = await conn.ExecuteScalarAsync<int>(sql, new
            {
                size.Name,
                size.IsActive,
                size.CreatedAt
            });

            size.Id = id;
            return id;
        }

        // ======================================================
        // UPDATE
        // ======================================================
        public async Task UpdateAsync(Size size)
        {
            const string sql = @"
                UPDATE sizes
                SET name      = @Name,
                    is_active = @IsActive
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new
            {
                size.Id,
                size.Name,
                size.IsActive
            });
        }

        // ======================================================
        // DELETE (regra: 1º clique inativa, 2º clique deleta se não tiver vínculo)
        // ======================================================
        public async Task DeleteAsync(int id)
        {
            const string sqlGetSize = @"
                SELECT
                    id          AS ""Id"",
                    name        AS ""Name"",
                    is_active   AS ""IsActive"",
                    created_at  AS ""CreatedAt""
                FROM sizes
                WHERE id = @Id;
            ";

            const string sqlCountProducts = @"
                SELECT COUNT(*)
                FROM product_sizes
                WHERE size_id = @SizeId;
            ";

            const string sqlSoftDelete = @"
                UPDATE sizes
                SET is_active = FALSE
                WHERE id = @Id;
            ";

            const string sqlHardDelete = @"
                DELETE FROM sizes
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            // 1) Busca o tamanho
            var size = await conn.QuerySingleOrDefaultAsync<Size>(sqlGetSize, new { Id = id });
            if (size == null)
            {
                // não existe → idempotente
                return;
            }

            // 2) Conta vínculos em product_sizes
            var count = await conn.ExecuteScalarAsync<int>(sqlCountProducts, new { SizeId = id });

            // 3) Primeiro clique → ainda ativo → sempre só inativa
            if (size.IsActive)
            {
                await conn.ExecuteAsync(sqlSoftDelete, new { Id = id });
                return;
            }

            // 4) Segundo clique → já está inativo
            if (count > 0)
            {
                // Tem produtos usando esse tamanho:
                // mantém inativo e NÃO faz hard delete (sem erro)
                return;
            }

            // 5) Já inativo + sem vínculos → hard delete
            await conn.ExecuteAsync(sqlHardDelete, new { Id = id });
        }

        // ======================================================
        // EXISTS BY NAME
        // ======================================================
        public async Task<bool> ExistsByNameAsync(string name)
        {
            const string sql = @"
                SELECT 1
                FROM sizes
                WHERE LOWER(name) = LOWER(@Name)
                LIMIT 1;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var result = await conn.ExecuteScalarAsync<int?>(sql, new { Name = name });
            return result.HasValue;
        }
    }
}
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using memoriza_backend.Models.Admin;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace memoriza_backend.Repositories.Admin.Colors
{
    public class ColorRepository : IColorRepository
    {
        private readonly string _connectionString;

        public ColorRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        private NpgsqlConnection GetConnection() => new NpgsqlConnection(_connectionString);

        // ======================================================
        // GET ALL
        // ======================================================
        public async Task<IReadOnlyList<Color>> GetAllAsync()
        {
            const string sql = @"
                SELECT
                    id          AS ""Id"",
                    name        AS ""Name"",
                    hex_code    AS ""HexCode"",
                    is_active   AS ""IsActive"",
                    created_at  AS ""CreatedAt""
                FROM colors
                ORDER BY created_at DESC;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var list = await conn.QueryAsync<Color>(sql);
            return list.AsList();
        }

        // ======================================================
        // GET BY ID
        // ======================================================
        public async Task<Color?> GetByIdAsync(int id)
        {
            const string sql = @"
                SELECT
                    id          AS ""Id"",
                    name        AS ""Name"",
                    hex_code    AS ""HexCode"",
                    is_active   AS ""IsActive"",
                    created_at  AS ""CreatedAt""
                FROM colors
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            return await conn.QuerySingleOrDefaultAsync<Color>(sql, new { Id = id });
        }

        // ======================================================
        // CREATE
        // ======================================================
        public async Task<int> CreateAsync(Color color)
        {
            const string sql = @"
                INSERT INTO colors (name, hex_code, is_active, created_at)
                VALUES (@Name, @HexCode, @IsActive, @CreatedAt)
                RETURNING id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var id = await conn.ExecuteScalarAsync<int>(sql, new
            {
                color.Name,
                color.HexCode,
                color.IsActive,
                color.CreatedAt
            });

            color.Id = id;
            return id;
        }

        // ======================================================
        // UPDATE
        // ======================================================
        public async Task UpdateAsync(Color color)
        {
            const string sql = @"
                UPDATE colors
                SET name      = @Name,
                    hex_code  = @HexCode,
                    is_active = @IsActive
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new
            {
                color.Id,
                color.Name,
                color.HexCode,
                color.IsActive
            });
        }

        // ======================================================
        // DELETE (1º clique: inativa, 2º clique: hard delete se sem vínculo)
        // ======================================================
        public async Task DeleteAsync(int id)
        {
            const string sqlGetColor = @"
                SELECT
                    id          AS ""Id"",
                    name        AS ""Name"",
                    hex_code    AS ""HexCode"",
                    is_active   AS ""IsActive"",
                    created_at  AS ""CreatedAt""
                FROM colors
                WHERE id = @Id;
            ";

            // Ajuste o nome da tabela se necessário (product_colors deve existir)
            const string sqlCountProducts = @"
                SELECT COUNT(*)
                FROM product_colors
                WHERE color_id = @ColorId;
            ";

            const string sqlSoftDelete = @"
                UPDATE colors
                SET is_active = FALSE
                WHERE id = @Id;
            ";

            const string sqlHardDelete = @"
                DELETE FROM colors
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            // 1) Busca a cor
            var color = await conn.QuerySingleOrDefaultAsync<Color>(sqlGetColor, new { Id = id });
            if (color == null)
            {
                // não existe → idempotente
                return;
            }

            // 2) Conta vínculos em product_colors
            var count = await conn.ExecuteScalarAsync<int>(sqlCountProducts, new { ColorId = id });

            // 3) Primeiro clique → ainda ativa → apenas inativa
            if (color.IsActive)
            {
                await conn.ExecuteAsync(sqlSoftDelete, new { Id = id });
                return;
            }

            // 4) Segundo clique → já está inativa
            if (count > 0)
            {
                // Ainda tem produtos usando essa cor:
                // mantém inativa e NÃO faz hard delete
                return;
            }

            // 5) Já inativa + sem vínculos → hard delete
            await conn.ExecuteAsync(sqlHardDelete, new { Id = id });
        }

        // ======================================================
        // EXISTS BY NAME
        // ======================================================
        public async Task<bool> ExistsByNameAsync(string name)
        {
            const string sql = @"
                SELECT 1
                FROM colors
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
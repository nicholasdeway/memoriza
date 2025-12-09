using System;
using System.Threading.Tasks;
using Dapper;
using memoriza_backend.Models.Entities;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace memoriza_backend.Repositories.Shipping
{
    public class ShippingRepository : IShippingRepository
    {
        private readonly string _connectionString;

        public ShippingRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        }

        public async Task<ShippingRegion?> GetRegionByCodeAsync(string code)
        {
            const string sql = @"
                SELECT
                    id,
                    code,
                    name,
                    price,
                    estimated_days           AS ""EstimatedDays"",
                    is_pickup_option         AS ""IsPickupOption"",
                    free_shipping_threshold  AS ""FreeShippingThreshold"",
                    is_active                AS ""IsActive""
                FROM shipping_regions
                WHERE code = @Code
                LIMIT 1;
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            return await conn.QueryFirstOrDefaultAsync<ShippingRegion>(sql, new { Code = code });
        }

        public async Task<StoreShippingSettings?> GetStoreSettingsAsync()
        {
            const string sql = @"
                SELECT
                    id,
                    free_shipping_enabled   AS ""FreeShippingEnabled"",
                    free_shipping_threshold AS ""FreeShippingThreshold""
                FROM store_shipping_settings
                ORDER BY id
                LIMIT 1;
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            return await conn.QueryFirstOrDefaultAsync<StoreShippingSettings>(sql);
        }

        public async Task<StoreShippingSettings> UpsertStoreSettingsAsync(StoreShippingSettings settings)
        {
            if (settings.Id == Guid.Empty)
            {
                settings.Id = Guid.NewGuid();

                const string insertSql = @"
                    INSERT INTO store_shipping_settings (
                        id,
                        free_shipping_enabled,
                        free_shipping_threshold
                    )
                    VALUES (
                        @Id,
                        @FreeShippingEnabled,
                        @FreeShippingThreshold
                    );
                ";

                await using var conn = new NpgsqlConnection(_connectionString);
                await conn.ExecuteAsync(insertSql, settings);
                return settings;
            }
            else
            {
                const string updateSql = @"
                    UPDATE store_shipping_settings
                    SET 
                        free_shipping_enabled   = @FreeShippingEnabled,
                        free_shipping_threshold = @FreeShippingThreshold
                    WHERE id = @Id;
                ";

                await using var conn = new NpgsqlConnection(_connectionString);
                await conn.ExecuteAsync(updateSql, settings);
                return settings;
            }
        }

        // ===== Admin Methods =====

        public async Task<List<ShippingRegion>> GetAllRegionsAsync()
        {
            const string sql = @"
                SELECT
                    id,
                    code,
                    name,
                    price,
                    estimated_days           AS ""EstimatedDays"",
                    is_pickup_option         AS ""IsPickupOption"",
                    free_shipping_threshold  AS ""FreeShippingThreshold"",
                    is_active                AS ""IsActive""
                FROM shipping_regions
                ORDER BY 
                    CASE code
                        WHEN 'SUDESTE' THEN 1
                        WHEN 'SUL' THEN 2
                        WHEN 'CENTRO_OESTE' THEN 3
                        WHEN 'NORDESTE' THEN 4
                        WHEN 'NORTE' THEN 5
                        ELSE 6
                    END;
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            var regions = await conn.QueryAsync<ShippingRegion>(sql);
            return regions.ToList();
        }

        public async Task<ShippingRegion?> GetRegionByIdAsync(Guid id)
        {
            const string sql = @"
                SELECT
                    id,
                    code,
                    name,
                    price,
                    estimated_days           AS ""EstimatedDays"",
                    is_pickup_option         AS ""IsPickupOption"",
                    free_shipping_threshold  AS ""FreeShippingThreshold"",
                    is_active                AS ""IsActive""
                FROM shipping_regions
                WHERE id = @Id
                LIMIT 1;
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            return await conn.QueryFirstOrDefaultAsync<ShippingRegion>(sql, new { Id = id });
        }

        public async Task<ShippingRegion> UpdateRegionAsync(ShippingRegion region)
        {
            const string sql = @"
                UPDATE shipping_regions
                SET
                    price                    = @Price,
                    estimated_days           = @EstimatedDays,
                    free_shipping_threshold  = @FreeShippingThreshold
                WHERE id = @Id;
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.ExecuteAsync(sql, region);
            return region;
        }
    }
}
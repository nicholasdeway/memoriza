using memoriza_backend.Models.Entities;
using memoriza_backend.Repositories.Interfaces;
using Npgsql;
using Dapper;

namespace memoriza_backend.Repositories.Profile
{
    public class ShippingRepository : IShippingRepository
    {
        private readonly string _connectionString;

        public ShippingRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        }

        public async Task<ShippingRegion?> GetByCodeAsync(string code)
        {
            const string sql = @"SELECT * FROM shipping_regions WHERE code = @Code AND is_active = TRUE";

            await using var conn = new NpgsqlConnection(_connectionString);
            return await conn.QueryFirstOrDefaultAsync<ShippingRegion>(sql, new { Code = code });
        }

        public async Task<List<ShippingRegion>> GetAllActiveAsync()
        {
            const string sql = @"SELECT * FROM shipping_regions WHERE is_active = TRUE";

            await using var conn = new NpgsqlConnection(_connectionString);
            var result = await conn.QueryAsync<ShippingRegion>(sql);
            return result.ToList();
        }
    }
}
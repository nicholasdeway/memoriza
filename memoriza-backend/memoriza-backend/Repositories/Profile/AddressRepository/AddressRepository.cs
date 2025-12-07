using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using memoriza_backend.Models.Entities;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace memoriza_backend.Repositories.Profile.AddressRepository
{
    public class AddressRepository : IAddressRepository
    {
        private readonly string _connectionString;

        public AddressRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        }

        public async Task<Address?> GetByIdAsync(Guid id)
        {
            const string sql = @"
                SELECT
                    id AS ""Id"",
                    user_id AS ""UserId"",
                    label AS ""Label"",
                    street AS ""Street"",
                    number AS ""Number"",
                    complement AS ""Complement"",
                    neighborhood AS ""Neighborhood"",
                    city AS ""City"",
                    state AS ""State"",
                    zip_code AS ""ZipCode"",
                    country AS ""Country"",
                    is_default AS ""IsDefault"",
                    created_at AS ""CreatedAt""
                FROM addresses
                WHERE id = @Id;
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            return await conn.QueryFirstOrDefaultAsync<Address>(sql, new { Id = id });
        }

        public async Task<List<Address>> GetUserAddressesAsync(string userId)
        {
            const string sql = @"
                SELECT
                    id AS ""Id"",
                    user_id AS ""UserId"",
                    label AS ""Label"",
                    street AS ""Street"",
                    number AS ""Number"",
                    complement AS ""Complement"",
                    neighborhood AS ""Neighborhood"",
                    city AS ""City"",
                    state AS ""State"",
                    zip_code AS ""ZipCode"",
                    country AS ""Country"",
                    is_default AS ""IsDefault"",
                    created_at AS ""CreatedAt""
                FROM addresses
                WHERE user_id = @UserId
                ORDER BY is_default DESC, created_at DESC;
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            var addresses = await conn.QueryAsync<Address>(sql, new { UserId = userId });
            return addresses.ToList();
        }

        public async Task<Address?> GetDefaultAddressAsync(string userId)
        {
            const string sql = @"
                SELECT
                    id AS ""Id"",
                    user_id AS ""UserId"",
                    label AS ""Label"",
                    street AS ""Street"",
                    number AS ""Number"",
                    complement AS ""Complement"",
                    neighborhood AS ""Neighborhood"",
                    city AS ""City"",
                    state AS ""State"",
                    zip_code AS ""ZipCode"",
                    country AS ""Country"",
                    is_default AS ""IsDefault"",
                    created_at AS ""CreatedAt""
                FROM addresses
                WHERE user_id = @UserId
                  AND is_default = TRUE
                LIMIT 1;
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            return await conn.QueryFirstOrDefaultAsync<Address>(sql, new { UserId = userId });
        }

        public async Task<Address> CreateAsync(Address address)
        {
            const string sql = @"
                INSERT INTO addresses (
                    id,
                    user_id,
                    label,
                    street,
                    number,
                    complement,
                    neighborhood,
                    city,
                    state,
                    zip_code,
                    country,
                    is_default,
                    created_at
                )
                VALUES (
                    @Id,
                    @UserId,
                    @Label,
                    @Street,
                    @Number,
                    @Complement,
                    @Neighborhood,
                    @City,
                    @State,
                    @ZipCode,
                    @Country,
                    @IsDefault,
                    NOW()
                )
                RETURNING
                    id AS ""Id"",
                    user_id AS ""UserId"",
                    label AS ""Label"",
                    street AS ""Street"",
                    number AS ""Number"",
                    complement AS ""Complement"",
                    neighborhood AS ""Neighborhood"",
                    city AS ""City"",
                    state AS ""State"",
                    zip_code AS ""ZipCode"",
                    country AS ""Country"",
                    is_default AS ""IsDefault"",
                    created_at AS ""CreatedAt"";
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            return await conn.QueryFirstAsync<Address>(sql, address);
        }

        public async Task<bool> UpdateAsync(Address address)
        {
            const string sql = @"
                UPDATE addresses
                SET
                    label = @Label,
                    street = @Street,
                    number = @Number,
                    complement = @Complement,
                    neighborhood = @Neighborhood,
                    city = @City,
                    state = @State,
                    zip_code = @ZipCode,
                    country = @Country,
                    is_default = @IsDefault
                WHERE id = @Id;
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            var rowsAffected = await conn.ExecuteAsync(sql, address);
            return rowsAffected > 0;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            const string sql = @"DELETE FROM addresses WHERE id = @Id;";

            await using var conn = new NpgsqlConnection(_connectionString);
            var rowsAffected = await conn.ExecuteAsync(sql, new { Id = id });
            return rowsAffected > 0;
        }

        public async Task<bool> SetDefaultAddressAsync(string userId, Guid addressId)
        {
            const string sql = @"
                -- Remove default de todos os endereços do usuário
                UPDATE addresses
                SET is_default = FALSE
                WHERE user_id = @UserId;

                -- Define o endereço especificado como default
                UPDATE addresses
                SET is_default = TRUE
                WHERE id = @AddressId AND user_id = @UserId;
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.ExecuteAsync(sql, new { UserId = userId, AddressId = addressId });
            return true;
        }
    }
}

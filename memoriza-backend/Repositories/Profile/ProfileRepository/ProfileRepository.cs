using memoriza_backend.Models.Authentication;
using memoriza_backend.Repositories.Interfaces;
using Microsoft.Extensions.Configuration;
using Npgsql;
using Dapper;

namespace memoriza_backend.Repositories.Profile
{
    public class ProfileRepository : IProfileRepository
    {
        private readonly string _connectionString;

        public ProfileRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        }

        public async Task<User?> GetByIdAsync(Guid userId)
        {
            const string sql = @"
                SELECT
                    id,
                    first_name            AS ""FirstName"",
                    last_name             AS ""LastName"",
                    email,
                    password,
                    password_reset_pending AS ""PasswordResetPending"",
                    phone,
                    user_group_id         AS ""UserGroupId"",
                    auth_provider         AS ""AuthProvider"",
                    provider_user_id      AS ""ProviderUserId"",
                    provider_email        AS ""ProviderEmail"",
                    picture_url           AS ""PictureUrl"",
                    created_at            AS ""CreatedAt"",
                    updated_at            AS ""UpdatedAt""
                FROM users
                WHERE id = @Id;
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            return await conn.QueryFirstOrDefaultAsync<User>(sql, new { Id = userId });
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            const string sql = @"
                SELECT
                    id,
                    first_name            AS ""FirstName"",
                    last_name             AS ""LastName"",
                    email,
                    password,
                    password_reset_pending AS ""PasswordResetPending"",
                    phone,
                    user_group_id         AS ""UserGroupId"",
                    auth_provider         AS ""AuthProvider"",
                    provider_user_id      AS ""ProviderUserId"",
                    provider_email        AS ""ProviderEmail"",
                    picture_url           AS ""PictureUrl"",
                    created_at            AS ""CreatedAt"",
                    updated_at            AS ""UpdatedAt""
                FROM users
                WHERE email = @Email;
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            return await conn.QueryFirstOrDefaultAsync<User>(sql, new { Email = email });
        }

        public async Task UpdateAsync(User user)
        {
            const string sql = @"
                UPDATE users SET
                    first_name      = @FirstName,
                    last_name       = @LastName,
                    email           = @Email,
                    password        = @Password,
                    phone           = @Phone,
                    user_group_id   = @UserGroupId,
                    auth_provider   = @AuthProvider,
                    provider_user_id = @ProviderUserId,
                    provider_email  = @ProviderEmail,
                    picture_url     = @PictureUrl,
                    updated_at      = NOW()
                WHERE id = @Id;
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.ExecuteAsync(sql, user);
        }

        public async Task SoftDeleteAsync(Guid userId)
        {
            const string sql = @"UPDATE users SET is_active = FALSE WHERE id = @Id";

            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.ExecuteAsync(sql, new { Id = userId });
        }
    }
}
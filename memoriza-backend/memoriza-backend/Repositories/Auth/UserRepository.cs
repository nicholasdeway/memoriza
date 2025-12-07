using System;
using System.Threading.Tasks;
using Dapper;
using memoriza_backend.Models.Authentication;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace memoriza_backend.Repositories.Auth
{
    public class UserRepository : IUserRepository
    {
        private readonly string _connectionString;

        public UserRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new ApplicationException("Connection string 'DefaultConnection' não configurada.");
        }

        // ======================================================
        // GET BY EMAIL (AGORA: ativos e inativos)
        // ======================================================
        public async Task<User?> GetByEmailAsync(string email)
        {
            const string sql = @"
                SELECT
                    id                      AS ""Id"",
                    first_name              AS ""FirstName"",
                    last_name               AS ""LastName"",
                    email                   AS ""Email"",
                    password                AS ""Password"",
                    password_reset_pending  AS ""PasswordResetPending"",
                    phone                   AS ""Phone"",
                    created_at              AS ""CreatedAt"",
                    updated_at              AS ""UpdatedAt"",
                    auth_provider           AS ""AuthProvider"",
                    provider_user_id        AS ""ProviderUserId"",
                    provider_email          AS ""ProviderEmail"",
                    picture_url             AS ""PictureUrl"",
                    user_group_id           AS ""UserGroupId"",
                    employee_group_id       AS ""EmployeeGroupId"",
                    last_login_at           AS ""LastLoginAt"",
                    is_active               AS ""IsActive""
                FROM users
                WHERE email = @Email;
            ";

            await using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QuerySingleOrDefaultAsync<User>(sql, new { Email = email });
        }

        // ======================================================
        // GET BY PHONE (somente ativos)
        // ======================================================
        public async Task<User?> GetByPhoneAsync(string phone)
        {
            const string sql = @"
                SELECT
                    id                      AS ""Id"",
                    first_name              AS ""FirstName"",
                    last_name               AS ""LastName"",
                    email                   AS ""Email"",
                    password                AS ""Password"",
                    password_reset_pending  AS ""PasswordResetPending"",
                    phone                   AS ""Phone"",
                    created_at              AS ""CreatedAt"",
                    updated_at              AS ""UpdatedAt"",
                    auth_provider           AS ""AuthProvider"",
                    provider_user_id        AS ""ProviderUserId"",
                    provider_email          AS ""ProviderEmail"",
                    picture_url             AS ""PictureUrl"",
                    user_group_id           AS ""UserGroupId"",
                    employee_group_id       AS ""EmployeeGroupId"",
                    last_login_at           AS ""LastLoginAt"",
                    is_active               AS ""IsActive""
                FROM users
                WHERE phone = @Phone
                  AND is_active = TRUE
                ORDER BY created_at DESC
                LIMIT 1;
            ";

            await using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QuerySingleOrDefaultAsync<User>(sql, new { Phone = phone });
        }

        // ======================================================
        // CREATE USER
        // ======================================================
        public async Task<User> CreateAsync(User user)
        {
            const string sql = @"
                INSERT INTO users (
                    first_name,
                    last_name,
                    email,
                    password,
                    phone,
                    auth_provider,
                    provider_user_id,
                    provider_email,
                    picture_url,
                    user_group_id,
                    employee_group_id,
                    password_reset_pending,
                    created_at,
                    last_login_at,
                    is_active
                )
                VALUES (
                    @FirstName,
                    @LastName,
                    @Email,
                    @Password,
                    @Phone,
                    @AuthProvider,
                    @ProviderUserId,
                    @ProviderEmail,
                    @PictureUrl,
                    @UserGroupId,
                    @EmployeeGroupId,
                    @PasswordResetPending,
                    now(),
                    @LastLoginAt,
                    TRUE
                )
                RETURNING
                    id          AS ""Id"",
                    created_at  AS ""CreatedAt"",
                    updated_at  AS ""UpdatedAt"";
            ";

            await using var connection = new NpgsqlConnection(_connectionString);

            var result = await connection.QuerySingleAsync<User>(sql, new
            {
                user.FirstName,
                user.LastName,
                user.Email,
                user.Password,
                user.Phone,
                user.AuthProvider,
                user.ProviderUserId,
                user.ProviderEmail,
                user.PictureUrl,
                user.UserGroupId,
                user.EmployeeGroupId,
                user.PasswordResetPending,
                user.LastLoginAt
            });

            user.Id = result.Id;
            user.CreatedAt = result.CreatedAt;
            user.UpdatedAt = result.UpdatedAt;
            user.IsActive = true;

            return user;
        }

        // ======================================================
        // UPDATE PASSWORD
        // ======================================================
        public async Task UpdatePasswordAsync(User user)
        {
            const string sql = @"
                UPDATE users
                SET password = @Password,
                    password_reset_pending = @PasswordResetPending,
                    updated_at = now()
                WHERE id = @Id;
            ";

            await using var connection = new NpgsqlConnection(_connectionString);

            await connection.ExecuteAsync(sql, new
            {
                user.Password,
                user.PasswordResetPending,
                user.Id
            });
        }

        // ======================================================
        // MARK RESET TOKEN AS PENDING
        // ======================================================
        public async Task MarkResetPendingAsync(Guid id)
        {
            const string sql = @"
                UPDATE users
                SET password_reset_pending = true,
                    updated_at = now()
                WHERE id = @Id;
            ";

            await using var connection = new NpgsqlConnection(_connectionString);

            await connection.ExecuteAsync(sql, new { Id = id });
        }

        // ======================================================
        // UPDATE USER (GOOGLE / DADOS GERAIS / LOGIN LOCAL / REATIVAÇÃO)
        // ======================================================
        public async Task<User> UpdateAsync(User user)
        {
            const string sql = @"
                UPDATE users
                SET 
                    first_name              = @FirstName,
                    last_name               = @LastName,
                    email                   = @Email,
                    password                = @Password,
                    phone                   = @Phone,
                    picture_url             = @PictureUrl,
                    auth_provider           = @AuthProvider,
                    provider_user_id        = @ProviderUserId,
                    provider_email          = @ProviderEmail,
                    user_group_id           = @UserGroupId,
                    employee_group_id       = @EmployeeGroupId,
                    last_login_at           = @LastLoginAt,
                    password_reset_pending  = @PasswordResetPending,
                    is_active               = @IsActive,
                    updated_at              = now()
                WHERE id = @Id;
            ";

            await using var connection = new NpgsqlConnection(_connectionString);

            await connection.ExecuteAsync(sql, new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                user.Password,
                user.Phone,
                user.PictureUrl,
                user.AuthProvider,
                user.ProviderUserId,
                user.ProviderEmail,
                user.UserGroupId,
                user.EmployeeGroupId,
                user.LastLoginAt,
                user.PasswordResetPending,
                user.IsActive
            });

            return user;
        }

        // ======================================================
        // GET BY ID (somente ativos – uso em cenários de Auth)
        // ======================================================
        public async Task<User?> GetByIdAsync(Guid id)
        {
            const string sql = @"
                SELECT
                    id                      AS ""Id"",
                    first_name              AS ""FirstName"",
                    last_name               AS ""LastName"",
                    email                   AS ""Email"",
                    password                AS ""Password"",
                    password_reset_pending  AS ""PasswordResetPending"",
                    phone                   AS ""Phone"",
                    created_at              AS ""CreatedAt"",
                    updated_at              AS ""UpdatedAt"",
                    auth_provider           AS ""AuthProvider"",
                    provider_user_id        AS ""ProviderUserId"",
                    provider_email          AS ""ProviderEmail"",
                    picture_url             AS ""PictureUrl"",
                    user_group_id           AS ""UserGroupId"",
                    employee_group_id       AS ""EmployeeGroupId"",
                    last_login_at           AS ""LastLoginAt"",
                    is_active               AS ""IsActive""
                FROM users
                WHERE id = @Id
                  AND is_active = TRUE;
            ";

            await using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QuerySingleOrDefaultAsync<User>(sql, new { Id = id });
        }
    }
}
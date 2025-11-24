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
        // GET BY EMAIL
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
                    updated_at              AS ""UpdatedAt""
                FROM users
                WHERE email = @Email;
            ";

            await using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QuerySingleOrDefaultAsync<User>(sql, new { Email = email });
        }

        // ======================================================
        // GET BY PHONE
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
                    updated_at              AS ""UpdatedAt""
                FROM users
                WHERE phone = @Phone
                ORDER BY created_at DESC
                LIMIT 1;
            ";

            await using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QueryFirstOrDefaultAsync<User>(sql, new { Phone = phone });
        }

        // ======================================================
        // CREATE USER
        // ======================================================
        public async Task<User> CreateAsync(User user)
        {
            const string sql = @"
                INSERT INTO users (first_name, last_name, email, password, phone)
                VALUES (@FirstName, @LastName, @Email, @Password, @Phone)
                RETURNING 
                    id         AS ""Id"", 
                    created_at AS ""CreatedAt"";
            ";

            await using var connection = new NpgsqlConnection(_connectionString);

            var result = await connection.QuerySingleAsync<User>(sql, new
            {
                user.FirstName,
                user.LastName,
                user.Email,
                user.Password,
                user.Phone
            });

            // Atualiza o objeto original
            user.Id = result.Id;
            user.CreatedAt = result.CreatedAt;

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
        // UPDATE USER (GOOGLE / DADOS GERAIS)
        // ======================================================
        public async Task<User> UpdateAsync(User user)
        {
            const string sql = @"
                UPDATE users
                SET 
                    first_name  = @FirstName,
                    last_name   = @LastName,
                    email       = @Email,
                    phone       = @Phone,
                    picture_url = @PictureUrl,
                    updated_at  = now()
                WHERE id = @Id;
            ";

            await using var connection = new NpgsqlConnection(_connectionString);

            await connection.ExecuteAsync(sql, new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                user.Phone,
                user.PictureUrl
            });

            return user;
        }
    }
}
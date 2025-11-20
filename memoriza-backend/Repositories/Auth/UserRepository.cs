using System;
using System.Threading.Tasks;
using memoriza_backend.Models.Auth;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace memoriza_backend.Repositories.Auth
{
    // Implementação do repositório de usuário utilizando Postgres (Supabase)
    public class UserRepository : IUserRepository
    {
        private readonly string _connectionString;

        // O construtor recebe IConfiguration para ler a ConnectionString
        public UserRepository(IConfiguration configuration)
        {
            // ConnectionString
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new ApplicationException("Connection string 'DefaultConnection' não configurada.");
        }

        // Busca um usuário pelo e-mail
        public async Task<User?> GetByEmailAsync(string email)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql = @"
                SELECT id,
                       first_name,
                       last_name,
                       email,
                       password,
                       password_reset_pending,
                       created_at,
                       updated_at
                FROM users
                WHERE email = @Email
            ";

            await using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("Email", email);

            await using var reader = await command.ExecuteReaderAsync();

            if (!await reader.ReadAsync())
                return null;

            var user = new User
            {
                Id = reader.GetGuid(0),
                FirstName = reader.GetString(1),
                LastName = reader.GetString(2),
                Email = reader.GetString(3),
                Password = reader.GetString(4),
                PasswordResetPending = reader.GetBoolean(5),
                CreatedAt = reader.GetDateTime(6),
                UpdatedAt = reader.IsDBNull(7) ? null : reader.GetDateTime(7)
            };

            return user;
        }

        // Cria um novo usuário no banco de dados
        public async Task<User> CreateAsync(User user)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql = @"
                INSERT INTO users (first_name, last_name, email, password)
                VALUES (@FirstName, @LastName, @Email, @Password)
                RETURNING id, created_at;
            ";

            await using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("FirstName", user.FirstName);
            command.Parameters.AddWithValue("LastName", user.LastName);
            command.Parameters.AddWithValue("Email", user.Email);
            command.Parameters.AddWithValue("Password", user.Password);

            await using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                user.Id = reader.GetGuid(0);
                user.CreatedAt = reader.GetDateTime(1);
            }

            return user;
        }

        // Atualiza a senha do usuário e limpa o status de redefinição pendente
        public async Task UpdatePasswordAsync(User user)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql = @"
                UPDATE users
                SET password = @Password,
                    password_reset_pending = @PasswordResetPending,
                    updated_at = now()
                WHERE id = @Id;
            ";

            await using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("Password", user.Password);
            command.Parameters.AddWithValue("PasswordResetPending", user.PasswordResetPending);
            command.Parameters.AddWithValue("Id", user.Id);

            await command.ExecuteNonQueryAsync();
        }

        // Marca o usuário como tendo uma solicitação de redefinição de senha pendente
        public async Task MarkResetPendingAsync(Guid id)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql = @"
                UPDATE users
                SET password_reset_pending = true,
                    updated_at = now()
                WHERE id = @Id;
            ";

            await using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("Id", id);

            await command.ExecuteNonQueryAsync();
        }
    }
}
using Dapper;
using memoriza_backend.Models.Admin;
using Npgsql;

namespace memoriza_backend.Repositories.Admin.Employees
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly string _connectionString;

        public EmployeeRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' não encontrada.");
        }

        private NpgsqlConnection GetConnection() => new NpgsqlConnection(_connectionString);

        // LISTAR TODOS
        public async Task<IReadOnlyList<AdminEmployee>> GetAllAsync()
        {
            const string sql = @"
                SELECT 
                    e.id                       AS ""Id"",
                    e.user_id                  AS ""UserId"",
                    e.group_id                 AS ""GroupId"",
                    g.name                     AS ""GroupName"",
                    u.first_name               AS ""FirstName"",
                    u.last_name                AS ""LastName"",
                    u.email                    AS ""Email"",
                    COALESCE(u.phone, '')      AS ""Phone"",
                    e.cpf                      AS ""Cpf"",
                    e.status                   AS ""Status"",
                    e.hire_date                AS ""HireDate"",
                    e.created_at               AS ""CreatedAt"",
                    e.updated_at               AS ""UpdatedAt""
                FROM employees e
                INNER JOIN users u       ON u.id = e.user_id
                INNER JOIN user_groups g ON g.id = e.group_id
                ORDER BY u.first_name, u.last_name;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var result = await conn.QueryAsync<AdminEmployee>(sql);
            return result.AsList();
        }

        // DETALHE POR ID
        public async Task<AdminEmployee?> GetByIdAsync(Guid id)
        {
            const string sql = @"
                SELECT 
                    e.id                       AS ""Id"",
                    e.user_id                  AS ""UserId"",
                    e.group_id                 AS ""GroupId"",
                    g.name                     AS ""GroupName"",
                    u.first_name               AS ""FirstName"",
                    u.last_name                AS ""LastName"",
                    u.email                    AS ""Email"",
                    COALESCE(u.phone, '')      AS ""Phone"",
                    e.cpf                      AS ""Cpf"",
                    e.status                   AS ""Status"",
                    e.hire_date                AS ""HireDate"",
                    e.created_at               AS ""CreatedAt"",
                    e.updated_at               AS ""UpdatedAt""
                FROM employees e
                INNER JOIN users u       ON u.id = e.user_id
                INNER JOIN user_groups g ON g.id = e.group_id
                WHERE e.id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            return await conn.QuerySingleOrDefaultAsync<AdminEmployee>(sql, new { Id = id });
        }

        // CPF ÚNICO
        public async Task<bool> IsCpfUniqueAsync(string cpf, Guid? excludeEmployeeId = null)
        {
            const string sql = @"
                SELECT COUNT(1)
                FROM employees
                WHERE cpf = @Cpf
                  AND (@ExcludeId IS NULL OR id <> @ExcludeId);
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var count = await conn.ExecuteScalarAsync<int>(sql, new
            {
                Cpf = cpf,
                ExcludeId = excludeEmployeeId
            });

            return count == 0;
        }

        // CREATE
        public async Task<Guid> CreateAsync(Guid userId, Guid groupId, string? cpf, DateTime hireDate, string status)
        {
            const string sql = @"
                INSERT INTO employees
                    (id, user_id, group_id, cpf, hire_date, status, created_at, updated_at)
                VALUES
                    (@Id, @UserId, @GroupId, @Cpf, @HireDate, @Status, now(), now());
            ";

            var id = Guid.NewGuid();

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new
            {
                Id = id,
                UserId = userId,
                GroupId = groupId,
                Cpf = (object?)cpf ?? DBNull.Value,
                HireDate = hireDate.Date,
                Status = status
            });

            return id;
        }

        // UPDATE
        public async Task UpdateAsync(Guid id, Guid groupId, string? cpf, DateTime hireDate, string status)
        {
            const string sql = @"
                UPDATE employees SET
                    group_id   = @GroupId,
                    cpf        = @Cpf,
                    hire_date  = @HireDate,
                    status     = @Status,
                    updated_at = now()
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new
            {
                Id = id,
                GroupId = groupId,
                Cpf = (object?)cpf ?? DBNull.Value,
                HireDate = hireDate.Date,
                Status = status
            });
        }

        // UPDATE STATUS
        public async Task UpdateStatusAsync(Guid id, string status)
        {
            const string sql = @"
                UPDATE employees
                SET status = @Status,
                    updated_at = now()
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new
            {
                Id = id,
                Status = status
            });
        }
    }
}
using Dapper;
using memoriza_backend.Models.Admin;
using Npgsql;

namespace memoriza_backend.Repositories.Admin.Employees
{
    public class EmployeeAccessLogRepository : IEmployeeAccessLogRepository
    {
        private readonly string _connectionString;

        public EmployeeAccessLogRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' não encontrada.");
        }

        private NpgsqlConnection GetConnection() => new NpgsqlConnection(_connectionString);

        // LISTAR TODOS OS LOGS (para o dashboard de Acessos & Logs)
        public async Task<IReadOnlyList<AdminEmployeeAccessLog>> GetAllAsync()
        {
            const string sql = @"
                SELECT
                    l.id                     AS ""Id"",
                    l.employee_id            AS ""EmployeeId"",
                    u.first_name || ' ' || u.last_name AS ""EmployeeName"",
                    g.name                   AS ""EmployeeRole"",
                    l.action                 AS ""Action"",
                    l.module                 AS ""Module"",
                    l.description            AS ""Description"",
                    l.created_at             AS ""Timestamp""
                FROM employee_access_logs l
                INNER JOIN employees e    ON e.id = l.employee_id
                INNER JOIN users u        ON u.id = e.user_id
                INNER JOIN user_groups g  ON g.id = e.group_id
                ORDER BY l.created_at DESC;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var result = await conn.QueryAsync<AdminEmployeeAccessLog>(sql);
            return result.AsList();
        }

        // INSERIR UM NOVO LOG
        public async Task CreateAsync(AdminEmployeeAccessLog log)
        {
            const string sql = @"
                INSERT INTO employee_access_logs
                    (id, employee_id, action, module, description, created_at)
                VALUES
                    (@Id, @EmployeeId, @Action, @Module, @Description, @CreatedAt);
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new
            {
                Id = log.Id,
                EmployeeId = log.EmployeeId,
                Action = log.Action,
                Module = log.Module,
                Description = log.Description,
                CreatedAt = log.Timestamp
            });
        }
    }
}
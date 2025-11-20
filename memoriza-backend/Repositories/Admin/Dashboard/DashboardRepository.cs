using memoriza_backend.Models.DTO.Admin.Dashboard;
using memoriza_backend.Models.Admin;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace memoriza_backend.Repositories.Admin.Dashboard
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly string _connectionString;

        public DashboardRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        private NpgsqlConnection GetConnection() => new NpgsqlConnection(_connectionString);

        public async Task<DashboardSummaryDto> GetSummaryAsync(DateTime from, DateTime to)
        {
            await using var conn = GetConnection();
            await conn.OpenAsync();

            // status relevantes: 1..6 conforme enum
            const string sql = @"
                SELECT
                    COALESCE(SUM(CASE WHEN status IN (2,3,4,5) THEN total ELSE 0 END), 0) AS total_sales,
                    COALESCE(SUM(CASE WHEN status = 6 THEN total ELSE 0 END), 0) AS total_refunds,
                    COUNT(*) AS total_orders,
                    COUNT(*) FILTER (WHERE status = 1) AS orders_awaiting_payment,
                    COUNT(*) FILTER (WHERE status = 3) AS orders_in_production,
                    COUNT(*) FILTER (WHERE status = 5) AS orders_finished
                FROM orders
                WHERE created_at BETWEEN @from AND @to;";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("from", from);
            cmd.Parameters.AddWithValue("to", to);

            await using var reader = await cmd.ExecuteReaderAsync();
            if (!await reader.ReadAsync())
            {
                return new DashboardSummaryDto();
            }

            return new DashboardSummaryDto
            {
                TotalSales = reader.GetDecimal(0),
                TotalRefunds = reader.GetDecimal(1),
                TotalOrders = reader.GetInt32(2),
                OrdersAwaitingPayment = reader.GetInt32(3),
                OrdersInProduction = reader.GetInt32(4),
                OrdersFinished = reader.GetInt32(5)
            };
        }

        public async Task<IReadOnlyList<TopProductDto>> GetTopProductsAsync(DateTime from, DateTime to, int limit)
        {
            var list = new List<TopProductDto>();

            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"
                SELECT 
                    oi.product_id,
                    oi.product_name,
                    SUM(oi.quantity) AS qty_sold,
                    SUM(oi.line_total) AS total_amount
                FROM order_items oi
                JOIN orders o ON o.id = oi.order_id
                WHERE o.created_at BETWEEN @from AND @to
                  AND o.status IN (2,3,4,5) -- apenas pedidos pagos/em produção/a caminho/finalizados
                GROUP BY oi.product_id, oi.product_name
                ORDER BY qty_sold DESC
                LIMIT @limit;";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("from", from);
            cmd.Parameters.AddWithValue("to", to);
            cmd.Parameters.AddWithValue("limit", limit);

            await using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new TopProductDto
                {
                    ProductId = reader.GetGuid(0),
                    ProductName = reader.GetString(1),
                    QuantitySold = reader.GetInt32(2),
                    TotalAmount = reader.GetDecimal(3)
                });
            }

            return list;
        }
    }
}
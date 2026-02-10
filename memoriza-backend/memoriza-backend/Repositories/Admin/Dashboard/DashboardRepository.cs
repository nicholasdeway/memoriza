using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using memoriza_backend.Models.Admin;
using memoriza_backend.Models.DTO.Admin.Dashboard;
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

        // =====================================================
        // SUMMARY
        // =====================================================
        public async Task<DashboardSummaryDto> GetSummaryAsync(DateTime from, DateTime to)
        {
            const string sql = @"
                SELECT
                    COALESCE(SUM(CASE WHEN status IN ('Paid','InProduction','Shipped','Delivered') THEN total ELSE 0 END), 0) AS ""TotalSales"",
                    COALESCE(SUM(CASE WHEN status = 'Refunded' THEN total ELSE 0 END), 0) AS ""TotalRefunds"",
                    COUNT(*) AS ""TotalOrders"",
                    COUNT(*) FILTER (WHERE status = 'Pending') AS ""OrdersAwaitingPayment"",
                    COUNT(*) FILTER (WHERE status IN ('Paid', 'InProduction', 'Shipped', 'Delivered')) AS ""OrdersPaid"",
                    COUNT(*) FILTER (WHERE status = 'Cancelled') AS ""OrdersCancelled"",
                    COUNT(*) FILTER (WHERE status = 'InProduction') AS ""OrdersInProduction"",
                    COUNT(*) FILTER (WHERE status = 'Delivered') AS ""OrdersFinished""
                FROM orders
                WHERE created_at BETWEEN @from AND @to;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var summary = await conn.QuerySingleOrDefaultAsync<DashboardSummaryDto>(sql, new
            {
                from,
                to
            });

            return summary ?? new DashboardSummaryDto();
        }

        // =====================================================
        // TOP PRODUCTS
        // =====================================================
        public async Task<IReadOnlyList<TopProductDto>> GetTopProductsAsync(DateTime from, DateTime to, int limit)
        {
            const string sql = @"
                SELECT 
                    oi.product_id       AS ""ProductId"",
                    oi.product_name     AS ""ProductName"",
                    SUM(oi.quantity)    AS ""QuantitySold"",
                    SUM(oi.unit_price * oi.quantity) AS ""TotalAmount""
                FROM order_items oi
                JOIN orders o ON o.id = oi.order_id
                WHERE o.created_at BETWEEN @from AND @to
                  AND o.status IN ('Paid', 'InProduction', 'Shipped', 'Delivered')
                GROUP BY oi.product_id, oi.product_name
                ORDER BY ""QuantitySold"" DESC
                LIMIT @limit;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var products = await conn.QueryAsync<TopProductDto>(sql, new
            {
                from,
                to,
                limit
            });

            return products.AsList();
        }

        // =====================================================
        // RECENT ORDERS
        // =====================================================
        public async Task<IReadOnlyList<RecentOrderDto>> GetRecentOrdersAsync(int limit)
        {
            const string sql = @"
                SELECT 
                    o.order_number AS ""OrderNumber"",
                    COALESCE(u.first_name || ' ' || u.last_name, 'Cliente') AS ""CustomerName"",
                    o.total AS ""Total"",
                    o.status AS ""Status"",
                    o.created_at AS ""CreatedAt""
                FROM orders o
                LEFT JOIN users u ON u.id = o.user_id
                ORDER BY o.created_at DESC
                LIMIT @limit;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var orders = await conn.QueryAsync<RecentOrderDto>(sql, new { limit });
            return orders.AsList();
        }

        // =====================================================
        // SALES BY MONTH
        // =====================================================
        public async Task<IReadOnlyList<SalesByMonthDto>> GetSalesByMonthAsync(DateTime from, DateTime to)
        {
            const string sql = @"
                SELECT 
                    TO_CHAR(created_at, 'Mon') AS ""Month"",
                    COALESCE(SUM(total), 0) AS ""Sales""
                FROM orders
                WHERE created_at BETWEEN @from AND @to
                  AND status IN ('Paid','InProduction','Shipped','Delivered')
                GROUP BY TO_CHAR(created_at, 'Mon'), EXTRACT(MONTH FROM created_at)
                ORDER BY EXTRACT(MONTH FROM created_at);
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var sales = await conn.QueryAsync<SalesByMonthDto>(sql, new
            {
                from,
                to
            });

            return sales.AsList();
        }
    }
}
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using memoriza_backend.Models.Admin;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace memoriza_backend.Repositories.Admin.Orders
{
    public class AdminOrderRepository : IAdminOrderRepository
    {
        private readonly string _connectionString;

        public AdminOrderRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        private NpgsqlConnection GetConnection() => new NpgsqlConnection(_connectionString);

        // =====================================================
        // GET ALL
        // =====================================================
        public async Task<IReadOnlyList<Order>> GetAllAsync()
        {
            const string sql = @"
                SELECT 
                    id              AS ""Id"",
                    user_id         AS ""UserId"",
                    subtotal        AS ""Subtotal"",
                    freight_value   AS ""FreightValue"",
                    total           AS ""Total"",
                    status          AS ""Status"",
                    personalization_notes AS ""PersonalizationNotes"",
                    created_at      AS ""CreatedAt"",
                    paid_at         AS ""PaidAt"",
                    shipped_at      AS ""ShippedAt"",
                    finished_at     AS ""FinishedAt"",
                    refunded_at     AS ""RefundedAt""
                FROM orders
                ORDER BY created_at DESC;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var orders = await conn.QueryAsync<Order>(sql);
            return orders.AsList();
        }

        // =====================================================
        // GET BY ID
        // =====================================================
        public async Task<Order?> GetByIdAsync(Guid id)
        {
            const string sql = @"
                SELECT 
                    id              AS ""Id"",
                    user_id         AS ""UserId"",
                    subtotal        AS ""Subtotal"",
                    freight_value   AS ""FreightValue"",
                    total           AS ""Total"",
                    status          AS ""Status"",
                    personalization_notes AS ""PersonalizationNotes"",
                    created_at      AS ""CreatedAt"",
                    paid_at         AS ""PaidAt"",
                    shipped_at      AS ""ShippedAt"",
                    finished_at     AS ""FinishedAt"",
                    refunded_at     AS ""RefundedAt""
                FROM orders
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            return await conn.QuerySingleOrDefaultAsync<Order>(sql, new { Id = id });
        }

        // =====================================================
        // GET ITEMS BY ORDER
        // =====================================================
        public async Task<IReadOnlyList<OrderItem>> GetItemsByOrderIdAsync(Guid orderId)
        {
            const string sql = @"
                SELECT 
                    id              AS ""Id"",
                    order_id        AS ""OrderId"",
                    product_id      AS ""ProductId"",
                    product_name    AS ""ProductName"",
                    unit_price      AS ""UnitPrice"",
                    quantity        AS ""Quantity"",
                    subtotal        AS ""Subtotal""
                FROM order_items
                WHERE order_id = @OrderId;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var items = await conn.QueryAsync<OrderItem>(sql, new { OrderId = orderId });
            return items.AsList();
        }

        // =====================================================
        // UPDATE ORDER
        // =====================================================
        public async Task UpdateAsync(Order order)
        {
            const string sql = @"
                UPDATE orders SET
                    user_id = @UserId,
                    subtotal = @Subtotal,
                    freight_value = @FreightValue,
                    total = @Total,
                    status = @Status,
                    personalization_notes = @PersonalizationNotes,
                    paid_at = @PaidAt,
                    shipped_at = @ShippedAt,
                    finished_at = @FinishedAt,
                    refunded_at = @RefundedAt
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new
            {
                order.Id,
                order.UserId,
                order.Subtotal,
                order.FreightValue,
                order.Total,
                Status = (int)order.Status,
                PersonalizationNotes = (object?)order.PersonalizationNotes ?? DBNull.Value,
                PaidAt = (object?)order.PaidAt ?? DBNull.Value,
                ShippedAt = (object?)order.ShippedAt ?? DBNull.Value,
                FinishedAt = (object?)order.FinishedAt ?? DBNull.Value,
                RefundedAt = (object?)order.RefundedAt ?? DBNull.Value
            });
        }

        // =====================================================
        // ADD STATUS HISTORY
        // =====================================================
        public async Task AddStatusHistoryAsync(OrderStatusHistory history)
        {
            const string sql = @"
                INSERT INTO order_status_history
                    (id, order_id, status, changed_by_user_id, changed_at, note)
                VALUES
                    (@Id, @OrderId, @Status, @ChangedByUserId, @ChangedAt, @Note);
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new
            {
                history.Id,
                history.OrderId,
                Status = (int)history.Status,
                history.ChangedByUserId,
                history.ChangedAt,
                Note = (object?)history.Note ?? DBNull.Value
            });
        }
    }
}
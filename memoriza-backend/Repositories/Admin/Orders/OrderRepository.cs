using memoriza_backend.Models.Admin;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace memoriza_backend.Repositories.Admin.Orders
{
    public class OrderRepository : IOrderRepository
    {
        private readonly string _connectionString;

        public OrderRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        private NpgsqlConnection GetConnection() => new NpgsqlConnection(_connectionString);

        // =====================================================
        // ============= MAPEADORES =============================
        // =====================================================

        private static Order MapOrder(NpgsqlDataReader reader)
        {
            return new Order
            {
                Id = reader.GetGuid(reader.GetOrdinal("id")),
                UserId = reader.GetGuid(reader.GetOrdinal("user_id")),
                Subtotal = reader.GetDecimal(reader.GetOrdinal("subtotal")),
                FreightValue = reader.GetDecimal(reader.GetOrdinal("freight_value")),
                Total = reader.GetDecimal(reader.GetOrdinal("total")),
                Status = (OrderStatus)reader.GetInt32(reader.GetOrdinal("status")),
                PersonalizationNotes = reader.IsDBNull(reader.GetOrdinal("personalization_notes"))
                    ? null
                    : reader.GetString(reader.GetOrdinal("personalization_notes")),
                CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at")),
                PaidAt = reader.IsDBNull(reader.GetOrdinal("paid_at")) ? null : reader.GetDateTime(reader.GetOrdinal("paid_at")),
                ShippedAt = reader.IsDBNull(reader.GetOrdinal("shipped_at")) ? null : reader.GetDateTime(reader.GetOrdinal("shipped_at")),
                FinishedAt = reader.IsDBNull(reader.GetOrdinal("finished_at")) ? null : reader.GetDateTime(reader.GetOrdinal("finished_at")),
                RefundedAt = reader.IsDBNull(reader.GetOrdinal("refunded_at")) ? null : reader.GetDateTime(reader.GetOrdinal("refunded_at"))
            };
        }

        private static OrderItem MapOrderItem(NpgsqlDataReader reader)
        {
            return new OrderItem
            {
                Id = reader.GetGuid(reader.GetOrdinal("id")),
                OrderId = reader.GetGuid(reader.GetOrdinal("order_id")),
                ProductId = reader.GetGuid(reader.GetOrdinal("product_id")),
                ProductName = reader.GetString(reader.GetOrdinal("product_name")),
                UnitPrice = reader.GetDecimal(reader.GetOrdinal("unit_price")),
                Quantity = reader.GetInt32(reader.GetOrdinal("quantity")),
                LineTotal = reader.GetDecimal(reader.GetOrdinal("line_total"))
            };
        }

        // =====================================================
        // =================== QUERY: GET ALL ==================
        // =====================================================

        public async Task<IReadOnlyList<Order>> GetAllAsync()
        {
            var list = new List<Order>();

            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"SELECT * FROM orders ORDER BY created_at DESC";

            await using var cmd = new NpgsqlCommand(sql, conn);
            await using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
                list.Add(MapOrder(reader));

            return list;
        }

        // =====================================================
        // =================== QUERY: GET BY ID ================
        // =====================================================

        public async Task<Order?> GetByIdAsync(Guid id)
        {
            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"SELECT * FROM orders WHERE id = @id";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("id", id);

            await using var reader = await cmd.ExecuteReaderAsync();
            return await reader.ReadAsync() ? MapOrder(reader) : null;
        }

        // =====================================================
        // ================== GET ITEMS BY ORDER ===============
        // =====================================================

        public async Task<IReadOnlyList<OrderItem>> GetItemsByOrderIdAsync(Guid orderId)
        {
            var items = new List<OrderItem>();

            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"SELECT * FROM order_items WHERE order_id = @order_id";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("order_id", orderId);

            await using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
                items.Add(MapOrderItem(reader));

            return items;
        }

        // =====================================================
        // =============== UPDATE ORDER ========================
        // =====================================================

        public async Task UpdateAsync(Order order)
        {
            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"
                UPDATE orders SET
                    user_id = @user_id,
                    subtotal = @subtotal,
                    freight_value = @freight_value,
                    total = @total,
                    status = @status,
                    personalization_notes = @personalization_notes,
                    paid_at = @paid_at,
                    shipped_at = @shipped_at,
                    finished_at = @finished_at,
                    refunded_at = @refunded_at
                WHERE id = @id
            ";

            await using var cmd = new NpgsqlCommand(sql, conn);

            cmd.Parameters.AddWithValue("id", order.Id);
            cmd.Parameters.AddWithValue("user_id", order.UserId);
            cmd.Parameters.AddWithValue("subtotal", order.Subtotal);
            cmd.Parameters.AddWithValue("freight_value", order.FreightValue);
            cmd.Parameters.AddWithValue("total", order.Total);
            cmd.Parameters.AddWithValue("status", (int)order.Status);
            cmd.Parameters.AddWithValue("personalization_notes",
                (object?)order.PersonalizationNotes ?? DBNull.Value);
            cmd.Parameters.AddWithValue("paid_at", (object?)order.PaidAt ?? DBNull.Value);
            cmd.Parameters.AddWithValue("shipped_at", (object?)order.ShippedAt ?? DBNull.Value);
            cmd.Parameters.AddWithValue("finished_at", (object?)order.FinishedAt ?? DBNull.Value);
            cmd.Parameters.AddWithValue("refunded_at", (object?)order.RefundedAt ?? DBNull.Value);

            await cmd.ExecuteNonQueryAsync();
        }

        // =====================================================
        // =============== ADD STATUS HISTORY ==================
        // =====================================================

        public async Task AddStatusHistoryAsync(OrderStatusHistory history)
        {
            await using var conn = GetConnection();
            await conn.OpenAsync();

            const string sql = @"
                INSERT INTO order_status_history
                    (id, order_id, status, changed_by_user_id, changed_at, note)
                VALUES
                    (@id, @order_id, @status, @changed_by_user_id, @changed_at, @note)
            ";

            await using var cmd = new NpgsqlCommand(sql, conn);

            cmd.Parameters.AddWithValue("id", history.Id);
            cmd.Parameters.AddWithValue("order_id", history.OrderId);
            cmd.Parameters.AddWithValue("status", (int)history.Status);
            cmd.Parameters.AddWithValue("changed_by_user_id", history.ChangedByUserId);
            cmd.Parameters.AddWithValue("changed_at", history.ChangedAt);
            cmd.Parameters.AddWithValue("note", (object?)history.Note ?? DBNull.Value);

            await cmd.ExecuteNonQueryAsync();
        }
    }
}
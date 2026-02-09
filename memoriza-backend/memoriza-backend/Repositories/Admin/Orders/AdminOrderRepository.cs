using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using EntityOrder = memoriza_backend.Models.Entities.Order;
using AdminOrderItem = memoriza_backend.Models.Admin.OrderItem;
using AdminOrderStatusHistory = memoriza_backend.Models.Admin.OrderStatusHistory;
using Microsoft.Extensions.Configuration;
using Npgsql;
using memoriza_backend.Helpers;

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
        public async Task<IReadOnlyList<EntityOrder>> GetAllAsync()
        {
            const string sql = @"
                SELECT 
                    o.id                          AS ""Id"",
                    o.order_number                AS ""OrderNumber"",
                    o.user_id::text               AS ""UserId"",
                    COALESCE(u.first_name || ' ' || u.last_name, '') AS ""CustomerName"",
                    o.created_at                  AS ""CreatedAt"",

                    o.subtotal                    AS ""Subtotal"",
                    o.shipping_amount             AS ""ShippingAmount"",
                    o.total                       AS ""TotalAmount"",
                    o.status                      AS ""Status"",

                    o.shipping_code               AS ""ShippingCode"",
                    o.shipping_name               AS ""ShippingName"",
                    o.shipping_estimated_days     AS ""ShippingEstimatedDays"",

                    o.shipping_address_id         AS ""ShippingAddressId"",
                    o.shipping_street             AS ""ShippingStreet"",
                    o.shipping_number             AS ""ShippingNumber"",
                    o.shipping_complement         AS ""ShippingComplement"",
                    o.shipping_neighborhood       AS ""ShippingNeighborhood"",
                    o.shipping_city               AS ""ShippingCity"",
                    o.shipping_state              AS ""ShippingState"",
                    o.shipping_zip_code           AS ""ShippingZipCode"",
                    o.shipping_country            AS ""ShippingCountry"",

                    o.personalization_notes       AS ""PersonalizationNotes"",

                    o.delivered_at                AS ""DeliveredAt"",
                    o.tracking_code               AS ""TrackingCode"",
                    o.tracking_company            AS ""TrackingCompany"",
                    o.tracking_url                AS ""TrackingUrl"",

                    o.is_refundable               AS ""IsRefundable"",
                    o.refund_status               AS ""RefundStatus"",
                    o.refund_reason               AS ""RefundReason"",
                    o.refund_requested_at         AS ""RefundRequestedAt"",
                    o.refund_processed_at         AS ""RefundProcessedAt""
                FROM orders o
                LEFT JOIN users u ON u.id = o.user_id
                ORDER BY o.created_at DESC;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var orders = await conn.QueryAsync<EntityOrder>(sql);
            return orders.AsList();
        }

        // =====================================================
        // GET BY ID
        // =====================================================
        public async Task<EntityOrder?> GetByIdAsync(Guid id)
        {
            const string sql = @"
                SELECT 
                    o.id                          AS ""Id"",
                    o.order_number                AS ""OrderNumber"",
                    o.user_id::text               AS ""UserId"",
                    COALESCE(u.first_name || ' ' || u.last_name, '') AS ""CustomerName"",
                    u.email                       AS ""CustomerEmail"",
                    u.phone                       AS ""CustomerPhone"",
                    o.created_at                  AS ""CreatedAt"",

                    o.subtotal                    AS ""Subtotal"",
                    o.shipping_amount             AS ""ShippingAmount"",
                    o.total                       AS ""TotalAmount"",
                    o.status                      AS ""Status"",

                    o.shipping_code               AS ""ShippingCode"",
                    o.shipping_name               AS ""ShippingName"",
                    o.shipping_estimated_days     AS ""ShippingEstimatedDays"",

                    o.shipping_address_id         AS ""ShippingAddressId"",
                    o.shipping_street             AS ""ShippingStreet"",
                    o.shipping_number             AS ""ShippingNumber"",
                    o.shipping_complement         AS ""ShippingComplement"",
                    o.shipping_neighborhood       AS ""ShippingNeighborhood"",
                    o.shipping_city               AS ""ShippingCity"",
                    o.shipping_state              AS ""ShippingState"",
                    o.shipping_zip_code           AS ""ShippingZipCode"",
                    o.shipping_country            AS ""ShippingCountry"",
                    o.shipping_phone              AS ""ShippingPhone"",

                    o.personalization_notes       AS ""PersonalizationNotes"",

                    o.delivered_at                AS ""DeliveredAt"",
                    o.tracking_code               AS ""TrackingCode"",
                    o.tracking_company            AS ""TrackingCompany"",
                    o.tracking_url                AS ""TrackingUrl"",

                    o.is_refundable               AS ""IsRefundable"",
                    o.refund_status               AS ""RefundStatus"",
                    o.refund_reason               AS ""RefundReason"",
                    o.refund_requested_at         AS ""RefundRequestedAt"",
                    o.refund_processed_at         AS ""RefundProcessedAt""
                FROM orders o
                LEFT JOIN users u ON u.id = o.user_id
                WHERE o.id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            return await conn.QuerySingleOrDefaultAsync<EntityOrder>(sql, new { Id = id });
        }

        // =====================================================
        // GET ITEMS BY ORDER
        // =====================================================
        public async Task<IReadOnlyList<AdminOrderItem>> GetItemsByOrderIdAsync(Guid orderId)
        {
            const string sql = @"
                SELECT 
                    id              AS ""Id"",
                    order_id        AS ""OrderId"",
                    product_id      AS ""ProductId"",
                    product_name    AS ""ProductName"",
                    unit_price      AS ""UnitPrice"",
                    quantity        AS ""Quantity"",
                    subtotal        AS ""Subtotal"",
                    personalization_text AS ""PersonalizationText"",
                    size_id         AS ""SizeId"",
                    color_id        AS ""ColorId"",
                    size_name               AS ""SizeName"",
                    color_name              AS ""ColorName""
                FROM order_items
                WHERE order_id = @OrderId;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var items = await conn.QueryAsync<AdminOrderItem>(sql, new { OrderId = orderId });
            return items.AsList();
        }

        // =====================================================
        // UPDATE ORDER
        // =====================================================
        public async Task UpdateAsync(EntityOrder order)
        {
            const string sql = @"
                UPDATE orders SET
                    user_id               = @UserId::uuid,
                    subtotal              = @Subtotal,
                    shipping_amount       = @ShippingAmount,
                    freight_value         = @ShippingAmount,
                    total                 = @TotalAmount,
                    total_amount          = @TotalAmount,
                    status                = @Status,
                    personalization_notes = @PersonalizationNotes,
                    delivered_at          = @DeliveredAt,
                    tracking_code         = @TrackingCode,
                    tracking_company      = @TrackingCompany,
                    tracking_url          = @TrackingUrl,
                    is_refundable         = @IsRefundable,
                    refund_status         = @RefundStatus,
                    refund_reason         = @RefundReason,
                    refund_requested_at   = @RefundRequestedAt,
                    refund_processed_at   = @RefundProcessedAt
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, order);
        }


        public async Task UpdateStatusOnlyAsync(Guid id, string status, DateTime? deliveredAt)
        {
            const string sql = @"
                UPDATE orders SET
                    status                = @Status,
                    delivered_at          = @DeliveredAt
                WHERE id = @Id;
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new { Id = id, Status = status, DeliveredAt = deliveredAt });
        }

        // =====================================================
        // ADD STATUS HISTORY
        // =====================================================
        public async Task AddStatusHistoryAsync(AdminOrderStatusHistory history)
        {
            const string sql = @"
                INSERT INTO order_status_history
                    (id, order_id, status, changed_by_user_id, changed_at, note)
                VALUES
                    (@Id, @OrderId, @Status, @ChangedByUserId::uuid, @ChangedAt, @Note);
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            var statusInt = history.Status switch
            {
                OrderStatusCodes.Pending => 0,
                OrderStatusCodes.Paid => 1,
                OrderStatusCodes.InProduction => 2,
                OrderStatusCodes.Shipped => 3,
                OrderStatusCodes.Delivered => 4,
                OrderStatusCodes.Refunded => 5,
                OrderStatusCodes.Cancelled => 6,
                _ => 0
            };

            await conn.ExecuteAsync(sql, new
            {
                history.Id,
                history.OrderId,
                Status = statusInt,
                history.ChangedByUserId,
                history.ChangedAt,
                Note = (object?)history.Note ?? DBNull.Value
            });
        }
    
        public async Task<int> GetCountByStatusAsync(string status)
        {
            const string sql = "SELECT COUNT(*) FROM orders WHERE status = @Status;";
            await using var conn = GetConnection();
            await conn.OpenAsync();
            var count = await conn.ExecuteScalarAsync<long>(sql, new { Status = status });
            return (int)count;
        }
    }
}
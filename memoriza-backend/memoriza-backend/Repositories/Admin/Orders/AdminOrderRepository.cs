using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using EntityOrder = memoriza_backend.Models.Entities.Order;
using AdminOrderItem = memoriza_backend.Models.Admin.OrderItem;
using AdminOrderStatusHistory = memoriza_backend.Models.Admin.OrderStatusHistory;
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
                    o.total_amount                AS ""TotalAmount"",
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
                    o.created_at                  AS ""CreatedAt"",

                    o.subtotal                    AS ""Subtotal"",
                    o.shipping_amount             AS ""ShippingAmount"",
                    o.total_amount                AS ""TotalAmount"",
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
                    subtotal        AS ""Subtotal""
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
                    user_id               = @UserId,
                    subtotal              = @Subtotal,
                    shipping_amount       = @ShippingAmount,
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

            await conn.ExecuteAsync(sql, new
            {
                order.Id,
                order.UserId,
                order.Subtotal,
                order.ShippingAmount,
                order.TotalAmount,
                order.Status,
                order.PersonalizationNotes,
                order.DeliveredAt,
                order.TrackingCode,
                order.TrackingCompany,
                order.TrackingUrl,
                order.IsRefundable,
                order.RefundStatus,
                order.RefundReason,
                order.RefundRequestedAt,
                order.RefundProcessedAt
            });
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
                    (@Id, @OrderId, @Status, @ChangedByUserId, @ChangedAt, @Note);
            ";

            await using var conn = GetConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new
            {
                history.Id,
                history.OrderId,
                history.Status,
                history.ChangedByUserId,
                history.ChangedAt,
                Note = (object?)history.Note ?? DBNull.Value
            });
        }
    }
}
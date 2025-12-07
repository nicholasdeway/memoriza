using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using memoriza_backend.Helpers;
using memoriza_backend.Models.Entities;
using memoriza_backend.Repositories.Interfaces;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace memoriza_backend.Repositories.Profile
{
    public class CustomerOrderRepository : ICustomerOrderRepository
    {
        private readonly string _connectionString;

        public CustomerOrderRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        }

        // ============================================================
        // GET BY ID
        // ============================================================
        public async Task<Order?> GetByIdAsync(Guid orderId, string userId)
        {
            if (!Guid.TryParse(userId, out var userGuid))
                throw new ArgumentException("userId inválido.", nameof(userId));

            const string sql = @"
                SELECT
                    id,
                    user_id::text AS ""UserId"",
                    order_number AS ""OrderNumber"",
                    created_at AS ""CreatedAt"",
                    subtotal AS ""Subtotal"",
                    shipping_amount AS ""ShippingAmount"",
                    total AS ""TotalAmount"",
                    status AS ""Status"",
                    shipping_code AS ""ShippingCode"",
                    shipping_name AS ""ShippingName"",
                    shipping_estimated_days AS ""ShippingEstimatedDays"",
                    delivered_at AS ""DeliveredAt"",
                    tracking_code AS ""TrackingCode"",
                    tracking_company AS ""TrackingCompany"",
                    tracking_url AS ""TrackingUrl"",
                    is_refundable AS ""IsRefundable"",
                    refund_status AS ""RefundStatus"",
                    refund_reason AS ""RefundReason"",
                    refund_requested_at AS ""RefundRequestedAt"",
                    refund_processed_at AS ""RefundProcessedAt""
                FROM orders
                WHERE id = @Id AND user_id = @UserId;
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            var order = await conn.QueryFirstOrDefaultAsync<Order>(sql, new
            {
                Id = orderId,
                UserId = userGuid
            });

            if (order == null)
                return null;

            const string sqlItems = @"
                SELECT
                    id AS ""Id"",
                    order_id AS ""OrderId"",
                    product_id AS ""ProductId"",
                    product_name AS ""ProductName"",
                    thumbnail_url AS ""ThumbnailUrl"",
                    quantity AS ""Quantity"",
                    unit_price AS ""UnitPrice"",
                    subtotal AS ""Subtotal""
                FROM order_items
                WHERE order_id = @OrderId;
            ";

            var items = await conn.QueryAsync<OrderItem>(sqlItems, new { OrderId = orderId });
            order.Items = items.ToList();

            return order;
        }

        // ============================================================
        // CREATE ORDER
        // ============================================================
        public async Task CreateAsync(Order order)
        {
            if (!Guid.TryParse(order.UserId, out var userGuid))
                throw new ArgumentException("Order.UserId inválido.", nameof(order.UserId));

            const string sql = @"
                INSERT INTO orders (
                    id, order_number, user_id, created_at,
                    subtotal, shipping_amount, total, status,
                    shipping_code, shipping_name, shipping_estimated_days,
                    delivered_at,
                    tracking_code, tracking_company, tracking_url,
                    is_refundable, refund_status, refund_reason,
                    refund_requested_at, refund_processed_at
                )
                VALUES (
                    @Id, @OrderNumber, @UserId, @CreatedAt,
                    @Subtotal, @ShippingAmount, @TotalAmount, @Status,
                    @ShippingCode, @ShippingName, @ShippingEstimatedDays,
                    @DeliveredAt,
                    @TrackingCode, @TrackingCompany, @TrackingUrl,
                    @IsRefundable, @RefundStatus, @RefundReason,
                    @RefundRequestedAt, @RefundProcessedAt
                );
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.ExecuteAsync(sql, new
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                UserId = userGuid,
                CreatedAt = order.CreatedAt,
                Subtotal = order.Subtotal,
                ShippingAmount = order.ShippingAmount,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                ShippingCode = order.ShippingCode,
                ShippingName = order.ShippingName,
                ShippingEstimatedDays = order.ShippingEstimatedDays,
                DeliveredAt = order.DeliveredAt,
                TrackingCode = order.TrackingCode,
                TrackingCompany = order.TrackingCompany,
                TrackingUrl = order.TrackingUrl,
                IsRefundable = order.IsRefundable,
                RefundStatus = order.RefundStatus,
                RefundReason = order.RefundReason,
                RefundRequestedAt = order.RefundRequestedAt,
                RefundProcessedAt = order.RefundProcessedAt
            });
        }

        // ============================================================
        // ADD ITEMS
        // ============================================================
        public async Task AddOrderItemsAsync(IEnumerable<OrderItem> items)
        {
            const string sql = @"
                INSERT INTO order_items (
                    id, order_id, product_id, product_name,
                    thumbnail_url, quantity, unit_price, subtotal
                )
                VALUES (
                    @Id, @OrderId, @ProductId, @ProductName,
                    @ThumbnailUrl, @Quantity, @UnitPrice, @Subtotal
                );
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.ExecuteAsync(sql, items);
        }

        // ============================================================
        // GET USER ORDERS
        // ============================================================
        public async Task<List<Order>> GetUserOrdersAsync(string userId)
        {
            if (!Guid.TryParse(userId, out var userGuid))
                throw new ArgumentException("userId inválido.", nameof(userId));

            const string sql = @"
                SELECT
                    id,
                    user_id::text AS ""UserId"",
                    order_number AS ""OrderNumber"",
                    created_at AS ""CreatedAt"",
                    subtotal AS ""Subtotal"",
                    shipping_amount AS ""ShippingAmount"",
                    total AS ""TotalAmount"",
                    status AS ""Status"",
                    shipping_code AS ""ShippingCode"",
                    shipping_name AS ""ShippingName"",
                    shipping_estimated_days AS ""ShippingEstimatedDays"",
                    delivered_at AS ""DeliveredAt"",
                    tracking_code AS ""TrackingCode"",
                    tracking_company AS ""TrackingCompany"",
                    tracking_url AS ""TrackingUrl"",
                    is_refundable AS ""IsRefundable"",
                    refund_status AS ""RefundStatus"",
                    refund_reason AS ""RefundReason"",
                    refund_requested_at AS ""RefundRequestedAt"",
                    refund_processed_at AS ""RefundProcessedAt""
                FROM orders
                WHERE user_id = @UserId
                ORDER BY created_at DESC;
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            var orders = await conn.QueryAsync<Order>(sql, new { UserId = userGuid });

            return orders.ToList();
        }

        // ============================================================
        // UPDATE REFUND
        // ============================================================
        public async Task UpdateRefundStatusAsync(Guid orderId, string refundStatus, string? reason = null)
        {
            const string sql = @"
                UPDATE orders
                SET refund_status = @RefundStatus,
                    refund_reason = @Reason,
                    refund_processed_at = CASE
                        WHEN @RefundStatus = 'Approved' THEN NOW()
                        ELSE refund_processed_at
                    END
                WHERE id = @Id;
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.ExecuteAsync(sql, new
            {
                Id = orderId,
                RefundStatus = refundStatus,
                Reason = reason
            });
        }

        // ============================================================
        // UPDATE STATUS
        // ============================================================
        public async Task UpdateStatusAsync(Guid orderId, string newStatus)
        {
            const string sql = @"
                UPDATE orders
                SET status = @Status,
                    delivered_at = CASE
                        WHEN @Status = @Delivered THEN NOW()
                        ELSE delivered_at
                    END
                WHERE id = @Id;
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.ExecuteAsync(sql, new
            {
                Id = orderId,
                Status = newStatus,
                Delivered = OrderStatusCodes.Delivered
            });
        }

        // ============================================================
        // UPDATE TRACKING INFO (NOVO)
        // ============================================================
        public async Task UpdateTrackingInfoAsync(
            Guid orderId,
            string? trackingCode,
            string? company,
            string? url)
        {
            const string sql = @"
                UPDATE orders
                SET 
                    tracking_code = @TrackingCode,
                    tracking_company = @Company,
                    tracking_url = @Url,
                    status = @Status,
                    shipped_at = COALESCE(shipped_at, NOW())
                WHERE id = @Id;
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.ExecuteAsync(sql, new
            {
                Id = orderId,
                TrackingCode = trackingCode,
                Company = company,
                Url = url,
                Status = OrderStatusCodes.Shipped
            });
        }
    }
}
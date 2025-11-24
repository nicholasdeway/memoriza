using System;
using System.Collections.Generic;
using System.Linq;
using Dapper;
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

        public async Task<Order?> GetByIdAsync(Guid orderId, string userId)
        {
            if (!Guid.TryParse(userId, out var userGuid))
                throw new ArgumentException("userId inválido para GUID.", nameof(userId));

            const string sql = @"
                SELECT
                    id,
                    user_id::text           AS ""UserId"",
                    order_number            AS ""OrderNumber"",
                    created_at              AS ""CreatedAt"",
                    subtotal                AS ""Subtotal"",
                    shipping_amount         AS ""ShippingAmount"",
                    total                   AS ""TotalAmount"",
                    status                  AS ""Status"",
                    shipping_code           AS ""ShippingCode"",
                    shipping_name           AS ""ShippingName"",
                    shipping_estimated_days AS ""ShippingEstimatedDays"",
                    is_refundable           AS ""IsRefundable"",
                    refund_status           AS ""RefundStatus"",
                    refund_reason           AS ""RefundReason"",
                    refund_requested_at     AS ""RefundRequestedAt"",
                    refund_processed_at     AS ""RefundProcessedAt""
                FROM orders
                WHERE id = @Id
                  AND user_id = @UserId;
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
                    id            AS ""Id"",
                    order_id      AS ""OrderId"",
                    product_id    AS ""ProductId"",
                    product_name  AS ""ProductName"",
                    thumbnail_url AS ""ThumbnailUrl"",
                    quantity      AS ""Quantity"",
                    unit_price    AS ""UnitPrice"",
                    subtotal      AS ""Subtotal""
                FROM order_items
                WHERE order_id = @OrderId;
            ";

            var items = await conn.QueryAsync<OrderItem>(sqlItems, new { OrderId = orderId });
            order.Items = items.ToList();

            return order;
        }

        public async Task CreateAsync(Order order)
        {
            if (!Guid.TryParse(order.UserId, out var userGuid))
                throw new ArgumentException("Order.UserId inválido para GUID.", nameof(order.UserId));

            const string sql = @"
                INSERT INTO orders (
                    id,
                    order_number,
                    user_id,
                    created_at,
                    subtotal,
                    shipping_amount,
                    total,
                    status,
                    shipping_code,
                    shipping_name,
                    shipping_estimated_days,
                    is_refundable,
                    refund_status,
                    refund_reason,
                    refund_requested_at,
                    refund_processed_at
                )
                VALUES (
                    @Id,
                    @OrderNumber,
                    @UserId,
                    @CreatedAt,
                    @Subtotal,
                    @ShippingAmount,
                    @TotalAmount,
                    @Status,
                    @ShippingCode,
                    @ShippingName,
                    @ShippingEstimatedDays,
                    @IsRefundable,
                    @RefundStatus,
                    @RefundReason,
                    @RefundRequestedAt,
                    @RefundProcessedAt
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
                IsRefundable = order.IsRefundable,
                RefundStatus = order.RefundStatus,
                RefundReason = order.RefundReason,
                RefundRequestedAt = order.RefundRequestedAt,
                RefundProcessedAt = order.RefundProcessedAt
            });
        }

        public async Task AddOrderItemsAsync(IEnumerable<OrderItem> items)
        {
            const string sql = @"
                INSERT INTO order_items (
                    id,
                    order_id,
                    product_id,
                    product_name,
                    thumbnail_url,
                    quantity,
                    unit_price,
                    subtotal
                )
                VALUES (
                    @Id,
                    @OrderId,
                    @ProductId,
                    @ProductName,
                    @ThumbnailUrl,
                    @Quantity,
                    @UnitPrice,
                    @Subtotal
                );
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            await conn.ExecuteAsync(sql, items);
        }

        public async Task<List<Order>> GetUserOrdersAsync(string userId)
        {
            if (!Guid.TryParse(userId, out var userGuid))
                throw new ArgumentException("userId inválido para GUID.", nameof(userId));

            const string sql = @"
                SELECT
                    id,
                    user_id::text           AS ""UserId"",
                    order_number            AS ""OrderNumber"",
                    created_at              AS ""CreatedAt"",
                    subtotal                AS ""Subtotal"",
                    shipping_amount         AS ""ShippingAmount"",
                    total                   AS ""TotalAmount"",
                    status                  AS ""Status"",
                    shipping_code           AS ""ShippingCode"",
                    shipping_name           AS ""ShippingName"",
                    shipping_estimated_days AS ""ShippingEstimatedDays"",
                    is_refundable           AS ""IsRefundable"",
                    refund_status           AS ""RefundStatus"",
                    refund_reason           AS ""RefundReason"",
                    refund_requested_at     AS ""RefundRequestedAt"",
                    refund_processed_at     AS ""RefundProcessedAt""
                FROM orders
                WHERE user_id = @UserId
                ORDER BY created_at DESC;
            ";

            await using var conn = new NpgsqlConnection(_connectionString);
            var orders = await conn.QueryAsync<Order>(sql, new { UserId = userGuid });

            return orders.ToList();
        }

        public async Task UpdateRefundStatusAsync(Guid orderId, string refundStatus, string? reason = null)
        {
            const string sql = @"
                UPDATE orders
                SET refund_status       = @RefundStatus,
                    refund_reason       = @Reason,
                    refund_processed_at = CASE
                                              WHEN @RefundStatus = 'Approved' 
                                              THEN NOW() 
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
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using memoriza_backend.Helpers;
using memoriza_backend.Models.DTO.User.Orders;
using memoriza_backend.Models.DTO.User.Cart;
using memoriza_backend.Models.DTO.User.Shipping;
using memoriza_backend.Models.Entities;
using memoriza_backend.Repositories.Interfaces;

namespace memoriza_backend.Services.Profile.OrderService
{
    public class CustomerOrderService : ICustomerOrderService
    {
        private readonly ICustomerOrderRepository _orderRepository;
        private readonly ICartRepository _cartRepository;

        public CustomerOrderService(
            ICustomerOrderRepository orderRepository,
            ICartRepository cartRepository)
        {
            _orderRepository = orderRepository;
            _cartRepository = cartRepository;
        }

        /// <summary>
        /// Lista de pedidos do usuário (resumo) para tela "Meus pedidos".
        /// </summary>
        public async Task<IEnumerable<OrderSummaryForUserResponse>> GetOrdersForUserAsync(string userId)
        {
            var orders = await _orderRepository.GetUserOrdersAsync(userId);
            var now = DateTime.UtcNow;

            var result = orders.Select(order =>
            {
                var withinRefundWindow = (now - order.CreatedAt).TotalDays <= 7;
                var isRefundable = order.IsRefundable && withinRefundWindow;

                return new OrderSummaryForUserResponse
                {
                    OrderId = order.Id,
                    OrderNumber = order.OrderNumber,
                    CreatedAt = order.CreatedAt,
                    TotalAmount = order.TotalAmount,
                    Status = order.Status,
                    IsRefundable = isRefundable,
                    RefundStatus = order.RefundStatus
                };
            });

            return result;
        }

        /// <summary>
        /// Detalhe de um pedido específico do usuário.
        /// </summary>
        public async Task<OrderDetailForUserResponse?> GetOrderDetailForUserAsync(string userId, Guid orderId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId, userId);

            if (order == null)
                return null;

            var now = DateTime.UtcNow;
            var withinRefundWindow = (now - order.CreatedAt).TotalDays <= 7;
            var isRefundable = order.IsRefundable && withinRefundWindow;

            // Mapeia itens do pedido -> CartItemDto
            var itemDtos = (order.Items ?? new List<OrderItem>())
                .Select(i => new CartItemDto
                {
                    CartItemId = i.Id,
                    ProductId = i.ProductId,
                    ProductName = i.ProductName,
                    ThumbnailUrl = i.ThumbnailUrl,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice
                    // Subtotal é calculado pela propriedade do DTO (UnitPrice * Quantity)
                })
                .ToList();

            // Mapeia opção de frete -> ShippingOptionDto
            ShippingOptionDto? shippingOption = null;

            if (!string.IsNullOrWhiteSpace(order.ShippingCode) ||
                !string.IsNullOrWhiteSpace(order.ShippingName))
            {
                shippingOption = new ShippingOptionDto
                {
                    Code = order.ShippingCode,
                    Name = order.ShippingName,
                    // Você pode preencher Description depois se quiser algo mais amigável
                    Description = null,
                    Price = order.ShippingAmount,
                    EstimatedDays = order.ShippingEstimatedDays
                };
            }

            var response = new OrderDetailForUserResponse
            {
                OrderId = order.Id,
                OrderNumber = order.OrderNumber,
                CreatedAt = order.CreatedAt,
                Subtotal = order.Subtotal,
                ShippingAmount = order.ShippingAmount,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                IsRefundable = isRefundable,
                RefundStatus = order.RefundStatus,
                Items = itemDtos,
                ShippingOption = shippingOption
            };

            return response;
        }

        /// <summary>
        /// Finaliza um pedido a partir do carrinho atual do usuário.
        /// </summary>
        public async Task<ServiceResult<OrderDetailForUserResponse>> CreateOrderFromCartAsync(
            string userId,
            CreateOrderFromCartRequest request)
        {
            // 1) Buscar carrinho ativo do usuário
            var cart = await _cartRepository.GetActiveCartAsync(userId);
            if (cart == null || cart.Items == null || cart.Items.Count == 0)
            {
                return ServiceResult<OrderDetailForUserResponse>.Fail("Carrinho vazio.");
            }

            // 2) Calcular subtotal
            var subtotal = cart.Items.Sum(i => i.Subtotal);

            // 3) Calcular total
            var totalAmount = subtotal + request.ShippingAmount;

            // 4) Montar entidade Order
            var order = new Order
            {
                Id = Guid.NewGuid(),
                OrderNumber = $"MEM-{DateTime.UtcNow.Ticks}",
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                Subtotal = subtotal,
                ShippingAmount = request.ShippingAmount,
                TotalAmount = totalAmount,
                Status = "Pending",
                ShippingCode = request.ShippingCode,
                ShippingName = request.ShippingName,
                ShippingEstimatedDays = request.ShippingEstimatedDays,
                IsRefundable = true
            };

            // 5) Montar itens do pedido
            var orderItems = cart.Items.Select(i => new OrderItem
            {
                Id = Guid.NewGuid(),
                OrderId = order.Id,
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                ThumbnailUrl = i.ThumbnailUrl,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                Subtotal = i.Subtotal
            }).ToList();

            // 6) Persistir no banco
            await _orderRepository.CreateAsync(order);
            await _orderRepository.AddOrderItemsAsync(orderItems);

            // 7) Limpar itens do carrinho
            await _cartRepository.ClearCartAsync(cart.Id);

            // 8) Montar DTO de itens
            var itemDtos = orderItems
                .Select(i => new CartItemDto
                {
                    CartItemId = i.Id,
                    ProductId = i.ProductId,
                    ProductName = i.ProductName,
                    ThumbnailUrl = i.ThumbnailUrl,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice
                })
                .ToList();

            // 9) Montar DTO de frete
            ShippingOptionDto? shippingOption = null;

            if (!string.IsNullOrWhiteSpace(order.ShippingCode) ||
                !string.IsNullOrWhiteSpace(order.ShippingName))
            {
                shippingOption = new ShippingOptionDto
                {
                    Code = order.ShippingCode,
                    Name = order.ShippingName,
                    Description = null,
                    Price = order.ShippingAmount,
                    EstimatedDays = order.ShippingEstimatedDays
                };
            }

            // 10) Montar resposta
            var response = new OrderDetailForUserResponse
            {
                OrderId = order.Id,
                OrderNumber = order.OrderNumber,
                CreatedAt = order.CreatedAt,
                Subtotal = order.Subtotal,
                ShippingAmount = order.ShippingAmount,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                IsRefundable = order.IsRefundable,
                RefundStatus = order.RefundStatus,
                Items = itemDtos,
                ShippingOption = shippingOption
            };

            return ServiceResult<OrderDetailForUserResponse>.Ok(response);
        }

        /// <summary>
        /// Solicita reembolso de um pedido (RF-08).
        /// </summary>
        public async Task<ServiceResult<RefundStatusResponse>> RequestRefundAsync(
            string userId,
            RequestRefundRequest request)
        {
            var order = await _orderRepository.GetByIdAsync(request.OrderId, userId);

            if (order == null)
            {
                return ServiceResult<RefundStatusResponse>.Fail("Pedido não encontrado para este usuário.");
            }

            var now = DateTime.UtcNow;
            var withinRefundWindow = (now - order.CreatedAt).TotalDays <= 7;
            var isRefundable = order.IsRefundable && withinRefundWindow;

            if (!isRefundable)
            {
                return ServiceResult<RefundStatusResponse>.Fail(
                    "Prazo para reembolso expirado ou pedido não é elegível para reembolso."
                );
            }

            if (!string.IsNullOrEmpty(order.RefundStatus) &&
                !string.Equals(order.RefundStatus, "None", StringComparison.OrdinalIgnoreCase))
            {
                return ServiceResult<RefundStatusResponse>.Fail(
                    "Já existe uma solicitação de reembolso para este pedido."
                );
            }

            var newStatus = "Requested";
            await _orderRepository.UpdateRefundStatusAsync(order.Id, newStatus, request.Reason);

            order.RefundStatus = newStatus;
            order.RefundReason = request.Reason;
            order.RefundRequestedAt = now;
            order.RefundProcessedAt = null;

            var response = new RefundStatusResponse
            {
                OrderId = order.Id,
                Status = order.RefundStatus ?? newStatus,
                Message = order.RefundReason,
                RequestedAt = order.RefundRequestedAt ?? now,
                ProcessedAt = order.RefundProcessedAt
            };

            return ServiceResult<RefundStatusResponse>.Ok(response);
        }
    }
}
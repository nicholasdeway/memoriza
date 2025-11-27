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
using memoriza_backend.Services.Payments;
using memoriza_backend.Models.DTO.Payments;

namespace memoriza_backend.Services.Profile.OrderService
{
    public class CustomerOrderService : ICustomerOrderService
    {
        private readonly ICustomerOrderRepository _orderRepository;
        private readonly ICartRepository _cartRepository;
        private readonly IMercadoPagoService _mercadoPagoService;

        public CustomerOrderService(
            ICustomerOrderRepository orderRepository,
            ICartRepository cartRepository,
            IMercadoPagoService mercadoPagoService
        )
        {
            _orderRepository = orderRepository;
            _cartRepository = cartRepository;
            _mercadoPagoService = mercadoPagoService;
        }

        // ===========================================================
        // GET ORDERS (resumo)
        // ===========================================================
        public async Task<IEnumerable<OrderSummaryForUserResponse>> GetOrdersForUserAsync(string userId)
        {
            var orders = await _orderRepository.GetUserOrdersAsync(userId);
            var now = DateTime.UtcNow;

            return orders.Select(order =>
            {
                var withinRefundWindow = (now - order.CreatedAt).TotalDays <= 7;
                var isRefundable = order.IsRefundable && withinRefundWindow;

                return new OrderSummaryForUserResponse
                {
                    OrderId = order.Id,
                    OrderNumber = order.OrderNumber,
                    CreatedAt = order.CreatedAt,
                    TotalAmount = order.TotalAmount,

                    // 👇 traduz automaticamente para PT-BR
                    Status = OrderStatusMapper.ToDisplayLabel(order.Status),

                    IsRefundable = isRefundable,
                    RefundStatus = order.RefundStatus
                };
            });
        }

        // ===========================================================
        // GET ORDER DETAIL
        // ===========================================================
        public async Task<OrderDetailForUserResponse?> GetOrderDetailForUserAsync(string userId, Guid orderId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId, userId);
            if (order == null) return null;

            var now = DateTime.UtcNow;
            var withinRefundWindow = (now - order.CreatedAt).TotalDays <= 7;
            var isRefundable = order.IsRefundable && withinRefundWindow;

            var items = order.Items ?? new List<OrderItem>();

            var itemDtos = items.Select(i => new CartItemDto
            {
                CartItemId = i.Id,
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                ThumbnailUrl = i.ThumbnailUrl,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice
            }).ToList();

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

            return new OrderDetailForUserResponse
            {
                OrderId = order.Id,
                OrderNumber = order.OrderNumber,
                CreatedAt = order.CreatedAt,
                Subtotal = order.Subtotal,
                ShippingAmount = order.ShippingAmount,
                TotalAmount = order.TotalAmount,

                // 👇 traduz para PT-BR
                Status = OrderStatusMapper.ToDisplayLabel(order.Status),

                IsRefundable = isRefundable,
                RefundStatus = order.RefundStatus,
                Items = itemDtos,
                ShippingOption = shippingOption
            };
        }

        // ===========================================================
        // CREATE ORDER FROM CART (APENAS SALVAR)
        // ===========================================================
        public async Task<ServiceResult<OrderDetailForUserResponse>> CreateOrderFromCartAsync(
            string userId,
            CreateOrderFromCartRequest request)
        {
            var cart = await _cartRepository.GetActiveCartAsync(userId);
            if (cart == null || cart.Items == null || cart.Items.Count == 0)
                return ServiceResult<OrderDetailForUserResponse>.Fail("Carrinho vazio.");

            var subtotal = cart.Items.Sum(i => i.Subtotal);
            var totalAmount = subtotal + request.ShippingAmount;

            var order = new Order
            {
                Id = Guid.NewGuid(),
                OrderNumber = $"MEM-{DateTime.UtcNow.Ticks}",
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                Subtotal = subtotal,
                ShippingAmount = request.ShippingAmount,
                TotalAmount = totalAmount,

                // 👇 agora padronizado
                Status = OrderStatusCodes.Pending,

                ShippingCode = request.ShippingCode,
                ShippingName = request.ShippingName,
                ShippingEstimatedDays = request.ShippingEstimatedDays,
                IsRefundable = true
            };

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

            await _orderRepository.CreateAsync(order);
            await _orderRepository.AddOrderItemsAsync(orderItems);
            await _cartRepository.ClearCartAsync(cart.Id);

            var response = new OrderDetailForUserResponse
            {
                OrderId = order.Id,
                OrderNumber = order.OrderNumber,
                CreatedAt = order.CreatedAt,
                Subtotal = order.Subtotal,
                ShippingAmount = order.ShippingAmount,
                TotalAmount = order.TotalAmount,

                // 👇 traduz para PT-BR
                Status = OrderStatusMapper.ToDisplayLabel(order.Status),

                IsRefundable = order.IsRefundable,
                Items = orderItems.Select(i => new CartItemDto
                {
                    CartItemId = i.Id,
                    ProductId = i.ProductId,
                    ProductName = i.ProductName,
                    ThumbnailUrl = i.ThumbnailUrl,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice
                }).ToList()
            };

            return ServiceResult<OrderDetailForUserResponse>.Ok(response);
        }

        // ===========================================================
        // CHECKOUT + MERCADO PAGO
        // ===========================================================
        public async Task<ServiceResult<CheckoutInitResponse>> CheckoutAsync(
            string userId,
            CreateOrderFromCartRequest request)
        {
            var cart = await _cartRepository.GetActiveCartAsync(userId);
            if (cart == null || cart.Items == null || cart.Items.Count == 0)
            {
                return ServiceResult<CheckoutInitResponse>.Fail("Carrinho vazio.");
            }

            var subtotal = cart.Items.Sum(i => i.Subtotal);
            var totalAmount = subtotal + request.ShippingAmount;

            var order = new Order
            {
                Id = Guid.NewGuid(),
                OrderNumber = $"MEM-{DateTime.UtcNow.Ticks}",
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                Subtotal = subtotal,
                ShippingAmount = request.ShippingAmount,
                TotalAmount = totalAmount,

                // 👇 padronizado
                Status = OrderStatusCodes.Pending,

                ShippingCode = request.ShippingCode,
                ShippingName = request.ShippingName,
                ShippingEstimatedDays = request.ShippingEstimatedDays,
                IsRefundable = true
            };

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

            await _orderRepository.CreateAsync(order);
            await _orderRepository.AddOrderItemsAsync(orderItems);
            await _cartRepository.ClearCartAsync(cart.Id);

            var preference = await _mercadoPagoService.CreatePreferenceForOrderAsync(order, orderItems);

            if (preference == null)
            {
                return ServiceResult<CheckoutInitResponse>.Fail("Erro ao iniciar pagamento com Mercado Pago.");
            }

            var checkoutResponse = new CheckoutInitResponse
            {
                OrderId = order.Id,
                OrderNumber = order.OrderNumber,
                TotalAmount = order.TotalAmount,
                PublicKey = preference.PublicKey,
                PreferenceId = preference.PreferenceId,
                InitPoint = preference.InitPoint,
                SandboxInitPoint = preference.SandboxInitPoint
            };

            return ServiceResult<CheckoutInitResponse>.Ok(checkoutResponse);
        }

        // ===========================================================
        // REFUND REQUEST
        // ===========================================================
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
                    "Prazo para reembolso expirado ou pedido não é elegível."
                );
            }

            if (!string.IsNullOrWhiteSpace(order.RefundStatus) &&
                !string.Equals(order.RefundStatus, "None", StringComparison.OrdinalIgnoreCase))
            {
                return ServiceResult<RefundStatusResponse>.Fail(
                    "Já existe uma solicitação de reembolso."
                );
            }

            await _orderRepository.UpdateRefundStatusAsync(order.Id, "Requested", request.Reason);

            return ServiceResult<RefundStatusResponse>.Ok(new RefundStatusResponse
            {
                OrderId = order.Id,
                Status = "Requested",
                Message = request.Reason,
                RequestedAt = now
            });
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using memoriza_backend.Helpers;
using memoriza_backend.Models.DTO.Payments;
using memoriza_backend.Models.DTO.User.Cart;
using memoriza_backend.Models.DTO.User.Orders;
using memoriza_backend.Models.DTO.User.Shipping;
using memoriza_backend.Models.Entities;
using memoriza_backend.Repositories.Interfaces;
using memoriza_backend.Repositories.Profile.AddressRepository;
using memoriza_backend.Services.Payments;

namespace memoriza_backend.Services.Profile.OrderService
{
    public class CustomerOrderService : ICustomerOrderService
    {
        private readonly ICustomerOrderRepository _orderRepository;
        private readonly ICartRepository _cartRepository;
        private readonly IMercadoPagoService _mercadoPagoService;
        private readonly IAddressRepository _addressRepository;

        public CustomerOrderService(
            ICustomerOrderRepository orderRepository,
            ICartRepository cartRepository,
            IMercadoPagoService mercadoPagoService,
            IAddressRepository addressRepository
        )
        {
            _orderRepository = orderRepository;
            _cartRepository = cartRepository;
            _mercadoPagoService = mercadoPagoService;
            _addressRepository = addressRepository;
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
                var withinRefundWindow = false;

                // Só permite reembolso se estiver ENTREGUE e com DeliveredAt preenchido
                if (order.Status == OrderStatusCodes.Delivered && order.DeliveredAt.HasValue)
                {
                    withinRefundWindow = (now - order.DeliveredAt.Value).TotalDays <= 7;
                }

                var isRefundable = order.IsRefundable && withinRefundWindow;

                return new OrderSummaryForUserResponse
                {
                    OrderId = order.Id,
                    OrderNumber = order.OrderNumber,
                    CreatedAt = order.CreatedAt,
                    TotalAmount = order.TotalAmount,
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
            var withinRefundWindow = false;

            if (order.Status == OrderStatusCodes.Delivered && order.DeliveredAt.HasValue)
            {
                withinRefundWindow = (now - order.DeliveredAt.Value).TotalDays <= 7;
            }

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

            // Monta endereço de entrega a partir do snapshot
            ShippingAddressDto? shippingAddress = null;
            if (!string.IsNullOrWhiteSpace(order.ShippingStreet))
            {
                shippingAddress = new ShippingAddressDto
                {
                    Street = order.ShippingStreet,
                    Number = order.ShippingNumber,
                    Complement = order.ShippingComplement,
                    Neighborhood = order.ShippingNeighborhood,
                    City = order.ShippingCity,
                    State = order.ShippingState,
                    ZipCode = order.ShippingZipCode,
                    Country = order.ShippingCountry
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
                Status = OrderStatusMapper.ToDisplayLabel(order.Status),
                IsRefundable = isRefundable,
                RefundStatus = order.RefundStatus,
                Items = itemDtos,
                ShippingOption = shippingOption,
                ShippingAddress = shippingAddress,

                // 🔹 MAPEAMENTO DOS CAMPOS DE RASTREIO / ENTREGA
                TrackingCode = order.TrackingCode,
                TrackingCompany = order.TrackingCompany,
                TrackingUrl = order.TrackingUrl,
                DeliveredAt = order.DeliveredAt
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

            // Busca o endereço de entrega
            var address = await _addressRepository.GetByIdAsync(request.ShippingAddressId);
            if (address == null || address.UserId != userId)
                return ServiceResult<OrderDetailForUserResponse>.Fail("Endereço de entrega inválido.");

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
                Status = OrderStatusCodes.Pending,
                ShippingCode = request.ShippingCode,
                ShippingName = request.ShippingName,
                ShippingEstimatedDays = request.ShippingEstimatedDays,
                IsRefundable = true,

                // Snapshot do endereço (preserva histórico)
                ShippingAddressId = address.Id,
                ShippingStreet = address.Street,
                ShippingNumber = address.Number,
                ShippingComplement = address.Complement,
                ShippingNeighborhood = address.Neighborhood,
                ShippingCity = address.City,
                ShippingState = address.State,
                ShippingZipCode = address.ZipCode,
                ShippingCountry = address.Country,

                // Esses campos começam nulos, mas já existem na entidade
                TrackingCode = null,
                TrackingCompany = null,
                TrackingUrl = null,
                DeliveredAt = null
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
                }).ToList(),

                // 🔹 Já devolve o DTO com campos de rastreio (ainda nulos agora)
                TrackingCode = order.TrackingCode,
                TrackingCompany = order.TrackingCompany,
                TrackingUrl = order.TrackingUrl,
                DeliveredAt = order.DeliveredAt
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

            // Busca o endereço de entrega
            var address = await _addressRepository.GetByIdAsync(request.ShippingAddressId);
            if (address == null || address.UserId != userId)
                return ServiceResult<CheckoutInitResponse>.Fail("Endereço de entrega inválido.");

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
                Status = OrderStatusCodes.Pending,
                ShippingCode = request.ShippingCode,
                ShippingName = request.ShippingName,
                ShippingEstimatedDays = request.ShippingEstimatedDays,
                IsRefundable = true,

                // Snapshot do endereço (preserva histórico)
                ShippingAddressId = address.Id,
                ShippingStreet = address.Street,
                ShippingNumber = address.Number,
                ShippingComplement = address.Complement,
                ShippingNeighborhood = address.Neighborhood,
                ShippingCity = address.City,
                ShippingState = address.State,
                ShippingZipCode = address.ZipCode,
                ShippingCountry = address.Country,

                // idem: começam nulos
                TrackingCode = null,
                TrackingCompany = null,
                TrackingUrl = null,
                DeliveredAt = null
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

            // Regra 1: só pode solicitar reembolso se o pedido estiver ENTREGUE
            if (order.Status != OrderStatusCodes.Delivered)
            {
                return ServiceResult<RefundStatusResponse>.Fail(
                    "Só é possível solicitar reembolso para pedidos que já foram entregues."
                );
            }

            // Regra 2: precisa ter a data de entrega
            if (!order.DeliveredAt.HasValue)
            {
                return ServiceResult<RefundStatusResponse>.Fail(
                    "Data de entrega do pedido não registrada. Entre em contato com o suporte."
                );
            }

            var now = DateTime.UtcNow;
            var withinRefundWindow = (now - order.DeliveredAt.Value).TotalDays <= 7;
            var isRefundable = order.IsRefundable && withinRefundWindow;

            if (!isRefundable)
            {
                return ServiceResult<RefundStatusResponse>.Fail(
                    "Prazo para solicitar reembolso expirou ou o pedido não é elegível."
                );
            }

            if (!string.IsNullOrWhiteSpace(order.RefundStatus) &&
                !string.Equals(order.RefundStatus, "None", StringComparison.OrdinalIgnoreCase))
            {
                return ServiceResult<RefundStatusResponse>.Fail(
                    "Já existe uma solicitação de reembolso para este pedido."
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
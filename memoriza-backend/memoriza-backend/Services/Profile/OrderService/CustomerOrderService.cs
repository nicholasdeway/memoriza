using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using memoriza_backend.Helpers;
using memoriza_backend.Models.DTO.Payments;
using memoriza_backend.Models.DTO.User.Cart;
using memoriza_backend.Models.DTO.User.Orders;
using memoriza_backend.Models.DTO.Profile.Orders;
using memoriza_backend.Models.DTO.User.Shipping;
using memoriza_backend.Models.Entities;
using memoriza_backend.Repositories.Interfaces;
using memoriza_backend.Repositories.Profile.AddressRepository;
using memoriza_backend.Services.Payments;
using Microsoft.Extensions.Configuration;

namespace memoriza_backend.Services.Profile.OrderService
{
    public class CustomerOrderService : ICustomerOrderService
    {
        private readonly ICustomerOrderRepository _orderRepository;
        private readonly ICartRepository _cartRepository;
        private readonly IMercadoPagoService _mercadoPagoService;
        private readonly IAddressRepository _addressRepository;
        private readonly IConfiguration _configuration;

        public CustomerOrderService(
            ICustomerOrderRepository orderRepository,
            ICartRepository cartRepository,
            IMercadoPagoService mercadoPagoService,
            IAddressRepository addressRepository,
            IConfiguration configuration)
        {
            _orderRepository = orderRepository;
            _cartRepository = cartRepository;
            _mercadoPagoService = mercadoPagoService;
            _addressRepository = addressRepository;
            _configuration = configuration;
        }


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
                UnitPrice = i.UnitPrice,
                PersonalizationText = i.PersonalizationText,
                SizeId = i.SizeId,
                ColorId = i.ColorId,
                SizeName = i.SizeName,
                ColorName = i.ColorName
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

            // PAYMENT RECOVERY LOGIC
            bool canResume = false;
            bool canReopenQrCode = false;
            string? preferenceId = null;
            string? initPoint = null;
            string? sandboxInitPoint = null;

            // Só permite recuperação se o pedido estiver PENDENTE e tiver PreferenceId
            if (order.Status == OrderStatusCodes.Pending && !string.IsNullOrWhiteSpace(order.PreferenceId))
            {
                preferenceId = order.PreferenceId;
                initPoint = order.InitPoint;
                sandboxInitPoint = order.SandboxInitPoint;

                // Verifica se ainda está dentro da janela de 30 minutos
                var minutesSinceCreation = (now - order.CreatedAt).TotalMinutes;

                if (minutesSinceCreation <= 30)
                {
                    canResume = true;
                    canReopenQrCode = true; // QR Code PIX válido por 30 minutos
                }
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

                // MAPEAMENTO DOS CAMPOS DE RASTREIO / ENTREGA
                TrackingCode = order.TrackingCode,
                TrackingCompany = order.TrackingCompany,
                TrackingUrl = order.TrackingUrl,
                DeliveredAt = order.DeliveredAt,

                // PAYMENT RECOVERY FIELDS
                PreferenceId = preferenceId,
                InitPoint = initPoint,
                SandboxInitPoint = sandboxInitPoint,
                CanResume = canResume,
                CanReopenQrCode = canReopenQrCode
            };
        }

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
                ShippingPhone = request.ShippingPhone,

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
                Subtotal = i.Subtotal,
                PersonalizationText = i.PersonalizationText,
                SizeId = i.SizeId,
                ColorId = i.ColorId,
                SizeName = i.SizeName,
                ColorName = i.ColorName
            }).ToList();



            await _orderRepository.CreateAsync(order);
            await _orderRepository.AddOrderItemsAsync(orderItems);
            
            // ✅ Carrinho limpo IMEDIATAMENTE após criar o pedido
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
                    UnitPrice = i.UnitPrice,
                    PersonalizationText = i.PersonalizationText,
                    SizeId = i.SizeId,
                    ColorId = i.ColorId,
                    SizeName = i.SizeName,
                    ColorName = i.ColorName
                }).ToList(),

                TrackingCode = order.TrackingCode,
                TrackingCompany = order.TrackingCompany,
                TrackingUrl = order.TrackingUrl,
                DeliveredAt = order.DeliveredAt
            };

            return ServiceResult<OrderDetailForUserResponse>.Ok(response);
        }

        public async Task<ServiceResult<ProcessPaymentResponse>> ProcessPaymentAsync(
            Guid orderId,
            ProcessPaymentRequest request)
        {
            try
            {
                var response = await _mercadoPagoService.ProcessPaymentAsync(orderId, request);

                return ServiceResult<ProcessPaymentResponse>.Ok(response);
            }
            catch (InvalidOperationException ex)
            {
                return ServiceResult<ProcessPaymentResponse>.Fail(ex.Message);
            }
            catch (Exception ex)
            {

                return ServiceResult<ProcessPaymentResponse>.Fail($"Erro ao processar pagamento: {ex.Message}");
            }
        }

        private async Task ClearUserCart(string userId)
        {
            try 
            {
                var cart = await _cartRepository.GetActiveCartAsync(userId);
                if (cart != null)
                {
                    await _cartRepository.ClearCartAsync(cart.Id);

                }
            }
            catch (Exception ex)
            {

            }
        }

        public async Task<ServiceResult<ProcessPaymentResponse>> ProcessCardPaymentAsync(
            Guid orderId,
            CardPaymentRequest request)
        {
            var processRequest = new ProcessPaymentRequest
            {
                Token = request.Token,
                PaymentMethodId = request.PaymentMethodId,
                Installments = request.Installments,
                IssuerId = request.IssuerId,
                Payer = new PaymentPayerRequest
                {
                    Email = request.Payer.Email,
                    Identification = new IdentificationRequest
                    {
                        Type = request.Payer.Identification.Type,
                        Number = request.Payer.Identification.Number
                    }
                }
            };
            return await ProcessPaymentAsync(orderId, processRequest);
        }


        public async Task<ServiceResult<RefundStatusResponse>> RequestRefundAsync(
            string userId,
            RequestRefundRequest request)
        {
            var order = await _orderRepository.GetByIdAsync(request.OrderId, userId);

            if (order == null)
            {
                return ServiceResult<RefundStatusResponse>.Fail("Pedido não encontrado para este usuário.");
            }


            if (order.Status != OrderStatusCodes.Delivered)
            {
                return ServiceResult<RefundStatusResponse>.Fail(
                    "Só é possível solicitar reembolso para pedidos que já foram entregues."
                );
            }


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

        public async Task<int> CancelExpiredOrdersAsync()
        {
            // Ler configuração do appsettings.json
            double expirationHours = _configuration.GetValue<double>("OrderCancellation:ExpirationHours", 24);
            

            
            var expiredOrders = await _orderRepository.GetExpiredPendingOrdersAsync(expirationHours);
            
            if (expiredOrders == null || expiredOrders.Count == 0) return 0;
            
            int canceledCount = 0;
            foreach (var order in expiredOrders)
            {
                try
                {
                    await _orderRepository.UpdateStatusAsync(order.Id, OrderStatusCodes.Cancelled);
                    canceledCount++;

                }
                catch (Exception ex)
                {

                }
            }
            return canceledCount;
        }
    }
}
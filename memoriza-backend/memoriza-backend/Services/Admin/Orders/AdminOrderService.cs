using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using memoriza_backend.Helpers;
using memoriza_backend.Models.Admin;
using memoriza_backend.Models.DTO.Admin.Order;
using memoriza_backend.Repositories.Admin.Orders;
using memoriza_backend.Repositories.Interfaces;

namespace memoriza_backend.Services.Admin.Orders
{
    public class AdminOrderService : IAdminOrderService
    {
        private readonly IAdminOrderRepository _repository;
        private readonly ICustomerOrderRepository _customerOrderRepository;
        private readonly Microsoft.Extensions.Logging.ILogger<AdminOrderService> _logger;

        public AdminOrderService(
            IAdminOrderRepository repository,
            ICustomerOrderRepository customerOrderRepository,
            Microsoft.Extensions.Logging.ILogger<AdminOrderService> logger)
        {
            _repository = repository;
            _customerOrderRepository = customerOrderRepository;
            _logger = logger;
        }

        // LISTA DE PEDIDOS
        public async Task<IReadOnlyList<OrderListItemDto>> GetAllAsync()
        {
            var orders = await _repository.GetAllAsync();

            if (orders.Any())
            {
                var first = orders.First();
                _logger.LogInformation("AdminOrderService.GetAllAsync: Retrieved {Count} orders. First Order Id={Id}, TotalAmount={Total}, Subtotal={Subtotal}", 
                    orders.Count, first.Id, first.TotalAmount, first.Subtotal);
            }
            else 
            {
                _logger.LogInformation("AdminOrderService.GetAllAsync: No orders found.");
            }

            return orders.Select(o => new OrderListItemDto
            {
                Id = o.Id,
                OrderNumber = o.OrderNumber,
                CustomerName = o.CustomerName,
                Subtotal = o.Subtotal,
                FreightValue = o.ShippingAmount,
                Total = o.TotalAmount,
                Status = o.Status,
                CreatedAt = o.CreatedAt,
                TrackingCode = o.TrackingCode,
                TrackingCompany = o.TrackingCompany,
                TrackingUrl = o.TrackingUrl,
                RefundStatus = o.RefundStatus
            }).ToList();
        }

        // DETALHE DO PEDIDO
        public async Task<OrderDetailDto?> GetByIdAsync(Guid id)
        {
            var order = await _repository.GetByIdAsync(id);
            if (order == null) return null;

            var items = await _repository.GetItemsByOrderIdAsync(id);

            return new OrderDetailDto
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                UserId = order.UserId,
                CustomerName = order.CustomerName,
                CustomerEmail = order.CustomerEmail,
                CustomerPhone = order.CustomerPhone,
                Subtotal = order.Subtotal,
                FreightValue = order.ShippingAmount,
                Total = order.TotalAmount,
                Status = order.Status,
                PersonalizationNotes = order.PersonalizationNotes,
                CreatedAt = order.CreatedAt,
                TrackingCode = order.TrackingCode,
                TrackingCompany = order.TrackingCompany,
                TrackingUrl = order.TrackingUrl,
                DeliveredAt = order.DeliveredAt,
                IsRefundable = order.IsRefundable,
                RefundStatus = order.RefundStatus,
                RefundReason = order.RefundReason,
                RefundRequestedAt = order.RefundRequestedAt,
                RefundProcessedAt = order.RefundProcessedAt,
                ShippingAddressId = order.ShippingAddressId,
                ShippingStreet = order.ShippingStreet,
                ShippingNumber = order.ShippingNumber,
                ShippingComplement = order.ShippingComplement,
                ShippingNeighborhood = order.ShippingNeighborhood,
                ShippingCity = order.ShippingCity,
                ShippingState = order.ShippingState,
                ShippingZipCode = order.ShippingZipCode,
                ShippingCountry = order.ShippingCountry,
                ShippingPhone = order.ShippingPhone,
                Items = items.Select(i => new OrderItemDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.ProductName,
                    UnitPrice = i.UnitPrice,
                    Quantity = i.Quantity,
                    LineTotal = i.UnitPrice * i.Quantity,
                    PersonalizationText = i.PersonalizationText,
                    SizeId = i.SizeId,
                    ColorId = i.ColorId,
                    SizeName = i.SizeName,
                    ColorName = i.ColorName
                }).ToList()
            };
        }

        public async Task<IReadOnlyList<OrderItemDto>> GetItemsAsync(Guid orderId)
        {
            var items = await _repository.GetItemsByOrderIdAsync(orderId);

            return items.Select(i => new OrderItemDto
            {
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                UnitPrice = i.UnitPrice,
                Quantity = i.Quantity,
                LineTotal = i.UnitPrice * i.Quantity,
                PersonalizationText = i.PersonalizationText,
                SizeId = i.SizeId,
                ColorId = i.ColorId,
                SizeName = i.SizeName,
                ColorName = i.ColorName
            }).ToList();
        }

        // ATUALIZAÇÃO DE DADOS DO PEDIDO
        public async Task UpdateAsync(Guid id, AdminUpdateOrderDto dto)
        {
            var order = await _repository.GetByIdAsync(id);
            if (order == null)
                throw new ApplicationException("Pedido não encontrado.");

            order.Subtotal = dto.Subtotal;
            order.ShippingAmount = dto.FreightValue;
            order.TotalAmount = dto.Total;
            order.Status = dto.Status;
            order.PersonalizationNotes = dto.PersonalizationNotes;

            await _repository.UpdateAsync(order);
        }

        // ATUALIZAÇÃO DE STATUS (usa código string)
        public async Task UpdateStatusAsync(
            Guid id,
            string newStatusCode,
            Guid adminUserId,
            string? note)
        {
            var order = await _repository.GetByIdAsync(id);
            if (order == null)
                throw new ApplicationException("Pedido não encontrado.");


            order.Status = newStatusCode;

            if (newStatusCode == OrderStatusCodes.Delivered)
                order.DeliveredAt = DateTime.UtcNow;

            // Updated to use UpdateStatusOnlyAsync to avoid overwriting financial fields (bug fix)
            await _repository.UpdateStatusOnlyAsync(order.Id, newStatusCode, order.DeliveredAt);

            await _repository.AddStatusHistoryAsync(new OrderStatusHistory
            {
                OrderId = order.Id,
                Status = newStatusCode,
                ChangedByUserId = adminUserId,
                Note = note
            });
        }

        // UPDATE TRACKING INFO
        public async Task UpdateTrackingAsync(Guid orderId, OrderDetailDto dto)
        {
            await _customerOrderRepository.UpdateTrackingInfoAsync(
                orderId,
                dto.TrackingCode ?? string.Empty,
                dto.TrackingCompany ?? string.Empty,
                dto.TrackingUrl ?? string.Empty
            );
        }

        // REFUND MANAGEMENT
        public async Task ApproveRefundAsync(Guid orderId, RefundDecisionDto dto)
        {
            var order = await _repository.GetByIdAsync(orderId);
            if (order == null) throw new ApplicationException("Pedido não encontrado.");

            order.RefundStatus = "Approved";
            order.RefundProcessedAt = DateTime.UtcNow;
            order.Status = OrderStatusCodes.Refunded;

            await _repository.UpdateAsync(order);

            await _repository.AddStatusHistoryAsync(new OrderStatusHistory
            {
                OrderId = order.Id,
                Status = OrderStatusCodes.Refunded,
                ChangedByUserId = dto.AdminUserId,
                Note = "Reembolso aprovado" + (string.IsNullOrWhiteSpace(dto.Note) ? "" : $": {dto.Note}")
            });
        }

        public async Task RejectRefundAsync(Guid orderId, RefundDecisionDto dto)
        {
            var order = await _repository.GetByIdAsync(orderId);
            if (order == null) throw new ApplicationException("Pedido não encontrado.");

            order.RefundStatus = "Rejected";
            order.RefundProcessedAt = DateTime.UtcNow;
            // Status do pedido não muda (continua Delivered)

            await _repository.UpdateAsync(order);

            await _repository.AddStatusHistoryAsync(new OrderStatusHistory
            {
                OrderId = order.Id,
                Status = order.Status,
                ChangedByUserId = dto.AdminUserId,
                Note = "Reembolso recusado" + (string.IsNullOrWhiteSpace(dto.Note) ? "" : $": {dto.Note}")
            });
        }

        public async Task<int> GetPaidOrdersCountAsync()
        {
            return await _repository.GetCountByStatusAsync(OrderStatusCodes.Paid);
        }
    }
}
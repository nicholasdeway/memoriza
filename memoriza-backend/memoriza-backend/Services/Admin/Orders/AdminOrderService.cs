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

        public AdminOrderService(
            IAdminOrderRepository repository,
            ICustomerOrderRepository customerOrderRepository)
        {
            _repository = repository;
            _customerOrderRepository = customerOrderRepository;
        }

        // LISTA DE PEDIDOS
        public async Task<IReadOnlyList<OrderListItemDto>> GetAllAsync()
        {
            var orders = await _repository.GetAllAsync();

            return orders.Select(o => new OrderListItemDto
            {
                Id = o.Id,
                CustomerName = o.CustomerName,
                Subtotal = o.Subtotal,
                FreightValue = o.ShippingAmount,
                Total = o.TotalAmount,
                Status = o.Status,
                CreatedAt = o.CreatedAt,
                TrackingCode = o.TrackingCode,
                TrackingCompany = o.TrackingCompany,
                TrackingUrl = o.TrackingUrl
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
                UserId = order.UserId,
                CustomerName = order.CustomerName,
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
                ShippingAddressId = order.ShippingAddressId,
                ShippingStreet = order.ShippingStreet,
                ShippingNumber = order.ShippingNumber,
                ShippingComplement = order.ShippingComplement,
                ShippingNeighborhood = order.ShippingNeighborhood,
                ShippingCity = order.ShippingCity,
                ShippingState = order.ShippingState,
                ShippingZipCode = order.ShippingZipCode,
                ShippingCountry = order.ShippingCountry,
                Items = items.Select(i => new OrderItemDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.ProductName,
                    UnitPrice = i.UnitPrice,
                    Quantity = i.Quantity,
                    LineTotal = i.UnitPrice * i.Quantity
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
                LineTotal = i.UnitPrice * i.Quantity
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

            await _repository.UpdateAsync(order);

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
    }
}
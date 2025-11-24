using System;
using System.Collections.Generic;
using System.Linq; // necessário para .Select
using System.Threading.Tasks;
using memoriza_backend.Models.Admin;
using memoriza_backend.Models.DTO.Admin;
using memoriza_backend.Repositories.Admin.Orders;

namespace memoriza_backend.Services.Admin.Orders
{
    public class AdminOrderService : IAdminOrderService
    {
        private readonly IAdminOrderRepository _repository;

        public AdminOrderService(IAdminOrderRepository repository)
        {
            _repository = repository;
        }

        // =====================================================
        // GET ALL (LISTAGEM)
        // =====================================================
        public async Task<IReadOnlyList<OrderListItemDto>> GetAllAsync()
        {
            var orders = await _repository.GetAllAsync();

            return orders
                .Select(o => new OrderListItemDto
                {
                    Id = o.Id,
                    // A entidade Order não tem CustomerName.
                    // Se quiser esse dado, depois fazemos JOIN com users.
                    CustomerName = string.Empty,
                    Total = o.Total,
                    Status = o.Status,
                    CreatedAt = o.CreatedAt
                })
                .ToList();
        }

        // =====================================================
        // GET DETAIL
        // =====================================================
        public async Task<OrderDetailDto?> GetByIdAsync(Guid id)
        {
            var order = await _repository.GetByIdAsync(id);
            if (order == null) return null;

            var items = await _repository.GetItemsByOrderIdAsync(id);

            return new OrderDetailDto
            {
                Id = order.Id,
                UserId = order.UserId,
                // Mesmo caso aqui: entidade não tem CustomerName
                CustomerName = string.Empty,
                Subtotal = order.Subtotal,
                FreightValue = order.FreightValue,
                Total = order.Total,
                Status = order.Status,
                PersonalizationNotes = order.PersonalizationNotes,
                CreatedAt = order.CreatedAt,
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

        // =====================================================
        // GET ITEMS
        // =====================================================
        public async Task<IReadOnlyList<OrderItemDto>> GetItemsAsync(Guid orderId)
        {
            var items = await _repository.GetItemsByOrderIdAsync(orderId);

            return items
                .Select(i => new OrderItemDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.ProductName,
                    UnitPrice = i.UnitPrice,
                    Quantity = i.Quantity,
                    LineTotal = i.UnitPrice * i.Quantity
                })
                .ToList();
        }

        // =====================================================
        // UPDATE ORDER (USANDO DTO)
        // =====================================================
        public async Task UpdateAsync(Guid id, AdminUpdateOrderDto dto)
        {
            var order = await _repository.GetByIdAsync(id);
            if (order == null)
                throw new ApplicationException("Pedido não encontrado.");

            // Atualizamos só o que faz sentido o admin alterar diretamente
            order.FreightValue = dto.FreightValue;
            order.PersonalizationNotes = dto.PersonalizationNotes;

            // Total continua sendo Subtotal + Frete
            order.Total = order.Subtotal + order.FreightValue;

            await _repository.UpdateAsync(order);
        }

        // =====================================================
        // UPDATE STATUS
        // =====================================================
        public async Task UpdateStatusAsync(
            Guid id,
            OrderStatus status,
            Guid adminUserId,
            string? note)
        {
            var order = await _repository.GetByIdAsync(id);
            if (order == null)
                throw new ApplicationException("Pedido não encontrado.");

            switch (status)
            {
                case OrderStatus.PagamentoConfirmado:
                    order.PaidAt = DateTime.UtcNow;
                    break;

                case OrderStatus.ACaminho:
                    order.ShippedAt = DateTime.UtcNow;
                    break;

                case OrderStatus.Finalizado:
                    order.FinishedAt = DateTime.UtcNow;
                    break;

                case OrderStatus.Reembolsado:
                    order.RefundedAt = DateTime.UtcNow;
                    break;
            }

            order.Status = status;

            await _repository.UpdateAsync(order);

            var history = new OrderStatusHistory
            {
                OrderId = order.Id,
                Status = status,
                ChangedByUserId = adminUserId,
                Note = note
            };

            await _repository.AddStatusHistoryAsync(history);
        }
    }
}
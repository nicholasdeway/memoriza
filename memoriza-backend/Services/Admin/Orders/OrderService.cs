using memoriza_backend.Models.Admin;
using memoriza_backend.Repositories.Admin.Orders;

namespace memoriza_backend.Services.Admin.Orders
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _repository;

        public OrderService(IOrderRepository repository)
        {
            _repository = repository;
        }

        // =====================================================
        // GET ALL
        // =====================================================
        public Task<IReadOnlyList<Order>> GetAllAsync()
            => _repository.GetAllAsync();

        // =====================================================
        // GET BY ID
        // =====================================================
        public Task<Order?> GetByIdAsync(Guid id)
            => _repository.GetByIdAsync(id);

        // =====================================================
        // GET ORDER ITEMS
        // =====================================================
        public Task<IReadOnlyList<OrderItem>> GetItemsAsync(Guid orderId)
            => _repository.GetItemsByOrderIdAsync(orderId);

        // =====================================================
        // UPDATE ORDER (dados gerais)
        // =====================================================
        public Task UpdateAsync(Order order)
            => _repository.UpdateAsync(order);


        // =====================================================
        // UPDATE STATUS + HISTORY (RF-11 e RF-13)
        // =====================================================
        public async Task UpdateStatusAsync(
            Guid orderId,
            OrderStatus newStatus,
            Guid adminUserId,
            string? note = null)
        {
            var order = await _repository.GetByIdAsync(orderId);

            if (order == null)
                throw new ApplicationException("Pedido não encontrado.");

            // Atualiza data baseada no status
            switch (newStatus)
            {
                case OrderStatus.PagamentoConfirmado:
                    order.PaidAt = DateTime.UtcNow;
                    break;

                case OrderStatus.EmProducao:
                    // sem timestamp específico
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

            order.Status = newStatus;

            // 1) atualizar o pedido
            await _repository.UpdateAsync(order);

            // 2) registrar histórico
            var history = new OrderStatusHistory
            {
                OrderId = orderId,
                Status = newStatus,
                ChangedByUserId = adminUserId,
                Note = note
            };

            await _repository.AddStatusHistoryAsync(history);
        }
    }
}
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EntityOrder = memoriza_backend.Models.Entities.Order;
using AdminOrderItem = memoriza_backend.Models.Admin.OrderItem;
using AdminOrderStatusHistory = memoriza_backend.Models.Admin.OrderStatusHistory;

namespace memoriza_backend.Repositories.Admin.Orders
{
    public interface IAdminOrderRepository
    {
        Task<IReadOnlyList<EntityOrder>> GetAllAsync();
        Task<EntityOrder?> GetByIdAsync(Guid id);
        Task<IReadOnlyList<AdminOrderItem>> GetItemsByOrderIdAsync(Guid orderId);
        Task UpdateAsync(EntityOrder order);
        Task AddStatusHistoryAsync(AdminOrderStatusHistory history);
    }
}
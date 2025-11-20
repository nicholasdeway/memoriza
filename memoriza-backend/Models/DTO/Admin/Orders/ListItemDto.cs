using memoriza_backend.Models.Admin;

namespace memoriza_backend.Models.DTO.Admin.Orders
{
    public class OrderListItemDto
    {
        public Guid Id { get; set; }
        public string CustomerName { get; set; } = string.Empty; // pode vir do join com Users
        public decimal Total { get; set; }
        public OrderStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class OrderItemDto
    {
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = null!;
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal LineTotal { get; set; }
    }

    public class OrderDetailDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public decimal Subtotal { get; set; }
        public decimal FreightValue { get; set; }
        public decimal Total { get; set; }
        public OrderStatus Status { get; set; }
        public string? PersonalizationNotes { get; set; }
        public DateTime CreatedAt { get; set; }

        public List<OrderItemDto> Items { get; set; } = new();
    }

    public class UpdateOrderStatusDto
    {
        public OrderStatus NewStatus { get; set; }
        public string? Note { get; set; }
    }

    public class UpdatePersonalizationNotesDto
    {
        public string Notes { get; set; } = string.Empty;
    }

    public class RefundRequestDto
    {
        public string Reason { get; set; } = string.Empty;
    }
}
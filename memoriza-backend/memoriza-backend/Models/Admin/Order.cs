using memoriza_backend.Helpers;

namespace memoriza_backend.Models.Admin
{
    public class OrderItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string UserId { get; set; } = string.Empty;
        public Guid ProductId { get; set; }

        public string ProductName { get; set; } = null!;
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }

        public decimal Subtotal { get; set; }

        public string? PersonalizationText { get; set; }
        public int? SizeId { get; set; }
        public int? ColorId { get; set; }
        public string? SizeName { get; set; }
        public string? ColorName { get; set; }
    }

    public class OrderStatusHistory
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid OrderId { get; set; }

        public string Status { get; set; } = OrderStatusCodes.Pending;

        public Guid ChangedByUserId { get; set; }
        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
        public string? Note { get; set; }
    }
}
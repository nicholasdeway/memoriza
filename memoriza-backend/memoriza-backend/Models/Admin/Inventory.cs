namespace memoriza_backend.Models.Admin
{
    public class InventoryItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = null!;
        public string? Unit { get; set; }
        public decimal CurrentQuantity { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class InventoryMovement
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid InventoryItemId { get; set; }

        public decimal Quantity { get; set; }

        public string Type { get; set; } = null!;
        public string? Reason { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
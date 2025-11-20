namespace memoriza_backend.Models.Admin
{
    public class InventoryItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = null!;  // Ex: “Papel A4 180g Branco”
        public string? Unit { get; set; }          // Ex: “unid”, “pct”, “m”
        public decimal CurrentQuantity { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class InventoryMovement
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid InventoryItemId { get; set; }

        // Entrada > 0 / Saída < 0
        public decimal Quantity { get; set; }

        public string Type { get; set; } = null!;  // “Entrada” ou “Saída”
        public string? Reason { get; set; }        // Ex: “Produção pedido #123”
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
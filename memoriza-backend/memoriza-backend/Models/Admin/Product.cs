namespace memoriza_backend.Models.Admin
{
    public class Product
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid CategoryId { get; set; }

        public string Name { get; set; } = null!;

        public string? Description { get; set; }

        public decimal Price { get; set; }

        public decimal? PromotionalPrice { get; set; }

        public bool IsPersonalizable { get; set; } = true;

        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<ProductImage> Images { get; set; } = new();
    }
}
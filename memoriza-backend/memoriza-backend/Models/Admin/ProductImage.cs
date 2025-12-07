namespace memoriza_backend.Models.Admin
{
    public class ProductImage
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ProductId { get; set; }

        public string Url { get; set; } = null!;

        public string? AltText { get; set; }

        public bool IsPrimary { get; set; } = false;

        public int DisplayOrder { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
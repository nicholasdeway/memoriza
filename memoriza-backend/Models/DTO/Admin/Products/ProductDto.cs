namespace memoriza_backend.Models.DTO.Admin.Products
{
    public class CreateProductDto
    {
        public Guid CategoryId { get; set; }

        public string Name { get; set; } = null!;
        public string? Description { get; set; }

        public decimal Price { get; set; }

        public bool IsPersonalizable { get; set; } = true;
        public bool IsActive { get; set; } = true;
    }

    public class UpdateProductDto
    {
        public Guid CategoryId { get; set; }

        public string Name { get; set; } = null!;
        public string? Description { get; set; }

        public decimal Price { get; set; }

        public bool IsPersonalizable { get; set; } = true;
        public bool IsActive { get; set; } = true;
    }

    public class ProductResponseDto
    {
        public Guid Id { get; set; }
        public Guid CategoryId { get; set; }

        public string Name { get; set; } = null!;
        public string? Description { get; set; }

        public decimal Price { get; set; }

        public bool IsPersonalizable { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }

        public List<ProductImageDto> Images { get; set; } = new();
    }

    // ---------- IMAGENS ----------

    public class ProductImageDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }

        public string Url { get; set; } = null!;
        public string? AltText { get; set; }

        public bool IsPrimary { get; set; }
        public int DisplayOrder { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateProductImageDto
    {
        public string Url { get; set; } = null!;
        public string? AltText { get; set; }

        public bool IsPrimary { get; set; }
        public int DisplayOrder { get; set; } = 0;
    }
}
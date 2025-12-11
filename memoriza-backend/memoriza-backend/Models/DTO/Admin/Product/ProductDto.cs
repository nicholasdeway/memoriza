using System;
using System.Collections.Generic;

namespace memoriza_backend.Models.DTO.Admin.Product
{
    public class CreateProductDto
    {
        public Guid CategoryId { get; set; }

        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public decimal? PromotionalPrice { get; set; }
        public List<int> SizeIds { get; set; } = new();
        public List<int> ColorIds { get; set; } = new();
        
        // Opcional: preços específicos por tamanho
        public List<UpdateProductSizePriceDto>? SizePrices { get; set; }
        
        public bool IsPersonalizable { get; set; } = false;
        public bool IsActive { get; set; } = true;
    }

    public class UpdateProductDto
    {
        public Guid CategoryId { get; set; }

        public string Name { get; set; } = null!;
        public string? Description { get; set; }

        public decimal Price { get; set; }
        public decimal? PromotionalPrice { get; set; }

        public List<int> SizeIds { get; set; } = new();
        public List<int> ColorIds { get; set; } = new();

        // Opcional: preços específicos por tamanho
        public List<UpdateProductSizePriceDto>? SizePrices { get; set; }

        public bool IsPersonalizable { get; set; } = false;
        public bool IsActive { get; set; } = true;
    }

    public class ProductResponseDto
    {
        public Guid Id { get; set; }
        public Guid CategoryId { get; set; }

        public string Name { get; set; } = null!;
        public string? Description { get; set; }

        public decimal Price { get; set; }
        public decimal? PromotionalPrice { get; set; }

        public List<int> SizeIds { get; set; } = new();
        public List<int> ColorIds { get; set; } = new();

        // Nova propriedade: tamanhos com preços específicos
        public List<ProductSizeDto> Sizes { get; set; } = new();

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
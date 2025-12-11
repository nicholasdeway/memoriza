using System;

namespace memoriza_backend.Models.DTO.Admin.Product
{
    /// <summary>
    /// DTO para representar um tamanho com preços específicos (opcional)
    /// </summary>
    public class ProductSizeDto
    {
        public int SizeId { get; set; }
        public string SizeName { get; set; } = null!;
        
        /// <summary>
        /// Preço específico para este tamanho. Se NULL, usa o preço base do produto.
        /// </summary>
        public decimal? Price { get; set; }
        
        /// <summary>
        /// Preço promocional específico para este tamanho. Se NULL, usa o preço promocional base do produto.
        /// </summary>
        public decimal? PromotionalPrice { get; set; }
    }

    /// <summary>
    /// DTO para atualizar preços de um tamanho específico
    /// </summary>
    public class UpdateProductSizePriceDto
    {
        public int SizeId { get; set; }
        public decimal? Price { get; set; }
        public decimal? PromotionalPrice { get; set; }
    }
}

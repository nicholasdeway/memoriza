namespace memoriza_backend.Models.Admin
{
    public class ProductImage
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ProductId { get; set; }

        // URL pública da imagem (armazenada no storage/CDN)
        public string Url { get; set; } = null!;

        // Texto alternativo para acessibilidade / SEO
        public string? AltText { get; set; }

        // Se é a imagem principal do produto
        public bool IsPrimary { get; set; } = false;

        // Ordem de exibição (1, 2, 3...)
        public int DisplayOrder { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
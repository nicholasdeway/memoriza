using memoriza_backend.Models.Admin;
using memoriza_backend.Models.DTO.Admin.Products;
using memoriza_backend.Repositories.Admin.Products;

namespace memoriza_backend.Services.Admin.Products
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly IProductImageRepository _imageRepository;

        public ProductService(
            IProductRepository productRepository,
            IProductImageRepository imageRepository)
        {
            _productRepository = productRepository;
            _imageRepository = imageRepository;
        }

        // ================== HELPERS ==================

        private static ProductResponseDto MapToDto(Product product, IReadOnlyList<ProductImage>? images = null)
        {
            return new ProductResponseDto
            {
                Id = product.Id,
                CategoryId = product.CategoryId,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                IsPersonalizable = product.IsPersonalizable,
                IsActive = product.IsActive,
                CreatedAt = product.CreatedAt,
                Images = (images ?? Array.Empty<ProductImage>())
                    .Select(i => new ProductImageDto
                    {
                        Id = i.Id,
                        ProductId = i.ProductId,
                        Url = i.Url,
                        AltText = i.AltText,
                        IsPrimary = i.IsPrimary,
                        DisplayOrder = i.DisplayOrder,
                        CreatedAt = i.CreatedAt
                    })
                    .ToList()
            };
        }

        // ================== PRODUTOS ==================

        public async Task<IReadOnlyList<ProductResponseDto>> GetAllAsync()
        {
            var products = await _productRepository.GetAllAsync();

            // se quiser carregar imagens de todos, pode fazer por produto,
            // mas isso é N+1. Pra projeto pequeno ok; pra otimizar, depois
            // fazemos join em SQL.
            var result = new List<ProductResponseDto>();

            foreach (var p in products)
            {
                var images = await _imageRepository.GetByProductIdAsync(p.Id);
                result.Add(MapToDto(p, images));
            }

            return result;
        }

        public async Task<ProductResponseDto?> GetByIdAsync(Guid id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null) return null;

            var images = await _imageRepository.GetByProductIdAsync(id);
            return MapToDto(product, images);
        }

        public async Task<ProductResponseDto> CreateAsync(CreateProductDto dto)
        {
            var product = new Product
            {
                Id = Guid.NewGuid(),
                CategoryId = dto.CategoryId,
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                IsPersonalizable = dto.IsPersonalizable,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            product = await _productRepository.CreateAsync(product);

            return MapToDto(product);
        }

        public async Task<ProductResponseDto> UpdateAsync(Guid id, UpdateProductDto dto)
        {
            var existing = await _productRepository.GetByIdAsync(id);
            if (existing == null)
                throw new ApplicationException("Produto não encontrado.");

            existing.CategoryId = dto.CategoryId;
            existing.Name = dto.Name;
            existing.Description = dto.Description;
            existing.Price = dto.Price;
            existing.IsPersonalizable = dto.IsPersonalizable;
            existing.IsActive = dto.IsActive;

            await _productRepository.UpdateAsync(existing);

            var images = await _imageRepository.GetByProductIdAsync(id);
            return MapToDto(existing, images);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _productRepository.DeleteAsync(id);
            // Se quiser, pode fazer também:
            // await _imageRepository.DeleteAllByProductIdAsync(id);
        }

        // ================== IMAGENS ==================

        public async Task<IReadOnlyList<ProductImageDto>> GetImagesAsync(Guid productId)
        {
            var images = await _imageRepository.GetByProductIdAsync(productId);

            return images
                .Select(i => new ProductImageDto
                {
                    Id = i.Id,
                    ProductId = i.ProductId,
                    Url = i.Url,
                    AltText = i.AltText,
                    IsPrimary = i.IsPrimary,
                    DisplayOrder = i.DisplayOrder,
                    CreatedAt = i.CreatedAt
                })
                .ToList();
        }

        public async Task<ProductImageDto> AddImageAsync(Guid productId, CreateProductImageDto dto)
        {
            // opcional: validar se o produto existe
            var product = await _productRepository.GetByIdAsync(productId);
            if (product == null)
                throw new ApplicationException("Produto não encontrado.");

            var image = new ProductImage
            {
                Id = Guid.NewGuid(),
                ProductId = productId,
                Url = dto.Url,
                AltText = dto.AltText,
                IsPrimary = dto.IsPrimary,
                DisplayOrder = dto.DisplayOrder,
                CreatedAt = DateTime.UtcNow
            };

            image = await _imageRepository.CreateAsync(image);

            return new ProductImageDto
            {
                Id = image.Id,
                ProductId = image.ProductId,
                Url = image.Url,
                AltText = image.AltText,
                IsPrimary = image.IsPrimary,
                DisplayOrder = image.DisplayOrder,
                CreatedAt = image.CreatedAt
            };
        }

        public async Task DeleteImageAsync(Guid imageId)
        {
            await _imageRepository.DeleteAsync(imageId);
        }
    }
}
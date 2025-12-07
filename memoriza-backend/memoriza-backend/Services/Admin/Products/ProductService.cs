using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using memoriza_backend.Models.Admin;
using memoriza_backend.Models.DTO.Admin.Product;
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

        private static ProductResponseDto MapToDto(
            Product product,
            IReadOnlyList<ProductImage>? images = null,
            IReadOnlyList<int>? sizeIds = null,
            IReadOnlyList<int>? colorIds = null)
        {
            return new ProductResponseDto
            {
                Id = product.Id,
                CategoryId = product.CategoryId,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                PromotionalPrice = product.PromotionalPrice,
                SizeIds = (sizeIds ?? Array.Empty<int>()).ToList(),
                ColorIds = (colorIds ?? Array.Empty<int>()).ToList(),
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

            if (products == null || products.Count == 0)
                return Array.Empty<ProductResponseDto>();

            var productIds = products
                .Select(p => p.Id)
                .Distinct()
                .ToArray();

            // Imagens
            var allImages = await _imageRepository.GetByProductIdsAsync(productIds);
            var imagesByProduct = allImages
                .GroupBy(i => i.ProductId)
                .ToDictionary(
                    g => g.Key,
                    g => (IReadOnlyList<ProductImage>)g.ToList()
                );

            // Tamanhos
            var sizesByProduct =
                await _productRepository.GetSizeIdsByProductIdsAsync(productIds);

            // Cores
            var colorsByProduct =
                await _productRepository.GetColorIdsByProductIdsAsync(productIds);

            var result = products
                .Select(p =>
                {
                    imagesByProduct.TryGetValue(p.Id, out var images);
                    sizesByProduct.TryGetValue(p.Id, out var sizeIds);
                    colorsByProduct.TryGetValue(p.Id, out var colorIds);
                    return MapToDto(p, images, sizeIds, colorIds);
                })
                .ToList()
                .AsReadOnly();

            return result;
        }

        public async Task<ProductResponseDto?> GetByIdAsync(Guid id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null) return null;

            var images = await _imageRepository.GetByProductIdAsync(id);
            var sizeIds = await _productRepository.GetSizeIdsByProductIdAsync(id);
            var colorIds = await _productRepository.GetColorIdsByProductIdAsync(id);

            return MapToDto(product, images, sizeIds, colorIds);
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
                PromotionalPrice = dto.PromotionalPrice,
                IsPersonalizable = dto.IsPersonalizable,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            product = await _productRepository.CreateAsync(product);

            // vincula tamanhos e cores
            await _productRepository.ReplaceProductSizesAsync(product.Id, dto.SizeIds);
            await _productRepository.ReplaceProductColorsAsync(product.Id, dto.ColorIds);

            var sizeIds = await _productRepository.GetSizeIdsByProductIdAsync(product.Id);
            var colorIds = await _productRepository.GetColorIdsByProductIdAsync(product.Id);

            return MapToDto(product, null, sizeIds, colorIds);
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
            existing.PromotionalPrice = dto.PromotionalPrice;
            existing.IsPersonalizable = dto.IsPersonalizable;
            existing.IsActive = dto.IsActive;

            await _productRepository.UpdateAsync(existing);

            // atualiza tamanhos e cores
            await _productRepository.ReplaceProductSizesAsync(id, dto.SizeIds);
            await _productRepository.ReplaceProductColorsAsync(id, dto.ColorIds);

            var images = await _imageRepository.GetByProductIdAsync(id);
            var sizeIds = await _productRepository.GetSizeIdsByProductIdAsync(id);
            var colorIds = await _productRepository.GetColorIdsByProductIdAsync(id);

            return MapToDto(existing, images, sizeIds, colorIds);
        }

        public async Task DeleteAsync(Guid id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
            {
                // já não existe, nada a fazer
                return;
            }

            if (product.IsActive)
            {
                // 1º clique na lixeira -> só inativa
                await _productRepository.DeleteAsync(id); // soft delete (is_active = false)
            }
            else
            {
                // 2º clique na mesma lixeira -> apagar de vez
                await _productRepository.HardDeleteAsync(id);
            }
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
            var product = await _productRepository.GetByIdAsync(productId);
            if (product == null)
                throw new ApplicationException("Produto não encontrado.");

            // Se a nova imagem for marcada como primária,
            // removemos o flag das existentes
            if (dto.IsPrimary)
            {
                var existingImages = await _imageRepository.GetByProductIdAsync(productId);
                var updates = existingImages
                    .Where(i => i.IsPrimary)
                    .Select(i => (
                        ImageId: i.Id,
                        DisplayOrder: i.DisplayOrder,
                        IsPrimary: false
                    ));

                if (updates.Any())
                {
                    await _imageRepository.ReorderImagesAsync(updates);
                }
            }

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

        public async Task ReorderImagesAsync(Guid productId, IEnumerable<ReorderImageItemDto> items)
        {
            if (items == null) throw new ArgumentNullException(nameof(items));

            // Opcional: validar se as imagens pertencem ao produto (para segurança extra)
            var updates = items.Select(i => (
                ImageId: i.ImageId,
                DisplayOrder: i.DisplayOrder,
                IsPrimary: i.IsPrimary
            ));

            await _imageRepository.ReorderImagesAsync(updates);
        }
    }
}
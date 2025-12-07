using memoriza_backend.Models.DTO.Admin.Product;
using memoriza_backend.Services.Admin.Products;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using memoriza_backend.Filters;
using System;


namespace memoriza_backend.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _service;
        private readonly IWebHostEnvironment _env;

        public ProductsController(IProductService service, IWebHostEnvironment env)
        {
            _service = service;
            _env = env;
        }

        // dtp apenas para o upload via multipart/form-data
        public class UploadProductImageForm
        {
            public IFormFile File { get; set; } = default!;
            public bool IsPrimary { get; set; } = false;
            public int DisplayOrder { get; set; } = 0;
        }

        // ================== PRODUTOS ==================

        // GET /api/products
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllProducts()
        {
            var list = await _service.GetAllAsync();
            return Ok(list);
        }

        // GET /api/products/{id}
        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProductById(Guid id)
        {
            var prod = await _service.GetByIdAsync(id);
            return prod is null ? NotFound() : Ok(prod);
        }

        // POST /api/products
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [LogEmployeeAction(Module = "products", Action = "create", IncludeResourceName = true)]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetProductById), new { id = created.Id }, created);
        }

        // PUT /api/products/{id}
        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Admin")]
        [LogEmployeeAction(Module = "products", Action = "edit")]
        public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] UpdateProductDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);
            return Ok(updated);
        }

        // DELETE /api/products/{id}
        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin")]
        [LogEmployeeAction(Module = "products", Action = "delete")]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }

        // ================== IMAGENS (JSON) ==================

        // GET /api/products/{id}/images
        [HttpGet("{id:guid}/images")]
        [AllowAnonymous]
        public async Task<IActionResult> GetImages(Guid id)
        {
            var images = await _service.GetImagesAsync(id);
            return Ok(images);
        }

        /// Upload de imagem para um produto específico (Admin).
        
        // POST /api/products/{id}/images
        [HttpPost("{id:guid}/images")]
        [Authorize(Roles = "Admin")]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(10_000_000)]
        public async Task<IActionResult> UploadImage(
            [FromRoute] Guid id,
            [FromForm] UploadProductImageForm form)
        {
            if (form.File == null || form.File.Length == 0)
            {
                return BadRequest("Arquivo de imagem inválido.");
            }

            // Garante que o produto existe
            var product = await _service.GetByIdAsync(id);
            if (product is null)
            {
                return NotFound("Produto não encontrado.");
            }

            var webRoot = _env.WebRootPath
                          ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var uploadsRoot = Path.Combine(webRoot, "uploads", "products");

            if (!Directory.Exists(uploadsRoot))
            {
                Directory.CreateDirectory(uploadsRoot);
            }

            var extension = Path.GetExtension(form.File.FileName);
            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsRoot, fileName);

            await using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await form.File.CopyToAsync(stream);
            }

            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var publicUrl = $"{baseUrl}/uploads/products/{fileName}";

            var dto = new CreateProductImageDto
            {
                Url = publicUrl,
                AltText = form.File.FileName,
                IsPrimary = form.IsPrimary,
                DisplayOrder = form.DisplayOrder
            };

            var created = await _service.AddImageAsync(id, dto);

            return Ok(created);
        }

        /// Deleta uma imagem específica pelo ID da imagem (Admin).

        // DELETE /api/products/images/{imageId}
        [HttpDelete("images/{imageId:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteImage(Guid imageId)
        {
            await _service.DeleteImageAsync(imageId);
            return NoContent();
        }

        /// Reordena as imagens de um produto (drag and drop) (Admin).

        // POST /api/products/{id}/images/reorder
        [HttpPost("{id:guid}/images/reorder")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ReorderImages(
            [FromRoute] Guid id,
            [FromBody] List<ReorderImageItemDto> items)
        {
            if (items == null || items.Count == 0)
                return BadRequest("Lista de imagens vazia.");

            await _service.ReorderImagesAsync(id, items);
            return NoContent();
        }
    }
}
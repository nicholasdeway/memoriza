using memoriza_backend.Models.DTO.Admin.Products;
using memoriza_backend.Services.Admin.Products;
using Microsoft.AspNetCore.Mvc;

namespace memoriza_backend.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/products")]
    public class AdminProductsController : ControllerBase
    {
        private readonly IProductService _service;

        public AdminProductsController(IProductService service)
        {
            _service = service;
        }

        // ================== PRODUTOS ==================

        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var list = await _service.GetAllAsync();
            return Ok(list);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetProductById(Guid id)
        {
            var prod = await _service.GetByIdAsync(id);
            return prod is null ? NotFound() : Ok(prod);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetProductById), new { id = created.Id }, created);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] UpdateProductDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);
            return Ok(updated);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }

        // ================== IMAGENS ==================

        [HttpGet("{id:guid}/images")]
        public async Task<IActionResult> GetImages(Guid id)
        {
            var images = await _service.GetImagesAsync(id);
            return Ok(images);
        }

        [HttpPost("{id:guid}/images")]
        public async Task<IActionResult> AddImage(Guid id, [FromBody] CreateProductImageDto dto)
        {
            var created = await _service.AddImageAsync(id, dto);
            return Ok(created);
        }

        [HttpDelete("images/{imageId:guid}")]
        public async Task<IActionResult> DeleteImage(Guid imageId)
        {
            await _service.DeleteImageAsync(imageId);
            return NoContent();
        }
    }
}
using memoriza_backend.Models.DTO.Admin.Carousel;
using memoriza_backend.Models.DTO.Admin.Product;
using memoriza_backend.Services.Admin.CarouselItems;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using memoriza_backend.Filters;

namespace memoriza_backend.Controllers
{
    [ApiController]
    [Route("api/carousel-items")]
    public class CarouselItemsController : ControllerBase
    {
        private readonly ICarouselItemService _service;

        public CarouselItemsController(ICarouselItemService service)
        {
            _service = service;
        }

        // GET /api/carousel-items/active
        [HttpGet("active")]
        [AllowAnonymous]
        public async Task<IActionResult> GetActive()
        {
            var entities = await _service.GetAllAsync();
            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            var list = entities
                .Where(e => e.IsActive)
                .OrderBy(e => e.DisplayOrder)
                .ThenByDescending(e => e.CreatedAt)
                .Select(e => new CarouselItemResponseDto
                {
                    Id = e.Id,
                    Title = e.Title,
                    Subtitle = e.Subtitle,
                    CtaText = e.CtaText,
                    CtaLink = e.CtaLink,
                    ImageUrl = string.IsNullOrWhiteSpace(e.ImagePath)
                        ? string.Empty
                        : $"{baseUrl}{e.ImagePath}",
                    IsActive = e.IsActive,
                    DisplayOrder = e.DisplayOrder,
                    CreatedAt = e.CreatedAt,
                    TemplateType = string.IsNullOrWhiteSpace(e.TemplateType)
                        ? "default"
                        : e.TemplateType
                })
                .ToList();

            return Ok(list);
        }

        // GET /api/carousel-items
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var entities = await _service.GetAllAsync();
            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            var list = entities.Select(e => new CarouselItemResponseDto
            {
                Id = e.Id,
                Title = e.Title,
                Subtitle = e.Subtitle,
                CtaText = e.CtaText,
                CtaLink = e.CtaLink,
                ImageUrl = string.IsNullOrWhiteSpace(e.ImagePath)
                    ? string.Empty
                    : $"{baseUrl}{e.ImagePath}",
                IsActive = e.IsActive,
                DisplayOrder = e.DisplayOrder,
                CreatedAt = e.CreatedAt,
                TemplateType = string.IsNullOrWhiteSpace(e.TemplateType)
                    ? "default"
                    : e.TemplateType
            }).ToList();

            return Ok(list);
        }

        // POST /api/carousel-items
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [LogEmployeeAction(Module = "carousel", Action = "create")]
        [RequestSizeLimit(20_000_000)]
        public async Task<IActionResult> Create(
            [FromForm] CreateCarouselItemDto dto,
            IFormFile? image)
        {
            var entity = await _service.CreateAsync(dto, image);

            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            var result = new CarouselItemResponseDto
            {
                Id = entity.Id,
                Title = entity.Title,
                Subtitle = entity.Subtitle,
                CtaText = entity.CtaText,
                CtaLink = entity.CtaLink,
                ImageUrl = string.IsNullOrWhiteSpace(entity.ImagePath)
                    ? string.Empty
                    : $"{baseUrl}{entity.ImagePath}",
                IsActive = entity.IsActive,
                DisplayOrder = entity.DisplayOrder,
                CreatedAt = entity.CreatedAt,
                TemplateType = string.IsNullOrWhiteSpace(entity.TemplateType)
                    ? "default"
                    : entity.TemplateType
            };

            return CreatedAtAction(nameof(GetAll), new { id = result.Id }, result);
        }

        // PUT /api/carousel-items/{id}
        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Admin")]
        [LogEmployeeAction(Module = "carousel", Action = "edit")]
        [RequestSizeLimit(20_000_000)]
        public async Task<IActionResult> Update(
            Guid id,
            [FromForm] UpdateCarouselItemDto dto,
            IFormFile? image)
        {
            var entity = await _service.UpdateAsync(id, dto, image);

            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            var result = new CarouselItemResponseDto
            {
                Id = entity.Id,
                Title = entity.Title,
                Subtitle = entity.Subtitle,
                CtaText = entity.CtaText,
                CtaLink = entity.CtaLink,
                ImageUrl = string.IsNullOrWhiteSpace(entity.ImagePath)
                    ? string.Empty
                    : $"{baseUrl}{entity.ImagePath}",
                IsActive = entity.IsActive,
                DisplayOrder = entity.DisplayOrder,
                CreatedAt = entity.CreatedAt,
                TemplateType = string.IsNullOrWhiteSpace(entity.TemplateType)
                    ? "default"
                    : entity.TemplateType
            };

            return Ok(result);
        }

        // DELETE /api/carousel-items/{id}
        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin")]
        [LogEmployeeAction(Module = "carousel", Action = "delete")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }

        // POST /api/carousel-items/reorder
        [HttpPost("reorder")]
        [Authorize(Roles = "Admin")]
        [LogEmployeeAction(Module = "carousel", Action = "reorder")]
        public async Task<IActionResult> Reorder([FromBody] List<ReorderImageItemDto> items)
        {
            await _service.ReorderAsync(items);
            return NoContent();
        }
    }
}
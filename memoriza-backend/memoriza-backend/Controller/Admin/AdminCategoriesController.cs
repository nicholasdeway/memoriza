using memoriza_backend.Services.Admin.Categories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using memoriza_backend.Models.DTO.Admin.Category;
using memoriza_backend.Filters;

namespace memoriza_backend.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _service;

        public CategoriesController(ICategoryService service)
        {
            _service = service;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _service.GetAllAsync();
            return Ok(categories);
        }

        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(Guid id)
        {
            var category = await _service.GetByIdAsync(id);
            return category is null ? NotFound() : Ok(category);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        [LogEmployeeAction(Module = "categories", Action = "create", IncludeResourceName = true)]
        public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Admin")]
        [LogEmployeeAction(Module = "categories", Action = "edit")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCategoryDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _service.UpdateAsync(id, dto);
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin")]
        [LogEmployeeAction(Module = "categories", Action = "delete")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
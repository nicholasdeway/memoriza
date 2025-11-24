using memoriza_backend.Models.DTO.Admin;
using memoriza_backend.Services.Admin.Categories;
using Microsoft.AspNetCore.Mvc;

// using Microsoft.AspNetCore.Authorization; // TODO: DESCOMENTAR EM PRODUÇÃO

namespace memoriza_backend.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/categories")]

    // ======================================================
    // TODO: HABILITAR EM PRODUÇÃO!
    // [Authorize(Roles = "Admin")]
    // ======================================================
    public class AdminCategoriesController : ControllerBase
    {
        private readonly ICategoryService _service;

        public AdminCategoriesController(ICategoryService service)
        {
            _service = service;
        }

        // ======================================================
        // GET ALL
        // ======================================================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _service.GetAllAsync();
            return Ok(categories);
        }

        // ======================================================
        // GET BY ID
        // ======================================================
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var category = await _service.GetByIdAsync(id);
            return category is null ? NotFound() : Ok(category);
        }

        // ======================================================
        // CREATE
        // ======================================================
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // ======================================================
        // UPDATE
        // ======================================================
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCategoryDto dto)
        {
            await _service.UpdateAsync(id, dto);
            return NoContent();
        }

        // ======================================================
        // DELETE
        // ======================================================
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
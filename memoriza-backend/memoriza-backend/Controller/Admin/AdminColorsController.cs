using memoriza_backend.Models.DTO.Admin.Color;
using memoriza_backend.Services.Admin.Colors;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using memoriza_backend.Filters;

namespace memoriza_backend.Controllers
{
    [ApiController]
    [Route("api/colors")]
    public class ColorsController : ControllerBase
    {
        private readonly IColorService _service;

        public ColorsController(IColorService service)
        {
            _service = service;
        }

        // GET /api/colors
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.GetAllAsync();
            return Ok(list);
        }

        // GET /api/colors/5
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var color = await _service.GetByIdAsync(id);
            return color is null ? NotFound() : Ok(color);
        }

        // POST /api/colors
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [LogEmployeeAction(Module = "colors", Action = "create", IncludeResourceName = true)]
        public async Task<IActionResult> Create([FromBody] CreateColorDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // PUT /api/colors/5
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        [LogEmployeeAction(Module = "colors", Action = "edit")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateColorDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);
            return Ok(updated);
        }

        // DELETE /api/colors/5
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        [LogEmployeeAction(Module = "colors", Action = "delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
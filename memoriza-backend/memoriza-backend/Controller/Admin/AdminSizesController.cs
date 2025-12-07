using memoriza_backend.Models.DTO.Admin.Size;
using memoriza_backend.Services.Admin.Sizes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using memoriza_backend.Filters;

namespace memoriza_backend.Controllers
{
    [ApiController]
    [Route("api/sizes")]
    public class SizesController : ControllerBase
    {
        private readonly ISizeService _service;

        public SizesController(ISizeService service)
        {
            _service = service;
        }

        // GET /api/sizes
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.GetAllAsync();
            return Ok(list);
        }

        // GET /api/sizes/5 
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var size = await _service.GetByIdAsync(id);
            return size is null ? NotFound() : Ok(size);
        }

        // POST /api/sizes 
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [LogEmployeeAction(Module = "sizes", Action = "create", IncludeResourceName = true)]
        public async Task<IActionResult> Create([FromBody] CreateSizeDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // PUT /api/sizes/5
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        [LogEmployeeAction(Module = "sizes", Action = "edit")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateSizeDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);
            return Ok(updated);
        }

        // DELETE /api/sizes/5 
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        [LogEmployeeAction(Module = "sizes", Action = "delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
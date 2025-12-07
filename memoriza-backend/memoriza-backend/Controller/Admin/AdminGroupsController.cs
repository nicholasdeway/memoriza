using memoriza_backend.Models.DTO.Admin.Groups;
using memoriza_backend.Services.Admin.Groups;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using memoriza_backend.Filters;

namespace memoriza_backend.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/groups")]
    [Authorize(Roles = "Admin")]
    public class AdminGroupsController : ControllerBase
    {
        private readonly IGroupService _service;

        public AdminGroupsController(IGroupService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.GetAllAsync();
            return Ok(list);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var group = await _service.GetByIdAsync(id);
            return group is null ? NotFound() : Ok(group);
        }

        [HttpPost]
        [LogEmployeeAction(Module = "groups", Action = "create", IncludeResourceName = true)]
        public async Task<IActionResult> Create([FromBody] GroupFormDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var id = await _service.CreateAsync(dto);
            var created = await _service.GetByIdAsync(id);

            return CreatedAtAction(nameof(GetById), new { id }, created);
        }

        [HttpPut("{id:guid}")]
        [LogEmployeeAction(Module = "groups", Action = "edit")]
        public async Task<IActionResult> Update(Guid id, [FromBody] GroupFormDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existing = await _service.GetByIdAsync(id);
            if (existing is null)
                return NotFound();

            await _service.UpdateAsync(id, dto);
            var updated = await _service.GetByIdAsync(id);

            return Ok(updated);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var existing = await _service.GetByIdAsync(id);
            if (existing is null)
                return NotFound();

            await _service.DeleteAsync(id);
            return NoContent();
        }

        // GET api/admin/groups/check-name?name=Vendedores&excludeId=...
        [HttpGet("check-name")]
        public async Task<IActionResult> CheckName([FromQuery] string name, [FromQuery] Guid? excludeId)
        {
            if (string.IsNullOrWhiteSpace(name))
                return BadRequest("Nome é obrigatório.");

            var isUnique = await _service.IsNameUniqueAsync(name, excludeId);
            return Ok(new CheckGroupNameResponseDto { IsUnique = isUnique });
        }

        // PATCH api/admin/groups/{id}/toggle-status
        [HttpPatch("{id:guid}/toggle-status")]
        [LogEmployeeAction(Module = "groups", Action = "update_status")]
        public async Task<IActionResult> ToggleStatus(Guid id, [FromBody] ToggleGroupStatusDto request)
        {
            var existing = await _service.GetByIdAsync(id);
            if (existing is null)
                return NotFound();

            await _service.UpdateStatusAsync(id, request.IsActive);
            var updated = await _service.GetByIdAsync(id);

            return Ok(updated);
        }
    }
}
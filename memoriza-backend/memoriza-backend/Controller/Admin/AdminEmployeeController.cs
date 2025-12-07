using memoriza_backend.Models.DTO.Admin.Employees;
using memoriza_backend.Services.Admin.Employees;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using memoriza_backend.Filters;

namespace memoriza_backend.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/employees")]
    [Authorize(Roles = "Admin")]
    public class AdminEmployeesController : ControllerBase
    {
        private readonly IEmployeeService _service;

        public AdminEmployeesController(IEmployeeService service)
        {
            _service = service;
        }

        // GET: api/admin/employees
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.GetAllAsync();
            return Ok(list);
        }

        // GET: api/admin/employees/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var employee = await _service.GetByIdAsync(id);
            return employee is null ? NotFound() : Ok(employee);
        }

        // POST: api/admin/employees
        [HttpPost]
        [LogEmployeeAction(Module = "employees", Action = "create", IncludeResourceName = true)]
        public async Task<IActionResult> Create([FromBody] EmployeeFormDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var id = await _service.CreateAsync(dto);
                var created = await _service.GetByIdAsync(id);

                return CreatedAtAction(nameof(GetById), new { id }, created);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, "Erro ao criar funcionário.");
            }
        }

        // PUT: api/admin/employees/{id}
        [HttpPut("{id:guid}")]
        [LogEmployeeAction(Module = "employees", Action = "edit")]
        public async Task<IActionResult> Update(Guid id, [FromBody] EmployeeFormDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                await _service.UpdateAsync(id, dto);
                return NoContent();
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, "Erro ao atualizar funcionário.");
            }
        }

        // PATCH: api/admin/employees/{id}/status
        [HttpPatch("{id:guid}/status")]
        [LogEmployeeAction(Module = "employees", Action = "update_status")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateEmployeeStatusDto dto)
        {
            if (dto is null || string.IsNullOrWhiteSpace(dto.Status))
                return BadRequest(new { error = "Status é obrigatório." });

            try
            {
                await _service.UpdateStatusAsync(id, dto.Status);
                return NoContent();
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, "Erro ao atualizar status do funcionário.");
            }
        }
    }
}
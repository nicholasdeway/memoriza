using memoriza_backend.Models.DTO.Admin.Employees;
using memoriza_backend.Services.Admin.Employees;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace memoriza_backend.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/employee-logs")]
    [Authorize(Roles = "Admin")]
    public class AdminEmployeeAccessLogsController : ControllerBase
    {
        private readonly IEmployeeAccessLogService _service;

        public AdminEmployeeAccessLogsController(IEmployeeAccessLogService service)
        {
            _service = service;
        }

        // GET: api/admin/employee-logs
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.GetAllAsync();
            return Ok(list);
        }

        // POST: api/admin/employee-logs
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] EmployeeAccessLogCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                await _service.CreateAsync(dto);
                return StatusCode(201);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, "Erro ao registrar log de acesso.");
            }
        }
    }
}
using memoriza_backend.Services.Admin.Dashboard;
using Microsoft.AspNetCore.Mvc;

// using Microsoft.AspNetCore.Authorization; // TODO: DESCOMENTAR EM PRODUÇÃO

namespace memoriza_backend.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/dashboard")]

    // ======================================================
    // TODO: HABILITAR EM PRODUÇÃO!
    // [Authorize(Roles = "Admin")]
    // ======================================================
    public class AdminDashboardController : ControllerBase
    {
        private readonly IDashboardService _service;

        public AdminDashboardController(IDashboardService service)
        {
            _service = service;
        }

        // ======================================================
        // SUMMARY (RESUMO GERAL)
        // ======================================================
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary(
            [FromQuery] DateTime? from = null,
            [FromQuery] DateTime? to = null)
        {
            var summary = await _service.GetSummaryAsync(from, to);
            return Ok(summary);
        }

        // ======================================================
        // TOP PRODUCTS
        // ======================================================
        [HttpGet("top-products")]
        public async Task<IActionResult> GetTopProducts(
            [FromQuery] DateTime? from = null,
            [FromQuery] DateTime? to = null,
            [FromQuery] int limit = 5)
        {
            var top = await _service.GetTopProductsAsync(from, to, limit);
            return Ok(top);
        }
    }
}
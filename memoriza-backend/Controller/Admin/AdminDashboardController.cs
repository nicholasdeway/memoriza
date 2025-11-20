using memoriza_backend.Services.Admin.Dashboard;
using Microsoft.AspNetCore.Mvc;

namespace memoriza_backend.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/dashboard")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly IDashboardService _service;

        public AdminDashboardController(IDashboardService service)
        {
            _service = service;
        }

        // Resumo geral do dashboard
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary(
            [FromQuery] DateTime? from = null,
            [FromQuery] DateTime? to = null)
        {
            var summary = await _service.GetSummaryAsync(from, to);
            return Ok(summary);
        }

        // Produtos mais vendidos
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
using memoriza_backend.Services.Admin.Dashboard;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Authorization;

namespace memoriza_backend.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/dashboard")]

    // ======================================================
    [Authorize(Roles = "Admin")]
    // ======================================================
    public class AdminDashboardController : ControllerBase
    {
        private readonly IDashboardService _service;

        public AdminDashboardController(IDashboardService service)
        {
            _service = service;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary(
            [FromQuery] DateTime? from = null,
            [FromQuery] DateTime? to = null)
        {
            var summary = await _service.GetSummaryAsync(from, to);
            return Ok(summary);
        }

        [HttpGet("top-products")]
        public async Task<IActionResult> GetTopProducts(
            [FromQuery] DateTime? from = null,
            [FromQuery] DateTime? to = null,
            [FromQuery] int limit = 5)
        {
            var top = await _service.GetTopProductsAsync(from, to, limit);
            return Ok(top);
        }

        [HttpGet("recent-orders")]
        public async Task<IActionResult> GetRecentOrders([FromQuery] int limit = 5)
        {
            var orders = await _service.GetRecentOrdersAsync(limit);
            return Ok(orders);
        }

        [HttpGet("sales-by-month")]
        public async Task<IActionResult> GetSalesByMonth(
            [FromQuery] DateTime? from = null,
            [FromQuery] DateTime? to = null)
        {
            var sales = await _service.GetSalesByMonthAsync(from, to);
            return Ok(sales);
        }
    }
}
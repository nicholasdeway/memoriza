using memoriza_backend.Models.Admin;
using memoriza_backend.Services.Admin.Orders;
using Microsoft.AspNetCore.Mvc;

namespace memoriza_backend.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/orders")]
    public class AdminOrdersController : ControllerBase
    {
        private readonly IOrderService _service;

        public AdminOrdersController(IOrderService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _service.GetAllAsync();
            return Ok(orders);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var order = await _service.GetByIdAsync(id);
            return order is null ? NotFound() : Ok(order);
        }

        [HttpGet("{id:guid}/items")]
        public async Task<IActionResult> GetItems(Guid id)
        {
            var items = await _service.GetItemsAsync(id);
            return Ok(items);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateOrder(Guid id, [FromBody] Order order)
        {
            if (id != order.Id)
                return BadRequest("IDs divergentes.");

            await _service.UpdateAsync(order);
            return NoContent();
        }

        [HttpPut("{id:guid}/status")]
        public async Task<IActionResult> UpdateStatus(
            Guid id,
            [FromQuery] OrderStatus status,
            [FromQuery] Guid adminUserId,
            [FromBody] string? note)
        {
            await _service.UpdateStatusAsync(id, status, adminUserId, note);
            return NoContent();
        }
    }
}
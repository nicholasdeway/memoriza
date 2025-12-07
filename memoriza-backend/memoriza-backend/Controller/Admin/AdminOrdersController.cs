using memoriza_backend.Models.DTO.Admin.Order;
using memoriza_backend.Services.Admin.Orders;
using Microsoft.AspNetCore.Mvc;
using memoriza_backend.Filters;

//using Microsoft.AspNetCore.Authorization;

namespace memoriza_backend.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/orders")]
    // [Authorize(Roles = "Admin")]
    public class AdminOrdersController : ControllerBase
    {
        private readonly IAdminOrderService _service;

        public AdminOrdersController(IAdminOrderService service)
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
        [LogEmployeeAction(Module = "orders", Action = "update_status")]
        public async Task<IActionResult> UpdateOrder(Guid id, [FromBody] AdminUpdateOrderDto dto)
        {
            await _service.UpdateAsync(id, dto);
            return NoContent();
        }

        [HttpPut("{id:guid}/status")]
        [LogEmployeeAction(Module = "orders", Action = "update_status")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateOrderStatusDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _service.UpdateStatusAsync(
                id,
                dto.NewStatus,
                dto.AdminUserId,
                dto.Note
            );

            return NoContent();
        }

        [HttpPut("{id:guid}/tracking")]
        [LogEmployeeAction(Module = "orders", Action = "update_status")]
        public async Task<IActionResult> UpdateTracking(Guid id, [FromBody] OrderDetailDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _service.UpdateTrackingAsync(id, dto);
            return NoContent();
        }
    }
}
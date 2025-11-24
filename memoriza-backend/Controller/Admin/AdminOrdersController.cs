using memoriza_backend.Models.Admin;
using memoriza_backend.Models.DTO.Admin;
using memoriza_backend.Services.Admin.Orders;
using Microsoft.AspNetCore.Mvc;

// using Microsoft.AspNetCore.Authorization; // TODO: DESCOMENTAR EM PRODUÇÃO

namespace memoriza_backend.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/orders")]

    // ======================================================
    // TODO: HABILITAR EM PRODUÇÃO!
    // [Authorize(Roles = "Admin")]
    // ======================================================
    public class AdminOrdersController : ControllerBase
    {
        private readonly IAdminOrderService _service;

        public AdminOrdersController(IAdminOrderService service)
        {
            _service = service;
        }

        // ======================================================
        // GET ALL
        // ======================================================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _service.GetAllAsync();
            return Ok(orders);
        }

        // ======================================================
        // GET BY ID
        // ======================================================
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var order = await _service.GetByIdAsync(id);
            return order is null ? NotFound() : Ok(order);
        }

        // ======================================================
        // GET ITEMS OF ORDER
        // ======================================================
        [HttpGet("{id:guid}/items")]
        public async Task<IActionResult> GetItems(Guid id)
        {
            var items = await _service.GetItemsAsync(id);
            return Ok(items);
        }

        // ======================================================
        // UPDATE ORDER (FULL) - utilizando DTO
        // ======================================================
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateOrder(Guid id, [FromBody] AdminUpdateOrderDto dto)
        {
            await _service.UpdateAsync(id, dto);
            return NoContent();
        }

        // ======================================================
        // UPDATE ONLY STATUS (AGORA 100% PADRONIZADO)
        // ======================================================
        [HttpPut("{id:guid}/status")]
        public async Task<IActionResult> UpdateStatus(
            Guid id,
            [FromBody] UpdateOrderStatusDto dto)
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
    }
}
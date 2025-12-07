using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using memoriza_backend.Models.DTO.User.Orders;
using memoriza_backend.Models.DTO.Payments;
using memoriza_backend.Services.Profile.OrderService;

namespace memoriza_backend.Controller.User
{
    [ApiController]
    [Route("api/user/orders")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly ICustomerOrderService _orderService;

        public OrdersController(ICustomerOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderSummaryForUserResponse>>> GetMyOrders()
        {
            var userId = GetUserId();
            var orders = await _orderService.GetOrdersForUserAsync(userId);
            return Ok(orders);
        }

        [HttpGet("{orderId:guid}")]
        public async Task<ActionResult<OrderDetailForUserResponse>> GetOrderDetail(Guid orderId)
        {
            var userId = GetUserId();

            var order = await _orderService.GetOrderDetailForUserAsync(userId, orderId);

            if (order == null)
                return NotFound();

            return Ok(order);
        }

        [HttpPost("checkout")]
        public async Task<ActionResult<CheckoutInitResponse>> Checkout(
            [FromBody] CreateOrderFromCartRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();

            var result = await _orderService.CheckoutAsync(userId, request);

            if (!result.Success || result.Data == null)
                return BadRequest(result.Errors ?? "Falha ao iniciar checkout.");

            return Ok(result.Data);
        }

        [HttpPost("{orderId:guid}/refund")]
        public async Task<ActionResult<RefundStatusResponse>> RequestRefund(
            Guid orderId,
            [FromBody] RequestRefundRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();
            request.OrderId = orderId;

            var result = await _orderService.RequestRefundAsync(userId, request);

            if (!result.Success)
                return BadRequest(result.Errors);

            return Ok(result.Data);
        }

        private string GetUserId()
        {
            var id = User.FindFirstValue(ClaimTypes.NameIdentifier)
                     ?? User.FindFirstValue("sub");

            if (string.IsNullOrEmpty(id))
                throw new UnauthorizedAccessException("User id not found in token.");

            return id;
        }
    }
}
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using memoriza_backend.Models.DTO.User.Orders;
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

        /// <summary>
        /// Lista os pedidos do usuário autenticado.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderSummaryForUserResponse>>> GetMyOrders()
        {
            var userId = GetUserId();
            var orders = await _orderService.GetOrdersForUserAsync(userId);
            return Ok(orders);
        }

        /// <summary>
        /// Retorna os detalhes de um pedido específico do usuário autenticado.
        /// </summary>
        [HttpGet("{orderId:guid}")]
        public async Task<ActionResult<OrderDetailForUserResponse>> GetOrderDetail(Guid orderId)
        {
            var userId = GetUserId();

            var order = await _orderService.GetOrderDetailForUserAsync(userId, orderId);

            if (order == null)
                return NotFound();

            return Ok(order);
        }

        /// <summary>
        /// Finaliza um pedido a partir do carrinho atual do usuário.
        /// </summary>
        [HttpPost("checkout")]
        public async Task<ActionResult<OrderDetailForUserResponse>> Checkout(
            [FromBody] CreateOrderFromCartRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();

            var result = await _orderService.CreateOrderFromCartAsync(userId, request);

            if (!result.Success)
                return BadRequest(result.Errors);

            return Ok(result.Data);
        }

        /// <summary>
        /// Solicita reembolso de um pedido em até 7 dias, se permitido.
        /// </summary>
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
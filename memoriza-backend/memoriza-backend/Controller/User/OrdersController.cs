using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using memoriza_backend.Models.DTO.User.Orders;
using memoriza_backend.Models.DTO.Payments;
using memoriza_backend.Models.DTO.Profile.Orders;
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
            
            var result = await _orderService.CreateOrderFromCartAsync(userId, request);

            if (!result.Success || result.Data == null)
                return BadRequest(result.Errors ?? "Falha ao iniciar checkout.");

            // Mapeia para o DTO esperado pelo frontend (os campos de Preference serão nulos)
            var response = new CheckoutInitResponse
            {
                OrderId = result.Data.OrderId,
                OrderNumber = result.Data.OrderNumber,
                TotalAmount = result.Data.TotalAmount,
                // PreferenceId e InitPoints serão nulos, confirmando Checkout Transparente
                PublicKey = null,
                PreferenceId = null,
                InitPoint = null,
                SandboxInitPoint = null
            };

            return Ok(response);
        }

        [HttpPost("{orderId:guid}/process-payment")]
        public async Task<ActionResult<ProcessPaymentResponse>> ProcessPayment(
            Guid orderId,
            [FromBody] ProcessPaymentRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _orderService.ProcessPaymentAsync(orderId, request);
                
                if (!result.Success || result.Data == null)
                    return BadRequest(result.Errors ?? "Falha ao processar pagamento.");

                return Ok(result.Data);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao processar pagamento: {ex.Message}");
            }
        }

        [HttpPost("{orderId:guid}/pay-card")]
        public async Task<ActionResult<ProcessPaymentResponse>> ProcessCardPayment(
            Guid orderId,
            [FromBody] CardPaymentRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errors = string.Join("; ", ModelState.Values
                                    .SelectMany(x => x.Errors)
                                    .Select(x => x.ErrorMessage));
                return BadRequest(new { message = "Dados inválidos", errors = errors });
            }

            try
            {
                var result = await _orderService.ProcessCardPaymentAsync(orderId, request);

                if (!result.Success || result.Data == null)
                {
                    return BadRequest(new { message = result.Errors ?? "Falha ao processar pagamento com cartão." });
                }

                return Ok(result.Data);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erro ao processar pagamento com cartão: {ex.Message}" });
            }
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
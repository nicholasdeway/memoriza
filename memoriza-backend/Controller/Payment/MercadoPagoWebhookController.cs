using Microsoft.AspNetCore.Mvc;
using memoriza_backend.Services.Payments;
using memoriza_backend.Models.DTO.Payments;

namespace memoriza_backend.Controller.Payments
{
    [ApiController]
    [Route("api/payments/mercadopago")]
    public class MercadoPagoWebhookController : ControllerBase
    {
        private readonly IMercadoPagoService _mpService;

        public MercadoPagoWebhookController(IMercadoPagoService mpService)
        {
            _mpService = mpService;
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> ReceiveWebhook([FromBody] MercadoPagoWebhookDto body)
        {
            if (body == null)
            {
                return BadRequest(new { error = "Corpo da requisição inválido." });
            }

            try
            {
                await _mpService.ProcessWebhookAsync(body);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
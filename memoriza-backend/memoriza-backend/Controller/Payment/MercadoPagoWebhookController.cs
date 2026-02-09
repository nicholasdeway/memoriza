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
        private readonly ILogger<MercadoPagoWebhookController> _logger;

        public MercadoPagoWebhookController(
            IMercadoPagoService mpService,
            ILogger<MercadoPagoWebhookController> logger)
        {
            _mpService = mpService;
            _logger = logger;
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> ReceiveWebhook([FromBody] MercadoPagoWebhookDto body)
        {
            try
            {
                _logger.LogInformation("📥 Webhook recebido do MercadoPago");
                _logger.LogInformation($"   Type: {body?.Type}");
                _logger.LogInformation($"   Data.Id: {body?.Data?.Id}");
                
                if (body == null)
                {
                    _logger.LogWarning("⚠️  Webhook com corpo nulo");
                    return BadRequest(new { error = "Corpo da requisição inválido." });
                }

                await _mpService.ProcessWebhookAsync(body);
                
                _logger.LogInformation("✅ Webhook processado com sucesso");
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Erro ao processar webhook");
                return BadRequest(new { error = ex.Message });
            }
        }
        
        /// <summary>
        /// Endpoint de teste para verificar se o webhook está acessível
        /// </summary>
        [HttpGet("webhook/health")]
        public IActionResult WebhookHealth()
        {
            return Ok(new { 
                status = "healthy", 
                message = "Webhook endpoint is accessible",
                timestamp = DateTime.UtcNow 
            });
        }
    }
}
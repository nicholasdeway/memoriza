using Microsoft.AspNetCore.Mvc;
using memoriza_backend.Services.Payments;

namespace memoriza_backend.Controller.Payment
{
    [ApiController]
    [Route("api/installments")]
    public class InstallmentsController : ControllerBase
    {
        private readonly IMercadoPagoInstallmentsService _installmentsService;

        public InstallmentsController(IMercadoPagoInstallmentsService installmentsService)
        {
            _installmentsService = installmentsService;
        }

        /// <summary>
        /// Obtém as opções de parcelamento para um determinado valor
        /// </summary>
        /// <param name="amount">Valor do produto</param>
        /// <returns>Lista de opções de parcelamento</returns>
        [HttpGet]
        public async Task<IActionResult> GetInstallments([FromQuery] decimal amount)
        {
            if (amount <= 0)
            {
                return BadRequest(new { error = "O valor deve ser maior que zero" });
            }

            var result = await _installmentsService.GetInstallmentsAsync(amount);
            return Ok(result);
        }
    }
}

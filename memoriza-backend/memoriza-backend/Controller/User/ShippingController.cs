using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using memoriza_backend.Models.DTO.User.Shipping;
using memoriza_backend.Services.Profile.ShippingService;

namespace memoriza_backend.Controller.User
{
    [ApiController]
    [Route("api/user/shipping")]
    public class ShippingController : ControllerBase
    {
        private readonly IShippingService _shippingService;

        public ShippingController(IShippingService shippingService)
        {
            _shippingService = shippingService;
        }

        [HttpPost("calculate")]
        [AllowAnonymous]
        public async Task<ActionResult<CalculateShippingResponse>> CalculateShipping(
            [FromBody] CalculateShippingRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // chama o serviço de frete
            var response = await _shippingService.CalculateShippingAsync(request);

            if (response == null)
                return NotFound(new { message = "Nenhuma opção de frete encontrada para este CEP." });

            return Ok(response);
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
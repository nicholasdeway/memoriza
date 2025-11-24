using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using memoriza_backend.Models.DTO.User.Shipping;
using memoriza_backend.Services.Profile.ShippingService;

namespace memoriza_backend.Controller.User
{
    [ApiController]
    [Route("api/user/shipping")]
    [Authorize]
    public class ShippingController : ControllerBase
    {
        private readonly IShippingService _shippingService;

        public ShippingController(IShippingService shippingService)
        {
            _shippingService = shippingService;
        }

        /// <summary>
        /// Calcula as opções de frete para o usuário (por CEP / região / retirada).
        /// </summary>
        [HttpPost("calculate")]
        public async Task<ActionResult<CalculateShippingResponse>> CalculateShipping(
            [FromBody] CalculateShippingRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();

            var result = await _shippingService.CalculateShippingAsync(userId, request);

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
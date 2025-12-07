using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using memoriza_backend.Models.DTO.User.Cart;
using memoriza_backend.Services.Profile.CartService;

namespace memoriza_backend.Controller.User
{
    [ApiController]
    [Route("api/user/cart")]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet]
        public async Task<ActionResult<CartSummaryResponse>> GetCart()
        {
            var userId = GetUserId();

            var cart = await _cartService.GetCartAsync(userId);

            return Ok(cart);
        }

        [HttpPost("items")]
        public async Task<ActionResult<CartSummaryResponse>> AddItem([FromBody] AddCartItemRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();

            var result = await _cartService.AddItemAsync(userId, request);

            if (!result.Success)
                return BadRequest(result.Errors);

            return Ok(result.Data);
        }

        [HttpPut("items")]
        public async Task<ActionResult<CartSummaryResponse>> UpdateItemQuantity([FromBody] UpdateCartItemQuantityRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();

            var result = await _cartService.UpdateItemQuantityAsync(userId, request);

            if (!result.Success)
                return BadRequest(result.Errors);

            return Ok(result.Data);
        }

        [HttpDelete("items")]
        public async Task<ActionResult<CartSummaryResponse>> RemoveItem([FromBody] RemoveCartItemRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();

            var result = await _cartService.RemoveItemAsync(userId, request);

            if (!result.Success)
                return BadRequest(result.Errors);

            return Ok(result.Data);
        }

        [HttpDelete("clear")]
        public async Task<ActionResult<CartSummaryResponse>> ClearCart([FromBody] ClearCartRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();

            var result = await _cartService.ClearCartAsync(userId, request);

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
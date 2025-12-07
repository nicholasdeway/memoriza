using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using memoriza_backend.Models.DTO.User.Profile;
using memoriza_backend.Services.Profile.UserService;
using memoriza_backend.Models.DTO.Auth;

namespace memoriza_backend.Controller.User
{
    [ApiController]
    [Route("api/user")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IProfileUserService _userService;

        public UserController(IProfileUserService userService)
        {
            _userService = userService;
        }

        private Guid GetUserId()
        {
            var id = User.FindFirstValue(ClaimTypes.NameIdentifier)
                     ?? User.FindFirstValue("sub");

            if (string.IsNullOrEmpty(id))
                throw new UnauthorizedAccessException("User id not found in token.");

            return Guid.Parse(id);
        }

        // =====================================
        // GET /api/user/me
        // =====================================
        [HttpGet("me")]
        public async Task<ActionResult<UserProfileResponse>> GetProfile()
        {
            var userId = GetUserId();

            var profile = await _userService.GetProfileAsync(userId);

            if (profile == null)
                return NotFound();

            return Ok(profile);
        }

        // =====================================
        // PUT /api/user/profile
        // =====================================
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(
            [FromBody] UpdateUserProfileRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();

            var result = await _userService.UpdateProfileAsync(userId, request);

            if (!result.Success)
                return BadRequest(result.Errors);

            return Ok(result.Data);
        }

        // =====================================
        // PUT /api/user/change-password
        // =====================================
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword(
            [FromBody] ChangePasswordDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();

            var result = await _userService.ChangePasswordAsync(userId, request);

            if (!result.Success)
                return BadRequest(result.Errors);

            return Ok(new { message = "Senha alterada com sucesso." });
        }

        // =====================================
        // DELETE /api/user/account
        // =====================================
        [HttpDelete("account")]
        public async Task<IActionResult> DeleteAccount(
            [FromBody] DeleteAccountRequest request)
        {
            // Para esse caso específico, deixamos a validação de "senha obrigatória ou não"
            // a cargo do serviço, já que conta Google não terá senha.
            var userId = GetUserId();

            var result = await _userService.DeleteAccountAsync(userId, request);

            if (!result.Success)
            {
                // Aqui você pode refinar depois (401, 403, etc.),
                // mas por enquanto mantém o padrão de erro de validação/regra.
                return BadRequest(result.Errors);
            }

            // Fica mais simples pro frontend exibir uma mensagem amigável
            return Ok(new { message = "Conta excluída com sucesso." });
        }
    }
}
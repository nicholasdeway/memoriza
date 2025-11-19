using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using memoriza_backend.Services.Auth;
using memoriza_backend.Models.DTO.Auth;

namespace memoriza_backend.Controller.Auth
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        // Construtor - injeção do serviço de usuário
        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        // Endpoint para registrar um usuário
        // Após o registro, retorna somente o token JWT sem expor informações sensíveis
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto dto)
        {
            // Validação dos dados enviados
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                // Chamada do serviço e geração do token JWT
                var token = await _userService.RegisterAsync(dto);

                // Retorna somente o JWT, sem expor dados do usuário
                return Ok(new { token });
            }
            catch (ApplicationException ex)
            {
                // Erros de validação/negócio
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = ex.Message,
                    inner = ex.InnerException?.Message
                });
            }
        }

        // Endpoint de login
        // Após autenticar, retorna somente o token JWT sem expor informações sensíveis
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                // Chamada do serviço e geração do token JWT
                var token = await _userService.LoginAsync(dto);

                // Retorna somente o JWT
                return Ok(new { token });
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch
            {
                return StatusCode(500, new { message = "Erro interno no servidor." });
            }
        }

        // Endpoint para solicitar redefinição de senha
        [HttpPost("password-reset/request")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] RequestPasswordResetDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var message = await _userService.RequestPasswordResetAsync(dto);
                return Ok(new { message });
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch
            {
                return StatusCode(500, new { message = "Erro interno no servidor." });
            }
        }

        // Endpoint para confirmar redefinição de senha
        [HttpPost("password-reset/confirm")]
        public async Task<IActionResult> ConfirmPasswordReset([FromBody] ConfirmPasswordResetDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var message = await _userService.ConfirmPasswordResetAsync(dto);
                return Ok(new { message });
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch
            {
                return StatusCode(500, new { message = "Erro interno no servidor." });
            }
        }
    }
}
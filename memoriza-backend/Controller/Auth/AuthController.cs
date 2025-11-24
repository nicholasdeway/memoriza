using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using memoriza_backend.Services.Auth;
using memoriza_backend.Models.DTO.Auth;

namespace memoriza_backend.Controller.Auth
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<AuthController> _logger;

        // Construtor - injeção do serviço de usuário + logger
        public AuthController(IUserService userService, ILogger<AuthController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        private const string GenericErrorMessage = "Erro interno no servidor.";

        // ======================================================
        // REGISTER
        // ======================================================
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto dto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("ModelState inválido no registro de usuário. Erros: {@ModelStateErrors}", ModelState);
                return BadRequest(ModelState);
            }

            try
            {
                var token = await _userService.RegisterAsync(dto);

                _logger.LogInformation(
                    "Usuário registrado com sucesso. Email registrado: {Email}",
                    dto.Email
                );

                return Ok(new { token });
            }
            catch (ApplicationException ex)
            {
                // Erros de negócio / validação controlada
                _logger.LogWarning(ex,
                    "Erro de negócio ao registrar usuário. Email: {Email}. Mensagem: {Message}",
                    dto.Email,
                    ex.Message);

                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Erro inesperado → log detalhado, resposta genérica
                _logger.LogError(ex,
                    "Erro inesperado ao registrar usuário. Email: {Email}",
                    dto.Email);

                return StatusCode(500, new { message = GenericErrorMessage });
            }
        }

        // ======================================================
        // LOGIN (aceita email OU celular)
        // ======================================================
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto dto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("ModelState inválido no login de usuário. Erros: {@ModelStateErrors}", ModelState);
                return BadRequest(ModelState);
            }

            try
            {
                var token = await _userService.LoginAsync(dto);

                _logger.LogInformation(
                    "Login realizado com sucesso. Identifier utilizado: {Identifier}",
                    dto.Identifier
                );

                return Ok(new { token });
            }
            catch (ApplicationException ex)
            {
                // Ex.: credenciais inválidas, bloqueio etc.
                _logger.LogWarning(ex,
                    "Erro de negócio no login. Identifier utilizado: {Identifier}. Mensagem: {Message}",
                    dto.Identifier,
                    ex.Message);

                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Erro inesperado ao realizar login. Identifier utilizado: {Identifier}",
                    dto.Identifier);

                return StatusCode(500, new { message = GenericErrorMessage });
            }
        }

        // ======================================================
        // REQUEST PASSWORD RESET (somente via email)
        // ======================================================
        [HttpPost("password-reset/request")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] RequestPasswordResetDto dto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("ModelState inválido ao solicitar reset de senha. Erros: {@ModelStateErrors}", ModelState);
                return BadRequest(ModelState);
            }

            try
            {
                var message = await _userService.RequestPasswordResetAsync(dto);

                _logger.LogInformation(
                    "Pedido de reset de senha criado com sucesso. Email informado: {Email}",
                    dto.Email
                );

                return Ok(new { message });
            }
            catch (ApplicationException ex)
            {
                _logger.LogWarning(ex,
                    "Erro de negócio ao solicitar reset de senha. Email: {Email}. Mensagem: {Message}",
                    dto.Email,
                    ex.Message);

                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Erro inesperado ao solicitar reset de senha. Email: {Email}",
                    dto.Email);

                return StatusCode(500, new { message = GenericErrorMessage });
            }
        }

        // ======================================================
        // CONFIRM PASSWORD RESET (também usa email no DTO)
        // ======================================================
        [HttpPost("password-reset/confirm")]
        public async Task<IActionResult> ConfirmPasswordReset([FromBody] ConfirmPasswordResetDto dto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("ModelState inválido ao confirmar reset de senha. Erros: {@ModelStateErrors}", ModelState);
                return BadRequest(ModelState);
            }

            try
            {
                var message = await _userService.ConfirmPasswordResetAsync(dto);

                _logger.LogInformation(
                    "Reset de senha confirmado com sucesso. Email informado: {Email}",
                    dto.Email
                );

                return Ok(new { message });
            }
            catch (ApplicationException ex)
            {
                _logger.LogWarning(ex,
                    "Erro de negócio ao confirmar reset de senha. Email: {Email}. Mensagem: {Message}",
                    dto.Email,
                    ex.Message);

                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Erro inesperado ao confirmar reset de senha. Email: {Email}",
                    dto.Email);

                return StatusCode(500, new { message = GenericErrorMessage });
            }
        }
    }
}
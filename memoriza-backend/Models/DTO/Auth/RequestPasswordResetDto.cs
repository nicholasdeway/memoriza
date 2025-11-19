using System.ComponentModel.DataAnnotations;

namespace memoriza_backend.Models.DTO.Auth
{
    public class RequestPasswordResetDto
    {
        // E-mail utilizado para solicitar redefinição de senha
        [Required(ErrorMessage = "O e-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "O e-mail informado é inválido.")]
        public string Email { get; set; } = null!;
    }
}
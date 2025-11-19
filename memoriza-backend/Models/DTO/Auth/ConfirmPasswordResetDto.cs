using System.ComponentModel.DataAnnotations;

namespace memoriza_backend.Models.DTO.Auth
{
    public class ConfirmPasswordResetDto
    {
        // E-mail usado para validar o usuário
        [Required(ErrorMessage = "O e-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "O e-mail informado é inválido.")]
        public string Email { get; set; } = null!;

        // Nova senha definida pelo usuário
        [Required(ErrorMessage = "A nova senha é obrigatória.")]
        [MinLength(8, ErrorMessage = "A nova senha deve ter pelo menos 8 caracteres.")]
        public string NewPassword { get; set; } = null!;

        // Confirmação da nova senha
        [Required(ErrorMessage = "A confirmação da nova senha é obrigatória.")]
        [MinLength(8, ErrorMessage = "A confirmação da nova senha deve ter pelo menos 8 caracteres.")]
        public string ConfirmNewPassword { get; set; } = null!;
    }
}
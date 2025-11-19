using System.ComponentModel.DataAnnotations;

namespace memoriza_backend.Models.DTO.Auth
{
    public class RegisterUserDto
    {
        // Primeiro nome do usuário
        [Required(ErrorMessage = "O primeiro nome é obrigatório.")]
        public string FirstName { get; set; } = null!;

        // Sobrenome do usuário
        [Required(ErrorMessage = "O sobrenome é obrigatório.")]
        public string LastName { get; set; } = null!;

        // E-mail do usuário
        [Required(ErrorMessage = "O e-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "O e-mail informado é inválido.")]
        public string Email { get; set; } = null!;

        // Senha criada pelo usuário
        [Required(ErrorMessage = "A senha é obrigatória.")]
        [MinLength(8, ErrorMessage = "A senha deve ter pelo menos 8 caracteres.")]
        public string Password { get; set; } = null!;

        // Confirmação da senha
        [Required(ErrorMessage = "A confirmação de senha é obrigatória.")]
        [MinLength(8, ErrorMessage = "A confirmação de senha deve ter pelo menos 8 caracteres.")]
        public string ConfirmPassword { get; set; } = null!;
    }
}
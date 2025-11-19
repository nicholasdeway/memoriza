using System.ComponentModel.DataAnnotations;

namespace memoriza_backend.Models.DTO.Auth
{
    public class LoginUserDto
    {
        // E-mail do usuário
        [Required(ErrorMessage = "O e-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "O e-mail informado é inválido.")]
        public string Email { get; set; } = null!;

        // Senha usada no login
        [Required(ErrorMessage = "A senha é obrigatória.")]
        public string Password { get; set; } = null!;
    }
}
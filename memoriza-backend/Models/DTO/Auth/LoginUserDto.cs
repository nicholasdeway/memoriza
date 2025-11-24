using System.ComponentModel.DataAnnotations;

namespace memoriza_backend.Models.DTO.Auth
{
    public class LoginUserDto
    {
        public string Identifier { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
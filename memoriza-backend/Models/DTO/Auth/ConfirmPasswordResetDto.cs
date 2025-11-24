namespace memoriza_backend.Models.DTO.Auth
{
    public class ConfirmPasswordResetDto
    {
        public string Email { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
        public string ConfirmNewPassword { get; set; } = null!;
    }
}
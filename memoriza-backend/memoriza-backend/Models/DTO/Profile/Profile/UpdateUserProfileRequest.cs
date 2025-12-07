namespace memoriza_backend.Models.DTO.User.Profile
{
    /// <summary>
    /// Dados que o usuário pode alterar no próprio perfil.
    /// </summary>
    public class UpdateUserProfileRequest
    {
        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        /// <summary>
        /// Telefone opcional.
        /// </summary>
        public string? Phone { get; set; }
    }
}
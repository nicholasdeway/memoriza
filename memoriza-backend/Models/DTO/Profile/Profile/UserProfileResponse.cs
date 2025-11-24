using System;

namespace memoriza_backend.Models.DTO.User.Profile
{
    public class UserProfileResponse
    {
        public string Id { get; set; } = string.Empty;

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Telefone opcional do usuário.
        /// </summary>
        public string? Phone { get; set; }

        /// <summary>
        /// Data de criação da conta.
        /// </summary>
        public DateTime CreatedAt { get; set; }
    }
}
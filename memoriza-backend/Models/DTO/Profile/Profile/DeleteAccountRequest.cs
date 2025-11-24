namespace memoriza_backend.Models.DTO.User.Profile
{
    /// <summary>
    /// Dados necessários para exclusão de conta.
    /// </summary>
    public class DeleteAccountRequest
    {
        /// <summary>
        /// Senha atual, obrigatória para confirmação de exclusão.
        /// </summary>
        public string? CurrentPassword { get; set; }

        /// <summary>
        /// Motivo opcional informado pelo usuário.
        /// </summary>
        public string? Reason { get; set; }
    }
}
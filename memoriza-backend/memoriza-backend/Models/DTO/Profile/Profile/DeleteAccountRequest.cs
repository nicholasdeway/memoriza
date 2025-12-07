namespace memoriza_backend.Models.DTO.User.Profile
{
    /// <summary>
    /// Dados necessários para exclusão de conta.
    /// </summary>
    public class DeleteAccountRequest
    {
        /// <summary>
        /// Senha atual, obrigatória apenas para conta local.
        /// </summary>
        public string? CurrentPassword { get; set; }

        /// <summary>
        /// Motivo opcional informado pelo usuário.
        /// </summary>
        public string? Reason { get; set; }

        /// <summary>
        /// Indica se a conta é Google. Vem do frontend.
        /// </summary>
        public bool IsGoogleAccount { get; set; }
    }
}

namespace memoriza_backend.Models.DTO.Payments
{
    public class PreferenceResponseDto
    {
        /// <summary>
        /// Public Key usada no frontend (Mercado Pago Checkout)
        /// </summary>
        public string PublicKey { get; set; } = string.Empty;

        /// <summary>
        /// ID da preferência criada no Mercado Pago
        /// </summary>
        public string PreferenceId { get; set; } = string.Empty;

        /// <summary>
        /// URL do checkout (modo produção)
        /// </summary>
        public string InitPoint { get; set; } = string.Empty;

        /// <summary>
        /// URL do checkout (sandbox)
        /// </summary>
        public string SandboxInitPoint { get; set; } = string.Empty;
    }
}
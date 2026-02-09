namespace memoriza_backend.Models.DTO.Payments
{
    /// <summary>
    /// Response do processamento de pagamento direto
    /// </summary>
    public class ProcessPaymentResponse
    {
        /// <summary>
        /// ID do pagamento no MercadoPago
        /// </summary>
        public long PaymentId { get; set; }

        /// <summary>
        /// Status do pagamento: "approved", "pending", "rejected", "in_process"
        /// </summary>
        public string Status { get; set; } = string.Empty;

        /// <summary>
        /// Detalhe do status (motivo de rejeição, etc)
        /// </summary>
        public string StatusDetail { get; set; } = string.Empty;

        /// <summary>
        /// </summary>
        public string? TicketUrl { get; set; }

        /// <summary>
        /// Mensagem amigável para o usuário
        /// </summary>
        public string Message { get; set; } = string.Empty;

        /// <summary>
        /// Código Copia e Cola do PIX
        /// </summary>
        public string? QrCode { get; set; }

        /// <summary>
        /// Imagem Base64 do QR Code
        /// </summary>
        public string? QrCodeBase64 { get; set; }
    }
}
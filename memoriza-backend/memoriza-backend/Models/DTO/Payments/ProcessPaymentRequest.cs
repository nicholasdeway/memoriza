using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace memoriza_backend.Models.DTO.Payments
{
    /// <summary>
    /// Request para processar pagamento direto (Checkout Transparente)
    /// </summary>
    public class ProcessPaymentRequest
    {
        /// <summary>
        /// Token gerado pelo MercadoPago SDK no frontend (obrigatório para cartão, opcional para PIX)
        /// </summary>
        [JsonPropertyName("token")]
        public string? Token { get; set; }

        /// <summary>
        /// ID do método de pagamento: "pix", "visa", "master", "elo", etc
        /// </summary>
        [Required(ErrorMessage = "Método de pagamento é obrigatório")]
        [JsonPropertyName("payment_method_id")]
        public string PaymentMethodId { get; set; } = string.Empty;

        /// <summary>
        /// ID do emissor do cartão (obrigatório para cartão de crédito)
        /// </summary>
        [JsonPropertyName("issuer_id")]
        public string? IssuerId { get; set; }

        /// <summary>
        /// Número de parcelas (1 para à vista)
        /// </summary>
        [Range(1, 12, ErrorMessage = "Parcelas devem estar entre 1 e 12")]
        [JsonPropertyName("installments")]
        public int Installments { get; set; } = 1;

        /// <summary>
        /// Dados do pagador (Email, Documento)
        /// </summary>
        [JsonPropertyName("payer")]
        public PaymentPayerRequest? Payer { get; set; }
    }

    public class PaymentPayerRequest
    {
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("identification")]
        public IdentificationRequest? Identification { get; set; }
    }

    public class IdentificationRequest
    {
        [JsonPropertyName("type")]
        public string Type { get; set; } = "CPF";

        [JsonPropertyName("number")]
        public string Number { get; set; } = string.Empty;
    }
}
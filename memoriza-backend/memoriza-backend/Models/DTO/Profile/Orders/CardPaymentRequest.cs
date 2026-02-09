using System.Text.Json.Serialization;

namespace memoriza_backend.Models.DTO.Profile.Orders
{
    public class CardPaymentRequest
    {
        [JsonPropertyName("token")]
        public string? Token { get; set; }

        [JsonPropertyName("payment_method_id")]
        public string PaymentMethodId { get; set; } = string.Empty;

        [JsonPropertyName("installments")]
        public int Installments { get; set; }

        [JsonPropertyName("issuer_id")]
        public string? IssuerId { get; set; }

        [JsonPropertyName("payer")]
        public CardPaymentPayer Payer { get; set; } = new();
    }

    public class CardPaymentPayer
    {
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("identification")]
        public CardPaymentIdentification Identification { get; set; } = new();
    }

    public class CardPaymentIdentification
    {
        [JsonPropertyName("type")]
        public string Type { get; set; } = "CPF";

        [JsonPropertyName("number")]
        public string Number { get; set; } = string.Empty;
    }
}
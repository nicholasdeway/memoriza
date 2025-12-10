using System.Text.Json.Serialization;

namespace memoriza_backend.Models.MercadoPago
{
    public class MercadoPagoInstallmentsRequest
    {
        [JsonPropertyName("amount")]
        public decimal Amount { get; set; }

        [JsonPropertyName("payment_method_id")]
        public string PaymentMethodId { get; set; } = "credit_card";
    }

    public class MercadoPagoPayerCost
    {
        [JsonPropertyName("installments")]
        public int Installments { get; set; }

        [JsonPropertyName("installment_rate")]
        public decimal InstallmentRate { get; set; }

        [JsonPropertyName("installment_amount")]
        public decimal InstallmentAmount { get; set; }

        [JsonPropertyName("total_amount")]
        public decimal TotalAmount { get; set; }

        [JsonPropertyName("recommended_message")]
        public string RecommendedMessage { get; set; } = string.Empty;
    }

    public class MercadoPagoInstallmentsResponse
    {
        [JsonPropertyName("payment_method_id")]
        public string PaymentMethodId { get; set; } = string.Empty;

        [JsonPropertyName("payer_costs")]
        public List<MercadoPagoPayerCost> PayerCosts { get; set; } = new();
    }
}

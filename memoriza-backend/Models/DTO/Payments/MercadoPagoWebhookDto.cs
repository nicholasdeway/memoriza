namespace memoriza_backend.Models.DTO.Payments
{
    public class MercadoPagoWebhookDto
    {
        public string Type { get; set; } = string.Empty; // "payment"
        public WebhookData Data { get; set; } = new();
    }

    public class WebhookData
    {
        public string Id { get; set; } = string.Empty; // id do pagamento no MP
    }
}
namespace memoriza_backend.Models.DTO.Payments
{
    public class MercadoPagoWebhookDto
    {
        public string? Type { get; set; } // "payment"
        public string? Action { get; set; } // "payment.updated", "payment.created", etc.
        public WebhookData? Data { get; set; }
    }

    public class WebhookData
    {
        public string? Id { get; set; } // id do pagamento no MP
    }
}
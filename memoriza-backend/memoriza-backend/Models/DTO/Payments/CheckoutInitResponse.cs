using System;

namespace memoriza_backend.Models.DTO.Payments
{
    public class CheckoutInitResponse
    {
        public Guid OrderId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }

        public string? PreferenceId { get; set; }
        public string? InitPoint { get; set; }
        public string? SandboxInitPoint { get; set; }
        public string? PublicKey { get; set; }
    }
}
using System;

namespace memoriza_backend.Models.DTO.Payments
{
    public class CheckoutInitResponse
    {
        public Guid OrderId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }

        // Dados do Mercado Pago
        public string PreferenceId { get; set; } = string.Empty;
        public string InitPoint { get; set; } = string.Empty;        // URL do Checkout Pro
        public string SandboxInitPoint { get; set; } = string.Empty; // opcional
        public string PublicKey { get; set; } = string.Empty;        // para Brick no frontend
    }
}
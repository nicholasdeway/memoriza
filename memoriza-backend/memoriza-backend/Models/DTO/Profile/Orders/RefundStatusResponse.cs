using System;

namespace memoriza_backend.Models.DTO.User.Orders
{
    /// <summary>
    /// Retorno do status de reembolso para um pedido.
    /// </summary>
    public class RefundStatusResponse
    {
        public Guid OrderId { get; set; }

        /// <summary>
        /// Status do reembolso (ex: "Requested", "Approved", "Rejected").
        /// </summary>
        public string Status { get; set; } = string.Empty;

        /// <summary>
        /// Mensagem opcional com detalhes (motivo de recusa, observações, etc.).
        /// </summary>
        public string? Message { get; set; }

        public DateTime RequestedAt { get; set; }

        public DateTime? ProcessedAt { get; set; }
    }
}
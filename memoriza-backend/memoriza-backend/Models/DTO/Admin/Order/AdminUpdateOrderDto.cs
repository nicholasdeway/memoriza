using memoriza_backend.Helpers;

namespace memoriza_backend.Models.DTO.Admin.Order
{
    public class AdminUpdateOrderDto
    {
        public string UserId { get; set; } = string.Empty;
        public decimal Subtotal { get; set; }
        public decimal FreightValue { get; set; }
        public decimal Total { get; set; }

        public string Status { get; set; } = OrderStatusCodes.Pending;

        public string? PersonalizationNotes { get; set; }

        public DateTime? PaidAt { get; set; }
        public DateTime? ShippedAt { get; set; }
        public DateTime? FinishedAt { get; set; }
        public DateTime? RefundedAt { get; set; }
    }
}
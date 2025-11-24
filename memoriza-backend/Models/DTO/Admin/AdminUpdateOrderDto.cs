using memoriza_backend.Models.Admin;

namespace memoriza_backend.Models.DTO.Admin
{
    public class AdminUpdateOrderDto
    {
        public Guid UserId { get; set; }
        public decimal Subtotal { get; set; }
        public decimal FreightValue { get; set; }
        public decimal Total { get; set; }
        public OrderStatus Status { get; set; }
        public string? PersonalizationNotes { get; set; }
        public DateTime? PaidAt { get; set; }
        public DateTime? ShippedAt { get; set; }
        public DateTime? FinishedAt { get; set; }
        public DateTime? RefundedAt { get; set; }
    }
}
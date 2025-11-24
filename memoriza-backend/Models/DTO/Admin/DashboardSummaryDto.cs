namespace memoriza_backend.Models.DTO.Admin
{
    public class DashboardSummaryDto
    {
        public decimal TotalSales { get; set; }
        public decimal TotalRefunds { get; set; }
        public int TotalOrders { get; set; }
        public int OrdersAwaitingPayment { get; set; }
        public int OrdersInProduction { get; set; }
        public int OrdersFinished { get; set; }
    }

    public class TopProductDto
    {
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = null!;
        public int QuantitySold { get; set; }
        public decimal TotalAmount { get; set; }
    }
}
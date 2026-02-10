namespace memoriza_backend.Models.DTO.Admin.Dashboard
{
    public class DashboardSummaryDto
    {
        public decimal TotalSales { get; set; }
        public decimal TotalRefunds { get; set; }
        public int TotalOrders { get; set; }
        public int OrdersAwaitingPayment { get; set; }
        public int OrdersPaid { get; set; }
        public int OrdersCancelled { get; set; }
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

    public class RecentOrderDto
    {
        public string OrderNumber { get; set; } = null!;
        public string CustomerName { get; set; } = null!;
        public decimal Total { get; set; }
        public string Status { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }

    public class SalesByMonthDto
    {
        public string Month { get; set; } = null!;
        public decimal Sales { get; set; }
    }
}
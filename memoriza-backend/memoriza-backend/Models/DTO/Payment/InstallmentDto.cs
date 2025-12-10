namespace memoriza_backend.Models.DTO.Payment
{
    public class InstallmentOptionDto
    {
        public int Installments { get; set; }
        public decimal InstallmentAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public bool HasInterest { get; set; }
        public string RecommendedMessage { get; set; } = string.Empty;
    }

    public class InstallmentsResponse
    {
        public List<InstallmentOptionDto> Options { get; set; } = new();
        public InstallmentOptionDto? BestOption { get; set; }
    }
}

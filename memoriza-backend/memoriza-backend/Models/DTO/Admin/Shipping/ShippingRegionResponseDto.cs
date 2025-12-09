namespace memoriza_backend.Models.DTO.Admin.Shipping
{
    /// <summary>
    /// DTO de resposta com informações de uma região de frete.
    /// </summary>
    public class ShippingRegionResponseDto
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int EstimatedDays { get; set; }
        public decimal FreeShippingThreshold { get; set; }
        public bool IsActive { get; set; }
    }
}

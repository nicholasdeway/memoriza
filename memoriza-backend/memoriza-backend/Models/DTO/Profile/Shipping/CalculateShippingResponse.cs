namespace memoriza_backend.Models.DTO.User.Shipping
{
    public class CalculateShippingResponse
    {
        public List<ShippingOptionDto> Options { get; set; } = new();

        // Indica se o frete é grátis (atualmente apenas para retirada em mãos)
        public bool IsFreeShipping { get; set; }
    }
}
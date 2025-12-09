namespace memoriza_backend.Models.DTO.User.Shipping
{
    public class CalculateShippingResponse
    {
        public List<ShippingOptionDto> Options { get; set; } = new();

        // Frete grátis configurado pelo admin
        public bool FreeShippingEnabled { get; set; }

        // Valor mínimo para ativar
        public decimal FreeShippingThreshold { get; set; }

        // Se este pedido ATINGIU o limiar (baseado no subtotal)
        public bool IsFreeShipping { get; set; }
    }
}
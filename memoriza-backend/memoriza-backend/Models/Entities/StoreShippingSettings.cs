namespace memoriza_backend.Models.Entities
{
    public class StoreShippingSettings
    {
        public Guid Id { get; set; }

        /// <summary>Se o frete grátis está habilitado.</summary>
        public bool FreeShippingEnabled { get; set; }

        /// <summary>Valor mínimo do subtotal do carrinho para aplicar frete grátis.</summary>
        public decimal FreeShippingThreshold { get; set; }
    }
}
namespace memoriza_backend.Models.DTO.Admin.Shipping
{
    /// <summary>
    /// DTO para atualizar configurações de uma região de frete.
    /// </summary>
    public class UpdateShippingRegionDto
    {
        /// <summary>
        /// Valor do frete para esta região.
        /// </summary>
        public decimal Price { get; set; }

        /// <summary>
        /// Prazo estimado de entrega em dias úteis.
        /// </summary>
        public int EstimatedDays { get; set; }

    }
}

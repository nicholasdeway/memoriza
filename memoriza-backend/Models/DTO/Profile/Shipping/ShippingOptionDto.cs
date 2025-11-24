namespace memoriza_backend.Models.DTO.User.Shipping
{
    /// <summary>
    /// Representa uma opção de frete disponível para o usuário.
    /// </summary>
    public class ShippingOptionDto
    {
        /// <summary>
        /// Código interno da opção (ex: "SUDESTE", "CENTRO_OESTE", "RETIRADA").
        /// </summary>
        public string Code { get; set; } = string.Empty;

        /// <summary>
        /// Nome amigável para exibição (ex: "Frete Sudeste", "Retirada na loja").
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Descrição opcional com detalhes.
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Valor do frete.
        /// </summary>
        public decimal Price { get; set; }

        /// <summary>
        /// Prazo estimado de entrega, em dias (0 para retirada).
        /// </summary>
        public int EstimatedDays { get; set; }
    }
}
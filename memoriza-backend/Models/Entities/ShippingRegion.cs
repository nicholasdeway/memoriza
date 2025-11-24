using System;

namespace memoriza_backend.Models.Entities
{
    /// <summary>
    /// Região de frete com valor fixo (ex: Sudeste, Centro-Oeste, Retirada na loja).
    /// </summary>
    public class ShippingRegion
    {
        public Guid Id { get; set; }

        /// <summary>
        /// Código interno da região (ex: SUDESTE, CENTRO_OESTE, RETIRADA).
        /// </summary>
        public string Code { get; set; } = string.Empty;

        /// <summary>
        /// Nome amigável para exibição (ex: "Região Sudeste", "Retirada na loja").
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Valor fixo do frete para essa região.
        /// Para retirada, pode ser 0.
        /// </summary>
        public decimal Price { get; set; }

        /// <summary>
        /// Prazo estimado em dias. Para retirada, pode ser 0.
        /// </summary>
        public int EstimatedDays { get; set; }

        /// <summary>
        /// True se esta opção representa retirada na loja.
        /// </summary>
        public bool IsPickupOption { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
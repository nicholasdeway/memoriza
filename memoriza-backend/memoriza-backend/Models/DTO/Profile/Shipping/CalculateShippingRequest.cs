namespace memoriza_backend.Models.DTO.User.Shipping
{
    /// <summary>
    /// Dados para cálculo de frete.
    /// </summary>
    public class CalculateShippingRequest
    {
        /// <summary>
        /// CEP de destino informado pelo usuário (pode vir com ou sem hífen).
        /// </summary>
        public string Cep { get; set; } = string.Empty;

        /// <summary>
        /// Indica se o usuário deseja retirar pessoalmente na loja.
        /// Se true, o backend pode retornar apenas opção de retirada com frete 0.
        /// </summary>
        public bool PickupInStore { get; set; }

        /// <summary>
        /// Subtotal atual do carrinho (sem frete).
        /// Usado para aplicar regra de frete grátis acima de X reais.
        /// </summary>
        public decimal CartSubtotal { get; set; }
    }
}
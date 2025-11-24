namespace memoriza_backend.Models.DTO.User.Cart
{
    /// <summary>
    /// Requisição para limpar todo o carrinho.
    /// </summary>
    public class ClearCartRequest
    {
        /// <summary>
        /// Flag de confirmação para evitar limpeza acidental.
        /// </summary>
        public bool Confirm { get; set; }
    }
}
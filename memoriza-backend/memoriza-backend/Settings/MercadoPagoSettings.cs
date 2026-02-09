namespace memoriza_backend.Settings
{
    public class MercadoPagoSettings
    {
        public string AccessToken { get; set; } = string.Empty;
        public string PublicKey { get; set; } = string.Empty;

        public string SuccessUrl { get; set; } = string.Empty;
        public string FailureUrl { get; set; } = string.Empty;
        public string PendingUrl { get; set; } = string.Empty;
        public string NotificationUrl { get; set; } = string.Empty;
        
        /// <summary>
        /// Ambiente do MercadoPago: "test" ou "production".
        /// IMPORTANTE: Defina explicitamente pois as chaves de teste agora começam com APP_USR- também.
        /// </summary>
        public string Environment { get; set; } = "test";
        
        /// <summary>
        /// Indica se está em modo de teste (sandbox).
        /// </summary>
        public bool IsSandbox => Environment?.ToLower() == "test";
    }
}
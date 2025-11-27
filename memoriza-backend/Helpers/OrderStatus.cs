namespace memoriza_backend.Helpers
{
    public static class OrderStatusCodes
    {
        public const string Pending = "Pending";
        public const string Paid = "Paid";
        public const string InProduction = "InProduction";
        public const string Shipped = "Shipped";
        public const string Delivered = "Delivered";
        public const string Refunded = "Refunded";
        public const string Cancelled = "Cancelled";
    }

    public static class OrderStatusMapper
    {
        public static string ToDisplayLabel(string statusCode)
        {
            return statusCode switch
            {
                OrderStatusCodes.Pending => "Pendente",
                OrderStatusCodes.Paid => "Aprovado",
                OrderStatusCodes.InProduction => "Em produção",
                OrderStatusCodes.Shipped => "À caminho",
                OrderStatusCodes.Delivered => "Finalizado",
                OrderStatusCodes.Refunded => "Reembolsado",
                OrderStatusCodes.Cancelled => "Cancelado",
                _ => "Desconhecido"
            };
        }
    }
}
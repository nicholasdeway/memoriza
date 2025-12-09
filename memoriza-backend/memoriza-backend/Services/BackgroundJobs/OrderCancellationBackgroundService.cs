using memoriza_backend.Services.Profile.OrderService;

namespace memoriza_backend.Services.BackgroundJobs
{
    /// <summary>
    /// Background service que cancela automaticamente pedidos pendentes
    /// que expiraram (mais de 24 horas sem pagamento).
    /// </summary>
    public class OrderCancellationBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<OrderCancellationBackgroundService> _logger;
        private readonly TimeSpan _checkInterval;

        public OrderCancellationBackgroundService(
            IServiceProvider serviceProvider,
            ILogger<OrderCancellationBackgroundService> logger,
            IConfiguration configuration)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;

            // Ler intervalo de verificação do appsettings (padrão: 60 minutos)
            var intervalMinutes = configuration.GetValue<int>("OrderCancellation:CheckIntervalMinutes", 60);
            _checkInterval = TimeSpan.FromMinutes(intervalMinutes);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("🚀 OrderCancellationBackgroundService iniciado");
            _logger.LogInformation($"⏰ Verificando pedidos expirados a cada {_checkInterval.TotalMinutes} minutos");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CancelExpiredOrdersAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "❌ Erro ao processar cancelamento de pedidos expirados");
                }

                // Aguardar próximo ciclo
                await Task.Delay(_checkInterval, stoppingToken);
            }

            _logger.LogInformation("🛑 OrderCancellationBackgroundService parado");
        }

        private async Task CancelExpiredOrdersAsync()
        {
            using var scope = _serviceProvider.CreateScope();
            var orderService = scope.ServiceProvider.GetRequiredService<ICustomerOrderService>();

            _logger.LogInformation("🔍 Verificando pedidos pendentes expirados...");

            var canceledCount = await orderService.CancelExpiredOrdersAsync();

            if (canceledCount > 0)
            {
                _logger.LogInformation($"✅ {canceledCount} pedido(s) cancelado(s) automaticamente");
            }
            else
            {
                _logger.LogInformation("ℹ️ Nenhum pedido expirado encontrado");
            }
        }
    }
}

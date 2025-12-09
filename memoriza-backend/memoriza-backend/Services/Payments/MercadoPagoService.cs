using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using memoriza_backend.Helpers;
using memoriza_backend.Models.DTO.Payments;
using memoriza_backend.Models.Entities;
using memoriza_backend.Repositories.Interfaces;
using memoriza_backend.Settings;
using MercadoPago.Client.Payment;
using MercadoPago.Client.Preference;
using MercadoPago.Config;
using MercadoPago.Resource.Payment;
using MercadoPago.Resource.Preference;
using Microsoft.Extensions.Options;

namespace memoriza_backend.Services.Payments
{
    public class MercadoPagoService : IMercadoPagoService
    {
        private readonly MercadoPagoSettings _settings;
        private readonly ICustomerOrderRepository _orderRepository;

        public MercadoPagoService(
            IOptions<MercadoPagoSettings> options,
            ICustomerOrderRepository orderRepository
        )
        {
            _settings = options.Value;
            _orderRepository = orderRepository;

            // Configura o SDK do Mercado Pago para PRODUÇÃO
            MercadoPagoConfig.AccessToken = _settings.AccessToken;
            
            // FORÇA o ambiente de PRODUÇÃO (não sandbox)
            // Isso garante que mesmo com credenciais de produção, não use sandbox
            Environment.SetEnvironmentVariable("MP_ENV", "production");
            
            // 🔍 Log de configuração
            Console.WriteLine("🚀 MercadoPagoService inicializado:");
            Console.WriteLine($"  AccessToken: {(_settings.AccessToken?.Length > 0 ? "✅ Configurado" : "❌ VAZIO")}");
            Console.WriteLine($"  SuccessUrl: {_settings.SuccessUrl ?? "❌ NULL"}");
            Console.WriteLine($"  FailureUrl: {_settings.FailureUrl ?? "❌ NULL"}");
            Console.WriteLine($"  PendingUrl: {_settings.PendingUrl ?? "❌ NULL"}");
        }

        // ==========================================================
        // CREATE PREFERENCE
        // ==========================================================
        public async Task<PreferenceResponseDto?> CreatePreferenceForOrderAsync(
            Order order,
            List<OrderItem> items)
        {
            var client = new PreferenceClient();

            var mpItems = items.Select(i => new PreferenceItemRequest
            {
                Id = i.ProductId.ToString(),
                Title = i.ProductName,
                Quantity = i.Quantity,
                CurrencyId = "BRL",
                UnitPrice = i.UnitPrice
            }).ToList();

            // 🚚 Adiciona o frete como um item separado (se houver)
            if (order.ShippingAmount > 0)
            {
                mpItems.Add(new PreferenceItemRequest
                {
                    Id = "shipping",
                    Title = $"Frete - {order.ShippingName}",
                    Quantity = 1,
                    CurrencyId = "BRL",
                    UnitPrice = order.ShippingAmount
                });
            }

            // Validar URLs antes de criar preferência
            if (string.IsNullOrWhiteSpace(_settings.SuccessUrl))
                throw new InvalidOperationException("MercadoPago:SuccessUrl não configurado");
            if (string.IsNullOrWhiteSpace(_settings.FailureUrl))
                throw new InvalidOperationException("MercadoPago:FailureUrl não configurado");
            if (string.IsNullOrWhiteSpace(_settings.PendingUrl))
                throw new InvalidOperationException("MercadoPago:PendingUrl não configurado");

            Console.WriteLine($"🔍 URLs Mercado Pago:");
            Console.WriteLine($"  Success: {_settings.SuccessUrl}");
            Console.WriteLine($"  Failure: {_settings.FailureUrl}");
            Console.WriteLine($"  Pending: {_settings.PendingUrl}");

            var request = new PreferenceRequest
            {
                Items = mpItems,
                ExternalReference = order.Id.ToString(),
                
                // 🏪 Nome que aparece no checkout
                StatementDescriptor = "Memoriza",
                
                // 💳 Configuração de Métodos de Pagamento
                PaymentMethods = new PreferencePaymentMethodsRequest
                {
                    // Métodos EXCLUÍDOS (desabilitados)
                    ExcludedPaymentTypes = new List<PreferencePaymentTypeRequest>
                    {
                        // Desabilitar boleto (demora 1-3 dias + taxa)
                        new PreferencePaymentTypeRequest { Id = "ticket" },
                        
                        // Desabilitar débito (opcional - descomente se quiser desabilitar)
                        // new PreferencePaymentTypeRequest { Id = "debit_card" },
                    },
                    
                    // Parcelamento máximo (12x)
                    Installments = 12,
                    
                    // Parcelas sem juros (opcional - configure no painel do Mercado Pago)
                    // DefaultInstallments = 1,
                },
                
                // ❌ TEMPORARIAMENTE REMOVIDO - Testando se BackUrls está causando erro
                // BackUrls = new PreferenceBackUrlsRequest
                // {
                //     Success = _settings.SuccessUrl,
                //     Failure = _settings.FailureUrl,
                //     Pending = _settings.PendingUrl
                // },
                // AutoReturn = "approved",
                
                NotificationUrl = _settings.NotificationUrl
            };

            Preference preference = await client.CreateAsync(request);

            return new PreferenceResponseDto
            {
                PreferenceId = preference.Id,
                InitPoint = preference.InitPoint,
                SandboxInitPoint = preference.SandboxInitPoint,
                PublicKey = _settings.PublicKey
            };
        }

        // ==========================================================
        // PROCESS WEBHOOK
        // ==========================================================
        public async Task ProcessWebhookAsync(MercadoPagoWebhookDto data)
        {
            try
            {
                string? eventType = data.Type;
                string? paymentIdStr = data.Data?.Id;

                // Ignora eventos que não sejam de pagamento
                if (!string.Equals(eventType, "payment", StringComparison.OrdinalIgnoreCase))
                    return;

                if (string.IsNullOrWhiteSpace(paymentIdStr))
                    return;

                if (!long.TryParse(paymentIdStr, out long paymentId))
                    return;

                // 1) CONSULTAR PAGAMENTO NO MERCADO PAGO
                var paymentClient = new PaymentClient();
                Payment payment = await paymentClient.GetAsync(paymentId);

                // 2) OBTER O ID DO PEDIDO (external_reference)
                var externalRef = payment.ExternalReference;
                if (!Guid.TryParse(externalRef, out Guid orderId))
                    return;

                // 3) TRATAR STATUS DO PAGAMENTO (Mercado Pago -> OrderStatusCodes)
                var status = payment.Status; // "approved", "rejected", "pending", etc.

                string newStatus = status switch
                {
                    // Pagamento concluído / aprovado
                    "approved" => OrderStatusCodes.Paid,
                    "authorized" => OrderStatusCodes.Paid,

                    // Em análise / aguardando
                    "in_process" => OrderStatusCodes.Pending,
                    "in_mediation" => OrderStatusCodes.Pending,
                    "pending" => OrderStatusCodes.Pending,

                    // Cancelado / recusado
                    "cancelled" => OrderStatusCodes.Cancelled,
                    "rejected" => OrderStatusCodes.Cancelled,

                    // Estornado / chargeback
                    "refunded" => OrderStatusCodes.Refunded,
                    "charged_back" => OrderStatusCodes.Refunded,

                    // Qualquer outro cai como pendente
                    _ => OrderStatusCodes.Pending
                };

                // 4) ATUALIZAR PEDIDO NO BANCO
                await _orderRepository.UpdateStatusAsync(orderId, newStatus);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro no webhook Mercado Pago: {ex.Message}");
            }
        }
    }
}

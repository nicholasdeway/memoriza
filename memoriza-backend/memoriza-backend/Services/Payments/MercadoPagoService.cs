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
using MercadoPago.Client.Common;
using MercadoPago.Config;
using MercadoPago.Resource.Payment;
using MercadoPago.Resource.Preference;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace memoriza_backend.Services.Payments
{
    public class MercadoPagoService : IMercadoPagoService
    {
        private readonly MercadoPagoSettings _settings;
        private readonly ICustomerOrderRepository _orderRepository;
        private readonly ICartRepository _cartRepository;
        private readonly ILogger<MercadoPagoService> _logger;

        public MercadoPagoService(
            IOptions<MercadoPagoSettings> options,
            ICustomerOrderRepository orderRepository,
            ICartRepository cartRepository,
            ILogger<MercadoPagoService> logger
        )
        {
            _settings = options.Value;
            _orderRepository = orderRepository;
            _cartRepository = cartRepository;
            _logger = logger;

            // Configura o SDK do Mercado Pago
            MercadoPagoConfig.AccessToken = _settings.AccessToken;
            
        }

        public async Task<ProcessPaymentResponse> ProcessPaymentAsync(Guid orderId, ProcessPaymentRequest request)
        {
            _logger.LogInformation("Iniciando processamento de pagamento para o pedido {OrderId}. Método: {PaymentMethod}", orderId, request.PaymentMethodId);

            var order = await _orderRepository.GetByIdWithItemsAsync(orderId);
            if (order == null)
            {
                _logger.LogWarning("Tentativa de pagamento para pedido inexistente: {OrderId}", orderId);
                throw new InvalidOperationException($"Pedido {orderId} não encontrado");
            }

            var paymentClient = new PaymentClient();
            var paymentRequest = CreatePaymentRequest(order, request);

            try
            {
                Payment payment = await paymentClient.CreateAsync(paymentRequest);
                _logger.LogInformation("Pagamento criado com sucesso. ID: {PaymentId}, Status: {Status}", payment.Id, payment.Status);

                order.PaymentId = payment.Id;
                await _orderRepository.UpdateAsync(order);

                return await HandlePaymentResponseAsync(payment, orderId, request.PaymentMethodId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao criar pagamento no Mercado Pago para o pedido {OrderId}", orderId);
                throw;
            }
        }

        private PaymentCreateRequest CreatePaymentRequest(Order order, ProcessPaymentRequest request)
        {
            return new PaymentCreateRequest
            {
                TransactionAmount = order.TotalAmount,
                Token = request.PaymentMethodId == "pix" ? null : request.Token,
                Description = $"Pedido {order.OrderNumber}",
                ExternalReference = order.Id.ToString(),
                PaymentMethodId = request.PaymentMethodId?.Trim().ToLower() == "master" ? "master" : request.PaymentMethodId?.Trim(),
                IssuerId = request.IssuerId,
                Installments = request.Installments,
                Payer = new MercadoPago.Client.Payment.PaymentPayerRequest
                {
                    Email = request.Payer?.Email,
                    Identification = new MercadoPago.Client.Common.IdentificationRequest
                    {
                        Type = request.Payer?.Identification?.Type ?? "CPF",
                        Number = request.Payer?.Identification?.Number ?? "00000000000"
                    }
                },
                NotificationUrl = _settings.NotificationUrl,
                Metadata = new Dictionary<string, object>
                {
                    { "order_id", order.Id.ToString() },
                    { "order_number", order.OrderNumber }
                }
            };
        }

        private async Task<ProcessPaymentResponse> HandlePaymentResponseAsync(Payment payment, Guid orderId, string? paymentMethodId)
        {
            var response = new ProcessPaymentResponse
            {
                PaymentId = payment.Id ?? 0,
                Status = payment.Status ?? "unknown",
                StatusDetail = payment.StatusDetail ?? "",
            };

            switch (payment.Status)
            {
                case "approved":
                    response.Message = "Pagamento aprovado!";
                    await _orderRepository.UpdateStatusAsync(orderId, OrderStatusCodes.Paid);
                    break;

                case "pending":
                    if (paymentMethodId == "pix")
                    {
                        response.Message = "Aguardando pagamento via PIX";
                        response.QrCode = payment.PointOfInteraction?.TransactionData?.QrCode;
                        response.QrCodeBase64 = payment.PointOfInteraction?.TransactionData?.QrCodeBase64;
                    }
                    else
                    {
                        response.Message = "Pagamento em análise";
                    }
                    break;

                case "in_process":
                    response.Message = "Pagamento em processamento";
                    break;

                case "rejected":
                    response.Message = GetRejectionMessage(payment.StatusDetail);
                    break;

                default:
                    response.Message = "Status de pagamento desconhecido";
                    break;
            }

            return response;
        }

        private string GetRejectionMessage(string? statusDetail)
        {
            return statusDetail switch
            {
                "cc_rejected_insufficient_amount" => "Cartão sem saldo suficiente",
                "cc_rejected_bad_filled_security_code" => "Código de segurança inválido",
                "cc_rejected_bad_filled_date" => "Data de validade inválida",
                "cc_rejected_bad_filled_other" => "Dados do cartão inválidos",
                "cc_rejected_call_for_authorize" => "Entre em contato com o banco para autorizar",
                "cc_rejected_card_disabled" => "Cartão desabilitado",
                "cc_rejected_duplicated_payment" => "Pagamento duplicado",
                "cc_rejected_high_risk" => "Pagamento recusado por segurança (Alto Risco)",
                "cc_rejected_max_attempts" => "Número máximo de tentativas excedido",
                _ => $"Pagamento recusado ({statusDetail}). Tente outro método."
            };
        }

        public async Task ProcessWebhookAsync(MercadoPagoWebhookDto data)
        {
            try
            {
                // Aceitar webhooks quando Type == "payment" OU Action == "payment.updated"
                bool isValidWebhook = 
                    string.Equals(data.Type, "payment", StringComparison.OrdinalIgnoreCase) ||
                    string.Equals(data.Action, "payment.updated", StringComparison.OrdinalIgnoreCase);

                if (!isValidWebhook)
                {
                    _logger.LogInformation("Webhook ignorado. Type: {Type}, Action: {Action}", data.Type, data.Action);
                    return;
                }
                
                string? paymentIdStr = data.Data?.Id;
                if (string.IsNullOrWhiteSpace(paymentIdStr) || !long.TryParse(paymentIdStr, out long paymentId))
                {
                    _logger.LogWarning("Webhook com PaymentId inválido ou ausente: {PaymentIdStr}", paymentIdStr);
                    return;
                }

                _logger.LogInformation("📥 Processando webhook - PaymentId: {PaymentId}", paymentId);

                var paymentClient = new PaymentClient();
                Payment payment = await paymentClient.GetAsync(paymentId);

                _logger.LogInformation("💳 Pagamento obtido - Status: {Status}, StatusDetail: {StatusDetail}", 
                    payment.Status, payment.StatusDetail);

                if (!Guid.TryParse(payment.ExternalReference, out Guid orderId))
                {
                    _logger.LogWarning("ExternalReference inválida: {ExternalReference}", payment.ExternalReference);
                    return;
                }

                _logger.LogInformation("🔗 ExternalReference (OrderId): {OrderId}", orderId);

                string newStatus = payment.Status switch
                {
                    "approved" or "authorized" => OrderStatusCodes.Paid,
                    "in_process" or "in_mediation" or "pending" => OrderStatusCodes.Pending,
                    "cancelled" or "rejected" => OrderStatusCodes.Cancelled,
                    "refunded" or "charged_back" => OrderStatusCodes.Refunded,
                    _ => OrderStatusCodes.Pending
                };

                // Implementar idempotência: buscar pedido atual antes de atualizar
                var currentOrder = await _orderRepository.GetByIdWithItemsAsync(orderId);
                if (currentOrder == null)
                {
                    _logger.LogWarning("Pedido não encontrado: {OrderId}", orderId);
                    return;
                }

                // Se o status atual já for "Paid" e o novo status também for "Paid", ignorar
                if (currentOrder.Status == OrderStatusCodes.Paid && newStatus == OrderStatusCodes.Paid)
                {
                    _logger.LogInformation("✅ Webhook duplicado ignorado - Pedido {OrderId} já está com status Paid", orderId);
                    return;
                }

                await _orderRepository.UpdateStatusAsync(orderId, newStatus);
                _logger.LogInformation("✅ Webhook processado. Pedido: {OrderId}, Status Anterior: {OldStatus}, Novo Status: {NewStatus}", 
                    orderId, currentOrder.Status, newStatus);

                if (newStatus == OrderStatusCodes.Paid)
                {
                    await ClearCartAsync(currentOrder.UserId);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Erro ao processar webhook do Mercado Pago");
            }
        }

        private async Task ClearCartAsync(string userId)
        {
             try 
            {
                var cart = await _cartRepository.GetActiveCartAsync(userId);
                if (cart != null)
                {
                    await _cartRepository.ClearCartAsync(cart.Id);
                    _logger.LogInformation("Carrinho do usuário {UserId} limpo após pagamento", userId);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao limpar carrinho do usuário {UserId} após pagamento", userId);
            }
        }
    }
}
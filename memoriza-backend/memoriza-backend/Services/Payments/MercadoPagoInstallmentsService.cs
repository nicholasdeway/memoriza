using System.Text.Json;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using memoriza_backend.Models.MercadoPago;
using memoriza_backend.Models.DTO.Payment;
using memoriza_backend.Settings;

namespace memoriza_backend.Services.Payments
{
    public interface IMercadoPagoInstallmentsService
    {
        Task<InstallmentsResponse> GetInstallmentsAsync(decimal amount);
    }

    public class MercadoPagoInstallmentsService : IMercadoPagoInstallmentsService
    {
        private readonly HttpClient _httpClient;
        private readonly IMemoryCache _cache;
        private readonly string _publicKey;
        private const string CACHE_KEY_PREFIX = "installments_";
        private static readonly TimeSpan CacheDuration = TimeSpan.FromHours(1);

        public MercadoPagoInstallmentsService(
            HttpClient httpClient,
            IMemoryCache cache,
            IOptions<MercadoPagoSettings> mercadoPagoSettings)
        {
            _httpClient = httpClient;
            _cache = cache;
            _publicKey = mercadoPagoSettings.Value.PublicKey;
        }

        public async Task<InstallmentsResponse> GetInstallmentsAsync(decimal amount)
        {
            // Arredonda para 2 casas decimais para cache
            var roundedAmount = Math.Round(amount, 2);
            var cacheKey = $"{CACHE_KEY_PREFIX}{roundedAmount}";

            // Tenta buscar do cache
            if (_cache.TryGetValue<InstallmentsResponse>(cacheKey, out var cachedResult) && cachedResult != null)
            {
                return cachedResult;
            }

            try
            {
                // BIN de cartão Mastercard brasileiro comum
                // Este BIN tende a ter mais opções de parcelamento
                const string GENERIC_MASTERCARD_BIN = "545301";
                
                // Chama API do Mercado Pago
                var url = $"https://api.mercadopago.com/v1/payment_methods/installments" +
                         $"?public_key={_publicKey}" +
                         $"&amount={roundedAmount.ToString(System.Globalization.CultureInfo.InvariantCulture)}" +
                         $"&bin={GENERIC_MASTERCARD_BIN}";

                Console.WriteLine($"🔍 Buscando parcelamento do MP para R$ {roundedAmount}");
                Console.WriteLine($"📡 URL: {url}");

                var response = await _httpClient.GetAsync(url);

                Console.WriteLine($"📊 Status: {response.StatusCode}");

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"❌ Erro na API do MP: {errorContent}");
                    // Fallback para cálculo local
                    return GetFallbackInstallments(roundedAmount);
                }

                var content = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"✅ Resposta COMPLETA do MP:");
                Console.WriteLine(content); // Log completo para debug

                var mpResponses = JsonSerializer.Deserialize<List<MercadoPagoInstallmentsResponse>>(content);

                if (mpResponses == null || mpResponses.Count == 0)
                {
                    Console.WriteLine($"⚠️ Resposta vazia do MP");
                    return GetFallbackInstallments(roundedAmount);
                }

                // Pega a primeira opção (geralmente é a mais comum)
                var mpResponse = mpResponses[0];

                var result = new InstallmentsResponse
                {
                    Options = mpResponse.PayerCosts.Select(pc => new InstallmentOptionDto
                    {
                        Installments = pc.Installments,
                        InstallmentAmount = pc.InstallmentAmount,
                        TotalAmount = pc.TotalAmount,
                        HasInterest = pc.InstallmentRate > 0,
                        RecommendedMessage = pc.RecommendedMessage
                    }).ToList()
                };

                // Define a melhor opção (última, que tem mais parcelas)
                result.BestOption = result.Options.LastOrDefault();

                Console.WriteLine($"✅ Retornando {result.Options.Count} opções de parcelamento");

                // Cacheia por 1 hora
                _cache.Set(cacheKey, result, CacheDuration);

                return result;
            }
            catch (Exception ex)
            {
                // Em caso de erro, retorna fallback
                Console.WriteLine($"❌ ERRO ao buscar parcelamento do MP: {ex.Message}");
                Console.WriteLine($"🔧 Stack: {ex.StackTrace}");
                return GetFallbackInstallments(roundedAmount);
            }
        }

        private InstallmentsResponse GetFallbackInstallments(decimal amount)
        {
            // Cálculo local simplificado como fallback
            var options = new List<InstallmentOptionDto>();
            
            int maxInstallments = amount switch
            {
                < 30 => 3,
                < 100 => 6,
                < 300 => 10,
                _ => 12
            };

            for (int i = 1; i <= maxInstallments; i++)
            {
                decimal installmentAmount;
                decimal totalAmount;
                bool hasInterest = i > 3; // Sem juros até 3x

                if (hasInterest)
                {
                    // Aplica juros simples de ~5% ao mês
                    var rate = 0.05m;
                    var factor = (decimal)Math.Pow((double)(1 + rate), i);
                    installmentAmount = (amount * factor * rate) / (factor - 1);
                    totalAmount = installmentAmount * i;
                }
                else
                {
                    installmentAmount = amount / i;
                    totalAmount = amount;
                }

                options.Add(new InstallmentOptionDto
                {
                    Installments = i,
                    InstallmentAmount = Math.Round(installmentAmount, 2),
                    TotalAmount = Math.Round(totalAmount, 2),
                    HasInterest = hasInterest,
                    RecommendedMessage = hasInterest 
                        ? $"{i}x de {installmentAmount:C} com juros"
                        : $"{i}x de {installmentAmount:C} sem juros"
                });
            }

            return new InstallmentsResponse
            {
                Options = options,
                BestOption = options.LastOrDefault()
            };
        }
    }
}

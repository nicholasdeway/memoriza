using memoriza_backend.Models.DTO.User.Shipping;
using memoriza_backend.Repositories.Shipping;

namespace memoriza_backend.Services.Profile.ShippingService
{
    public class ShippingService : IShippingService
    {
        private readonly IShippingCalculatorService _shippingCalculator;
        private readonly IShippingRepository _shippingRepository;

        public ShippingService(
            IShippingCalculatorService shippingCalculator,
            IShippingRepository shippingRepository)
        {
            _shippingCalculator = shippingCalculator;
            _shippingRepository = shippingRepository;
        }

        public async Task<CalculateShippingResponse?> CalculateShippingAsync(CalculateShippingRequest request)
        {
            // Se for retirada em loja
            if (request.PickupInStore)
            {
                return new CalculateShippingResponse
                {
                    Options = new List<ShippingOptionDto>
                    {
                        new ShippingOptionDto
                        {
                            Code = "PICKUP",
                            Name = "Retirada na loja",
                            Description = "Retire pessoalmente em nossa loja.",
                            Price = 0m,
                            EstimatedDays = 0
                        }
                    },
                    FreeShippingEnabled = false,
                    FreeShippingThreshold = 0,
                    IsFreeShipping = true
                };
            }

            if (string.IsNullOrWhiteSpace(request.Cep))
                return null;

            // Busca opção de frete configurada pelo admin
            var option = await _shippingCalculator.GetShippingByCepAsync(request.Cep);

            if (option == null)
                return null;

            // ✅ Calcular frete grátis baseado no threshold da região
            bool isFreeShipping = false;
            decimal threshold = 0m;

            // Buscar a região completa para obter o threshold
            var regionEntity = await _shippingRepository.GetRegionByCodeAsync(option.Code);
            
            if (regionEntity != null)
            {
                threshold = regionEntity.FreeShippingThreshold;
                // Frete grátis se: threshold > 0 E subtotal >= threshold
                isFreeShipping = threshold > 0 && request.CartSubtotal >= threshold;
            }

            return new CalculateShippingResponse
            {
                Options = new List<ShippingOptionDto> { option },
                FreeShippingEnabled = threshold > 0,
                FreeShippingThreshold = threshold,
                IsFreeShipping = isFreeShipping // ✅ Calculado corretamente
            };
        }

        /// <summary>
        /// ✅ VALIDAÇÃO DE SEGURANÇA: Recalcula frete no servidor durante checkout
        /// </summary>
        public async Task<(bool IsValid, string? ErrorMessage, decimal ExpectedAmount)> ValidateShippingForCheckoutAsync(
            string cep,
            bool pickupInStore,
            string shippingCode,
            decimal shippingAmount,
            decimal cartSubtotal)
        {
            // Recalcular frete no servidor
            var calculatedShipping = await CalculateShippingAsync(new CalculateShippingRequest
            {
                Cep = cep,
                PickupInStore = pickupInStore,
                CartSubtotal = cartSubtotal
            });

            if (calculatedShipping == null)
            {
                return (false, "Não foi possível calcular o frete para este endereço.", 0);
            }

            // Encontrar a opção selecionada
            var selectedOption = calculatedShipping.Options.FirstOrDefault(o => o.Code == shippingCode);
            if (selectedOption == null)
            {
                return (false, "Opção de frete inválida.", 0);
            }

            // Calcular valor esperado (considerando frete grátis)
            decimal expectedAmount = calculatedShipping.IsFreeShipping ? 0 : selectedOption.Price;

            // Validar com tolerância de 1 centavo (para evitar problemas de arredondamento)
            if (Math.Abs(shippingAmount - expectedAmount) > 0.01m)
            {
                return (false, 
                    $"Valor de frete inválido. Esperado: R$ {expectedAmount:F2}, Recebido: R$ {shippingAmount:F2}", 
                    expectedAmount);
            }

            return (true, null, expectedAmount);
        }
    }
}
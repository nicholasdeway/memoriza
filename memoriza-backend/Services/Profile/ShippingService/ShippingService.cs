using memoriza_backend.Models.DTO.User.Shipping;
using memoriza_backend.Helpers;

namespace memoriza_backend.Services.Profile.ShippingService
{
    public class ShippingService : IShippingService
    {
        private readonly IShippingCalculatorService _shippingCalculator;

        public ShippingService(IShippingCalculatorService shippingCalculator)
        {
            _shippingCalculator = shippingCalculator;
        }

        public Task<ServiceResult<CalculateShippingResponse>> CalculateShippingAsync(
            string userId,
            CalculateShippingRequest request)
        {
            // 1) Se for retirada na loja, não precisa de CEP nem calculadora.
            if (request.PickupInStore)
            {
                var pickupOption = new ShippingOptionDto
                {
                    Code = "PICKUP",
                    Name = "Retirada na loja",
                    Description = "Retire seu pedido diretamente no ponto físico.",
                    Price = 0m,
                    EstimatedDays = 0
                };

                var pickupResponse = new CalculateShippingResponse
                {
                    Options = new List<ShippingOptionDto> { pickupOption }
                };

                return Task.FromResult(
                    ServiceResult<CalculateShippingResponse>.Ok(pickupResponse)
                );
            }

            // 2) Entrega: CEP é obrigatório (já tem FluentValidation, mas garantimos aqui também)
            if (string.IsNullOrWhiteSpace(request.Cep))
            {
                return Task.FromResult(
                    ServiceResult<CalculateShippingResponse>.Fail("CEP é obrigatório para cálculo de frete.")
                );
            }

            // 3) Busca opção de frete pela região/CEP
            var option = _shippingCalculator.GetShippingByCep(request.Cep);

            if (option == null)
            {
                return Task.FromResult(
                    ServiceResult<CalculateShippingResponse>.Fail("CEP fora da área de cobertura.")
                );
            }

            // 4) Monta resposta com lista de opções (hoje só 1, no futuro pode ter várias)
            var response = new CalculateShippingResponse
            {
                Options = new List<ShippingOptionDto> { option }
            };

            return Task.FromResult(
                ServiceResult<CalculateShippingResponse>.Ok(response)
            );
        }
    }
}
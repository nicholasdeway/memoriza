using memoriza_backend.Models.DTO.User.Shipping;
using memoriza_backend.Repositories.Interfaces;
using memoriza_backend.Helpers;

namespace memoriza_backend.Services.Profile.ShippingService
{
    public class ShippingService : IShippingService
    {
        private readonly IShippingRepository _shippingRepository;

        public ShippingService(IShippingRepository shippingRepository)
        {
            _shippingRepository = shippingRepository;
        }

        public async Task<ServiceResult<CalculateShippingResponse>> CalculateShippingAsync(
            string userId,
            CalculateShippingRequest request)
        {
            // Exemplo de uso do repositório, sem quebrar a interface:
            // Você pode escolher usar GetByCodeAsync ou GetAllActiveAsync
            // dependendo de como seu CalculateShippingRequest foi definido.

            // 👇 Isso compila, mesmo que você ainda não use o resultado:
            var regions = await _shippingRepository.GetAllActiveAsync();

            // Aqui você monta a resposta.
            // Como eu não sei ainda quais propriedades existem em CalculateShippingResponse,
            // vou criar só o objeto "vazio" (compila e você ajusta depois).
            var response = new CalculateShippingResponse
            {
                // TODO: Preencher propriedades com base em "request" e/ou "regions"
            };

            return ServiceResult<CalculateShippingResponse>.Ok(response);
        }
    }
}
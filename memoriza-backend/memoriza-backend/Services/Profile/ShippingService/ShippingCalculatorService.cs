using System;
using System.Linq;
using System.Threading.Tasks;
using memoriza_backend.Models.DTO.User.Shipping;
using memoriza_backend.Repositories.Shipping;
using memoriza_backend.Settings;
using Microsoft.Extensions.Options;

namespace memoriza_backend.Services.Profile.ShippingService
{
    public class ShippingCalculatorService : IShippingCalculatorService
    {
        private readonly List<ShippingRegionSettings> _regionRanges;
        private readonly IShippingRepository _shippingRepository;

        public ShippingCalculatorService(
            IOptions<List<ShippingRegionSettings>> regionOptions,
            IShippingRepository shippingRepository)
        {
            _regionRanges = regionOptions.Value;
            _shippingRepository = shippingRepository;
        }

        public async Task<ShippingOptionDto?> GetShippingByCepAsync(string cep)
        {
            var numericCep = NormalizeCep(cep);

            string? regionCode = null;

            foreach (var region in _regionRanges)
            {
                foreach (var range in region.CepRanges)
                {
                    var from = Sanitize(range.From);
                    var to = Sanitize(range.To);

                    if (numericCep >= from && numericCep <= to)
                    {
                        regionCode = region.Code;
                        break;
                    }
                }

                if (regionCode != null)
                    break;
            }

            if (regionCode == null)
                return null;

            var regionEntity = await _shippingRepository.GetRegionByCodeAsync(regionCode);

            if (regionEntity == null || !regionEntity.IsActive)
                return null;

            return new ShippingOptionDto
            {
                Code = regionEntity.Code,
                Name = regionEntity.Name,
                Description = regionEntity.IsPickupOption ? "Retirada na loja" : null,
                Price = regionEntity.Price,
                EstimatedDays = regionEntity.EstimatedDays
            };
        }

        private int NormalizeCep(string cep)
        {
            var digits = new string(cep.Where(char.IsDigit).ToArray());

            if (digits.Length != 8)
                throw new ArgumentException("CEP inválido", nameof(cep));

            return int.Parse(digits);
        }

        private static int Sanitize(string cepRange)
        {
            return int.Parse(new string(cepRange.Where(char.IsDigit).ToArray()));
        }
    }
}
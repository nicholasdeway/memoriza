using memoriza_backend.Models.DTO.User.Shipping;
using memoriza_backend.Settings;
using Microsoft.Extensions.Options;

namespace memoriza_backend.Services.Profile.ShippingService
{
    public class ShippingCalculatorService : IShippingCalculatorService
    {
        private readonly List<ShippingRegionSettings> _regions;

        public ShippingCalculatorService(IOptions<List<ShippingRegionSettings>> options)
        {
            _regions = options.Value;
        }

        public ShippingOptionDto? GetShippingByCep(string cep)
        {
            var numericCep = NormalizeCep(cep);

            foreach (var region in _regions)
            {
                foreach (var range in region.CepRanges)
                {
                    var from = Sanitize(range.From);
                    var to = Sanitize(range.To);

                    if (numericCep >= from && numericCep <= to)
                    {
                        return new ShippingOptionDto
                        {
                            Code = region.Code,
                            Name = region.Name,
                            Description = null,
                            Price = region.Price,
                            EstimatedDays = region.EstimatedDays
                        };
                    }
                }
            }

            return null;
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
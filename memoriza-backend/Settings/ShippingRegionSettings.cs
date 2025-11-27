using System.Collections.Generic;

namespace memoriza_backend.Settings
{
    public class ShippingRegionSettings
    {
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public decimal Price { get; set; }
        public int EstimatedDays { get; set; }
        public List<CepRangeSettings> CepRanges { get; set; } = new();
    }
}
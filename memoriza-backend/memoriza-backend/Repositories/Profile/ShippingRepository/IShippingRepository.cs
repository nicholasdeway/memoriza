using System;
using System.Threading.Tasks;
using memoriza_backend.Models.Entities;

namespace memoriza_backend.Repositories.Shipping
{
    public interface IShippingRepository
    {
        // Região
        Task<ShippingRegion?> GetRegionByCodeAsync(string code);

        // Config de frete grátis (deprecated - usar FreeShippingThreshold por região)
        Task<StoreShippingSettings?> GetStoreSettingsAsync();
        Task<StoreShippingSettings> UpsertStoreSettingsAsync(StoreShippingSettings settings);

        // Admin - Gerenciamento de regiões
        Task<List<ShippingRegion>> GetAllRegionsAsync();
        Task<ShippingRegion?> GetRegionByIdAsync(Guid id);
        Task<ShippingRegion> UpdateRegionAsync(ShippingRegion region);
    }
}
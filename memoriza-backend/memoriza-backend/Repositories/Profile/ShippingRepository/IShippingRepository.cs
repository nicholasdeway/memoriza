using memoriza_backend.Models.Entities;

namespace memoriza_backend.Repositories.Interfaces
{
    public interface IShippingRepository
    {
        Task<ShippingRegion?> GetByCodeAsync(string code);
        Task<List<ShippingRegion>> GetAllActiveAsync();
    }
}
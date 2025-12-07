using memoriza_backend.Models.DTO.Admin.Dashboard;

namespace memoriza_backend.Repositories.Admin.Dashboard
{
    public interface IDashboardRepository
    {
        Task<DashboardSummaryDto> GetSummaryAsync(DateTime from, DateTime to);
        Task<IReadOnlyList<TopProductDto>> GetTopProductsAsync(DateTime from, DateTime to, int limit);
    }
}
using memoriza_backend.Models.DTO.Admin;

namespace memoriza_backend.Services.Admin.Dashboard
{
    public interface IDashboardService
    {
        Task<DashboardSummaryDto> GetSummaryAsync(
            DateTime? from = null,
            DateTime? to = null
        );

        Task<IReadOnlyList<TopProductDto>> GetTopProductsAsync(
            DateTime? from = null,
            DateTime? to = null,
            int limit = 5
        );
    }
}
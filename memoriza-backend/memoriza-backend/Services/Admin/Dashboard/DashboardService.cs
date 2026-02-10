using memoriza_backend.Models.DTO.Admin.Dashboard;
using memoriza_backend.Repositories.Admin.Dashboard;

namespace memoriza_backend.Services.Admin.Dashboard
{
    public class DashboardService : IDashboardService
    {
        private readonly IDashboardRepository _repository;

        public DashboardService(IDashboardRepository repository)
        {
            _repository = repository;
        }

        public async Task<DashboardSummaryDto> GetSummaryAsync(DateTime? from = null, DateTime? to = null)
        {
            var (start, end) = NormalizeRange(from, to);
            return await _repository.GetSummaryAsync(start, end);
        }

        public async Task<IReadOnlyList<TopProductDto>> GetTopProductsAsync(DateTime? from = null, DateTime? to = null, int limit = 5)
        {
            var (start, end) = NormalizeRange(from, to);
            return await _repository.GetTopProductsAsync(start, end, limit);
        }

        public async Task<IReadOnlyList<RecentOrderDto>> GetRecentOrdersAsync(int limit = 5)
        {
            return await _repository.GetRecentOrdersAsync(limit);
        }

        public async Task<IReadOnlyList<SalesByMonthDto>> GetSalesByMonthAsync(DateTime? from = null, DateTime? to = null)
        {
            var (start, end) = NormalizeRange(from, to);
            return await _repository.GetSalesByMonthAsync(start, end);
        }

        private static (DateTime from, DateTime to) NormalizeRange(DateTime? from, DateTime? to)
        {
            var start = from ?? DateTime.UtcNow.AddDays(-30);
            var end = to ?? DateTime.UtcNow;

            if (end < start)
            {
                // garante que o período esteja sempre válido
                var tmp = start;
                start = end;
                end = tmp;
            }

            return (start, end);
        }
    }
}
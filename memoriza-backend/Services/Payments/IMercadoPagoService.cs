using System.Threading.Tasks;
using memoriza_backend.Models.DTO.Payments;
using memoriza_backend.Models.Entities;

namespace memoriza_backend.Services.Payments
{
    public interface IMercadoPagoService
    {
        Task<PreferenceResponseDto?> CreatePreferenceForOrderAsync(Order order, List<OrderItem> items);
        Task ProcessWebhookAsync(MercadoPagoWebhookDto data);
    }
}
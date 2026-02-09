using System.Threading.Tasks;
using memoriza_backend.Models.DTO.Payments;
using memoriza_backend.Models.Entities;

namespace memoriza_backend.Services.Payments
{
    public interface IMercadoPagoService
    {
        Task<ProcessPaymentResponse> ProcessPaymentAsync(Guid orderId, ProcessPaymentRequest request);
        Task ProcessWebhookAsync(MercadoPagoWebhookDto data);
    }
}
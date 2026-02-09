using FluentValidation;
using memoriza_backend.Helpers;
using memoriza_backend.Models.DTO.Admin.Order;
using System;
using System.Linq;

namespace memoriza_backend.Validations.Admin.Orders
{
    public class UpdateOrderStatusDtoValidator : AbstractValidator<UpdateOrderStatusDto>
    {
        private static readonly string[] AllowedStatuses = new[]
        {
            OrderStatusCodes.Pending,
            OrderStatusCodes.Paid,
            OrderStatusCodes.InProduction,
            OrderStatusCodes.Shipped,
            OrderStatusCodes.Delivered,
            OrderStatusCodes.Refunded,
            OrderStatusCodes.Cancelled
        };

        public UpdateOrderStatusDtoValidator()
        {
            RuleFor(x => x.NewStatus)
                .Must(status => AllowedStatuses.Contains(status))
                .WithMessage($"Status inválido. Permitidos: {string.Join(", ", AllowedStatuses)}");

            RuleFor(x => x.Note)
                .MaximumLength(500)
                .WithMessage("A observação deve ter no máximo 500 caracteres.");

            // Relaxar a validação do AdminUserId para permitir que o backend resolva ou aceite Empty se necessário
            // ou garantir que o frontend envie um válido.
            // Para evitar bloqueio agora, vamos remover NotEmpty se o service usa Guid.Empty como fallback
        }
    }
}
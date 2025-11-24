using FluentValidation;
using memoriza_backend.Models.DTO.User.Orders;

namespace memoriza_backend.Validations.User.Orders
{
    public class RequestRefundRequestValidator : AbstractValidator<RequestRefundRequest>
    {
        public RequestRefundRequestValidator()
        {
            RuleFor(x => x.OrderId)
                .NotEmpty()
                .WithMessage("O pedido é obrigatório.");

            RuleFor(x => x.Reason)
                .NotEmpty()
                    .WithMessage("O motivo do reembolso é obrigatório.")
                .MaximumLength(300)
                    .WithMessage("O motivo deve ter no máximo 300 caracteres.");
        }
    }
}
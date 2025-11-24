using FluentValidation;
using memoriza_backend.Models.DTO.Admin;

namespace memoriza_backend.Validations.Admin.Orders
{
    public class RefundRequestDtoValidator : AbstractValidator<RefundRequestDto>
    {
        public RefundRequestDtoValidator()
        {
            RuleFor(x => x.Reason)
                .NotEmpty()
                .WithMessage("O motivo do reembolso é obrigatório.")
                .MaximumLength(500)
                .WithMessage("O motivo do reembolso deve ter no máximo 500 caracteres.");
        }
    }
}
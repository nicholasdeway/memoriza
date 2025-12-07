using FluentValidation;
using memoriza_backend.Models.DTO.Admin.Order;

namespace memoriza_backend.Validations.Admin.Orders
{
    public class AdminUpdateOrderDtoValidator : AbstractValidator<AdminUpdateOrderDto>
    {
        public AdminUpdateOrderDtoValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty()
                .WithMessage("O usuário é obrigatório.");

            RuleFor(x => x.Subtotal)
                .GreaterThanOrEqualTo(0)
                .WithMessage("O subtotal não pode ser negativo.");

            RuleFor(x => x.FreightValue)
                .GreaterThanOrEqualTo(0)
                .WithMessage("O valor do frete não pode ser negativo.");

            RuleFor(x => x.Total)
                .GreaterThanOrEqualTo(0)
                .WithMessage("O valor total não pode ser negativo.");

            RuleFor(x => x.PersonalizationNotes)
                .MaximumLength(1000)
                .WithMessage("As observações de personalização devem ter no máximo 1000 caracteres.")
                .When(x => !string.IsNullOrWhiteSpace(x.PersonalizationNotes));
        }
    }
}
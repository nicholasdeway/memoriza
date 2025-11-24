using FluentValidation;
using memoriza_backend.Models.DTO.User.Shipping;

namespace memoriza_backend.Validations.User.Shipping
{
    public class CalculateShippingRequestValidator : AbstractValidator<CalculateShippingRequest>
    {
        public CalculateShippingRequestValidator()
        {
            RuleFor(x => x.PostalCode)
                .NotEmpty().WithMessage("O CEP é obrigatório.")
                .Matches(@"^\d{5}-?\d{3}$")
                    .WithMessage("O CEP deve estar no formato 00000-000 ou 00000000.")
                .When(x => !x.PickupInStore);
        }
    }
}
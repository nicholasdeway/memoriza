using FluentValidation;
using memoriza_backend.Models.DTO.Admin.Shipping;

namespace memoriza_backend.Validations.Admin.Shipping
{
    public class UpdateShippingRegionDtoValidator : AbstractValidator<UpdateShippingRegionDto>
    {
        public UpdateShippingRegionDtoValidator()
        {
            RuleFor(x => x.Price)
                .GreaterThanOrEqualTo(0)
                .WithMessage("O preço do frete não pode ser negativo.");

            RuleFor(x => x.EstimatedDays)
                .GreaterThanOrEqualTo(0)
                .WithMessage("O prazo de entrega não pode ser negativo.")
                .LessThanOrEqualTo(365)
                .WithMessage("O prazo de entrega não pode exceder 365 dias.");

            RuleFor(x => x.FreeShippingThreshold)
                .GreaterThanOrEqualTo(0)
                .WithMessage("O valor mínimo para frete grátis não pode ser negativo.");
        }
    }
}

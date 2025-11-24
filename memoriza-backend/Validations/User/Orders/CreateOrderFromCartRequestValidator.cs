using FluentValidation;
using memoriza_backend.Models.DTO.User.Orders;

namespace memoriza_backend.Validations.User.Orders
{
    public class CreateOrderFromCartRequestValidator
        : AbstractValidator<CreateOrderFromCartRequest>
    {
        public CreateOrderFromCartRequestValidator()
        {
            RuleFor(x => x.ShippingAmount)
                .GreaterThanOrEqualTo(0)
                .WithMessage("O valor do frete não pode ser negativo.");

            RuleFor(x => x.ShippingEstimatedDays)
                .GreaterThanOrEqualTo(0)
                .WithMessage("O prazo estimado deve ser positivo ou zero.");

            // ================================
            // REGRA: ENTREGA NORMAL
            // ================================
            When(x => !x.PickupInStore, () =>
            {
                RuleFor(x => x.ShippingCode)
                    .NotEmpty()
                    .WithMessage("O código do frete é obrigatório para entregas.");

                RuleFor(x => x.ShippingName)
                    .NotEmpty()
                    .WithMessage("O nome da opção de frete é obrigatório para entregas.");
            });

            // ================================
            // REGRA: RETIRADA NA LOJA
            // ================================
            When(x => x.PickupInStore, () =>
            {
                RuleFor(x => x.ShippingAmount)
                    .Equal(0)
                    .WithMessage("Para retirada na loja, o frete deve ser 0.");

                RuleFor(x => x.ShippingCode)
                    .Empty()
                    .WithMessage("Para retirada na loja, não deve existir código de frete.");

                RuleFor(x => x.ShippingName)
                    .Empty()
                    .WithMessage("Para retirada na loja, não deve existir nome de frete.");
            });
        }
    }
}
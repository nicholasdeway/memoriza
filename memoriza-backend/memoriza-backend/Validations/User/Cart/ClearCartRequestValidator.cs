using FluentValidation;
using memoriza_backend.Models.DTO.User.Cart;

namespace memoriza_backend.Validations.User.Cart
{
    public class ClearCartRequestValidator : AbstractValidator<ClearCartRequest>
    {
        public ClearCartRequestValidator()
        {
            RuleFor(x => x.Confirm)
                .Equal(true)
                .WithMessage("A limpeza do carrinho deve ser confirmada.");
        }
    }
}
using FluentValidation;
using memoriza_backend.Models.DTO.User.Cart;

namespace memoriza_backend.Validations.User.Cart
{
    public class AddCartItemRequestValidator : AbstractValidator<AddCartItemRequest>
    {
        public AddCartItemRequestValidator()
        {
            RuleFor(x => x.ProductId)
                .NotEmpty().WithMessage("O produto é obrigatório.");

            RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("A quantidade deve ser maior que 0.")
                .LessThanOrEqualTo(50).WithMessage("Quantidade máxima permitida é 50 unidades.");
        }
    }
}
using FluentValidation;
using memoriza_backend.Models.DTO.User.Cart;

namespace memoriza_backend.Validations.User.Cart
{
    public class RemoveCartItemRequestValidator : AbstractValidator<RemoveCartItemRequest>
    {
        public RemoveCartItemRequestValidator()
        {
            RuleFor(x => x.CartItemId)
                .NotEmpty()
                .WithMessage("O item do carrinho é obrigatório.");
        }
    }
}
using FluentValidation;
using memoriza_backend.Models.DTO.Admin.Product;

namespace memoriza_backend.Validations.Admin.Products
{
    public class CreateProductValidator : AbstractValidator<CreateProductDto>
    {
        public CreateProductValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("O nome do produto é obrigatório.")
                .MaximumLength(100).WithMessage("O nome deve ter no máximo 100 caracteres.");

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("O preço deve ser maior que zero.");

            RuleFor(x => x.CategoryId)
                .NotEmpty().WithMessage("A categoria é obrigatória.");
                
            RuleFor(x => x.Description)
                .MaximumLength(1000).WithMessage("A descrição deve ter no máximo 1000 caracteres.");
        }
    }
}

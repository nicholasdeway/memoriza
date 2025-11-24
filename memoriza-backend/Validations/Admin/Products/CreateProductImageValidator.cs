using FluentValidation;
using memoriza_backend.Models.DTO.Admin;

namespace memoriza_backend.Validations.Admin.Products
{
    public class CreateProductImageValidator : AbstractValidator<CreateProductImageDto>
    {
        public CreateProductImageValidator()
        {
            RuleFor(x => x.Url)
                .NotEmpty().WithMessage("A URL da imagem é obrigatória.")
                .Must(uri => Uri.TryCreate(uri, UriKind.Absolute, out _)).WithMessage("A URL da imagem inválida.");

            RuleFor(x => x.DisplayOrder)
                .GreaterThanOrEqualTo(0).WithMessage("A ordem de exibição não pode ser negativa.");
                
            RuleFor(x => x.AltText)
                .MaximumLength(200).WithMessage("O texto alternativo deve ter no máximo 200 caracteres.");
        }
    }
}

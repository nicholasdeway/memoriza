using FluentValidation;
using memoriza_backend.Models.DTO.Admin.Category;

namespace memoriza_backend.Validations.Admin.Categories
{
    public class UpdateCategoryValidator : AbstractValidator<UpdateCategoryDto>
    {
        public UpdateCategoryValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("O nome da categoria é obrigatório.")
                .MaximumLength(100).WithMessage("O nome da categoria deve ter no máximo 100 caracteres.");

            RuleFor(x => x.Description)
                .MaximumLength(500)
                .WithMessage("A descrição deve ter no máximo 500 caracteres.")
                .When(x => !string.IsNullOrWhiteSpace(x.Description));

            // IsActive é bool – não precisa de validação de formato.
            // Se quiser uma regra de negócio (ex.: impedir desativar se tiver produtos),
            // isso vai para o SERVICE, não para o validator.
        }
    }
}
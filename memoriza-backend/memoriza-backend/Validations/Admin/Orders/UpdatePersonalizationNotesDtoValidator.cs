using FluentValidation;
using memoriza_backend.Models.DTO.Admin.Order;

namespace memoriza_backend.Validations.Admin.Orders
{
    public class UpdatePersonalizationNotesDtoValidator : AbstractValidator<UpdatePersonalizationNotesDto>
    {
        public UpdatePersonalizationNotesDtoValidator()
        {
            RuleFor(x => x.Notes)
                .NotEmpty()
                .WithMessage("As observações de personalização são obrigatórias.")
                .MaximumLength(1000)
                .WithMessage("As observações de personalização devem ter no máximo 1000 caracteres.");
        }
    }
}
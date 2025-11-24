using FluentValidation;
using memoriza_backend.Models.DTO.User.Profile;

namespace memoriza_backend.Validations.User.Profile
{
    public class UpdateUserProfileRequestValidator : AbstractValidator<UpdateUserProfileRequest>
    {
        public UpdateUserProfileRequestValidator()
        {
            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("O nome é obrigatório.")
                .MaximumLength(50).WithMessage("O nome deve ter no máximo 50 caracteres.");

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("O sobrenome é obrigatório.")
                .MaximumLength(50).WithMessage("O sobrenome deve ter no máximo 50 caracteres.");

            RuleFor(x => x.Phone)
                .MaximumLength(20).WithMessage("O telefone deve ter no máximo 20 caracteres.")
                .Matches(@"^\+?[0-9]{10,15}$")
                .WithMessage("O telefone deve conter apenas números e ter entre 10 e 15 dígitos.")
                .When(x => !string.IsNullOrWhiteSpace(x.Phone));
        }
    }
}
using FluentValidation;
using memoriza_backend.Models.DTO.User.Profile;

namespace memoriza_backend.Validations.User.Profile
{
    public class DeleteAccountRequestValidator : AbstractValidator<DeleteAccountRequest>
    {
        public DeleteAccountRequestValidator()
        {
            RuleFor(x => x.Reason)
                .MaximumLength(200)
                .WithMessage("O motivo deve ter no máximo 200 caracteres.")
                .When(x => !string.IsNullOrWhiteSpace(x.Reason));
        }
    }
}
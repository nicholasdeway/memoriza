using FluentValidation;
using memoriza_backend.Models.DTO.User.Profile;

namespace memoriza_backend.Validations.User.Profile
{
    public class DeleteAccountRequestValidator : AbstractValidator<DeleteAccountRequest>
    {
        public DeleteAccountRequestValidator()
        {
            // precisa colocar senha para exclusão
            RuleFor(x => x.CurrentPassword)
                .NotEmpty()
                .WithMessage("A senha atual é obrigatória para excluir a conta.");

            RuleFor(x => x.Reason)
                .MaximumLength(200)
                .WithMessage("O motivo deve ter no máximo 200 caracteres.")
                .When(x => !string.IsNullOrWhiteSpace(x.Reason));
        }
    }
}
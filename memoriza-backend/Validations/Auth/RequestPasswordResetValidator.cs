using FluentValidation;
using memoriza_backend.Models.DTO.Auth;

namespace memoriza_backend.Validations.Auth
{
    public class RequestPasswordResetValidator : AbstractValidator<RequestPasswordResetDto>
    {
        public RequestPasswordResetValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("O e-mail é obrigatório.")
                .EmailAddress().WithMessage("O e-mail informado é inválido.");
        }
    }
}
using FluentValidation;
using memoriza_backend.Models.DTO.Admin;

public class UpdateOrderStatusDtoValidator : AbstractValidator<UpdateOrderStatusDto>
{
    public UpdateOrderStatusDtoValidator()
    {
        RuleFor(x => x.NewStatus)
            .IsInEnum()
            .WithMessage("Status do pedido inválido.");

        RuleFor(x => x.Note)
            .MaximumLength(500)
            .WithMessage("A observação deve ter no máximo 500 caracteres.")
            .When(x => !string.IsNullOrWhiteSpace(x.Note));

        RuleFor(x => x.AdminUserId)
            .NotEmpty()
            .WithMessage("O identificador do administrador é obrigatório.");
    }
}
using FluentValidation;
using memoriza_backend.Models.DTO.User.Shipping;

public class CalculateShippingRequestValidator : AbstractValidator<CalculateShippingRequest>
{
    public CalculateShippingRequestValidator()
    {
        // ❗ Só obriga o CEP se NÃO for retirada na loja
        When(x => !x.PickupInStore, () =>
        {
            RuleFor(x => x.Cep)
                .NotEmpty().WithMessage("CEP é obrigatório para entrega.")
                .Must(IsValidCep).WithMessage("CEP inválido. Use o formato 12345-678 ou 12345678.");
        });
    }

    private bool IsValidCep(string? cep)
    {
        if (string.IsNullOrWhiteSpace(cep))
            return false;

        // Remove hífen se existir
        cep = cep.Replace("-", "");

        // Deve ter exatamente 8 números
        return cep.Length == 8 && cep.All(char.IsDigit);
    }
}
using System;
using System.Threading.Tasks;
using memoriza_backend.Models.Authentication;
using memoriza_backend.Models.DTO.Auth;
using memoriza_backend.Helpers;
using memoriza_backend.Repositories.Auth;
using System.Text.RegularExpressions;

namespace memoriza_backend.Services.Auth
{
    // Serviço de regras de negócio relacionadas a usuário e autenticação
    public class UserService : IUserService
    {
        private readonly IUserRepository _repository;
        private readonly IJwtService _jwtService;

        public UserService(IUserRepository repository, IJwtService jwtService)
        {
            _repository = repository;
            _jwtService = jwtService;
        }

        // Registro de novo usuário - retorna apenas o token JWT.
        public async Task<string> RegisterAsync(RegisterUserDto dto)
        {
            // 1) Valida senha x confirmação
            if (dto.Password != dto.ConfirmPassword)
                throw new ApplicationException("Senha e confirmação de senha não conferem.");

            // 2) Verifica se já existe usuário com o mesmo e-mail
            var existing = await _repository.GetByEmailAsync(dto.Email);
            if (existing != null)
                throw new ApplicationException("Já existe um usuário registrado com esse e-mail.");

            // 3) Normaliza nome e sobrenome
            var firstName = NameFormatter.NormalizeName(dto.FirstName);
            var lastName = NameFormatter.NormalizeName(dto.LastName);

            // 4) Gera hash da senha
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            // 5) Normaliza telefone (se enviado) E verifica duplicidade
            string? normalizedPhone = null;
            if (!string.IsNullOrWhiteSpace(dto.Phone))
            {
                // mantém apenas dígitos
                var digits = Regex.Replace(dto.Phone, @"\D", "");
                normalizedPhone = digits;

                // 🔴 VERIFICA SE JÁ EXISTE USUÁRIO COM ESSE TELEFONE
                var existingByPhone = await _repository.GetByPhoneAsync(normalizedPhone);
                if (existingByPhone != null)
                    throw new ApplicationException("Já existe um usuário registrado com esse telefone.");
            }

            // 6) Monta entidade de usuário
            var user = new Models.Authentication.User
            {
                FirstName = firstName,
                LastName = lastName,
                Email = dto.Email,
                Password = hashedPassword,
                Phone = normalizedPhone
            };

            // 7) Salva no banco
            user = await _repository.CreateAsync(user);

            // 8) Gera token JWT
            var token = _jwtService.GenerateToken(user);
            return token;
        }

        // Login do usuário - retorna apenas o token JWT
        public async Task<string> LoginAsync(LoginUserDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Identifier)) // troquei para Identifier para respeitar login com email ou phone.
                throw new ApplicationException("E-mail ou telefone é obrigatório.");

            // Descobrir se é e-mail ou telefone
            Models.Authentication.User? user;

            if (dto.Identifier.Contains("@"))
            {
                // Login por e-mail
                user = await _repository.GetByEmailAsync(dto.Identifier);
            }
            else
            {
                // Login por telefone
                var digits = Regex.Replace(dto.Identifier, @"\D", "");

                if (string.IsNullOrWhiteSpace(digits))
                    throw new ApplicationException("Telefone informado é inválido.");

                user = await _repository.GetByPhoneAsync(digits);
            }

            if (user == null)
                throw new ApplicationException("Usuário ou senha inválidos.");

            // Verifica o hash da senha
            var isValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.Password);
            if (!isValid)
                throw new ApplicationException("Usuário ou senha inválidos.");

            var token = _jwtService.GenerateToken(user);
            return token;
        }

        // Solicita redefinição de senha
        public async Task<string> RequestPasswordResetAsync(RequestPasswordResetDto dto)
        {
            var user = await _repository.GetByEmailAsync(dto.Email);
            if (user == null)
                throw new ApplicationException("Nenhum usuário encontrado com esse e-mail.");

            await _repository.MarkResetPendingAsync(user.Id);

            return "Solicitação de redefinição de senha registrada. Verifique seu e-mail.";
        }

        // Confirma a redefinição de senha
        public async Task<string> ConfirmPasswordResetAsync(ConfirmPasswordResetDto dto)
        {
            var user = await _repository.GetByEmailAsync(dto.Email);
            if (user == null)
                throw new ApplicationException("Nenhum usuário encontrado com esse e-mail.");

            if (!user.PasswordResetPending)
                throw new ApplicationException("Não há solicitação de redefinição de senha pendente.");

            if (dto.NewPassword != dto.ConfirmNewPassword)
                throw new ApplicationException("Nova senha e confirmação não conferem.");

            if (dto.NewPassword.Length < 8)
                throw new ApplicationException("A nova senha deve ter no mínimo 8 caracteres.");

            // Hash da nova senha
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            user.Password = hashedPassword;
            user.PasswordResetPending = false;

            await _repository.UpdatePasswordAsync(user);

            return "Senha redefinida com sucesso.";
        }
    }
}
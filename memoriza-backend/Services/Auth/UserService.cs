using System;
using System.Threading.Tasks;
using memoriza_backend.Models.Auth;
using memoriza_backend.Models.DTO.Auth;
using memoriza_backend.Helpers;

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

        // Registro de novo usuário - retorna apenas o token JWT
        public async Task<string> RegisterAsync(RegisterUserDto dto)
        {
            if (dto.Password != dto.ConfirmPassword)
                throw new ApplicationException("Senha e confirmação de senha não conferem.");

            var existing = await _repository.GetByEmailAsync(dto.Email);
            if (existing != null)
                throw new ApplicationException("Já existe um usuário registrado com esse e-mail.");

            // Normaliza nome e sobrenome
            var firstName = NameFormatter.NormalizeName(dto.FirstName);
            var lastName = NameFormatter.NormalizeName(dto.LastName);

            // Geração do hash
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var user = new User
            {
                FirstName = firstName,   // usa o nome normalizado
                LastName = lastName,    // usa o sobrenome normalizado
                Email = dto.Email,
                Password = hashedPassword
            };

            user = await _repository.CreateAsync(user);

            var token = _jwtService.GenerateToken(user);
            return token;
        }

        // Login do usuário - retorna apenas o token JWT
        public async Task<string> LoginAsync(LoginUserDto dto)
        {
            var user = await _repository.GetByEmailAsync(dto.Email);

            if (user == null)
                throw new ApplicationException("E-mail ou senha inválidos.");

            // Verifica o hash
            var isValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.Password);
            if (!isValid)
                throw new ApplicationException("E-mail ou senha inválidos.");

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
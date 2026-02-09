using System;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using memoriza_backend.Helpers;
using memoriza_backend.Models.Authentication;
using memoriza_backend.Models.DTO.Auth;
using memoriza_backend.Repositories.Auth;

namespace memoriza_backend.Services.Auth
{
    /// <summary>
    /// Serviço de regras de negócio relacionadas a usuário e autenticação.
    /// </summary>
    public class UserService : IUserService
    {
        private readonly IUserRepository _repository;
        private readonly IJwtService _jwtService;

        public UserService(IUserRepository repository, IJwtService jwtService)
        {
            _repository = repository;
            _jwtService = jwtService;
        }

        // REGISTER (LOCAL) - cria ou reativa conta
        public async Task<string> RegisterAsync(RegisterUserDto dto)
        {
            if (dto.Password != dto.ConfirmPassword)
                throw new ApplicationException("Senha e confirmação de senha não conferem.");

            // Agora GetByEmailAsync traz ativos e inativos
            var existing = await _repository.GetByEmailAsync(dto.Email);

            var firstName = NameFormatter.NormalizeName(dto.FirstName);
            var lastName = NameFormatter.NormalizeName(dto.LastName);

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            string? normalizedPhone = null;
            if (!string.IsNullOrWhiteSpace(dto.Phone))
            {
                var digits = Regex.Replace(dto.Phone, @"\D", "");
                normalizedPhone = digits;

                // Aqui o repositório de telefone ainda só traz ativos
                var existingByPhone = await _repository.GetByPhoneAsync(normalizedPhone);
                if (existingByPhone != null)
                    throw new ApplicationException("Já existe um usuário registrado com esse telefone.");
            }

            User user;

            // Caso 1: já existe e está ATIVO -> não deixa registrar de novo
            if (existing is not null && existing.IsActive)
            {
                throw new ApplicationException("Já existe um usuário registrado com esse e-mail.");
            }

            // Caso 2: já existe e está INATIVO -> reativar conta
            if (existing is not null && !existing.IsActive)
            {
                existing.FirstName = firstName;
                existing.LastName = lastName;
                existing.Email = dto.Email;
                existing.Password = hashedPassword;
                existing.Phone = normalizedPhone;
                existing.LastLoginAt = DateTime.UtcNow;
                existing.PasswordResetPending = false;
                existing.AuthProvider = "Local";
                existing.ProviderUserId = null;
                existing.ProviderEmail = null;
                existing.PictureUrl = null;
                existing.UserGroupId = (int)UserGroupType.UsuarioComum;
                existing.IsActive = true;
                existing.UpdatedAt = DateTime.UtcNow;

                user = await _repository.UpdateAsync(existing);
            }
            else
            {
                // Caso 3: não existe nenhum registro com esse e-mail -> cria do zero
                user = new User
                {
                    FirstName = firstName,
                    LastName = lastName,
                    Email = dto.Email,
                    Password = hashedPassword,
                    Phone = normalizedPhone,
                    CreatedAt = DateTime.UtcNow,
                    LastLoginAt = DateTime.UtcNow,
                    PasswordResetPending = false,
                    AuthProvider = "Local",
                    ProviderUserId = null,
                    ProviderEmail = null,
                    PictureUrl = null,
                    UserGroupId = (int)UserGroupType.UsuarioComum,
                    IsActive = true
                };

                user = await _repository.CreateAsync(user);
            }

            var token = _jwtService.GenerateToken(user);
            return token;
        }

        // LOGIN (EMAIL OU TELEFONE)
        public async Task<string> LoginAsync(LoginUserDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Identifier))
                throw new ApplicationException("E-mail ou telefone é obrigatório.");

            User? user;

            if (dto.Identifier.Contains("@"))
            {
                // Agora GetByEmailAsync também traz inativos, então filtramos aqui
                user = await _repository.GetByEmailAsync(dto.Identifier);
            }
            else
            {
                var digits = Regex.Replace(dto.Identifier, @"\D", "");
                if (string.IsNullOrWhiteSpace(digits))
                    throw new ApplicationException("Telefone informado é inválido.");

                user = await _repository.GetByPhoneAsync(digits); // ainda só ativos
            }

            if (user == null)
                throw new ApplicationException("Usuário ou senha inválidos.");

            // Garante que conta desativada não loga
            if (!user.IsActive)
                throw new ApplicationException("Esta conta foi desativada.");

            var isValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.Password);
            if (!isValid)
                throw new ApplicationException("Usuário ou senha inválidos.");

            user.LastLoginAt = DateTime.UtcNow;
            await _repository.UpdateAsync(user);

            var token = _jwtService.GenerateToken(user);
            return token;
        }

        // REQUEST PASSWORD RESET (ESQUECI MINHA SENHA)
        public async Task<string> RequestPasswordResetAsync(RequestPasswordResetDto dto)
        {
            // Agora GetByEmailAsync traz ativos e inativos
            var user = await _repository.GetByEmailAsync(dto.Email);

            if (user == null || !user.IsActive)
                throw new ApplicationException("Nenhum usuário ativo encontrado com esse e-mail.");

            await _repository.MarkResetPendingAsync(user.Id);

            return "Solicitação de redefinição de senha registrada. Verifique seu e-mail.";
        }

        // CONFIRM PASSWORD RESET (LINK/CÓDIGO DE RECUPERAÇÃO)
        public async Task<string> ConfirmPasswordResetAsync(ConfirmPasswordResetDto dto)
        {
            var user = await _repository.GetByEmailAsync(dto.Email);
            if (user == null)
                throw new ApplicationException("Nenhum usuário encontrado com esse e-mail.");

            if (!user.IsActive)
                throw new ApplicationException("Esta conta foi desativada.");

            if (!user.PasswordResetPending)
                throw new ApplicationException("Não há solicitação de redefinição de senha pendente.");

            if (dto.NewPassword != dto.ConfirmNewPassword)
                throw new ApplicationException("Nova senha e confirmação não conferem.");

            if (dto.NewPassword.Length < 8)
                throw new ApplicationException("A nova senha deve ter no mínimo 8 caracteres.");

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            user.Password = hashedPassword;
            user.PasswordResetPending = false;

            await _repository.UpdatePasswordAsync(user);

            return "Senha redefinida com sucesso.";
        }
        // GET PROFILE (ME)
        public async Task<UserProfileDto> GetUserProfileAsync(Guid userId)
        {
            var user = await _repository.GetByIdAsync(userId);
            if (user == null)
                throw new ApplicationException("Usuário não encontrado.");

            var isAdmin = user.UserGroupId == (int)UserGroupType.Admin;
            var fullName = $"{user.FirstName} {user.LastName}".Trim();

            return new UserProfileDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName ?? "",
                LastName = user.LastName ?? "",
                FullName = fullName,
                Phone = user.Phone,
                PictureUrl = user.PictureUrl,
                UserGroupId = user.UserGroupId,
                EmployeeGroupId = user.EmployeeGroupId,
                IsAdmin = isAdmin,
                AuthProvider = user.AuthProvider ?? "Local"
            };
        }
    }
}
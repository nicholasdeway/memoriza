using System.Text.RegularExpressions;
using memoriza_backend.Helpers;
using memoriza_backend.Models.Admin;
using memoriza_backend.Models.Authentication;
using memoriza_backend.Models.DTO.Admin.Employees;
using memoriza_backend.Repositories.Admin.Employees;
using memoriza_backend.Repositories.Auth;

namespace memoriza_backend.Services.Admin.Employees
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IUserRepository _userRepository;

        public EmployeeService(
            IEmployeeRepository employeeRepository,
            IUserRepository userRepository)
        {
            _employeeRepository = employeeRepository;
            _userRepository = userRepository;
        }

        // LISTA
        public async Task<IReadOnlyList<EmployeeResponseDto>> GetAllAsync()
        {
            var employees = await _employeeRepository.GetAllAsync();
            return employees.Select(MapToDto).ToList();
        }

        // DETALHE
        public async Task<EmployeeResponseDto?> GetByIdAsync(Guid id)
        {
            var employee = await _employeeRepository.GetByIdAsync(id);
            return employee is null ? null : MapToDto(employee);
        }

        // CREATE
        public async Task<Guid> CreateAsync(EmployeeFormDto dto)
        {
            // ===== Validações básicas =====
            if (string.IsNullOrWhiteSpace(dto.Name) || dto.Name.Trim().Length < 2)
                throw new ApplicationException("Nome deve ter pelo menos 2 caracteres.");

            if (string.IsNullOrWhiteSpace(dto.LastName) || dto.LastName.Trim().Length < 2)
                throw new ApplicationException("Sobrenome deve ter pelo menos 2 caracteres.");

            if (string.IsNullOrWhiteSpace(dto.Email))
                throw new ApplicationException("E-mail é obrigatório.");

            if (string.IsNullOrWhiteSpace(dto.Phone))
                throw new ApplicationException("Telefone é obrigatório.");

            if (dto.Password is null || dto.Password.Length < 8)
                throw new ApplicationException("Senha deve ter pelo menos 8 caracteres.");

            // E-mail único (na tabela users)
            var existingUser = await _userRepository.GetByEmailAsync(dto.Email);
            if (existingUser is not null)
                throw new ApplicationException("Já existe um usuário registrado com esse e-mail.");

            // CPF (se preenchido) – único na tabela employees
            if (!string.IsNullOrWhiteSpace(dto.Cpf))
            {
                var uniqueCpf = await _employeeRepository.IsCpfUniqueAsync(dto.Cpf);
                if (!uniqueCpf)
                    throw new ApplicationException("Já existe um funcionário com esse CPF.");
            }

            // ===== Normalização =====
            var firstName = NameFormatter.NormalizeName(dto.Name);
            var lastName = NameFormatter.NormalizeName(dto.LastName);

            var digitsPhone = Regex.Replace(dto.Phone, @"\D", "");
            var emailLower = dto.Email.Trim().ToLowerInvariant();

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            // ===== Cria User (tabela users) =====
            var user = new User
            {
                FirstName = firstName,
                LastName = lastName,
                Email = emailLower,
                Password = hashedPassword,
                Phone = digitsPhone,
                CreatedAt = DateTime.UtcNow,
                LastLoginAt = null,
                PasswordResetPending = false,
                AuthProvider = "Local",
                ProviderUserId = null,
                ProviderEmail = null,
                PictureUrl = null,
                // Funcionários precisam ser Admin para acessar o painel
                // Permissões granulares vêm do EmployeeGroupId
                UserGroupId = (int)UserGroupType.Admin,
                EmployeeGroupId = dto.GroupId,  // ← Grupo personalizado com permissões
                IsActive = dto.Status == "active"
            };

            user = await _userRepository.CreateAsync(user);

            // ===== Cria Employee (tabela employees) =====
            var employeeId = await _employeeRepository.CreateAsync(
                user.Id,
                dto.GroupId,
                dto.Cpf,
                dto.HireDate,
                dto.Status
            );

            return employeeId;
        }

        // UPDATE
        public async Task UpdateAsync(Guid id, EmployeeFormDto dto)
        {
            var existing = await _employeeRepository.GetByIdAsync(id);
            if (existing is null)
                throw new ApplicationException("Funcionário não encontrado.");

            // ===== Validações básicas =====
            if (string.IsNullOrWhiteSpace(dto.Name) || dto.Name.Trim().Length < 2)
                throw new ApplicationException("Nome deve ter pelo menos 2 caracteres.");

            if (string.IsNullOrWhiteSpace(dto.LastName) || dto.LastName.Trim().Length < 2)
                throw new ApplicationException("Sobrenome deve ter pelo menos 2 caracteres.");

            if (string.IsNullOrWhiteSpace(dto.Email))
                throw new ApplicationException("E-mail é obrigatório.");

            if (string.IsNullOrWhiteSpace(dto.Phone))
                throw new ApplicationException("Telefone é obrigatório.");

            // E-mail único (pode ser o mesmo do próprio funcionário)
            var userByEmail = await _userRepository.GetByEmailAsync(dto.Email);
            if (userByEmail is not null && userByEmail.Id != existing.UserId)
                throw new ApplicationException("Já existe outro usuário registrado com esse e-mail.");

            // CPF (se preenchido) – único (pode ser o mesmo this employee)
            if (!string.IsNullOrWhiteSpace(dto.Cpf))
            {
                var uniqueCpf = await _employeeRepository.IsCpfUniqueAsync(dto.Cpf, id);
                if (!uniqueCpf)
                    throw new ApplicationException("Já existe um funcionário com esse CPF.");
            }

            // ===== Atualiza User =====
            var user = userByEmail?.Id == existing.UserId
                ? userByEmail!
                : await _userRepository.GetByIdAsync(existing.UserId)
                    ?? throw new ApplicationException("Usuário vinculado ao funcionário não encontrado.");

            user.FirstName = NameFormatter.NormalizeName(dto.Name);
            user.LastName = NameFormatter.NormalizeName(dto.LastName);
            user.Email = dto.Email.Trim().ToLowerInvariant();
            user.Phone = Regex.Replace(dto.Phone, @"\D", "");
            user.EmployeeGroupId = dto.GroupId;
            user.IsActive = dto.Status == "active";
            user.UpdatedAt = DateTime.UtcNow;

            // Atualiza senha se enviada
            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
                if (dto.Password.Length < 8)
                    throw new ApplicationException("Senha deve ter pelo menos 8 caracteres.");

                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);
                user.Password = hashedPassword;
                await _userRepository.UpdatePasswordAsync(user);
            }
            else
            {
                await _userRepository.UpdateAsync(user);
            }

            // ===== Atualiza Employee =====
            await _employeeRepository.UpdateAsync(
                id,
                dto.GroupId,
                dto.Cpf,
                dto.HireDate,
                dto.Status
            );
        }

        // UPDATE STATUS
        public async Task UpdateStatusAsync(Guid id, string status)
        {
            if (status != "active" && status != "inactive")
                throw new ApplicationException("Status inválido. Use 'active' ou 'inactive'.");

            var existing = await _employeeRepository.GetByIdAsync(id);
            if (existing is null)
                throw new ApplicationException("Funcionário não encontrado.");

            // Atualiza status no employees
            await _employeeRepository.UpdateStatusAsync(id, status);

            // Atualiza IsActive no User
            var user = await _userRepository.GetByIdAsync(existing.UserId);
            if (user is not null)
            {
                user.IsActive = status == "active";
                user.UpdatedAt = DateTime.UtcNow;
                await _userRepository.UpdateAsync(user);
            }
        }

        // ===== Map =====
        private static EmployeeResponseDto MapToDto(AdminEmployee e)
        {
            return new EmployeeResponseDto
            {
                Id = e.Id,
                Name = e.FirstName,
                LastName = e.LastName,
                Email = e.Email,
                Phone = e.Phone,
                Cpf = e.Cpf,
                GroupId = e.GroupId,
                GroupName = e.GroupName,
                HireDate = e.HireDate,
                Status = e.Status,
                CreatedAt = e.CreatedAt,
                UpdatedAt = e.UpdatedAt
            };
        }
    }
}
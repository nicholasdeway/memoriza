using System;
using System.Text.RegularExpressions;
using memoriza_backend.Models.DTO.User.Profile;
using memoriza_backend.Helpers;
using memoriza_backend.Repositories.Interfaces;

namespace memoriza_backend.Services.Profile.UserService
{
    public class ProfileUserService : IProfileUserService
    {
        private readonly IProfileRepository _userRepository;

        public ProfileUserService(IProfileRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserProfileResponse?> GetProfileAsync(Guid userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
                return null;

            return new UserProfileResponse
            {
                Id = user.Id.ToString(),
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Phone = user.Phone,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<ServiceResult<UserProfileResponse>> UpdateProfileAsync(
            Guid userId,
            UpdateUserProfileRequest request)
        {
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
                return ServiceResult<UserProfileResponse>.Fail("Usuário não encontrado.");

            // Atualiza os campos editáveis
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;

            // Atualiza o phone
            if (string.IsNullOrWhiteSpace(request.Phone))
            {
                // Se vier vazio ou null, limpamos o telefone
                user.Phone = null;
            }
            else
            {
                // Normalização simples: mantém só dígitos
                var digits = Regex.Replace(request.Phone, @"\D", "");
                user.Phone = digits;
            }

            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);

            return ServiceResult<UserProfileResponse>.Ok(new UserProfileResponse
            {
                Id = user.Id.ToString(),
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Phone = user.Phone,
                CreatedAt = user.CreatedAt
            });
        }

        public async Task<ServiceResult<bool>> DeleteAccountAsync(Guid userId, DeleteAccountRequest request)
        {
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
                return ServiceResult<bool>.Fail("Usuário não encontrado.");

            // Validação da senha atual
            var isValidPassword = BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.Password);
            if (!isValidPassword)
            {
                return ServiceResult<bool>.Fail("Senha atual incorreta.");
            }

            // Soft delete da conta
            await _userRepository.SoftDeleteAsync(userId);

            return ServiceResult<bool>.Ok(true);
        }
    }
}
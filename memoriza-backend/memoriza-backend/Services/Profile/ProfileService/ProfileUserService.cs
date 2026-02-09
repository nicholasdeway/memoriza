using System;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using memoriza_backend.Helpers;
using memoriza_backend.Models.DTO.Auth;
using memoriza_backend.Models.DTO.User.Profile;
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

            // Bloqueia perfil para conta desativada
            if (!user.IsActive)
                return null; // ou retornar erro customizado se preferir

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

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;

            if (string.IsNullOrWhiteSpace(request.Phone))
            {
                user.Phone = null;
            }
            else
            {
                var digits = Regex.Replace(request.Phone, @"\D", "");
                
                // Verifica se o número já está em uso por outro usuário
                var existingUser = await _userRepository.GetByPhoneAsync(digits);
                if (existingUser != null && existingUser.Id != userId)
                {
                    return ServiceResult<UserProfileResponse>.Fail("Já existe uma conta cadastrada com este número de celular.");
                }
                
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


        public async Task<ServiceResult<bool>> DeleteAccountAsync(
            Guid userId,
            DeleteAccountRequest request)
        {
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
                return ServiceResult<bool>.Fail("Usuário não encontrado.");

            // Detecta se é conta Google
            var isGoogleAccount =
                !string.IsNullOrWhiteSpace(user.AuthProvider) &&
                user.AuthProvider.Equals("Google", StringComparison.OrdinalIgnoreCase);


            if (!isGoogleAccount)
            {
                if (string.IsNullOrWhiteSpace(request.CurrentPassword))
                {
                    return ServiceResult<bool>.Fail("A senha atual é obrigatória para excluir a conta.");
                }

                var isValidPassword = BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.Password);
                if (!isValidPassword)
                {
                    return ServiceResult<bool>.Fail("Senha atual incorreta.");
                }

                await _userRepository.SoftDeleteAsync(userId);

                return ServiceResult<bool>.Ok(true);
            }



            await _userRepository.SoftDeleteAsync(userId);

            return ServiceResult<bool>.Ok(true);
        }


        public async Task<ServiceResult<bool>> ChangePasswordAsync(
            Guid userId,
            ChangePasswordDto request)
        {
            if (string.IsNullOrWhiteSpace(request.CurrentPassword) ||
                string.IsNullOrWhiteSpace(request.NewPassword) ||
                string.IsNullOrWhiteSpace(request.ConfirmNewPassword))
            {
                return ServiceResult<bool>.Fail("Preencha todos os campos de senha.");
            }

            if (request.NewPassword != request.ConfirmNewPassword)
                return ServiceResult<bool>.Fail("Nova senha e confirmação não conferem.");

            if (request.NewPassword.Length < 8)
                return ServiceResult<bool>.Fail("A nova senha deve ter no mínimo 8 caracteres.");

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                return ServiceResult<bool>.Fail("Usuário não encontrado.");

            // Bloqueia conta Google
            if (!string.IsNullOrWhiteSpace(user.AuthProvider) &&
                user.AuthProvider.Equals("Google", StringComparison.OrdinalIgnoreCase))
            {
                return ServiceResult<bool>.Fail(
                    "Sua conta está conectada ao Google. A senha é gerenciada pelo Google e não pode ser alterada aqui."
                );
            }

            var isValid = BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.Password);
            if (!isValid)
                return ServiceResult<bool>.Fail("Senha atual incorreta.");

            var hashed = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.Password = hashed;
            user.PasswordResetPending = false;
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);

            return ServiceResult<bool>.Ok(true);
        }
    }
}
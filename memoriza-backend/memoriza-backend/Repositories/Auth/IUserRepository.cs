using System;
using System.Threading.Tasks;
using memoriza_backend.Models.Authentication;

namespace memoriza_backend.Repositories.Auth
{
    // Repositório responsável pelo acesso a dados de usuário no banco Postgres (Supabase)
    public interface IUserRepository
    {
        // Busca um usuário pelo Id
        Task<User?> GetByIdAsync(Guid id);

        // Busca um usuário pelo e-mail
        Task<User?> GetByEmailAsync(string email);

        // Busca um usuário pelo telefone
        Task<User?> GetByPhoneAsync(string phone);

        // Cria um novo usuário no banco
        Task<User> CreateAsync(User user);

        // Atualiza a senha e campos relacionados à redefinição
        Task UpdatePasswordAsync(User user);

        // Atualiza dados gerais do usuário (nome, foto, etc.)
        Task<User> UpdateAsync(User user);

        // Marca o usuário com solicitação de redefinição de senha pendente
        Task MarkResetPendingAsync(Guid id);
    }
}
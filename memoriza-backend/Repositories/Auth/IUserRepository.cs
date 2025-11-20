using System;
using System.Threading.Tasks;
using memoriza_backend.Models.Auth;

namespace memoriza_backend.Repositories.Auth
{
    // Repositório responsável pelo acesso a dados de usuário no banco Postgres (Supabase)
    public interface IUserRepository
    {
        // Busca um usuário pelo e-mail
        Task<User?> GetByEmailAsync(string email);

        // Cria um novo usuário no banco
        Task<User> CreateAsync(User user);

        // Atualiza a senha e campos relacionados à redefinição
        Task UpdatePasswordAsync(User user);

        // Marca o usuário com solicitação de redefinição de senha pendente
        Task MarkResetPendingAsync(Guid id);
    }
}
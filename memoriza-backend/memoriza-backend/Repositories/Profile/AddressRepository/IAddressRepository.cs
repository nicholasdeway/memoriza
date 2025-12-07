using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using memoriza_backend.Models.Entities;

namespace memoriza_backend.Repositories.Profile.AddressRepository
{
    /// <summary>
    /// Interface para operações de endereços de usuários.
    /// </summary>
    public interface IAddressRepository
    {
        /// <summary>
        /// Busca um endereço por ID.
        /// </summary>
        Task<Address?> GetByIdAsync(Guid id);

        /// <summary>
        /// Busca todos os endereços de um usuário.
        /// </summary>
        Task<List<Address>> GetUserAddressesAsync(string userId);

        /// <summary>
        /// Busca o endereço padrão de um usuário.
        /// </summary>
        Task<Address?> GetDefaultAddressAsync(string userId);

        /// <summary>
        /// Cria um novo endereço.
        /// </summary>
        Task<Address> CreateAsync(Address address);

        /// <summary>
        /// Atualiza um endereço existente.
        /// </summary>
        Task<bool> UpdateAsync(Address address);

        /// <summary>
        /// Deleta um endereço.
        /// </summary>
        Task<bool> DeleteAsync(Guid id);

        /// <summary>
        /// Define um endereço como padrão (e remove o flag dos outros).
        /// </summary>
        Task<bool> SetDefaultAddressAsync(string userId, Guid addressId);
    }
}

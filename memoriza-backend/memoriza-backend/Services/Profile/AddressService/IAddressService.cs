using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using memoriza_backend.Models.DTO.Profile.Address;

namespace memoriza_backend.Services.Profile.AddressService
{
    /// <summary>
    /// Interface para serviço de gerenciamento de endereços.
    /// </summary>
    public interface IAddressService
    {
        /// <summary>
        /// Busca todos os endereços de um usuário.
        /// </summary>
        Task<List<AddressResponse>> GetUserAddressesAsync(string userId);

        /// <summary>
        /// Busca um endereço específico por ID.
        /// </summary>
        Task<AddressResponse?> GetAddressByIdAsync(Guid id, string userId);

        /// <summary>
        /// Busca o endereço padrão do usuário.
        /// </summary>
        Task<AddressResponse?> GetDefaultAddressAsync(string userId);

        /// <summary>
        /// Cria um novo endereço.
        /// </summary>
        Task<AddressResponse> CreateAddressAsync(string userId, CreateAddressRequest request);

        /// <summary>
        /// Atualiza um endereço existente.
        /// </summary>
        Task<AddressResponse?> UpdateAddressAsync(Guid id, string userId, UpdateAddressRequest request);

        /// <summary>
        /// Deleta um endereço.
        /// </summary>
        Task<bool> DeleteAddressAsync(Guid id, string userId);

        /// <summary>
        /// Define um endereço como padrão.
        /// </summary>
        Task<bool> SetDefaultAddressAsync(Guid id, string userId);
    }
}

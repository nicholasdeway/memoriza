using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using memoriza_backend.Models.DTO.Profile.Address;
using memoriza_backend.Models.Entities;
using memoriza_backend.Repositories.Profile.AddressRepository;

namespace memoriza_backend.Services.Profile.AddressService
{
    public class AddressService : IAddressService
    {
        private readonly IAddressRepository _addressRepository;

        public AddressService(IAddressRepository addressRepository)
        {
            _addressRepository = addressRepository;
        }

        public async Task<List<AddressResponse>> GetUserAddressesAsync(string userId)
        {
            var addresses = await _addressRepository.GetUserAddressesAsync(userId);
            
            return addresses.Select(a => new AddressResponse
            {
                Id = a.Id,
                Label = a.Label,
                Street = a.Street,
                Number = a.Number,
                Complement = a.Complement,
                Neighborhood = a.Neighborhood,
                City = a.City,
                State = a.State,
                ZipCode = a.ZipCode,
                Country = a.Country,
                IsDefault = a.IsDefault,
                CreatedAt = a.CreatedAt
            }).ToList();
        }

        public async Task<AddressResponse?> GetAddressByIdAsync(Guid id, string userId)
        {
            var address = await _addressRepository.GetByIdAsync(id);
            
            // Validação de segurança: usuário só pode acessar seus próprios endereços
            if (address == null || address.UserId != userId)
                return null;

            return new AddressResponse
            {
                Id = address.Id,
                Label = address.Label,
                Street = address.Street,
                Number = address.Number,
                Complement = address.Complement,
                Neighborhood = address.Neighborhood,
                City = address.City,
                State = address.State,
                ZipCode = address.ZipCode,
                Country = address.Country,
                IsDefault = address.IsDefault,
                CreatedAt = address.CreatedAt
            };
        }

        public async Task<AddressResponse?> GetDefaultAddressAsync(string userId)
        {
            var address = await _addressRepository.GetDefaultAddressAsync(userId);
            
            if (address == null)
                return null;

            return new AddressResponse
            {
                Id = address.Id,
                Label = address.Label,
                Street = address.Street,
                Number = address.Number,
                Complement = address.Complement,
                Neighborhood = address.Neighborhood,
                City = address.City,
                State = address.State,
                ZipCode = address.ZipCode,
                Country = address.Country,
                IsDefault = address.IsDefault,
                CreatedAt = address.CreatedAt
            };
        }

        public async Task<AddressResponse> CreateAddressAsync(string userId, CreateAddressRequest request)
        {
            // Se este endereço deve ser o padrão, remove o flag dos outros
            if (request.IsDefault)
            {
                var existingAddresses = await _addressRepository.GetUserAddressesAsync(userId);
                foreach (var existing in existingAddresses.Where(a => a.IsDefault))
                {
                    existing.IsDefault = false;
                    await _addressRepository.UpdateAsync(existing);
                }
            }

            var address = new Address
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Label = request.Label,
                Street = request.Street,
                Number = request.Number,
                Complement = request.Complement,
                Neighborhood = request.Neighborhood,
                City = request.City,
                State = request.State,
                ZipCode = request.ZipCode,
                Country = request.Country,
                IsDefault = request.IsDefault,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _addressRepository.CreateAsync(address);

            return new AddressResponse
            {
                Id = created.Id,
                Label = created.Label,
                Street = created.Street,
                Number = created.Number,
                Complement = created.Complement,
                Neighborhood = created.Neighborhood,
                City = created.City,
                State = created.State,
                ZipCode = created.ZipCode,
                Country = created.Country,
                IsDefault = created.IsDefault,
                CreatedAt = created.CreatedAt
            };
        }

        public async Task<AddressResponse?> UpdateAddressAsync(Guid id, string userId, UpdateAddressRequest request)
        {
            var address = await _addressRepository.GetByIdAsync(id);
            
            // Validação de segurança
            if (address == null || address.UserId != userId)
                return null;

            // Se está marcando como padrão, remove o flag dos outros
            if (request.IsDefault && !address.IsDefault)
            {
                var existingAddresses = await _addressRepository.GetUserAddressesAsync(userId);
                foreach (var existing in existingAddresses.Where(a => a.IsDefault && a.Id != id))
                {
                    existing.IsDefault = false;
                    await _addressRepository.UpdateAsync(existing);
                }
            }

            address.Label = request.Label;
            address.Street = request.Street;
            address.Number = request.Number;
            address.Complement = request.Complement;
            address.Neighborhood = request.Neighborhood;
            address.City = request.City;
            address.State = request.State;
            address.ZipCode = request.ZipCode;
            address.Country = request.Country;
            address.IsDefault = request.IsDefault;

            await _addressRepository.UpdateAsync(address);

            return new AddressResponse
            {
                Id = address.Id,
                Label = address.Label,
                Street = address.Street,
                Number = address.Number,
                Complement = address.Complement,
                Neighborhood = address.Neighborhood,
                City = address.City,
                State = address.State,
                ZipCode = address.ZipCode,
                Country = address.Country,
                IsDefault = address.IsDefault,
                CreatedAt = address.CreatedAt
            };
        }

        public async Task<bool> DeleteAddressAsync(Guid id, string userId)
        {
            var address = await _addressRepository.GetByIdAsync(id);
            
            // Validação de segurança
            if (address == null || address.UserId != userId)
                return false;

            return await _addressRepository.DeleteAsync(id);
        }

        public async Task<bool> SetDefaultAddressAsync(Guid id, string userId)
        {
            var address = await _addressRepository.GetByIdAsync(id);
            
            // Validação de segurança
            if (address == null || address.UserId != userId)
                return false;

            return await _addressRepository.SetDefaultAddressAsync(userId, id);
        }
    }
}

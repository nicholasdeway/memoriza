using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using memoriza_backend.Models.DTO.Profile.Address;
using memoriza_backend.Services.Profile.AddressService;

namespace memoriza_backend.Controller.User
{
    [ApiController]
    [Route("api/profile/addresses")]
    [Authorize]
    public class AddressController : ControllerBase
    {
        private readonly IAddressService _addressService;

        public AddressController(IAddressService addressService)
        {
            _addressService = addressService;
        }

        [HttpGet]
        public async Task<ActionResult> GetAddresses()
        {
            var userId = GetUserId();
            var addresses = await _addressService.GetUserAddressesAsync(userId);
            return Ok(addresses);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetAddress(Guid id)
        {
            var userId = GetUserId();
            var address = await _addressService.GetAddressByIdAsync(id, userId);
            
            if (address == null)
                return NotFound(new { message = "Endereço não encontrado." });

            return Ok(address);
        }

        [HttpGet("default")]
        public async Task<ActionResult> GetDefaultAddress()
        {
            var userId = GetUserId();
            var address = await _addressService.GetDefaultAddressAsync(userId);
            
            if (address == null)
                return NotFound(new { message = "Nenhum endereço padrão encontrado." });

            return Ok(address);
        }

        [HttpPost]
        public async Task<ActionResult> CreateAddress([FromBody] CreateAddressRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();
            var address = await _addressService.CreateAddressAsync(userId, request);
            
            return CreatedAtAction(nameof(GetAddress), new { id = address.Id }, address);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateAddress(Guid id, [FromBody] UpdateAddressRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();
            var address = await _addressService.UpdateAddressAsync(id, userId, request);
            
            if (address == null)
                return NotFound(new { message = "Endereço não encontrado." });

            return Ok(address);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAddress(Guid id)
        {
            var userId = GetUserId();
            var success = await _addressService.DeleteAddressAsync(id, userId);
            
            if (!success)
                return NotFound(new { message = "Endereço não encontrado." });

            return NoContent();
        }

        [HttpPut("{id}/set-default")]
        public async Task<ActionResult> SetDefaultAddress(Guid id)
        {
            var userId = GetUserId();
            var success = await _addressService.SetDefaultAddressAsync(id, userId);
            
            if (!success)
                return NotFound(new { message = "Endereço não encontrado." });

            return Ok(new { message = "Endereço definido como padrão." });
        }

        private string GetUserId()
        {
            var id = User.FindFirstValue(ClaimTypes.NameIdentifier)
                     ?? User.FindFirstValue("sub");

            if (string.IsNullOrEmpty(id))
                throw new UnauthorizedAccessException("User id not found in token.");

            return id;
        }
    }
}
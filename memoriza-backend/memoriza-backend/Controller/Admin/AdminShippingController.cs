using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using memoriza_backend.Models.DTO.Admin.Shipping;
using memoriza_backend.Models.Entities;
using memoriza_backend.Repositories.Shipping;

namespace memoriza_backend.Controller.Admin
{
    [ApiController]
    [Route("api/admin/shipping")]
    [Authorize(Roles = "Admin")] // ✅ Autenticação reativada
    public class AdminShippingController : ControllerBase
    {
        private readonly IShippingRepository _shippingRepository;

        public AdminShippingController(IShippingRepository shippingRepository)
        {
            _shippingRepository = shippingRepository;
        }

        /// <summary>
        /// Lista todas as regiões de frete configuradas.
        /// </summary>
        [HttpGet("regions")]
        public async Task<ActionResult<List<ShippingRegionResponseDto>>> GetAllRegions()
        {
            var regions = await _shippingRepository.GetAllRegionsAsync();

            var response = regions.Select(r => new ShippingRegionResponseDto
            {
                Id = r.Id,
                Code = r.Code,
                Name = r.Name,
                Price = r.Price,
                EstimatedDays = r.EstimatedDays,
                FreeShippingThreshold = r.FreeShippingThreshold,
                IsActive = r.IsActive
            }).ToList();

            return Ok(response);
        }

        /// <summary>
        /// Atualiza as configurações de uma região de frete.
        /// </summary>
        [HttpPut("regions/{id}")]
        public async Task<ActionResult<ShippingRegionResponseDto>> UpdateRegion(
            Guid id,
            [FromBody] UpdateShippingRegionDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Buscar região existente
            var region = await _shippingRepository.GetRegionByIdAsync(id);
            if (region == null)
                return NotFound(new { message = "Região não encontrada." });

            // Atualizar campos editáveis
            region.Price = dto.Price;
            region.EstimatedDays = dto.EstimatedDays;
            region.FreeShippingThreshold = dto.FreeShippingThreshold;

            // Salvar
            var updated = await _shippingRepository.UpdateRegionAsync(region);

            var response = new ShippingRegionResponseDto
            {
                Id = updated.Id,
                Code = updated.Code,
                Name = updated.Name,
                Price = updated.Price,
                EstimatedDays = updated.EstimatedDays,
                FreeShippingThreshold = updated.FreeShippingThreshold,
                IsActive = updated.IsActive
            };

            return Ok(response);
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

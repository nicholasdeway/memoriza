using memoriza_backend.Models.DTO.Admin.Groups;

namespace memoriza_backend.Services.Admin.Groups
{
    /// <summary>
    /// Serviço de regras de negócio para Grupos &
    /// Permissões do painel administrativo.
    /// </summary>
    public interface IGroupService
    {
        /// <summary>Retorna todos os grupos cadastrados.</summary>
        Task<IEnumerable<GroupResponseDto>> GetAllAsync();

        /// <summary>Retorna um grupo específico pelo ID.</summary>
        Task<GroupResponseDto?> GetByIdAsync(Guid id);

        /// <summary>Cria um novo grupo e retorna o ID gerado.</summary>
        Task<Guid> CreateAsync(GroupFormDto dto);

        /// <summary>Atualiza um grupo existente.</summary>
        Task UpdateAsync(Guid id, GroupFormDto dto);

        /// <summary>Remove um grupo do banco (permissões são removidas por cascade).</summary>
        Task DeleteAsync(Guid id);

        /// <summary>Verifica se o nome do grupo é único.</summary>
        Task<bool> IsNameUniqueAsync(string name, Guid? excludeId = null);

        /// <summary>Ativa ou desativa um grupo.</summary>
        Task UpdateStatusAsync(Guid id, bool isActive);
    }
}
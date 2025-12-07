using memoriza_backend.Models.DTO.Admin.Groups;

namespace memoriza_backend.Repositories.Admin.Groups
{
    public interface IGroupRepository
    {
        Task<IEnumerable<GroupResponseDto>> GetAllAsync();
        Task<GroupResponseDto?> GetByIdAsync(Guid id);
        Task<Guid> CreateAsync(GroupFormDto dto);
        Task UpdateAsync(Guid id, GroupFormDto dto);
        Task DeleteAsync(Guid id);
        Task<bool> IsNameUniqueAsync(string name, Guid? excludeId = null);
        Task UpdateStatusAsync(Guid id, bool isActive);
    }
}
using memoriza_backend.Models.DTO.Admin.Groups;

namespace memoriza_backend.Services.Admin.Groups
{
    public interface IGroupService
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
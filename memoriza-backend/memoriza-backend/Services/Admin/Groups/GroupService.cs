using memoriza_backend.Models.DTO.Admin.Groups;
using memoriza_backend.Repositories.Admin.Groups;

namespace memoriza_backend.Services.Admin.Groups
{
    public class GroupService : IGroupService
    {
        private readonly IGroupRepository _repository;

        public GroupService(IGroupRepository repository)
        {
            _repository = repository;
        }

        public Task<IEnumerable<GroupResponseDto>> GetAllAsync()
            => _repository.GetAllAsync();

        public Task<GroupResponseDto?> GetByIdAsync(Guid id)
            => _repository.GetByIdAsync(id);

        public Task<Guid> CreateAsync(GroupFormDto dto)
            => _repository.CreateAsync(dto);

        public Task UpdateAsync(Guid id, GroupFormDto dto)
            => _repository.UpdateAsync(id, dto);

        public Task DeleteAsync(Guid id)
            => _repository.DeleteAsync(id);

        public Task<bool> IsNameUniqueAsync(string name, Guid? excludeId = null)
            => _repository.IsNameUniqueAsync(name, excludeId);

        public Task UpdateStatusAsync(Guid id, bool isActive)
            => _repository.UpdateStatusAsync(id, isActive);
    }
}
using memoriza_backend.Models.Admin;

namespace memoriza_backend.Repositories.Admin.Employees
{
    public interface IEmployeeRepository
    {
        Task<IReadOnlyList<AdminEmployee>> GetAllAsync();
        Task<AdminEmployee?> GetByIdAsync(Guid id);

        Task<bool> IsCpfUniqueAsync(string cpf, Guid? excludeEmployeeId = null);

        Task<Guid> CreateAsync(Guid userId, Guid groupId, string? cpf, DateTime hireDate, string status);
        Task UpdateAsync(Guid id, Guid groupId, string? cpf, DateTime hireDate, string status);
        Task UpdateStatusAsync(Guid id, string status);
    }
}
using memoriza_backend.Models.DTO.Admin.Employees;

namespace memoriza_backend.Services.Admin.Employees
{
    public interface IEmployeeService
    {
        Task<IReadOnlyList<EmployeeResponseDto>> GetAllAsync();
        Task<EmployeeDetailDto?> GetByIdAsync(Guid id);

        Task<Guid> CreateAsync(EmployeeFormDto dto);
        Task UpdateAsync(Guid id, EmployeeFormDto dto);
        Task UpdateStatusAsync(Guid id, string status);
    }
}
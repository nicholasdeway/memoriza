using memoriza_backend.Models.DTO.Admin.Employees;

namespace memoriza_backend.Services.Admin.Employees
{
    public interface IEmployeeAccessLogService
    {
        Task<IReadOnlyList<EmployeeAccessLogResponseDto>> GetAllAsync();
        Task CreateAsync(EmployeeAccessLogCreateDto dto);
    }
}
using memoriza_backend.Models.Admin;

namespace memoriza_backend.Repositories.Admin.Employees
{
    public interface IEmployeeAccessLogRepository
    {
        Task<IReadOnlyList<AdminEmployeeAccessLog>> GetAllAsync();
        Task CreateAsync(AdminEmployeeAccessLog log);
    }
}
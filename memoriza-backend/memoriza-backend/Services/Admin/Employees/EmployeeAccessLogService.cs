using memoriza_backend.Models.Admin;
using memoriza_backend.Models.DTO.Admin.Employees;
using memoriza_backend.Repositories.Admin.Employees;

namespace memoriza_backend.Services.Admin.Employees
{
    public class EmployeeAccessLogService : IEmployeeAccessLogService
    {
        private readonly IEmployeeAccessLogRepository _repository;

        public EmployeeAccessLogService(IEmployeeAccessLogRepository repository)
        {
            _repository = repository;
        }

        public async Task<IReadOnlyList<EmployeeAccessLogResponseDto>> GetAllAsync()
        {
            var logs = await _repository.GetAllAsync();

            return logs.Select(l => new EmployeeAccessLogResponseDto
            {
                Id = l.Id,
                Timestamp = l.Timestamp,
                EmployeeId = l.EmployeeId,
                EmployeeName = l.EmployeeName,
                EmployeeRole = l.EmployeeRole,
                Action = l.Action,
                Module = l.Module,
                Description = l.Description
            }).ToList();
        }

        public async Task CreateAsync(EmployeeAccessLogCreateDto dto)
        {
            if (dto.EmployeeId == Guid.Empty)
                throw new ApplicationException("EmployeeId é obrigatório para registrar log.");

            if (string.IsNullOrWhiteSpace(dto.Action))
                throw new ApplicationException("Action é obrigatório.");

            if (string.IsNullOrWhiteSpace(dto.Module))
                throw new ApplicationException("Module é obrigatório.");

            if (string.IsNullOrWhiteSpace(dto.Description))
                throw new ApplicationException("Description é obrigatório.");

            var log = new AdminEmployeeAccessLog
            {
                Id = Guid.NewGuid(),
                EmployeeId = dto.EmployeeId,
                Action = dto.Action,
                Module = dto.Module,
                Description = dto.Description,
                Timestamp = dto.Timestamp ?? DateTime.UtcNow
            };

            await _repository.CreateAsync(log);
        }
    }
}
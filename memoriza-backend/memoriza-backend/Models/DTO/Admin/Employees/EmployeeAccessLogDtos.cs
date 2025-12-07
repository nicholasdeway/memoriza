using System;

namespace memoriza_backend.Models.DTO.Admin.Employees
{
    // Para listagem na tela (bate com AccessLog do frontend)
    public class EmployeeAccessLogResponseDto
    {
        public Guid Id { get; set; }
        public DateTime Timestamp { get; set; }

        public Guid EmployeeId { get; set; }
        public string EmployeeName { get; set; } = null!;
        public string EmployeeRole { get; set; } = null!;

        public string Action { get; set; } = null!;
        public string Module { get; set; } = null!;

        public string Description { get; set; } = null!;
    }

    // Para criar um log a partir de outras ações do sistema
    public class EmployeeAccessLogCreateDto
    {
        public Guid EmployeeId { get; set; }

        public string Action { get; set; } = null!;
        public string Module { get; set; } = null!;
        public string Description { get; set; } = null!;

        // Opcional – se não vier, o service preenche com UtcNow
        public DateTime? Timestamp { get; set; }
    }
}
using System;

namespace memoriza_backend.Models.Admin
{
    public class AdminEmployeeAccessLog
    {
        public Guid Id { get; set; }

        public Guid EmployeeId { get; set; }

        public string EmployeeName { get; set; } = null!;
        public string EmployeeRole { get; set; } = null!;

        public string Action { get; set; } = null!;
        public string Module { get; set; } = null!;
        public string Description { get; set; } = null!;
        public DateTime Timestamp { get; set; }
    }
}
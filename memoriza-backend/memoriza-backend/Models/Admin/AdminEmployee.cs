using System;

namespace memoriza_backend.Models.Admin
{
    public class AdminEmployee
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid GroupId { get; set; }

        public string GroupName { get; set; } = null!;

        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;

        public string? Cpf { get; set; }
        public string Status { get; set; } = null!;
        public DateTime HireDate { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
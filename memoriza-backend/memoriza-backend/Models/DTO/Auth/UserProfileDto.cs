using System;

namespace memoriza_backend.Models.DTO.Auth
{
    public class UserProfileDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? PictureUrl { get; set; }
        public int UserGroupId { get; set; }
        public Guid? EmployeeGroupId { get; set; }
        public bool IsAdmin { get; set; }
        public string AuthProvider { get; set; } = string.Empty;
    }
}

namespace memoriza_backend.Models.DTO.Admin.Groups
{
    public class PermissionDto
    {
        public string Module { get; set; } = default!;
        public Dictionary<string, bool> Actions { get; set; } = new();
    }

    // Equivalente ao GroupFormData do frontend
    public class GroupFormDto
    {
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
        public List<PermissionDto> Permissions { get; set; } = new();
    }

    // Resposta completa para listagem/detalhe
    public class GroupResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public int EmployeeCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<PermissionDto> Permissions { get; set; } = new();
    }

    public class ToggleGroupStatusDto
    {
        public bool IsActive { get; set; }
    }

    public class CheckGroupNameResponseDto
    {
        public bool IsUnique { get; set; }
    }
}
using System;

namespace memoriza_backend.Models.DTO.Admin.Employees
{
    // Resposta para listagem e detalhe
    public class EmployeeResponseDto
    {
        public Guid Id { get; set; }

        // Dados pessoais
        public string Name { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string? Cpf { get; set; }

        // Grupo
        public Guid GroupId { get; set; }
        public string GroupName { get; set; } = null!;

        // Profissional
        public DateTime HireDate { get; set; }
        public string Status { get; set; } = null!;

        // Auditoria
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    // Dados que vêm do formulário (create/update)
    public class EmployeeFormDto
    {
        // Dados pessoais
        public string Name { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string? Cpf { get; set; }

        // Grupo
        public Guid GroupId { get; set; }

        // Profissional
        public DateTime HireDate { get; set; }
        public string Status { get; set; } = "active";
        public string? Password { get; set; }
    }

    // DTO simples para PATCH de status
    public class UpdateEmployeeStatusDto
    {
        public string Status { get; set; } = null!;
    }
}
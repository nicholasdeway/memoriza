namespace memoriza_backend.Models.Authentication
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string? Phone { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public bool PasswordResetPending { get; set; }

        public DateTime? LastLoginAt { get; set; }

        public int UserGroupId { get; set; } = (int)UserGroupType.UsuarioComum;

        // Grupo personalizado para funcionários (referência à tabela user_groups)
        // Se preenchido, as permissões vêm desse grupo em vez do UserGroupId
        public Guid? EmployeeGroupId { get; set; }

        // Propriedade de conveniência (não precisa existir no banco)
        public bool IsAdmin => UserGroupId == (int)UserGroupType.Admin;

        // origem da conta
        public string AuthProvider { get; set; } = "Local";

        // Google
        public string? ProviderUserId { get; set; }
        public string? ProviderEmail { get; set; }
        public string? PictureUrl { get; set; }

        // Se a conta está ativa ou o usuário apagou sua conta
        public bool IsActive { get; set; } = true;
    }

    // Grupos suportados
    public enum UserGroupType
    {
        UsuarioComum = 1,
        Admin = 2
    }
}
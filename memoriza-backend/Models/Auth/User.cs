namespace memoriza_backend.Models.Authentication
{
    public class User
    {
        // PK
        public Guid Id { get; set; } = Guid.NewGuid();

        // Identidade básica
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;

        // Login local (continua igual – hash da senha)
        public string Password { get; set; } = null!;

        public string? Phone { get; set; }

        // Auditoria
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public bool PasswordResetPending { get; set; }

        // último login (local ou Google)
        public DateTime? LastLoginAt { get; set; }

        // Grupo de usuário (1 = comum, 2 = admin)
        public int UserGroupId { get; set; } = (int)UserGroupType.UsuarioComum;

        // Propriedade de conveniência (não precisa existir no banco)
        public bool IsAdmin => UserGroupId == (int)UserGroupType.Admin;

        // origem da conta
        // "Local"  -> criada por e-mail/senha
        // "Google" -> criada via OAuth do Google
        public string AuthProvider { get; set; } = "Local";

        // Para contas Google
        public string? ProviderUserId { get; set; }
        public string? ProviderEmail { get; set; }
        public string? PictureUrl { get; set; }
    }

    // Grupos suportados
    public enum UserGroupType
    {
        UsuarioComum = 1,
        Admin = 2
    }
}
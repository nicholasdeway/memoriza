namespace memoriza_backend.Models.Admin
{
    public class GroupPermission
    {
        public long Id { get; set; }
        public Guid GroupId { get; set; }
        public string Module { get; set; } = default!;
        public string ActionsJson { get; set; } = default!;
    }
}
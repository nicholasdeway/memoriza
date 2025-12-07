namespace memoriza_backend.Models.Admin
{
    public class Color
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? HexCode { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
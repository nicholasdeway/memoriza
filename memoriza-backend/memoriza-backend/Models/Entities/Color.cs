namespace memoriza_backend.Models.Entities
{
    public class Color
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? HexCode { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
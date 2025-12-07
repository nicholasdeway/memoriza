namespace memoriza_backend.Models.DTO.Admin.Color
{
    public class ColorResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? HexCode { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateColorDto
    {
        public string Name { get; set; } = null!;
        public string? HexCode { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class UpdateColorDto
    {
        public string Name { get; set; } = null!;
        public string? HexCode { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
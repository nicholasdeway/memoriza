using System;

namespace memoriza_backend.Models.DTO.Admin.Size
{
    public class SizeResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateSizeDto
    {
        public string Name { get; set; } = null!;
        public bool IsActive { get; set; } = true;
    }

    public class UpdateSizeDto
    {
        public string Name { get; set; } = null!;
        public bool IsActive { get; set; } = true;
    }
}
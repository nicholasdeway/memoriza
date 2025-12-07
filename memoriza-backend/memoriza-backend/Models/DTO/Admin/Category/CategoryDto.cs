namespace memoriza_backend.Models.DTO.Admin.Category
{
    public class CreateCategoryDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
    }

    public class UpdateCategoryDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }

    public class CategoryResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
using System;

namespace memoriza_backend.Models.DTO.Admin.Carousel
{
    public class CarouselItemResponseDto
    {
        public Guid Id { get; set; }

        public string? Title { get; set; } = null!;
        public string? Subtitle { get; set; }
        public string? CtaText { get; set; }
        public string? CtaLink { get; set; }

        public string ImageUrl { get; set; } = null!;

        public bool IsActive { get; set; }
        public int DisplayOrder { get; set; }
        public DateTime CreatedAt { get; set; }

        public string TemplateType { get; set; } = "default";
    }

    public class CreateCarouselItemDto
    {
        public string? Title { get; set; } = string.Empty;
        public string? Subtitle { get; set; }
        public string? CtaText { get; set; }
        public string? CtaLink { get; set; }
        public bool IsActive { get; set; } = true;

        public string TemplateType { get; set; } = "default";
    }

    public class UpdateCarouselItemDto
    {
        public string? Title { get; set; } = string.Empty;
        public string? Subtitle { get; set; }
        public string? CtaText { get; set; }
        public string? CtaLink { get; set; }
        public bool IsActive { get; set; } = true;

        public string TemplateType { get; set; } = "default";
    }
}
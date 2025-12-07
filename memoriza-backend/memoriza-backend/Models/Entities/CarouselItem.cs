using System;

namespace memoriza_backend.Models.Entities
{
    public class CarouselItem
    {
        public Guid Id { get; set; }

        public string? Title { get; set; } = null!;
        public string? Subtitle { get; set; }
        public string? CtaText { get; set; }
        public string? CtaLink { get; set; }

        public string ImagePath { get; set; } = null!;

        public bool IsActive { get; set; }
        public int DisplayOrder { get; set; }

        public DateTime CreatedAt { get; set; }

        public string TemplateType { get; set; } = "default";
    }
}
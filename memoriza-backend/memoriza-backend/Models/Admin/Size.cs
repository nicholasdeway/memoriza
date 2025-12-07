using System;

namespace memoriza_backend.Models.Admin
{
    public class Size
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
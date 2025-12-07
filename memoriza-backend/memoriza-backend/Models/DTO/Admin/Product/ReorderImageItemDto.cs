using System;

namespace memoriza_backend.Models.DTO.Admin.Product
{
    public class ReorderImageItemDto
    {
        public Guid ImageId { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsPrimary { get; set; }
    }
}
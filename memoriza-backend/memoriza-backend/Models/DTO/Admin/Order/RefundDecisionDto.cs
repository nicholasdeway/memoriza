using System;

namespace memoriza_backend.Models.DTO.Admin.Order
{
    public class RefundDecisionDto
    {
        public Guid AdminUserId { get; set; }
        public string? Note { get; set; }
    }
}
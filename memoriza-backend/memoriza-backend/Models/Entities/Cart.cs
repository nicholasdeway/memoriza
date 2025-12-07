using System;
using System.Collections.Generic;

namespace memoriza_backend.Models.Entities
{
    /// <summary>
    /// Carrinho de compras do usuário.
    /// </summary>
    public class Cart
    {
        public Guid Id { get; set; }

        public string UserId { get; set; } = string.Empty;

        /// <summary>
        /// Indica se este carrinho ainda está ativo.
        /// </summary>
        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public List<CartItem> Items { get; set; } = new();
    }
}
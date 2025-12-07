using System;
using System.Collections.Generic;
using memoriza_backend.Models.DTO.User.Cart;
using memoriza_backend.Models.DTO.User.Shipping;
using memoriza_backend.Models.DTO.Profile.Address;

namespace memoriza_backend.Models.DTO.User.Orders
{
    /// <summary>
    /// Detalhes de um pedido específico para o usuário.
    /// </summary>
    public class OrderDetailForUserResponse
    {
        public Guid OrderId { get; set; }

        public string OrderNumber { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public decimal Subtotal { get; set; }

        public decimal ShippingAmount { get; set; }

        public decimal TotalAmount { get; set; }

        public string Status { get; set; } = string.Empty;

        /// <summary>
        /// Itens do pedido (espelhando itens de carrinho).
        /// </summary>
        public List<CartItemDto> Items { get; set; } = new();

        /// <summary>
        /// Informação da opção de frete utilizada (opcional).
        /// </summary>
        public ShippingOptionDto? ShippingOption { get; set; }

        /// <summary>
        /// Endereço de entrega usado no pedido.
        /// </summary>
        public ShippingAddressDto? ShippingAddress { get; set; }

        /// <summary>
        /// Data da entrega
        /// </summary>
        public DateTime? DeliveredAt { get; set; }

        /// <summary>
        /// Indica se ainda é possível solicitar reembolso.
        /// </summary>
        public bool IsRefundable { get; set; }

        /// <summary>
        /// Status atual de reembolso, se já solicitado.
        /// </summary>
        public string? RefundStatus { get; set; }

        /// <summary>
        /// Rastreamento de pedidos
        /// </summary>
        public string? TrackingCode { get; set; }
        public string? TrackingCompany { get; set; }
        public string? TrackingUrl { get; set; }
    }

    /// <summary>
    /// DTO com dados do endereço de entrega usado no pedido.
    /// </summary>
    public class ShippingAddressDto
    {
        public string Street { get; set; } = string.Empty;
        public string Number { get; set; } = string.Empty;
        public string? Complement { get; set; }
        public string Neighborhood { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
    }
}
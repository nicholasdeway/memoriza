using System;

namespace memoriza_backend.Models.Entities
{
    /// <summary>
    /// Endereço de entrega do usuário.
    /// </summary>
    public class Address
    {
        public Guid Id { get; set; }
        
        /// <summary>
        /// ID do usuário dono deste endereço.
        /// </summary>
        public string UserId { get; set; } = string.Empty;
        
        /// <summary>
        /// Rótulo para identificação (ex: "Casa", "Trabalho", "Apartamento").
        /// </summary>
        public string Label { get; set; } = string.Empty;
        
        /// <summary>
        /// Logradouro (rua, avenida, etc).
        /// </summary>
        public string Street { get; set; } = string.Empty;
        
        /// <summary>
        /// Número do endereço.
        /// </summary>
        public string Number { get; set; } = string.Empty;
        
        /// <summary>
        /// Complemento (apto, bloco, etc) - opcional.
        /// </summary>
        public string? Complement { get; set; }
        
        /// <summary>
        /// Bairro.
        /// </summary>
        public string Neighborhood { get; set; } = string.Empty;
        
        /// <summary>
        /// Cidade.
        /// </summary>
        public string City { get; set; } = string.Empty;
        
        /// <summary>
        /// Estado (sigla com 2 letras).
        /// </summary>
        public string State { get; set; } = string.Empty;
        
        /// <summary>
        /// CEP (formato: 00000-000).
        /// </summary>
        public string ZipCode { get; set; } = string.Empty;
        
        /// <summary>
        /// País.
        /// </summary>
        public string Country { get; set; } = "Brasil";
        
        /// <summary>
        /// Indica se este é o endereço padrão do usuário.
        /// </summary>
        public bool IsDefault { get; set; }
        
        /// <summary>
        /// Data de criação do endereço.
        /// </summary>
        public DateTime CreatedAt { get; set; }
    }
}

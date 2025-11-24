# **Memoriza — Plataforma de Papelaria Personalizável**

O **Memoriza** é uma plataforma completa para compra de artigos de papelaria personalizáveis, desenvolvida com foco em produção real.
O sistema inclui módulos de autenticação, administração, gerenciamento de pedidos, carrinho, produtos, checkout e integração futura com pagamento e notificações.

Este é um projeto em evolução contínua, com backend em C# / ASP.NET Core e banco de dados PostgreSQL utilizando **Supabase**.

---

## **Visão Geral**

O Memoriza é um e-commerce especializado em produtos de papelaria totalmente personalizáveis, permitindo aos clientes:

* Criar uma conta e gerenciar seus dados
* Adicionar itens ao carrinho
* Personalizar produtos
* Realizar pedidos
* Acompanhar o status das compras
* Efetuar pagamentos (em desenvolvimento)
* Receber notificações por e-mail (reset de senha, confirmação, etc.)

A plataforma está sendo desenvolvida para ambiente real de produção, com padrões modernos de API e arquitetura limpa.

---

## **Tecnologias Principais**

### **Backend**

* C# / ASP.NET Core 8
* PostgreSQL (Supabase)
* Dapper
* FluentValidation
* JWT Authentication
* REST API
* Clean Architecture

### **Infraestrutura e Banco**

* Supabase (PostgreSQL gerenciado)
* Migrations manuais e scripts SQL

---

## **Funcionalidades do Backend**

### **Autenticação**

* Registro
* Login
* JWT
* Reset de senha (parcialmente implementado)

### **Admin**

* CRUD completo de produtos
* CRUD de categorias
* Dashboard
* Gerenciamento de pedidos
* Padronizações com FluentValidation

### **Usuário**

* Atualização de perfil
* Carrinho
* Pedidos
* Histórico de compras

### **Checkout**

* Em desenvolvimento
  Inclui:
* Integração com gateway de pagamento
* Geração de pedido
* Processamento seguro

---

## **Roadmap**

### **Implementações concluídas**

* Estrutura inicial do backend
* Módulo User funcional
* Módulo Admin funcional
* FluentValidation aplicado
* Supabase configurado
* Integração com JWT
* DTOs reorganizados
* ServiceResult para padronização

### **Em desenvolvimento**

* Reset password completo
* Checkout completo
* Integração com gateway de pagamento
* Email transacional
* Logs e auditoria

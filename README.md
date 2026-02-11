## Sobre

O Memoriza é uma aplicação fullstack voltada para a venda de artigos de papelaria personalizáveis. O projeto foi desenvolvido pensando em uso real, com foco em segurança, organização do código e experiência do usuário, contando com interface responsiva adaptada para diferentes tamanhos de tela.

---

## Funcionalidades

* Cadastro e login com JWT armazenado em cookies HttpOnly
* Login social com Google
* Carrinho de compras
* Checkout transparente com Pix e Cartão de Crédito via Mercado Pago
* Painel administrativo
* Gerenciamento de produtos
* Gerenciamento de pedidos
* Sistema de frete por localidade fixa
* Solicitação e gestão de reembolso
* Integração com serviço de e-mail
* API RESTful própria

---

## Arquitetura

O backend foi estruturado em camadas, seguindo uma divisão clara de responsabilidades:

* **Controllers**: responsáveis pela entrada das requisições HTTP
* **Services**: concentram as regras de negócio
* **Repositories**: realizam o acesso e manipulação de dados
* **DTOs**: utilizados para transferência de dados entre camadas
* **Injeção de Dependência** aplicada por meio de interfaces

A organização prioriza segurança, manutenibilidade e escalabilidade do código.

---

## Stack Utilizada

### Backend

* C#
* ASP.NET Core
* PostgreSQL (Supabase)
* Integração com APIs externas (Mercado Pago, Google e serviço de e-mail)

### Frontend

* React
* Next.js
* TypeScript

### Infraestrutura

* AWS EC2
* Deploy automatizado com GitHub Actions

---

## Segurança

* Armazenamento de JWT em cookies HttpOnly
* Controle de acesso baseado em roles
* Proteção de rotas no backend
* Não exposição de dados sensíveis ao frontend
* Acesso ao servidor via SSH protegido por chave privada

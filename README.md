# 🌱 GreenGo

> **A sua quitanda online de hortifruti orgânico e natural.**

Fundada em 2025, a **GreenGo** é um e-commerce focado em conectar pessoas a alimentos frescos, orgânicos e naturais. Nosso maior compromisso, além da qualidade dos produtos, é com o meio ambiente: possuímos uma logística otimizada para **entregas rápidas com zero emissão de gás carbônico**.

---

## 💻 Funcionalidades

O sistema foi desenvolvido para atender tanto aos clientes quanto à gestão interna da quitanda, contando com:

*   🛒 **Realização de Compras:** Catálogo de produtos naturais e orgânicos com fluxo completo de carrinho e finalização de pedido.
*   👥 **Cadastro de Clientes:** Sistema para registro e gerenciamento de perfis de consumidores.
*   🤝 **Cadastro de Fornecedores:** Área dedicada para registrar e gerenciar os produtores parceiros que abastecem a quitanda.
*   📦 **Gestão de Pedidos:** Painel administrativo para acompanhar as vendas, status das entregas e organizar a operação.
*   📖 **Cartilha de Apoio ao Ambiente de Trabalho:** Material informativo e de suporte integrado ao sistema para garantir boas práticas e bem-estar na operação diária.

## 🚀 Tecnologias e Ferramentas

O projeto foi construído utilizando as seguintes tecnologias:

*   **Front-end:** HTML5, CSS3, JavaScript
*   **Template Engine:** EJS (Embedded JavaScript templating)
*   **Back-end:** Node.js com Express.js
*   **Versionamento de Código:** Git e GitHub
*   **Hospedagem / Deploy:** [Vercel](https://vercel.com/)

## 🛠️ Como rodar o projeto localmente

Siga os passos abaixo para testar o projeto na sua máquina.

### Pré-requisitos
*   [Git](https://git-scm.com/)
*   [Node.js](https://nodejs.org/) instalado na máquina.

### Passo a passo

1. Clone este repositório:
   ```bash
   git clone [https://github.com/SEU-USUARIO/greengo.git](https://github.com/SEU-USUARIO/greengo.git)

## 🗄️ Banco de dados (MySQL)

1. Ligue o MySQL (o mesmo que você usa no MySQL Workbench / XAMPP).
2. Abra `db/config.js` e coloque a **senha** do seu MySQL (usuário `root` e porta `3306` já são os padrões do Workbench).
3. No terminal, na pasta do projeto:
   ```bash
   npm install
   npm start
   ```
   Ao iniciar, o servidor cria sozinho o banco `greengo`, as tabelas e os produtos iniciais. Se o MySQL estiver desligado ou a senha estiver errada, aparece uma mensagem explicando.
4. Acesse http://localhost:5000/index e, no Workbench, abra o schema `greengo` (clique em ↻ para atualizar).

Tabelas: `fornecedores`, `clientes`, `produtos`, `pedidos`, `pedido_itens` (ver `db/schema.sql`).

| Tela | O que grava/lê no banco |
|---|---|
| Home (vitrine) | lê `produtos` |
| Carrinho → Finalizar | grava `pedidos` + `pedido_itens` e dá baixa no estoque |
| Cadastro de clientes / Criar conta / Login | `clientes` (senha com bcrypt; CPF e e-mail únicos) |
| Cadastro de fornecedores | `fornecedores` (CNPJ único) |
| Gestão de produtos | lista, adiciona e remove em `produtos` |

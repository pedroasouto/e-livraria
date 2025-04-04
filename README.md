# e-livraria

# Livraria Online

A **Livraria Online** é uma aplicação web para e-commerce de livros, desenvolvida com arquitetura moderna e separação entre frontend e backend. O sistema permite que usuários explorem um catálogo, gerenciem um carrinho de compras e finalizem pedidos com diferentes métodos de pagamento.

---

## Funcionalidades

### Autenticação e Perfil

- Cadastro e login de usuários
- Sessão persistente via `localStorage`
- Perfil com dados do usuário
- Histórico de pedidos

### Catálogo e Navegação

- Listagem e visualização de livros
- Filtro por gênero e busca por título/autor
- Exibição detalhada dos livros

### Carrinho de Compras

- Adição, remoção e ajuste de quantidades
- Persistência entre sessões
- Cálculo automático de subtotal e frete grátis (acima de R\$100)
- Sugestões de livros relacionados

### Checkout e Pagamento

- Formulário de endereço completo
- Opções de pagamento: Cartão de Crédito, Débito e PIX
- Confirmação do pedido via modal
- Integração com backend para processamento

### Histórico de Pedidos

- Listagem de pedidos anteriores
- Detalhes do pedido (valor, método de pagamento)
- Consulta integrada ao backend

---

## Fluxo do Usuário

1. Acessa o catálogo de livros
2. Filtra ou busca por títulos/autores
3. Visualiza detalhes ou adiciona ao carrinho
4. Ajusta o carrinho conforme necessário
5. Cria uma conta ou faz login
6. Informa o endereço e escolhe forma de pagamento
7. Confirma o pedido
8. Acompanha seus pedidos no histórico

---

## Tecnologias Utilizadas

### Frontend

- **Next.js** – SSR com React
- **TypeScript** – Tipagem estática
- **Tailwind CSS** – Estilização utilitária
- **shadcn/ui** – Componentes UI acessíveis e personalizáveis
- **Lucide React** – Biblioteca de ícones
- **React Context API** – Gerenciamento de estado global
- **localStorage** – Persistência no navegador

### Backend

- **Java + Spring Boot** – Backend robusto e escalável
- **Spring Data JPA** – Acesso e persistência de dados
- **RESTful API** – Comunicação entre frontend e backend
- **MySQL** – Banco de dados relacional

---

## Estrutura do Projeto

```bash
/
├── frontend/         # Aplicação Next.js
├── backend/          # API REST com Spring Boot
└── README.md
```

---

## Requisitos

- Node.js 18+
- Java 17+
- MySQL 8+
- Yarn ou npm
- Maven ou Gradle

---

## Como Rodar o Projeto

### Backend (Spring Boot)

1. Acesse a pasta do backend:

```bash
cd backend
```

2. Configure o banco de dados no arquivo `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/livraria
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.hibernate.ddl-auto=update
```

3. Execute o projeto:

#### Com Maven:

```bash
./mvnw spring-boot:run
```


A API estará disponível em `http://localhost:8080`.

---

### Frontend (Next.js)

1. Acesse a pasta do frontend:

```bash
cd frontend
```

2. Instale as dependências:

```bash
npm install
```


3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```


A aplicação estará disponível em `http://localhost:3000`.

---

## Licença

Este projeto é de código aberto e está licenciado sob a [MIT License](LICENSE).


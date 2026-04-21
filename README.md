<div align="center">
  <h1>Orkest</h1>
  <p>Plataforma SaaS de gerenciamento de tarefas por equipe</p>

  <p>
    <a href="https://task-manager-web-pearl.vercel.app" target="_blank">
      <img src="https://img.shields.io/badge/demo-ao%20vivo-7c6fe0?style=for-the-badge" alt="Demo ao vivo" />
    </a>
  </p>
</div>

---

## Sobre o projeto

Orkest é uma aplicação fullstack SaaS de gerenciamento de tarefas inspirada no Trello e Asana. O projeto foi desenvolvido para demonstrar habilidades em desenvolvimento fullstack moderno, com foco em autenticação segura, controle de permissões e uma interface dark mode elegante.

**Credenciais de demonstração:**
- Email: `demo@taskmanager.com`
- Senha: `demo1234`

---

## Funcionalidades

- Autenticação completa com JWT (access token + refresh token com rotação)
- Registro e login com hash de senha via bcrypt
- Criação de workspaces com sistema de convite de membros
- Controle de permissões por role (Admin / Membro)
- Board Kanban com drag and drop entre colunas
- CRUD completo de tarefas com atribuição de responsáveis
- Filtro de tarefas por status e responsável
- Interface dark mode com identidade visual própria
- Estado vazio e skeleton loading para melhor UX

---

## Stack

**Frontend**
- React 19 + TypeScript
- Tailwind CSS
- TanStack Query (cache, mutations, invalidação)
- React Router DOM
- @hello-pangea/dnd (drag and drop)
- Axios com interceptors para refresh token automático

**Backend**
- Node.js + Express + TypeScript
- Prisma ORM v7
- PostgreSQL
- JWT (jsonwebtoken) + bcryptjs
- ts-node

**Infraestrutura**
- Frontend: Vercel
- Backend + Banco: Railway
- Monorepo com frontend e backend no mesmo repositório

---

## Arquitetura

    orkest/
    ├── src/                       Backend
    │   ├── controllers/           Lógica de cada rota
    │   ├── middlewares/           Auth + controle de role
    │   ├── routes/                Definição das rotas
    │   ├── services/              Geração e validação de tokens
    │   └── prisma/                Cliente Prisma
    ├── prisma/
    │   ├── schema.prisma          Modelos do banco
    │   ├── migrations/            Histórico de migrations
    │   └── seed.ts                Dados de demonstração
    └── task-manager-web/          Frontend
        └── src/
            ├── api/               Configuração do axios
            ├── components/        Componentes reutilizáveis
            ├── contexts/          AuthContext
            ├── hooks/             useTasks, useWorkspaces
            ├── pages/             Login, Register, Dashboard
            └── routes/            PrivateRoute

---

## Rodando localmente

**Pré-requisitos:** Node.js 18+, PostgreSQL

**Backend**

```bash
git clone https://github.com/PedroHTLemos/task-manager-api.git
cd task-manager-api
npm install
cp .env.example .env
```

Preencha o `.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/orkest"
JWT_SECRET="sua_chave_secreta"
JWT_REFRESH_SECRET="outra_chave_secreta"
PORT=3333
```

```bash
npx prisma migrate deploy
npx tsx prisma/seed.ts
npm run dev
```

**Frontend**

```bash
cd task-manager-web
npm install
npm run dev
```

Acesse `http://localhost:5173`

---

## Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/register` | Cadastro de usuário |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Renovar access token |
| POST | `/auth/logout` | Logout |
| GET | `/auth/me` | Usuário autenticado |
| GET | `/workspaces` | Listar workspaces do usuário |
| POST | `/workspaces` | Criar workspace |
| POST | `/workspaces/:id/members` | Convidar membro |
| GET | `/workspaces/:id/tasks` | Listar tarefas |
| POST | `/workspaces/:id/tasks` | Criar tarefa |
| PATCH | `/workspaces/:id/tasks/:id` | Atualizar tarefa |
| DELETE | `/workspaces/:id/tasks/:id` | Deletar tarefa |

---

## Autor

**Pedro Henrique Torisu Lemos**

[![GitHub](https://img.shields.io/badge/GitHub-PedroHTLemos-181717?style=flat&logo=github)](https://github.com/PedroHTLemos)

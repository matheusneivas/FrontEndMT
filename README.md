# Sistema de Advocacia - Frontend

Frontend completo em **Next.js 15 App Router** para sistema de advocacia com 3 perfis (ADMIN, ADVOGADO, CLIENTE).

## Stack Tecnológica

- ✅ **Next.js 15** (App Router)
- ✅ **TypeScript**
- ✅ **Tailwind CSS**
- ✅ **shadcn/ui** (componentes UI)
- ✅ **NextAuth v5** (autenticação)
- ✅ **TanStack Query v5** (gerenciamento de estado servidor)
- ✅ **Zustand** (gerenciamento de estado cliente)
- ✅ **Zod** (validação)
- ✅ **React Hook Form** (formulários)
- ✅ **Lucide Icons** (ícones)
- ✅ **Axios** (HTTP client)

## Estrutura do Projeto

```
├── app/
│   ├── auth/
│   │   ├── login/          # Página de login
│   │   └── register/       # Página de registro (ADMIN only)
│   ├── dashboard/          # Dashboard com métricas por perfil
│   ├── admin/
│   │   ├── users/          # Gerenciamento de usuários
│   │   └── config/         # Configurações do sistema
│   ├── advogado/
│   │   ├── clientes/       # CRUD de clientes
│   │   └── projetos/       # CRUD de projetos + [id]
│   ├── cliente/
│   │   ├── meus-projetos/  # Lista de projetos do cliente
│   │   └── projetos/       # Timeline do projeto [id]
│   ├── api/
│   │   └── auth/[...nextauth]/  # NextAuth API routes
│   ├── layout.tsx          # Layout raiz
│   ├── page.tsx            # Homepage (redireciona para login)
│   ├── providers.tsx       # QueryClientProvider + Toaster
│   └── globals.css         # Estilos globais
│
├── components/
│   ├── ui/                 # Componentes shadcn/ui
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── toast.tsx
│   │   ├── tabs.tsx
│   │   ├── separator.tsx
│   │   ├── label.tsx
│   │   ├── textarea.tsx
│   │   ├── calendar.tsx
│   │   ├── popover.tsx
│   │   ├── alert.tsx
│   │   ├── skeleton.tsx
│   │   ├── sheet.tsx
│   │   └── command.tsx
│   ├── layout/             # Componentes de layout
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── navbar.tsx
│   ├── auth/               # Componentes de autenticação
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   └── protected-route.tsx
│   ├── clientes/           # Componentes de clientes
│   │   ├── clientes-table.tsx
│   │   ├── cliente-form.tsx
│   │   └── cliente-card.tsx
│   ├── projetos/           # Componentes de projetos
│   │   ├── projetos-table.tsx
│   │   ├── projeto-form.tsx
│   │   ├── projeto-card.tsx
│   │   ├── timeline.tsx
│   │   ├── etapas-list.tsx
│   │   └── status-badge.tsx
│   └── common/             # Componentes comuns
│       ├── loading.tsx
│       ├── error-boundary.tsx
│       ├── pagination.tsx
│       ├── search-bar.tsx
│       └── filters.tsx
│
├── lib/
│   ├── api/                # API clients
│   │   ├── client.ts       # ✅ Axios client configurado
│   │   ├── auth.ts         # ✅ Login, register, profile
│   │   ├── clientes.ts     # ✅ CRUD clientes
│   │   ├── projetos.ts     # ✅ CRUD projetos
│   │   ├── etapas.ts       # ✅ CRUD etapas
│   │   ├── users.ts        # ✅ CRUD users (admin)
│   │   └── index.ts        # ✅ Export barrel
│   ├── utils/              # Utilitários
│   │   ├── cn.ts           # ✅ Tailwind merge
│   │   ├── formatters.ts   # ✅ Formatadores de data, status, etc
│   │   ├── validators.ts   # ✅ Schemas Zod
│   │   └── index.ts        # ✅ Export barrel
│   ├── hooks/              # Custom hooks
│   │   ├── useAuth.ts      # ✅ Hook de autenticação
│   │   ├── useClientes.ts  # CRUD clientes com TanStack Query
│   │   └── useProjetos.ts  # CRUD projetos com TanStack Query
│   ├── stores/             # Zustand stores
│   │   └── auth-store.ts   # ✅ Store de autenticação
│   └── types/              # TypeScript types
│       ├── enums.ts        # ✅ Enums (UserRole, ProjetoStatus, etc)
│       ├── api-types.ts    # ✅ Tipos da API
│       └── index.ts        # ✅ Export barrel
│
├── public/
│   ├── images/
│   └── icons/
│
├── .env.local              # ✅ Variáveis de ambiente
├── .env.example            # ✅ Exemplo de variáveis
├── .gitignore              # ✅ Git ignore
├── components.json         # ✅ Config shadcn/ui
├── middleware.ts           # ✅ Proteção de rotas
├── next.config.js          # ✅ Config Next.js
├── package.json            # ✅ Dependências
├── postcss.config.mjs      # ✅ Config PostCSS
├── tailwind.config.ts      # ✅ Config Tailwind
└── tsconfig.json           # ✅ Config TypeScript
```

## Arquivos Criados ✅

### Configuração Base
- ✅ package.json (todas dependências instaladas)
- ✅ tsconfig.json
- ✅ next.config.js
- ✅ tailwind.config.ts
- ✅ postcss.config.mjs
- ✅ components.json (shadcn/ui)
- ✅ .env.local + .env.example
- ✅ .gitignore
- ✅ middleware.ts (proteção de rotas)

### Types & Utils
- ✅ lib/types/enums.ts (todos enums)
- ✅ lib/types/api-types.ts (todos types da API)
- ✅ lib/utils/cn.ts
- ✅ lib/utils/formatters.ts (formatadores completos)
- ✅ lib/utils/validators.ts (schemas Zod completos)

### API Clients
- ✅ lib/api/client.ts (axios configurado)
- ✅ lib/api/auth.ts
- ✅ lib/api/clientes.ts
- ✅ lib/api/projetos.ts
- ✅ lib/api/etapas.ts
- ✅ lib/api/users.ts

### Stores & Hooks
- ✅ lib/stores/auth-store.ts (Zustand)
- ✅ lib/hooks/useAuth.ts (TanStack Query)

### Componentes UI (shadcn/ui)
- ✅ 23 componentes instalados via shadcn CLI

### App Core
- ✅ app/layout.tsx
- ✅ app/page.tsx
- ✅ app/providers.tsx
- ✅ app/globals.css

## Próximos Passos - Arquivos Pendentes

### 1. Hooks TanStack Query
```bash
# Criar hooks faltantes:
- lib/hooks/useClientes.ts
- lib/hooks/useProjetos.ts
- lib/hooks/useEtapas.ts
- lib/hooks/useUsers.ts
```

### 2. Componentes de Layout
```bash
- components/layout/sidebar.tsx
- components/layout/header.tsx
- components/layout/navbar.tsx
```

### 3. Componentes de Auth
```bash
- components/auth/login-form.tsx
- components/auth/register-form.tsx
- components/auth/protected-route.tsx
```

### 4. Componentes Comuns
```bash
- components/common/loading.tsx
- components/common/error-boundary.tsx
- components/common/pagination.tsx
- components/common/search-bar.tsx
- components/common/filters.tsx
```

### 5. Componentes de Clientes
```bash
- components/clientes/clientes-table.tsx
- components/clientes/cliente-form.tsx
- components/clientes/cliente-card.tsx
```

### 6. Componentes de Projetos
```bash
- components/projetos/projetos-table.tsx
- components/projetos/projeto-form.tsx
- components/projetos/projeto-card.tsx
- components/projetos/timeline.tsx
- components/projetos/etapas-list.tsx
- components/projetos/status-badge.tsx
```

### 7. Páginas de Autenticação
```bash
- app/auth/login/page.tsx
- app/auth/register/page.tsx
```

### 8. Dashboard
```bash
- app/dashboard/page.tsx
- app/dashboard/layout.tsx
```

### 9. Páginas Admin
```bash
- app/admin/users/page.tsx
- app/admin/config/page.tsx
```

### 10. Páginas Advogado
```bash
- app/advogado/clientes/page.tsx
- app/advogado/projetos/page.tsx
- app/advogado/projetos/[id]/page.tsx
```

### 11. Páginas Cliente
```bash
- app/cliente/meus-projetos/page.tsx
- app/cliente/projetos/[id]/timeline/page.tsx
```

### 12. NextAuth Configuration
```bash
- app/api/auth/[...nextauth]/route.ts
- lib/auth.ts (NextAuth config)
```

## Instalação

```bash
# 1. Instalar dependências (já feito)
npm install --legacy-peer-deps

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas configurações

# 3. Rodar o projeto
npm run dev

# Acessar: http://localhost:3001
```

## Variáveis de Ambiente

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3000

# NextAuth
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key-here

# Environment
NODE_ENV=development
```

## 🔑 Credenciais de Teste

Usuários disponíveis para login (após executar seed no backend):

### 👤 Admin
- **Email:** admin@michiletavares.com.br
- **Senha:** Admin@2024!Secure
- **Acesso:** Total ao sistema

### 👤 Advogado
- **Email:** advogado@michiletavares.com.br
- **Senha:** Advogado@2024!MT
- **Acesso:** Gestão de clientes, projetos e etapas

### 👤 Cliente
- **Email:** cliente@michiletavares.com.br
- **Senha:** Cliente@2024!Test
- **Acesso:** Visualização dos próprios projetos

## Features Implementadas

### Autenticação
- ✅ Sistema de login/logout
- ✅ Registro de usuários (ADMIN only)
- ✅ Proteção de rotas por middleware
- ✅ Store de autenticação (Zustand)
- ✅ Hook useAuth com TanStack Query

### API Integration
- ✅ Axios client configurado
- ✅ Interceptors para token JWT
- ✅ API clients para todos endpoints
- ✅ Tratamento de erros

### Types & Validation
- ✅ Types completos para todas entidades
- ✅ Enums para status, roles, etc
- ✅ Schemas Zod para validação
- ✅ Formatadores de data, CPF, CNPJ, telefone

### UI Components
- ✅ 23 componentes shadcn/ui instalados
- ✅ Theme system (light/dark)
- ✅ Toast notifications
- ✅ Estilos globais Tailwind

## Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento (port 3001)
npm run build    # Build production
npm run start    # Start production
npm run lint     # Lint código
```

## Perfis de Usuário

### ADMIN
- Gerenciamento de usuários
- Configurações do sistema
- Acesso total

### ADVOGADO
- CRUD de clientes
- CRUD de projetos
- Gerenciamento de etapas
- Upload de documentos
- Visualização completa

### CLIENTE
- Visualização de seus projetos
- Timeline de processos (apenas marcos visíveis)
- Download de documentos disponíveis

## Próximas Implementações

1. **NextAuth v5** - Autenticação completa com JWT
2. **Dashboard** - Métricas e gráficos por perfil
3. **CRUD Clientes** - Formulários e tabelas
4. **CRUD Projetos** - Com tabs (info/etapas/docs/timeline)
5. **Timeline** - Visualização de atividades
6. **Upload** - Sistema de upload de documentos
7. **Filtros** - Busca e filtros avançados
8. **Paginação** - Paginação server-side

## Tecnologias

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS 3.4
- **UI Library**: shadcn/ui (Radix UI)
- **State**: TanStack Query 5 + Zustand 4
- **Forms**: React Hook Form 7 + Zod 3
- **HTTP**: Axios 1.7
- **Auth**: NextAuth v5 (beta)
- **Icons**: Lucide React
- **Date**: date-fns 3.6

## Estrutura Backend Esperada

```
POST /auth/login        - Login
POST /auth/register     - Register (ADMIN)
GET  /auth/profile      - Get user profile

GET    /users           - List users (paginated)
GET    /users/:id       - Get user
PATCH  /users/:id       - Update user
DELETE /users/:id       - Delete user

GET    /clientes        - List clientes (paginated)
GET    /clientes/:id    - Get cliente
POST   /clientes        - Create cliente
PATCH  /clientes/:id    - Update cliente
DELETE /clientes/:id    - Delete cliente

GET    /projetos        - List projetos (paginated)
GET    /projetos/:id    - Get projeto
GET    /projetos/meus   - Get meus projetos (cliente)
POST   /projetos        - Create projeto
PATCH  /projetos/:id    - Update projeto
DELETE /projetos/:id    - Delete projeto

GET    /projetos/:id/etapas  - Get etapas by projeto
GET    /etapas/:id           - Get etapa
POST   /etapas               - Create etapa
PATCH  /etapas/:id           - Update etapa
DELETE /etapas/:id           - Delete etapa
```

## Status do Projeto

### ✅ Completo
- Setup inicial do projeto
- Configurações (TS, Tailwind, Next.js)
- Types e enums
- API clients
- Zustand store
- Componentes UI (shadcn)
- Estilos globais
- Middleware de rotas

### 🚧 Em Andamento
- Hooks TanStack Query
- Componentes de negócio
- Páginas do app
- NextAuth configuration

### ⏳ Pendente
- Dashboard com gráficos
- Upload de arquivos
- Testes unitários
- Documentação de componentes

---

**Desenvolvido com Next.js 15 + TypeScript + Tailwind + shadcn/ui**

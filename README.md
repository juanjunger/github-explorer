# GitHub Explorer

Aplicação React + TypeScript que permite buscar usuários do GitHub, visualizar seus dados e explorar seus repositórios.

## Stack

- React 18 + TypeScript (strict)
- Vite 6
- React Router v6
- Axios + Bootstrap 5
- Vitest + React Testing Library + MSW
- ESLint (flat config) + Prettier
- Husky + Commitlint (Conventional Commits)

## Pré-requisitos

- Node 20+ (use `.nvmrc`: `nvm use`)
- pnpm 9+

## Setup

```bash
pnpm install
cp .env.example .env
```

## Rodando localmente

```bash
pnpm dev
```

Aplicação disponível em `http://localhost:5173`.

## Scripts

| Comando              | Descrição                            |
| -------------------- | ------------------------------------ |
| `pnpm dev`           | Servidor de desenvolvimento em :5173 |
| `pnpm build`         | Type-check + build de produção       |
| `pnpm preview`       | Serve o build local                  |
| `pnpm lint`          | Roda ESLint                          |
| `pnpm lint:fix`      | Aplica fixes do ESLint               |
| `pnpm format`        | Formata todo o código com Prettier   |
| `pnpm type-check`    | `tsc --noEmit`                       |
| `pnpm test`          | Vitest em modo watch                 |
| `pnpm test:run`      | Vitest single-pass                   |
| `pnpm test:coverage` | Cobertura via v8                     |

## Estrutura

```
src/
├── components/    Componentes React reutilizáveis
├── pages/         Páginas (Home, User, RepositoryDetails)
├── hooks/         Custom hooks (lógica React)
├── services/      Chamadas de API e regras de negócio
├── types/         Interfaces TypeScript
├── utils/         Helpers (formatação, validação, erros)
├── routes/        Configuração do React Router
├── styles/        Estilos globais
└── test/          Setup do Vitest + mocks MSW
```

## Convenções de commit

```
feat:     nova funcionalidade
fix:      correção de bug
refactor: refatoração sem mudança de comportamento
perf:     melhoria de performance
test:     adição/ajuste de testes
docs:     documentação
chore:    tarefas auxiliares (deps, build, etc)
style:    formatação
ci:       pipeline
build:    build/dependências
```

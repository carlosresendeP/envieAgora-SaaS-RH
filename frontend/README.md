# ContrataJá — Frontend

Aplicação Next.js para gestão de recrutamento. Inclui painel administrativo para recrutadores, portal público para candidatos e interface de análise de compatibilidade gerada por IA.

---

## Tecnologias

| Pacote             | Versão | Função                                                  |
| ------------------ | ------ | ------------------------------------------------------- |
| Next.js            | 16.x   | Framework React com App Router (SSR/SSG)                |
| React              | 19.x   | Biblioteca de UI                                        |
| TypeScript         | 5.x    | Tipagem estática                                        |
| TailwindCSS        | 4.x    | Estilização utilitária com design tokens OKLCH          |
| Shadcn UI          | —      | Componentes acessíveis baseados em Radix UI             |
| Framer Motion      | 12.x   | Animações declarativas                                  |
| Zustand            | 5.x    | Estado global (sessão do usuário)                       |
| TanStack Query     | 5.x    | Cache, sincronização e invalidação de dados da API      |
| Axios              | 1.x    | Cliente HTTP com interceptors de JWT                    |
| React Hook Form    | 7.x    | Gerenciamento de formulários sem re-renders             |
| Zod                | 3.x    | Validação de schemas integrada ao React Hook Form       |
| Sonner             | 2.x    | Notificações toast                                      |

---

## Pré-requisitos

- Node.js 20 ou superior
- pnpm 9 ou superior
- Backend rodando em `http://localhost:3001`

---

## Instalação

```bash
cd frontend
pnpm install
cp .env.example .env.local
```

Configure o `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## Rodando

```bash
# Desenvolvimento (porta 3000 com hot-reload)
pnpm dev

# Produção
pnpm build && pnpm start
```

---

## Estrutura de diretórios

```
frontend/
├── app/
│   ├── layout.tsx                  # Layout raiz (fontes, providers)
│   ├── page.tsx                    # Landing page
│   ├── (marketing)/                # Grupo de rotas públicas
│   │   ├── login/page.tsx
│   │   └── cadastro/page.tsx
│   ├── (app)/                      # Grupo de rotas protegidas
│   │   ├── dashboard/page.tsx
│   │   ├── vagas/
│   │   │   ├── page.tsx            # Lista de vagas
│   │   │   └── [id]/page.tsx       # Detalhes e candidatos da vaga
│   │   ├── candidatos/page.tsx
│   │   ├── organograma/page.tsx
│   │   ├── chat/page.tsx
│   │   ├── configuracoes/page.tsx
│   │   └── layout.tsx              # Shell com sidebar e header
│   └── teste/[token]/              # Portal público do candidato
│       ├── page.tsx                # Boas-vindas e dados pessoais
│       ├── disc/page.tsx           # Teste DISC
│       ├── eneagrama/page.tsx      # Teste Eneagrama
│       ├── personalidades/page.tsx # Teste 16 Personalidades
│       └── concluido/page.tsx      # Confirmação de envio
├── components/
│   ├── ui/                         # Primitivos Shadcn UI
│   ├── layout/                     # Sidebar, Header, Shell
│   ├── landing/                    # Seções da landing page
│   ├── forms/                      # Formulários com React Hook Form
│   ├── vagas/                      # Cards, modais e pipeline de vagas
│   ├── relatorio/                  # Relatório de match IA
│   ├── organograma/                # Visualização hierárquica
│   ├── chat/                       # Interface do chat com IA
│   ├── testes/                     # UI dos testes psicométricos
│   └── shared/                     # Componentes genéricos reutilizáveis
├── services/                       # Clientes Axios por domínio (auth, vagas, candidatos...)
├── store/
│   └── auth.store.ts               # Sessão do usuário (Zustand)
├── hooks/                          # Custom hooks (useAuth, useDebounce, etc.)
├── lib/
│   ├── api.ts                      # Instância Axios com interceptor JWT
│   ├── utils.ts                    # Utilitários (cn, formatters)
│   └── tokens.ts                   # Leitura/escrita de tokens no localStorage
├── types/
│   └── api.ts                      # Tipos TypeScript dos responses da API
└── public/
    └── rh-saas-prints/             # Capturas de tela do produto
```

---

## Rotas da aplicação

| Rota                     | Acesso    | Descrição                                |
| ------------------------ | --------- | ---------------------------------------- |
| `/`                      | Público   | Landing page                             |
| `/login`                 | Público   | Autenticação de recrutadores             |
| `/cadastro`              | Público   | Registro de nova empresa                 |
| `/dashboard`             | Protegido | Visão geral e métricas                   |
| `/vagas`                 | Protegido | Gestão de vagas                          |
| `/vagas/[id]`            | Protegido | Candidatos e análise de uma vaga         |
| `/candidatos`            | Protegido | Pipeline completo de candidatos          |
| `/organograma`           | Protegido | Hierarquia da empresa                    |
| `/chat`                  | Protegido | Chat interno com IA                      |
| `/configuracoes`         | Protegido | Dados da empresa e preferências          |
| `/teste/[token]`         | Público   | Portal do candidato (via token de vaga)  |

---

## Autenticação

O frontend usa JWT armazenado no `localStorage`. O Axios intercepta automaticamente todas as requisições e injeta o header `Authorization: Bearer <token>`. Rotas protegidas verificam a sessão via Zustand (`useAuth`); usuários não autenticados são redirecionados para `/login`.

---

## Design system

O projeto usa um sistema de tokens baseado em cores OKLCH definidas em `app/globals.css`. As cores principais:

| Token       | Valor            | Uso                         |
| ----------- | ---------------- | --------------------------- |
| `primary`   | Verde neon `#C4FF57` | CTAs, destaques, scores |
| `secondary` | Kraft `#D6B48B`  | Elementos secundários       |
| `accent`    | Azul-cinza       | Indicadores, badges         |
| `background`| Off-white        | Fundo da aplicação          |
| `foreground`| Carvão `#4A5452` | Texto principal             |

Tipografia: **Montserrat** (display e corpo).

---

## Variáveis de ambiente

| Variável              | Obrigatória | Descrição               |
| --------------------- | ----------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Sim         | URL base da API Fastify |

---

## Scripts

| Comando      | Descrição                                     |
| ------------ | --------------------------------------------- |
| `pnpm dev`   | Servidor de desenvolvimento (porta 3000)      |
| `pnpm build` | Build otimizado para produção                 |
| `pnpm start` | Serve o build de produção                     |
| `pnpm lint`  | Verifica o código com ESLint + TypeScript     |

---

**Versão:** 1.0.0

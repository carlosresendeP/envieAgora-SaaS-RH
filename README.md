# ContrataJá

**Plataforma SaaS de recrutamento com Inteligência Artificial** — analisa currículos, calcula compatibilidade comportamental via metodologia DISC e organiza todo o pipeline de seleção em um único painel.

---

## Visão Geral

O ContrataJá é uma plataforma multi-tenant voltada para equipes de RH que precisam escalar processos seletivos com qualidade. A IA lê o currículo do candidato, cruza com os requisitos da vaga e gera um **Score de Alinhamento** — técnico, comportamental e cultural — em segundos.

### Fluxo de recrutamento

```mermaid
graph TD
    A[RH cria a vaga no painel] --> B[Sistema gera link público com token único]
    B --> C[Candidato acessa o link e envia currículo PDF]
    C --> D[IA extrai dados e calcula Score de Alinhamento]
    D --> E[RH visualiza ranking de compatibilidade]
    E --> F[Candidatos aprovados avançam no pipeline]
```

---

## Funcionalidades

### Gestão de Vagas

- Criação manual ou via IA (geração de descrição a partir de um prompt curto)
- Link público com token único por vaga para inscrição sem cadastro
- Pipeline de candidatos com status rastreável

### Inteligência Artificial

- Leitura e extração de dados de currículos em PDF
- Geração de Score de Alinhamento (técnico, cultural e de senioridade)
- Análise narrativa do perfil do candidato versus requisitos da vaga
- Chat interno com IA para suporte ao recrutador

### Portal do Candidato

- Interface pública acessível via token, sem necessidade de conta
- Upload de currículo e preenchimento de dados básicos
- Testes psicométricos integrados (DISC, Eneagrama, 16 Personalidades)

### Gestão Organizacional

- Organograma visual com hierarquias e cargos
- Cadastro de empresas e recrutadores (multi-tenant)
- Envio de e-mails transacionais via Resend

### Segurança

- Autenticação JWT com hash de senhas (bcrypt)
- Validação de payloads com Zod em todas as rotas
- Proteção de headers HTTP com Fastify Helmet

---

## Tecnologias

| Camada    | Stack                                                                             |
| --------- | --------------------------------------------------------------------------------- |
| Frontend  | Next.js 16, React 19, TypeScript, TailwindCSS v4, Shadcn UI, Zustand, TanStack Query |
| Backend   | Fastify 5, TypeScript, Prisma 7, PostgreSQL                                       |
| IA        | Vercel AI SDK (Anthropic Claude / OpenAI GPT)                                     |
| E-mail    | Resend                                                                            |
| Animações | Framer Motion                                                                     |
| Deploy    | Vercel (frontend) + Railway ou Render (backend)                                   |

---

## Pré-requisitos

- Node.js 20 ou superior
- pnpm 9 ou superior (`npm install -g pnpm`)
- PostgreSQL (local ou Supabase)
- Chaves de API: OpenAI **ou** Anthropic, e Resend

---

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/carlosresendeP/contrata-ja.git
cd contrata-ja
```

### 2. Configure o Backend

```bash
cd Backend
pnpm install
cp .env.example .env
```

Preencha o `.env`:

```env
PORT=3001
NODE_ENV=development
DATABASE_URL="postgresql://user:password@host:5432/contrataja"
DIRECT_URL="postgresql://user:password@host:5432/contrataja"
JWT_SECRET="<chave-aleatória-de-no-mínimo-32-caracteres>"
APP_URL=http://localhost:3001/api

ANTHROPIC_API_KEY="sk-ant-..."   # ou OPENAI_API_KEY="sk-..."
RESEND_API_KEY="re_..."
EMAIL_FROM="no-reply@seudominio.com"
```

Execute as migrações:

```bash
npx prisma migrate dev
npx prisma generate
```

### 3. Configure o Frontend

```bash
cd ../frontend
pnpm install
cp .env.example .env.local
```

Preencha o `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## Rodando localmente

Inicie os dois servidores em terminais separados:

```bash
# Terminal 1 — Backend (porta 3001)
cd Backend && pnpm dev

# Terminal 2 — Frontend (porta 3000)
cd frontend && pnpm dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

Para inspecionar o banco de dados visualmente:

```bash
cd Backend && npx prisma studio
# Disponível em http://localhost:5555
```

---

## Estrutura do projeto

```
contrata-ja/
├── Backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Modelagem das entidades
│   │   ├── migrations/            # Histórico SQL
│   │   └── seed.ts                # Dados de demonstração
│   └── src/
│       ├── Ai/                    # Wrappers Anthropic e OpenAI
│       ├── config/                # Variáveis de ambiente e setup
│       ├── controllers/           # Handlers HTTP
│       ├── middleware/            # Autenticação JWT e guards
│       ├── Routes/                # Definição de endpoints
│       ├── schemas/               # Schemas Zod reutilizáveis
│       ├── services/              # Lógica de negócio e queries Prisma
│       ├── app.ts                 # Registro de plugins e rotas
│       └── server.ts              # Entry point
│
└── frontend/
    ├── app/
    │   ├── (marketing)/           # Páginas públicas (login, cadastro)
    │   ├── (app)/                 # Área protegida (dashboard, vagas, etc.)
    │   └── teste/[token]/         # Portal público do candidato
    ├── components/
    │   ├── ui/                    # Componentes Shadcn UI
    │   ├── layout/                # Shell, Sidebar, Header
    │   ├── landing/               # Seções da landing page
    │   ├── vagas/                 # Componentes de gestão de vagas
    │   ├── relatorio/             # Relatório de match do candidato
    │   ├── organograma/           # Visualização do organograma
    │   └── testes/                # UI dos testes psicométricos
    ├── services/                  # Clientes Axios por domínio
    ├── store/                     # Estado global Zustand
    ├── hooks/                     # Custom hooks
    └── types/                     # Tipos TypeScript da API
```

---

## Referência da API

Prefixo base: `/api`

### Autenticação

| Método | Rota             | Descrição                              | Auth |
| ------ | ---------------- | -------------------------------------- | ---- |
| POST   | `/auth/register` | Cria empresa e usuário administrador   | —    |
| POST   | `/auth/login`    | Autentica e retorna JWT                | —    |
| GET    | `/auth/me`       | Retorna dados do usuário autenticado   | JWT  |

### Vagas

| Método | Rota                  | Descrição                              | Auth |
| ------ | --------------------- | -------------------------------------- | ---- |
| GET    | `/vagas`              | Lista vagas da empresa                 | JWT  |
| POST   | `/vagas`              | Cria nova vaga                         | JWT  |
| GET    | `/vagas/:id`          | Detalhes de uma vaga                   | JWT  |
| DELETE | `/vagas/:id`          | Remove uma vaga                        | JWT  |
| POST   | `/vagas/ai/generate`  | Gera descrição de vaga via IA          | JWT  |

### Candidatos

| Método | Rota                          | Descrição                                   | Auth    |
| ------ | ----------------------------- | ------------------------------------------- | ------- |
| GET    | `/candidatos/public-token/:token` | Valida token e retorna dados da vaga    | Público |
| POST   | `/candidatos`                 | Submete candidatura com currículo PDF       | Público |
| GET    | `/candidatos`                 | Lista candidatos da empresa                 | JWT     |
| POST   | `/candidatos/analyze/:id`     | Dispara análise de IA para o candidato      | JWT     |

### Organograma

| Método | Rota                    | Descrição                        | Auth |
| ------ | ----------------------- | -------------------------------- | ---- |
| GET    | `/organograma`          | Retorna hierarquia da empresa    | JWT  |
| POST   | `/organograma`          | Adiciona nó ao organograma       | JWT  |
| PUT    | `/organograma/:id`      | Atualiza nó                      | JWT  |
| DELETE | `/organograma/:id`      | Remove nó                        | JWT  |

---

## Variáveis de ambiente

### Backend (`Backend/.env`)

| Variável            | Obrigatória | Descrição                                         |
| ------------------- | ----------- | ------------------------------------------------- |
| `PORT`              | Sim         | Porta da API (padrão: `3001`)                     |
| `NODE_ENV`          | Sim         | `development` ou `production`                     |
| `DATABASE_URL`      | Sim         | Connection string PostgreSQL (Prisma pooled)      |
| `DIRECT_URL`        | Não         | Connection string direta (necessária no Supabase) |
| `JWT_SECRET`        | Sim         | Chave para assinar tokens (mínimo 32 caracteres)  |
| `APP_URL`           | Sim         | URL base da API                                   |
| `ANTHROPIC_API_KEY` | Condicional | Chave Anthropic (se não usar OpenAI)              |
| `OPENAI_API_KEY`    | Condicional | Chave OpenAI (se não usar Anthropic)              |
| `RESEND_API_KEY`    | Não         | Chave Resend para envio de e-mails                |
| `EMAIL_FROM`        | Não         | Endereço remetente dos e-mails transacionais      |

### Frontend (`frontend/.env.local`)

| Variável              | Obrigatória | Descrição                         |
| --------------------- | ----------- | --------------------------------- |
| `NEXT_PUBLIC_API_URL` | Sim         | URL base da API Fastify           |

---

## Deploy

### Frontend — Vercel

1. Importe o repositório na [Vercel](https://vercel.com) e defina o **Root Directory** como `frontend`.
2. Configure a variável `NEXT_PUBLIC_API_URL` apontando para a URL do backend em produção.
3. Deploy automático em cada push para `main`.

### Backend — Railway / Render

1. Conecte o repositório e defina o **Root Directory** como `Backend`.
2. Configure todas as variáveis de ambiente no painel da plataforma.
3. Comando de build: `pnpm build`
4. Comando de start: `pnpm start`
5. Execute as migrações no primeiro deploy: `npx prisma migrate deploy`

---

## Scripts

### Backend

| Comando       | Descrição                                      |
| ------------- | ---------------------------------------------- |
| `pnpm dev`    | API em modo desenvolvimento com hot-reload     |
| `pnpm build`  | Compila TypeScript para `dist/`                |
| `pnpm start`  | Executa o build de produção                    |

### Frontend

| Comando       | Descrição                                      |
| ------------- | ---------------------------------------------- |
| `pnpm dev`    | Servidor de desenvolvimento (porta 3000)       |
| `pnpm build`  | Build otimizado para produção                  |
| `pnpm start`  | Serve o build de produção                      |
| `pnpm lint`   | Valida o código com ESLint                     |

---

## Screenshots

<details>
<summary>Ver capturas de tela</summary>

| | |
|---|---|
| ![Hero](./frontend/public/rh-saas-prints/1-hero.png) | ![Login](./frontend/public/rh-saas-prints/2-login.png) |
| ![Dashboard](./frontend/public/rh-saas-prints/4-dashboard.png) | ![Vagas](./frontend/public/rh-saas-prints/5-vagas.png) |
| ![Candidatos](./frontend/public/rh-saas-prints/6-candidatos.png) | ![Organograma](./frontend/public/rh-saas-prints/7-organograma.png) |
| ![Chat IA](./frontend/public/rh-saas-prints/8-chat.png) | ![Análise IA](./frontend/public/rh-saas-prints/5-vagas-analise-ia-candidato-gerado.png) |

</details>

---

## Autor

**Carlos Paula** — [GitHub](https://github.com/carlosresendeP)

---

**Versão:** 1.0.0 · **Licença:** MIT

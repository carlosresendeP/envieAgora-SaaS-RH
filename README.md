# 🚀 SaaS-RH | Sistema de Gestão de Recursos Humanos

O **SaaS-RH** é uma plataforma moderna e escalável focada em otimizar os processos de recrutamento e gestão de pessoas (Recursos Humanos). O sistema foi projetado para entregar alta performance, segurança e uma interface premium para recrutadores e candidatos.

## Key Features

- **Gestão de Vagas**: Criação manual ou gerada por Inteligência Artificial (OpenAI/Anthropic).
- **Análise de Candidatos com IA**: O sistema lê currículos, cruza dados com os requisitos da vaga e gera um score de compatibilidade detalhado.
- **Painel de Controle e Organograma**: Visão sistêmica da estrutura organizacional da empresa.
- **Portal de Inscrição**: Interface pública amigável para candidatos submeterem aplicações em tempo real.
- **Comunicação Direta**: Sistema de chat e envio transacional de e-mails via Resend integrados.

---

## 📷 Screenshots

<div align="center" style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
  <img src="./frontend/public/rh-saas-prints/1-hero.png" alt="Hero" style="width: 200px; border-radius: 8px;" />
  <img src="./frontend/public/rh-saas-prints/2-login.png" alt="Login" style="width: 200px; border-radius: 8px;" />
  <img src="./frontend/public/rh-saas-prints/3-register.png" alt="Register" style="width: 200px; border-radius: 8px;" />
  <img src="./frontend/public/rh-saas-prints/4-dashboard-2.png" alt="Dashboard 2" style="width: 200px; border-radius: 8px;" />
  <img src="./frontend/public/rh-saas-prints/4-dashboard.png" alt="Dashboard" style="width: 200px; border-radius: 8px;" />
  <img src="./frontend/public/rh-saas-prints/5-vagas-analise-ia-candidato-gerado.png" alt="Analise IA Candidato Gerado" style="width: 200px; border-radius: 8px;" />
  <img src="./frontend/public/rh-saas-prints/5-vagas-analise-ia-candidato.png" alt="Analise IA Candidato" style="width: 200px; border-radius: 8px;" />
  <img src="./frontend/public/rh-saas-prints/5-vagas-descricao-ia.png" alt="Vagas Descricao IA" style="width: 200px; border-radius: 8px;" />
  <img src="./frontend/public/rh-saas-prints/5-vagas-detalhes.png" alt="Vagas Detalhes" style="width: 200px; border-radius: 8px;" />
  <img src="./frontend/public/rh-saas-prints/5-vagas-novavaga-ia.png" alt="Nova Vaga IA" style="width: 200px; border-radius: 8px;" />
  <img src="./frontend/public/rh-saas-prints/5-vagas-novavaga-manual.png" alt="Nova Vaga Manual" style="width: 200px; border-radius: 8px;" />
  <img src="./frontend/public/rh-saas-prints/5-vagas-novavaga.png" alt="Nova Vaga" style="width: 200px; border-radius: 8px;" />
  <img src="./frontend/public/rh-saas-prints/5-vagas.png" alt="Vagas" style="width: 200px; border-radius: 8px;" />
  <img src="./frontend/public/rh-saas-prints/6-candidatos-detalhados.png" alt="Candidatos Detalhados" style="width: 200px; border-radius: 8px;" />
  <img src="./frontend/public/rh-saas-prints/6-candidatos.png" alt="Candidatos" style="width: 200px; border-radius: 8px;" />
  <img src="./frontend/public/rh-saas-prints/7-organograma.png" alt="Organograma" style="width: 200px; border-radius: 8px;" />
  <img src="./frontend/public/rh-saas-prints/8-chat-conversa.png" alt="Chat Conversa" style="width: 200px; border-radius: 8px;" />
  <img src="./frontend/public/rh-saas-prints/8-chat.png" alt="Chat" style="width: 200px; border-radius: 8px;" />
  <img src="./frontend/public/rh-saas-prints/9-settings.png" alt="Settings" style="width: 200px; border-radius: 8px;" />
</div>

<br />



## Tech Stack

O projeto está dividido em um modelo cliente/servidor desacoplado.

### Backend
- **Language**: TypeScript (Node.js)
- **Framework**: Fastify 5.x
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod & fastify-type-provider-zod
- **AI Integrations**: @ai-sdk/openai, @ai-sdk/anthropic
- **Emails**: Resend
- **Security**: bcryptjs, jsonwebtoken, @fastify/helmet, @fastify/cors

### Frontend
- **Language**: TypeScript
- **Framework**: Next.js 16.2.6 (React 19, App Router)
- **Styling**: Tailwind CSS v4, tw-animate-css
- **UI Components**: Radix UI + Shadcn UI
- **State Management**: Zustand & TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **HTTP Client**: Axios

---

## Prerequisites

Antes de iniciar, certifique-se de que sua máquina atende aos seguintes requisitos:

- **Node.js**: v20 ou superior.
- **Gerenciador de Pacotes**: `npm` ou `pnpm` (o projeto usa `pnpm` preferencialmente pelos arquivos `.yaml` em repositórios Next, mas os scripts de package usam o padrão `npm`).
- **Banco de Dados**: Instância do PostgreSQL 15+ rodando localmente (via Docker) ou na nuvem (Supabase, Neon, etc.).
- **Chaves de API (Opcionais para dev básico, essenciais para recursos completos)**: OpenAI, Anthropic, Resend.

---

## Getting Started

Siga as instruções para configurar ambos os ambientes na sua máquina local de forma separada.

### 1. Clonar o Repositório

```bash
git clone https://github.com/carlosresendeP/SaaS-Rh-Gest-o.git
cd SaaS-Rh-Gest-o
```

### 2. Configurar e Iniciar o Backend

Abra um terminal e acesse a pasta do Backend:

```bash
cd Backend
npm install
```

Copie o arquivo de exemplo de variáveis de ambiente:

```bash
cp .env.example .env
```

Abra o arquivo `.env` e preencha as variáveis de ambiente necessárias (veja a seção [Environment Variables](#environment-variables)).

Gere as tipagens do Prisma e rode as migrações para criar as tabelas no banco de dados (o banco já deve estar rodando e configurado na variável `DATABASE_URL`):

```bash
npx prisma generate
npx prisma migrate dev
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```
O servidor estará escutando na porta `3001` (ou a configurada no `.env`).

### 3. Configurar e Iniciar o Frontend

Em um novo terminal, volte para a raiz e entre na pasta do Frontend:

```bash
cd frontend
npm install
```

Copie o arquivo de exemplo de variáveis de ambiente:

```bash
cp .env.example .env.local
```

Verifique no `.env.local` se a URL aponta para a porta correta do seu backend local (por padrão, `http://localhost:3001/api`).

Inicie o servidor de desenvolvimento do Next.js:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para acessar a aplicação.

---

## Architecture

O projeto adota uma arquitetura em duas camadas (Frontend SPA/SSR e Backend RESTful), separadas fisicamente mas logicamente conectadas.

### Directory Structure

```text
SaaS-Rh-Gest-o/
├── Backend/
│   ├── prisma/             # Schema do banco de dados (schema.prisma) e migrações
│   ├── src/
│   │   ├── Ai/             # Serviços e abstrações para chamadas de Inteligência Artificial
│   │   ├── config/         # Configurações globais e carregamento de env vars
│   │   ├── controllers/    # Camada de controle (recebe a requisição, invoca serviços e devolve respostas)
│   │   ├── middleware/     # Middlewares do Fastify (Autenticação, Hooks de segurança)
│   │   ├── Routes/         # Definições de rotas agrupadas com seus schemas de validação
│   │   ├── schemas/        # Objetos Zod reutilizáveis para tipagem e validação da API
│   │   ├── services/       # Regras de negócio complexas e acesso ao repositório de dados
│   │   ├── app.ts          # Configuração e inicialização da instância do Fastify
│   │   └── server.ts       # Entry point principal (Listen)
│   ├── uploads/            # Armazenamento local de arquivos e currículos temporários
│   └── package.json
│
└── frontend/
    ├── app/                # Next.js App Router (Páginas, Layouts, API Routes)
    ├── components/         # Componentes React reutilizáveis (inclui Shadcn UI isolados)
    ├── hooks/              # Hooks customizados (lógicas isoladas, observers)
    ├── lib/                # Funções de utilidade e formatação (utils.ts) e validações Zod
    ├── public/             # Assets estáticos (imagens, ícones)
    ├── services/           # Abstração de chamadas API usando Axios interceptors
    ├── store/              # Gerenciadores de estado usando Zustand
    └── package.json
```

### Request Lifecycle (Exemplo: Criação de Candidato)

1. O usuário preenche o formulário no Client (React).
2. O **React Hook Form** junto com o **Zod** validam se todos os dados inseridos (Nome, Email, Arquivo PDF) cumprem o padrão exigido antes mesmo do submit.
3. Após aprovação, a mutation do **TanStack Query** aciona o serviço do Axios (`/services`), injetando os cabeçalhos necessários.
4. A requisição HTTP chega ao **Backend (Fastify)**. A rota capta a requisição e valida *novamente* com o `fastify-type-provider-zod`.
5. O `Controller` de candidatos envia a carga útil para o `Service`.
6. O `Service` executa a IA (em paralelo se configurada para análise imediata) via `@ai-sdk` e processa no `Prisma`.
7. O `Prisma` insere a tupla no **PostgreSQL**.
8. O `Controller` retorna a resposta HTTP `201 Created` para o frontend.
9. A UI de sucesso é renderizada para o candidato.

---

## Environment Variables

### Backend (`Backend/.env`)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `PORT` | Porta onde a API rodará. | `3001` |
| `NODE_ENV` | Modo de ambiente. | `dev` ou `production` |
| `DATABASE_URL` | String de conexão do PostgreSQL. | `"your Key"` (ex: `postgresql://user:pass@localhost:5432/db`) |
| `JWT_SECRET` | Chave de assinatura para tokens de autenticação. | `"your Key"` |
| `APP_URL` | URL base do app. | `http://localhost:3001/api` |
| `OPENAI_API_KEY` | Chave de integração para serviços da OpenAI. | `"your Key"` |
| `RESEND_API_KEY` | Chave para envios de emails transacionais. | `"your Key"` |
| `EMAIL_FROM` | Endereço do remetente autenticado no Resend. | `onboarding@resend.dev` |

### Frontend (`frontend/.env.local`)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `NEXT_PUBLIC_API_URL` | URL base para comunicação com o Backend. | `http://localhost:3001/api` |

> *Dica: Qualquer variável de ambiente no Next.js que precise estar acessível no Client-Side Component (navegador) deve obrigatoriamente começar com `NEXT_PUBLIC_`.*

---

## Available Scripts

### Backend (`/Backend`)

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Roda o servidor usando o `tsx` no modo "watch" (hot-reload). |
| `npm run build` | Transpila o código TypeScript para JavaScript (CJS) gerando a pasta `dist`. |
| `npm run start` | Inicia o código transpilado a partir da pasta `dist`. |
| `npx prisma studio`| Abre uma interface visual no navegador para inspecionar os dados no Banco. |

### Frontend (`/frontend`)

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento Next.js com Fast Refresh. |
| `npm run build` | Cria um build otimizado da aplicação para produção. |
| `npm run start` | Inicializa o servidor Node.js otimizado de produção criado pelo build. |
| `npm run lint` | Roda o ESLint para encontrar e corrigir problemas na base de código. |

---

## Testing

*(A infraestrutura de testes automatizados E2E e unitários poderá ser incluída utilizando Jest / Supertest no Backend e Playwright no Frontend nas próximas fases).*

---

## Deployment

### Deploy do Backend (Docker / VPS / Railway / Render)

Dado que o backend utiliza Node.js, ele pode ser hospedado em plataformas de container ou PaaS de maneira direta.

**Compilando e Rodando em Produção:**
```bash
npm run build
npm run start
```
**Atenção:** Em ambiente de produção real, certifique-se de configurar e injetar as chaves `OPENAI_API_KEY`, `RESEND_API_KEY` e `JWT_SECRET` através do painel da nuvem provedora, e **nunca comite o arquivo `.env`**.

### Deploy do Frontend (Vercel)

A plataforma mais otimizada e recomendada para Next.js é a **Vercel**.

1. Conecte este repositório do Github à sua conta Vercel.
2. Na configuração do projeto da Vercel, defina **Root Directory** como `frontend`.
3. Configure a variável `NEXT_PUBLIC_API_URL` apontando para o seu backend já publicado na nuvem (ex: `https://api.meudominio.com/api`).
4. Clique em "Deploy".

---

## Troubleshooting

### Problemas Comuns de Banco de Dados

**Erro:** `PrismaClientInitializationError: Can't reach database server` no Backend.
**Solução:** 
1. Verifique se o seu servidor PostgreSQL está ligado (Docker Container ou serviço local rodando).
2. Assegure-se de que a `DATABASE_URL` no arquivo `.env` do Backend contém as credenciais (`usuário`, `senha`, `porta`) exatas do seu banco de dados.

### Erro de Conexão Frontend <-> Backend

**Erro:** `AxiosError: Network Error` ao tentar fazer login ou acessar uma página no Frontend.
**Solução:**
O frontend não está conseguindo alcançar a API do backend. 
1. Verifique se você rodou `npm run dev` na pasta `Backend` e o servidor inciou na porta `3001` corretamente.
2. Verifique se a porta `3001` não está sendo usada por outra aplicação.
3. Verifique se o `NEXT_PUBLIC_API_URL` no seu arquivo `frontend/.env.local` aponta para `http://localhost:3001/api`.

### Erros de Build

**Erro:** `Type error: Property 'X' does not exist on type 'Y'` durante o build no Next.js.
**Solução:**
O Next.js é extremamente estrito com tipagens. Rode `npx tsc --noEmit` localmente dentro da pasta `frontend/` para encontrar todas as inconsistências de TypeScript que estão impedindo o build e corrija-as.

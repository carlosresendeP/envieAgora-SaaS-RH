# ⚙️ SaaS-RH | Backend API

<div style="max-width: 200px;">
  <img src="../frontend/public/rh-saas-prints/5-vagas-analise-ia-candidato-gerado.png" alt="Análise IA pelo Backend" style="width: 100%; border-radius: 8px;" />
</div>

<br />

Bem-vindo à documentação do **Backend** do projeto SaaS-RH. Este serviço é uma API RESTful de altíssima performance, desenvolvida em Node.js. Ele é o coração do sistema, lidando com a lógica de recrutamento, gestão de candidatos, integrações com Inteligência Artificial e segurança de dados.

## 🛠 Tecnologias e Ferramentas

- **[Fastify](https://fastify.dev/)**: Framework web extremamente rápido e de baixo overhead para Node.js.
- **[Prisma ORM](https://www.prisma.io/)**: Ferramenta de mapeamento objeto-relacional para modelagem do banco e tipagem segura.
- **[PostgreSQL](https://www.postgresql.org/)**: Banco de dados relacional robusto.
- **[Zod](https://zod.dev/)**: Validação e declaração de esquemas fortemente tipados (integrado com o Fastify Type Provider).
- **[AI SDK](https://sdk.vercel.ai/)**: Integrações com OpenAI e Anthropic para análise de currículos e perfis.
- **[Resend](https://resend.com/)**: Serviço transacional para envio de e-mails (como confirmações e alertas).
- **Segurança**: `@fastify/helmet`, `@fastify/cors`, `bcryptjs` (hash de senhas), e `jsonwebtoken` (autenticação JWT).

---

## 🧩 Como o Backend Funciona (Fluxo da Arquitetura)

O nosso backend segue um padrão arquitetural baseado em rotas, controladores e serviços (embora otimizado para o ecossistema do Fastify):

1. **Roteamento e Validação**: Quando uma requisição chega, ela é recebida por uma rota no Fastify. Usando o `fastify-type-provider-zod`, garantimos que o `body`, `query`, e `params` sejam validados **automaticamente** contra um esquema Zod antes de chegar ao controlador.
2. **Autenticação**: Rotas privadas exigem um token JWT válido enviado via cabeçalho `Authorization`.
3. **Lógica de Negócios**: O processamento principal ocorre. Para operações de banco de dados, usamos o `Prisma Client` para interagir com o PostgreSQL.
4. **Integrações (IA e E-mail)**: Para ações como leitura automática de currículos, a rota se comunica com o `@ai-sdk/openai`. Para notificar candidatos, enviamos mensagens via `Resend`.

---

## 🚀 Configuração e Instalação

### 1. Instalação de Dependências
Navegue até a pasta `Backend` e instale os pacotes:

```bash
cd Backend
npm install
```

### 2. Variáveis de Ambiente (`.env`)
Crie um arquivo `.env` na raiz da pasta `Backend`. Use o modelo abaixo, substituindo pelos seus valores de ambiente local ou chaves de serviço:

```env
# Exemplo do arquivo .env
NODE_ENV="development"
PORT="3333"

# URL de Conexão com o Banco de Dados (PostgreSQL)
DATABASE_URL="your Key"

# Chave secreta para assinatura dos JWT
JWT_SECRET="your Key"

# Chaves de integrações externas
RESEND_API_KEY="your Key"
OPENAI_API_KEY="your Key"
ANTHROPIC_API_KEY="your Key"
```

### 3. Configuração do Banco de Dados
Para criar as tabelas no banco de dados e gerar o Prisma Client:

```bash
npx prisma migrate dev
```

*(Para visualizar seus dados localmente, você pode usar o comando `npx prisma studio`)*

### 4. Rodando o Servidor
Para iniciar a API em modo de desenvolvimento (com hot-reload configurado via `tsx`):

```bash
npm run dev
```

O servidor iniciará, por padrão, em `http://localhost:3333`.

---

## 🏗 Scripts Disponíveis

No arquivo `package.json`, configuramos os seguintes atalhos:
- `npm run dev`: Inicia o servidor em modo watch (desenvolvimento).
- `npm run build`: Compila o código TypeScript para JavaScript (formato CJS) na pasta `dist/` usando o `tsup`.
- `npm run start`: Inicia o servidor compilado para uso em produção.

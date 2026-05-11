# 🎨 SaaS-RH | Frontend Application

<div style="max-width: 200px;">
  <img src="./public/rh-saas-prints/4-dashboard-2.png" alt="Frontend UI Interface Dashboard" style="width: 100%; border-radius: 8px;" />
</div>

<br />

Bem-vindo à documentação do **Frontend** do projeto SaaS-RH. Construído com as tecnologias mais modernas e focadas em performance no ecossistema React, o frontend oferece a interface para recrutadores gerenciarem vagas e candidatos enviarem suas aplicações de forma simples e agradável.

## 🛠 Tecnologias e Ferramentas Principais

- **[Next.js (v16+)](https://nextjs.org/)**: Framework React principal, utilizando o paradigma do App Router, garantindo excelente SEO e Server-Side Rendering (SSR).
- **[Tailwind CSS (v4)](https://tailwindcss.com/)**: Framework utilitário de CSS para estilizações responsivas, rápidas e consistentes diretamente no HTML.
- **[Shadcn UI](https://ui.shadcn.com/)**: Coleção de componentes UI lindamente desenhados e acessíveis baseados no Radix UI. Não é uma biblioteca imposta, e sim componentes cujo código reside dentro do próprio repositório para total customização.
- **[React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)**: A combinação perfeita para formulários. O React Hook Form garante formulários performáticos e o Zod (`@hookform/resolvers`) garante uma validação tipada e segura antes de submeter os dados ao backend.
- **[TanStack Query (React Query)](https://tanstack.com/query/latest)**: Para gerenciamento assíncrono de estado. Responsável por fazer o fetch de dados da nossa API (usando `Axios`), guardar em cache e lidar com estados de loading e erro.
- **[Zustand](https://zustand-demo.pmnd.rs/)**: Gerenciador de estado global minimalista, usado para armazenar informações globais do sistema sem a complexidade do Redux ou Context API pesadas.
- **[Lucide React](https://lucide.dev/)**: Pacote de ícones SVG limpos e minimalistas.
- **[Sonner](https://sonner.emilkowal.ski/)**: Sistema robusto de toast notifications.

---

## 🧩 Como o Frontend Funciona (Arquitetura e Fluxo)

1. **Roteamento (App Router)**: A estrutura de páginas fica dentro do diretório `app/`. O Next.js trata automaticamente cada pasta e arquivo `page.tsx` como uma rota de acesso.
2. **Componentização (`components/`)**: Toda a lógica de UI reaproveitável está separada aqui. Os componentes primitivos (botões, inputs) instalados via Shadcn UI ficam organizados, mantendo o código modular.
3. **Gerenciamento de Dados Assíncronos**: Ao invés de usar `useEffect` para buscar informações, utilizamos hooks do `React Query`. Isso automatiza lógicas de *retry*, cacheamento e refetch.
4. **Submissão de Formulários**: Todos os formulários capturam eventos do usuário, passam pelo crivo rigoroso do `Zod` (definido dentro de pastas como `lib/validations/`) e, em caso de sucesso, chamam a API através de serviços isolados.
5. **Theming**: Suporte nativo e robusto para Dark/Light mode com `next-themes` integrado ao Tailwind.

---

## 🚀 Configuração e Instalação

### 1. Instalação de Dependências
Navegue até a pasta `frontend` e instale os pacotes:

```bash
cd frontend
npm install
```

### 2. Variáveis de Ambiente (`.env.local`)
Crie um arquivo `.env.local` na raiz da pasta `frontend`. Insira os caminhos para comunicar-se com a sua API e configurações do sistema.

```env
# Exemplo do arquivo .env.local

# URL base do Backend API
NEXT_PUBLIC_API_URL="your Key"

# Outras variáveis públicas necessárias
NEXT_PUBLIC_SITE_URL="your Key"
```
> **Aviso:** Variáveis expostas ao browser no Next.js devem iniciar com `NEXT_PUBLIC_`.

### 3. Rodando o Ambiente de Desenvolvimento
Para iniciar a aplicação frontend na sua máquina:

```bash
npm run dev
```

O projeto estará disponível por padrão em `http://localhost:3000`. Acesse as rotas no navegador e acompanhe o log em tempo real no terminal para eventuais avisos de lint ou build.

---

## 🏗 Scripts Disponíveis

Os atalhos configurados no `package.json` são os padrões do Next.js:
- `npm run dev`: Roda o ambiente de desenvolvimento.
- `npm run build`: Compila a aplicação gerando os bundles otimizados para produção.
- `npm run start`: Inicia a versão de produção (requer que você tenha rodado o build antes).
- `npm run lint`: Inicia o analisador de código ESLint para buscar más práticas ou erros de digitação de código.

# Fluxo para testar Applications

Para `GET /api/applications/company` retornar dados, siga esta ordem:

---

## 1. Registrar e fazer login

**POST** `/api/register` → cria empresa + usuário
**POST** `/api/login` → copie o `token` da resposta

---

## 2. Criar uma vaga

**POST** `/api/jobs` — requer Bearer token
```json
{
  "titulo": "Desenvolvedor Full Stack",
  "descricao": "Descrição da vaga",
  "requisitos": "Node.js, React",
  "salaryMin": 5000,
  "salaryMax": 8000,
  "status": "ABERTA"
}
```
> Copie o `id` da vaga retornada. A vaga **precisa estar com status `ABERTA`**.

---

## 3. Candidato se inscrever

**POST** `/api/applications/apply` — sem token (rota pública)
```json
{
  "jobId": "<id da vaga>",
  "nome": "João Candidato",
  "email": "joao@email.com",
  "telefone": "11999999999",
  "curriculoUrl": "https://linkedin.com/in/joao"
}
```

---

## 4. Verificar candidaturas

**GET** `/api/applications/company` — requer Bearer token

Agora retorna a lista com os candidatos inscritos.


# O Organograma serve para a empresa mapear sua estrutura hierárquica — quem está em qual posição, quem responde a quem.


1. Criar o nó raiz (CEO):

POST /api/organograma

```
{
"nome": "Carlos Silva",
"cargo": "CEO",
"parentId": null
}
```

2. Criar um nó filho (Diretor de TI) e conectar ao CEO:

POST /api/organograma

{
"nome": "Ana Lima",
"cargo": "Diretor de TI",
"parentId": "<id do Carlos Silva>"
}



teste em outro md

## 5. IA 

1. Gerar Job Description:


POST http://localhost:3001/api/ai/jobs/:id/generate-jd
Authorization: Bearer <token>
(sem body)
2. Fazer o match candidato × vaga:


POST http://localhost:3001/api/ai/jobs/:id/match
Authorization: Bearer <token>

{
  "candidateId": "<id do candidato>"
}
O candidateId vem da listagem GET /api/applications/company — campo candidate.id.
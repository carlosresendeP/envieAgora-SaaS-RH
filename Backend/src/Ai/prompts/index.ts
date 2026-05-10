export const prompts = {
  jd: (title: string, requirements: string) => `
    Atue como um recrutador Tech senior. Escreva uma descrição de vaga (Job Description) profissional para o cargo: ${title}.
    Considere estes requisitos: ${requirements}.
    A saída deve ter: Resumo, Responsabilidades, Requisitos (Hard/Soft Skills) e Diferenciais.
  `,

  match: (jobData: string, candidateData: string, companyContext: string) => `
Você é um especialista em RH e psicologia organizacional. Analise a compatibilidade entre a vaga, o candidato e o contexto da empresa.

EMPRESA (contexto cultural):
${companyContext}

VAGA:
${jobData}

CANDIDATO:
${candidateData}

Retorne SOMENTE um objeto JSON válido, sem texto extra, com exatamente esta estrutura:
{
  "matchScore": <número de 0 a 100>,
  "resumoExecutivo": "<parágrafo curto explicando o fit geral>",
  "pontosFortes": [
    { "titulo": "<nome>", "descricao": "<detalhe>", "impactoNaFuncao": "<como isso ajuda na função>" }
  ],
  "pontosAtencao": [
    { "titulo": "<nome>", "descricao": "<detalhe>", "sugestaoDeDesenvolvimento": "<como desenvolver>" }
  ],
  "comoLiderarEsseCandidato": {
    "delegacao": "<orientação>",
    "feedback": "<orientação>",
    "motivacao": "<orientação>"
  },
  "matchComCultura": {
    "onde": "<onde o candidato se alinha com a cultura>",
    "fricaoEsperada": "<onde pode haver atrito>"
  },
  "perguntasComplementares": ["<pergunta 1>", "<pergunta 2>", "<pergunta 3>"],
  "desafioPratico": {
    "titulo": "<nome do desafio>",
    "descricao": "<descrição detalhada>",
    "duracaoEstimada": "<ex: 3 horas>",
    "habilidadesAvaliadas": ["<habilidade 1>", "<habilidade 2>"]
  },
  "planoDevelopment": {
    "livros": [
      { "titulo": "<título do livro>", "motivo": "<por que é relevante para este candidato>" }
    ],
    "cursos": [
      { "nome": "<nome do curso>", "plataforma": "<ex: Coursera, Udemy>", "motivo": "<por que é relevante>" }
    ],
    "evolucaoSalarial": "<projeção de evolução salarial em 12-24 meses com este plano de desenvolvimento>"
  }
}
  `,

  perfilIdeal: (jobData: string, companyContext: string) => `
Você é um especialista em recrutamento e psicologia organizacional. Com base na vaga e no contexto da empresa, gere:
1. Perguntas de triagem para o processo seletivo
2. O perfil psicométrico ideal para este cargo

EMPRESA:
${companyContext}

VAGA:
${jobData}

Retorne SOMENTE um objeto JSON válido, sem texto extra, com exatamente esta estrutura:
{
  "perguntasTriagem": [
    "<pergunta de triagem 1>",
    "<pergunta de triagem 2>",
    "<pergunta de triagem 3>",
    "<pergunta de triagem 4>",
    "<pergunta de triagem 5>"
  ],
  "perfilPsicometricoIdeal": {
    "disc": "<perfil DISC ideal, ex: D - Dominância com traços de C>",
    "eneagrama": "<tipo de eneagrama ideal, ex: Tipo 3 - Realizador>",
    "tracosPrincipais": ["<traço 1>", "<traço 2>", "<traço 3>"]
  }
}
  `,

  chat: (context: string) => `
    Você é um assistente especializado em RH e recrutamento. 
    Contexto atual da conversa: ${context}
  `
};
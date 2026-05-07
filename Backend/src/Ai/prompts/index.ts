export const prompts = {
  jd: (title: string, requirements: string) => `
    Atue como um recrutador Tech senior. Escreva uma descrição de vaga (Job Description) profissional para o cargo: ${title}.
    Considere estes requisitos: ${requirements}.
    A saída deve ter: Resumo, Responsabilidades, Requisitos (Hard/Soft Skills) e Diferenciais.
  `,

  match: (jobData: string, candidateData: string) => `
    Analise a compatibilidade entre a vaga e o candidato abaixo.
    Vaga: ${jobData}
    Candidato: ${candidateData}
    Retorne um JSON com: "score" (0 a 100), "justificativa" (curta), "pontos_fortes" (array) e "pontos_de_atencao" (array).
  `,

  chat: (context: string) => `
    Você é um assistente especializado em RH e recrutamento. 
    Contexto atual da conversa: ${context}
  `
};
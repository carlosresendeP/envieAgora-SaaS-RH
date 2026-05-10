import { Resend } from 'resend';
import { env } from '../config/env';

const resend = new Resend(env.RESEND_API_KEY);

const base = `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
`

export const emailService = {
  async sendTestLink(params: {
    to: string
    candidateName: string
    jobTitle: string
    testUrl: string
    expiresAt: string
  }) {
    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: [params.to],
      subject: `Você foi convidado para um teste — ${params.jobTitle}`,
      html: `${base}
        <h2>Olá, ${params.candidateName}!</h2>
        <p>Você foi selecionado para realizar um teste psicométrico referente à vaga <strong>${params.jobTitle}</strong>.</p>
        <p>Clique no botão abaixo para acessar o teste:</p>
        <a href="${params.testUrl}" style="
          display: inline-block;
          background-color: #4F46E5;
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
          margin: 16px 0;
        ">Acessar Teste</a>
        <p style="color: #6B7280; font-size: 14px;">
          Este link expira em <strong>${params.expiresAt}</strong>.<br/>
          Se você não se candidatou a esta vaga, ignore este e-mail.
        </p>
      </div>`,
    });
  },

  async sendNewApplication(params: {
    to: string
    candidateName: string
    candidateEmail: string
    jobTitle: string
  }) {
    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: [params.to],
      subject: `Nova candidatura — ${params.candidateName} para ${params.jobTitle}`,
      html: `${base}
        <h2>Nova candidatura recebida</h2>
        <p><strong>${params.candidateName}</strong> (${params.candidateEmail}) se inscreveu na vaga <strong>${params.jobTitle}</strong>.</p>
        <p style="color: #6B7280; font-size: 14px;">Acesse o painel para visualizar o perfil completo do candidato.</p>
      </div>`,
    });
  },

  async sendTeamInvite(params: {
    to: string
    companyName: string
  }) {
    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: [params.to],
      subject: `${params.companyName} te convidou para o mapeamento comportamental`,
      html: `${base}
        <h2>Convite de mapeamento comportamental</h2>
        <p>A empresa <strong>${params.companyName}</strong> te convidou para fazer parte do mapeamento comportamental da equipe.</p>
        <p>Em breve você receberá um link para responder o questionário. O processo leva cerca de <strong>30 minutos</strong> e não há respostas certas ou erradas.</p>
        <p style="color: #6B7280; font-size: 14px;">Este mapeamento é utilizado para melhorar a dinâmica da equipe e potencializar futuros processos seletivos.</p>
      </div>`,
    });
  },

  async sendCandidateResults(params: {
    to: string
    candidateName: string
    jobTitle: string
    disc:   { dominance: number; influence: number; steadiness: number; conscientiousness: number; primary: string } | null
    eneagrama:   { primaryType: number } | null
    personalities: { type: string } | null
  }) {
    const discDescriptions: Record<string, string> = {
      dominance:        "Dominância (D) — orientado a resultados e desafios",
      influence:        "Influência (I) — comunicativo e entusiasta",
      steadiness:       "Estabilidade (S) — colaborativo e consistente",
      conscientiousness:"Conformidade (C) — analítico e preciso",
    }

    const discRows = params.disc
      ? `
        <table style="width:100%;border-collapse:collapse;margin:8px 0;">
          ${[
            ["D", params.disc.dominance],
            ["I", params.disc.influence],
            ["S", params.disc.steadiness],
            ["C", params.disc.conscientiousness],
          ].map(([label, val]) => `
            <tr>
              <td style="width:20px;font-weight:bold;color:#4F46E5;padding:3px 6px 3px 0;">${label}</td>
              <td style="padding:3px 0;">
                <div style="background:#E5E7EB;border-radius:4px;height:10px;overflow:hidden;">
                  <div style="background:#4F46E5;height:10px;width:${val}%;border-radius:4px;"></div>
                </div>
              </td>
              <td style="width:35px;text-align:right;font-size:12px;color:#6B7280;padding:3px 0 3px 6px;">${val}%</td>
            </tr>
          `).join("")}
        </table>
        <p style="font-size:13px;color:#374151;">Perfil dominante: <strong>${discDescriptions[params.disc.primary] ?? params.disc.primary}</strong></p>
      `
      : "<p style='color:#6B7280;'>DISC não realizado.</p>"

    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: [params.to],
      subject: `Seus resultados psicométricos — ${params.jobTitle}`,
      html: `${base}
        <h2>Olá, ${params.candidateName}!</h2>
        <p>Você concluiu os testes psicométricos para a vaga <strong>${params.jobTitle}</strong>. Veja abaixo um resumo do seu perfil comportamental:</p>

        <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:20px;margin:16px 0;">
          <h3 style="margin:0 0 12px;font-size:15px;color:#111827;">DISC</h3>
          ${discRows}
        </div>

        ${params.eneagrama ? `
        <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:20px;margin:16px 0;">
          <h3 style="margin:0 0 8px;font-size:15px;color:#111827;">Eneagrama</h3>
          <p style="font-size:28px;font-weight:bold;color:#4F46E5;margin:0;">${params.eneagrama.primaryType}</p>
          <p style="font-size:13px;color:#6B7280;margin:4px 0 0;">Tipo ${params.eneagrama.primaryType}</p>
        </div>
        ` : ""}

        ${params.personalities ? `
        <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:20px;margin:16px 0;">
          <h3 style="margin:0 0 8px;font-size:15px;color:#111827;">16 Personalidades</h3>
          <p style="font-size:28px;font-weight:bold;color:#4F46E5;margin:0;">${params.personalities.type}</p>
        </div>
        ` : ""}

        <p style="color:#6B7280;font-size:13px;margin-top:24px;">
          A equipe de RH irá analisar seu perfil e entrará em contato com os próximos passos.<br/>
          Este e-mail foi gerado automaticamente — não é necessário responder.
        </p>
      </div>`,
    });
  },

  async sendTestCompleted(params: {
    to: string
    candidateName: string
    jobTitle: string
  }) {
    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: [params.to],
      subject: `${params.candidateName} concluiu os testes — ${params.jobTitle}`,
      html: `${base}
        <h2>Testes psicométricos concluídos</h2>
        <p><strong>${params.candidateName}</strong> finalizou os testes para a vaga <strong>${params.jobTitle}</strong>.</p>
        <p style="color: #6B7280; font-size: 14px;">Acesse o painel para ver o relatório completo e a análise de fit.</p>
      </div>`,
    });
  },
};

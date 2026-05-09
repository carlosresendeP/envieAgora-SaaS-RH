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

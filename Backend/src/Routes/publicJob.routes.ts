import type { FastifyInstance } from "fastify"
import path from "path"
import fs from "fs"
import { randomUUID } from "crypto"
import { prisma } from "@/config/prisma"
import { AppError } from "@/config/error"

export async function publicJobRoutes(app: FastifyInstance) {
  // GET /api/public/jobs/:publicToken — sem autenticação
  app.get<{ Params: { publicToken: string } }>("/:publicToken", async (req, reply) => {
    const { publicToken } = req.params

    const job = await prisma.job.findUnique({
      where: { publicToken },
      select: {
        id: true,
        titulo: true,
        descricao: true,
        jdGerada: true,
        requisitos: true,
        salaryMin: true,
        salaryMax: true,
        status: true,
        company: {
          select: {
            nome: true,
            razaoSocial: true,
            logoUrl: true,
          },
        },
      },
    })

    if (!job) throw new AppError("Vaga não encontrada ou link inválido.", 404)
    if (job.status === "FECHADA")
      throw new AppError("Esta vaga foi encerrada e não está mais aceitando candidaturas.", 410)

    // Retorna a vaga com o status — o frontend mostra aviso se PAUSADA
    return reply.send({ ok: true, data: job })
  })
}

export async function uploadRoutes(app: FastifyInstance) {
  // POST /api/public/upload — upload de currículo PDF (sem auth)
  app.post("/upload", async (req, reply) => {
    const file = await req.file()
    if (!file) throw new AppError("Nenhum arquivo enviado.", 400)

    if (file.mimetype !== "application/pdf") {
      throw new AppError("Apenas arquivos PDF são aceitos.", 400)
    }

    const uploadsDir = path.join(process.cwd(), "uploads")
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

    const filename = `${randomUUID()}.pdf`
    const buffer = await file.toBuffer()
    fs.writeFileSync(path.join(uploadsDir, filename), buffer)

    const baseUrl = process.env.BASE_URL ?? "http://localhost:3001"
    return reply.status(201).send({ ok: true, data: { url: `${baseUrl}/api/public/uploads/${filename}` } })
  })

  // GET /api/public/uploads/:filename — serve o PDF
  app.get<{ Params: { filename: string } }>("/uploads/:filename", async (req, reply) => {
    const filename = path.basename(req.params.filename) // previne path traversal
    const filePath = path.join(process.cwd(), "uploads", filename)

    if (!fs.existsSync(filePath)) throw new AppError("Arquivo não encontrado.", 404)

    const stream = fs.createReadStream(filePath)
    reply.header("Content-Type", "application/pdf")
    reply.header("Content-Disposition", `inline; filename="${filename}"`)
    return reply.send(stream)
  })
}

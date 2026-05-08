//rotas
import type { FastifyInstance } from "fastify";
import { authRoutes } from "./auth.routes";
import { jobRoutes } from "./job.routes";
import { applicationRoutes } from "./application.routes";
import { companyRoutes } from "./company.routes";
import { organogramaRoutes } from "./organograma.routes";
import { publicTestRoutes } from "./publicTest.routes";
import { aiRoutes } from "./ai.routes";
import { chatRoutes } from "./chat.routes";
import { publicJobRoutes, uploadRoutes } from "./publicJob.routes";


async function routes(fastify: FastifyInstance): Promise<void> {

    fastify.get('/health', async () => {
        return { status: 'ok',
            message: 'Servidor está ativo e funcionando corretamente!'
        };
    })


    fastify.register(authRoutes)
    fastify.register(jobRoutes, {prefix: '/jobs'})
    fastify.register(applicationRoutes, {prefix: '/applications'})
    fastify.register(companyRoutes, {prefix: '/company'})
    fastify.register(organogramaRoutes, {prefix: '/organograma'})
    fastify.register(publicTestRoutes, {prefix: '/public/tests'})
    fastify.register(aiRoutes, {prefix: '/ai'})
    fastify.register(chatRoutes, {prefix: '/chat'})
    fastify.register(publicJobRoutes, { prefix: '/public/jobs' })
    fastify.register(uploadRoutes,    { prefix: '/public' })
}

export default routes;
import { FastifyInstance } from "fastify";
import { AiController } from "../controllers/AiController";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateSchema } from "../middleware/validade.schema";
import { aiJobParamsSchema, matchBodySchema, MatchBodyDTO } from "../schemas/ai.schema";

export async function aiRoutes(app: FastifyInstance) {
  const aiController = new AiController();

  app.addHook("preHandler", authMiddleware);

  app.post<{ Params: { id: string } }>(
    "/jobs/:id/generate-jd",
    { preHandler: [validateSchema(aiJobParamsSchema, "params")] },
    aiController.generateJd
  );

  app.post<{ Params: { id: string }; Body: MatchBodyDTO }>(
    "/jobs/:id/match",
    {
      preHandler: [
        validateSchema(aiJobParamsSchema, "params"),
        validateSchema(matchBodySchema),
      ],
    },
    aiController.match
  );
}

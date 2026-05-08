import { FastifyInstance } from "fastify";
import { OrganogramaController } from "../controllers/OrganogramaController";
import { authMiddleware } from "@/middleware/auth.middleware";
import { validateSchema } from "@/middleware/validade.schema";
import { OrganogramaDTO, organogramaSchema, paramsIdDTO } from "../schemas/organograma.schema";

export async function organogramaRoutes(app: FastifyInstance) {
  const organogramaController = new OrganogramaController();

  // Protege todas as rotas deste arquivo 🔒
  app.addHook("preHandler", authMiddleware);

  // GET /organograma - Lista o organograma da empresa
  app.get("/", organogramaController.get);

  // POST /organograma - Cria um novo nó no organograma
  app.post<{ Body: OrganogramaDTO }>(
    "/",
    { preHandler: [validateSchema(organogramaSchema)] },
    organogramaController.create
  );

  // PATCH /organograma/:id - Atualiza um nó do organograma
  app.patch<{ Params: ParamsIdDTO; Body: Partial<OrganogramaDTO> }>(
    "/:id",
    { preHandler: [validateSchema(paramsIdDTO, 'params')] },
    organogramaController.update
  );

  // DELETE /organograma/:id - Remove um nó
  app.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: [validateSchema(paramsIdDTO, 'params')] },
    organogramaController.delete
  );
}
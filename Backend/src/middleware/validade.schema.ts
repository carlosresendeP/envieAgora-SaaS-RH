import { FastifyReply, FastifyRequest } from "fastify";
import { ZodSchema } from "zod";

type Source = "body" | "params" | "query";

export const validateSchema = (schema: ZodSchema, source: Source = "body") => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return reply.status(400).send({
        ok: false,
        message: "Dados inválidos",
        errors: result.error.format(),
      });
    }

    (req as Record<string, unknown>)[source] = result.data;
  };
};
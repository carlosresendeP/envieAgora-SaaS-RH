import { api } from "@/lib/api"
import type { ApiResponse, Application, ApplyRequest } from "@/types/api"

export const candidateService = {
  apply: async (body: ApplyRequest): Promise<Application> => {
    const { data } = await api.post<ApiResponse<Application>>("/applications/apply", body)
    return data.data
  },
}

import { api } from "@/lib/api"
import type { ApiResponse, TestData, TestSubmitRequest, RespostasJson } from "@/types/api"

interface SubmitResult {
  ok: true
  results: RespostasJson
}

export const testService = {
  getTest: async (token: string): Promise<TestData> => {
    const { data } = await api.get<ApiResponse<TestData>>(`/public/tests/${token}`)
    return data.data
  },

  submit: async (token: string, answers: TestSubmitRequest): Promise<RespostasJson> => {
    const { data } = await api.post<SubmitResult>(`/public/tests/${token}/submit`, answers)
    return data.results
  },
}

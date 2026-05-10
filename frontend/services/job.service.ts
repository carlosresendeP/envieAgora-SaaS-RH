import { api } from "@/lib/api"
import type { ApiResponse, Job, CreateJobRequest, UpdateJobRequest, PerfilIdeal } from "@/types/api"

export const jobService = {
  list: async (): Promise<Job[]> => {
    const { data } = await api.get<ApiResponse<Job[]>>("/jobs")
    return data.data
  },

  getById: async (id: string): Promise<Job> => {
    const { data } = await api.get<ApiResponse<Job>>(`/jobs/${id}`)
    return data.data
  },

  create: async (body: CreateJobRequest): Promise<Job> => {
    const { data } = await api.post<ApiResponse<Job>>("/jobs", body)
    return data.data
  },

  update: async (id: string, body: UpdateJobRequest): Promise<Job> => {
    const { data } = await api.patch<ApiResponse<Job>>(`/jobs/${id}`, body)
    return data.data
  },

  generateJd: async (id: string): Promise<string> => {
    const { data } = await api.post<ApiResponse<string>>(`/ai/jobs/${id}/generate-jd`)
    return data.data
  },

  generateMatch: async (id: string, candidateId: string): Promise<unknown> => {
    const { data } = await api.post<ApiResponse<unknown>>(`/ai/jobs/${id}/match`, { candidateId })
    return data.data
  },

  generatePerfilIdeal: async (id: string): Promise<PerfilIdeal> => {
    const { data } = await api.post<ApiResponse<PerfilIdeal>>(`/ai/jobs/${id}/generate-perfil-ideal`)
    return data.data
  },
}

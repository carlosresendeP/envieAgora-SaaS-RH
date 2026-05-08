import { api } from "@/lib/api"
import type { ApiResponse, OrganogramaNode, CreateOrganogramaNodeRequest } from "@/types/api"

export const organogramaService = {
  list: async (): Promise<OrganogramaNode[]> => {
    const { data } = await api.get<ApiResponse<OrganogramaNode[]>>("/organograma")
    return data.data
  },

  create: async (body: CreateOrganogramaNodeRequest): Promise<OrganogramaNode> => {
    const { data } = await api.post<ApiResponse<OrganogramaNode>>("/organograma", body)
    return data.data
  },

  update: async (id: string, body: Partial<CreateOrganogramaNodeRequest>): Promise<OrganogramaNode> => {
    const { data } = await api.patch<ApiResponse<OrganogramaNode>>(`/organograma/${id}`, body)
    return data.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/organograma/${id}`)
  },
}

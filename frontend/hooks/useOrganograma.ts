import { useQuery } from "@tanstack/react-query"
import { organogramaService } from "@/services/organograma.service"

export function useOrganograma() {
  return useQuery({
    queryKey: ["organograma"],
    queryFn: organogramaService.list,
    throwOnError: false,
  })
}
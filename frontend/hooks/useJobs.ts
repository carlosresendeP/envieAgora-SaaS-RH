import { useQuery } from "@tanstack/react-query"
import { jobService } from "@/services/job.service"

export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: jobService.list,
  })
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ["jobs", id],
    queryFn: () => jobService.getById(id),
    enabled: !!id,
  })
}

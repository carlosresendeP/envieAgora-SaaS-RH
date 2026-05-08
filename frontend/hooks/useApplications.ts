import { useQuery } from "@tanstack/react-query"
import { applicationService } from "@/services/application.service"

export function useCompanyApplications() {
  return useQuery({
    queryKey: ["applications", "company"],
    queryFn: applicationService.listByCompany,
  })
}

export function useJobApplications(jobId: string) {
  return useQuery({
    queryKey: ["applications", "job", jobId],
    queryFn: () => applicationService.listByJob(jobId),
    enabled: !!jobId,
  })
}

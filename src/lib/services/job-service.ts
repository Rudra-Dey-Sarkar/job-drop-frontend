import { ErrorResponse } from "@/types/errors/http";
import { JobListResponse, JobResponse } from "@/types/jobs/http";

export class JobService {
   async retrieveList(slug: string, params: string): Promise<JobListResponse | ErrorResponse> {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/list/${slug}?${params}`);
      return response.json();
   }
}

export const jobService = new JobService();
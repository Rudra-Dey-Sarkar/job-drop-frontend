import { JobListResponse, JobResponse } from "@/types/jobs/http";
import { getAuthHeaders } from "../cookies/cookies";
import { JobSchemaType } from "@/schemas/job/job";

export class JobService {
   async create(data: JobSchemaType): Promise<JobResponse> {
      const headers = await getAuthHeaders();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            ...headers
         },
         body: JSON.stringify(data)
      });
      return response.json();
   }

   async update(data: JobSchemaType, id:string): Promise<JobResponse> {
      const headers = await getAuthHeaders();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
            ...headers
         },
         body: JSON.stringify(data)
      });
      return response.json();
   }

   async delete(id:string): Promise<JobResponse> {
      const headers = await getAuthHeaders();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
            ...headers
         }
      });
      return response.json();
   }

   async retrieveList(slug: string, params: string): Promise<JobListResponse> {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/list/${slug}?${params}`);
      return response.json();
   }
}

export const jobService = new JobService();
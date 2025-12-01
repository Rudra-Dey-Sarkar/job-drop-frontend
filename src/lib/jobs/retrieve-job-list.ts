"use server"
import { JobListResponse } from "@/types/jobs/http";
import { jobService } from "../services/job-service"
import { ErrorResponse } from "@/types/errors/http";

export async function retrieveJobList(slug: string, params: string): Promise<JobListResponse | ErrorResponse> {
    try {
        const response = await jobService.retrieveList(slug, params);
        return response;
    } catch (error) {
        return error as ErrorResponse;
    }
}
"use server"

import { jobService } from "@/lib/services/job-service";
import { ErrorResponse } from "@/types/errors/http";
import { JobResponse } from "@/types/jobs/http";
import { JobPayload } from "@/types/jobs/module";

export const deleteJobAction = async (id:string): Promise<JobResponse | ErrorResponse> => {
    try {
        const response = await jobService.delete(id);
        return response;
    } catch (error) {
        return error as ErrorResponse;
    }
}
"use server"

import { jobService } from "@/lib/services/job-service";
import { JobSchemaType } from "@/schemas/job/job";
import { ErrorResponse } from "@/types/errors/http";
import { JobResponse } from "@/types/jobs/http";

export const updateJobAction = async (data: JobSchemaType, id:string): Promise<JobResponse | ErrorResponse> => {
    try {
        const response = await jobService.update(data, id);
        return response;
    } catch (error) {
        return error as ErrorResponse;
    }
}
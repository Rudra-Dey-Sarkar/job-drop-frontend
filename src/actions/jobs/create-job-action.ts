"use server"

import { jobService } from "@/lib/services/job-service";
import { JobSchemaType } from "@/schemas/job/job";
import { ErrorResponse } from "@/types/errors/http";
import { JobResponse } from "@/types/jobs/http";

export const createJobAction = async (data: JobSchemaType): Promise<JobResponse | ErrorResponse> => {
    try {
        const response = await jobService.create(data);
        return response;
    } catch (error) {
        return error as ErrorResponse;
    }
}
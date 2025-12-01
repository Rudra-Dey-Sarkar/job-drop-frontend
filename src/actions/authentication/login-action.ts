"use server"

import { authService } from "@/lib/services/auth-service";
import { LoginSchema } from "@/schemas/job/job";
import { CompanyAuthenticationResponse } from "@/types/company/http";
import { ErrorResponse } from "@/types/errors/http";
import z from "zod";

export const loginAction = async (data: z.infer<typeof LoginSchema>): Promise<CompanyAuthenticationResponse | ErrorResponse> => {
    try {
        const response = await authService.login(data.email, data.password);
        return response;
    } catch (error) {
        return error as ErrorResponse;
    }
}
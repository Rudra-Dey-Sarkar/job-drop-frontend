"use server"

import { authService } from "@/lib/services/auth-service";
import { CompanyAuthenticationResponse } from "@/types/company/http";
import { CompanyPayload } from "@/types/company/module"
import { ErrorResponse } from "@/types/errors/http";

export const registerAction = async (data: CompanyPayload): Promise<CompanyAuthenticationResponse | ErrorResponse> => {
    try {
        const response = await authService.register(data);
        return response;
    } catch (error) {
        return error as ErrorResponse;
    }
}
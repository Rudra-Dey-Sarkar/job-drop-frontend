"use server"

import { authService } from "@/lib/services/auth-service";
import { pageService } from "@/lib/services/page-service";
import { ErrorResponse } from "@/types/errors/http";
import { PageResponse } from "@/types/pages/http";
import { PagePayload } from "@/types/pages/module";

export const editPagesAction = async (data: PagePayload): Promise<PageResponse | ErrorResponse> => {
    try {
        const response = await pageService.edit(data);
        return response;
    } catch (error) {
        return error as ErrorResponse;
    }
}
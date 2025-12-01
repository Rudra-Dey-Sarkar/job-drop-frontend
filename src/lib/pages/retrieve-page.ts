"use server"

import { pageService } from "../services/page-service";
import { PageResponse } from "@/types/pages/http";
import { ErrorResponse } from "@/types/errors/http";

export async function retrievePages(slug: string ): Promise<PageResponse | ErrorResponse> {
    try {
        const response = await pageService.retrieve(slug);
        return response;
    } catch (error) {
        return error as ErrorResponse;
    }
}
import { CompanyListResponse, CompanyResponse } from "@/types/company/http";
import { getAuthHeaders } from "../cookies/cookies";
import { ErrorResponse } from "@/types/errors/http";
import { PageResponse } from "@/types/pages/http";

export class PageService {
   async retrieve(slug:string): Promise<PageResponse | ErrorResponse> {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/${slug}`);
      return response.json();
   }

}

export const pageService = new PageService();
import { PageResponse } from "@/types/pages/http";
import { PagePayload } from "@/types/pages/module";
import { getAuthHeaders } from "../cookies/cookies";

export class PageService {
   
   async edit(data: PagePayload): Promise<PageResponse> {
      const headers = await getAuthHeaders();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/edit`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            ...headers
         },
         body: JSON.stringify(data)
      });
      return response.json();
   }

   async retrieve(slug: string): Promise<PageResponse> {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/${slug}`);
      return response.json();
   }

}

export const pageService = new PageService();
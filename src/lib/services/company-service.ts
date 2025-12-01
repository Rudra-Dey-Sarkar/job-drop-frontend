import { CompanyListResponse, CompanyResponse } from "@/types/company/http";
import { getAuthHeaders } from "../cookies/cookies";
import { ErrorResponse } from "@/types/errors/http";

export class CompanyService {
   async retrieveList(): Promise<CompanyListResponse | ErrorResponse> {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/list`);
      return response.json();
   }

   async retrieve(slug?: string): Promise<CompanyResponse | ErrorResponse> {
      let response;
      if (slug!==undefined) {
         response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/open/${slug}`);
      } else {
         const headers = await getAuthHeaders();
         response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/open`, {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               ...headers
            }
         });
      }
      return response.json();
   }
}

export const companyService = new CompanyService();
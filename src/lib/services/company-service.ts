import { CompanyListResponse, CompanyResponse } from "@/types/company/http";
import { getAuthHeaders } from "../cookies/cookies";

export class CompanyService {
   async retrieveList(): Promise<CompanyListResponse> {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/list`);
      return response.json();
   }

   async retrieve(slug?: string): Promise<CompanyResponse> {
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
"use server"

import { CompanyResponse } from "@/types/company/http"
import { ErrorResponse } from "@/types/errors/http"
import { companyService } from "../services/company-service"

export const retrieveUserCompany = async (slug?:string):Promise<CompanyResponse | ErrorResponse> =>{
try{
 const response = await companyService.retrieve(slug);
 return response; 
}catch(error){
 return error as ErrorResponse;
}
}
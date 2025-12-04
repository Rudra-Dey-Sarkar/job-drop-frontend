import { CompanyAuthenticationResponse } from "@/types/company/http";
import { CompanyPayload } from "@/types/company/module";
import { ErrorResponse } from "@/types/errors/http";

export class AuthService {
 async register(data:CompanyPayload): Promise<CompanyAuthenticationResponse> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    return response.json();
 }

  async login(email: string, password: string): Promise<CompanyAuthenticationResponse> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    return response.json();
  }
}

export const authService = new AuthService();
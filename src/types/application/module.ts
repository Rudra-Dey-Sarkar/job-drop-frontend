export interface ApplicationPayload {
  company_id?: string; 
  job_id?: string;    

  first_name: string;
  last_name: string;
  location?: string;

  experience_level?: {
    years?: number;
    months?: number;
  };

  gender?: "male" | "female";

  email: string;
  phone: string;
  resume_url: string;

  cover_letter?: string | null;

  status?: "applied" | "reviewed" | "interviewed" | "offered" | "rejected";
}

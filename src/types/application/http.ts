import { CompanyResponse } from "../company/http";
import { JobResponse } from "../jobs/http";

export interface ApplicationResponse {
  _id: string;

  company_id: string | CompanyResponse;
  job_id: string | JobResponse;

  first_name: string;
  last_name: string;
  location: string;

  experience_level: {
    years: number;
    months: number;
  };

  gender: "male" | "female";

  email: string;
  phone: string;
  resume_url: string;

  cover_letter: string | null;

  status: "applied" | "reviewed" | "interviewed" | "offered" | "rejected";

  createdAt: string;
  updatedAt: string;
}

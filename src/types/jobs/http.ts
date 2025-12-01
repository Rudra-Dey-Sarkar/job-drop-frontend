import { CompanyResponse } from "../company/http";

export interface JobResponse {
  _id: string;
  company_id: CompanyResponse;

  title: string;
  description?: string | null;

  locations: {
    location: string[] | null;
    type: "remote" | "hybrid" | "on-site";
  };

  type: "full-time" | "part-time" | "contract" | "internship";

  sector:
  | "it"
  | "software"
  | "engineering"
  | "finance"
  | "accounting"
  | "marketing"
  | "sales"
  | "design"
  | "product"
  | "hr"
  | "operations"
  | "legal"
  | "healthcare"
  | "education"
  | "manufacturing"
  | "construction"
  | "logistics"
  | "hospitality"
  | "retail"
  | "customer-service"
  | "real-estate"
  | "media"
  | "entertainment"
  | "consulting"
  | "energy"
  | "telecom"
  | "government"
  | "non-profit"
  | "research"
  | "biotech"
  | "security"
  | "agriculture"
  | "automotive"
  | "food-services"
  | "sports"
  | "other";

  experience_level: "intern" | "entry" | "junior" | "mid" | "senior";

  salary_range: {
    min: number;
    max: number;
    currency: string;
    duration: "monthly" | "yearly";
  };

  status: "published" | "draft";

  createdAt: string;
  updatedAt: string;
}

export interface JobListResponse {
  jobs: JobResponse[];
  limit: number;
  page: number;
  total: number
  totalPages: number;
}

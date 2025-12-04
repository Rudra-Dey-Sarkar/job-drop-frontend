export interface JobPayload {
  company_id?: string;
  title: string;
  description?: string | null;
  
  locations?: {
    location?: string[] | null;
    type?: "remote" | "hybrid" | "on-site";
  };

  type?: "full-time" | "part-time" | "contract" | "internship";

  sector?: 
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

  experience_level?: "intern" | "entry" | "junior" | "mid" | "senior";

  salary_range?: {
    min?: number;
    max?: number;
    currency?: string;
    duration?: "month" | "year";
  };

  status?: "published" | "draft";
}

export interface JobParams {
status?: string;
type?: string;
sector?: string;
experience_level?: string;
location?: string;
location_type?: string;
salary_min?: number;
salary_max?: number;
sort?: string;
q?: string;
page?: number;
limit?: number;
}

import { CompanyResponse } from "../company/http";

export interface PageSectionResponse {
  id: string;
  title?: string | null;
  content?: string | null;
  images: string[];
}

export interface PageBrandResponse {
  primary_color?: string | null;
  secondary_color?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  culture_video_url?: string | null;
}

export interface PageResponse {
  _id: string;
  company_id: CompanyResponse;

  status: "published" | "draft";

  brand?: PageBrandResponse;

  sections: PageSectionResponse[];

  createdAt: string;
  updatedAt: string;
}

export interface PageSection {
  id: string;
  title?: string | null;
  content?: string | null;
  images?: string[];
}

export interface PageBrand {
  primary_color?: string | null;
  secondary_color?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  culture_video_url?: string | null;
}

export interface PagePayload {
  company_id?: string;
  status?: "published" | "draft";

  brand?: PageBrand;

  sections?: PageSection[];
}

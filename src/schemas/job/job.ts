import z from "zod";

export const sectorEnum =  [
    "it",
    "software",
    "engineering",
    "finance",
    "accounting",
    "marketing",
    "sales",
    "design",
    "product",
    "hr",
    "operations",
    "legal",
    "healthcare",
    "education",
    "manufacturing",
    "construction",
    "logistics",
    "hospitality",
    "retail",
    "customer-service",
    "real-estate",
    "media",
    "entertainment",
    "consulting",
    "energy",
    "telecom",
    "government",
    "non-profit",
    "research",
    "biotech",
    "security",
    "agriculture",
    "automotive",
    "food-services",
    "sports",
    "other"
  ];

export const JobSchema = z.object({
    title: z.string().min(2, "Job title is required"),
    description: z.string().nullable().optional(),

    locations: z.object({
        location: z.array(z.string()).nullable().optional(),
        type: z.enum(["remote", "hybrid", "on-site"]).optional(),
    }).optional(),

    type: z.enum(["full-time", "part-time", "contract", "internship"])
        .default("full-time"),

    sector: z.enum(sectorEnum as [string, ...string[]])
        .default("other"),

    experience_level: z.enum(["intern", "entry", "junior", "mid", "senior"])
        .default("entry"),

    salary_range: z.object({
        min: z.number().default(0),
        max: z.number().default(0),
        currency: z.string().default("USD"),
        duration: z.enum(["month", "year"]).default("year"),
    }),

    status: z.enum(["published", "draft"]).default("draft"),
});

export type JobSchemaType = z.infer<typeof JobSchema>;

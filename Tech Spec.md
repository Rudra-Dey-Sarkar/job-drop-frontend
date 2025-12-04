# **Assumptions**

I assumed that the application will have total two types of user (companies and candidates).

Company will visit our plaform create account and their branded careers page and post jobs and share the careers page link.

Candidate will visit the plaform directly and brows companies and select one will take them to companies careers page or they can come to our platform from companies careers page link and directly start browsing jobs.

---

# **Architecture**

### Register

* **Frontend Request** : POST from `/` to  `/register` with required fields.
* **Route Handler** : Routes request to `auth-controller`
* **Controller Logic** :
* Validates input required fields
* Checks if user/company already exists in database
* If validation fails → returns error response
* If user exists → returns "Company already registered" error
* If valid → hashes password using bcrypt
* Inserts company data into database
* Generates JWT token
* **Response** : Returns company details and authentication token
* **Cookies Storage** : Token saved in cookies for future authenticated requests

### Login

* **Frontend Request** : POST from `/` to `/login` with email and password
* **Route Handler** : Routes request to `auth-controller`
* **Controller Logic** :
* Validates required fields
* Queries database for user/company by email
* If user not found → returns "Invalid credentials" error
* If found → compares provided password with hashed password using bcrypt
* If password doesn't match → returns "Invalid credentials" error
* If credentials valid → generates JWT token
* **Response** : Returns company details (id, email, name) and authentication token
* **Cookies Storage** : Token saved in cookies for future authenticated requests

## Branded Careers Page (Create and Edit)

### Create/Edit Branded Page

* **Frontend Request** : PUT from `/slug/edit` to `/page/edit` with required fields + authentication token in header
* **Middleware** : Token Verification Middleware
* Validates JWT token from request header
* If token invalid/expired → returns "Unauthorized" error
* If valid → extracts company slug and passes to controller
* **Controller Logic** :
* Validates page fields (required fields, data format)
* Checks if branded page already exists for this company
* If exists → updates existing page data in database
* If doesn't exist → creates new page record in database
* Generates URL slug from company name using slugify
* **Response** : Returns updated/created page details with slug
* **Frontend Update** : Displays success message

## Job Management

#### Create Job

* **Frontend Request** : POST from `/slug/edit` to `/jobs` with job require fields + authentication token
* **Middleware** : Token Verification Middleware
* Validates JWT token and extracts company slug
* If invalid → returns "Unauthorized" error
* **Controller Logic** :
* Validates all required job fields
* Associates job with authenticated company (using company ID from token)
* Inserts job data into database with status "draft" or "published"
* **Response** : Returns created job details
* **Frontend Update** : Adds job to job list

#### Edit Job

* **Frontend Request** : PUT from `/slug/edit` to `/jobs/:id` with updated job details + authentication token
* **Middleware** : Token Verification Middleware
* Validates JWT token and extracts company slug
* **Controller Logic** :
* Validates job exists and belongs to authenticated company
* If doesn't exist or unauthorized → returns error
* Validates updated fields
* Updates job data in database
* **Response** : Returns updated job details
* **Frontend Update** : Updates job in list

#### Delete Job

* **Frontend Request** : DELETE from `/slug/edit` to `/jobs/:id` + authentication token
* **Middleware** : Token Verification Middleware
* **Controller Logic** :
* Validates job exists and belongs to authenticated company
* Deletes job from database
* **Response** : Job details.
* **Frontend Update** : Removes job from list

#### View Jobs (Public)

* **Frontend Request** : GET from `/` to `/jobs/list/:slug`
* **Route Handler** : Routes to `job-controller`
* **Controller Logic** :
* Queries database for company by slug
* Retrieves all published jobs for that company
* Filters by with params like status, location, salary range, sector and can also search with query parameters provided
* Supports full-text search on job title and description
* **Response** : Returns array of jobs with company details
* **Frontend Display** : Shows job listings on careers page

## Application Management (Only in backend)

#### Submit Application

* **Frontend Request** : POST from `/slug/careers` to `/applications/:jobId` candidate details
* **Route Handler** : Routes to `application-controller`
* **Controller Logic** :
* Validates job exists and is published
* Validates candidate fields
* Validates resume file upload
* Creates application record in database with status "pending"
* Associates application with job and company
* **Response** : Returns application data
* **Frontend Update** : Frontend will shows success message to candidate when frontend implemented

#### View Applications (Company)

* **Frontend Request** : GET `/applications/list/:jobId` + authentication token
* **Middleware** : Token Verification Middleware
* Validates JWT token and extracts company ID
* **Controller Logic** :
* Validates job belongs to authenticated company
* Retrieves all applications for that job
* Sorts by submission date (newest first)
* **Response** : Returns array of applications with candidate details
* **Frontend Display** : Shows applications when frontend implemented

---

# Database Schema

#### **Company schema :-**

import { Schema, model } from"mongoose";

constCompanySchema = newSchema(

  {

    name:String,

    slug: { type:String, unique:true },

    description:String,

    email:String,

    password:String,

  },

  { timestamps:true }

);

exportdefaultmodel("company", CompanySchema);

#### Page Schema :-

import { Schema, model } from"mongoose";

constPageSchema = newSchema(

  {

    company_id: { type:Schema.Types.ObjectId, ref:"company" },

    status: { type:String, enum: ['published', 'draft',], default:"draft" },

    brand: {

    primary_color: { type:String, default:null },

    secondary_color: { type:String, default:null },

    logo_url: { type:String, default:null },

    banner_url: { type:String, default:null },

    culture_video_url: { type:String, default:null },

    },

    sections: [

    {

    id:String,

    title: { type:String, default:null },

    content: { type:String, default:null },

    images: { type: [String], default: [] }

    }

    ]

  },

  { timestamps:true }

);

exportdefaultmodel("page", PageSchema);

#### Job Schema :-

import { Schema, model } from"mongoose";

exportconstsectorEnum =  [

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

constJobSchema = newSchema(

  {

    company_id: { type:Schema.Types.ObjectId, ref:"company" },

    title:String,

    description: { type:String, default:null },

    locations: {

    location: { type: [String], default:null },

    type: { type:String, enum: ['remote', 'hybrid', 'on-site'], default:"remote" }

    },

    type: { type:String, enum: ['full-time', 'part-time', 'contract', 'internship'], default:"full-time" },

    sector: { type:String, enum:sectorEnum, default:"other" },

    experience_level: { type:String, enum: ['intern', 'entry', 'junior' ,'mid', 'senior'], default:"entry" },

    salary_range: {

    min: { type:Number, default:0 },

    max: { type:Number, default:0 },

    currency: { type:String, default:"USD" },

    duration: { type:String, enum: ['month', 'year'], default:'yearly' }

    },

    status: { type:String, enum: ['published', 'draft', ], default:"draft" },

  },

  { timestamps:true }

);

exportdefaultmodel("job", JobSchema);

#### Application Schema

import { Schema, model } from"mongoose";

constApplicationSchema = newSchema(

  {

    company_id: { type:Schema.Types.ObjectId, ref:"company" },

    job_id: { type:Schema.Types.ObjectId, ref:"job" },

    first_name:String,

    last_name:String,

    location:String,

    experience_level: {

    years: { type:Number, default:0 },

    months: { type:Number, default:0 }

    },

    gender: { type:String, enum: ['male', 'female'] },

    email:String,

    phone:String,

    resume_url:String,

    cover_letter: { type:String, default:null },

    status: { type:String, enum: ['applied', 'reviewed', 'interviewed', 'offered', 'rejected'], default:"applied" },

  },

  { timestamps:true }

);

exportdefaultmodel("application", ApplicationSchema);

---

# Test Plan

I tested the application manually and fixed all the edge cases possible and I found in from backend and frontend

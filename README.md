# Run guide

#### Backend :-

1. clone the repo and run the command :- `npm i`
2. create mongodb locally or can you mongodb atlas and fill the .env variable `DB_URL=` and also fill the `JWT_SECRET=`
3. now run `npm run dev` in terminal

#### Frontend :-

1. clone the repo and run the command :- `npm i`
2. fill the .env.local variables with frontend URL in `NEXT_PUBLIC_APP_URL=`, backend URL in `NEXT_PUBLIC_API_URL= ` supabase project url in `SUPABASE_URL=`  supabase service role key in `SUPABASE_SERVICE_ROLE_KEY`
3. now can run the project using `npm run dev`

---

# About project

I build a job board application where company will visit our plaform create account and their branded careers page and post jobs and share the careers page link. candidate will visit the plaform directly and brows companies and select one will take them to companies careers page or they can come to our platform from companies careers page link and directly start browsing jobs.

#### Improvements :-

1. In backend we add email notification system for users when they apply for a job and also can send updates when company change the status for application.
2. In frontend we can complete application flow and improve the UI like including suspense loading

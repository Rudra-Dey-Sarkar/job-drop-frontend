import { useEffect, useState } from "react";
import JobCard from "../job-card/job-card";
import { JobResponse } from "@/types/jobs/http";


export default function JobList({ jobs }: { jobs: JobResponse[] }) {

    if (!jobs.length) return <div className="py-8 text-center text-slate-500">No jobs found</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map(j => <JobCard job={j} key={j._id} />)}
        </div>
    );
}
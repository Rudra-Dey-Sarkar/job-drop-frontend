"use client"

import { UserContext } from '@/contexts/user-context';
import { retrieveJobList } from '@/lib/jobs/retrieve-job-list';
import { CompanyResponse } from '@/types/company/http';
import { JobListResponse, JobResponse } from '@/types/jobs/http';
import { PageResponse } from '@/types/pages/http';
import { getParams } from '@/utils/get-params';
import React, { useContext, useEffect, useState } from 'react'
import JobList from '../job-list/job-list';

function Careers({ company, slug }: { company: CompanyResponse, slug: string }) {
    const { user } = useContext(UserContext)!;
    const [page, setPage] = useState<PageResponse | null>(null);
    const [jobs, setJobs] = useState<JobResponse[]>([]);

    useEffect(() => {
        (async () => {
            const param = getParams({})
            const response = await retrieveJobList(slug, param);

            if (!("error" in response)) {
                setJobs(response.jobs)
            }
        })();
    }, []);
    

    // todo :- 
    // 1. feed AI entire code for for careers, jobcard , 
    // getParams along with the data types and give 
    // backend retrieve job list from backend and ask 
    // to build the job page section along with filters 
    // and make only candidates can apply to jobs not logged 
    // in user from frontend  
    // 
    // 2. make the brand page edit and section reorder accordingly  

    if (user) {
        return (
            <div>Company View
                <JobList jobs={jobs} />
            </div>
        )
    } else {
        return (
            <div>Candidate View</div>
        )
    }
}

export default Careers
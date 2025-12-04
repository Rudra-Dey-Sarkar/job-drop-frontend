"use client"
import { retrieveJobList } from '@/lib/jobs/retrieve-job-list';
import { CompanyResponse } from '@/types/company/http'
import { JobResponse } from '@/types/jobs/http';
import { getParams } from '@/utils/get-params';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function CompanyCarousel({ companies }: { companies: CompanyResponse[] }) {
    const [jobs, setJobs] = useState<{ slug: string, jobs: number}[]>([]);

    useEffect(() => {
        (async () => {
            companies.map(async (company) => {
                const param = getParams({ status: "published", page: 1, limit: 10 });
                const response = await retrieveJobList(company.slug, param);
                if (!("error" in response)) {
                    setJobs(prev => [...prev, { slug: company.slug, jobs: response.total }]);
                }
            })
        })()
    }, []);

    if (!companies || companies.length === 0) {
        return (
            <div className="py-6 text-sm text-slate-500">
                No companies yet
            </div>
        );
    } else {
        return (
            <div className="mt-4 flex gap-4 overflow-x-auto py-3">
                {companies.map((c: CompanyResponse) => (
                    <Link href={`/${c.slug}/careers`} key={c._id} className="p-3 rounded-xl border border-slate-100 shadow-sm bg-white hover:cursor-pointer hover:scale-105 transition-transform duration-200" style={{ minWidth: 200 }}>
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">{(c.name || "").slice(0, 1)}</div>
                            <div>
                                <div className="text-sm font-medium">{c.name}</div>
                                <div className="text-xs text-slate-500">{jobs.find(j => j.slug === c.slug)?.jobs || 0} active jobs</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        );
    }
}

export default CompanyCarousel
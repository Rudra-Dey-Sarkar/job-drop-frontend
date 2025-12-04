import { JobResponse } from "@/types/jobs/http";

export default function JobCard({ job, canEdit }: { job: JobResponse, canEdit: boolean }) {
    const formatDate = (date: string) => {
        const temp = date.split("/");
        return String(temp[1] + "/" + temp[0] + "/" + temp[2])
    }
    return (
        <article className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <div className="mt-1 text-sm text-slate-500">{Array.isArray(job.locations?.location) ? job.locations?.location.map((location) => `${location} `) : job.locations?.location} • {job.locations.type}</div>
                </div>
            </div>


            <p className="mt-3 text-sm text-slate-600 line-clamp-3">{job.description}</p>


            <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-slate-600">{job.salary_range?.min ? `${job.salary_range.min} - ${job.salary_range.max} ${job.salary_range.currency}` : "Salary not listed"}</div>

                <div className="flex gap-5 items-center">
                    {canEdit &&
                        <p className="font-bold">{job.status.toUpperCase()}</p>
                    }
                    <p>{formatDate(new Date(job.createdAt).toLocaleDateString())}</p>
                    <a href={`/${job.company_id.slug}/jobs/${job._id}`} className="text-sm rounded-md px-3 py-1 border border-slate-200">View</a>
                </div>
            </div>
        </article>
    );
}
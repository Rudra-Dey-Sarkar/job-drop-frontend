"use client";

import { useEffect, useState, useMemo, useContext } from "react";
import JobCard from "./job-card";
import { JobResponse } from "@/types/jobs/http";
import { retrieveJobList } from "@/lib/jobs/retrieve-job-list";
import { getParams } from "@/utils/get-params";
import { UserContext } from "@/contexts/user-context";
import { Pencil, Plus, TrashIcon } from "lucide-react";
import { deleteJobAction } from "@/actions/jobs";
import JobModal from "./job-modal";
import { usePathname } from "next/navigation";

export default function JobList({ slug }: { slug: string }) {
    const { user } = useContext(UserContext)!;
    const pathname = usePathname();

    const canEdit = (user && pathname.includes("edit"));

    // Job form modal
    const [openModal, setOpenModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState<JobResponse | null>(null);

    const [jobs, setJobs] = useState<JobResponse[]>([]);
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const sectorEnum = [
        "it", "software", "engineering", "finance", "accounting", "marketing", "sales", "design", "product", "hr",
        "operations", "legal", "healthcare", "education", "manufacturing", "construction", "logistics", "hospitality",
        "retail", "customer-service", "real-estate", "media", "entertainment", "consulting", "energy", "telecom",
        "government", "non-profit", "research", "biotech", "security", "agriculture", "automotive", "food-services",
        "sports", "other"
    ];

    const [filters, setFilters] = useState({
        type: [] as string[],
        sector: [] as string[],
        experience_level: [] as string[],
        location: [] as string[],
        location_type: [] as string[],
        salary_min: "",
        salary_max: "",
        sort: "newest",
        openSector: false,
    });

    function capitalizeFirstLetter(str: string) {
        if (typeof str !== "string" || str.length === 0) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const toggleMulti = (key: string, value: string) => {
        setFilters((f: any) => ({
            ...f,
            [key]: f[key].includes(value)
                ? f[key].filter((v: string) => v !== value)
                : [...f[key], value]
        }));
        setPage(1);
    };

    const addLocation = (value: string) => {
        if (!value.trim()) return;
        setFilters((f: any) => ({
            ...f,
            location: Array.from(new Set([...f.location, value.trim()]))
        }));
        setPage(1);
    };

    const removeLocation = (value: string) => {
        setFilters((f: any) => ({
            ...f,
            location: f.location.filter((l: string) => l !== value)
        }));
        setPage(1);
    };

    async function load() {
        const param = getParams({
            status: canEdit ? "" : "published",
            type: filters.type.join(","),
            sector: filters.sector.join(","),
            experience_level: filters.experience_level.join(","),
            location: filters.location.join(","),
            location_type: filters.location_type.join(","),
            salary_min: filters.salary_min ? Number(filters.salary_min) : undefined,
            salary_max: filters.salary_max ? Number(filters.salary_max) : undefined,
            sort: filters.sort,
            q,
            page,
            limit: 6,
        });

        const res: any = await retrieveJobList(slug, param);
        if (!("error" in res)) {
            setJobs(res.jobs || []);
            if (res.totalPages) setTotalPages(res.totalPages);
        }
    }

    useEffect(() => { load() }, [filters, q, page, openModal]);

    const paginationItems = useMemo(() => {
        const total = Math.max(1, totalPages);
        const current = Math.max(1, Math.min(page, total));
        const delta = 2;
        const range: (number | string)[] = [];
        const left = Math.max(1, current - delta);
        const right = Math.min(total, current + delta);

        if (left > 1) range.push(1);
        if (left > 2) range.push("...");

        for (let i = left; i <= right; i++) range.push(i);

        if (right < total - 1) range.push("...");
        if (right < total) range.push(total);

        return range;
    }, [page, totalPages]);


    // DELETE JOB
    async function handleDeleteJob(id: string) {
        if (!confirm("Delete this job?")) return;
        await deleteJobAction(id);
        load();
    }


    return (
        <div className="mt-10 space-y-6 relative">

            {/* FILTER BOX */}
            <div className="p-4 border rounded-xl space-y-4">

                <input
                    value={q}
                    onChange={(e) => { setQ(e.target.value); setPage(1); }}
                    placeholder="Search jobs..."
                    className="w-full p-3 border rounded-xl"
                />

                {/* Filters */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                    {/* Job Type */}
                    <div className="space-y-1">
                        <div className="text-sm text-slate-600">Job type</div>
                        {["full-time", "part-time", "contract", "internship"].map(t => (
                            <label key={t} className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={filters.type.includes(t)}
                                    onChange={() => toggleMulti("type", t)}
                                />
                                {capitalizeFirstLetter(t.replace("-", " "))}
                            </label>
                        ))}
                    </div>

                    {/* Sector */}
                    <div className="relative">
                        <button
                            onClick={() =>
                                setFilters(f => ({ ...f, openSector: !f.openSector }))
                            }
                            className="w-full h-[70px] p-3 border rounded-xl text-left overflow-y-auto"
                        >
                            {filters.sector.length
                                ? filters.sector.map(s => capitalizeFirstLetter(s.replace("-", " "))).join(", ")
                                : "Select sectors"}
                        </button>

                        {filters.openSector && (
                            <div className="absolute z-10 mt-1 w-full border rounded-xl bg-white shadow-sm max-h-40 overflow-auto">
                                {sectorEnum.map(s => (
                                    <label
                                        key={s}
                                        className="flex items-center gap-2 p-2 text-sm hover:bg-slate-50 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={filters.sector.includes(s)}
                                            onChange={() => toggleMulti("sector", s)}
                                        />
                                        {capitalizeFirstLetter(s.replace("-", " "))}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Experience */}
                    <div className="space-y-1">
                        <div className="text-sm text-slate-600">Experience</div>
                        {["intern", "entry", "junior", "mid", "senior"].map(level => (
                            <label key={level} className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={filters.experience_level.includes(level)}
                                    onChange={() => toggleMulti("experience_level", level)}
                                />
                                {capitalizeFirstLetter(level)}
                            </label>
                        ))}
                    </div>

                    {/* Work Mode */}
                    <div className="space-y-1">
                        <div className="text-sm text-slate-600">Work mode</div>
                        {["remote", "hybrid", "on-site"].map(mode => (
                            <label key={mode} className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={filters.location_type.includes(mode)}
                                    onChange={() => toggleMulti("location_type", mode)}
                                />
                                {capitalizeFirstLetter(mode.replace("-", " "))}
                            </label>
                        ))}
                    </div>
                </div>

                {/* LOCATION INPUT */}
                <div className="space-y-2">
                    <input
                        placeholder="Enter location and press Enter"
                        className="p-3 border rounded-xl w-full"
                        onKeyDown={(e: any) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addLocation(e.target.value);
                                e.target.value = "";
                            }
                        }}
                    />

                    <div className="flex flex-wrap gap-2">
                        {filters.location.map(l => (
                            <span
                                key={l}
                                className="px-3 py-1 border rounded-full text-sm flex items-center gap-1"
                            >
                                {l}
                                <button onClick={() => removeLocation(l)}>✕</button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Salary */}
                <div className="grid grid-cols-2 gap-3">
                    <input
                        type="number"
                        placeholder="Min salary"
                        className="p-3 border rounded-xl"
                        onChange={(e) =>
                            setFilters(f => ({ ...f, salary_min: e.target.value }))
                        }
                    />
                    <input
                        type="number"
                        placeholder="Max salary"
                        className="p-3 border rounded-xl"
                        onChange={(e) =>
                            setFilters(f => ({ ...f, salary_max: e.target.value }))
                        }
                    />
                </div>

                <select
                    className="p-3 border rounded-xl"
                    value={filters.sort}
                    onChange={(e) => setFilters(f => ({ ...f, sort: e.target.value }))}
                >
                    <option value="newest">Sort: Newest</option>
                    <option value="oldest">Sort: Oldest</option>
                </select>

                {/* RESET */}
                <button
                    className="p-3 font-semibold underline"
                    onClick={() => {
                        setFilters({
                            type: [],
                            sector: [],
                            experience_level: [],
                            location: [],
                            location_type: [],
                            salary_min: "",
                            salary_max: "",
                            sort: "newest",
                            openSector: false
                        });
                        setQ("");
                    }}
                >
                    Clear
                </button>
            </div>

            {/* CREATE JOB BUTTON */}
            {canEdit && (
                <button
                    onClick={() => {
                        setSelectedJob(null);
                        setOpenModal(true);
                    }}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl"
                >
                    <Plus size={16} className="inline mr-2" />
                    Create Job
                </button>
            )}

            {/* JOB LIST */}
            {!jobs.length ? (
                <div className="py-8 text-center text-slate-500">No jobs found</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jobs.map(j => (
                        <div key={j._id} className="relative">

                            <JobCard job={j} canEdit={canEdit} />

                            {canEdit && (
                                <div className="absolute top-3 right-3 flex gap-2 z-10">
                                    {/* EDIT */}
                                    <button
                                        onClick={() => {
                                            setSelectedJob(j);
                                            setOpenModal(true);
                                        }}
                                        className="p-4 bg-green-100 rounded-full shadow"
                                    >
                                        <Pencil />
                                    </button>

                                    {/* DELETE */}
                                    <button
                                        onClick={() => handleDeleteJob(j._id)}
                                        className="p-4 bg-red-600 text-white rounded-full shadow"
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* PAGINATION */}
            <div className="flex items-center justify-center gap-2">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1 border rounded-xl text-sm"
                >
                    Prev
                </button>

                {paginationItems.map((it, idx) =>
                    typeof it === "number" ? (
                        <button
                            key={idx}
                            onClick={() => setPage(it)}
                            className={`px-3 py-1 border rounded-xl text-sm ${it === page ? "bg-slate-900 text-white" : ""}`}
                        >
                            {it}
                        </button>
                    ) : (
                        <span key={idx} className="px-2 text-sm text-slate-600">{it}</span>
                    )
                )}

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    className="px-3 py-1 border rounded-xl text-sm"
                >
                    Next
                </button>
            </div>

            {/* JOB FORM MODAL */}
            {openModal && (
                <JobModal
                    job={selectedJob}
                    slug={slug}
                    open={openModal}
                    onOpenChange={setOpenModal}
                />
            )}

        </div>
    );
}

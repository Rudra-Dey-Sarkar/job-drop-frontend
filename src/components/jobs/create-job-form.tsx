"use client";

import { useForm } from "react-hook-form";
import { JobSchema, sectorEnum } from "@/schemas/job/job";
import { zodResolver } from "@hookform/resolvers/zod";
import { createJobAction } from "@/actions/jobs";
import { toast } from "sonner";
import { useState } from "react";
import type { z } from "zod";

export default function CreateJobForm({ slug, onOpenChange }: any) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset
    } = useForm<z.infer<typeof JobSchema>>({
        resolver: zodResolver(JobSchema),
        defaultValues: {
            title: "",
            description: "",
            type: "full-time",
            sector: "other",
            experience_level: "entry",
            locations: { location: [], type: "remote" },
            salary_range: { min: 0, max: 0, currency: "USD", duration: "year" },
            status: "draft"
        }
    });

    const [isLoading, setIsLoading] = useState(false);

    const locations = watch("locations.location") || [];

    const addLocation = (val: string) => {
        if (!val.trim()) return;

        const newLocations = [...new Set([...locations, val.trim()])];

        setValue("locations.location", newLocations);
    };

    const removeLocation = (loc: string) => {
        const updated = locations.filter((l) => l !== loc);
        setValue("locations.location", updated);
    };

    const onSubmit = async (data: z.infer<typeof JobSchema>) => {
        setIsLoading(true);

        const res = await createJobAction({ ...data});

        setIsLoading(false);

        if (!("error" in res)) {
            toast.success("Job created successfully!");
            reset();
            onOpenChange(false);
        } else {
            toast.error(res.error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-2 max-h-[75vh] overflow-y-auto px-1">

            {/* Title */}
            <div>
                <label className="font-medium">Job Title</label>
                <input {...register("title")} className="mt-1 p-3 border rounded-xl w-full" />
                {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
            </div>

            {/* Job Basics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                <div>
                    <label className="font-medium">Job Type</label>
                    <select {...register("type")} className="mt-1 p-3 border rounded-xl w-full">
                        <option value="full-time">Full time</option>
                        <option value="part-time">Part time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                    </select>
                </div>

                <div>
                    <label className="font-medium">Sector</label>
                    <select {...register("sector")} className="mt-1 p-3 border rounded-xl w-full">
                        {sectorEnum.map((s) => (
                            <option key={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="font-medium">Experience Level</label>
                    <select {...register("experience_level")} className="mt-1 p-3 border rounded-xl w-full">
                        <option value="intern">Intern</option>
                        <option value="entry">Entry</option>
                        <option value="junior">Junior</option>
                        <option value="mid">Mid</option>
                        <option value="senior">Senior</option>
                    </select>
                </div>
            </div>

            {/* Locations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="sm:col-span-2">
                    <label className="font-medium">Locations</label>

                    <input
                        placeholder="Enter location and press Enter"
                        className="mt-1 p-3 border rounded-xl w-full"
                        onKeyDown={(e: any) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addLocation(e.target.value);
                                e.target.value = "";
                            }
                        }}
                    />

                    <div className="flex flex-wrap gap-2 mt-2">
                        {locations.map((loc) => (
                            <span
                                key={loc}
                                className="px-3 py-1 border rounded-full text-sm flex items-center gap-1"
                            >
                                {loc}
                                <button type="button" onClick={() => removeLocation(loc)}>✕</button>
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="font-medium">Work Mode</label>
                    <select {...register("locations.type")} className="mt-1 p-3 border rounded-xl w-full">
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="on-site">On-site</option>
                    </select>
                </div>

                <div>
                    <label className="font-medium">STATUS</label>
                    <select {...register("status")} className="mt-1 p-3 border rounded-xl w-full">
                        <option value="draft">Draft</option>
                        <option value="published">Publish</option>
                    </select>
                </div>
            </div>

            {/* Salary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                <div>
                    <label className="font-medium">Min Salary</label>
                    <input
                        type="number"
                        {...register("salary_range.min", { valueAsNumber: true })}
                        className="mt-1 p-3 border rounded-xl w-full"
                    />
                </div>

                <div>
                    <label className="font-medium">Max Salary</label>
                    <input
                        type="number"
                        {...register("salary_range.max", { valueAsNumber: true })}
                        className="mt-1 p-3 border rounded-xl w-full"
                    />
                </div>

                <div>
                    <label className="font-medium">Currency</label>
                    <select {...register("salary_range.currency")} className="mt-1 p-3 border rounded-xl w-full">
                        <option value="USD">USD</option>
                        <option value="INR">INR</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                    </select>
                </div>

                <div>
                    <label className="font-medium">Duration</label>
                    <select {...register("salary_range.duration")} className="mt-1 p-3 border rounded-xl w-full">
                        <option value="month">Per Month</option>
                        <option value="year">Per Year</option>
                    </select>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 text-white py-3 rounded-xl"
            >
                {isLoading ? "Saving..." : "Create Job"}
            </button>
        </form>
    );
}

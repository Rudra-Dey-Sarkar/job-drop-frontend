"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";

import { JobResponse } from "@/types/jobs/http";
import CreateJobForm from "./create-job-form";
import EditJobForm from "./edit-job-form";

type JobFormModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    job: JobResponse | null;
    slug: string;
};

export default function JobModal({ open, onOpenChange, job, slug }: JobFormModalProps) {
    const isEdit = !!job;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white border-none max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Job" : "Create Job"}</DialogTitle>
                    <DialogDescription className="text-slate-600 text-sm">
                        {isEdit
                            ? "Edit the details of this job post."
                            : "Create a new job listing for your company."}
                    </DialogDescription>
                </DialogHeader>

                {isEdit ? (
                    <EditJobForm job={job} slug={slug} onOpenChange={onOpenChange} />
                ) : (
                    <CreateJobForm slug={slug} onOpenChange={onOpenChange} />
                )}
            </DialogContent>
        </Dialog>
    );
}

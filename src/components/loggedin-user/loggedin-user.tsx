"use client"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { removeAuthToken } from "@/lib/cookies/cookies";
import { deleteCookie } from "cookies-next";
import Link from "next/link";
import { toast } from "sonner";


type ModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    slug: string;
}

function LoggedinUser({ open, onOpenChange, slug }: ModalProps) {

    const logout = async () => {
        await removeAuthToken();
        toast.warning("Company user logged out")
        onOpenChange(false);
    }

    return (
        <div className="rounded-lg px-4 py-2 border border-slate-200 text-sm">
            <Popover open={open} onOpenChange={onOpenChange}>
                <PopoverTrigger>User</PopoverTrigger>
                <PopoverContent className="flex flex-col gap-2 bg-white border-none">
                    <button
                        className="rounded-lg px-4 py-2 text-center border border-slate-200 text-sm"
                        onClick={() => toast.message("Account page under construction")}
                    >Account</button>
                    <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/${slug}/careers`}
                        className="rounded-lg px-4 py-2 text-center border border-slate-200 text-sm"
                    >Company Careers</Link>
                    <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/${slug}/edit`}
                        className="rounded-lg px-4 py-2 text-center border border-slate-200 text-sm"
                    >Edit Careers</Link>
                    <button
                        className="rounded-lg px-4 py-2 text-center border border-slate-200 text-sm"
                        onClick={() => logout()}
                    >Sign Out</button>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default LoggedinUser
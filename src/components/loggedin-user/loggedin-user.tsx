"use client"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { removeAuthToken } from "@/lib/cookies/cookies";
import { deleteCookie } from "cookies-next";
import { toast } from "sonner";


type ModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function LoggedinUser({ open, onOpenChange }: ModalProps) {

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
                        className="rounded-lg px-4 py-2 border border-slate-200 text-sm"
                        onClick={() => toast.message("Account page under construction")}
                    >Account</button>
                    <button
                        className="rounded-lg px-4 py-2 border border-slate-200 text-sm"
                        onClick={() => logout()}
                    >Sign Out</button>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default LoggedinUser
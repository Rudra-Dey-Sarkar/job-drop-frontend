"use client"

import { useContext, useEffect, useState } from "react";
import Modal from "../authentication/job-modal";
import { getCookie } from "cookies-next";
import { retrieveUserCompany } from "@/lib/users/retrieve-user-company";
import { UserContext } from "@/contexts/user-context";
import LoggedinUser from "../loggedin-user/loggedin-user";
import Link from "next/link";

function Top() {
    const [open, setOpen] = useState(false);
    const [openUser, setOpenUser] = useState<boolean>(false);
    const [slug, setSlug] = useState<string>("");
    const { user, setUser } = useContext(UserContext)!;

    useEffect(() => {
        (async () => {

                const response = await retrieveUserCompany();

                if (!("error" in response)) {
                    setSlug(response.slug);
                    setUser(true);
                } else {
                    setUser(false);
                }
        })()
    }, [open, openUser])

    return (
        <header className="flex items-center justify-between p-5 border-b border-slate-100 shadow-blue-100">
            <Link href={"/"} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-semibold">JD</div>
                <div className="text-sm font-medium">JobDrop</div>
            </Link>

            <nav className="flex items-center space-x-2">
                {user ?
                    <LoggedinUser open={openUser} onOpenChange={setOpenUser} slug={slug} /> :
                    <div className="flex gap-x-5 justify-center items-center">
                        <a className="text-sm text-slate-600 hover:text-slate-900" href="#">For companies</a>
                        <button
                            className="rounded-lg px-4 py-2 border border-slate-200 text-sm"
                            onClick={() => setOpen(true)}
                        >Sign in</button>
                    </div>
                }
            </nav>

            {open &&
                <Modal open={open} onOpenChange={setOpen} />
            }
        </header>
    )
}

export default Top

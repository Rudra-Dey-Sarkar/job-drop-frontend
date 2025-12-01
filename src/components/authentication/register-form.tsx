"use client";
import { CompanyPayload } from "@/types/company/module";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {RegisterSchema} from "@/schemas/job/job";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

export default function RegisterForm({ onRegisterSubmit }: { onRegisterSubmit: (data: any) => Promise<void> }) {

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const form = useForm<CompanyPayload>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            description: "",
        },
    });



    return (
        <form onSubmit={form.handleSubmit(onRegisterSubmit)} className="space-y-4 max-w-md mx-auto p-5">
            <input
                {...form.register("name")}
                type="text"
                placeholder="Company name"
                className="w-full p-2 border rounded-xl" />
            <input
                {...form.register("email")}
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-xl" />
            <div className="flex w-full border rounded-xl pr-2">
                <input
                    {...form.register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full p-2 rounded-l-xl"
                />
                <button onClick={(e) => {
                    e.stopPropagation();
                    setShowPassword(prev => prev ? false : true)
                }
                } type="button"> {showPassword ? <Eye size={25} /> : <EyeClosed size={25} />}</button>
            </div>
            <textarea
                {...form.register("description")}
                placeholder="Company description"
                className="w-full p-2 border rounded-xl" />

            <button type="submit" className="w-full p-3 rounded-xl bg-slate-900 text-white text-sm">
                Sign Up
            </button>
        </form>
    );
}

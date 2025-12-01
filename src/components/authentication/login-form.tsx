"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {LoginSchema } from "@/schemas/job/job";
import { z } from "zod";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

export default function LoginForm({ onLoginSubmit }: { onLoginSubmit: (data: any) => Promise<void> }) {

    const [showPassword, setShowPassword] = useState<boolean>(false);
    
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });


    return (
        <form onSubmit={form.handleSubmit(onLoginSubmit)} className="space-y-4 max-w-md mx-auto p-5">
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

            <button type="submit" className="w-full p-3 rounded-xl bg-slate-900 text-white text-sm">
                Sign In
            </button>
        </form>
    );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas/authentication/authentication";
import { z } from "zod";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

export default function LoginForm({
    onLoginSubmit,
}: {
    onLoginSubmit: (data: any) => Promise<void>;
}) {
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { register, handleSubmit, formState: { errors } } = form;

    return (
        <form
            onSubmit={handleSubmit(onLoginSubmit)}
            className="space-y-6 max-w-md mx-auto mt-2 mb-5 px-1"
        >
            {/* EMAIL */}
            <div>
                <label className="font-medium">Email</label>
                <input
                    {...register("email")}
                    type="email"
                    placeholder="Enter email"
                    className="w-full mt-1 p-3 border rounded-xl"
                />
                {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
            </div>

            {/* PASSWORD */}
            <div>
                <label className="font-medium">Password</label>
                <div className="flex items-center w-full border rounded-xl pr-3 mt-1">
                    <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        className="w-full p-3 rounded-l-xl outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="text-slate-700"
                    >
                        {showPassword ? <Eye size={22} /> : <EyeClosed size={22} />}
                    </button>
                </div>

                {errors.password && (
                    <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                )}
            </div>

            {/* SUBMIT */}
            <button
                type="submit"
                className="w-full bg-slate-900 text-white py-3 rounded-xl text-sm"
            >
                Sign In
            </button>
        </form>
    );
}

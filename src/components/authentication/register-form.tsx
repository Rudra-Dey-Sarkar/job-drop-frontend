"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas/authentication/authentication";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import type { CompanyPayload } from "@/types/company/module";

export default function RegisterForm({
    onRegisterSubmit,
}: {
    onRegisterSubmit: (data: any) => Promise<void>;
}) {
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<CompanyPayload>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            description: "",
        },
    });

    const { register, handleSubmit, formState: { errors } } = form;

    return (
        <form
            onSubmit={handleSubmit(onRegisterSubmit)}
            className="space-y-6 max-w-md mx-auto mt-2 mb-5 px-1"
        >
            {/* COMPANY NAME */}
            <div>
                <label className="font-medium">Company Name</label>
                <input
                    {...register("name")}
                    type="text"
                    placeholder="Enter company name"
                    className="w-full mt-1 p-3 border rounded-xl"
                />
                {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
            </div>

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
                        className="text-slate-700"
                        onClick={() => setShowPassword((v) => !v)}
                    >
                        {showPassword ? <Eye size={22} /> : <EyeClosed size={22} />}
                    </button>
                </div>

                {errors.password && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* DESCRIPTION */}
            <div>
                <label className="font-medium">Company Description</label>
                <textarea
                    {...register("description")}
                    placeholder="Describe your company"
                    className="w-full mt-1 p-3 border rounded-xl min-h-[90px]"
                />
                {errors.description && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.description.message}
                    </p>
                )}
            </div>

            {/* SUBMIT */}
            <button
                type="submit"
                className="w-full bg-slate-900 text-white py-3 rounded-xl text-sm"
            >
                Sign Up
            </button>
        </form>
    );
}

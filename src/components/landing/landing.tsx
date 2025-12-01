"use client"
import CompanyCarousel from "../company-carousel/company-carousel";
import { CompanyResponse } from "@/types/company/http";

function Landing({ companies }: { companies: CompanyResponse[] }) {
    return (
        <main className="min-h-screen max-w-7xl mx-auto p-6">

            <section className="mt-12">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-center sm:text-left">Land your dream job or hire top talents</h1>
                <p className="mt-3 text-slate-600 max-w-2xl text-center sm:text-left">A minimal, branded careers experience — polished, fast, and focused on results.</p>
            </section>

            <section className="mt-10">
                <h2 className="text-lg font-medium text-slate-700">Trusted by</h2>
                <CompanyCarousel companies={companies} />
            </section>
        </main>
    )
}

export default Landing
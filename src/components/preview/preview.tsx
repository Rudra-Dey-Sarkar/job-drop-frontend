"use client";

import { CompanyResponse } from "@/types/company/http";
import { PageResponse } from "@/types/pages/http";
import JobList from "../jobs/job-list";
import { SectionImages } from "../section-images/section-images";
import { useEffect, useState } from "react";
import { retrievePages } from "@/lib/pages/retrieve-page";
import { getSignedURL } from "@/lib/uploads/get-signed-url";
import { formatVideoURLForBrand } from "@/utils/formate-video-url-for-brand";

export default function Preview({
    company,
    slug,
}: {
    company: CompanyResponse;
    slug: string;
}) {
    const [brandPage, setBrandPage] = useState<PageResponse | null>(null);

    const brand = brandPage?.brand || undefined;
    const sections = brandPage?.sections || [];

    const primary = brand?.primary_color || "#0f172a";
    const secondary = brand?.secondary_color || "#475569";

    useEffect(() => {
        (async () => {

            const response = await retrievePages(slug);
            if (!(response===null || "error" in response)) {

                // SIGN --- BANNER URL
                let bannerSigned = null;
                if (response.brand?.banner_url) {
                    const res = await getSignedURL(response.brand.banner_url);
                    if (!(res instanceof Error)) {
                        bannerSigned = res.signedUrl;
                    }
                }

                // SIGN --- LOGO URL
                let logoSigned = null;
                if (response.brand?.logo_url) {
                    const res = await getSignedURL(response.brand.logo_url);
                    if (!(res instanceof Error)) {
                        logoSigned = res.signedUrl;
                    }
                }

                // SIGN --- SECTION IMAGES
                const signedSections = await Promise.all(
                    (response.sections || []).map(async (s) => {
                        const imgs = await Promise.all(
                            (s.images || []).map(async (img) => {
                                const res = await getSignedURL(img);
                                return !(res instanceof Error) ? res.signedUrl : img;
                            })
                        );
                        return { ...s, images: imgs };
                    })
                );

                setBrandPage({
                    ...response,
                    brand: {
                        ...response.brand,
                        banner_url: bannerSigned || response.brand?.banner_url,
                        logo_url: logoSigned || response.brand?.logo_url,
                    },
                    sections: signedSections,
                });
            }

        })();
    }, []);

    return (
        <div className="min-h-screen max-w-7xl mx-auto">

            {/* BANNER */}
            <div className="relative w-full h-64 md:h-80 rounded-b-2xl overflow-hidden">
                <img
                    src={brand?.banner_url || "/placeholder-banner.jpg"}
                    className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 backdrop-blur-[2px] bg-black/10" />

                {/* HEADING */}
                <div className="absolute bottom-6 left-6 flex items-center gap-4">
                    {/* LOGO */}
                    {brand?.logo_url && (
                        <img
                            src={brand.logo_url}
                            className="w-16 h-16 rounded-xl object-cover border bg-white p-1 shadow-sm"
                        />
                    )}

                    <div>
                        <h1
                            className="text-3xl font-semibold text-white drop-shadow-lg"
                            style={{ color: primary }}
                        >
                            {company.name} Careers
                        </h1>

                        <p
                            className="text-sm"
                            style={{ color: brand?.secondary_color ?? "#475569" }}>
                            Join our team and make an impact.
                        </p>
                    </div>
                </div>
            </div>

            {/* COMPANY INFO */}
            <section className="px-6 mt-10 mb-14">
                <h2 className="text-2xl font-semibold" style={{ color: primary }}>
                    {company.name}
                </h2>

                {company.description && (
                    <p className="mt-3 text-slate-600 max-w-3xl leading-relaxed">
                        {company.description}
                    </p>
                )}

                {/* CULTURE VIDEO */}
                {brand?.culture_video_url && (
                    <div className="mt-8 rounded-xl overflow-hidden border shadow-sm">
                        {brand.culture_video_url.includes("youtube") ? (
                            <iframe
                                src={formatVideoURLForBrand(brand.culture_video_url)}
                                className="w-full h-64 md:h-96"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <video
                                src={brand.culture_video_url}
                                className="w-full h-64 md:h-96 object-cover"
                                controls
                            />
                        )}
                    </div>
                )}
            </section>

            {/* SECTIONS */}
            {sections.length > 0 ? (
                <div className="px-6 space-y-14">
                    {sections.map((section) => (
                        <div key={section.id} className="space-y-4">
                            {section.title && (
                                <h3
                                    className="text-xl font-semibold"
                                    style={{ color: primary }}
                                >
                                    {section.title}
                                </h3>
                            )}

                            {section.content && (
                                <p className="text-slate-600 max-w-3xl leading-relaxed whitespace-pre-line">
                                    {section.content}
                                </p>
                            )}

                            {section.images?.length > 0 && (
                                <SectionImages images={section.images} secondary={secondary} />
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="px-6 text-slate-600 max-w-3xl leading-relaxed mb-14">
                    <h3 className="text-xl font-semibold mb-3" style={{ color: primary }}>
                        Working With Us
                    </h3>
                    <p>
                        We build meaningful products while fostering a culture of learning,
                        collaboration, and innovation.
                    </p>
                </div>
            )}

            {/* JOBS */}
            <div className="px-6 mt-12 pb-20">
                <p
                    className="text-center text-2xl font-semibold pt-5 underline"
                    style={{ color: primary }}
                >
                    Open Positions
                </p>
                <JobList slug={slug} />
            </div>
        </div>
    );
}

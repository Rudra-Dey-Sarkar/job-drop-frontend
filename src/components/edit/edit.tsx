"use client";

import { CompanyResponse } from "@/types/company/http";
import { PageResponse } from "@/types/pages/http";
import { PagePayload } from "@/types/pages/module";
import JobList from "../jobs/job-list";
import { SectionImages } from "../section-images/section-images";
import { useEffect, useState } from "react";
import { retrievePages } from "@/lib/pages/retrieve-page";
import { uploadFiles } from "@/lib/uploads/upload-files";
import { Eye, Pencil, Save, Upload as UploadIcon } from "lucide-react";
import { v4 as uuidv4 } from 'uuid'
import { editPagesAction } from "@/actions/pages";
import { getSignedURL } from "@/lib/uploads/get-signed-url";
import Link from "next/link";
import { toast } from "sonner";
import { formatVideoURLForBrand } from "@/utils/formate-video-url-for-brand";

export default function Edit({
    company,
    slug,
}: {
    company: CompanyResponse;
    slug: string;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [brandPage, setBrandPage] = useState<PageResponse | null>(null);

    const [editable, setEditable] = useState<PagePayload>({
        brand: {},
        sections: [],
    });

    useEffect(() => {
        (async () => {

            const response = await retrievePages(slug);
            if (!("error" in response)) {

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

                setEditable({
                    brand: {
                        primary_color: response.brand?.primary_color || null,
                        secondary_color: response.brand?.secondary_color || null,
                        logo_url: response.brand?.logo_url || null,
                        banner_url: response.brand?.banner_url || null,
                        culture_video_url: response.brand?.culture_video_url || null,
                    },
                    sections: response.sections,
                    status: response.status,
                });

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
    }, [isEditing]);

    if (!brandPage) return null;

    const uploadHandler = async (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "logo" | "banner" | "section",
        sectionId?: string
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        let path = "";

        if (type === "logo") path = `logos/${slug}-logo-${uuidv4()}`;
        if (type === "banner") path = `banners/${slug}-banner-${uuidv4()}`;
        if (type === "section" && sectionId)
            path = `sections/${slug}-${sectionId}-${uuidv4()}`;

        const res = await uploadFiles("company", path, file);

        if (!(res instanceof Error)) {
            if (type === "logo") {
                setEditable((prev) => ({
                    ...prev,
                    brand: { ...prev.brand, logo_url: res.fullPath },
                }));

                setBrandPage((prev) => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        brand: { ...prev.brand, logo_url: URL.createObjectURL(file) },
                    };
                });
            }
            if (type === "banner") {
                setEditable((prev) => ({
                    ...prev,
                    brand: { ...prev.brand, banner_url: res.fullPath },
                }));

                setBrandPage((prev) => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        brand: { ...prev.brand, banner_url: URL.createObjectURL(file) },
                    };
                });
            }
            if (type === "section" && sectionId) {
                setEditable((prev) => ({
                    ...prev,
                    sections: prev.sections?.map((s) =>
                        s.id === sectionId
                            ? { ...s, images: [...(s.images || []), res.fullPath] }
                            : s
                    ),
                }));

                setBrandPage((prev) => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        sections: prev.sections?.map((s) =>
                            s.id === sectionId
                                ? { ...s, images: [...(s.images || []), URL.createObjectURL(file)] }
                                : s
                        ),
                    }
                });
            }
        }
    };

    const handleSave = async () => {

        const response = await editPagesAction(editable);
        if (!("error" in response)) {
            toast.success("Page updated successfully")
        }
        setIsEditing(false);
    };

    return (
        <div className="relative min-h-screen max-w-7xl mx-auto">
            <button
                onClick={() => {
                    if (isEditing) handleSave();
                    else setIsEditing(true);
                }}
                className="absolute z-10 right-5 top-5 bg-white p-2 rounded-full shadow"
            >
                {isEditing ? <Save /> : <Pencil />}
            </button>

            {/* ALWAYS SHOW STATUS LABEL */}
            {!isEditing && <div className="absolute z-10 right-5 top-20 bg-white px-4 py-2 rounded-xl shadow border text-sm">
                Status: <span className="font-medium">{editable.status?.toUpperCase()}</span>
            </div>}

            {/* STATUS DROPDOWN */}
            {isEditing && (
                <div className="absolute z-10 right-5 top-20 bg-white p-3 rounded-xl shadow border">
                    <select
                        className="p-2 border rounded-xl"
                        value={editable.status}
                        onChange={(e) =>
                            setEditable((p) => ({
                                ...p,
                                status: e.target.value as "published" | "draft",
                            }))
                        }
                    >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
            )}

            {/* PREVIEW */}
            {!isEditing && <Link href={`/${slug}/preview`} className="absolute z-10 right-5 top-64 bg-white px-4 py-2 rounded-xl text-sm">
                <span className="font-medium flex items-center gap-2"><Eye />Preview Page</span>
            </Link>}

            {/* BANNER */}
            <div className="relative w-full h-64 md:h-80 rounded-b-2xl overflow-hidden">
                <img
                    src={brandPage.brand?.banner_url || "/placeholder-banner.jpg"}
                    className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 backdrop-blur-[2px] bg-black/10" />

                {isEditing && (
                    <label className="absolute right-5 bottom-5 bg-white p-2 rounded-full shadow cursor-pointer">
                        <UploadIcon />
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) => uploadHandler(e, "banner")}
                        />
                    </label>
                )}

                {/* HEADING */}
                <div className="absolute bottom-6 left-6 flex items-center gap-4">
                    {/* LOGO */}
                    {brandPage.brand?.logo_url && (
                        <img
                            src={brandPage.brand?.logo_url}
                            className="w-16 h-16 rounded-xl object-cover border bg-white p-1 shadow-sm"
                        />
                    )}

                    {isEditing && (
                        <label className="absolute z-10 -top-2 left-10 bg-white p-1 rounded-full shadow cursor-pointer">
                            <UploadIcon size={20} />
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => uploadHandler(e, "logo")}
                            />
                        </label>
                    )}

                    <div>
                        <h1
                            className="text-3xl font-semibold drop-shadow-lg"
                            style={{ color: brandPage.brand?.primary_color ?? "#0f172a" }}
                        >
                            {company.name} Careers
                        </h1>
                        <p
                            className={`text-sm`}
                            style={{ color: brandPage.brand?.secondary_color ?? "#475569" }}
                        >
                            Join our team and make an impact.
                        </p>
                    </div>
                </div>
            </div>

            {/* COLOR PICKERS */}
            {isEditing && (
                <div className="px-6 mt-6 flex flex-col md:flex-row gap-6">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium w-32">Primary color</label>
                        <input
                            type="color"
                            style={{ color: brandPage.brand?.primary_color ?? "#0f172a" }}
                            onChange={(e) =>
                                setEditable((p) => ({
                                    ...p,
                                    brand: { ...p.brand, primary_color: e.target.value },
                                }))
                            }
                            className="h-10 w-20 border rounded-xl cursor-pointer"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium w-32">Secondary color</label>
                        <input
                            type="color"
                            style={{ color: brandPage.brand?.secondary_color ?? "#475569" }}

                            onChange={(e) =>
                                setEditable((p) => ({
                                    ...p,
                                    brand: { ...p.brand, secondary_color: e.target.value },
                                }))
                            }
                            className="h-10 w-20 border rounded-xl cursor-pointer"
                        />
                    </div>
                </div>
            )}

            {/* COMPANY INFO */}
            <section className="px-6 mt-10 mb-14">
                <h2
                    className="text-2xl font-semibold"
                    style={{ color: brandPage.brand?.primary_color ?? "#0f172a" }}
                >
                    {company.name}
                </h2>

                {company.description && (
                    <p className="mt-3 text-slate-600 max-w-3xl leading-relaxed">
                        {company.description}
                    </p>
                )}

                {/* CULTURE VIDEO */}
                {brandPage.brand?.culture_video_url && (
                    <div className="mt-8 rounded-xl overflow-hidden border shadow-sm">
                        {brandPage.brand?.culture_video_url.includes("youtube") ? (
                            <iframe
                                src={formatVideoURLForBrand(brandPage.brand.culture_video_url)}
                                className="w-full h-64 md:h-96"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <video
                                src={brandPage.brand?.culture_video_url}
                                className="w-full h-64 md:h-96 object-cover"
                                controls
                            />
                        )}
                    </div>
                )}

                {/* Change culture video when editing */}
                {isEditing && (
                    <input
                        placeholder="Paste culture video URL"
                        className="mt-3 p-3 border rounded-xl w-full"
                        value={editable.brand?.culture_video_url || ""}
                        onChange={(e) =>
                            setEditable((p) => ({
                                ...p,
                                brand: { ...p.brand, culture_video_url: e.target.value },
                            }))
                        }
                    />
                )}
            </section>

            {/* SECTIONS */}
            <div className="px-6 space-y-14">
                {(isEditing ? editable.sections : brandPage.sections)?.map((section) => (

                    <div key={section.id} className="space-y-4 border-b pb-6">
                        {/* DELETE ENTIRE SECTION */}
                        {isEditing && (
                            <button
                                className="text-red-600 text-sm underline"
                                onClick={() =>
                                    setEditable((prev) => ({
                                        ...prev,
                                        sections: prev.sections?.filter((s) => s.id !== section.id),
                                    }))
                                }
                            >
                                Remove Section
                            </button>
                        )}

                        {/* Title */}
                        {isEditing ? (
                            <input
                                className="p-2 border rounded-xl w-full"
                                value={section.title || ""}
                                onChange={(e) =>
                                    setEditable((prev) => ({
                                        ...prev,
                                        sections: prev.sections?.map((s) =>
                                            s.id === section.id ? { ...s, title: e.target.value } : s
                                        ),
                                    }))
                                }
                            />
                        ) : (
                            <h3
                                className="text-xl font-semibold"
                                style={{ color: brandPage.brand?.primary_color ?? "#0f172a" }}
                            >
                                {section.title}
                            </h3>
                        )}

                        {/* Content */}
                        {isEditing ? (
                            <textarea
                                className="p-3 border rounded-xl w-full"
                                rows={4}
                                value={section.content || ""}
                                onChange={(e) =>
                                    setEditable((prev) => ({
                                        ...prev,
                                        sections: prev.sections?.map((s) =>
                                            s.id === section.id ? { ...s, content: e.target.value } : s
                                        ),
                                    }))
                                }
                            />
                        ) : (
                            <p className="text-slate-600 max-w-3xl leading-relaxed whitespace-pre-line">
                                {section.content}
                            </p>
                        )}

                        {/* Images */}
                        <div className="space-y-2">
                            {/* IMAGE VIEWER */}
                            <SectionImages
                                images={(brandPage.sections.filter((brandSection) => brandSection.id === section.id).map((section) => section.images))[0] || []}
                                secondary={brandPage.brand?.secondary_color ?? "#475569"}
                            />

                            {/* DELETE SECTION IMAGES */}
                            {isEditing && section.images && section.images.length > 0 && (
                                <div className="flex flex-wrap gap-3 mt-3">
                                    {((brandPage.sections.filter((brandSection) => brandSection.id === section.id).map((section) => section.images))[0] || []).map((img) => (
                                        <div key={img} className="relative">
                                            <img
                                                src={img}
                                                className="w-24 h-24 object-cover rounded-xl border"
                                            />

                                            <button
                                                className="absolute -top-2 -right-2 bg-white border text-xs px-1 rounded-full shadow cursor-pointer"
                                                onClick={() =>
                                                    setEditable((prev) => ({
                                                        ...prev,
                                                        sections: prev.sections?.map((s) =>
                                                            s.id === section.id
                                                                ? {
                                                                    ...s,
                                                                    images: s.images?.filter((i) => i !== img),
                                                                }
                                                                : s
                                                        ),
                                                    }))
                                                }
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Upload images for this section */}
                        {isEditing && (
                            <label className="inline-flex items-center gap-2 px-3 py-2 border rounded-xl cursor-pointer">
                                <UploadIcon size={18} />
                                Upload section image
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => uploadHandler(e, "section", section.id)}
                                />
                            </label>
                        )}
                    </div>
                ))}

                {/* ADD SECTION BUTTON */}
                {isEditing && (
                    <div className="px-6 mt-10 flex justify-center">
                        <button
                            className="px-6 py-3 bg-slate-900 text-white rounded-xl shadow hover:bg-slate-800 text-sm"
                            onClick={() =>
                                setEditable((prev) => ({
                                    ...prev,
                                    sections: [
                                        ...(prev.sections || []),
                                        {
                                            id: uuidv4(),
                                            title: "",
                                            content: "",
                                            images: [],
                                        },
                                    ],
                                }))
                            }
                        >
                            + Add Section
                        </button>
                    </div>
                )}

            </div>

            {/* JOBS */}
            <div className="px-6 mt-12 pb-20">
                <p
                    className="text-center text-2xl font-semibold pt-5 underline"
                    style={{ color: brandPage.brand?.primary_color ?? "#0f172a" }}
                >
                    Open Positions
                </p>
                <JobList slug={slug} />
            </div>
        </div>
    );
}

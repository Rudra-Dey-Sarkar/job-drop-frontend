"use client"

import { useState } from "react";

export function SectionImages({
    images,
    secondary,
}: {
    images: string[];
    secondary: string;
}) {
    const isCarousel = images.length > 2;
    const [index, setIndex] = useState<number>(0);

    if (!isCarousel) {
        // Just grid for 1–2 images
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {images.map((img, i) => (
                    <img
                        key={i}
                        src={img}
                        className="w-full h-60 object-cover rounded-xl border"
                    />
                ))}
            </div>
        );
    }

    // Carousel if >2 images
    const next = () => setIndex((prev) => (prev + 1) % images.length);
    const prev = () =>
        setIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="relative w-full h-60 md:h-72 overflow-hidden rounded-xl border shadow-sm">

            {/* Image */}
            <img
                src={images[index]}
                className="w-full h-full object-cover transition-all duration-300"
            />

            {/* Controls */}
            <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg text-white shadow"
                 style={{ borderColor: secondary }}
            >
                ❮
            </button>

            <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg text-white shadow"
                 style={{ borderColor: secondary }}
            >
                ❯
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${i === index ? "opacity-100" : "opacity-40"
                            }`}
                         style={{ borderColor: secondary }}
                    />
                ))}
            </div>
        </div>
    );
}
"use client";

import { X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
    src: string;
    alt: string;
    className?: string;
    thumbnailClassName?: string;
}

export default function ExpandableImage({ src, alt, className, thumbnailClassName }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleEscape = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") setIsOpen(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isOpen, handleEscape]);

    return (
        <>
            {/* Thumbnail */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={`group relative cursor-zoom-in ${className || ""}`}
            >
                <div className={`relative overflow-hidden rounded-lg ${thumbnailClassName || "w-24 h-24"}`}>
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                </div>
                {/* Zoom hint overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors duration-200 rounded-lg">
                    <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" size={24} />
                </div>
            </button>

            {/* Lightbox */}
            {mounted && isOpen && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setIsOpen(false)}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" />

                    {/* Close button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    {/* Full size image */}
                    <div
                        className="relative max-w-[90vw] max-h-[90vh] animate-in zoom-in-95 fade-in duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={src}
                            alt={alt}
                            width={1200}
                            height={800}
                            className="object-contain max-h-[90vh] w-auto h-auto rounded-lg"
                        />
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

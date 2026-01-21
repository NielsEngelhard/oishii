"use client"

import { ChefHat } from "lucide-react";
import { useState } from "react";

export default function Logo() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Icon Container */}
            <div className="relative">
                {/* Glow effect */}
                <div
                    className={`absolute inset-0 bg-primary rounded-xl blur-md transition-opacity duration-500 ${
                        isHovered ? "opacity-60" : "opacity-0"
                    }`}
                />

                {/* Steam particles */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className={`absolute w-1.5 h-1.5 rounded-full bg-primary/60 transition-all duration-700 ${
                                isHovered ? "opacity-100" : "opacity-0"
                            }`}
                            style={{
                                left: `${(i - 1) * 8}px`,
                                animation: isHovered
                                    ? `steam 1.2s ease-out infinite ${i * 0.2}s`
                                    : "none",
                            }}
                        />
                    ))}
                </div>

                {/* Main icon */}
                <div
                    className={`relative bg-primary text-background rounded-xl p-2 transition-all duration-300 ${
                        isHovered ? "scale-110 rotate-[-8deg]" : ""
                    }`}
                >
                    <ChefHat
                        size={20}
                        className={`transition-transform duration-300 ${
                            isHovered ? "animate-bounce-subtle" : ""
                        }`}
                    />
                </div>
            </div>

            {/* Text with shimmer effect */}
            <div className="relative overflow-hidden">
                <span
                    className={`text-xl tracking-wider transition-all duration-300 ${
                        isHovered ? "tracking-widest" : ""
                    }`}
                    style={{ fontFamily: "var(--font-special)" }}
                >
                    Oishii
                </span>

                {/* Shimmer overlay */}
                <div
                    className={`absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent transition-transform duration-700 ease-out ${
                        isHovered ? "translate-x-full" : "-translate-x-full"
                    }`}
                    style={{ width: "200%" }}
                />
            </div>

            {/* Keyframe styles */}
            <style jsx>{`
                @keyframes steam {
                    0% {
                        transform: translateY(0) scale(1);
                        opacity: 0.7;
                    }
                    50% {
                        opacity: 0.5;
                    }
                    100% {
                        transform: translateY(-16px) scale(0.5);
                        opacity: 0;
                    }
                }

                @keyframes bounce-subtle {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-2px);
                    }
                }

                .animate-bounce-subtle {
                    animation: bounce-subtle 0.4s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}
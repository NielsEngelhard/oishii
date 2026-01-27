"use client";

import { EXPLORE_ROUTE, SIGNUP_ROUTE } from "@/app/routes";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
    ChefHat,
    Link2,
    FileText,
    ImagePlus,
    Globe,
    Share2,
    Tags,
    Users,
    Scale,
    StickyNote,
    Sparkles,
    ArrowRight,
    Rocket,
} from "lucide-react";
import clsx from "clsx";

function useInView(threshold = 0.1) {
    const ref = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                }
            },
            { threshold }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [threshold]);

    return { ref, isInView };
}

function FloatingElements() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating food emojis */}
            {["🍕", "🍜", "🥗", "🍰", "🍳", "🥑"].map((emoji, i) => (
                <div
                    key={i}
                    className="absolute text-4xl opacity-20 animate-float"
                    style={{
                        left: `${10 + i * 15}%`,
                        top: `${20 + (i % 3) * 25}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: `${4 + i * 0.5}s`,
                    }}
                >
                    {emoji}
                </div>
            ))}
        </div>
    );
}

function HeroSection() {
    const t = useTranslations("home.hero");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 gradient-hero" />
            <FloatingElements />

            <div className="relative z-10 container mx-auto px-4 py-16 text-center">
                {/* Tagline badge */}
                <div
                    className={clsx(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 transition-all duration-700",
                        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                >
                    <ChefHat size={18} />
                    <span className="text-sm font-medium">{t("tagline")}</span>
                </div>

                {/* Main title */}
                <h1
                    className={clsx(
                        "text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 transition-all duration-700 delay-100",
                        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                >
                    {t("title")}
                    <br />
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {t("titleHighlight")}
                    </span>
                </h1>

                {/* Description */}
                <p
                    className={clsx(
                        "text-lg md:text-xl text-muted max-w-2xl mx-auto mb-8 transition-all duration-700 delay-200",
                        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                >
                    {t("description")}
                </p>

                {/* CTA buttons */}
                <div
                    className={clsx(
                        "flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300",
                        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                >
                    <Link href={SIGNUP_ROUTE}>
                        <Button
                            text={t("getStarted")}
                            Icon={Rocket}
                            variant="primary"
                            size="lg"
                            className="shadow-warm-lg hover:shadow-warm-xl"
                        />
                    </Link>
                    <Link href={EXPLORE_ROUTE}>
                        <Button
                            text={t("exploreRecipes")}
                            Icon={ArrowRight}
                            variant="skeleton"
                            size="lg"
                        />
                    </Link>
                </div>

                {/* Hero image/illustration placeholder */}
                <div
                    className={clsx(
                        "mt-16 relative transition-all duration-1000 delay-500",
                        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    )}
                >
                    <div className="relative mx-auto max-w-4xl">
                        {/* Decorative gradient blur */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-3xl blur-3xl" />

                        {/* Mock app preview */}
                        <div className="relative bg-card rounded-2xl shadow-warm-xl border border-border overflow-hidden">
                            <div className="h-8 bg-secondary/20 flex items-center px-4 gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="p-8 flex gap-6">
                                {/* Recipe cards preview */}
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className={clsx(
                                            "flex-1 bg-background rounded-xl p-4 shadow-warm transition-all duration-500",
                                            i === 2 ? "scale-105 shadow-warm-lg" : "opacity-80"
                                        )}
                                        style={{ animationDelay: `${i * 200}ms` }}
                                    >
                                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-3 flex items-center justify-center">
                                            <span className="text-3xl">
                                                {["🍕", "🍜", "🥗"][i - 1]}
                                            </span>
                                        </div>
                                        <div className="h-3 bg-secondary/30 rounded-full w-3/4 mb-2" />
                                        <div className="h-2 bg-secondary/20 rounded-full w-1/2" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-muted/30 rounded-full flex justify-center pt-2">
                    <div className="w-1.5 h-3 bg-muted/50 rounded-full animate-scroll" />
                </div>
            </div>
        </section>
    );
}

function AISection() {
    const t = useTranslations("home.ai");
    const { ref, isInView } = useInView();

    const features = [
        {
            icon: Link2,
            gradient: "from-blue-500 to-cyan-500",
            title: t("features.scrape.title"),
            description: t("features.scrape.description"),
        },
        {
            icon: FileText,
            gradient: "from-purple-500 to-pink-500",
            title: t("features.format.title"),
            description: t("features.format.description"),
        },
        {
            icon: ImagePlus,
            gradient: "from-orange-500 to-yellow-500",
            title: t("features.enhance.title"),
            description: t("features.enhance.description"),
        },
    ];

    return (
        <section ref={ref} className="py-24 bg-gradient-to-b from-background to-background-secondary">
            <div className="container mx-auto px-4">
                {/* Section header */}
                <div className="text-center mb-16">
                    <div
                        className={clsx(
                            "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-600 mb-4 transition-all duration-700",
                            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}
                    >
                        <Sparkles size={18} />
                        <span className="text-sm font-medium">{t("badge")}</span>
                    </div>
                    <h2
                        className={clsx(
                            "text-3xl md:text-5xl font-bold mb-4 transition-all duration-700 delay-100",
                            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}
                    >
                        {t("title")}
                    </h2>
                    <p
                        className={clsx(
                            "text-lg text-muted max-w-2xl mx-auto transition-all duration-700 delay-200",
                            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}
                    >
                        {t("description")}
                    </p>
                </div>

                {/* AI Features grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className={clsx(
                                "group relative bg-card rounded-2xl p-8 shadow-warm border border-border transition-all duration-700 hover:shadow-warm-lg hover:-translate-y-1",
                                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            )}
                            style={{ transitionDelay: `${(i + 1) * 150}ms` }}
                        >
                            {/* Icon */}
                            <div
                                className={clsx(
                                    "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110",
                                    feature.gradient
                                )}
                            >
                                <feature.icon className="w-7 h-7 text-white" />
                            </div>

                            <h3 className="text-xl font-bold mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-muted">
                                {feature.description}
                            </p>

                            {/* Decorative gradient */}
                            <div
                                className={clsx(
                                    "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300",
                                    feature.gradient
                                )}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeaturesSection() {
    const t = useTranslations("home.features");
    const { ref, isInView } = useInView();

    const features = [
        { icon: Globe, color: "bg-blue-100 text-blue-600", title: t("list.multilingual.title"), description: t("list.multilingual.description") },
        { icon: Share2, color: "bg-green-100 text-green-600", title: t("list.share.title"), description: t("list.share.description") },
        { icon: Tags, color: "bg-orange-100 text-orange-600", title: t("list.organize.title"), description: t("list.organize.description") },
        { icon: Users, color: "bg-pink-100 text-pink-600", title: t("list.friends.title"), description: t("list.friends.description") },
        { icon: Scale, color: "bg-purple-100 text-purple-600", title: t("list.servings.title"), description: t("list.servings.description") },
        { icon: StickyNote, color: "bg-yellow-100 text-yellow-600", title: t("list.notes.title"), description: t("list.notes.description") },
    ];

    return (
        <section ref={ref} className="py-24 bg-background-secondary">
            <div className="container mx-auto px-4">
                {/* Section header */}
                <div className="text-center mb-16">
                    <div
                        className={clsx(
                            "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4 transition-all duration-700",
                            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}
                    >
                        <span className="text-sm font-medium">{t("badge")}</span>
                    </div>
                    <h2
                        className={clsx(
                            "text-3xl md:text-5xl font-bold mb-4 transition-all duration-700 delay-100",
                            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}
                    >
                        {t("title")}
                    </h2>
                    <p
                        className={clsx(
                            "text-lg text-muted max-w-2xl mx-auto transition-all duration-700 delay-200",
                            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}
                    >
                        {t("description")}
                    </p>
                </div>

                {/* Features grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className={clsx(
                                "group bg-card rounded-2xl p-6 shadow-warm border border-border transition-all duration-700 hover:shadow-warm-lg hover:-translate-y-1",
                                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            )}
                            style={{ transitionDelay: `${(i + 1) * 100}ms` }}
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className={clsx(
                                        "w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                                        feature.color
                                    )}
                                >
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted text-sm">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function HomePage() {
    return (
        <div className="w-full">
            <HeroSection />
            <AISection />
            <FeaturesSection />

            {/* Custom styles for animations */}
            <style jsx global>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-20px) rotate(5deg);
                    }
                }

                @keyframes scroll {
                    0%, 100% {
                        transform: translateY(0);
                        opacity: 1;
                    }
                    50% {
                        transform: translateY(6px);
                        opacity: 0.5;
                    }
                }

                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }

                .animate-scroll {
                    animation: scroll 1.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

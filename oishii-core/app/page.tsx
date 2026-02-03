"use client";

import { EXPLORE_ROUTE, SIGNUP_ROUTE } from "@/app/routes";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
    BookOpen,
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
    Check,
    Crown,
    Zap,
    Smartphone,
    Download,
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

function HeroSection() {
    const t = useTranslations("home.hero");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const uspCards = [
        { Icon: BookOpen, gradient: "from-amber-500 to-orange-500", titleKey: "uspOrganize" as const, descKey: "uspOrganizeDesc" as const },
        { Icon: Users, gradient: "from-rose-400 to-pink-500", titleKey: "uspShare" as const, descKey: "uspShareDesc" as const },
        { Icon: Sparkles, gradient: "from-emerald-500 to-teal-500", titleKey: "uspAI" as const, descKey: "uspAIDesc" as const },
    ];

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 gradient-hero" />

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

                {/* USP Cards */}
                <div className="grid md:grid-cols-3 gap-5 mt-16 max-w-4xl mx-auto">
                    {uspCards.map((usp, i) => (
                        <div
                            key={i}
                            className={clsx(
                                "group bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg",
                                "hover:shadow-xl hover:-translate-y-1",
                                "transition-all duration-300 cursor-default text-center",
                                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            )}
                            style={{ transitionDelay: `${500 + i * 100}ms` }}
                        >
                            <div
                                className={clsx(
                                    "w-14 h-14 rounded-full bg-gradient-to-br flex items-center justify-center mb-4 mx-auto",
                                    "group-hover:scale-110 transition-transform duration-300 shadow-md",
                                    usp.gradient
                                )}
                            >
                                <usp.Icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-slate-800">{t(usp.titleKey)}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{t(usp.descKey)}</p>
                        </div>
                    ))}
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

function PricingSection() {
    const t = useTranslations("home.pricing");
    const { ref, isInView } = useInView();

    const plans = [
        {
            name: t("plans.free.name"),
            price: "0",
            description: t("plans.free.description"),
            features: [
                t("plans.free.features.aiActions"),
                t("plans.free.features.recipes"),
                t("plans.free.features.friends"),
            ],
            cta: t("plans.free.cta"),
            ctaHref: SIGNUP_ROUTE,
            popular: false,
            Icon: Zap,
            gradient: "from-gray-500 to-gray-600",
        },
        {
            name: t("plans.basic.name"),
            price: "2",
            description: t("plans.basic.description"),
            features: [
                t("plans.basic.features.aiActions"),
                t("plans.basic.features.recipes"),
                t("plans.basic.features.friends"),
                t("plans.basic.features.priority"),
            ],
            cta: t("plans.basic.cta"),
            ctaHref: null,
            popular: false,
            Icon: Sparkles,
            gradient: "from-blue-500 to-cyan-500",
        },
        {
            name: t("plans.premium.name"),
            price: "5.49",
            description: t("plans.premium.description"),
            features: [
                t("plans.premium.features.aiActions"),
                t("plans.premium.features.recipes"),
                t("plans.premium.features.friends"),
                t("plans.premium.features.priority"),
                t("plans.premium.features.earlyAccess"),
            ],
            cta: t("plans.premium.cta"),
            ctaHref: null,
            popular: true,
            Icon: Crown,
            gradient: "from-amber-500 to-orange-500",
        },
    ];

    return (
        <section ref={ref} className="py-24 bg-gradient-to-b from-background-secondary to-background">
            <div className="container mx-auto px-4">
                {/* Section header */}
                <div className="text-center mb-16">
                    <div
                        className={clsx(
                            "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-600 mb-4 transition-all duration-700",
                            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}
                    >
                        <Crown size={18} />
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

                {/* Pricing cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={clsx(
                                "relative bg-card rounded-2xl p-8 shadow-warm border transition-all duration-700 hover:shadow-warm-lg",
                                plan.popular ? "border-primary shadow-warm-lg scale-105" : "border-border",
                                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            )}
                            style={{ transitionDelay: `${(i + 1) * 150}ms` }}
                        >
                            {/* Popular badge */}
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="px-3 py-1 text-xs font-semibold bg-primary text-white rounded-full">
                                        {t("popular")}
                                    </span>
                                </div>
                            )}

                            {/* Icon */}
                            <div
                                className={clsx(
                                    "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-6",
                                    plan.gradient
                                )}
                            >
                                <plan.Icon className="w-6 h-6 text-white" />
                            </div>

                            {/* Plan name */}
                            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                            <p className="text-muted text-sm mb-4">{plan.description}</p>

                            {/* Price */}
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-2xl font-bold">€</span>
                                <span className="text-4xl font-bold">{plan.price}</span>
                                <span className="text-muted">{t("perMonth")}</span>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className="flex items-center gap-2 text-sm">
                                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            {plan.ctaHref ? (
                                <Link href={plan.ctaHref} className="block">
                                    <Button
                                        text={plan.cta}
                                        variant={plan.popular ? "primary" : "secondary"}
                                        size="lg"
                                        className="w-full"
                                    />
                                </Link>
                            ) : (
                                <Button
                                    text={plan.cta}
                                    variant="secondary"
                                    size="lg"
                                    className="w-full"
                                    onClick={() => window.location.href = "mailto:contact@oishii.app"}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function MobileAppSection() {
    const t = useTranslations("home.mobileApp");
    const { ref, isInView } = useInView();

    return (
        <section ref={ref} className="py-24 bg-gradient-to-b from-background to-background-secondary overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* Phone mockup */}
                        <div
                            className={clsx(
                                "relative flex-shrink-0 transition-all duration-1000",
                                isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
                            )}
                        >
                            {/* Phone frame */}
                            <div className="relative w-64 h-[500px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                                {/* Screen */}
                                <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 rounded-[2.25rem] overflow-hidden flex flex-col items-center justify-center">
                                    {/* App preview content */}
                                    <div className="text-6xl mb-4">🍳</div>
                                    <div className="text-xl font-bold text-foreground">Oishii</div>
                                    <div className="text-sm text-muted mt-1">{t("appPreview")}</div>

                                    {/* Mock recipe cards */}
                                    <div className="mt-6 space-y-2 px-4 w-full">
                                        {[1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className="bg-card/80 rounded-xl p-3 flex items-center gap-3"
                                            >
                                                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                                                    <span className="text-lg">{["🍕", "🍜", "🥗"][i - 1]}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="h-2 bg-secondary/40 rounded w-3/4 mb-1" />
                                                    <div className="h-1.5 bg-secondary/20 rounded w-1/2" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Notch */}
                                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-full" />
                            </div>

                            {/* Decorative blur */}
                            <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-3xl -z-10" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-center lg:text-left">
                            {/* Badge */}
                            <div
                                className={clsx(
                                    "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-600 mb-6 transition-all duration-700",
                                    isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                )}
                            >
                                <Smartphone size={18} />
                                <span className="text-sm font-medium">{t("badge")}</span>
                            </div>

                            {/* Title */}
                            <h2
                                className={clsx(
                                    "text-3xl md:text-5xl font-bold mb-4 transition-all duration-700 delay-100",
                                    isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                )}
                            >
                                {t("title")}
                            </h2>

                            {/* Description */}
                            <p
                                className={clsx(
                                    "text-lg text-muted mb-8 transition-all duration-700 delay-200",
                                    isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                )}
                            >
                                {t("description")}
                            </p>

                            {/* App store badges */}
                            <div
                                className={clsx(
                                    "flex flex-wrap justify-center lg:justify-start gap-4 mb-8 transition-all duration-700 delay-300",
                                    isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                )}
                            >
                                {/* App Store badge */}
                                <div className="relative group">
                                    <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl opacity-50 cursor-not-allowed">
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                        </svg>
                                        <div className="text-left">
                                            <div className="text-[10px] opacity-80">{t("downloadOn")}</div>
                                            <div className="text-sm font-semibold">{t("appStore")}</div>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-xl">
                                        <span className="text-xs font-medium text-white">{t("comingSoon")}</span>
                                    </div>
                                </div>

                                {/* Play Store badge */}
                                <div className="relative group">
                                    <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl opacity-50 cursor-not-allowed">
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm3.35-4.31c.34.27.64.71.64 1.19s-.3.92-.64 1.19l-2.23 1.3-2.5-2.49 2.5-2.49 2.23 1.3zM6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z" />
                                        </svg>
                                        <div className="text-left">
                                            <div className="text-[10px] opacity-80">{t("getItOn")}</div>
                                            <div className="text-sm font-semibold">{t("playStore")}</div>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-xl">
                                        <span className="text-xs font-medium text-white">{t("comingSoon")}</span>
                                    </div>
                                </div>
                            </div>

                            {/* PWA install hint */}
                            <div
                                className={clsx(
                                    "flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-xl transition-all duration-700 delay-400",
                                    isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                )}
                            >
                                <Download className="w-5 h-5 text-primary flex-shrink-0" />
                                <p className="text-sm text-foreground">
                                    {t("pwaHint")}
                                </p>
                            </div>
                        </div>
                    </div>
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
            <PricingSection />
            <FeaturesSection />
            <MobileAppSection />

            {/* Custom styles for animations */}
            <style jsx global>{`
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

                .animate-scroll {
                    animation: scroll 1.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

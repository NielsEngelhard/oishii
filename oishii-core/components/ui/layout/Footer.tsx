"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { ABOUT_ROUTE, EXPLORE_ROUTE, FEEDBACK_ROUTE } from "@/app/routes";

export default function Footer() {
    const t = useTranslations("footer");
    const tFeedback = useTranslations("feedback");
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-border bg-background-secondary">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Logo and tagline */}
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <span
                            className="text-lg tracking-wider text-primary"
                            style={{ fontFamily: "var(--font-special)" }}
                        >
                            Oishii
                        </span>
                        <span className="text-sm text-muted">
                            {t("tagline")}
                        </span>
                    </div>

                    {/* Links */}
                    <nav className="flex items-center gap-6 text-sm">
                        <Link
                            href={EXPLORE_ROUTE}
                            className="text-muted hover:text-foreground transition-colors"
                        >
                            {t("explore")}
                        </Link>
                        <Link
                            href={ABOUT_ROUTE}
                            className="text-muted hover:text-foreground transition-colors"
                        >
                            {t("about")}
                        </Link>
                        <Link
                            href={FEEDBACK_ROUTE}
                            className="text-muted hover:text-foreground transition-colors"
                        >
                            {tFeedback("navLabel")}
                        </Link>
                    </nav>

                    {/* Creator credit */}
                    <div className="flex flex-col items-center md:items-end gap-1">
                        <div className="flex items-center gap-1.5 text-sm text-muted">
                            <span>{t("by")}</span>
                            <span className="font-medium text-foreground">
                                Niels Engelhard
                            </span>
                        </div>
                        <span className="text-xs text-muted">
                            © {currentYear} Oishii
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

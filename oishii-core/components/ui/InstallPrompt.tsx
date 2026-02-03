"use client";

import { Download, Share, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
    const t = useTranslations("pwa");
    const [showPrompt, setShowPrompt] = useState(false);
    const [platform, setPlatform] = useState<"ios" | "android" | "desktop" | null>(null);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

    // Detect platform and check if should show prompt
    useEffect(() => {
        // Don't show if already installed (standalone mode)
        if (window.matchMedia("(display-mode: standalone)").matches) {
            return;
        }

        // Check if already shown this session
        if (sessionStorage.getItem("pwa-prompt-shown")) {
            return;
        }

        // Mark as shown for this session
        sessionStorage.setItem("pwa-prompt-shown", "true");

        // Detect platform
        const userAgent = navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(userAgent) && !window.matchMedia("(display-mode: standalone)").matches;
        const isAndroid = /android/.test(userAgent);

        if (isIOS) {
            setPlatform("ios");
            setShowPrompt(true);
        } else if (isAndroid) {
            setPlatform("android");
            // Wait for beforeinstallprompt event
        } else {
            // Desktop - don't show mobile install prompt
            setPlatform("desktop");
        }
    }, []);

    // Listen for beforeinstallprompt (Android/Chrome)
    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setPlatform("android");
            setShowPrompt(true);
        };

        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = useCallback(async () => {
        if (!deferredPrompt) return;

        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            setShowPrompt(false);
        }
        setDeferredPrompt(null);
    }, [deferredPrompt]);

    const handleDismiss = useCallback(() => {
        setShowPrompt(false);
    }, []);

    if (!showPrompt || platform === "desktop") {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom duration-300">
            <div className="bg-card rounded-2xl shadow-warm-xl border border-border p-4 max-w-md mx-auto">
                <div className="flex items-start gap-3">
                    {/* App icon */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-primary/10">
                        <Image
                            src="/logo.png"
                            alt="Oishii"
                            width={48}
                            height={48}
                            className="object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">{t("installTitle")}</h3>
                        <p className="text-sm text-muted mt-0.5">
                            {platform === "ios" ? t("iosInstructions") : t("androidInstructions")}
                        </p>

                        {/* Action buttons */}
                        <div className="flex gap-2 mt-3">
                            {platform === "android" && deferredPrompt ? (
                                <button
                                    onClick={handleInstall}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
                                >
                                    <Download size={16} />
                                    {t("installButton")}
                                </button>
                            ) : platform === "ios" ? (
                                <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-xl text-sm text-muted">
                                    <Share size={16} />
                                    <span>{t("iosTapShare")}</span>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={handleDismiss}
                        className="p-1 text-muted hover:text-foreground transition-colors flex-shrink-0"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

"use client";

import NarrowPageWrapper from "@/components/ui/layout/NarrowPageWrapper";
import { Check, Download, Share, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPage() {
    const t = useTranslations("pwa");
    const [platform, setPlatform] = useState<"ios" | "android" | null>(null);
    const [isStandalone, setIsStandalone] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        // Check if already installed (standalone mode)
        if (window.matchMedia("(display-mode: standalone)").matches) {
            setIsStandalone(true);
            return;
        }

        // Detect platform
        const userAgent = navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(userAgent);
        const isAndroid = /android/.test(userAgent);

        if (isIOS) {
            setPlatform("ios");
        } else if (isAndroid) {
            setPlatform("android");
        }
    }, []);

    // Listen for beforeinstallprompt (Android/Chrome)
    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = useCallback(async () => {
        if (!deferredPrompt) return;

        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            setIsStandalone(true);
        }
        setDeferredPrompt(null);
    }, [deferredPrompt]);

    const benefits = [
        { icon: Smartphone, text: t("benefit1") },
        { icon: Download, text: t("benefit2") },
        { icon: Check, text: t("benefit3") },
        { icon: Check, text: t("benefit4") },
    ];

    return (
        <NarrowPageWrapper maxWidth="md">
            <div className="flex flex-col items-center text-center py-8">
                {/* App Icon */}
                <div className="w-24 h-24 rounded-2xl overflow-hidden mb-6 shadow-warm-lg">
                    <Image
                        src="/logo.png"
                        alt="Oishii"
                        width={96}
                        height={96}
                        className="object-cover"
                    />
                </div>

                {isStandalone ? (
                    // Already installed state
                    <>
                        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                            <Check className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">{t("alreadyInstalled")}</h1>
                        <p className="text-muted">{t("alreadyInstalledDescription")}</p>
                    </>
                ) : (
                    // Install instructions
                    <>
                        <h1 className="text-2xl font-bold mb-2">{t("pageTitle")}</h1>
                        <p className="text-muted mb-8">{t("pageDescription")}</p>

                        {/* Install Card */}
                        <div className="w-full bg-card border border-border rounded-2xl p-6 mb-8">
                            <h2 className="font-semibold text-lg mb-4">{t("installTitle")}</h2>

                            {platform === "ios" ? (
                                <div className="space-y-4">
                                    <p className="text-muted">{t("iosInstructions")}</p>
                                    <div className="flex items-center justify-center gap-3 px-4 py-3 bg-secondary/50 rounded-xl">
                                        <Share className="w-5 h-5 text-primary" />
                                        <span className="font-medium">{t("iosTapShare")}</span>
                                    </div>
                                </div>
                            ) : platform === "android" ? (
                                <div className="space-y-4">
                                    <p className="text-muted">{t("androidInstructions")}</p>
                                    {deferredPrompt ? (
                                        <button
                                            onClick={handleInstall}
                                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
                                        >
                                            <Download className="w-5 h-5" />
                                            {t("installButton")}
                                        </button>
                                    ) : (
                                        <div className="flex items-center justify-center gap-3 px-4 py-3 bg-secondary/50 rounded-xl">
                                            <Download className="w-5 h-5 text-muted" />
                                            <span className="text-muted">{t("androidInstructions")}</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-muted">
                                    {t("androidInstructions")}
                                </p>
                            )}
                        </div>

                        {/* Benefits */}
                        <div className="w-full">
                            <h3 className="font-semibold mb-4">{t("benefitsTitle")}</h3>
                            <div className="space-y-3">
                                {benefits.map((benefit, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 text-left"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <benefit.icon className="w-4 h-4 text-primary" />
                                        </div>
                                        <span>{benefit.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </NarrowPageWrapper>
    );
}

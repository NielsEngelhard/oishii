"use client";

import Button from "@/components/ui/Button";
import { Wand2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { AI_IMPORT_ROUTE } from "@/app/routes";

export default function AiImportCard() {
    const t = useTranslations("aiImport");

    return (
        <div className="relative overflow-hidden rounded-2xl p-6 border border-primary/20 bg-primary/10">
            {/* Content */}
            <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-[#c9532d] shadow-lg shadow-primary/25">
                    <Wand2 className="h-6 w-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">
                            {t("importWithAi")}
                        </h3>
                        <span className="px-2 py-0.5 text-xs font-medium bg-primary/15 text-primary rounded-full">
                            {t("magic")}
                        </span>
                    </div>
                    <p className="text-muted text-sm mb-4">
                        {t("teaserDescription")}
                    </p>

                    <Link href={AI_IMPORT_ROUTE}>
                        <Button
                            text={t("startImport")}
                            Icon={Sparkles}
                            variant="primary"
                            size="md"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}

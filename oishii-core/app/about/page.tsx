"use client";

import { useTranslations } from "next-intl";
import { Users, Sparkles } from "lucide-react";
import NarrowPageWrapper from "@/components/ui/layout/NarrowPageWrapper";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <NarrowPageWrapper>
      <div className="w-full max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {t("title")}
          </h1>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold mb-1">{t("shareTitle")}</h2>
              <p className="text-muted text-sm">{t("shareDescription")}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold mb-1">{t("aiTitle")}</h2>
              <p className="text-muted text-sm">{t("aiDescription")}</p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-muted mt-8">
          {t("tagline")}
        </p>
      </div>
    </NarrowPageWrapper>
  );
}

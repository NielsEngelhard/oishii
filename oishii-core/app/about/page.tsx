"use client";

import { useTranslations } from "next-intl";
import { Heart, Coffee, Users, BookOpen, Sparkles, Globe } from "lucide-react";
import NarrowPageWrapper from "@/components/ui/layout/NarrowPageWrapper";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <NarrowPageWrapper>
      <div className="w-full max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>{t("subtitle")}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("title")}
          </h1>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-primary" />
            {t("storyTitle")}
          </h2>
          <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
            <p>{t("storyPart1")}</p>
            <p>{t("storyPart2")}</p>
            <p>{t("storyPart3")}</p>
          </div>
        </div>

        {/* Mission Points */}
        <div className="bg-gradient-to-br from-primary/5 to-orange-50 rounded-2xl p-8 md:p-12 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <Heart className="w-6 h-6 text-primary" />
            {t("missionTitle")}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <p className="text-slate-700">{t("missionPoint1")}</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <p className="text-slate-700">{t("missionPoint2")}</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <p className="text-slate-700">{t("missionPoint3")}</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <p className="text-slate-700">{t("missionPoint4")}</p>
            </div>
          </div>
        </div>

        {/* Thank You Section */}
        <div className="text-center bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          <div className="inline-flex items-center gap-2 text-slate-500 mb-4">
            <Coffee className="w-5 h-5" />
            <span className="text-sm font-medium">{t("builtWith")}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            {t("thanksTitle")}
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            {t("thanksText")}
          </p>
        </div>
      </div>      
    </NarrowPageWrapper>
  );
}

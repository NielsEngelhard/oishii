"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MessageSquarePlus, Send, CheckCircle2, Lightbulb, Bug, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import NarrowPageWrapper from "@/components/ui/layout/NarrowPageWrapper";

const MAX_CHARACTERS = 2000;
const MIN_CHARACTERS = 10;

export default function FeedbackPage() {
  const t = useTranslations("feedback");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const characterCount = message.length;
  const isValid = characterCount >= MIN_CHARACTERS && characterCount <= MAX_CHARACTERS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);

    // Simulate API call - in a real app, you'd send this to your backend
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For now, we'll just log it and show success
    console.log("Feedback submitted:", message);

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setMessage("");
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            {t("successTitle")}
          </h1>
          <p className="text-slate-600 mb-8">
            {t("successMessage")}
          </p>
          <Button
            text={t("sendAnother")}
            variant="skeleton"
            onClick={handleReset}
          />
        </div>
      </div>
    );
  }

  return (
    <NarrowPageWrapper maxWidth="lg">
      <div className="w-full mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <MessageSquarePlus className="w-4 h-4" />
            <span>{t("subtitle")}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            {t("description")}
          </p>
        </div>

        {/* Quick hints */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-blue-700 font-medium text-center">Feature ideas</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-red-50 rounded-xl">
            <Bug className="w-5 h-5 text-red-600" />
            <span className="text-xs text-red-700 font-medium text-center">Bug reports</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-purple-700 font-medium text-center">Improvements</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHARACTERS))}
              placeholder={t("placeholder")}
              className="w-full h-64 p-4 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-slate-700 placeholder:text-slate-400"
            />

            {/* Character count and validation */}
            <div className="flex items-center justify-between mt-3 text-sm">
              <span className={characterCount < MIN_CHARACTERS ? "text-amber-600" : "text-slate-400"}>
                {characterCount < MIN_CHARACTERS && t("tooShort")}
              </span>
              <span className={characterCount > MAX_CHARACTERS * 0.9 ? "text-amber-600" : "text-slate-400"}>
                {t("characterCount", { count: characterCount, max: MAX_CHARACTERS })}
              </span>
            </div>

            {/* Submit button */}
            <div className="mt-6">
              <Button
                text={isSubmitting ? t("sending") : t("submitButton")}
                Icon={Send}
                variant="primary"
                disabled={!isValid || isSubmitting}
                className="w-full justify-center"
                type="submit"
              />
            </div>
          </div>
        </form>
      </div>      
    </NarrowPageWrapper>
  );
}

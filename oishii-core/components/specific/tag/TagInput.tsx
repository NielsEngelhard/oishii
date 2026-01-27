"use client";

import { OFFICIAL_TAGS, isOfficialTag } from "@/lib/constants/official-tags";
import { Info, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import clsx from "clsx";

interface Props {
    selectedTags: string[];
    onChange: (tags: string[]) => void;
}

export default function TagInput({ selectedTags, onChange }: Props) {
    const t = useTranslations("tags");
    const [customTagInput, setCustomTagInput] = useState("");

    const toggleOfficialTag = (tagKey: string) => {
        if (selectedTags.includes(tagKey)) {
            onChange(selectedTags.filter(t => t !== tagKey));
        } else {
            onChange([...selectedTags, tagKey]);
        }
    };

    const addCustomTag = () => {
        const trimmed = customTagInput.trim().toLowerCase().replace(/\s+/g, "-");
        if (trimmed && !selectedTags.includes(trimmed) && trimmed.length >= 2 && trimmed.length <= 30) {
            onChange([...selectedTags, trimmed]);
            setCustomTagInput("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addCustomTag();
        }
    };

    const removeCustomTag = (tagKey: string) => {
        onChange(selectedTags.filter(t => t !== tagKey));
    };

    const customTags = selectedTags.filter(tag => !isOfficialTag(tag));

    return (
        <div className="space-y-4">
            {/* Disclaimer */}
            <div className="flex items-start gap-2 p-3 bg-primary/5 border border-primary/20 rounded-xl text-sm">
                <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-muted">{t("disclaimer")}</p>
            </div>

            {/* Official Tags */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-muted">{t("official")}</label>
                <div className="flex flex-wrap gap-2">
                    {OFFICIAL_TAGS.map(tag => {
                        const isSelected = selectedTags.includes(tag.key);
                        return (
                            <button
                                key={tag.key}
                                type="button"
                                onClick={() => toggleOfficialTag(tag.key)}
                                className={clsx(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                                    "border hover:scale-105 active:scale-95",
                                    isSelected
                                        ? "bg-primary/20 border-primary/40 text-primary"
                                        : "bg-secondary/50 border-border text-muted hover:bg-secondary hover:text-foreground"
                                )}
                            >
                                <span>{tag.emoji}</span>
                                <span>{t(tag.key)}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Custom Tags */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-muted">{t("custom")}</label>

                {/* Custom tag chips */}
                {customTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {customTags.map(tag => (
                            <span
                                key={tag}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-accent/80 text-foreground border border-accent/40"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeCustomTag(tag)}
                                    className="ml-1 hover:text-error transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                {/* Add custom tag input */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={customTagInput}
                        onChange={(e) => setCustomTagInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t("customPlaceholder")}
                        maxLength={30}
                        className="flex-1 px-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                    <button
                        type="button"
                        onClick={addCustomTag}
                        disabled={!customTagInput.trim() || customTagInput.trim().length < 2}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-xl bg-secondary hover:bg-secondary/80 text-muted hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-4 h-4" />
                        {t("addCustom")}
                    </button>
                </div>
            </div>
        </div>
    );
}

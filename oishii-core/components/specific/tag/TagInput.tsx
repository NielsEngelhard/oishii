"use client";

import { OFFICIAL_TAGS, isOfficialTag } from "@/lib/constants/official-tags";
import { Info, Plus, Search, Tag, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import clsx from "clsx";
import Notification from "@/components/ui/Notification";

interface Props {
    selectedTags: string[];
    onChange: (tags: string[]) => void;
}

export default function TagInput({ selectedTags, onChange }: Props) {
    const t = useTranslations("tags");
    const [searchQuery, setSearchQuery] = useState("");

    const toggleTag = (tagKey: string) => {
        if (selectedTags.includes(tagKey)) {
            onChange(selectedTags.filter(t => t !== tagKey));
        } else {
            onChange([...selectedTags, tagKey]);
        }
    };

    const addCustomTag = (value?: string) => {
        const input = value ?? searchQuery;
        const trimmed = input.trim().toLowerCase().replace(/\s+/g, "-");
        if (trimmed && !selectedTags.includes(trimmed) && trimmed.length >= 2 && trimmed.length <= 30) {
            onChange([...selectedTags, trimmed]);
            setSearchQuery("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            // If there's a search query and it's not an exact match to an official tag, add as custom
            const trimmed = searchQuery.trim().toLowerCase().replace(/\s+/g, "-");
            if (trimmed && !isOfficialTag(trimmed) && !selectedTags.includes(trimmed)) {
                addCustomTag();
            } else if (filteredTags.length === 1 && !selectedTags.includes(filteredTags[0].key)) {
                // If only one tag matches, select it
                toggleTag(filteredTags[0].key);
                setSearchQuery("");
            }
        }
    };

    const removeTag = (tagKey: string) => {
        onChange(selectedTags.filter(t => t !== tagKey));
    };

    // Filter official tags based on search query
    const query = searchQuery.toLowerCase();
    const filteredTags = !searchQuery.trim()
        ? OFFICIAL_TAGS
        : OFFICIAL_TAGS.filter(tag => {
            const translatedLabel = t(tag.key as Parameters<typeof t>[0]).toLowerCase();
            return tag.key.toLowerCase().includes(query) || translatedLabel.includes(query);
        });

    // Check if search query could be a custom tag
    const trimmedSearch = searchQuery.trim().toLowerCase().replace(/\s+/g, "-");
    const canAddCustomTag = trimmedSearch.length >= 2 &&
        !isOfficialTag(trimmedSearch) &&
        !selectedTags.includes(trimmedSearch);

    // Get selected tags with their info
    const selectedTagsInfo = selectedTags.map(tagKey => {
        const officialTag = OFFICIAL_TAGS.find(t => t.key === tagKey);
        return {
            key: tagKey,
            emoji: officialTag?.emoji,
            isOfficial: !!officialTag
        };
    });

    return (
        <div className="space-y-4">
            {/* Disclaimer */}
            <Notification
                description={t("disclaimer")}
                Icon={Tag}
            />

            {/* Selected Tags */}
            {selectedTagsInfo.length > 0 && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted">{t("selected")}</label>
                    <div className="flex flex-wrap gap-2">
                        {selectedTagsInfo.map(tag => (
                            <span
                                key={tag.key}
                                className={clsx(
                                    "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium",
                                    tag.isOfficial
                                        ? "bg-primary/10 border border-primary/40 text-primary"
                                        : "bg-accent/80 text-foreground border border-accent/40"
                                )}
                            >
                                {tag.emoji && <span>{tag.emoji}</span>}
                                <span>{tag.isOfficial ? t(tag.key as Parameters<typeof t>[0]) : tag.key}</span>
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag.key)}
                                    className="ml-1 hover:text-error transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Search Input */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-muted">{t("searchTags")}</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t("searchPlaceholder")}
                        maxLength={30}
                        className="w-full pl-10 pr-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                </div>

                {/* Add custom tag option */}
                {canAddCustomTag && (
                    <button
                        type="button"
                        onClick={() => addCustomTag()}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl bg-accent/50 hover:bg-accent text-foreground transition-colors w-full"
                    >
                        <Plus className="w-4 h-4" />
                        {t("addCustomTag", { tag: searchQuery.trim().toLowerCase().replace(/\s+/g, "-") })}
                    </button>
                )}
            </div>

            {/* Available Tags (scrollable) */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-muted">
                    {t("official")} {searchQuery && `(${filteredTags.length})`}
                </label>
                <div className="max-h-48 overflow-y-auto border border-border rounded-xl p-3 bg-secondary/20">
                    {filteredTags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {filteredTags.map(tag => {
                                const isSelected = selectedTags.includes(tag.key);
                                return (
                                    <button
                                        key={tag.key}
                                        type="button"
                                        onClick={() => toggleTag(tag.key)}
                                        className={clsx(
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                                            "border hover:scale-105 active:scale-95",
                                            isSelected
                                                ? "bg-primary/20 border-primary/40 text-primary"
                                                : "bg-background border-border text-muted hover:bg-secondary hover:text-foreground"
                                        )}
                                    >
                                        <span>{tag.emoji}</span>
                                        <span>{t(tag.key as Parameters<typeof t>[0])}</span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-muted text-center py-4">{t("noTagsFound")}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

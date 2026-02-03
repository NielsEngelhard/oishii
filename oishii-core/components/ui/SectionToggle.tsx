"use client"

import clsx from "clsx";
import { LucideIcon } from "lucide-react";

interface SectionToggleItem {
    key: string;
    label: string;
    Icon?: LucideIcon;
}

interface Props {
    sections: SectionToggleItem[];
    activeSectionKey: string;
    onSectionChange: (key: string) => void;
}

export default function SectionToggle({ sections, activeSectionKey, onSectionChange }: Props) {
    const activeIndex = sections.findIndex(s => s.key === activeSectionKey);

    return (
        <div className="relative bg-background-secondary p-1 rounded-xl">
            {/* Sliding indicator */}
            <div
                className="absolute top-1 bottom-1 bg-card rounded-lg shadow-sm transition-all duration-300 ease-out"
                style={{
                    width: `calc((100% - 8px) / ${sections.length})`,
                    left: `calc(4px + ${activeIndex} * (100% - 8px) / ${sections.length})`,
                }}
            />

            {/* Buttons */}
            <div
                className="relative grid"
                style={{ gridTemplateColumns: `repeat(${sections.length}, 1fr)` }}
            >
                {sections.map(section => {
                    const isActive = activeSectionKey === section.key;
                    return (
                        <button
                            key={section.key}
                            className={clsx(
                                "flex items-center gap-2 justify-center p-2 rounded-lg cursor-pointer transition-colors duration-200 z-10",
                                isActive ? "text-foreground" : "text-muted hover:text-foreground/70"
                            )}
                            onClick={() => onSectionChange(section.key)}
                        >
                            {section.Icon && (
                                <section.Icon
                                    size={16}
                                    className={clsx(
                                        "transition-transform duration-200",
                                        isActive && "scale-110"
                                    )}
                                />
                            )}
                            <span className="font-medium">{section.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    )
}
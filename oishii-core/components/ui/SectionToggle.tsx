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
    return (
        <div className={clsx("grid bg-background-secondary p-1 rounded-xl", `grid-cols-1 sm:grid-cols-${sections.length}`)}>
            {sections.map(section => (
                <button className={`flex items-center gap-2 text-muted justify-center p-2 hover:cursor-pointer
                     ${activeSectionKey == section.key ? "bg-card rounded-xl" : ""}`}
                    onClick={() => onSectionChange(section.key)}
                >
                    {section.Icon && <section.Icon size={16} />}
                    <span>{section.label}</span>
                </button>
            ))}
        </div>
    )
}
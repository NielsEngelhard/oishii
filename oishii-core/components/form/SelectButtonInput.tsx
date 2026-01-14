"use client"

import clsx from "clsx";
import { LucideIcon } from "lucide-react";
import { forwardRef } from "react";
import Label from "./Label";

interface SelectOption {
    label: string;
    value: string;
}

interface Props {
    options: SelectOption[];
    label?: string;
    Icon?: LucideIcon;
    postFix?: string;
    value?: string;
    onChange?: (value: string) => void;
    error?: string;
    name?: string;
}

const SelectButtonInput = forwardRef<HTMLInputElement, Props>(
    ({ label, Icon, options, postFix, value, onChange, error, name }, ref) => {
        return (
            <div className="flex flex-col gap-1">
                <div className="flex flex-row items-center gap-1">
                    {Icon && <Icon size={14} />}
                    {label && <Label text={label} />}
                </div>

                <div className="flex flex-wrap gap-2">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange?.(option.value)}
                            className={clsx(
                                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                                "border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                value === option.value
                                    ? "bg-primary text-background border-primary"
                                    : "bg-background border-border hover:bg-accent hover:text-accent-foreground",
                                error && "border-error"
                            )}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                {/* Hidden input for react-hook-form */}
                <input
                    ref={ref}
                    type="hidden"
                    name={name}
                    value={value || ""}
                    readOnly
                />

                {error && <p className="text-sm text-error">{error}</p>}
                {postFix && <span className="text-muted text-xs pl-1">{postFix}</span>}
            </div>
        );
    }
);

SelectButtonInput.displayName = "SelectButtonInput";
export default SelectButtonInput;
"use client"

import clsx from "clsx";
import { ChevronDown, LucideIcon } from "lucide-react";
import { forwardRef } from "react";
import Label from "./Label";

export interface SelectOption {
    label: string;
    value: string;
}

interface Props extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    options: SelectOption[];
    label?: string;
    Icon?: LucideIcon;
    error?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
}

const SelectInput = forwardRef<HTMLSelectElement, Props>(
    ({ options, label, Icon, error, placeholder, onChange, className = "", value, ...props }, ref) => {
        const baseClasses = clsx(
            "w-full appearance-none rounded-md border bg-background px-3 py-2.5 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pr-10",
            Icon && "pl-10"
        );

        return (
            <div className="flex flex-col gap-1">
                {label && (
                    <div className="flex gap-1 items-center">
                        {Icon && <Icon size={14} className="text-muted" />}
                        <Label text={label} />
                    </div>
                )}

                <div className="relative w-full">
                    {Icon && !label && (
                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted pointer-events-none" />
                    )}

                    <select
                        ref={ref}
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        className={clsx(
                            baseClasses,
                            error ? "border-error focus-visible:ring-error" : "border-border",
                            !Icon || label ? "pl-3" : "",
                            className
                        )}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                </div>

                {error && <p className="text-sm text-error">{error}</p>}
            </div>
        );
    }
);

SelectInput.displayName = "SelectInput";
export default SelectInput;

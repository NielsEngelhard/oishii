"use client"

import clsx from "clsx";
import { LucideIcon } from "lucide-react";
import { forwardRef } from "react";
import Label from "./Label";

interface SelectOption {
    label: string;
    value: string;
}

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    Icon?: LucideIcon;
    error?: string;
    options: SelectOption[];
    placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, Props>(
    ({ label, Icon, error, options, placeholder, className = "", ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1">
                {(label || Icon) && (
                    <div className="flex flex-row items-center gap-1">
                        {Icon && <Icon size={14} />}
                        {label && <Label text={label} />}
                    </div>
                )}

                <div className="relative w-full">
                    <select
                        ref={ref}
                        className={clsx(
                            "w-full appearance-none rounded-md border bg-background px-3 py-2.5 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pr-10",
                            error ? "border-error focus-visible:ring-error" : "border-border",
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
                </div>

                {error && <p className="text-sm text-error">{error}</p>}
            </div>
        );
    }
);

Select.displayName = "Select";
export default Select;

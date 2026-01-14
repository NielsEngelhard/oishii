"use client"

import clsx from "clsx";
import { LucideIcon } from "lucide-react";
import { forwardRef } from "react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    Icon?: LucideIcon;
    error?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, Props>(
    ({ label, placeholder, className = "", Icon, error, onChange, ...props }, ref) => {
        const baseClasses = clsx(
            "w-full flex rounded-md border bg-background px-3 py-2.5 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-y min-h-[100px]",
            Icon && "pl-10"
        );

        return (
            <div className="flex flex-col gap-1">
                {label && <label className="text-sm">{label}</label>}

                <div className="relative w-full">
                    {Icon && <Icon className="absolute left-3 top-3 h-5 w-5 text-muted" />}
                    <textarea
                        ref={ref}
                        placeholder={placeholder}
                        onChange={onChange}
                        className={clsx(
                            baseClasses,
                            error ? "border-error focus-visible:ring-error" : "border-border",
                            className
                        )}
                        {...props}
                    />
                </div>

                {error && <p className="text-sm text-error">{error}</p>}
            </div>
        );
    }
);

TextArea.displayName = "TextArea";
export default TextArea;

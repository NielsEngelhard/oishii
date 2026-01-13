"use client"

import clsx from "clsx";
import { Eye, EyeOff, LucideIcon } from "lucide-react";
import { forwardRef, useState } from "react";

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label?: string;
    Icon?: LucideIcon;
    error?: string;
    // Keep supporting the old onChange for backwards compatibility
    onChange?: ((value: string) => void) | React.ChangeEventHandler<HTMLInputElement>;
}

const Input = forwardRef<HTMLInputElement, Props>(
    ({ label, placeholder, type = "text", className = "", Icon, error, onChange, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        const baseClasses = "w-full flex w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 h-12";

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
                // Check if it's the old-style onChange (value: string) => void
                if (onChange.length === 1 && typeof onChange === 'function') {
                    try {
                        // Try calling it as the old style first
                        (onChange as (value: string) => void)(e.target.value);
                    } catch {
                        // If that fails, call it as an event handler
                        (onChange as React.ChangeEventHandler<HTMLInputElement>)(e);
                    }
                } else {
                    (onChange as React.ChangeEventHandler<HTMLInputElement>)(e);
                }
            }
        };

        return (
            <div className="flex flex-col gap-1">
                {label && <label className="text-sm">{label}</label>}

                <div className="relative w-full">
                    {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />}
                    <input
                        ref={ref}
                        type={(type === "password" && showPassword) ? "text" : type}
                        placeholder={placeholder}
                        onChange={handleChange}
                        className={clsx(
                            baseClasses,
                            error ? "border-error focus-visible:ring-error" : "border-border",
                            className
                        )}
                        {...props}
                    />

                    {type === "password" && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    )}
                </div>

                {error && <p className="text-sm text-error">{error}</p>}
            </div>
        );
    }
);

Input.displayName = "Input";
export default Input;
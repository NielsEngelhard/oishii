"use client"

import clsx from "clsx";
import { Eye, EyeOff, LucideIcon } from "lucide-react";
import { forwardRef, useState } from "react";
import Label from "./Label";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    Icon?: LucideIcon;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, Props>(
    ({ label, placeholder, type = "text", className = "", Icon, error, onChange, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        const baseClasses = clsx(
             "w-full flex w-full rounded-xl border-2 border-border/60 bg-white px-3 py-2.5 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-40 md:text-sm transition-all duration-200",
             Icon && "pl-10"
        );
        
        
       

        return (
            <div className="flex flex-col gap-1">
                {label && <Label text={label} />}

                <div className="relative w-full">
                    {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />}
                    <input
                        ref={ref}
                        type={(type === "password" && showPassword) ? "text" : type}
                        placeholder={placeholder}
                        onChange={onChange}
                        className={clsx(
                            baseClasses,
                            error ? "border-error focus:ring-error/10" : "",
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
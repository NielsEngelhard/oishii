"use client"

import clsx from "clsx";
import { Eye, EyeOff, Lock, LucideIcon } from "lucide-react";
import { useState } from "react";

interface Props {
    value: string;
    label?: string;
    placeholder?: string;
    type?: "text" | "email" | "password";
    className?: string;
    required?: boolean;
    Icon?: LucideIcon;
    onChange: (value: string) => void;
}

export default function Input({ value, label, placeholder, type = "text", className = "", Icon, required = false, onChange }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-sm">{label}</label>}

            <div className="relative w-full">
                {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />}
                <input
                    type={(type == "password" && showPassword) ? "text" : type}
                    value={value}
                    placeholder={placeholder}                
                    onChange={(e) => onChange(e.target.value)}
                    className={clsx(className, "w-full")}
                    required={required}
                />        

                {type == "password" && (
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                    >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                )}
            </div>
        </div>
    );
}

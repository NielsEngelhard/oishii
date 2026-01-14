"use client"

import clsx from "clsx";
import { LucideIcon } from "lucide-react";
import { forwardRef } from "react";
import Label from "./Label";

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    Icon?: LucideIcon;
    error?: string;
}

const SwitchInput = forwardRef<HTMLInputElement, Props>(
    ({ label, Icon, error, className = "", checked, onChange, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        role="switch"
                        aria-checked={checked}
                        onClick={(e) => {
                            const syntheticEvent = {
                                target: { checked: !checked },
                            } as React.ChangeEvent<HTMLInputElement>;
                            onChange?.(syntheticEvent);
                        }}
                        className={clsx(
                            "relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 ease-in-out",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            checked ? "bg-primary" : "bg-border",
                            error && "ring-2 ring-error",
                            props.disabled && "opacity-50 cursor-not-allowed"
                        )}
                        disabled={props.disabled}
                    >
                        <span
                            className={clsx(
                                "inline-block h-5 w-5 transform rounded-full bg-background shadow-md transition-transform duration-200 ease-in-out",
                                checked ? "translate-x-6" : "translate-x-1"
                            )}
                        />
                    </button>

                    {(label || Icon) && (
                        <div className="flex flex-row items-center gap-1">
                            {Icon && <Icon size={14} />}
                            {label && <Label text={label} />}
                        </div>
                    )}

                    {/* Hidden checkbox for form compatibility */}
                    <input
                        ref={ref}
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={onChange}
                        {...props}
                    />
                </div>

                {error && <p className="text-sm text-error">{error}</p>}
            </div>
        );
    }
);

SwitchInput.displayName = "SwitchInput";
export default SwitchInput;

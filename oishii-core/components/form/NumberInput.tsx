"use client"

import { LucideIcon } from "lucide-react";
import { forwardRef } from "react";
import Input from "./Input";
import Label from "./Label";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    Icon?: LucideIcon;
    error?: string;
    postFix?: string;
}

const NumberInput = forwardRef<HTMLInputElement, Props>(
    ({ label, Icon, error, postFix, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1">
                {(label || Icon) && (
                    <div className="flex flex-row items-center gap-1">
                        {Icon && <Icon size={14} />}
                        {label && <Label text={label} />}
                    </div>                    
                )}
                <Input
                    ref={ref}
                    type="number"
                    error={error}
                    {...props}
                />
                {postFix && <span className="text-muted text-xs pl-1">{postFix}</span>}
            </div>
        );
    }
);

NumberInput.displayName = "NumberInput";
export default NumberInput;
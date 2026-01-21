import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
    className?: string;
}

const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
};

export default function NarrowPageWrapper({ children, maxWidth = "sm", className = "" }: Props) {
    return (
        <div className="flex justify-center w-full">
            <div className={`flex flex-col w-full ${maxWidthClasses[maxWidth]} px-4 py-4 space-y-4 ${className}`}>
                {children}
            </div>
        </div>
    );
}

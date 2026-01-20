import clsx from "clsx";

interface Props {
    children: React.ReactNode;
    className?: string;
}

export default function Card({ children, className = "" }: Props) {
    return (
        <div className={clsx("bg-card border border-border/60 shadow-sm rounded-xl p-2 md:p-4 w-full", className)}>
            {children}
        </div>
    )
}
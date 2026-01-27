import clsx from "clsx";

interface Props {
    children: React.ReactNode;
    className?: string;
}

export default function Card({ children, className = "" }: Props) {
    return (
        <div className={clsx("bg-card border border-border/40 shadow-warm rounded-2xl p-3 md:p-5 w-full", className)}>
            {children}
        </div>
    )
}
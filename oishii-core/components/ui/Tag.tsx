import clsx from "clsx";

interface Props {
    text: string;
    variant?: "primary" | "accent" | "secondary";
}

export default function Tag({ text, variant = "accent" }: Props) {

    const baseClasses = "rounded-full text-xs px-2 py-1 text-foreground/80";

    const variants = {
        primary: "bg-primary/20",
        secondary: "bg-secondary/80",
        accent: "bg-accent/70",
    };    

    return (
        <span className={clsx(baseClasses, variants[variant])}>
            {text}
        </span>
    )
}
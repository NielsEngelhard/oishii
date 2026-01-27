import clsx from "clsx";

interface Props {
    text: string;
    variant?: "primary" | "accent" | "secondary";
}

export default function Tag({ text, variant = "accent" }: Props) {

    const baseClasses = "rounded-full text-xs font-medium px-2.5 py-1 backdrop-blur-sm";

    const variants = {
        primary: "bg-primary/20 text-primary border border-primary/30",
        secondary: "bg-secondary/90 text-foreground border border-secondary/30",
        accent: "bg-accent/80 text-foreground border border-accent/40",
    };    

    return (
        <span className={clsx(baseClasses, variants[variant])}>
            {text}
        </span>
    )
}
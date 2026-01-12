import { LucideIcon } from "lucide-react";
import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "transparent" | "skeleton";
  text?: string;
  Icon?: LucideIcon;  
};

export default function Button({
  children,
  text,
  Icon,
  variant = "primary",
  ...props
}: ButtonProps) {
  // shared base styles
  const baseStyles = "hover:cursor-pointer p-2 rounded-lg transition-all duration-200 flex items-center gap-2";

  // variant styles
  const variantStyles = {
    primary: "bg-primary text-background hover:bg-primary/80",
    secondary: "bg-secondary text-text hover:bg-secondary/80",
    transparent: "bg-transparent text-text hover:bg-secondary/70",
    skeleton: "text-text bg-transparent border border-border"
  };

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant])}
      {...props}
    >
      {Icon && <Icon size={16} />}
      {text && text}
    </button>
  );
}

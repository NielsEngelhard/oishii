import { LucideIcon } from "lucide-react";
import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "transparent" | "skeleton";
  size?: "sm" | "md" | "lg";
  text?: string;
  Icon?: LucideIcon;
  className?: string;
};

export default function Button({
  children,
  text,
  Icon,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  // shared base styles
  const baseStyles =
    "rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer";

  // size styles
  const sizeStyles = {
    sm: "px-2 py-1 text-sm gap-0.5",
    md: "py-2 px-4 text-base gap-1",
    lg: "px-4 py-3 text-lg gap-2"
  };

  // variant styles
  const variantStyles = {
    primary: "bg-primary text-background hover:bg-primary/80",
    secondary: "bg-secondary text-text hover:bg-secondary/80",
    transparent: "bg-transparent text-text hover:bg-secondary/10",
    skeleton: "text-text bg-background border border-border hover:bg-secondary/10"
  };

  return (
    <button
      className={clsx(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />}
      {text && text}
      {children}
    </button>
  );
}

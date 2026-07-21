import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;

  variant?: "primary" | "secondary" | "danger";
}

export default function Button({
  children,
  loading = false,
  disabled,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "h-14 w-full rounded-xl font-medium transition-all duration-200",
        "cursor-pointer",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "hover:scale-[1.01]",
        "active:scale-[0.99]",

        variant === "primary" && [
          "bg-violet-600",
          "text-white",
          "hover:bg-violet-700",
          "shadow-lg",
          "shadow-violet-900/20",
        ],

        variant === "secondary" && [
          "bg-slate-100",
          "text-slate-700",
          "hover:bg-slate-200",
        ],

        variant === "danger" && [
          "bg-red-600",
          "text-white",
          "hover:bg-red-700",
          "shadow-lg",
          "shadow-red-900/20",
        ],

        className
      )}
      {...props}
    >
      {loading ? "Carregando..." : children}
    </button>
  );
}
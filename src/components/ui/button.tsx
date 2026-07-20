import { cn } from "@/lib/cn";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function Button({
  children,
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "h-14 w-full rounded-xl bg-[#7C3AED] text-white font-medium transition-all duration-200",
        "hover:bg-[#6D28D9]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "cursor-pointer",
        "shadow-lg",
        "shadow-violet-900/20",
        "hover:scale-[1.01]",
        "active:scale-[0.99]",
        className
      )}
      {...props}
    >
      {loading ? "Entrando..." : children}
    </button>
  );
}
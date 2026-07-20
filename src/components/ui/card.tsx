import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> { }

export default function Card({
  children,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,.08)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
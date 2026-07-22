import { forwardRef, InputHTMLAttributes } from "react";
import FormField from "./forms_field";
import { cn } from "@/lib/cn";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<
  HTMLInputElement,
  InputProps
>(({ label, error, className, ...props }, ref) => {
  return (
    <FormField
      label={label}
      error={error}
    >
      <input
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${props.name}-error` : undefined
        }
        className={cn(
          "h-12 w-full rounded-xl border bg-white px-4 text-sm transition-all",
          "placeholder:text-gray-400",

          error
            ? [
              "border-red-500",
              "focus:border-red-500",
              "focus:ring-4",
              "focus:ring-red-100",
            ]
            : [
              "border-gray-300",
              "focus:border-violet-600",
              "focus:ring-4",
              "focus:ring-violet-100",
            ],

          className
        )}
        {...props}
      />
    </FormField>
  );
});

Input.displayName = "Input";

export default Input;
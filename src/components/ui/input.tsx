import { forwardRef, InputHTMLAttributes } from "react";
import FormField from "./forms_field";
import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <FormField label={label} error={error}>
        <input
          ref={ref}
          className={cn(
            "h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm",
            "transition-all",
            "placeholder:text-gray-400",
            "focus:border-violet-600",
            "focus:ring-4",
            "focus:ring-violet-100",
            error && "border-red-500",
            className
          )}
          {...props}
        />
      </FormField>
    );
  }
);

Input.displayName = "Input";

export default Input;
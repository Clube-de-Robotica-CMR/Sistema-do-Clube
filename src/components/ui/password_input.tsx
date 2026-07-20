import { forwardRef, InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import FormField from "./forms_field";
import { cn } from "@/lib/cn";

interface PasswordInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <FormField label={label} error={error}>
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={cn(
              "h-12 w-full rounded-xl border border-gray-300 bg-white px-4 pr-12 text-sm",
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

          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2",
              "cursor-pointer",
              "text-gray-500 transition-colors",
              "hover:text-violet-700"
            )}
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </FormField>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
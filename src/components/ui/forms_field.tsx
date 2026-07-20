import { ReactNode } from "react";

interface FormFieldProps {
  label?: string;
  error?: string;
  children: ReactNode;
}

export default function FormField({
  label,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-violet-700 font-medium text-text">
          {label}
        </label>
      )}

      {children}

      {error && (
        <div
          className="
        rounded-xl
        border
        border-red-200
        bg-red-50
        px-4
        py-3
        text-sm
        text-red-700
    "
        >
          {error}
        </div>
      )}
    </div>
  );
}
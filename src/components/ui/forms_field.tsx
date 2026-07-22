import { ReactNode } from "react";

interface FormFieldProps {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export default function FormField({
  label,
  error,
  children,
}: FormFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      {label && (
        <span className="text-sm font-medium text-slate-700">
          {label}
        </span>
      )}

      {children}

      {error && (
        <span
          id={`${label}-error`}
          className="text-sm text-red-600"
        >
          {error}
        </span>
      )}
    </label>
  );
}
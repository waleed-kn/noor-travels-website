import React from "react";

export interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string | string[];
  helperText?: string;
  required?: boolean;
  wrapperClassName?: string;
}

export function Field({
  id,
  label,
  error,
  helperText,
  required = false,
  className = "",
  wrapperClassName = "",
  disabled,
  ...props
}: FieldProps) {
  const errorMessage = Array.isArray(error) ? error.join(", ") : error;
  const hasError = Boolean(errorMessage);

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`.trim()}>
      <label
        htmlFor={id}
        className="text-xs sm:text-sm font-semibold text-navy flex items-center justify-between"
      >
        <span>
          {label}
          {required && <span className="text-gold-dark ml-1" aria-hidden="true">*</span>}
        </span>
      </label>

      <input
        id={id}
        required={required}
        disabled={disabled}
        aria-invalid={hasError ? "true" : "false"}
        aria-describedby={
          hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined
        }
        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm sm:text-base text-navy-deep bg-white/90 placeholder:text-navy/40 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/70 focus:border-gold disabled:bg-sand/50 disabled:opacity-70 disabled:cursor-not-allowed ${
          hasError
            ? "border-red-500 focus:ring-red-400"
            : "border-border hover:border-gold/40"
        } ${className}`.trim()}
        {...props}
      />

      {helperText && !hasError && (
        <p id={`${id}-helper`} className="text-xs text-navy-deep/60">
          {helperText}
        </p>
      )}

      {hasError && (
        <p id={`${id}-error`} className="text-xs font-medium text-red-600 animate-fadeIn" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export interface FieldWrapperProps {
  id: string;
  label: string;
  error?: string | string[];
  helperText?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function FieldWrapper({
  id,
  label,
  error,
  helperText,
  required = false,
  className = "",
  children,
}: FieldWrapperProps) {
  const errorMessage = Array.isArray(error) ? error.join(", ") : error;
  const hasError = Boolean(errorMessage);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`.trim()}>
      <label
        htmlFor={id}
        className="text-xs sm:text-sm font-semibold text-navy flex items-center justify-between"
      >
        <span>
          {label}
          {required && <span className="text-gold-dark ml-1" aria-hidden="true">*</span>}
        </span>
      </label>

      {children}

      {helperText && !hasError && (
        <p id={`${id}-helper`} className="text-xs text-navy-deep/60">
          {helperText}
        </p>
      )}

      {hasError && (
        <p id={`${id}-error`} className="text-xs font-medium text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

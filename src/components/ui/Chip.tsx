import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function Chip({ active, className = "", children, ...props }: Props) {
  return (
    <button
      type="button"
      className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-medium transition ${
        active
          ? "bg-heart text-white shadow-md"
          : "bg-white/70 text-ink hover:bg-white"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

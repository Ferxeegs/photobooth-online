import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "dark";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
}

const styles: Record<Variant, string> = {
  primary:
    "bg-heart text-white shadow-[0_10px_24px_rgb(124_58_237_/_0.35)] hover:brightness-105 active:scale-[0.98]",
  secondary:
    "bg-white/80 text-ink border border-blush/70 hover:bg-white active:scale-[0.98]",
  ghost: "bg-transparent text-ink hover:bg-white/40",
  dark: "bg-ink text-cream hover:bg-ink/90 active:scale-[0.98]",
};

export function Button({
  variant = "primary",
  className = "",
  icon,
  children,
  type = "button",
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-base font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

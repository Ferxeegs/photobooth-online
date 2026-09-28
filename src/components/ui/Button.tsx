import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "dark" | "gradient";

export interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"
  > {
  variant?: Variant;
  icon?: ReactNode;
}

const styles: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-[0_8px_25px_rgba(124,58,237,0.38)] hover:shadow-[0_12px_30px_rgba(124,58,237,0.5)] border border-white/20",
  gradient:
    "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-[0_8px_25px_rgba(236,72,153,0.38)] border border-white/20",
  secondary:
    "bg-white/90 text-ink border border-purple-200/80 hover:border-purple-300 hover:bg-white shadow-sm",
  ghost: "bg-transparent text-ink hover:bg-white/50",
  dark: "bg-slate-900 text-purple-100 hover:bg-slate-800 shadow-md border border-slate-700/50",
};

export function Button({
  variant = "primary",
  className = "",
  icon,
  children,
  type = "button",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.025, y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.965 }}
      type={type}
      disabled={disabled}
      className={`relative inline-flex min-h-12 items-center justify-center gap-2.5 overflow-hidden rounded-2xl px-5 py-3 text-base font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 select-none ${styles[variant]} ${className}`}
      {...(props as any)}
    >
      {icon && <span className="shrink-0 transition-transform group-hover:scale-110">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
}

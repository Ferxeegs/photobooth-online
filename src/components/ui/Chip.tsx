import { motion } from "framer-motion";
import type { ButtonHTMLAttributes } from "react";

export interface ChipProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"
  > {
  active?: boolean;
}

export function Chip({ active, className = "", children, ...props }: ChipProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type="button"
      className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-semibold transition-all select-none ${
        active
          ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_4px_14px_rgba(124,58,237,0.4)] ring-2 ring-violet-300/60"
          : "bg-white/80 text-purple-950 border border-purple-100 hover:bg-white hover:shadow-sm"
      } ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}

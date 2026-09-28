import { FloatingParticles } from "@/components/FloatingParticles";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  progress?: number;
  onBack?: () => void;
  dark?: boolean;
  wide?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}

export function Shell({
  title,
  subtitle,
  progress,
  onBack,
  dark,
  wide,
  children,
  footer,
}: Props) {
  const width = wide ? "max-w-5xl" : "max-w-3xl";

  return (
    <div
      className={`relative flex min-h-dvh flex-col transition-colors duration-300 ${
        dark ? "bg-app-dark text-[#f6eef8]" : "bg-app text-purple-950"
      }`}
    >
      <FloatingParticles count={dark ? 8 : 14} />

      <header
        className={`sticky top-0 z-30 border-b border-white/40 px-4 py-3 backdrop-blur-xl transition-all ${
          dark ? "bg-slate-950/40 border-slate-800/50" : "bg-white/60 shadow-xs"
        }`}
      >
        <div className={`mx-auto flex w-full ${width} items-center gap-3`}>
          {onBack ? (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={onBack}
              className={`grid size-11 place-items-center rounded-2xl transition-all ${
                dark
                  ? "bg-slate-800/80 text-purple-200 hover:bg-slate-700"
                  : "bg-white/90 text-purple-950 shadow-sm border border-purple-100 hover:bg-white"
              }`}
              aria-label="Kembali"
            >
              <ArrowLeft size={20} />
            </motion.button>
          ) : (
            <div className="size-11" />
          )}

          <div className="min-w-0 flex-1 text-center">
            <h1 className="truncate font-display text-xl font-bold leading-tight tracking-wide drop-shadow-xs">
              {title}
            </h1>
            {subtitle ? (
              <p
                className={`truncate text-xs font-medium ${
                  dark ? "text-purple-300/80" : "text-purple-900/60"
                }`}
              >
                {subtitle}
              </p>
            ) : null}
          </div>

          <div className="flex size-11 items-center justify-end">
            <span className="text-lg">✨</span>
          </div>
        </div>

        {typeof progress === "number" ? (
          <div
            className={`relative mx-auto mt-2.5 h-2 w-full ${width} overflow-hidden rounded-full ${
              dark ? "bg-slate-800/60" : "bg-white/70"
            }`}
          >
            <motion.div
              className="relative h-full rounded-full bg-gradient-to-r from-violet-500 via-pink-500 to-purple-500 shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 size-2 rounded-full bg-white shadow-md animate-ping" />
            </motion.div>
          </div>
        ) : null}
      </header>

      <main className={`relative z-10 mx-auto flex w-full ${width} flex-1 flex-col px-4 py-5 sm:px-6`}>
        {children}
      </main>

      {footer ? (
        <footer
          className={`sticky bottom-0 z-30 border-t border-white/40 px-4 py-3.5 backdrop-blur-xl thumb-safe ${
            dark ? "bg-slate-950/60 border-slate-800/50" : "bg-white/70 shadow-lg"
          }`}
        >
          <div className={`mx-auto w-full ${width}`}>{footer}</div>
        </footer>
      ) : null}
    </div>
  );
}

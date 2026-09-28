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
    <div className={`flex min-h-dvh flex-col ${dark ? "bg-app-dark text-[#f6eef8]" : "bg-app"}`}>
      <header className={`sticky top-0 z-20 border-b border-white/30 px-4 py-3 backdrop-blur-md ${dark ? "bg-black/30" : "bg-cream/70"}`}>
        <div className={`mx-auto flex w-full ${width} items-center gap-3`}>
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="grid size-11 place-items-center rounded-2xl bg-white/70 text-ink"
              aria-label="Kembali"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div className="size-11" />
          )}
          <div className="min-w-0 flex-1 text-center">
            <h1 className="truncate font-display text-xl leading-tight">{title}</h1>
            {subtitle ? (
              <p className="truncate text-xs text-ink-soft">{subtitle}</p>
            ) : null}
          </div>
          <div className="size-11" />
        </div>
        {typeof progress === "number" ? (
          <div className={`mx-auto mt-3 h-1.5 w-full ${width} overflow-hidden rounded-full bg-white/60`}>
            <div
              className="h-full rounded-full bg-heart transition-all"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        ) : null}
      </header>
      <main className={`mx-auto flex w-full ${width} flex-1 flex-col px-4 py-4`}>
        {children}
      </main>
      {footer ? (
        <footer className="sticky bottom-0 z-20 border-t border-white/40 bg-cream/80 px-4 py-3 backdrop-blur-md thumb-safe">
          <div className={`mx-auto w-full ${width}`}>{footer}</div>
        </footer>
      ) : null}
    </div>
  );
}

import { frames, themeLabels } from "@/data/frames";
import type { ThemeId } from "@/types";
import { motion } from "framer-motion";
import { useMemo } from "react";

export function FrameSwatch({
  frameId,
  selected,
}: {
  frameId: string;
  selected: boolean;
}) {
  const frame = useMemo(
    () => frames.find((item) => item.id === frameId),
    [frameId],
  );
  if (!frame) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.96 }}
      className={`relative overflow-hidden rounded-3xl transition-all select-none ${
        selected
          ? "ring-4 ring-purple-400 shadow-lg border-2 border-white"
          : "border border-purple-100 hover:shadow-md"
      }`}
    >
      <div
        className="flex h-28 items-end justify-center p-2.5 relative"
        style={{ background: frame.bg }}
      >
        <div
          className="h-16 w-12 rounded-lg shadow-md border border-white/40"
          style={{ background: frame.accent }}
        />
        {selected && (
          <span className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-white text-violet-700 text-xs font-bold shadow-xs">
            ✓
          </span>
        )}
      </div>

      <div className="bg-white/90 p-2.5 backdrop-blur-xs">
        <p className="truncate font-display text-sm font-bold text-purple-950">{frame.name}</p>
        <p className="text-[11px] font-semibold text-purple-800/60">{themeLabels[frame.theme as ThemeId]}</p>
      </div>
    </motion.div>
  );
}

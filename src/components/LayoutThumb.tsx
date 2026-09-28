import type { Layout } from "@/types";
import { motion } from "framer-motion";

export function LayoutThumb({ layout, selected }: { layout: Layout; selected: boolean }) {
  const { width, height } = layout.canvas;
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`relative overflow-hidden rounded-3xl p-3.5 transition-all select-none ${
        selected
          ? "bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 text-white shadow-[0_10px_25px_rgba(124,58,237,0.4)] ring-4 ring-violet-300/70"
          : "glass-card text-purple-950 hover:bg-white hover:shadow-md border border-purple-100"
      }`}
    >
      {selected && (
        <span className="absolute top-2 right-2 text-xs font-bold bg-white text-violet-700 size-5 rounded-full flex items-center justify-center shadow-xs">
          ✓
        </span>
      )}

      <div
        className={`relative mx-auto overflow-hidden rounded-xl p-1.5 transition-colors ${
          selected ? "bg-white/20 border border-white/40" : "bg-purple-100/60"
        }`}
        style={{
          width: 76,
          height: Math.round(76 * (height / width)),
        }}
      >
        {layout.slots.map((slot, i) => (
          <div
            key={`${layout.id}-${i}`}
            className={`absolute rounded-sm transition-all ${
              selected ? "bg-white shadow-xs" : "bg-purple-400/70"
            }`}
            style={{
              left: `${(slot.x / width) * 100}%`,
              top: `${(slot.y / height) * 100}%`,
              width: `${(slot.w / width) * 100}%`,
              height: `${(slot.h / height) * 100}%`,
            }}
          />
        ))}
      </div>

      <p className="mt-3 text-center font-display text-sm font-bold leading-tight">{layout.name}</p>
      <p className={`mt-0.5 text-center text-[11px] font-semibold ${selected ? "text-purple-100" : "text-purple-800/60"}`}>
        {layout.photoCount} Foto
      </p>
    </motion.div>
  );
}

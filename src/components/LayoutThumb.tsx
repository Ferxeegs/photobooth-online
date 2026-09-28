import type { Layout } from "@/types";

export function LayoutThumb({ layout, selected }: { layout: Layout; selected: boolean }) {
  const { width, height } = layout.canvas;
  return (
    <div
      className={`rounded-2xl p-3 transition ${
        selected ? "bg-heart text-white shadow-lg" : "bg-white/80 text-ink"
      }`}
    >
      <div
        className="relative mx-auto overflow-hidden rounded-lg bg-white/40"
        style={{
          width: 72,
          height: Math.round(72 * (height / width)),
        }}
      >
        {layout.slots.map((slot, i) => (
          <div
            key={`${layout.id}-${i}`}
            className={`absolute rounded-[2px] ${selected ? "bg-white/80" : "bg-blush/70"}`}
            style={{
              left: `${(slot.x / width) * 100}%`,
              top: `${(slot.y / height) * 100}%`,
              width: `${(slot.w / width) * 100}%`,
              height: `${(slot.h / height) * 100}%`,
            }}
          />
        ))}
      </div>
      <p className="mt-2 text-center font-display text-sm leading-tight">{layout.name}</p>
      <p className={`mt-0.5 text-center text-[11px] ${selected ? "text-white/80" : "text-ink-soft"}`}>
        {layout.photoCount} foto
      </p>
    </div>
  );
}

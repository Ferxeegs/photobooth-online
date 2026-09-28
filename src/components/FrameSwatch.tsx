import { frames, themeLabels } from "@/data/frames";
import { drawDecorations, drawSlotOrnaments, pathRoundedRect, roundedRect } from "@/lib/decorations";
import type { Slot, ThemeId } from "@/types";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!frame || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const w = 160;
    const h = 200;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = frame.bg;
    ctx.fillRect(0, 0, w, h);
    const slots: Slot[] = [
      { x: 22, y: 22, w: 116, h: 72, radius: 10 },
      { x: 22, y: 104, w: 116, h: 72, radius: 10 },
    ];
    slots.forEach((slot) => {
      roundedRect(ctx, slot.x - 4, slot.y - 4, slot.w + 8, slot.h + 8, slot.radius + 4);
      ctx.fillStyle = frame.mat;
      ctx.fill();
      roundedRect(ctx, slot.x, slot.y, slot.w, slot.h, slot.radius);
      ctx.fillStyle = `${frame.accent}55`;
      ctx.fill();
    });
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    slots.forEach((slot) => {
      pathRoundedRect(ctx, slot.x, slot.y, slot.w, slot.h, slot.radius);
      ctx.closePath();
    });
    ctx.clip("evenodd");
    drawDecorations(ctx, frame.decoration, w, h, frame.accent);
    ctx.restore();
    drawSlotOrnaments(ctx, frame.decoration, slots, frame.accent);
  }, [frame]);

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
      <canvas
        ref={canvasRef}
        className="block h-32 w-full object-cover"
        aria-hidden
      />
      {selected ? (
        <span className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-white text-xs font-bold text-violet-700 shadow-xs">
          ✓
        </span>
      ) : null}
      <div className="bg-white/90 p-2.5 backdrop-blur-xs">
        <p className="truncate font-display text-sm font-bold text-purple-950">{frame.name}</p>
        <p className="text-[11px] font-semibold text-purple-800/60">
          {themeLabels[frame.theme as ThemeId]}
        </p>
      </div>
    </motion.div>
  );
}

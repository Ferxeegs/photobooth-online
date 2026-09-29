import { frames, themeLabels } from "@/data/frames";
import { drawDecorations, pathRoundedRect, roundedRect } from "@/lib/decorations";
import { loadMofusandImages } from "@/lib/mofusand";
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
    let cancelled = false;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    void loadMofusandImages(frame.decoration).then((assets) => {
      if (cancelled || !canvasRef.current) return;
      ctx.fillStyle = frame.bg;
      ctx.fillRect(0, 0, w, h);
      const slots: Slot[] = [
        { x: 24, y: 28, w: 112, h: 66, radius: 0 },
        { x: 24, y: 104, w: 112, h: 66, radius: 0 },
      ];
      slots.forEach((slot) => {
        roundedRect(ctx, slot.x - 5, slot.y - 5, slot.w + 10, slot.h + 10, 0);
        ctx.fillStyle = frame.mat;
        ctx.fill();
        roundedRect(ctx, slot.x, slot.y, slot.w, slot.h, 0);
        const g = ctx.createLinearGradient(slot.x, slot.y, slot.x + slot.w, slot.y + slot.h);
        g.addColorStop(0, `${frame.accent}55`);
        g.addColorStop(1, `${frame.accent}22`);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 1;
        roundedRect(ctx, slot.x + 0.5, slot.y + 0.5, slot.w - 1, slot.h - 1, 0);
        ctx.stroke();
      });
      ctx.save();
      if (!frame.decoration.startsWith("mofusand-")) {
        ctx.beginPath();
        ctx.rect(0, 0, w, h);
        slots.forEach((slot) => {
          pathRoundedRect(ctx, slot.x, slot.y, slot.w, slot.h, 0);
          ctx.closePath();
        });
        ctx.clip("evenodd");
      }
      drawDecorations(ctx, frame.decoration, w, h, frame.accent, assets);
      ctx.restore();
    });

    return () => {
      cancelled = true;
    };
  }, [frame]);

  if (!frame) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`relative overflow-hidden rounded-3xl transition-all select-none ${
        selected
          ? "border-2 border-white shadow-lg ring-4 ring-purple-400"
          : "border border-purple-100 hover:shadow-md"
      }`}
    >
      <canvas
        ref={canvasRef}
        className="block aspect-[4/5] w-full object-cover"
        aria-hidden
      />
      {selected ? (
        <span className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-white text-xs font-bold text-violet-700 shadow-xs">
          ✓
        </span>
      ) : null}
      <div className="bg-white/95 p-2.5">
        <p className="truncate font-display text-sm font-bold text-purple-950">{frame.name}</p>
        <p className="text-[11px] font-semibold text-purple-800/60">
          {themeLabels[frame.theme as ThemeId]}
        </p>
      </div>
    </motion.div>
  );
}

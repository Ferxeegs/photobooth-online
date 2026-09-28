import { getFrame } from "@/data/frames";
import { getLayout } from "@/data/layouts";
import { renderCollage } from "@/lib/render";
import { useSession } from "@/store/session";
import { useEffect, useRef, useState } from "react";

interface Props {
  className?: string;
  maxHeight?: number;
  interactive?: boolean;
}

export function CollagePreview({
  className = "",
  maxHeight = 520,
  interactive = false,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(true);
  const dragging = useRef<string | null>(null);
  const {
    layoutId,
    photos,
    frameId,
    background,
    filter,
    stickers,
    caption,
    showDate,
    watermark,
    updateSticker,
  } = useSession();

  useEffect(() => {
    let cancelled = false;
    const layout = getLayout(layoutId);
    const frame = getFrame(frameId);
    const displayScale = Math.min(
      1,
      900 / Math.max(layout.canvas.width, layout.canvas.height),
    );
    setBusy(true);
    void renderCollage({
      layout,
      photos,
      frame,
      background,
      filter,
      stickers,
      caption,
      showDate,
      watermark,
      scale: displayScale,
    }).then((offscreen) => {
      if (cancelled) return;
      const target = canvasRef.current;
      if (!target) return;
      target.width = offscreen.width;
      target.height = offscreen.height;
      const ctx = target.getContext("2d");
      ctx?.drawImage(offscreen, 0, 0);
      setBusy(false);
    });
    return () => {
      cancelled = true;
    };
  }, [
    layoutId,
    photos,
    frameId,
    background,
    filter,
    stickers,
    caption,
    showDate,
    watermark,
  ]);

  function pointerToNorm(event: React.PointerEvent): { x: number; y: number } {
    const box = wrapRef.current?.getBoundingClientRect();
    if (!box) return { x: 0.5, y: 0.5 };
    return {
      x: Math.min(1, Math.max(0, (event.clientX - box.left) / box.width)),
      y: Math.min(1, Math.max(0, (event.clientY - box.top) / box.height)),
    };
  }

  function onPointerDown(event: React.PointerEvent): void {
    if (!interactive) return;
    const { x, y } = pointerToNorm(event);
    const hit = [...stickers].reverse().find((sticker) => {
      const dx = sticker.x - x;
      const dy = sticker.y - y;
      return Math.hypot(dx, dy) < 0.08 * sticker.scale;
    });
    if (hit) {
      dragging.current = hit.id;
      (event.target as HTMLElement).setPointerCapture(event.pointerId);
    }
  }

  function onPointerMove(event: React.PointerEvent): void {
    if (!dragging.current) return;
    const { x, y } = pointerToNorm(event);
    updateSticker(dragging.current, { x, y });
  }

  function onPointerUp(): void {
    dragging.current = null;
  }

  const layout = getLayout(layoutId);
  const ratio = layout.canvas.height / layout.canvas.width;

  return (
    <div
      ref={wrapRef}
      className={`relative mx-auto overflow-hidden rounded-3xl bg-white shadow-lg ${className}`}
      style={{
        width: "min(100%, 420px)",
        maxHeight,
        aspectRatio: `${layout.canvas.width} / ${layout.canvas.height}`,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full object-contain"
        style={{ maxHeight }}
        aria-label="Pratinjau kolase"
      />
      {busy ? (
        <div className="absolute inset-0 grid place-items-center bg-white/40 text-sm text-ink-soft">
          Menyusun pratinjau…
        </div>
      ) : null}
      <span className="sr-only">Rasio {ratio.toFixed(2)}</span>
    </div>
  );
}

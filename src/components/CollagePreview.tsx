import { getFrame } from "@/data/frames";
import { getLayout } from "@/data/layouts";
import { renderCollage } from "@/lib/render";
import { useSession } from "@/store/session";
import type { PlacedSticker } from "@/types";
import { useEffect, useRef, useState, type RefObject } from "react";

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

  const stickerBakeKey = interactive
    ? "overlay"
    : stickers.map((item) => `${item.id}:${item.x}:${item.y}:${item.scale}`).join("|");

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
      stickers: interactive ? [] : stickers,
      caption,
      showDate,
      watermark,
      scale: displayScale,
      includeStickers: !interactive,
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
    caption,
    showDate,
    watermark,
    interactive,
    stickerBakeKey,
  ]);

  const layout = getLayout(layoutId);

  return (
    <div
      ref={wrapRef}
      className={`relative mx-auto overflow-hidden rounded-3xl bg-white shadow-lg ${className}`}
      style={{
        width: "min(100%, 420px)",
        maxHeight,
        aspectRatio: `${layout.canvas.width} / ${layout.canvas.height}`,
        touchAction: interactive ? "none" : undefined,
      }}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none block h-full w-full object-contain"
        style={{ maxHeight }}
        aria-label="Pratinjau kolase"
      />
      {interactive
        ? stickers.map((sticker) => (
            <DraggableSticker
              key={sticker.id}
              sticker={sticker}
              wrapRef={wrapRef}
              onMove={updateSticker}
            />
          ))
        : null}
      {busy ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-white/40 text-sm text-ink-soft">
          Menyusun pratinjau…
        </div>
      ) : null}
    </div>
  );
}

function DraggableSticker({
  sticker,
  wrapRef,
  onMove,
}: {
  sticker: PlacedSticker;
  wrapRef: RefObject<HTMLDivElement | null>;
  onMove: (id: string, patch: Partial<PlacedSticker>) => void;
}) {
  const nodeRef = useRef<HTMLButtonElement>(null);
  const drag = useRef<{
    pointerId: number;
    grabX: number;
    grabY: number;
  } | null>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const onDown = (event: PointerEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const box = wrapRef.current?.getBoundingClientRect();
      if (!box) return;
      drag.current = {
        pointerId: event.pointerId,
        grabX: (event.clientX - box.left) / box.width - sticker.x,
        grabY: (event.clientY - box.top) / box.height - sticker.y,
      };
      node.setPointerCapture(event.pointerId);
      node.style.zIndex = "20";
      node.style.transform = `translate(-50%, -50%) scale(${sticker.scale * 1.12}) rotate(${sticker.rotation}deg)`;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!drag.current || drag.current.pointerId !== event.pointerId) return;
      event.preventDefault();
      const box = wrapRef.current?.getBoundingClientRect();
      if (!box) return;
      const x = clamp01((event.clientX - box.left) / box.width - drag.current.grabX);
      const y = clamp01((event.clientY - box.top) / box.height - drag.current.grabY);
      node.style.left = `${x * 100}%`;
      node.style.top = `${y * 100}%`;
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!drag.current || drag.current.pointerId !== event.pointerId) return;
      const box = wrapRef.current?.getBoundingClientRect();
      if (box) {
        const x = clamp01((event.clientX - box.left) / box.width - drag.current.grabX);
        const y = clamp01((event.clientY - box.top) / box.height - drag.current.grabY);
        onMove(sticker.id, { x, y });
      }
      drag.current = null;
      node.style.zIndex = "10";
      node.style.transform = `translate(-50%, -50%) scale(${sticker.scale}) rotate(${sticker.rotation}deg)`;
    };

    const blockScroll = (event: TouchEvent) => {
      event.preventDefault();
    };

    const preventMenu = (event: Event) => event.preventDefault();

    node.addEventListener("pointerdown", onDown);
    node.addEventListener("pointermove", onPointerMove);
    node.addEventListener("pointerup", onPointerUp);
    node.addEventListener("pointercancel", onPointerUp);
    node.addEventListener("contextmenu", preventMenu);
    node.addEventListener("touchmove", blockScroll, { passive: false });
    return () => {
      node.removeEventListener("pointerdown", onDown);
      node.removeEventListener("pointermove", onPointerMove);
      node.removeEventListener("pointerup", onPointerUp);
      node.removeEventListener("pointercancel", onPointerUp);
      node.removeEventListener("contextmenu", preventMenu);
      node.removeEventListener("touchmove", blockScroll);
    };
  }, [onMove, sticker.id, sticker.scale, sticker.rotation, sticker.x, sticker.y, wrapRef]);

  return (
    <button
      ref={nodeRef}
      type="button"
      aria-label={`Geser stiker ${sticker.emoji}`}
      className="absolute z-10 grid place-items-center rounded-full text-[42px] leading-none select-none"
      style={{
        left: `${sticker.x * 100}%`,
        top: `${sticker.y * 100}%`,
        width: 56,
        height: 56,
        transform: `translate(-50%, -50%) scale(${sticker.scale}) rotate(${sticker.rotation}deg)`,
        touchAction: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    >
      {sticker.emoji}
    </button>
  );
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

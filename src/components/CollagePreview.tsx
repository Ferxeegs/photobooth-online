import { getFrame } from "@/data/frames";
import { getLayout } from "@/data/layouts";
import {
  drawStickers,
  preloadPlacedStickers,
  renderCollage,
  STICKER_BASE_SIZE,
} from "@/lib/render";
import { useSession } from "@/store/session";
import type { PlacedSticker } from "@/types";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

interface Props {
  className?: string;
  maxHeight?: number;
  interactive?: boolean;
  selectedStickerId?: string | null;
  onSelectSticker?: (id: string | null) => void;
}

export function CollagePreview({
  className = "",
  maxHeight = 520,
  interactive = false,
  selectedStickerId = null,
  onSelectSticker,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stickerCanvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const livePositions = useRef(new Map<string, { x: number; y: number }>());
  const stickersRef = useRef<PlacedSticker[]>([]);
  const [busy, setBusy] = useState(true);
  const [wrapWidth, setWrapWidth] = useState(0);
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

  const layout = getLayout(layoutId);
  stickersRef.current = stickers;

  const stickerKey = stickers
    .map(
      (item) =>
        `${item.id}:${item.x}:${item.y}:${item.scale}:${item.rotation}:${item.emoji}:${item.mofusandId ?? ""}:${item.kittyId ?? ""}`,
    )
    .join("|");

  const paintStickers = () => {
    const canvas = stickerCanvasRef.current;
    if (!canvas || !interactive) return;
    const { width: cw, height: ch } = layout.canvas;
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, cw, ch);
    const merged = stickersRef.current.map((sticker) => {
      const live = livePositions.current.get(sticker.id);
      return live ? { ...sticker, x: live.x, y: live.y } : sticker;
    });
    drawStickers(ctx, merged, cw, ch);
  };

  const paintStickersRef = useRef(paintStickers);
  paintStickersRef.current = paintStickers;
  const requestPaint = useRef(() => {
    paintStickersRef.current();
  }).current;

  // Base collage — stickers only baked when not interactive
  useEffect(() => {
    let cancelled = false;
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
      paintStickersRef.current();
    });
    return () => {
      cancelled = true;
    };
    // stickerKey only matters when baking into base canvas
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    interactive ? "" : stickerKey,
  ]);

  useLayoutEffect(() => {
    let cancelled = false;
    void preloadPlacedStickers(stickers).then(() => {
      if (!cancelled) paintStickersRef.current();
    });
    return () => {
      cancelled = true;
    };
  }, [interactive, stickerKey, layout.canvas.width, layout.canvas.height, stickers]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setWrapWidth(entries[0]?.contentRect.width ?? 0);
    });
    ro.observe(el);
    setWrapWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, [layoutId]);

  const canvasAspect = layout.canvas.width / layout.canvas.height;
  // Cap width so height never exceeds maxHeight (avoids squashed strip previews)
  const widthCapPx = Math.min(420, maxHeight * canvasAspect);

  return (
    <div
      ref={wrapRef}
      className={`relative mx-auto overflow-hidden bg-white shadow-lg ${className}`}
      style={{
        width: `min(100%, ${widthCapPx}px)`,
        aspectRatio: `${layout.canvas.width} / ${layout.canvas.height}`,
        height: "auto",
        touchAction: interactive ? "none" : undefined,
      }}
      onPointerDown={() => {
        if (interactive) onSelectSticker?.(null);
      }}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 block h-full w-full object-contain"
        aria-label="Pratinjau kolase"
      />
      {interactive ? (
        <canvas
          ref={stickerCanvasRef}
          className="pointer-events-none absolute inset-0 block h-full w-full object-contain"
          aria-hidden
        />
      ) : null}
      {interactive
        ? stickers.map((sticker) => (
            <StickerHitTarget
              key={sticker.id}
              sticker={sticker}
              selected={selectedStickerId === sticker.id}
              canvasWidth={layout.canvas.width}
              wrapWidth={wrapWidth}
              wrapRef={wrapRef}
              livePositions={livePositions}
              onPaint={requestPaint}
              onMove={updateSticker}
              onSelect={() => onSelectSticker?.(sticker.id)}
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

function StickerHitTarget({
  sticker,
  selected,
  canvasWidth,
  wrapWidth,
  wrapRef,
  livePositions,
  onPaint,
  onMove,
  onSelect,
}: {
  sticker: PlacedSticker;
  selected: boolean;
  canvasWidth: number;
  wrapWidth: number;
  wrapRef: RefObject<HTMLDivElement | null>;
  livePositions: RefObject<Map<string, { x: number; y: number }>>;
  onPaint: () => void;
  onMove: (id: string, patch: Partial<PlacedSticker>) => void;
  onSelect: () => void;
}) {
  const nodeRef = useRef<HTMLButtonElement>(null);
  const drag = useRef<{
    pointerId: number;
    grabX: number;
    grabY: number;
    moved: boolean;
    x: number;
    y: number;
  } | null>(null);

  const sizePx =
    wrapWidth > 0
      ? Math.max(
          28,
          (STICKER_BASE_SIZE *
            sticker.scale *
            (sticker.mofusandId || sticker.kittyId ? 1.35 : 1) *
            wrapWidth) /
            canvasWidth,
        )
      : Math.max(
          28,
          STICKER_BASE_SIZE * sticker.scale * (sticker.mofusandId || sticker.kittyId ? 1.35 : 1),
        );

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const onDown = (event: PointerEvent) => {
      event.preventDefault();
      event.stopPropagation();
      onSelect();
      const box = wrapRef.current?.getBoundingClientRect();
      if (!box || box.width <= 0 || box.height <= 0) return;
      drag.current = {
        pointerId: event.pointerId,
        grabX: (event.clientX - box.left) / box.width - sticker.x,
        grabY: (event.clientY - box.top) / box.height - sticker.y,
        moved: false,
        x: sticker.x,
        y: sticker.y,
      };
      node.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!drag.current || drag.current.pointerId !== event.pointerId) return;
      event.preventDefault();
      drag.current.moved = true;
      const box = wrapRef.current?.getBoundingClientRect();
      if (!box || box.width <= 0 || box.height <= 0) return;
      const x = clamp01((event.clientX - box.left) / box.width - drag.current.grabX);
      const y = clamp01((event.clientY - box.top) / box.height - drag.current.grabY);
      drag.current.x = x;
      drag.current.y = y;
      node.style.left = `${x * 100}%`;
      node.style.top = `${y * 100}%`;
      livePositions.current?.set(sticker.id, { x, y });
      onPaint();
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!drag.current || drag.current.pointerId !== event.pointerId) return;
      const { moved, x, y } = drag.current;
      drag.current = null;
      livePositions.current?.delete(sticker.id);
      if (moved) onMove(sticker.id, { x, y });
      onPaint();
    };

    const blockScroll = (event: TouchEvent) => event.preventDefault();
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
  }, [livePositions, onMove, onPaint, onSelect, sticker.id, sticker.x, sticker.y, wrapRef]);

  return (
    <button
      ref={nodeRef}
      type="button"
      aria-label={`Stiker ${sticker.kittyId ? `Kitty ${sticker.kittyId}` : sticker.mofusandId ? `Mofusand ${sticker.mofusandId}` : sticker.emoji}${selected ? ", terpilih" : ""}`}
      aria-pressed={selected}
      className="absolute z-10 rounded-full border-0 bg-transparent p-0"
      style={{
        left: `${sticker.x * 100}%`,
        top: `${sticker.y * 100}%`,
        width: sizePx,
        height: sizePx,
        transform: "translate(-50%, -50%)",
        touchAction: "none",
        cursor: "grab",
        background: "transparent",
        boxShadow: selected ? "0 0 0 2px rgba(124,58,237,0.9)" : undefined,
        zIndex: selected ? 15 : 10,
      }}
    />
  );
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

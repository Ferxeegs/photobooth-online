import { applyPhotoFilter } from "@/lib/colorFilter";
import { drawDecorations, pathRoundedRect, roundedRect } from "@/lib/decorations";
import { getKittySprite, loadKittyImages, loadKittySprite } from "@/lib/kitty";
import {
  getMofusandSprite,
  loadMofusandImages,
  loadMofusandSprite,
} from "@/lib/mofusand";
import type { FilterId, FrameStyle, Layout, Photo, PlacedSticker } from "@/types";

/** Base emoji / Mofusand size in layout canvas units at scale = 1. */
export const STICKER_BASE_SIZE = 64;

const STICKER_FONT =
  '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';

/** Preload keyed Mofusand sprites used by placed stickers. */
export async function preloadPlacedStickers(
  stickers: PlacedSticker[],
): Promise<void> {
  const mofusandIds = stickers
    .map((item) => item.mofusandId)
    .filter((id): id is number => typeof id === "number");
  const kittyIds = stickers
    .map((item) => item.kittyId)
    .filter((id): id is number => typeof id === "number");
  await Promise.all([
    ...[...new Set(mofusandIds)].map((id) => loadMofusandSprite(id)),
    ...[...new Set(kittyIds)].map((id) => loadKittySprite(id)),
  ]);
}

/** Draw stickers in layout canvas coordinates (same path for preview + export). */
export function drawStickers(
  ctx: CanvasRenderingContext2D,
  stickers: PlacedSticker[],
  canvasW: number,
  canvasH: number,
): void {
  stickers.forEach((sticker) => {
    ctx.save();
    ctx.translate(sticker.x * canvasW, sticker.y * canvasH);
    ctx.rotate((sticker.rotation * Math.PI) / 180);
    const size = Math.max(1, Math.round(STICKER_BASE_SIZE * sticker.scale));

    const sprite = sticker.mofusandId
      ? getMofusandSprite(sticker.mofusandId)
      : sticker.kittyId
        ? getKittySprite(sticker.kittyId)
        : undefined;

    if (sprite) {
      const iw = sprite.width;
      const ih = sprite.height;
      if (iw && ih) {
        const scale = Math.min(size / iw, size / ih) * 1.35;
        const dw = iw * scale;
        const dh = ih * scale;
        ctx.shadowColor = sticker.kittyId
          ? "rgba(190, 24, 93, 0.18)"
          : "rgba(40, 30, 50, 0.2)";
        ctx.shadowBlur = Math.max(4, size * 0.08);
        ctx.shadowOffsetY = Math.max(1, size * 0.03);
        ctx.drawImage(sprite, -dw / 2, -dh / 2, dw, dh);
      }
    } else if (sticker.emoji) {
      ctx.font = `${size}px ${STICKER_FONT}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(sticker.emoji, 0, 0);
    }
    ctx.restore();
  });
}

const imageCache = new Map<string, HTMLImageElement>();

export async function loadImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src);
  if (cached?.complete) return cached;
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  await img.decode();
  imageCache.set(src, img);
  return img;
}

export function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | HTMLCanvasElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  focalX: number,
  focalY: number,
  zoom: number,
): void {
  const imgW = img instanceof HTMLCanvasElement ? img.width : img.naturalWidth || img.width;
  const imgH = img instanceof HTMLCanvasElement ? img.height : img.naturalHeight || img.height;
  const safeZoom = Math.max(1, zoom);
  const scale = Math.max(dw / imgW, dh / imgH) * safeZoom;
  let sw = dw / scale;
  let sh = dh / scale;
  sw = Math.min(sw, imgW);
  sh = Math.min(sh, imgH);
  let sx = focalX * imgW - sw / 2;
  let sy = focalY * imgH - sh / 2;
  sx = Math.max(0, Math.min(imgW - sw, sx));
  sy = Math.max(0, Math.min(imgH - sh, sy));
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

export interface RenderOptions {
  layout: Layout;
  photos: Photo[];
  frame: FrameStyle;
  background: string;
  filter: FilterId;
  stickers: PlacedSticker[];
  caption: string;
  showDate: boolean;
  watermark: boolean;
  scale: number;
  includeStickers?: boolean;
}

export async function renderCollage(
  options: RenderOptions,
): Promise<HTMLCanvasElement> {
  const {
    layout,
    photos,
    frame,
    background,
    filter,
    stickers,
    caption,
    showDate,
    watermark,
    scale,
    includeStickers = true,
  } = options;
  const width = Math.round(layout.canvas.width * scale);
  const height = Math.round(layout.canvas.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D tidak tersedia di browser ini.");

  ctx.scale(scale, scale);
  ctx.fillStyle = background || frame.bg;
  ctx.fillRect(0, 0, layout.canvas.width, layout.canvas.height);

  const loaded = await Promise.all(
    photos.map((photo) => loadImage(photo.src).catch(() => null)),
  );
  const filtered = loaded.map((img) =>
    img ? applyPhotoFilter(img, filter) : null,
  );

  const cutie = frame.decoration === "kitty-cutie";

  layout.slots.forEach((slot, index) => {
    const img = filtered[index];
    const photo = photos[index];
    const radius = cutie ? Math.round(Math.min(22, slot.w * 0.045)) : slot.radius;

    if (!cutie) {
      ctx.save();
      roundedRect(ctx, slot.x - 10, slot.y - 10, slot.w + 20, slot.h + 20, radius);
      ctx.fillStyle = frame.mat || "#ffffff";
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = "rgba(42,24,72,0.08)";
      ctx.lineWidth = 1;
      roundedRect(
        ctx,
        slot.x - 10.5,
        slot.y - 10.5,
        slot.w + 21,
        slot.h + 21,
        radius,
      );
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    roundedRect(ctx, slot.x, slot.y, slot.w, slot.h, radius);
    ctx.clip();
    ctx.fillStyle = cutie ? "#FFF0F5" : "#e8e0ea";
    ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
    if (img && photo) {
      drawCover(
        ctx,
        img,
        slot.x,
        slot.y,
        slot.w,
        slot.h,
        photo.offsetX,
        photo.offsetY,
        photo.zoom,
      );
    }
    ctx.restore();

    ctx.save();
    if (cutie) {
      ctx.strokeStyle = "#F8C4D8";
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 7]);
      roundedRect(ctx, slot.x, slot.y, slot.w, slot.h, radius);
      ctx.stroke();
    } else {
      ctx.strokeStyle = "rgba(255,255,255,0.65)";
      ctx.lineWidth = 2;
      roundedRect(ctx, slot.x + 1, slot.y + 1, slot.w - 2, slot.h - 2, radius);
      ctx.stroke();
      ctx.strokeStyle = `${frame.accent}33`;
      ctx.lineWidth = 1.5;
      roundedRect(ctx, slot.x - 1, slot.y - 1, slot.w + 2, slot.h + 2, radius);
      ctx.stroke();
    }
    ctx.restore();
  });

  if (filter === "glow") {
    ctx.save();
    ctx.globalCompositeOperation = "soft-light";
    const glow = ctx.createRadialGradient(
      layout.canvas.width / 2,
      layout.canvas.height / 2,
      40,
      layout.canvas.width / 2,
      layout.canvas.height / 2,
      layout.canvas.width,
    );
    glow.addColorStop(0, "rgba(255,255,255,0.55)");
    glow.addColorStop(1, "rgba(196,181,253,0.08)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, layout.canvas.width, layout.canvas.height);
    ctx.restore();
  }

  const decoAssets = frame.decoration.startsWith("kitty-")
    ? await loadKittyImages(frame.decoration)
    : await loadMofusandImages(frame.decoration);
  const stickersOnTop =
    frame.decoration.startsWith("mofusand-") || frame.decoration.startsWith("kitty-");
  ctx.save();
  // Character stickers sit on top of photos; other themes stay in the margin only
  if (!stickersOnTop) {
    ctx.beginPath();
    ctx.rect(0, 0, layout.canvas.width, layout.canvas.height);
    layout.slots.forEach((slot) => {
      pathRoundedRect(ctx, slot.x, slot.y, slot.w, slot.h, slot.radius);
      ctx.closePath();
    });
    ctx.clip("evenodd");
  }
  drawDecorations(
    ctx,
    frame.decoration,
    layout.canvas.width,
    layout.canvas.height,
    frame.accent,
    decoAssets,
  );
  ctx.restore();

  const area = layout.captionArea;
  if (cutie) {
    drawCutieFooter(ctx, layout, frame, caption, showDate, area);
  } else if (area.h > 0) {
    const dateText = showDate ? formatCaptionDate(new Date()) : "";
    const lines = [caption.trim(), dateText].filter(Boolean);
    if (lines.length) {
      ctx.fillStyle = frame.captionColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const script = /romantic|letter|heart|lace|rose|sunset|cats-/i.test(
        frame.decoration,
      );
      const titleSize = Math.round(
        Math.min(
          script ? 84 : 58,
          Math.max(script ? 48 : 40, layout.canvas.width * (script ? 0.095 : 0.078)),
        ),
      );
      const dateSize = Math.round(Math.max(24, titleSize * 0.58));
      const gap = Math.round(titleSize * 0.2);
      const blockH = lines.length > 1 ? titleSize + gap + dateSize : titleSize;
      const bottomKeep = Math.round(Math.max(52, layout.canvas.height * 0.055));
      const idealTop = layout.canvas.height - bottomKeep - blockH;
      const top = Math.min(area.y + 6, Math.max(area.y - 80, idealTop));
      const titleY = top + titleSize / 2;
      ctx.font = script
        ? `${titleSize}px "Great Vibes", cursive`
        : `700 ${titleSize}px "Baloo 2", sans-serif`;
      ctx.fillText(lines[0], area.x + area.w / 2, titleY, area.w - 24);
      if (lines[1]) {
        ctx.font = `600 ${dateSize}px Poppins, sans-serif`;
        ctx.fillText(
          lines[1],
          area.x + area.w / 2,
          titleY + titleSize / 2 + gap + dateSize / 2,
          area.w - 24,
        );
      }
    }
  }

  if (includeStickers) {
    await preloadPlacedStickers(stickers);
    drawStickers(ctx, stickers, layout.canvas.width, layout.canvas.height);
  }

  if (watermark) {
    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = frame.captionColor;
    ctx.font = "600 16px Poppins, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("snapie", layout.canvas.width - 24, layout.canvas.height - 18);
    ctx.restore();
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return canvas;
}

export async function renderPrintSheet(
  collage: HTMLCanvasElement,
): Promise<HTMLCanvasElement> {
  const sheet = document.createElement("canvas");
  const isPortrait = collage.height >= collage.width;
  if (isPortrait) {
    sheet.width = collage.width * 2 + 48;
    sheet.height = collage.height + 48;
  } else {
    sheet.width = collage.width + 48;
    sheet.height = collage.height * 2 + 48;
  }
  const ctx = sheet.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D tidak tersedia.");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, sheet.width, sheet.height);
  if (isPortrait) {
    ctx.drawImage(collage, 16, 24);
    ctx.drawImage(collage, collage.width + 32, 24);
  } else {
    ctx.drawImage(collage, 24, 16);
    ctx.drawImage(collage, 24, collage.height + 32);
  }
  return sheet;
}

function formatCaptionDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function drawCutieFooter(
  ctx: CanvasRenderingContext2D,
  layout: Layout,
  frame: FrameStyle,
  caption: string,
  showDate: boolean,
  area: Layout["captionArea"],
): void {
  const title = caption.trim() || "Best Friends Forever";
  const titleSize = Math.round(
    Math.min(68, Math.max(40, layout.canvas.width * 0.082)),
  );
  const dateSize = Math.round(Math.max(13, titleSize * 0.3));
  const titleY = Math.min(area.y + titleSize * 0.45, layout.canvas.height - dateSize * 3.2);
  ctx.save();
  ctx.fillStyle = frame.captionColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${titleSize}px "Great Vibes", cursive`;
  ctx.fillText(title, layout.canvas.width / 2, titleY, area.w - 80);
  if (showDate) {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const stamp = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}   ·   PHOTOBOOTH MEMORY`;
    ctx.fillStyle = "#F4A4C0";
    ctx.font = `600 ${dateSize}px Poppins, sans-serif`;
    ctx.letterSpacing = "0.08em";
    ctx.fillText(stamp, layout.canvas.width / 2, titleY + titleSize * 0.72, area.w - 48);
  }
  ctx.restore();
}

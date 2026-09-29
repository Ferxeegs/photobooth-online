import { applyPhotoFilter } from "@/lib/colorFilter";
import type { FilterId, FrameStyle, Layout, Photo, PlacedSticker } from "@/types";
import { drawDecorations, pathRoundedRect, roundedRect } from "@/lib/decorations";

/** Base emoji size in layout canvas units at scale = 1. */
export const STICKER_BASE_SIZE = 64;

const STICKER_FONT =
  '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';

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
    ctx.font = `${size}px ${STICKER_FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(sticker.emoji, 0, 0);
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

  layout.slots.forEach((slot, index) => {
    const img = filtered[index];
    const photo = photos[index];

    // Polaroid / booth matte — sharp corners
    ctx.save();
    roundedRect(ctx, slot.x - 10, slot.y - 10, slot.w + 20, slot.h + 20, slot.radius);
    ctx.fillStyle = frame.mat || "#ffffff";
    ctx.fill();
    ctx.restore();

    // Soft matte edge
    ctx.save();
    ctx.strokeStyle = "rgba(42,24,72,0.08)";
    ctx.lineWidth = 1;
    roundedRect(
      ctx,
      slot.x - 10.5,
      slot.y - 10.5,
      slot.w + 21,
      slot.h + 21,
      slot.radius,
    );
    ctx.stroke();
    ctx.restore();

    ctx.save();
    roundedRect(ctx, slot.x, slot.y, slot.w, slot.h, slot.radius);
    ctx.clip();
    ctx.fillStyle = "#e8e0ea";
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

    // Clean studio rim on photo
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.65)";
    ctx.lineWidth = 2;
    roundedRect(ctx, slot.x + 1, slot.y + 1, slot.w - 2, slot.h - 2, slot.radius);
    ctx.stroke();
    ctx.strokeStyle = `${frame.accent}33`;
    ctx.lineWidth = 1.5;
    roundedRect(ctx, slot.x - 1, slot.y - 1, slot.w + 2, slot.h + 2, slot.radius);
    ctx.stroke();
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

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, layout.canvas.width, layout.canvas.height);
  layout.slots.forEach((slot) => {
    pathRoundedRect(ctx, slot.x, slot.y, slot.w, slot.h, slot.radius);
    ctx.closePath();
  });
  ctx.clip("evenodd");
  drawDecorations(
    ctx,
    frame.decoration,
    layout.canvas.width,
    layout.canvas.height,
    frame.accent,
  );
  ctx.restore();

  // Ornamen hanya di margin (sudah di-clip); slot ornaments di atas foto dihapus agar tidak menutupi wajah

  const area = layout.captionArea;
  if (area.h > 0) {
    const dateText = showDate ? formatCaptionDate(new Date()) : "";
    const lines = [caption.trim(), dateText].filter(Boolean);
    if (lines.length) {
      ctx.fillStyle = frame.captionColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const script = /romantic|letter|heart|lace|rose|sunset|cats-/i.test(
        frame.decoration,
      );
      ctx.font = script
        ? `${Math.min(48, area.h * 0.42)}px "Great Vibes", cursive`
        : `600 ${Math.min(28, area.h * 0.28)}px "Baloo 2", sans-serif`;
      const centerY =
        area.y + area.h / 2 - (lines.length > 1 ? 14 : 0);
      ctx.fillText(lines[0], area.x + area.w / 2, centerY, area.w - 16);
      if (lines[1]) {
        ctx.font = `500 18px Poppins, sans-serif`;
        ctx.fillText(lines[1], area.x + area.w / 2, centerY + 32, area.w - 16);
      }
    }
  }

  if (includeStickers) {
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

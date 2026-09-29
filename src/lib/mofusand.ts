/** Mofusand sticker assets (PNG with dark studio bg keyed out) */
export const MOFUSAND_STICKERS = Array.from({ length: 11 }, (_, i) => ({
  id: i + 1,
  src: `/frames/mofusand/mofusand_${i + 1}.png`,
}));

export type MofusandImages = {
  /** Indexed 1..11 */
  byId: Map<number, HTMLImageElement>;
};

const imageCache = new Map<string, HTMLImageElement>();
const keyedCache = new Map<string, HTMLCanvasElement>();

async function loadCached(src: string): Promise<HTMLImageElement | undefined> {
  try {
    const hit = imageCache.get(src);
    if (hit?.complete) return hit;
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    await img.decode();
    imageCache.set(src, img);
    return img;
  } catch {
    return undefined;
  }
}

/** Knock out near-black studio backgrounds so stickers sit cleanly on frames */
function keyedSprite(img: HTMLImageElement): HTMLCanvasElement {
  const key = img.src;
  const cached = keyedCache.get(key);
  if (cached) return cached;
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, w, h);
  const px = data.data;
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i] ?? 0;
    const g = px[i + 1] ?? 0;
    const b = px[i + 2] ?? 0;
    const max = Math.max(r, g, b);
    // near-black studio → transparent (soft fade on dark edges)
    if (max < 22) {
      px[i + 3] = 0;
    } else if (max < 38) {
      px[i + 3] = Math.round((px[i + 3] ?? 0) * ((max - 22) / 16));
    }
  }
  ctx.putImageData(data, 0, 0);
  keyedCache.set(key, canvas);
  return canvas;
}

export async function loadMofusandImages(
  kind: string,
): Promise<MofusandImages> {
  if (!kind.startsWith("mofusand-")) return { byId: new Map() };
  return loadAllMofusandImages();
}

/** Load every Mofusand PNG (for frame décor + placeable stickers). */
export async function loadAllMofusandImages(): Promise<MofusandImages> {
  const loaded = await Promise.all(
    MOFUSAND_STICKERS.map(async (item) => {
      const img = await loadCached(item.src);
      return img ? ([item.id, img] as const) : null;
    }),
  );
  const byId = new Map<number, HTMLImageElement>();
  loaded.forEach((entry) => {
    if (entry) byId.set(entry[0], entry[1]);
  });
  return { byId };
}

/** Ensure keyed sprite is in cache; returns transparent canvas. */
export async function loadMofusandSprite(
  id: number,
): Promise<HTMLCanvasElement | undefined> {
  const item = MOFUSAND_STICKERS.find((entry) => entry.id === id);
  if (!item) return undefined;
  const img = await loadCached(item.src);
  if (!img) return undefined;
  return keyedSprite(img);
}

/** Sync read after loadMofusandSprite / loadAllMofusandImages. */
export function getMofusandSprite(
  id: number,
): HTMLCanvasElement | undefined {
  const item = MOFUSAND_STICKERS.find((entry) => entry.id === id);
  if (!item) return undefined;
  const img = imageCache.get(item.src);
  if (!img?.complete) return undefined;
  return keyedSprite(img);
}

function getSprite(
  images: MofusandImages,
  id: number,
): HTMLCanvasElement | HTMLImageElement | undefined {
  const img = images.byId.get(id);
  if (!img) return undefined;
  return keyedSprite(img);
}

function drawSticker(
  ctx: CanvasRenderingContext2D,
  images: MofusandImages,
  id: number,
  x: number,
  y: number,
  maxSize: number,
  flip = false,
  rot = 0,
): void {
  const sprite = getSprite(images, id);
  if (!sprite) return;
  const iw =
    "naturalWidth" in sprite ? sprite.naturalWidth || sprite.width : sprite.width;
  const ih =
    "naturalHeight" in sprite
      ? sprite.naturalHeight || sprite.height
      : sprite.height;
  if (!iw || !ih) return;
  const scale = Math.min(maxSize / iw, maxSize / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.save();
  ctx.translate(x, y);
  if (rot) ctx.rotate(rot);
  if (flip) ctx.scale(-1, 1);
  // soft drop so stickers lift off the mat
  ctx.shadowColor = "rgba(40, 30, 50, 0.18)";
  ctx.shadowBlur = Math.max(6, maxSize * 0.08);
  ctx.shadowOffsetY = Math.max(2, maxSize * 0.03);
  ctx.drawImage(sprite, -dw / 2, -dh / 2, dw, dh);
  ctx.restore();
}

function softBorder(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  width: number,
  inset: number,
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.strokeRect(inset, inset, w - inset * 2, h - inset * 2);
  ctx.restore();
}

function brand(
  ctx: CanvasRenderingContext2D,
  w: number,
  color: string,
  label: string,
  y = 42,
): void {
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.88;
  ctx.font = `700 ${Math.max(14, Math.round(w * 0.034))}px Poppins, "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "0.04em";
  ctx.fillText(label, w / 2, y);
  ctx.restore();
}

function ginghamBand(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colorA: string,
  colorB: string,
  band = 46,
): void {
  const cell = 14;
  ctx.save();
  for (let x = 0; x < w; x += cell) {
    for (let y = 0; y < band; y += cell) {
      const even = ((x / cell) | 0) % 2 === ((y / cell) | 0) % 2;
      ctx.fillStyle = even ? colorA : colorB;
      ctx.fillRect(x, y, cell, cell);
      ctx.fillRect(x, h - band + y, cell, cell);
    }
  }
  for (let y = band; y < h - band; y += cell) {
    for (let x = 0; x < band; x += cell) {
      const even = ((x / cell) | 0) % 2 === ((y / cell) | 0) % 2;
      ctx.fillStyle = even ? colorA : colorB;
      ctx.fillRect(x, y, cell, cell);
      ctx.fillRect(w - band + x, y, cell, cell);
    }
  }
  ctx.restore();
}

function bubbles(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color = "rgba(125,180,205,0.4)",
): void {
  ctx.fillStyle = color;
  const spots: Array<[number, number, number]> = [
    [26, 88, 5],
    [46, 128, 8],
    [68, 68, 4],
    [w - 30, 98, 7],
    [w - 52, 142, 5],
    [w - 38, 68, 4],
    [28, h - 108, 6],
    [52, h - 72, 9],
    [w - 34, h - 118, 5],
    [w - 58, h - 68, 7],
    [w / 2 - 48, 56, 5],
    [w / 2 + 52, h - 54, 6],
    [w / 2 + 20, 64, 3.5],
    [w / 2 - 20, h - 62, 3.5],
  ];
  spots.forEach(([x, y, r]) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function seeds(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = "#FDE68A";
  for (let i = 0; i < 40; i += 1) {
    const t = i / 40;
    ctx.beginPath();
    ctx.ellipse(20 + t * (w - 40), 18, 2.4, 4.2, 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(20 + t * (w - 40), h - 18, 2.4, 4.2, -0.35, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let i = 0; i < 22; i += 1) {
    const t = i / 22;
    ctx.beginPath();
    ctx.ellipse(18, 55 + t * (h - 110), 4.2, 2.4, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(w - 18, 55 + t * (h - 110), 4.2, 2.4, -0.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function cherries(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const pts: Array<[number, number]> = [
    [34, 68],
    [w - 34, 76],
    [38, h - 78],
    [w - 40, h - 68],
    [w / 2 - 58, 50],
    [w / 2 + 58, h - 50],
  ];
  pts.forEach(([x, y]) => {
    ctx.fillStyle = "#EF4444";
    ctx.beginPath();
    ctx.arc(x, y, 5.5, 0, Math.PI * 2);
    ctx.arc(x + 8, y + 2, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#166534";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + 3, y - 4);
    ctx.quadraticCurveTo(x + 9, y - 15, x + 15, y - 7);
    ctx.stroke();
  });
}

function hearts(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
): void {
  const pts: Array<[number, number, number]> = [
    [30, 100, 7],
    [w - 32, 110, 6],
    [36, h - 100, 6],
    [w - 38, h - 90, 7],
    [w / 2 - 70, 58, 5],
    [w / 2 + 70, h - 56, 5],
  ];
  pts.forEach(([x, y, s]) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s / 10, s / 10);
    ctx.beginPath();
    ctx.moveTo(0, 3);
    ctx.bezierCurveTo(-6, -4, -12, 4, 0, 12);
    ctx.bezierCurveTo(12, 4, 6, -4, 0, 3);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.55;
    ctx.fill();
    ctx.restore();
  });
}

function stickerSize(w: number, base = 0.18): number {
  return Math.max(86, Math.min(148, w * base));
}

export function drawMofusandDecoration(
  ctx: CanvasRenderingContext2D,
  kind: string,
  w: number,
  h: number,
  accent: string,
  images: MofusandImages = { byId: new Map() },
): void {
  switch (kind) {
    case "mofusand-shark":
      drawSharkParty(ctx, w, h, accent, images);
      break;
    case "mofusand-berry":
      drawBerryParty(ctx, w, h, accent, images);
      break;
    case "mofusand-cafe":
      drawCafeParty(ctx, w, h, accent, images);
      break;
    case "mofusand-friends":
      drawFriendsParty(ctx, w, h, accent, images);
      break;
    case "mofusand-mix":
      drawMixParty(ctx, w, h, accent, images);
      break;
    default:
      break;
  }
}

/** Ocean / shark cats — stickers 3, 5, 9, 10 */
function drawSharkParty(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
  images: MofusandImages,
): void {
  softBorder(ctx, w, h, "#9BC4D4", 32, 6);
  softBorder(ctx, w, h, "#FFFFFF", 8, 22);
  softBorder(ctx, w, h, accent, 3.5, 32);
  bubbles(ctx, w, h);
  brand(ctx, w, "#4A6F80", "same-nyan");

  const s = stickerSize(w, 0.2);
  const edge = s * 0.58;
  drawSticker(ctx, images, 3, edge, edge, s);
  drawSticker(ctx, images, 9, w - edge, edge, s * 0.96, true);
  drawSticker(ctx, images, 10, edge, h - edge, s * 0.96);
  drawSticker(ctx, images, 5, w - edge, h - edge, s, true, -0.25);
  drawSticker(ctx, images, 9, w / 2, edge * 0.92, s * 0.8);
  drawSticker(ctx, images, 10, w / 2, h - edge * 0.92, s * 0.8, true);
  drawSticker(ctx, images, 5, edge * 0.88, h / 2, s * 0.72, false, 0.4);
  drawSticker(ctx, images, 3, w - edge * 0.88, h / 2, s * 0.72, true, -0.28);
}

/** Strawberry cats — stickers 2, 8 */
function drawBerryParty(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
  images: MofusandImages,
): void {
  softBorder(ctx, w, h, accent, 30, 6);
  softBorder(ctx, w, h, "#FFFFFF", 8, 20);
  softBorder(ctx, w, h, "#F9A8D4", 3.5, 30);
  seeds(ctx, w, h);
  hearts(ctx, w, h, "#FB7185");
  brand(ctx, w, "#BE123C", "ichigo-nyan");

  const s = stickerSize(w, 0.21);
  const edge = s * 0.56;
  drawSticker(ctx, images, 2, edge, edge, s);
  drawSticker(ctx, images, 8, w - edge, edge, s * 0.94, true);
  drawSticker(ctx, images, 8, edge, h - edge, s * 0.94);
  drawSticker(ctx, images, 2, w - edge, h - edge, s, true);
  drawSticker(ctx, images, 2, w / 2, edge * 0.88, s * 0.78);
  drawSticker(ctx, images, 8, w / 2, h - edge * 0.88, s * 0.78, true);
  drawSticker(ctx, images, 8, edge * 0.82, h / 2, s * 0.7, false, 0.12);
  drawSticker(ctx, images, 2, w - edge * 0.82, h / 2, s * 0.7, true, -0.12);
}

/** Cafe sweets — ebi 1 + purin 11 */
function drawCafeParty(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
  images: MofusandImages,
): void {
  softBorder(ctx, w, h, accent, 30, 6);
  softBorder(ctx, w, h, "#FFFBEB", 8, 20);
  softBorder(ctx, w, h, "#F59E0B", 3.5, 30);
  cherries(ctx, w, h);
  brand(ctx, w, "#9A3412", "ebi · purin cafe");

  const s = stickerSize(w, 0.2);
  const edge = s * 0.58;
  drawSticker(ctx, images, 1, edge, edge, s);
  drawSticker(ctx, images, 11, w - edge, edge, s * 0.96, true);
  drawSticker(ctx, images, 11, edge, h - edge, s * 0.96);
  drawSticker(ctx, images, 1, w - edge, h - edge, s, true);
  drawSticker(ctx, images, 11, w / 2, edge * 0.9, s * 0.76);
  drawSticker(ctx, images, 1, w / 2, h - edge * 0.9, s * 0.76, true);
  drawSticker(ctx, images, 4, edge * 0.88, h / 2, s * 0.68);
  drawSticker(ctx, images, 4, w - edge * 0.88, h / 2, s * 0.68, true);
}

/** Costume friends — duck 4, bunny 6, snorlax 7 */
function drawFriendsParty(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
  images: MofusandImages,
): void {
  ginghamBand(ctx, w, h, "#E0F2FE", "#FFFFFF", 48);
  softBorder(ctx, w, h, accent, 4.5, 48);
  hearts(ctx, w, h, "#93C5FD");
  brand(ctx, w, "#475569", "mofu friends");

  const s = stickerSize(w, 0.19);
  const edge = Math.max(56, s * 0.68);
  drawSticker(ctx, images, 4, edge, edge + 6, s);
  drawSticker(ctx, images, 6, w - edge, edge + 6, s * 0.96, true);
  drawSticker(ctx, images, 7, edge, h - edge - 6, s * 0.96);
  drawSticker(ctx, images, 4, w - edge, h - edge - 6, s, true);
  drawSticker(ctx, images, 6, w / 2, edge + 2, s * 0.8);
  drawSticker(ctx, images, 7, w / 2, h - edge - 2, s * 0.8, true);
  drawSticker(ctx, images, 7, edge * 0.92, h / 2, s * 0.72);
  drawSticker(ctx, images, 6, w - edge * 0.92, h / 2, s * 0.72, true);
}

/** Mix of favorites around the strip */
function drawMixParty(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
  images: MofusandImages,
): void {
  softBorder(ctx, w, h, "#C4B5FD", 28, 6);
  softBorder(ctx, w, h, "#FFFFFF", 7, 20);
  softBorder(ctx, w, h, accent, 3.5, 28);
  bubbles(ctx, w, h, "rgba(196,181,253,0.32)");
  hearts(ctx, w, h, "#DDD6FE");
  brand(ctx, w, "#6D28D9", "mofusand");

  const s = stickerSize(w, 0.175);
  const edge = s * 0.55;
  drawSticker(ctx, images, 3, edge, edge, s);
  drawSticker(ctx, images, 2, w / 2 - s * 0.58, edge * 0.88, s * 0.74);
  drawSticker(ctx, images, 11, w / 2 + s * 0.58, edge * 0.88, s * 0.74, true);
  drawSticker(ctx, images, 9, w - edge, edge, s, true);
  drawSticker(ctx, images, 8, edge, h - edge, s);
  drawSticker(ctx, images, 10, w / 2 - s * 0.58, h - edge * 0.88, s * 0.74);
  drawSticker(ctx, images, 1, w / 2 + s * 0.58, h - edge * 0.88, s * 0.74, true);
  drawSticker(ctx, images, 5, w - edge, h - edge, s, true, -0.18);
  drawSticker(ctx, images, 6, edge * 0.82, h / 2 - s * 0.38, s * 0.7);
  drawSticker(ctx, images, 7, edge * 0.82, h / 2 + s * 0.42, s * 0.7);
  drawSticker(ctx, images, 4, w - edge * 0.82, h / 2 - s * 0.38, s * 0.7, true);
  drawSticker(ctx, images, 10, w - edge * 0.82, h / 2 + s * 0.42, s * 0.7, true);
}

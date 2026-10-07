/** Hello Kitty sticker assets (PNG with dark studio bg keyed out) */
export const KITTY_STICKERS = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  src: `/frames/kitty/kitty_${i + 1}.png`,
}));

export type KittyImages = {
  /** Indexed 1..8 */
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

export async function loadKittyImages(kind: string): Promise<KittyImages> {
  if (!kind.startsWith("kitty-")) return { byId: new Map() };
  const loaded = await Promise.all(
    KITTY_STICKERS.map(async (item) => {
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
export async function loadKittySprite(
  id: number,
): Promise<HTMLCanvasElement | undefined> {
  const item = KITTY_STICKERS.find((entry) => entry.id === id);
  if (!item) return undefined;
  const img = await loadCached(item.src);
  if (!img) return undefined;
  return keyedSprite(img);
}

/** Sync read after loadKittySprite / loadKittyImages. */
export function getKittySprite(id: number): HTMLCanvasElement | undefined {
  const item = KITTY_STICKERS.find((entry) => entry.id === id);
  if (!item) return undefined;
  const img = imageCache.get(item.src);
  if (!img?.complete) return undefined;
  return keyedSprite(img);
}

function getSprite(
  images: KittyImages,
  id: number,
): HTMLCanvasElement | HTMLImageElement | undefined {
  const img = images.byId.get(id);
  if (!img) return undefined;
  return keyedSprite(img);
}

function drawSticker(
  ctx: CanvasRenderingContext2D,
  images: KittyImages,
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
  ctx.shadowColor = "rgba(190, 24, 93, 0.16)";
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
  _ctx: CanvasRenderingContext2D,
  _w: number,
  _color: string,
  _label: string,
  _y = 40,
): void {}

function miniHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 12, size / 12);
  ctx.beginPath();
  ctx.moveTo(0, 3);
  ctx.bezierCurveTo(-7, -5, -14, 4, 0, 13);
  ctx.bezierCurveTo(14, 4, 7, -5, 0, 3);
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.85;
  ctx.fill();
  ctx.restore();
}

/** Tiny hearts and dots in the margins, leaving the center title and date clear. */
function sprinkle(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
): void {
  const hearts: Array<[number, number, number]> = [
    [34, 92, 9],
    [w - 36, 96, 8],
    [40, h - 96, 8],
    [w - 42, h - 100, 9],
    [w * 0.22, 58, 6],
    [w * 0.78, 58, 6],
    [w * 0.2, h - 56, 6],
    [w * 0.8, h - 56, 6],
  ];
  hearts.forEach(([x, y, s]) => miniHeart(ctx, x, y, s, color));

  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.45;
  const dots: Array<[number, number, number]> = [
    [58, 130, 3.5],
    [w - 62, 138, 3],
    [64, h - 140, 3],
    [w - 70, h - 132, 3.5],
    [28, h / 2 - 80, 2.5],
    [w - 30, h / 2 - 70, 2.5],
    [32, h / 2 + 90, 3],
    [w - 34, h / 2 + 100, 2.5],
  ];
  dots.forEach(([x, y, r]) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });
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

function stickerSize(w: number, base = 0.2): number {
  return Math.max(92, Math.min(156, w * base));
}

export function drawKittyDecoration(
  ctx: CanvasRenderingContext2D,
  kind: string,
  w: number,
  h: number,
  accent: string,
  images: KittyImages = { byId: new Map() },
): void {
  switch (kind) {
    case "kitty-hello":
      drawHello(ctx, w, h, accent, images);
      break;
    case "kitty-bow":
      drawBow(ctx, w, h, accent, images);
      break;
    case "kitty-berry":
      drawBerry(ctx, w, h, accent, images);
      break;
    case "kitty-sweet":
      drawSweet(ctx, w, h, accent, images);
      break;
    case "kitty-balloon":
      drawBalloon(ctx, w, h, accent, images);
      break;
    case "kitty-mix":
      drawMix(ctx, w, h, accent, images);
      break;
    case "kitty-cutie":
      drawCutie(ctx, w, h, images);
      break;
    default:
      break;
  }
}

/** Classic Hello Kitty — wave, overalls, heart hug */
function drawHello(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
  images: KittyImages,
): void {
  softBorder(ctx, w, h, "#F9A8D4", 30, 6);
  softBorder(ctx, w, h, "#FFFFFF", 8, 20);
  softBorder(ctx, w, h, accent, 3.5, 30);
  sprinkle(ctx, w, h, "#FB7185");

  const s = stickerSize(w, 0.2);
  const edge = s * 0.56;
  drawSticker(ctx, images, 1, edge, edge, s);
  drawSticker(ctx, images, 8, w - edge, edge, s * 0.96, true);
  drawSticker(ctx, images, 3, edge, h - edge, s * 0.96);
  drawSticker(ctx, images, 1, w - edge, h - edge, s, true);
  drawSticker(ctx, images, 8, edge * 0.86, h / 2 - s * 0.45, s * 0.7);
  drawSticker(ctx, images, 3, w - edge * 0.86, h / 2 - s * 0.45, s * 0.7, true);
  drawSticker(ctx, images, 3, edge * 0.86, h / 2 + s * 0.5, s * 0.66);
  drawSticker(ctx, images, 8, w - edge * 0.86, h / 2 + s * 0.5, s * 0.66, true);
  brand(ctx, w, "#BE185D", "hello kitty");
}

/** Giant pink bow */
function drawBow(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
  images: KittyImages,
): void {
  ginghamBand(ctx, w, h, "#FBCFE8", "#FFFFFF", 46);
  softBorder(ctx, w, h, accent, 4, 46);
  sprinkle(ctx, w, h, "#EC4899");

  const s = stickerSize(w, 0.22);
  const edge = Math.max(58, s * 0.64);
  drawSticker(ctx, images, 2, edge, edge + 4, s);
  drawSticker(ctx, images, 2, w - edge, edge + 4, s * 0.94, true);
  drawSticker(ctx, images, 2, edge, h - edge - 4, s * 0.94);
  drawSticker(ctx, images, 2, w - edge, h - edge - 4, s, true);
  drawSticker(ctx, images, 1, edge * 0.9, h / 2, s * 0.62);
  drawSticker(ctx, images, 8, w - edge * 0.9, h / 2, s * 0.62, true);
  brand(ctx, w, "#9D174D", "pink bow");
}

/** Strawberry hat + camera */
function drawBerry(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
  images: KittyImages,
): void {
  softBorder(ctx, w, h, accent, 28, 6);
  softBorder(ctx, w, h, "#FFFFFF", 7, 20);
  softBorder(ctx, w, h, "#F472B6", 3.5, 28);
  sprinkle(ctx, w, h, "#FB7185");

  const s = stickerSize(w, 0.21);
  const edge = s * 0.56;
  drawSticker(ctx, images, 4, edge, edge, s);
  drawSticker(ctx, images, 4, w - edge, edge, s * 0.94, true);
  drawSticker(ctx, images, 4, edge, h - edge, s * 0.94);
  drawSticker(ctx, images, 4, w - edge, h - edge, s, true);
  drawSticker(ctx, images, 3, edge * 0.84, h / 2, s * 0.68);
  drawSticker(ctx, images, 5, w - edge * 0.84, h / 2, s * 0.68, true);
  brand(ctx, w, "#BE123C", "ichigo cam");
}

/** Cupcake kitty */
function drawSweet(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
  images: KittyImages,
): void {
  softBorder(ctx, w, h, "#F9A8D4", 28, 6);
  softBorder(ctx, w, h, "#FFFBEB", 8, 20);
  softBorder(ctx, w, h, accent, 3.5, 30);
  sprinkle(ctx, w, h, "#F472B6");

  const s = stickerSize(w, 0.2);
  const edge = s * 0.56;
  drawSticker(ctx, images, 5, edge, edge, s);
  drawSticker(ctx, images, 5, w - edge, edge, s * 0.94, true);
  drawSticker(ctx, images, 5, edge, h - edge, s * 0.94);
  drawSticker(ctx, images, 5, w - edge, h - edge, s, true);
  drawSticker(ctx, images, 3, edge * 0.86, h / 2 - s * 0.4, s * 0.66);
  drawSticker(ctx, images, 3, w - edge * 0.86, h / 2 - s * 0.4, s * 0.66, true);
  drawSticker(ctx, images, 1, edge * 0.86, h / 2 + s * 0.45, s * 0.62);
  drawSticker(ctx, images, 8, w - edge * 0.86, h / 2 + s * 0.45, s * 0.62, true);
  brand(ctx, w, "#9D174D", "cupcake");
}

/** Heart balloons + polka balloons */
function drawBalloon(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
  images: KittyImages,
): void {
  softBorder(ctx, w, h, "#FBCFE8", 28, 6);
  softBorder(ctx, w, h, "#FFFFFF", 7, 20);
  softBorder(ctx, w, h, accent, 3.5, 28);
  sprinkle(ctx, w, h, "#F43F5E");

  const s = stickerSize(w, 0.2);
  const edge = s * 0.58;
  drawSticker(ctx, images, 6, edge, edge, s);
  drawSticker(ctx, images, 7, w - edge, edge, s * 0.96, true);
  drawSticker(ctx, images, 7, edge, h - edge, s * 0.96);
  drawSticker(ctx, images, 6, w - edge, h - edge, s, true);
  drawSticker(ctx, images, 6, edge * 0.82, h / 2, s * 0.68);
  drawSticker(ctx, images, 7, w - edge * 0.82, h / 2, s * 0.68, true);
  brand(ctx, w, "#BE123C", "balloons");
}

/** A little of every kitty */
function drawMix(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
  images: KittyImages,
): void {
  softBorder(ctx, w, h, "#F9A8D4", 26, 6);
  softBorder(ctx, w, h, "#FFFFFF", 7, 18);
  softBorder(ctx, w, h, accent, 3.5, 26);
  sprinkle(ctx, w, h, "#EC4899");

  const s = stickerSize(w, 0.175);
  const edge = s * 0.54;
  drawSticker(ctx, images, 1, edge, edge, s);
  drawSticker(ctx, images, 4, edge + s * 0.95, edge * 0.95, s * 0.68);
  drawSticker(ctx, images, 5, w - edge - s * 0.95, edge * 0.95, s * 0.68, true);
  drawSticker(ctx, images, 8, w - edge, edge, s, true);
  drawSticker(ctx, images, 3, edge, h - edge, s);
  drawSticker(ctx, images, 6, edge + s * 0.95, h - edge * 0.95, s * 0.68);
  drawSticker(ctx, images, 7, w - edge - s * 0.95, h - edge * 0.95, s * 0.68, true);
  drawSticker(ctx, images, 2, w - edge, h - edge, s, true);
  drawSticker(ctx, images, 5, edge * 0.82, h / 2, s * 0.66);
  drawSticker(ctx, images, 4, w - edge * 0.82, h / 2, s * 0.66, true);
  brand(ctx, w, "#BE185D", "hello kitty");
}

function traceRound(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function miniBow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#F472B6";
  ctx.beginPath();
  ctx.ellipse(-size * 0.55, 0, size * 0.48, size * 0.32, -0.4, 0, Math.PI * 2);
  ctx.ellipse(size * 0.55, 0, size * 0.48, size * 0.32, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#EC4899";
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Strip like the Hello Cutie reference: header, side characters, footer cluster. */
function drawCutie(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  images: KittyImages,
): void {
  const inset = Math.max(10, w * 0.018);
  const radius = Math.max(28, w * 0.06);
  ctx.save();
  traceRound(ctx, inset, inset, w - inset * 2, h - inset * 2, radius);
  ctx.strokeStyle = "#F8C4D8";
  ctx.lineWidth = Math.max(10, w * 0.022);
  ctx.stroke();
  ctx.restore();

  const s = Math.max(58, Math.min(92, w * 0.145));
  drawSticker(ctx, images, 1, s * 0.34, s * 0.38, s * 0.78);
  drawSticker(ctx, images, 2, w - s * 0.38, s * 0.4, s * 0.82);

  ctx.save();
  ctx.fillStyle = "#F472B6";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const titleSize = Math.round(Math.min(48, Math.max(30, w * 0.072)));
  ctx.font = `${titleSize}px "Great Vibes", cursive`;
  const title = "Hello Cutie!";
  const titleW = ctx.measureText(title).width;
  // Keep script ascenders below the pink border
  const titleY = Math.round(30 + titleSize * 0.62);
  ctx.fillText(title, w / 2, titleY);
  miniBow(
    ctx,
    w / 2 + titleW / 2 + titleSize * 0.42,
    titleY + 2,
    titleSize * 0.2,
  );

  ctx.fillStyle = "#F4A4C0";
  ctx.font = `600 ${Math.max(10, Math.round(titleSize * 0.32))}px Poppins, sans-serif`;
  ctx.letterSpacing = "0.14em";
  ctx.fillText("SPECIAL EDITION", w / 2, titleY + titleSize * 0.55);
  ctx.restore();

  const side = Math.max(64, Math.min(108, w * 0.16));
  drawSticker(ctx, images, 8, side * 0.42, h * 0.4, side);
  drawSticker(ctx, images, 1, w - side * 0.4, h * 0.62, side * 0.92, true);

  const foot = Math.max(58, Math.min(96, w * 0.15));
  miniHeart(ctx, w * 0.72, h - foot * 0.9, 16, "#FB7185");
  miniHeart(ctx, w * 0.78, h - foot * 0.58, 12, "#F9A8D4");
  drawSticker(ctx, images, 3, w - foot * 0.55, h - foot * 0.72, foot);
}

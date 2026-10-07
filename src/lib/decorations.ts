import { drawKittyDecoration, type KittyImages } from "@/lib/kitty";
import { drawMofusandDecoration, type MofusandImages } from "@/lib/mofusand";

export function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  pathRoundedRect(ctx, x, y, w, h, r);
  ctx.closePath();
}

export function pathRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  if (r <= 0) {
    ctx.rect(x, y, w, h);
    return;
  }
  const radius = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
}

export function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 24, size / 24);
  ctx.beginPath();
  ctx.moveTo(0, 6);
  ctx.bezierCurveTo(-12, -6, -22, 10, 0, 22);
  ctx.bezierCurveTo(22, 10, 12, -6, 0, 6);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

export function drawStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i < 5; i += 1) {
    const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawCloud(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  color: string,
): void {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 16 * scale, 0, Math.PI * 2);
  ctx.arc(x + 18 * scale, y - 8 * scale, 14 * scale, 0, Math.PI * 2);
  ctx.arc(x + 34 * scale, y, 16 * scale, 0, Math.PI * 2);
  ctx.arc(x + 16 * scale, y + 6 * scale, 14 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function pixelBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
): void {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), size, size);
}

function scatter(
  count: number,
  w: number,
  h: number,
  seed: number,
): Array<{ x: number; y: number; s: number; r: number }> {
  const out: Array<{ x: number; y: number; s: number; r: number }> = [];
  let n = seed;
  const margin = Math.max(28, Math.min(56, w * 0.07));
  for (let i = 0; i < count; i += 1) {
    n = (n * 16807) % 2147483647;
    const side = Math.floor((n / 2147483647) * 4);
    n = (n * 16807) % 2147483647;
    const pos = n / 2147483647;
    n = (n * 16807) % 2147483647;
    const s = 0.7 + (n / 2147483647) * 0.55;
    n = (n * 16807) % 2147483647;
    const r = (n / 2147483647) * Math.PI * 2;
    n = (n * 16807) % 2147483647;
    const lane = (n / 2147483647) * 0.55; // 0–1 depth into margin

    let x = 0;
    let y = 0;
    if (side === 0) {
      x = margin + pos * (w - margin * 2);
      y = 14 + lane * margin;
    } else if (side === 1) {
      x = margin + pos * (w - margin * 2);
      y = h - 14 - lane * margin;
    } else if (side === 2) {
      x = 14 + lane * margin;
      y = margin + pos * (h - margin * 2);
    } else {
      x = w - 14 - lane * margin;
      y = margin + pos * (h - margin * 2);
    }
    out.push({ x, y, s, r });
  }
  return out;
}

function cornerMotifs(
  w: number,
  h: number,
  draw: (x: number, y: number, rot: number) => void,
): void {
  const inset = Math.max(42, Math.min(64, w * 0.08));
  draw(inset, inset, 0);
  draw(w - inset, inset, Math.PI / 2);
  draw(w - inset, h - inset, Math.PI);
  draw(inset, h - inset, -Math.PI / 2);
}

/** Extra ornaments at mid-edges for denser frames */
function edgeMotifs(
  w: number,
  h: number,
  draw: (x: number, y: number, rot: number) => void,
): void {
  const inset = Math.max(36, Math.min(52, w * 0.07));
  draw(w / 2, inset * 0.85, 0);
  draw(w / 2, h - inset * 0.85, Math.PI);
  draw(inset * 0.85, h / 2, -Math.PI / 2);
  draw(w - inset * 0.85, h / 2, Math.PI / 2);
}

function brandMark(
  _ctx: CanvasRenderingContext2D,
  _w: number,
  _color: string,
  _label = "snapie",
  _y = 40,
): void {}

function solidBorder(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  width: number,
  inset = 10,
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.strokeRect(inset, inset, w - inset * 2, h - inset * 2);
  ctx.restore();
}

function dashedBorder(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  width: number,
  dash: number[],
  inset = 22,
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.strokeRect(inset, inset, w - inset * 2, h - inset * 2);
  ctx.setLineDash([]);
  ctx.restore();
}

function polkaBand(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  band = 28,
): void {
  ctx.save();
  ctx.fillStyle = color;
  const step = 14;
  const r = 3.2;
  for (let x = band; x < w - band; x += step) {
    ctx.beginPath();
    ctx.arc(x, band * 0.5, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + step / 2, band * 0.85, r * 0.75, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, h - band * 0.5, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + step / 2, h - band * 0.85, r * 0.75, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let y = band; y < h - band; y += step) {
    ctx.beginPath();
    ctx.arc(band * 0.5, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(band * 0.85, y + step / 2, r * 0.75, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w - band * 0.5, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w - band * 0.85, y + step / 2, r * 0.75, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function ticketNotches(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
): void {
  ctx.fillStyle = color;
  const r = 9;
  for (let y = 28; y < h - 28; y += 20) {
    ctx.beginPath();
    ctx.arc(0, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSakura(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  for (let i = 0; i < 5; i += 1) {
    ctx.save();
    ctx.rotate((i * Math.PI * 2) / 5);
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.45, size * 0.28, size * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = "#F9A8D4";
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(-size * 0.45, 0, size * 0.42, size * 0.28, -0.4, 0, Math.PI * 2);
  ctx.ellipse(size * 0.45, 0, size * 0.42, size * 0.28, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPawPrint(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  rotation = 0,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, size * 0.18, size * 0.4, size * 0.32, 0, 0, Math.PI * 2);
  ctx.fill();
  const toes: Array<[number, number]> = [
    [-0.38, -0.28],
    [0, -0.42],
    [0.38, -0.28],
  ];
  toes.forEach(([tx, ty]) => {
    ctx.beginPath();
    ctx.ellipse(tx * size, ty * size, size * 0.15, size * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawCatFace(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  fur: string,
  innerEar: string,
  nose: string,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = fur;
  ctx.beginPath();
  ctx.moveTo(-size * 0.52, -size * 0.12);
  ctx.lineTo(-size * 0.7, -size * 0.88);
  ctx.lineTo(-size * 0.12, -size * 0.42);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(size * 0.52, -size * 0.12);
  ctx.lineTo(size * 0.7, -size * 0.88);
  ctx.lineTo(size * 0.12, -size * 0.42);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = innerEar;
  ctx.beginPath();
  ctx.moveTo(-size * 0.48, -size * 0.22);
  ctx.lineTo(-size * 0.58, -size * 0.68);
  ctx.lineTo(-size * 0.22, -size * 0.38);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(size * 0.48, -size * 0.22);
  ctx.lineTo(size * 0.58, -size * 0.68);
  ctx.lineTo(size * 0.22, -size * 0.38);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = fur;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.56, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2A1848";
  ctx.beginPath();
  ctx.ellipse(-size * 0.18, -size * 0.04, size * 0.09, size * 0.13, 0, 0, Math.PI * 2);
  ctx.ellipse(size * 0.18, -size * 0.04, size * 0.09, size * 0.13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(-size * 0.15, -size * 0.1, size * 0.035, 0, Math.PI * 2);
  ctx.arc(size * 0.21, -size * 0.1, size * 0.035, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = nose;
  ctx.beginPath();
  ctx.moveTo(0, size * 0.1);
  ctx.lineTo(-size * 0.08, size * 0.02);
  ctx.lineTo(size * 0.08, size * 0.02);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#2A1848";
  ctx.lineWidth = Math.max(1.2, size * 0.045);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(-size * 0.08, size * 0.16, size * 0.1, 0.15 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(size * 0.08, size * 0.16, size * 0.1, 0.1 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = Math.max(1, size * 0.03);
  ctx.beginPath();
  ctx.moveTo(-size * 0.24, size * 0.1);
  ctx.lineTo(-size * 0.78, 0);
  ctx.moveTo(-size * 0.24, size * 0.18);
  ctx.lineTo(-size * 0.74, size * 0.22);
  ctx.moveTo(size * 0.24, size * 0.1);
  ctx.lineTo(size * 0.78, 0);
  ctx.moveTo(size * 0.24, size * 0.18);
  ctx.lineTo(size * 0.74, size * 0.22);
  ctx.stroke();
  ctx.restore();
}

export function drawDecorations(
  ctx: CanvasRenderingContext2D,
  kind: string,
  canvasW: number,
  canvasH: number,
  accent: string,
  assets?: MofusandImages | KittyImages,
): void {
  ctx.save();
  switch (kind) {
    case "bears":
      drawBears(ctx, canvasW, canvasH, accent);
      break;
    case "clouds":
      drawClouds(ctx, canvasW, canvasH);
      break;
    case "pixels":
      drawPixels(ctx, canvasW, canvasH, accent);
      break;
    case "strawberry":
      drawStrawberry(ctx, canvasW, canvasH, accent);
      break;
    case "cartoon":
      drawCartoon(ctx, canvasW, canvasH, accent);
      break;
    case "roses":
      drawRoses(ctx, canvasW, canvasH, accent);
      break;
    case "letter":
      drawLetter(ctx, canvasW, canvasH, accent);
      break;
    case "hearts":
      drawHearts(ctx, canvasW, canvasH, accent);
      break;
    case "lace":
      drawLace(ctx, canvasW, canvasH, accent);
      break;
    case "sunset":
      drawSunset(ctx, canvasW, canvasH, accent);
      break;
    case "neon":
      drawNeon(ctx, canvasW, canvasH, accent);
      break;
    case "noir":
      drawNoir(ctx, canvasW, canvasH);
      break;
    case "chrome":
      drawChrome(ctx, canvasW, canvasH, accent);
      break;
    case "street":
      drawStreet(ctx, canvasW, canvasH, accent);
      break;
    case "vintage":
      drawVintage(ctx, canvasW, canvasH, accent);
      break;
    case "cats-cafe":
      drawCatsCafe(ctx, canvasW, canvasH, accent);
      break;
    case "cats-calico":
      drawCatsCalico(ctx, canvasW, canvasH, accent);
      break;
    case "cats-moon":
      drawCatsMoon(ctx, canvasW, canvasH, accent);
      break;
    case "cats-paws":
      drawCatsPaws(ctx, canvasW, canvasH, accent);
      break;
    case "candy":
      drawCandy(ctx, canvasW, canvasH, accent);
      break;
    case "sakura":
      drawSakuraFrame(ctx, canvasW, canvasH, accent);
      break;
    case "hologram":
      drawHologram(ctx, canvasW, canvasH, accent);
      break;
    case "melody":
      drawMelody(ctx, canvasW, canvasH, accent);
      break;
    case "plain":
      drawPlain(ctx, canvasW, canvasH, accent);
      break;
    case "mofusand-shark":
    case "mofusand-berry":
    case "mofusand-cafe":
    case "mofusand-friends":
    case "mofusand-mix":
      drawMofusandDecoration(ctx, kind, canvasW, canvasH, accent, assets);
      break;
    case "kitty-hello":
    case "kitty-bow":
    case "kitty-berry":
    case "kitty-sweet":
    case "kitty-balloon":
    case "kitty-mix":
    case "kitty-cutie":
      drawKittyDecoration(ctx, kind, canvasW, canvasH, accent, assets);
      break;
    case "none":
      break;
    default:
      break;
  }
  ctx.restore();
}

function drawPlain(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  // Clean booth strip — thin outer + subtle inner line only
  solidBorder(ctx, w, h, accent, 10, 8);
  solidBorder(ctx, w, h, "rgba(255,255,255,0.55)", 2, 16);
  brandMark(ctx, w, accent, "snapie");
}

function drawBears(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  solidBorder(ctx, w, h, accent, 26, 8);
  solidBorder(ctx, w, h, "#FFFFFF", 5, 18);
  polkaBand(ctx, w, h, `${accent}AA`, 34);
  brandMark(ctx, w, accent, "♡ bear");
  cornerMotifs(w, h, (x, y) => {
    ctx.save();
    ctx.translate(x, y);
    const size = 22;
    ctx.fillStyle = "#F4C7A0";
    ctx.beginPath();
    ctx.arc(0, 3, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-size * 0.7, -size * 0.5, size * 0.38, 0, Math.PI * 2);
    ctx.arc(size * 0.7, -size * 0.5, size * 0.38, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(0, 6, size * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(-size * 0.25, 2, size * 0.1, 0, Math.PI * 2);
    ctx.arc(size * 0.25, 2, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  drawBow(ctx, w / 2, 58, 26, accent);
  edgeMotifs(w, h, (x, y) => {
    ctx.save();
    ctx.translate(x, y);
    const size = 16;
    ctx.fillStyle = "#F4C7A0";
    ctx.beginPath();
    ctx.arc(0, 3, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-size * 0.7, -size * 0.5, size * 0.38, 0, Math.PI * 2);
    ctx.arc(size * 0.7, -size * 0.5, size * 0.38, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  scatter(14, w, h, 21).forEach((item) => {
    drawHeart(ctx, item.x, item.y, 9 + item.s * 6, accent);
  });
}

function drawClouds(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  solidBorder(ctx, w, h, "#B8E4F8", 22, 8);
  dashedBorder(ctx, w, h, "#7EC8E3", 2.5, [6, 8], 24);
  brandMark(ctx, w, "#4A6A8A", "☁ candy sky");
  drawCloud(ctx, 24, 40, 1.15, "#FFFFFF");
  drawCloud(ctx, w - 90, 44, 1.0, "#FFE8F4");
  drawCloud(ctx, 30, h - 50, 0.95, "#FFF6C7");
  drawCloud(ctx, w - 84, h - 46, 1.05, "#FFFFFF");
  edgeMotifs(w, h, (x, y) => drawCloud(ctx, x - 24, y - 8, 0.9, "#FFFFFF"));
  scatter(18, w, h, 99).forEach((item, i) => {    drawStar(ctx, item.x, item.y, 7 + item.s * 5, i % 2 ? "#FFD6EA" : "#FFE37A");
  });
}

function drawPixels(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  const size = 16;
  const colors = [accent, "#7A5CFF", "#50E3C2", "#FFE37A", "#60A5FA"];
  ctx.strokeStyle = accent;
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, w - 20, h - 20);
  // Checker pixel ribbon top & bottom
  for (let x = 14; x < w - 14; x += size) {
    const c1 = colors[((x / size) | 0) % colors.length] ?? accent;
    const c2 = colors[(((x / size) | 0) + 2) % colors.length] ?? accent;
    pixelBlock(ctx, x, 14, size - 2, c1);
    pixelBlock(ctx, x, h - 14 - (size - 2), size - 2, c2);
  }
  // Side pixel towers
  for (let y = 14 + size; y < h - 14 - size; y += size * 2) {
    pixelBlock(ctx, 14, y, size - 2, colors[0] ?? accent);
    pixelBlock(ctx, w - 14 - (size - 2), y, size - 2, colors[2] ?? accent);
  }
  brandMark(ctx, w, "#FFE37A", "▶ PIXEL");
  // Heart pixel corners
  cornerMotifs(w, h, (x, y) => {
    pixelBlock(ctx, x - 6, y - 6, 5, accent);
    pixelBlock(ctx, x + 1, y - 6, 5, "#FFE37A");
    pixelBlock(ctx, x - 6, y + 1, 5, "#50E3C2");
    pixelBlock(ctx, x + 1, y + 1, 5, "#7A5CFF");
  });
}

function drawStrawberry(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  solidBorder(ctx, w, h, accent, 24, 8);
  solidBorder(ctx, w, h, "#FFFFFF", 4, 17);
  // Seed dots on outer band
  ctx.fillStyle = "#FFE37A";
  for (let i = 0; i < 28; i += 1) {
    const t = i / 28;
    ctx.beginPath();
    ctx.ellipse(16 + t * (w - 32), 16, 2, 3.5, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(16 + t * (w - 32), h - 16, 2, 3.5, -0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  brandMark(ctx, w, "#C23B5A", "🍓 milk");
  cornerMotifs(w, h, (x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(0, 14);
    ctx.bezierCurveTo(-12, 4, -10, -8, 0, -3);
    ctx.bezierCurveTo(10, -8, 12, 4, 0, 14);
    ctx.fill();
    ctx.fillStyle = "#7BC67B";
    ctx.beginPath();
    ctx.moveTo(-6, -4);
    ctx.lineTo(0, -13);
    ctx.lineTo(6, -4);
    ctx.fill();
    ctx.fillStyle = "#FFE37A";
    ctx.beginPath();
    ctx.arc(-3, 2, 1.4, 0, Math.PI * 2);
    ctx.arc(3, 5, 1.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawCartoon(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  solidBorder(ctx, w, h, "#2A1A10", 16, 8);
  solidBorder(ctx, w, h, accent, 5, 16);
  dashedBorder(ctx, w, h, "#2A1A10", 2.5, [10, 8], 28);
  brandMark(ctx, w, "#5A3A1A", "★ WOW!");
  // Comic burst corners
  cornerMotifs(w, h, (x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = accent;
    for (let i = 0; i < 8; i += 1) {
      ctx.save();
      ctx.rotate((i * Math.PI) / 4);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(4, -22);
      ctx.lineTo(-4, -22);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = "#FFF4C8";
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  scatter(22, w, h, 44).forEach((item) => {    drawStar(ctx, item.x, item.y, 11 + item.s * 6, accent);
  });
}

function drawRoses(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  solidBorder(ctx, w, h, `${accent}CC`, 14, 10);
  solidBorder(ctx, w, h, "#D4AF37", 2, 20);
  brandMark(ctx, w, accent, "玫瑰 rose");
  // Vine along sides
  ctx.strokeStyle = "#7BC67B";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(28, 60);
  ctx.bezierCurveTo(40, h * 0.35, 16, h * 0.65, 30, h - 60);
  ctx.moveTo(w - 28, 60);
  ctx.bezierCurveTo(w - 40, h * 0.35, w - 16, h * 0.65, w - 30, h - 60);
  ctx.stroke();
  cornerMotifs(w, h, (x, y) => {
    ctx.save();
    ctx.translate(x, y);
    for (let i = 4; i >= 1; i -= 1) {
      ctx.beginPath();
      ctx.arc(0, 0, 6.5 * i, 0, Math.PI * 2);
      ctx.fillStyle = i === 1 ? "#FFF0F4" : i % 2 ? accent : "#E8A0B0";
      ctx.fill();
    }
    ctx.restore();
  });
}

function drawLetter(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  solidBorder(ctx, w, h, accent, 5, 12);
  dashedBorder(ctx, w, h, accent, 1.5, [4, 6], 22);
  // Postage stamp corners
  cornerMotifs(w, h, (x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "#FFF8F0";
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.5;
    ctx.fillRect(-20, -20, 40, 40);
    ctx.strokeRect(-20, -20, 40, 40);
    drawHeart(ctx, 0, 0, 14, "#E8B4C8");
    ctx.restore();
  });
  // Wax seal
  ctx.fillStyle = "#C45C78";
  ctx.beginPath();
  ctx.arc(w / 2, 52, 22, 0, Math.PI * 2);
  ctx.fill();
  brandMark(ctx, w, accent, "for you ✉", 88);
}

function drawHearts(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  solidBorder(ctx, w, h, accent, 22, 8);
  solidBorder(ctx, w, h, "#FFFFFF", 4, 16);
  // Heart trail along border
  const trail = 18;
  for (let x = 30; x < w - 30; x += trail) {
    drawHeart(ctx, x, 22, 11, x % (trail * 2) < trail ? accent : "#FF8AA3");
    drawHeart(ctx, x, h - 22, 11, x % (trail * 2) < trail ? "#FF8AA3" : accent);
  }
  for (let y = 40; y < h - 40; y += trail) {
    drawHeart(ctx, 22, y, 10, accent);
    drawHeart(ctx, w - 22, y, 10, "#FF8AA3");
  }
  brandMark(ctx, w, accent, "♡ love");
  cornerMotifs(w, h, (x, y) => drawHeart(ctx, x, y, 26, accent));
  edgeMotifs(w, h, (x, y) => drawHeart(ctx, x, y, 18, "#FF8AA3"));
}

function drawLace(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  solidBorder(ctx, w, h, `${accent}88`, 3, 10);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.6;
  const step = 16;
  for (let x = 20; x < w - 20; x += step) {
    ctx.beginPath();
    ctx.arc(x, 16, 5.5, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, h - 16, 5.5, Math.PI, Math.PI * 2);
    ctx.stroke();
  }
  for (let y = 20; y < h - 20; y += step) {
    ctx.beginPath();
    ctx.arc(16, y, 5.5, Math.PI * 1.5, Math.PI * 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w - 16, y, 5.5, Math.PI * 0.5, Math.PI * 1.5);
    ctx.stroke();
  }
  // Diamonds
  ctx.fillStyle = `${accent}55`;
  for (let x = 40; x < w - 40; x += 48) {
    ctx.save();
    ctx.translate(x, 28);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-3, -3, 6, 6);
    ctx.restore();
  }
  brandMark(ctx, w, accent, "✦ pearl");
  cornerMotifs(w, h, (x, y) => {
    ctx.beginPath();
    ctx.fillStyle = "#FFFFFF";
    ctx.arc(x, y, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = accent;
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawSunset(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  const bands = [
    ["rgba(255,120,80,0.45)", 0, 36],
    ["rgba(255,170,100,0.3)", 36, 56],
    ["rgba(232,140,180,0.2)", 56, 72],
  ] as const;
  bands.forEach(([color, y0, y1]) => {
    const g = ctx.createLinearGradient(0, y0, 0, y1);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(255,140,90,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, y0, w, y1 - y0 + 8);
  });
  // Sun
  const sun = ctx.createRadialGradient(w - 48, 38, 2, w - 48, 38, 20);
  sun.addColorStop(0, "#FFE37A");
  sun.addColorStop(1, accent);
  ctx.fillStyle = sun;
  ctx.beginPath();
  ctx.arc(w - 52, 46, 26, 0, Math.PI * 2);
  ctx.fill();
  // Birds
  ctx.strokeStyle = "#5A2040";
  ctx.lineWidth = 1.8;
  ctx.lineCap = "round";
  [
    [48, 42],
    [72, 34],
    [60, 52],
  ].forEach(([bx, by]) => {
    ctx.beginPath();
    ctx.moveTo(bx - 6, by);
    ctx.quadraticCurveTo(bx, by - 5, bx + 6, by);
    ctx.stroke();
  });
  solidBorder(ctx, w, h, "rgba(255,255,255,0.75)", 8, 10);
  brandMark(ctx, w, "#5A2040", "sunset date");
}

function drawNeon(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  // Outer glow
  ctx.shadowColor = accent;
  ctx.shadowBlur = 18;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 6;
  ctx.strokeRect(12, 12, w - 24, h - 24);
  ctx.shadowColor = "#3DF0FF";
  ctx.shadowBlur = 12;
  ctx.strokeStyle = "#3DF0FF";
  ctx.lineWidth = 3;
  ctx.strokeRect(22, 22, w - 44, h - 44);
  ctx.shadowBlur = 0;
  // Corner brackets
  const L = 32;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  [
    [28, 28, 1, 1],
    [w - 28, 28, -1, 1],
    [w - 28, h - 28, -1, -1],
    [28, h - 28, 1, -1],
  ].forEach(([x, y, sx, sy]) => {
    ctx.beginPath();
    ctx.moveTo(x, y + sy * L);
    ctx.lineTo(x, y);
    ctx.lineTo(x + sx * L, y);
    ctx.stroke();
  });
  brandMark(ctx, w, accent, "◆ NEON");
}

function drawNoir(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ticketNotches(ctx, w, h, "#0A0A0A");
  const hole = 11;
  const gap = 8;
  ctx.fillStyle = "#1A1A1A";
  for (let y = 20; y < h - 20; y += hole + gap) {
    ctx.fillRect(6, y, 13, hole);
    ctx.fillRect(w - 19, y, 13, hole);
  }
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 14, w - 48, h - 28);
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 4]);
  ctx.strokeRect(32, 22, w - 64, h - 44);
  ctx.setLineDash([]);
}

function drawChrome(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  const g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, "#FFFFFF");
  g.addColorStop(0.25, accent);
  g.addColorStop(0.5, "#C0C8D8");
  g.addColorStop(0.75, "#F0ABFC");
  g.addColorStop(1, "#FFFFFF");
  ctx.strokeStyle = g;
  ctx.lineWidth = 20;
  ctx.strokeRect(8, 8, w - 16, h - 16);
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(20, 20, w - 40, h - 40);
  brandMark(ctx, w, "#1A2030", "✦ Y2K");
  cornerMotifs(w, h, (x, y) => drawStar(ctx, x, y, 16, accent));
  edgeMotifs(w, h, (x, y) => drawStar(ctx, x, y, 12, "#F0ABFC"));
  scatter(22, w, h, 12).forEach((item) => {    drawStar(ctx, item.x, item.y, 8 + item.s * 5, "#A78BFA");
  });
}

function drawStreet(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  solidBorder(ctx, w, h, "#111111", 18, 8);
  solidBorder(ctx, w, h, accent, 4, 18);
  // Diagonal washi at corners
  const tapes: Array<[number, number, number, string]> = [
    [0, 40, -0.45, "#2BD9FF"],
    [w - 90, 36, 0.4, "#C8FF3B"],
    [10, h - 70, 0.35, accent],
    [w - 100, h - 66, -0.4, "#2BD9FF"],
  ];
  tapes.forEach(([x, y, rot, color]) => {
    ctx.save();
    ctx.translate(x + 45, y + 14);
    ctx.rotate(rot);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(-45, -10, 90, 20);
    ctx.restore();
  });
  brandMark(ctx, w, accent, "SNAP!");
  cornerMotifs(w, h, (x, y) => drawStar(ctx, x, y, 14, "#111111"));
  edgeMotifs(w, h, (x, y) => drawStar(ctx, x, y, 12, "#2BD9FF"));
}

function drawVintage(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  solidBorder(ctx, w, h, accent, 18, 6);
  solidBorder(ctx, w, h, "#F4ECD8", 6, 15);
  solidBorder(ctx, w, h, accent, 1.5, 24);
  // Corner photo brackets
  const L = 28;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  [
    [32, 32, 1, 1],
    [w - 32, 32, -1, 1],
    [w - 32, h - 32, -1, -1],
    [32, h - 32, 1, -1],
  ].forEach(([x, y, sx, sy]) => {
    ctx.beginPath();
    ctx.moveTo(x, y + sy * L);
    ctx.lineTo(x, y);
    ctx.lineTo(x + sx * L, y);
    ctx.stroke();
  });
  brandMark(ctx, w, accent, "◎ analog");
}

function drawCatsCafe(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  solidBorder(ctx, w, h, accent, 22, 8);
  dashedBorder(ctx, w, h, "#C4A484", 2, [5, 6], 22);
  brandMark(ctx, w, "#8A4A28", "☕ meow café");
  drawCatFace(ctx, 46, 48, 32, "#E8A05A", "#FFC6B8", "#E07A6A");
  drawCatFace(ctx, w - 46, h - 48, 30, "#F8F2EA", "#FFB6C8", "#E07A6A");
  drawCatFace(ctx, 46, h - 48, 28, "#F4C7A0", "#FFC6B8", "#E07A6A");
  drawPawPrint(ctx, w / 2, 48, 16, `${accent}CC`, 0.2);
  drawPawPrint(ctx, w / 2, h - 48, 16, `${accent}CC`, -0.2);
  drawPawPrint(ctx, w - 46, 48, 16, `${accent}BB`, 0.3);
  drawPawPrint(ctx, 46, h - 48, 16, `${accent}BB`, -0.35);
  // Coffee steam accents
  ctx.strokeStyle = `${accent}88`;
  ctx.lineWidth = 1.5;
  [w / 2 - 10, w / 2, w / 2 + 10].forEach((sx, i) => {
    ctx.beginPath();
    ctx.moveTo(sx, 56);
    ctx.quadraticCurveTo(sx + (i - 1) * 6, 48, sx, 40);
    ctx.stroke();
  });
}

function drawCatsCalico(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  solidBorder(ctx, w, h, accent, 20, 8);
  solidBorder(ctx, w, h, "#FFFFFF", 4, 16);
  polkaBand(ctx, w, h, "#F9A8D4", 32);
  brandMark(ctx, w, accent, "🎀 calico");
  drawCatFace(ctx, 48, 48, 32, "#F4D6C8", "#FFB6C8", "#F472B6");
  drawCatFace(ctx, w - 48, 48, 30, "#3A2A28", "#FFB6C8", "#F472B6");
  drawBow(ctx, w / 2, 56, 24, accent);
  drawPawPrint(ctx, 48, h - 48, 15, "#F9A8D4", -0.2);
  drawPawPrint(ctx, w - 48, h - 48, 15, "#F9A8D4", 0.2);
}

function drawCatsMoon(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  ctx.shadowColor = accent;
  ctx.shadowBlur = 16;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 6;
  ctx.strokeRect(12, 12, w - 24, h - 24);
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(233,213,255,0.4)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(22, 22, w - 44, h - 44);
  // Crescent
  ctx.fillStyle = "#FDE68A";
  ctx.beginPath();
  ctx.arc(w - 50, 46, 22, 0, Math.PI * 2);
  ctx.arc(w - 38, 40, 17, 0, Math.PI * 2, true);
  ctx.fill("evenodd");
  brandMark(ctx, w, accent, "☽ moon neko");
  drawCatFace(ctx, 50, 50, 32, "#E8E0F8", "#7C3AED", "#C4B5FD");
  drawCatFace(ctx, w - 52, h - 50, 30, "#DDD6FE", "#A78BFA", "#F472B6");
  scatter(20, w, h, 33).forEach((item) => {    drawStar(ctx, item.x, item.y, 6 + item.s * 5, "#E9D5FF");
  });
}

function drawCatsPaws(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  solidBorder(ctx, w, h, accent, 20, 8);
  solidBorder(ctx, w, h, "#FFFFFF", 3, 16);
  const colors = [accent, "#F472B6", "#FBBF24", "#67E8F9"];
  brandMark(ctx, w, accent, "🐾 paw party");
  cornerMotifs(w, h, (x, y) => drawPawPrint(ctx, x, y, 20, accent, 0.12));
  edgeMotifs(w, h, (x, y) => drawPawPrint(ctx, x, y, 16, "#F472B6", 0.2));
  scatter(18, w, h, 5).forEach((item, i) => {    drawPawPrint(
      ctx,
      item.x,
      item.y,
      13 + item.s * 6,
      colors[i % colors.length] ?? accent,
      item.r,
    );
  });
  drawCatFace(ctx, 48, 48, 28, "#C4B5FD", "#DDD6FE", "#F472B6");
  drawCatFace(ctx, w - 48, h - 48, 28, "#FDE68A", "#FBCFE8", "#F472B6");
}

function drawCandy(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  const stripes = ["#FF6B9D", "#7EC8E3", "#FFE37A", "#C4B5FD", "#86EFAC"];
  const band = 28;
  for (let i = 0; i < Math.ceil(w / 14); i += 1) {
    ctx.fillStyle = stripes[i % stripes.length] ?? accent;
    ctx.fillRect(i * 14, 6, 14, band);
    ctx.fillRect(i * 14, h - 6 - band, 14, band);
  }
  for (let i = 0; i < Math.ceil(h / 14); i += 1) {
    ctx.fillStyle = stripes[i % stripes.length] ?? accent;
    ctx.fillRect(6, i * 14, band, 14);
    ctx.fillRect(w - 6 - band, i * 14, band, 14);
  }
  solidBorder(ctx, w, h, "#FFFFFF", 3, 26);
  brandMark(ctx, w, accent, "🍭 candy pop");
  cornerMotifs(w, h, (x, y) => drawStar(ctx, x, y, 16, accent));
  edgeMotifs(w, h, (x, y) => drawStar(ctx, x, y, 12, "#FFE37A"));
  scatter(14, w, h, 88).forEach((item) => {
    drawStar(ctx, item.x, item.y, 8 + item.s * 5, accent);
  });
}

function drawSakuraFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  solidBorder(ctx, w, h, "#F9A8D4", 18, 8);
  solidBorder(ctx, w, h, "#FFFFFF", 3, 16);
  brandMark(ctx, w, accent, "桜 sakura");
  cornerMotifs(w, h, (x, y) => drawSakura(ctx, x, y, 22, accent));
  edgeMotifs(w, h, (x, y) => drawSakura(ctx, x, y, 16, "#FBCFE8"));
  scatter(22, w, h, 77).forEach((item, i) => {    drawSakura(
      ctx,
      item.x,
      item.y,
      10 + item.s * 7,
      i % 2 ? accent : "#FBCFE8",
    );
  });
}

function drawHologram(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#67E8F9");
  g.addColorStop(0.33, "#A78BFA");
  g.addColorStop(0.66, "#F472B6");
  g.addColorStop(1, "#FDE68A");
  ctx.strokeStyle = g;
  ctx.lineWidth = 18;
  ctx.strokeRect(8, 8, w - 16, h - 16);
  ctx.strokeStyle = "rgba(255,255,255,0.65)";
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, w - 40, h - 40);
  // Scan shimmer lines
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 1;
  for (let y = 40; y < h - 40; y += 18) {
    ctx.beginPath();
    ctx.moveTo(28, y);
    ctx.lineTo(w - 28, y);
    ctx.stroke();
  }
  brandMark(ctx, w, accent, "◈ HOLO");
  cornerMotifs(w, h, (x, y) => drawStar(ctx, x, y, 14, "#67E8F9"));
  edgeMotifs(w, h, (x, y) => drawStar(ctx, x, y, 12, "#F472B6"));
  scatter(14, w, h, 31).forEach((item) => {
    drawStar(ctx, item.x, item.y, 8 + item.s * 5, "#A78BFA");
  });
}

function drawMelody(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  solidBorder(ctx, w, h, accent, 20, 8);
  dashedBorder(ctx, w, h, "#A78BFA", 2, [3, 7], 22);
  brandMark(ctx, w, accent, "♪ melody");
  // Music notes on border
  const notes = scatter(18, w, h, 55);
  notes.forEach((item, i) => {    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.fillStyle = i % 2 ? accent : "#7C3AED";
    ctx.beginPath();
    ctx.ellipse(0, 6, 8, 5.5, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(6, -18, 3, 24);
    if (i % 3 === 0) {
      ctx.beginPath();
      ctx.moveTo(9, -18);
      ctx.quadraticCurveTo(20, -24, 20, -8);
      ctx.lineTo(9, -5);
      ctx.fill();
    }
    ctx.restore();
  });
  cornerMotifs(w, h, (x, y) => drawHeart(ctx, x, y, 18, accent));
  edgeMotifs(w, h, (x, y) => drawHeart(ctx, x, y, 14, "#A78BFA"));
}


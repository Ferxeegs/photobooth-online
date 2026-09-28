import type { Slot } from "@/types";

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
  for (let i = 0; i < count; i += 1) {
    n = (n * 16807) % 2147483647;
    const x = (n / 2147483647) * w;
    n = (n * 16807) % 2147483647;
    const y = (n / 2147483647) * h;
    n = (n * 16807) % 2147483647;
    const s = 0.6 + (n / 2147483647) * 0.9;
    n = (n * 16807) % 2147483647;
    const r = (n / 2147483647) * Math.PI * 2;
    out.push({ x, y, s, r });
  }
  return out;
}

function doubleFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  outer: string,
  inner: string,
  radius = 28,
): void {
  ctx.save();
  ctx.strokeStyle = outer;
  ctx.lineWidth = 16;
  roundedRect(ctx, 12, 12, w - 24, h - 24, radius);
  ctx.stroke();
  ctx.strokeStyle = inner;
  ctx.lineWidth = 3;
  roundedRect(ctx, 26, 26, w - 52, h - 52, radius - 6);
  ctx.stroke();
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

function drawFish(
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
  ctx.ellipse(0, 0, size, size * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(size * 0.7, 0);
  ctx.lineTo(size * 1.25, -size * 0.45);
  ctx.lineTo(size * 1.25, size * 0.45);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#2A1848";
  ctx.beginPath();
  ctx.arc(-size * 0.35, -size * 0.08, size * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawDecorations(
  ctx: CanvasRenderingContext2D,
  kind: string,
  canvasW: number,
  canvasH: number,
  accent: string,
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
    default:
      break;
  }
  ctx.restore();
}

export function drawSlotOrnaments(
  ctx: CanvasRenderingContext2D,
  kind: string,
  slots: Slot[],
  accent: string,
): void {
  if (!slots.length) return;
  const first = slots[0];
  const last = slots[slots.length - 1];
  if (!first || !last) return;

  if (kind.startsWith("cats-")) {
    const fur =
      kind === "cats-cafe"
        ? "#E8A05A"
        : kind === "cats-calico"
          ? "#F4D6C8"
          : kind === "cats-moon"
            ? "#E8E0F8"
            : "#C4B5FD";
    const ear =
      kind === "cats-moon" ? "#7C3AED" : "#FFB6C8";
    const nose = kind === "cats-cafe" ? "#E07A6A" : "#F472B6";
    drawCatFace(ctx, first.x + 8, first.y - 2, 28, fur, ear, nose);
    drawCatFace(
      ctx,
      last.x + last.w - 8,
      last.y + last.h + 4,
      26,
      kind === "cats-calico" ? "#3A2A28" : fur,
      ear,
      nose,
    );
    drawBow(ctx, first.x + first.w - 10, first.y - 4, 16, accent);
    return;
  }

  if (kind === "hearts" || kind === "roses" || kind === "letter") {
    drawHeart(ctx, first.x + 6, first.y - 2, 18, accent);
    drawHeart(ctx, last.x + last.w - 8, last.y + last.h + 6, 16, "#FF8AA3");
  }
  if (kind === "neon") {
    ctx.save();
    ctx.shadowColor = accent;
    ctx.shadowBlur = 12;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2.5;
    slots.forEach((slot) => {
      roundedRect(ctx, slot.x - 5, slot.y - 5, slot.w + 10, slot.h + 10, slot.radius + 4);
      ctx.stroke();
    });
    ctx.restore();
  }
  if (kind === "bears") {
    drawBow(ctx, first.x + first.w - 8, first.y - 2, 14, accent);
  }
}

function drawBears(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  doubleFrame(ctx, w, h, accent, "#FFFFFFAA", 32);
  const items = scatter(8, w, h, 42);
  items.forEach((item, i) => {
    ctx.save();
    ctx.translate(item.x, item.y);
    const size = 16 * item.s;
    ctx.fillStyle = i % 2 === 0 ? "#F4C7A0" : "#F8F2EA";
    ctx.beginPath();
    ctx.arc(0, 4, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-size * 0.7, -size * 0.55, size * 0.38, 0, Math.PI * 2);
    ctx.arc(size * 0.7, -size * 0.55, size * 0.38, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(-size * 0.28, 2, size * 0.12, 0, Math.PI * 2);
    ctx.arc(size * 0.28, 2, size * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawClouds(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  doubleFrame(ctx, w, h, "#A8D8F0", "#FFFFFF", 36);
  scatter(8, w, h, 99).forEach((item, i) => {
    drawCloud(
      ctx,
      item.x,
      item.y,
      0.7 + item.s * 0.4,
      i % 2 === 0 ? "#FFFFFF" : "#FFE8F4",
    );
  });
}

function drawPixels(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  const size = 14;
  const colors = [accent, "#7A5CFF", "#50E3C2", "#FFE37A", "#FF8A3D"];
  for (let x = 10; x < w - 10; x += size * 2) {
    pixelBlock(ctx, x, 10, size, colors[(x / size) % colors.length | 0]);
    pixelBlock(ctx, x, h - 24, size, colors[(x / size + 2) % colors.length | 0]);
  }
  for (let y = 10; y < h - 10; y += size * 2) {
    pixelBlock(ctx, 10, y, size, colors[(y / size) % colors.length | 0]);
    pixelBlock(ctx, w - 24, y, size, colors[(y / size + 1) % colors.length | 0]);
  }
}

function drawStrawberry(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  doubleFrame(ctx, w, h, accent, "#FFFFFFCC", 30);
  scatter(10, w, h, 7).forEach((item) => {
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(item.r);
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(0, 16 * item.s);
    ctx.bezierCurveTo(
      -14 * item.s,
      6 * item.s,
      -10 * item.s,
      -8 * item.s,
      0,
      -4 * item.s,
    );
    ctx.bezierCurveTo(
      10 * item.s,
      -8 * item.s,
      14 * item.s,
      6 * item.s,
      0,
      16 * item.s,
    );
    ctx.fill();
    ctx.fillStyle = "#7BC67B";
    ctx.beginPath();
    ctx.moveTo(-8 * item.s, -6 * item.s);
    ctx.lineTo(0, -16 * item.s);
    ctx.lineTo(8 * item.s, -6 * item.s);
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
  ctx.strokeStyle = "#2A1A10";
  ctx.lineWidth = 10;
  roundedRect(ctx, 16, 16, w - 32, h - 32, 18);
  ctx.stroke();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  ctx.setLineDash([12, 10]);
  roundedRect(ctx, 32, 32, w - 64, h - 64, 14);
  ctx.stroke();
  ctx.setLineDash([]);
  scatter(10, w, h, 21).forEach((item) =>
    drawStar(ctx, item.x, item.y, 10 * item.s, accent),
  );
}

function drawRoses(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  doubleFrame(ctx, w, h, `${accent}CC`, "#FFFFFF99", 34);
  scatter(10, w, h, 55).forEach((item) => {
    ctx.save();
    ctx.translate(item.x, item.y);
    for (let i = 3; i >= 1; i -= 1) {
      ctx.beginPath();
      ctx.arc(0, 0, 8 * item.s * i, 0, Math.PI * 2);
      ctx.fillStyle = i === 1 ? "#FFF0F4" : accent;
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
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  ctx.strokeRect(22, 22, w - 44, h - 44);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(32, 32, w - 64, h - 64);
  ctx.fillStyle = accent;
  ctx.font = `${Math.round(Math.min(42, w * 0.07))}px "Great Vibes", cursive`;
  ctx.textAlign = "center";
  ctx.fillText("for you", w / 2, 62);
  scatter(8, w, h, 3).forEach((item) =>
    drawHeart(ctx, item.x, item.y, 16 * item.s, "#E8B4C8"),
  );
}

function drawHearts(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  doubleFrame(ctx, w, h, accent, "#FFFFFFAA", 36);
  scatter(14, w, h, 88).forEach((item, i) =>
    drawHeart(
      ctx,
      item.x,
      item.y,
      12 + item.s * 10,
      i % 3 === 0 ? accent : "#FF8AA3",
    ),
  );
}

function drawLace(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2.2;
  const step = 20;
  for (let x = 24; x < w - 24; x += step) {
    ctx.beginPath();
    ctx.arc(x, 26, 8, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, h - 26, 8, Math.PI, Math.PI * 2);
    ctx.stroke();
  }
  for (let y = 24; y < h - 24; y += step) {
    ctx.beginPath();
    ctx.arc(26, y, 8, Math.PI * 1.5, Math.PI * 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w - 26, y, 8, Math.PI * 0.5, Math.PI * 1.5);
    ctx.stroke();
  }
  scatter(8, w, h, 17).forEach((item) => {
    ctx.beginPath();
    ctx.fillStyle = "#FFFFFF";
    ctx.arc(item.x, item.y, 5 * item.s, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.stroke();
  });
}

function drawSunset(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  const g = ctx.createLinearGradient(0, 0, 0, 120);
  g.addColorStop(0, "rgba(255, 140, 90, 0.45)");
  g.addColorStop(1, "rgba(255, 140, 90, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, 140);
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(w - 70, 64, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#FFFFFFAA";
  ctx.lineWidth = 10;
  roundedRect(ctx, 16, 16, w - 32, h - 32, 28);
  ctx.stroke();
}

function drawNeon(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  ctx.shadowColor = accent;
  ctx.shadowBlur = 22;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 5;
  roundedRect(ctx, 18, 18, w - 36, h - 36, 20);
  ctx.stroke();
  ctx.shadowColor = "#3DF0FF";
  ctx.strokeStyle = "#3DF0FF";
  ctx.lineWidth = 2;
  roundedRect(ctx, 32, 32, w - 64, h - 64, 14);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawNoir(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const hole = 18;
  const gap = 12;
  ctx.fillStyle = "#000000";
  for (let y = 16; y < h - 16; y += hole + gap) {
    ctx.fillRect(8, y, 22, hole);
    ctx.fillRect(w - 30, y, 22, hole);
  }
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 16, w - 80, h - 32);
  ctx.font = "italic 26px Poppins, sans-serif";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.fillText("NOIR", w / 2, 48);
}

function drawChrome(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  const g = ctx.createLinearGradient(0, 0, w, 40);
  g.addColorStop(0, "#FFFFFF");
  g.addColorStop(0.5, accent);
  g.addColorStop(1, "#C0C8D8");
  ctx.strokeStyle = g;
  ctx.lineWidth = 16;
  roundedRect(ctx, 14, 14, w - 28, h - 28, 22);
  ctx.stroke();
  ctx.fillStyle = "#1A2030";
  ctx.font = "700 22px Poppins, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Y2K", 36, 50);
}

function drawStreet(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  ctx.strokeStyle = "#111111";
  ctx.lineWidth = 12;
  ctx.strokeRect(16, 16, w - 32, h - 32);
  ctx.fillStyle = accent;
  ctx.font = "800 26px Poppins, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("SNAP!", w - 36, 52);
  scatter(8, w, h, 64).forEach((item, i) =>
    drawStar(
      ctx,
      item.x,
      item.y,
      12 * item.s,
      i % 2 === 0 ? "#2BD9FF" : "#C8FF3B",
    ),
  );
}

function drawVintage(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  ctx.strokeStyle = accent;
  ctx.lineWidth = 18;
  ctx.strokeRect(10, 10, w - 20, h - 20);
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, w - 56, h - 56);
  ctx.fillStyle = accent;
  ctx.font = "italic 22px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("est. analog", w / 2, 48);
}

function drawCatsCafe(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  doubleFrame(ctx, w, h, accent, "#FFFFFFCC", 32);
  scatter(7, w, h, 11).forEach((item) =>
    drawPawPrint(ctx, item.x, item.y, 12 * item.s, `${accent}99`, item.r),
  );
  scatter(4, w, h, 77).forEach((item) =>
    drawFish(ctx, item.x, item.y, 10 * item.s, "#7EC8E3"),
  );
  drawCatFace(ctx, 48, 48, 32, "#E8A05A", "#FFC6B8", "#E07A6A");
  drawCatFace(ctx, w - 48, h - 56, 30, "#F8F2EA", "#FFB6C8", "#E07A6A");
}

function drawCatsCalico(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  doubleFrame(ctx, w, h, accent, "#FFFFFF", 34);
  scatter(6, w, h, 19).forEach((item) =>
    drawBow(ctx, item.x, item.y, 10 * item.s, accent),
  );
  scatter(6, w, h, 41).forEach((item) =>
    drawPawPrint(ctx, item.x, item.y, 11 * item.s, "#F9A8D4", item.r),
  );
  drawCatFace(ctx, 46, 50, 32, "#F4D6C8", "#FFB6C8", "#F472B6");
  drawCatFace(ctx, w - 50, 52, 28, "#3A2A28", "#FFB6C8", "#F472B6");
  drawCatFace(ctx, w / 2, h - 48, 30, "#E8A05A", "#FFC6B8", "#E07A6A");
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
  ctx.lineWidth = 5;
  roundedRect(ctx, 16, 16, w - 32, h - 32, 24);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#FDE68A";
  ctx.beginPath();
  ctx.arc(w - 64, 56, 22, 0, Math.PI * 2);
  ctx.arc(w - 52, 50, 18, 0, Math.PI * 2, true);
  ctx.fill("evenodd");
  scatter(12, w, h, 33).forEach((item) =>
    drawStar(ctx, item.x, item.y, 5 + item.s * 5, "#E9D5FF"),
  );
  drawCatFace(ctx, 50, 54, 30, "#E8E0F8", "#7C3AED", "#C4B5FD");
  drawCatFace(ctx, w - 52, h - 58, 28, "#DDD6FE", "#A78BFA", "#F472B6");
}

function drawCatsPaws(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  doubleFrame(ctx, w, h, accent, "#FFFFFF", 30);
  const colors = [accent, "#F472B6", "#FBBF24", "#67E8F9", "#C4B5FD"];
  scatter(16, w, h, 5).forEach((item, i) =>
    drawPawPrint(
      ctx,
      item.x,
      item.y,
      11 + item.s * 6,
      colors[i % colors.length] ?? accent,
      item.r,
    ),
  );
  drawCatFace(ctx, 46, 48, 30, "#C4B5FD", "#DDD6FE", "#F472B6");
  drawCatFace(ctx, w - 48, h - 54, 30, "#FDE68A", "#FBCFE8", "#F472B6");
}

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

export function drawCloud(
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
    default:
      break;
  }
  ctx.restore();
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

function drawBears(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  const items = scatter(14, w, h, 42);
  items.forEach((item, i) => {
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.globalAlpha = 0.9;
    const size = 18 * item.s;
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
  ctx.strokeStyle = accent;
  ctx.lineWidth = 10;
  ctx.strokeRect(16, 16, w - 32, h - 32);
}

function drawClouds(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const items = scatter(10, w, h, 99);
  items.forEach((item, i) => {
    drawCloud(
      ctx,
      item.x,
      item.y,
      0.7 + item.s * 0.5,
      i % 2 === 0 ? "#FFFFFF" : "#FFE8F4",
    );
  });
  ctx.strokeStyle = "#A8D8F0";
  ctx.lineWidth = 12;
  ctx.setLineDash([18, 14]);
  ctx.strokeRect(18, 18, w - 36, h - 36);
  ctx.setLineDash([]);
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
  const items = scatter(16, w, h, 7);
  items.forEach((item) => {
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(item.r);
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(0, 16 * item.s);
    ctx.bezierCurveTo(-14 * item.s, 6 * item.s, -10 * item.s, -8 * item.s, 0, -4 * item.s);
    ctx.bezierCurveTo(10 * item.s, -8 * item.s, 14 * item.s, 6 * item.s, 0, 16 * item.s);
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
  ctx.lineWidth = 8;
  ctx.strokeRect(22, 22, w - 44, h - 44);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  ctx.setLineDash([12, 10]);
  ctx.strokeRect(36, 36, w - 72, h - 72);
  ctx.setLineDash([]);
  const stars = scatter(12, w, h, 21);
  stars.forEach((item) => drawStar(ctx, item.x, item.y, 10 * item.s, accent));
}

function drawRoses(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  const items = scatter(12, w, h, 55);
  items.forEach((item) => {
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.globalAlpha = 0.85;
    for (let i = 3; i >= 1; i -= 1) {
      ctx.beginPath();
      ctx.arc(0, 0, 8 * item.s * i, 0, Math.PI * 2);
      ctx.fillStyle = i === 1 ? "#FFF0F4" : accent;
      ctx.fill();
    }
    ctx.restore();
  });
  ctx.strokeStyle = `${accent}99`;
  ctx.lineWidth = 6;
  roundedRect(ctx, 20, 20, w - 40, h - 40, 28);
  ctx.stroke();
}

function drawLetter(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.strokeRect(28, 28, w - 56, h - 56);
  ctx.strokeRect(36, 36, w - 72, h - 72);
  ctx.fillStyle = accent;
  ctx.font = `${Math.round(w * 0.06)}px "Great Vibes", cursive`;
  ctx.textAlign = "center";
  ctx.fillText("for you", w / 2, 70);
  const hearts = scatter(8, w, h, 3);
  hearts.forEach((item) =>
    drawHeart(ctx, item.x, item.y, 16 * item.s, "#E8B4C8"),
  );
}

function drawHearts(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  const items = scatter(18, w, h, 88);
  items.forEach((item, i) =>
    drawHeart(
      ctx,
      item.x,
      item.y,
      14 + item.s * 10,
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
  ctx.lineWidth = 2;
  const step = 22;
  for (let x = 24; x < w - 24; x += step) {
    ctx.beginPath();
    ctx.arc(x, 28, 8, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, h - 28, 8, Math.PI, Math.PI * 2);
    ctx.stroke();
  }
  for (let y = 24; y < h - 24; y += step) {
    ctx.beginPath();
    ctx.arc(28, y, 8, Math.PI * 1.5, Math.PI * 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w - 28, y, 8, Math.PI * 0.5, Math.PI * 1.5);
    ctx.stroke();
  }
  const pearls = scatter(10, w, h, 17);
  pearls.forEach((item) => {
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
  const g = ctx.createLinearGradient(0, 0, 0, 80);
  g.addColorStop(0, "rgba(255, 140, 90, 0.35)");
  g.addColorStop(1, "rgba(255, 140, 90, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, 120);
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(w - 70, 70, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#FFFFFF88";
  ctx.lineWidth = 8;
  roundedRect(ctx, 18, 18, w - 36, h - 36, 24);
  ctx.stroke();
}

function drawNeon(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  ctx.shadowColor = accent;
  ctx.shadowBlur = 18;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 5;
  roundedRect(ctx, 22, 22, w - 44, h - 44, 18);
  ctx.stroke();
  ctx.shadowColor = "#3DF0FF";
  ctx.strokeStyle = "#3DF0FF";
  ctx.lineWidth = 2;
  roundedRect(ctx, 34, 34, w - 68, h - 68, 14);
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
  ctx.font = "italic 28px Poppins, sans-serif";
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
  ctx.lineWidth = 14;
  roundedRect(ctx, 16, 16, w - 32, h - 32, 20);
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
  ctx.lineWidth = 10;
  ctx.strokeRect(18, 18, w - 36, h - 36);
  ctx.fillStyle = accent;
  ctx.font = "800 26px Poppins, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("SNAP!", w - 36, 52);
  const stars = scatter(8, w, h, 64);
  stars.forEach((item, i) =>
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
  ctx.lineWidth = 16;
  ctx.strokeRect(12, 12, w - 24, h - 24);
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, w - 56, h - 56);
  ctx.fillStyle = accent;
  ctx.font = "italic 22px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("est. analog", w / 2, 48);
}

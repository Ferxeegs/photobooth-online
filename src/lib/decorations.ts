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
    const side = Math.floor((n / 2147483647) * 4);
    n = (n * 16807) % 2147483647;
    const pos = n / 2147483647;
    n = (n * 16807) % 2147483647;
    const s = 0.55 + (n / 2147483647) * 0.45;
    n = (n * 16807) % 2147483647;
    const r = (n / 2147483647) * Math.PI * 2;

    let x = 0;
    let y = 0;
    if (side === 0) {
      x = 24 + pos * (w - 48);
      y = 20 + (i % 2) * 16;
    } else if (side === 1) {
      x = 24 + pos * (w - 48);
      y = h - 20 - (i % 2) * 16;
    } else if (side === 2) {
      x = 18;
      y = 60 + pos * (h - 120);
    } else {
      x = w - 18;
      y = 60 + pos * (h - 120);
    }
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
  // Outer soft band
  ctx.strokeStyle = outer;
  ctx.lineWidth = 18;
  roundedRect(ctx, 9, 9, w - 18, h - 18, radius);
  ctx.stroke();
  // White / light separator
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 3;
  roundedRect(ctx, 18, 18, w - 36, h - 36, radius - 4);
  ctx.stroke();
  // Thin accent inner
  ctx.strokeStyle = inner;
  ctx.lineWidth = 1.75;
  roundedRect(ctx, 24, 24, w - 48, h - 48, radius - 8);
  ctx.stroke();
  ctx.restore();
}

function cornerMotifs(
  w: number,
  h: number,
  draw: (x: number, y: number, rot: number) => void,
): void {
  const inset = 36;
  draw(inset, inset, 0);
  draw(w - inset, inset, Math.PI / 2);
  draw(w - inset, h - inset, Math.PI);
  draw(inset, h - inset, -Math.PI / 2);
}

function brandMark(
  ctx: CanvasRenderingContext2D,
  w: number,
  color: string,
  label = "snapie",
): void {
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.55;
  ctx.font = `600 ${Math.max(14, Math.round(w * 0.028))}px Poppins, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, w / 2, 34);
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

function drawBears(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  doubleFrame(ctx, w, h, accent, "#FFFFFFCC", 30);
  brandMark(ctx, w, accent);
  cornerMotifs(w, h, (x, y) => {
    ctx.save();
    ctx.translate(x, y);
    const size = 13;
    ctx.fillStyle = "#F4C7A0";
    ctx.beginPath();
    ctx.arc(0, 3, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-size * 0.7, -size * 0.5, size * 0.35, 0, Math.PI * 2);
    ctx.arc(size * 0.7, -size * 0.5, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(-size * 0.25, 2, size * 0.1, 0, Math.PI * 2);
    ctx.arc(size * 0.25, 2, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  drawBow(ctx, w / 2, 52, 16, accent);
}

function drawClouds(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  doubleFrame(ctx, w, h, "#7EC8E3", "#FFFFFF", 34);
  brandMark(ctx, w, "#4A6A8A");
  cornerMotifs(w, h, (x, y) => {
    drawCloud(ctx, x - 18, y - 4, 0.7, "#FFFFFF");
  });
  scatter(6, w, h, 99).forEach((item, i) => {
    if (item.y > 50 && item.y < h - 50) return;
    drawCloud(ctx, item.x, item.y, 0.45 + item.s * 0.25, i % 2 ? "#FFE8F4" : "#FFFFFF");
  });
}

function drawPixels(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  const size = 10;
  const colors = [accent, "#7A5CFF", "#50E3C2", "#FFE37A"];
  ctx.strokeStyle = accent;
  ctx.lineWidth = 8;
  ctx.strokeRect(12, 12, w - 24, h - 24);
  for (let x = 16; x < w - 16; x += size * 2) {
    pixelBlock(ctx, x, 16, size, colors[(x / size) % colors.length | 0]);
    pixelBlock(ctx, x, h - 26, size, colors[(x / size + 2) % colors.length | 0]);
  }
  brandMark(ctx, w, "#FFE37A", "PIXEL");
}

function drawStrawberry(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  doubleFrame(ctx, w, h, accent, "#FFFFFFDD", 28);
  brandMark(ctx, w, "#C23B5A");
  cornerMotifs(w, h, (x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.bezierCurveTo(-10, 4, -8, -6, 0, -2);
    ctx.bezierCurveTo(8, -6, 10, 4, 0, 12);
    ctx.fill();
    ctx.fillStyle = "#7BC67B";
    ctx.beginPath();
    ctx.moveTo(-5, -4);
    ctx.lineTo(0, -11);
    ctx.lineTo(5, -4);
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
  roundedRect(ctx, 12, 12, w - 24, h - 24, 16);
  ctx.stroke();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 7]);
  roundedRect(ctx, 24, 24, w - 48, h - 48, 12);
  ctx.stroke();
  ctx.setLineDash([]);
  brandMark(ctx, w, "#5A3A1A", "WOW!");
  cornerMotifs(w, h, (x, y) => drawStar(ctx, x, y, 9, accent));
}

function drawRoses(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  doubleFrame(ctx, w, h, `${accent}BB`, "#FFFFFFAA", 32);
  brandMark(ctx, w, accent, "rose");
  cornerMotifs(w, h, (x, y) => {
    ctx.save();
    ctx.translate(x, y);
    for (let i = 3; i >= 1; i -= 1) {
      ctx.beginPath();
      ctx.arc(0, 0, 5 * i, 0, Math.PI * 2);
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
  ctx.strokeRect(14, 14, w - 28, h - 28);
  ctx.lineWidth = 1.25;
  ctx.strokeRect(22, 22, w - 44, h - 44);
  ctx.fillStyle = accent;
  ctx.font = `${Math.round(Math.min(34, w * 0.055))}px "Great Vibes", cursive`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("for you", w / 2, 42);
  cornerMotifs(w, h, (x, y) => drawHeart(ctx, x, y, 12, "#E8B4C8"));
}

function drawHearts(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  doubleFrame(ctx, w, h, accent, "#FFFFFFBB", 34);
  brandMark(ctx, w, accent, "♡ love");
  cornerMotifs(w, h, (x, y) => drawHeart(ctx, x, y, 14, accent));
  scatter(8, w, h, 88).forEach((item, i) => {
    if (item.y > 48 && item.y < h - 48 && item.x > 40 && item.x < w - 40) return;
    drawHeart(ctx, item.x, item.y, 8 + item.s * 5, i % 2 ? accent : "#FF8AA3");
  });
}

function drawLace(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.8;
  const step = 18;
  for (let x = 22; x < w - 22; x += step) {
    ctx.beginPath();
    ctx.arc(x, 18, 6, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, h - 18, 6, Math.PI, Math.PI * 2);
    ctx.stroke();
  }
  for (let y = 22; y < h - 22; y += step) {
    ctx.beginPath();
    ctx.arc(18, y, 6, Math.PI * 1.5, Math.PI * 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w - 18, y, 6, Math.PI * 0.5, Math.PI * 1.5);
    ctx.stroke();
  }
  brandMark(ctx, w, accent, "pearl");
  cornerMotifs(w, h, (x, y) => {
    ctx.beginPath();
    ctx.fillStyle = "#FFFFFF";
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
}

function drawSunset(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  const g = ctx.createLinearGradient(0, 0, 0, 64);
  g.addColorStop(0, "rgba(255, 140, 90, 0.4)");
  g.addColorStop(1, "rgba(255, 140, 90, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, 64);
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(w - 48, 32, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 8;
  roundedRect(ctx, 12, 12, w - 24, h - 24, 22);
  ctx.stroke();
  brandMark(ctx, w, "#5A2040", "sunset");
}

function drawNeon(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  ctx.shadowColor = accent;
  ctx.shadowBlur = 16;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  roundedRect(ctx, 12, 12, w - 24, h - 24, 18);
  ctx.stroke();
  ctx.shadowColor = "#3DF0FF";
  ctx.strokeStyle = "#3DF0FF";
  ctx.lineWidth = 1.75;
  roundedRect(ctx, 22, 22, w - 44, h - 44, 12);
  ctx.stroke();
  ctx.shadowBlur = 0;
  brandMark(ctx, w, accent, "NEON");
}

function drawNoir(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const hole = 12;
  const gap = 9;
  ctx.fillStyle = "#0A0A0A";
  for (let y = 14; y < h - 14; y += hole + gap) {
    ctx.fillRect(7, y, 14, hole);
    ctx.fillRect(w - 21, y, 14, hole);
  }
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 1.75;
  ctx.strokeRect(26, 14, w - 52, h - 28);
  ctx.font = "italic 600 18px Poppins, sans-serif";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("NOIR", w / 2, 36);
}

function drawChrome(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  const g = ctx.createLinearGradient(0, 0, w, 36);
  g.addColorStop(0, "#FFFFFF");
  g.addColorStop(0.45, accent);
  g.addColorStop(1, "#C0C8D8");
  ctx.strokeStyle = g;
  ctx.lineWidth = 14;
  roundedRect(ctx, 10, 10, w - 20, h - 20, 18);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 2;
  roundedRect(ctx, 20, 20, w - 40, h - 40, 12);
  ctx.stroke();
  brandMark(ctx, w, "#1A2030", "Y2K");
}

function drawStreet(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  ctx.strokeStyle = "#111111";
  ctx.lineWidth = 12;
  ctx.strokeRect(12, 12, w - 24, h - 24);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, w - 40, h - 40);
  brandMark(ctx, w, accent, "SNAP!");
  cornerMotifs(w, h, (x, y) => drawStar(ctx, x, y, 8, "#2BD9FF"));
}

function drawVintage(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  ctx.strokeStyle = accent;
  ctx.lineWidth = 16;
  ctx.strokeRect(8, 8, w - 16, h - 16);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(22, 22, w - 44, h - 44);
  brandMark(ctx, w, accent, "analog");
}

function drawCatsCafe(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  doubleFrame(ctx, w, h, accent, "#FFFFFFCC", 30);
  brandMark(ctx, w, "#8A4A28", "meow café");
  drawCatFace(ctx, 40, 40, 22, "#E8A05A", "#FFC6B8", "#E07A6A");
  drawCatFace(ctx, w - 40, h - 40, 20, "#F8F2EA", "#FFB6C8", "#E07A6A");
  drawPawPrint(ctx, w - 40, 40, 11, `${accent}AA`, 0.3);
  drawPawPrint(ctx, 40, h - 40, 11, `${accent}AA`, -0.4);
}

function drawCatsCalico(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  doubleFrame(ctx, w, h, accent, "#FFFFFF", 32);
  brandMark(ctx, w, accent, "calico");
  drawCatFace(ctx, 42, 40, 22, "#F4D6C8", "#FFB6C8", "#F472B6");
  drawCatFace(ctx, w - 42, 40, 20, "#3A2A28", "#FFB6C8", "#F472B6");
  drawBow(ctx, w / 2, 50, 15, accent);
  drawPawPrint(ctx, 42, h - 40, 10, "#F9A8D4", -0.2);
  drawPawPrint(ctx, w - 42, h - 40, 10, "#F9A8D4", 0.2);
}

function drawCatsMoon(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  ctx.shadowColor = accent;
  ctx.shadowBlur = 14;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  roundedRect(ctx, 12, 12, w - 24, h - 24, 22);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(233,213,255,0.45)";
  ctx.lineWidth = 1.5;
  roundedRect(ctx, 22, 22, w - 44, h - 44, 14);
  ctx.stroke();
  ctx.fillStyle = "#FDE68A";
  ctx.beginPath();
  ctx.arc(w - 44, 36, 14, 0, Math.PI * 2);
  ctx.arc(w - 36, 32, 11, 0, Math.PI * 2, true);
  ctx.fill("evenodd");
  brandMark(ctx, w, accent, "moon neko");
  drawCatFace(ctx, 44, 40, 22, "#E8E0F8", "#7C3AED", "#C4B5FD");
  drawCatFace(ctx, w - 48, h - 40, 20, "#DDD6FE", "#A78BFA", "#F472B6");
  scatter(8, w, h, 33).forEach((item) => {
    if (item.y > 55 && item.y < h - 55) return;
    drawStar(ctx, item.x, item.y, 3 + item.s * 3, "#E9D5FF");
  });
}

function drawCatsPaws(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
): void {
  doubleFrame(ctx, w, h, accent, "#FFFFFF", 28);
  brandMark(ctx, w, accent, "paw party");
  const colors = [accent, "#F472B6", "#FBBF24", "#67E8F9"];
  cornerMotifs(w, h, (x, y) => {
    drawPawPrint(ctx, x, y, 12, accent, 0.15);
  });
  scatter(8, w, h, 5).forEach((item, i) => {
    if (item.y > 50 && item.y < h - 50 && item.x > 36 && item.x < w - 36) return;
    drawPawPrint(
      ctx,
      item.x,
      item.y,
      9 + item.s * 3,
      colors[i % colors.length] ?? accent,
      item.r,
    );
  });
  drawCatFace(ctx, 42, 40, 20, "#C4B5FD", "#DDD6FE", "#F472B6");
  drawCatFace(ctx, w - 42, h - 40, 20, "#FDE68A", "#FBCFE8", "#F472B6");
}


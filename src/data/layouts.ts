import type { Layout } from "@/types";

const LANDSCAPE = 4 / 3;

function fitLandscape(boxW: number, boxH: number): { w: number; h: number } {
  if (boxW / boxH >= LANDSCAPE) {
    const h = Math.round(boxH);
    return { w: Math.round(h * LANDSCAPE), h };
  }
  const w = Math.round(boxW);
  return { w, h: Math.round(w / LANDSCAPE) };
}

function stripLandscape(
  count: number,
  canvasW: number,
  canvasH: number,
  captionH: number,
): Layout["slots"] {
  const pad = 40;
  const gap = 24;
  const cellW = canvasW - pad * 2;
  const cellH = (canvasH - pad * 2 - captionH - gap * (count - 1)) / count;
  const { w, h } = fitLandscape(cellW, cellH);
  const x = Math.round(pad + (cellW - w) / 2);
  return Array.from({ length: count }, (_, i) => ({
    x,
    y: Math.round(pad + i * (cellH + gap) + (cellH - h) / 2),
    w,
    h,
    radius: 16,
  }));
}

export const layouts: Layout[] = [
  {
    id: "strip-4",
    name: "Strip Klasik 4",
    description: "Foto strip ala photobooth",
    photoCount: 4,
    orientation: "vertical",
    canvas: { width: 600, height: 1800 },
    slots: stripLandscape(4, 600, 1800, 150),
    captionArea: { x: 40, y: 1610, w: 520, h: 150 },
  },
  {
    id: "strip-3",
    name: "Strip 3",
    description: "Tiga momen berjajar",
    photoCount: 3,
    orientation: "vertical",
    canvas: { width: 600, height: 1500 },
    slots: stripLandscape(3, 600, 1500, 150),
    captionArea: { x: 40, y: 1310, w: 520, h: 150 },
  },
  {
    id: "strip-2",
    name: "Strip 2 Couple",
    description: "Dua foto untuk berdua",
    photoCount: 2,
    orientation: "vertical",
    canvas: { width: 600, height: 1200 },
    slots: stripLandscape(2, 600, 1200, 150),
    captionArea: { x: 40, y: 1010, w: 520, h: 150 },
  },
  {
    id: "grid-2x2",
    name: "Grid 2×2",
    description: "Empat jepretan landscape",
    photoCount: 4,
    orientation: "square",
    canvas: { width: 1200, height: 1200 },
    slots: [
      { x: 48, y: 96, w: 540, h: 405, radius: 24 },
      { x: 612, y: 96, w: 540, h: 405, radius: 24 },
      { x: 48, y: 525, w: 540, h: 405, radius: 24 },
      { x: 612, y: 525, w: 540, h: 405, radius: 24 },
    ],
    captionArea: { x: 48, y: 980, w: 1104, h: 172 },
  },
  {
    id: "grid-2x3",
    name: "Grid 2×3",
    description: "Enam foto landscape",
    photoCount: 6,
    orientation: "vertical",
    canvas: { width: 1200, height: 1800 },
    slots: [
      { x: 48, y: 48, w: 540, h: 405, radius: 22 },
      { x: 612, y: 48, w: 540, h: 405, radius: 22 },
      { x: 48, y: 477, w: 540, h: 405, radius: 22 },
      { x: 612, y: 477, w: 540, h: 405, radius: 22 },
      { x: 48, y: 906, w: 540, h: 405, radius: 22 },
      { x: 612, y: 906, w: 540, h: 405, radius: 22 },
    ],
    captionArea: { x: 48, y: 1355, w: 1104, h: 397 },
  },
  {
    id: "polaroid",
    name: "Polaroid Tunggal",
    description: "Satu jepretan landscape klasik",
    photoCount: 1,
    orientation: "vertical",
    canvas: { width: 1080, height: 1080 },
    slots: [{ x: 70, y: 70, w: 940, h: 705, radius: 8 }],
    captionArea: { x: 70, y: 800, w: 940, h: 210 },
  },
  {
    id: "hero-2",
    name: "Hero + 2 Kecil",
    description: "Satu foto utama, dua pendukung",
    photoCount: 3,
    orientation: "vertical",
    canvas: { width: 1200, height: 1800 },
    slots: [
      { x: 48, y: 48, w: 1104, h: 828, radius: 28 },
      { x: 48, y: 900, w: 540, h: 405, radius: 24 },
      { x: 612, y: 900, w: 540, h: 405, radius: 24 },
    ],
    captionArea: { x: 48, y: 1340, w: 1104, h: 412 },
  },
  {
    id: "landscape-2",
    name: "Landscape 2",
    description: "Dua foto landscape berdampingan",
    photoCount: 2,
    orientation: "horizontal",
    canvas: { width: 1800, height: 900 },
    slots: [
      { x: 48, y: 90, w: 840, h: 630, radius: 28 },
      { x: 912, y: 90, w: 840, h: 630, radius: 28 },
    ],
    captionArea: { x: 48, y: 748, w: 1704, h: 120 },
  },
];

export function getLayout(id: string): Layout {
  const found = layouts.find((item) => item.id === id);
  if (!found) throw new Error(`Layout tidak ditemukan: ${id}`);
  return found;
}

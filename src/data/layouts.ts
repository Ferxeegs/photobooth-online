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
  topPad = 72,
  bottomPad = 24,
): Layout["slots"] {
  const sidePad = 44;
  const gap = 20;
  const cellW = canvasW - sidePad * 2;
  const availableH = canvasH - topPad - bottomPad - captionH - gap * (count - 1);
  const cellH = availableH / count;
  const { w, h } = fitLandscape(cellW, cellH);
  const x = Math.round(sidePad + (cellW - w) / 2);

  return Array.from({ length: count }, (_, i) => ({
    x,
    y: Math.round(topPad + i * (h + gap)),
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
    slots: stripLandscape(4, 600, 1800, 120, 72, 24),
    captionArea: { x: 44, y: 1664, w: 512, h: 112 },
  },
  {
    id: "strip-3",
    name: "Strip 3",
    description: "Tiga momen berjajar",
    photoCount: 3,
    orientation: "vertical",
    canvas: { width: 600, height: 1500 },
    slots: stripLandscape(3, 600, 1500, 130, 76, 24),
    captionArea: { x: 44, y: 1346, w: 512, h: 130 },
  },
  {
    id: "strip-2",
    name: "Strip 2 Couple",
    description: "Dua foto untuk berdua",
    photoCount: 2,
    orientation: "vertical",
    canvas: { width: 600, height: 1200 },
    slots: stripLandscape(2, 600, 1200, 180, 80, 24),
    captionArea: { x: 44, y: 996, w: 512, h: 180 },
  },
  {
    id: "grid-2x2",
    name: "Grid 2×2",
    description: "Empat jepretan landscape",
    photoCount: 4,
    orientation: "square",
    canvas: { width: 1200, height: 1200 },
    slots: [
      { x: 48, y: 80, w: 540, h: 405, radius: 24 },
      { x: 612, y: 80, w: 540, h: 405, radius: 24 },
      { x: 48, y: 515, w: 540, h: 405, radius: 24 },
      { x: 612, y: 515, w: 540, h: 405, radius: 24 },
    ],
    captionArea: { x: 48, y: 950, w: 1104, h: 200 },
  },
  {
    id: "grid-2x3",
    name: "Grid 2×3",
    description: "Enam foto landscape",
    photoCount: 6,
    orientation: "vertical",
    canvas: { width: 1200, height: 1800 },
    slots: [
      { x: 48, y: 76, w: 540, h: 405, radius: 22 },
      { x: 612, y: 76, w: 540, h: 405, radius: 22 },
      { x: 48, y: 506, w: 540, h: 405, radius: 22 },
      { x: 612, y: 506, w: 540, h: 405, radius: 22 },
      { x: 48, y: 936, w: 540, h: 405, radius: 22 },
      { x: 612, y: 936, w: 540, h: 405, radius: 22 },
    ],
    captionArea: { x: 48, y: 1370, w: 1104, h: 380 },
  },
  {
    id: "polaroid",
    name: "Polaroid Tunggal",
    description: "Satu jepretan landscape klasik",
    photoCount: 1,
    orientation: "vertical",
    canvas: { width: 1080, height: 1080 },
    slots: [{ x: 70, y: 76, w: 940, h: 705, radius: 12 }],
    captionArea: { x: 70, y: 810, w: 940, h: 220 },
  },
  {
    id: "hero-2",
    name: "Hero + 2 Kecil",
    description: "Satu foto utama, dua pendukung",
    photoCount: 3,
    orientation: "vertical",
    canvas: { width: 1200, height: 1800 },
    slots: [
      { x: 48, y: 76, w: 1104, h: 828, radius: 28 },
      { x: 48, y: 930, w: 540, h: 405, radius: 24 },
      { x: 612, y: 930, w: 540, h: 405, radius: 24 },
    ],
    captionArea: { x: 48, y: 1365, w: 1104, h: 380 },
  },
  {
    id: "landscape-2",
    name: "Landscape 2",
    description: "Dua foto landscape berdampingan",
    photoCount: 2,
    orientation: "horizontal",
    canvas: { width: 1800, height: 900 },
    slots: [
      { x: 48, y: 76, w: 840, h: 630, radius: 28 },
      { x: 912, y: 76, w: 840, h: 630, radius: 28 },
    ],
    captionArea: { x: 48, y: 730, w: 1704, h: 140 },
  },
];

export function getLayout(id: string): Layout {
  const found = layouts.find((item) => item.id === id);
  if (!found) throw new Error(`Layout tidak ditemukan: ${id}`);
  return found;
}


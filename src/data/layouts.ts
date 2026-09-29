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
  topPad = 96,
  bottomPad = 28,
): Layout["slots"] {
  const sidePad = 64;
  const gap = 28;
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
    radius: 0,
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
    slots: stripLandscape(4, 600, 1800, 120, 96, 28),
    captionArea: { x: 48, y: 1660, w: 504, h: 116 },
  },
  {
    id: "strip-3",
    name: "Strip 3",
    description: "Tiga momen berjajar",
    photoCount: 3,
    orientation: "vertical",
    canvas: { width: 600, height: 1500 },
    slots: stripLandscape(3, 600, 1500, 130, 96, 28),
    captionArea: { x: 48, y: 1340, w: 504, h: 136 },
  },
  {
    id: "strip-2",
    name: "Strip 2 Couple",
    description: "Dua foto untuk berdua",
    photoCount: 2,
    orientation: "vertical",
    canvas: { width: 600, height: 1200 },
    slots: stripLandscape(2, 600, 1200, 160, 100, 28),
    captionArea: { x: 48, y: 1010, w: 504, h: 166 },
  },
  {
    id: "grid-2x2",
    name: "Grid 2×2",
    description: "Empat jepretan landscape",
    photoCount: 4,
    orientation: "square",
    canvas: { width: 1200, height: 1200 },
    slots: [
      { x: 64, y: 96, w: 520, h: 390, radius: 0 },
      { x: 616, y: 96, w: 520, h: 390, radius: 0 },
      { x: 64, y: 520, w: 520, h: 390, radius: 0 },
      { x: 616, y: 520, w: 520, h: 390, radius: 0 },
    ],
    captionArea: { x: 64, y: 940, w: 1072, h: 220 },
  },
  {
    id: "grid-2x3",
    name: "Grid 2×3",
    description: "Enam foto landscape",
    photoCount: 6,
    orientation: "vertical",
    canvas: { width: 1200, height: 1800 },
    slots: [
      { x: 64, y: 90, w: 520, h: 390, radius: 0 },
      { x: 616, y: 90, w: 520, h: 390, radius: 0 },
      { x: 64, y: 516, w: 520, h: 390, radius: 0 },
      { x: 616, y: 516, w: 520, h: 390, radius: 0 },
      { x: 64, y: 942, w: 520, h: 390, radius: 0 },
      { x: 616, y: 942, w: 520, h: 390, radius: 0 },
    ],
    captionArea: { x: 64, y: 1370, w: 1072, h: 380 },
  },
  {
    id: "polaroid",
    name: "Polaroid Tunggal",
    description: "Satu jepretan landscape klasik",
    photoCount: 1,
    orientation: "vertical",
    canvas: { width: 1080, height: 1080 },
    slots: [{ x: 80, y: 90, w: 920, h: 690, radius: 0 }],
    captionArea: { x: 80, y: 810, w: 920, h: 220 },
  },
  {
    id: "hero-2",
    name: "Hero + 2 Kecil",
    description: "Satu foto utama, dua pendukung",
    photoCount: 3,
    orientation: "vertical",
    canvas: { width: 1200, height: 1800 },
    slots: [
      { x: 64, y: 90, w: 1072, h: 804, radius: 0 },
      { x: 64, y: 930, w: 520, h: 390, radius: 0 },
      { x: 616, y: 930, w: 520, h: 390, radius: 0 },
    ],
    captionArea: { x: 64, y: 1360, w: 1072, h: 380 },
  },
  {
    id: "landscape-2",
    name: "Landscape 2",
    description: "Dua foto landscape berdampingan",
    photoCount: 2,
    orientation: "horizontal",
    canvas: { width: 1800, height: 900 },
    slots: [
      { x: 64, y: 90, w: 820, h: 615, radius: 0 },
      { x: 916, y: 90, w: 820, h: 615, radius: 0 },
    ],
    captionArea: { x: 64, y: 740, w: 1672, h: 130 },
  },
];

export function getLayout(id: string): Layout {
  const found = layouts.find((item) => item.id === id);
  if (!found) throw new Error(`Layout tidak ditemukan: ${id}`);
  return found;
}


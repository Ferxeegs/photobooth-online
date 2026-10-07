import type { FilterId } from "@/types";

const cache = new Map<string, HTMLCanvasElement>();

export function applyPhotoFilter(
  source: HTMLImageElement | HTMLCanvasElement,
  filter: FilterId,
): HTMLImageElement | HTMLCanvasElement {
  if (filter === "normal") return source;
  const width = source instanceof HTMLImageElement ? source.naturalWidth : source.width;
  const height = source instanceof HTMLImageElement ? source.naturalHeight : source.height;
  const srcKey = source instanceof HTMLImageElement ? source.src : "canvas";
  const key = `${srcKey}|${filter}|${width}x${height}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return source;
  ctx.drawImage(source, 0, 0);
  const image = ctx.getImageData(0, 0, width, height);
  tonePixels(image.data, filter);
  ctx.putImageData(image, 0, 0);
  cache.set(key, canvas);
  return canvas;
}

function tonePixels(data: Uint8ClampedArray, filter: FilterId): void {
  const spec = filter === "normal" ? undefined : specs[filter];
  if (!spec) return;
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i] ?? 0;
    let g = data[i + 1] ?? 0;
    let b = data[i + 2] ?? 0;

    if (spec.gray) {
      const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      r = y;
      g = y;
      b = y;
    }

    if (spec.sepia > 0) {
      const sr = 0.393 * r + 0.769 * g + 0.189 * b;
      const sg = 0.349 * r + 0.686 * g + 0.168 * b;
      const sb = 0.272 * r + 0.534 * g + 0.131 * b;
      const t = spec.sepia;
      r = r * (1 - t) + sr * t;
      g = g * (1 - t) + sg * t;
      b = b * (1 - t) + sb * t;
    }

    if (spec.sat !== 1) {
      const y = 0.213 * r + 0.715 * g + 0.072 * b;
      const s = spec.sat;
      r = y + (r - y) * s;
      g = y + (g - y) * s;
      b = y + (b - y) * s;
    }

    r = (r - 128) * spec.contrast + 128;
    g = (g - 128) * spec.contrast + 128;
    b = (b - 128) * spec.contrast + 128;

    r *= spec.brightness * spec.tintR;
    g *= spec.brightness * spec.tintG;
    b *= spec.brightness * spec.tintB;

    data[i] = clamp(r);
    data[i + 1] = clamp(g);
    data[i + 2] = clamp(b);
  }
}

const specs: Record<
  Exclude<FilterId, "normal">,
  {
    gray: boolean;
    sepia: number;
    sat: number;
    contrast: number;
    brightness: number;
    tintR: number;
    tintG: number;
    tintB: number;
  }
> = {
  bw: { gray: true, sepia: 0, sat: 1, contrast: 1.08, brightness: 1, tintR: 1, tintG: 1, tintB: 1 },
  sepia: { gray: false, sepia: 0.85, sat: 1, contrast: 1.05, brightness: 1, tintR: 1, tintG: 1, tintB: 1 },
  pastel: { gray: false, sepia: 0, sat: 0.72, contrast: 0.92, brightness: 1.08, tintR: 1.02, tintG: 1, tintB: 1.03 },
  vintage: { gray: false, sepia: 0.35, sat: 0.78, contrast: 1.12, brightness: 1.02, tintR: 1.04, tintG: 1, tintB: 0.94 },
  glow: { gray: false, sepia: 0, sat: 1.18, contrast: 0.94, brightness: 1.12, tintR: 1.02, tintG: 1, tintB: 1.02 },
  blush: { gray: false, sepia: 0.08, sat: 1.08, contrast: 0.96, brightness: 1.06, tintR: 1.16, tintG: 0.94, tintB: 1.04 },
  peach: { gray: false, sepia: 0.18, sat: 1.12, contrast: 1.02, brightness: 1.05, tintR: 1.14, tintG: 1.02, tintB: 0.86 },
  mint: { gray: false, sepia: 0, sat: 0.92, contrast: 0.96, brightness: 1.06, tintR: 0.9, tintG: 1.1, tintB: 1.02 },
  ice: { gray: false, sepia: 0, sat: 0.82, contrast: 1.06, brightness: 1.08, tintR: 0.88, tintG: 0.98, tintB: 1.16 },
  lilac: { gray: false, sepia: 0.06, sat: 0.98, contrast: 0.98, brightness: 1.05, tintR: 1.06, tintG: 0.92, tintB: 1.14 },
  vivid: { gray: false, sepia: 0, sat: 1.48, contrast: 1.14, brightness: 1.02, tintR: 1.02, tintG: 1, tintB: 1.02 },
};

function clamp(value: number): number {
  return value < 0 ? 0 : value > 255 ? 255 : value;
}

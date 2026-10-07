import type { FilterId } from "@/types";

export interface FilterOption {
  id: FilterId;
  name: string;
  css: string;
}

export const filters: FilterOption[] = [
  { id: "normal", name: "Normal ✨", css: "none" },
  { id: "bw", name: "B&W Mono 🖤", css: "grayscale(1) contrast(1.05)" },
  { id: "sepia", name: "Sepia Warm 📜", css: "sepia(0.85) contrast(1.05)" },
  {
    id: "pastel",
    name: "Pastel Dream 🌸",
    css: "saturate(0.72) brightness(1.08) contrast(0.92)",
  },
  {
    id: "vintage",
    name: "Vintage Film 🎞️",
    css: "sepia(0.35) contrast(1.12) saturate(0.78) brightness(1.02)",
  },
  {
    id: "glow",
    name: "Soft Glow 💖",
    css: "brightness(1.12) contrast(0.94) saturate(1.18)",
  },
  {
    id: "blush",
    name: "Blush Pink 💗",
    css: "saturate(1.05) brightness(1.06) contrast(0.96) sepia(0.15) hue-rotate(-10deg)",
  },
  {
    id: "peach",
    name: "Peach Glow 🍑",
    css: "sepia(0.25) saturate(1.15) brightness(1.06) hue-rotate(-15deg)",
  },
  {
    id: "mint",
    name: "Mint Fresh 🌿",
    css: "saturate(0.9) brightness(1.06) contrast(0.96) hue-rotate(18deg)",
  },
  {
    id: "ice",
    name: "Ice Blue ❄️",
    css: "saturate(0.85) brightness(1.08) contrast(1.04) hue-rotate(190deg)",
  },
  {
    id: "lilac",
    name: "Lilac 💜",
    css: "saturate(0.95) brightness(1.05) contrast(0.98) hue-rotate(250deg)",
  },
  {
    id: "vivid",
    name: "Vivid Pop 🌈",
    css: "saturate(1.45) contrast(1.12) brightness(1.02)",
  },
];

export function getFilterCss(id: FilterId): string {
  return filters.find((item) => item.id === id)?.css ?? "none";
}

export const stickerCatalog = [
  "💖", "✨", "⭐", "🎀", "🧸", "🐰", "🌸", "🍓",
  "❤️", "💌", "🦋", "☁️", "🌙", "🧁", "🌷", "🍒",
  "🐱", "😺", "😸", "😻", "🐾", "🐟", "🧶", "🍼",
  "😎", "🔥", "💫", "🎶", "📸", "🥰", "🥂", "🎉",
] as const;

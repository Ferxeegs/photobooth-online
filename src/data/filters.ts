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

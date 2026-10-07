export type ThemeId = "cute" | "romantic" | "cool" | "cat" | "mofusand" | "kitty";
export type CaptureMode = "auto" | "manual";
export type FacingMode = "user" | "environment";
export type PhotoSource = "camera" | "upload";
export type ExportFormat = "png" | "jpg";
export type ExportScale = 1 | 2;
export type FilterId =
  | "normal"
  | "bw"
  | "sepia"
  | "pastel"
  | "vintage"
  | "glow"
  | "blush"
  | "peach"
  | "mint"
  | "ice"
  | "lilac"
  | "vivid";
export type Step =
  | "landing"
  | "permission"
  | "layout"
  | "capture"
  | "review"
  | "frame"
  | "customize"
  | "export"
  | "privacy";

export interface Slot {
  x: number;
  y: number;
  w: number;
  h: number;
  radius: number;
}

export interface CaptionArea {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Layout {
  id: string;
  name: string;
  description: string;
  photoCount: number;
  orientation: "vertical" | "square" | "horizontal";
  canvas: { width: number; height: number };
  slots: Slot[];
  captionArea: CaptionArea;
}

export interface Photo {
  id: string;
  src: string;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  zoom: number;
}

export interface PlacedSticker {
  id: string;
  /** Emoji glyph; empty when using an image sticker */
  emoji: string;
  /** 1..11 — draws keyed PNG from /frames/mofusand */
  mofusandId?: number;
  /** 1..8 — draws keyed PNG from /frames/kitty */
  kittyId?: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface FrameStyle {
  id: string;
  name: string;
  theme: ThemeId;
  bg: string;
  palette: string[];
  captionColor: string;
  accent: string;
  mat: string;
  decoration: DecorationKind;
}

export type DecorationKind =
  | "bears"
  | "clouds"
  | "pixels"
  | "strawberry"
  | "cartoon"
  | "candy"
  | "melody"
  | "roses"
  | "letter"
  | "hearts"
  | "lace"
  | "sunset"
  | "sakura"
  | "neon"
  | "noir"
  | "chrome"
  | "street"
  | "vintage"
  | "hologram"
  | "cats-cafe"
  | "cats-calico"
  | "cats-moon"
  | "cats-paws"
  | "plain"
  | "none"
  | "mofusand-shark"
  | "mofusand-berry"
  | "mofusand-cafe"
  | "mofusand-friends"
  | "mofusand-mix"
  | "kitty-hello"
  | "kitty-bow"
  | "kitty-berry"
  | "kitty-sweet"
  | "kitty-balloon"
  | "kitty-mix"
  | "kitty-cutie";

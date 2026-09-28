export type ThemeId = "cute" | "romantic" | "cool";
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
  | "glow";
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
  emoji: string;
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
  decoration: DecorationKind;
}

export type DecorationKind =
  | "bears"
  | "clouds"
  | "pixels"
  | "strawberry"
  | "cartoon"
  | "roses"
  | "letter"
  | "hearts"
  | "lace"
  | "sunset"
  | "neon"
  | "noir"
  | "chrome"
  | "street"
  | "vintage";

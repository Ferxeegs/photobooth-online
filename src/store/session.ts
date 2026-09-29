import { create } from "zustand";
import type {
  CaptureMode,
  ExportFormat,
  ExportScale,
  FacingMode,
  FilterId,
  Photo,
  PhotoSource,
  PlacedSticker,
  Step,
} from "@/types";

interface SessionState {
  step: Step;
  source: PhotoSource;
  facing: FacingMode;
  captureMode: CaptureMode;
  countdownSeconds: 3 | 5 | 10;
  soundEnabled: boolean;
  layoutId: string;
  photos: Photo[];
  retakeIndex: number | null;
  frameId: string;
  background: string;
  filter: FilterId;
  stickers: PlacedSticker[];
  stickerHistory: PlacedSticker[][];
  caption: string;
  showDate: boolean;
  exportFormat: ExportFormat;
  exportScale: ExportScale;
  print4R: boolean;
  watermark: boolean;
  cameraDenied: boolean;
  setStep: (step: Step) => void;
  setSource: (source: PhotoSource) => void;
  setFacing: (facing: FacingMode) => void;
  setCaptureMode: (mode: CaptureMode) => void;
  setCountdown: (value: 3 | 5 | 10) => void;
  toggleSound: () => void;
  setLayout: (id: string) => void;
  addPhoto: (photo: Photo) => void;
  replacePhoto: (index: number, photo: Photo) => void;
  setPhotos: (photos: Photo[]) => void;
  updatePhoto: (index: number, patch: Partial<Photo>) => void;
  movePhoto: (from: number, to: number) => void;
  setRetakeIndex: (index: number | null) => void;
  setFrame: (id: string, background: string) => void;
  setBackground: (color: string) => void;
  setFilter: (filter: FilterId) => void;
  addSticker: (sticker: PlacedSticker) => void;
  updateSticker: (id: string, patch: Partial<PlacedSticker>) => void;
  removeSticker: (id: string) => void;
  undoSticker: () => void;
  resetCustomize: () => void;
  setCaption: (caption: string) => void;
  toggleDate: () => void;
  setExportFormat: (format: ExportFormat) => void;
  setExportScale: (scale: ExportScale) => void;
  togglePrint4R: () => void;
  toggleWatermark: () => void;
  setCameraDenied: (value: boolean) => void;
  resetSession: () => void;
}

const initialCustomize = {
  filter: "normal" as FilterId,
  stickers: [] as PlacedSticker[],
  stickerHistory: [] as PlacedSticker[][],
  caption: "",
  showDate: true,
};

export const useSession = create<SessionState>((set) => ({
  step: "landing",
  source: "camera",
  facing: "user",
  captureMode: "auto",
  countdownSeconds: 3,
  soundEnabled: true,
  layoutId: "strip-4",
  photos: [],
  retakeIndex: null,
  frameId: "no-frame",
  background: "#FFFFFF",
  ...initialCustomize,
  exportFormat: "png",
  exportScale: 2,
  print4R: false,
  watermark: false,
  cameraDenied: false,
  setStep: (step) => set({ step }),
  setSource: (source) => set({ source }),
  setFacing: (facing) => set({ facing }),
  setCaptureMode: (captureMode) => set({ captureMode }),
  setCountdown: (countdownSeconds) => set({ countdownSeconds }),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  setLayout: (layoutId) =>
    set((s) => {
      s.photos.forEach((photo) => URL.revokeObjectURL(photo.src));
      return { layoutId, photos: [], retakeIndex: null };
    }),
  addPhoto: (photo) => set((s) => ({ photos: [...s.photos, photo] })),
  replacePhoto: (index, photo) =>
    set((s) => {
      const photos = [...s.photos];
      const prev = photos[index];
      if (prev && prev.src !== photo.src) URL.revokeObjectURL(prev.src);
      photos[index] = photo;
      return { photos };
    }),
  setPhotos: (photos) =>
    set((s) => {
      s.photos.forEach((photo) => URL.revokeObjectURL(photo.src));
      return { photos };
    }),
  updatePhoto: (index, patch) =>
    set((s) => {
      const photos = [...s.photos];
      const current = photos[index];
      if (!current) return s;
      photos[index] = { ...current, ...patch };
      return { photos };
    }),
  movePhoto: (from, to) =>
    set((s) => {
      if (from === to) return s;
      const photos = [...s.photos];
      const [item] = photos.splice(from, 1);
      if (!item) return s;
      photos.splice(to, 0, item);
      return { photos };
    }),
  setRetakeIndex: (retakeIndex) => set({ retakeIndex }),
  setFrame: (frameId, background) => set({ frameId, background }),
  setBackground: (background) => set({ background }),
  setFilter: (filter) => set({ filter }),
  addSticker: (sticker) =>
    set((s) => ({
      stickerHistory: [...s.stickerHistory, s.stickers],
      stickers: [...s.stickers, sticker],
    })),
  updateSticker: (id, patch) =>
    set((s) => ({
      stickers: s.stickers.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    })),
  removeSticker: (id) =>
    set((s) => ({
      stickerHistory: [...s.stickerHistory, s.stickers],
      stickers: s.stickers.filter((item) => item.id !== id),
    })),
  undoSticker: () =>
    set((s) => {
      const history = [...s.stickerHistory];
      const prev = history.pop();
      if (!prev) return s;
      return { stickers: prev, stickerHistory: history };
    }),
  resetCustomize: () => set({ ...initialCustomize }),
  setCaption: (caption) => set({ caption }),
  toggleDate: () => set((s) => ({ showDate: !s.showDate })),
  setExportFormat: (exportFormat) => set({ exportFormat }),
  setExportScale: (exportScale) => set({ exportScale }),
  togglePrint4R: () => set((s) => ({ print4R: !s.print4R })),
  toggleWatermark: () => set((s) => ({ watermark: !s.watermark })),
  setCameraDenied: (cameraDenied) => set({ cameraDenied }),
  resetSession: () =>
    set((s) => {
      s.photos.forEach((photo) => URL.revokeObjectURL(photo.src));
      return {
        step: "landing",
        photos: [],
        retakeIndex: null,
        cameraDenied: false,
        ...initialCustomize,
        background: "#FFFFFF",
        frameId: "no-frame",
        layoutId: "strip-4",
        print4R: false,
      };
    }),
}));

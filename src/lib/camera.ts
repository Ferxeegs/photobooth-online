import type { FacingMode } from "@/types";

export function isInAppBrowser(): boolean {
  const ua = navigator.userAgent || "";
  return /FBAN|FBAV|Instagram|TikTok|Bytedance|Line\/|WhatsApp|Twitter/i.test(
    ua,
  );
}

export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

export async function startCamera(
  facing: FacingMode,
): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Browser ini tidak mendukung kamera.");
  }
  const constraints: MediaStreamConstraints = {
    audio: false,
    video: {
      facingMode: { ideal: facing },
      aspectRatio: { ideal: 4 / 3 },
      width: { ideal: 1280 },
      height: { ideal: 960 },
    },
  };
  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    if (facing === "environment") {
      return navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: "user" },
      });
    }
    throw error;
  }
}

export function stopStream(stream: MediaStream | null): void {
  stream?.getTracks().forEach((track) => track.stop());
}

export function cameraErrorMessage(error: unknown): string {
  const name = error instanceof DOMException ? error.name : "";
  if (name === "NotAllowedError" || name === "PermissionDeniedError") {
    return "Izin kamera ditolak. Aktifkan kamera di pengaturan browser, atau unggah foto dari galeri.";
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return "Kamera tidak ditemukan. Kamu bisa unggah foto dari galeri.";
  }
  if (name === "NotReadableError" || name === "TrackStartError") {
    return "Kamera sedang dipakai aplikasi lain. Tutup aplikasi itu, lalu coba lagi.";
  }
  if (name === "OverconstrainedError") {
    return "Kamera tidak mendukung pengaturan yang diminta. Coba ganti kamera.";
  }
  return "Gagal membuka kamera. Coba lagi atau unggah foto dari galeri.";
}

export async function captureFromVideo(
  video: HTMLVideoElement,
  mirrored: boolean,
): Promise<{ src: string; width: number; height: number }> {
  const srcW = video.videoWidth || 1280;
  const srcH = video.videoHeight || 960;
  const canvas = cropToLandscape(video, srcW, srcH, mirrored);
  const blob = await canvasToBlob(canvas, "image/jpeg", 0.92);
  return {
    src: URL.createObjectURL(blob),
    width: canvas.width,
    height: canvas.height,
  };
}

const LANDSCAPE_RATIO = 4 / 3;

function cropToLandscape(
  source: CanvasImageSource,
  srcW: number,
  srcH: number,
  mirrored: boolean,
): HTMLCanvasElement {
  let sx = 0;
  let sy = 0;
  let sw = srcW;
  let sh = srcH;
  if (srcW / srcH > LANDSCAPE_RATIO) {
    sw = srcH * LANDSCAPE_RATIO;
    sx = (srcW - sw) / 2;
  } else {
    sh = srcW / LANDSCAPE_RATIO;
    sy = (srcH - sh) / 2;
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(sw);
  canvas.height = Math.round(sh);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Tidak bisa mengambil foto.");
  if (mirrored) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Gagal membuat berkas gambar."));
          return;
        }
        resolve(blob);
      },
      type,
      quality,
    );
  });
}

export function fileNameNow(ext: "png" | "jpg"): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `snapie-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}.${ext}`;
}

export async function filesToPhotos(
  files: FileList | File[],
): Promise<Array<{ src: string; width: number; height: number }>> {
  const list = Array.from(files).filter((file) => file.type.startsWith("image/"));
  const result: Array<{ src: string; width: number; height: number }> = [];
  for (const file of list) {
    const src = URL.createObjectURL(file);
    const img = new Image();
    img.src = src;
    await img.decode();
    const cropped = cropToLandscape(img, img.naturalWidth, img.naturalHeight, false);
    URL.revokeObjectURL(src);
    const blob = await canvasToBlob(cropped, "image/jpeg", 0.92);
    result.push({
      src: URL.createObjectURL(blob),
      width: cropped.width,
      height: cropped.height,
    });
  }
  return result;
}

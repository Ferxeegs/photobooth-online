import { CuteMascot } from "@/components/CuteMascot";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { getLayout } from "@/data/layouts";
import { track } from "@/lib/analytics";
import { playShutter, playTick } from "@/lib/audio";
import { triggerConfetti } from "@/lib/confetti";
import {
  cameraErrorMessage,
  captureFromVideo,
  filesToPhotos,
  startCamera,
  stopStream,
} from "@/lib/camera";
import { useSession } from "@/store/session";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  ImageUp,
  RefreshCw,
  SwitchCamera,
  Volume2,
  VolumeX,
  ArrowRight
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const POSE_SUGGESTIONS = [
  "Senyum manis! 😊",
  "Pose Duckface gemoy! 😙",
  "Double Peace sign! ✌️✨",
  "Gaya Heart Hand! 🫶",
  "Wink mata kece! 😉",
  "Pose Kaget Lucu! 😲",
  "Kirim ciuman udara! 💋",
  "Pose Senyum Lebar! 😄",
];

export function CaptureScreen() {
  const {
    source,
    facing,
    setFacing,
    layoutId,
    photos,
    addPhoto,
    replacePhoto,
    countdownSeconds,
    setCountdown,
    captureMode,
    setCaptureMode,
    soundEnabled,
    toggleSound,
    retakeIndex,
    setRetakeIndex,
    setStep,
    setSource,
  } = useSession();
  const layout = getLayout(layoutId);
  const needed = layout.photoCount;
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const camGenRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [busy, setBusy] = useState(false);
  const [poseIndex, setPoseIndex] = useState(0);
  const running = useRef(false);

  const taken = photos.length;
  const currentSlot = retakeIndex !== null ? retakeIndex + 1 : Math.min(taken + 1, needed);
  const remaining = retakeIndex !== null ? 1 : needed - taken;
  const mirrored = facing === "user";

  const stopCam = useCallback(() => {
    camGenRef.current += 1;
    stopStream(streamRef.current);
    streamRef.current = null;
    setReady(false);
  }, []);

  const startCam = useCallback(async (mode = facing) => {
    const gen = ++camGenRef.current;
    setError("");
    setReady(false);
    try {
      stopStream(streamRef.current);
      streamRef.current = null;
      const stream = await startCamera(mode);
      // Stale / interrupted attempt (Strict Mode remount, flip, unmount)
      if (gen !== camGenRef.current) {
        stopStream(stream);
        return;
      }
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) {
        stopStream(stream);
        streamRef.current = null;
        if (gen === camGenRef.current) {
          setError("Gagal membuka kamera. Coba lagi atau unggah foto dari galeri.");
        }
        return;
      }
      video.srcObject = stream;
      await video.play();
      if (gen !== camGenRef.current) return;
      setReady(true);
      setError("");
    } catch (err) {
      if (gen !== camGenRef.current) return;
      // play() AbortError when stream is replaced mid-start — not a real failure
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(cameraErrorMessage(err));
      setReady(false);
    }
  }, [facing]);

  useEffect(() => {
    if (source !== "camera") return;
    void startCam();
    return () => stopCam();
  }, [source, facing, startCam, stopCam]);

  useEffect(() => {
    const onLeave = (event: BeforeUnloadEvent) => {
      if (photos.length) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [photos.length]);

  async function snapOnce(): Promise<boolean> {
    const video = videoRef.current;
    if (!video) return false;
    if (soundEnabled) playShutter();
    setFlash(true);
    window.setTimeout(() => setFlash(false), 180);
    const shot = await captureFromVideo(video, mirrored);
    const photo = {
      id: crypto.randomUUID(),
      src: shot.src,
      width: shot.width,
      height: shot.height,
      offsetX: 0.5,
      offsetY: 0.5,
      zoom: 1,
    };
    if (retakeIndex !== null) {
      replacePhoto(retakeIndex, photo);
      setRetakeIndex(null);
      stopCam();
      setStep("review");
      return true;
    }
    addPhoto(photo);
    const latest = useSession.getState().photos;
    if (latest.length >= needed) {
      track("capture_completed", { count: latest.length });
      triggerConfetti();
      stopCam();
      setStep("review");
      return true;
    }
    setPoseIndex((prev) => (prev + 1) % POSE_SUGGESTIONS.length);
    return false;
  }

  async function runCountdownThenSnap(): Promise<boolean> {
    for (let i = countdownSeconds; i >= 1; i -= 1) {
      setCount(i);
      if (soundEnabled) playTick();
      await wait(1000);
    }
    setCount(null);
    return snapOnce();
  }

  async function startAutoSession(): Promise<void> {
    if (running.current || !ready) return;
    running.current = true;
    setBusy(true);
    try {
      const times = remaining;
      for (let i = 0; i < times; i += 1) {
        const done = await runCountdownThenSnap();
        if (done) break;
        await wait(400);
      }
    } finally {
      running.current = false;
      setBusy(false);
    }
  }

  async function onUpload(files: FileList | null): Promise<void> {
    if (!files?.length) return;
    setBusy(true);
    try {
      const loaded = await filesToPhotos(files);
      if (retakeIndex !== null && loaded[0]) {
        replacePhoto(retakeIndex, {
          id: crypto.randomUUID(),
          ...loaded[0],
          offsetX: 0.5,
          offsetY: 0.5,
          zoom: 1,
        });
        setRetakeIndex(null);
        setStep("review");
        return;
      }
      const current = useSession.getState().photos;
      const room = Math.max(0, needed - current.length);
      const next = loaded.slice(0, room).map((item) => ({
        id: crypto.randomUUID(),
        ...item,
        offsetX: 0.5,
        offsetY: 0.5,
        zoom: 1,
      }));
      next.forEach((photo) => addPhoto(photo));
      const total = useSession.getState().photos;
      if (total.length >= needed) {
        track("capture_completed", { count: total.length, source: "upload" });
        triggerConfetti();
        setStep("review");
      }
    } catch {
      setError("Gagal membaca foto. Coba format JPG atau PNG.");
    } finally {
      setBusy(false);
    }
  }

  function flip(): void {
    setFacing(facing === "user" ? "environment" : "user");
  }

  if (source === "upload") {
    return (
      <Shell
        title="Unggah Foto dari Galeri"
        subtitle={`Pilih ${needed} foto pilihanmu untuk ${layout.name}`}
        progress={45}
        onBack={() => setStep("layout")}
      >
        <div className="flex flex-1 flex-col gap-4 py-2">
          <label className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-purple-300 bg-white/80 p-8 text-center shadow-sm hover:bg-white transition-all">
            <ImageUp className="text-purple-600 animate-bounce" size={44} />
            <p className="mt-4 font-display text-xl font-bold text-purple-950">Pilih dari Galeri HP / Komputer</p>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-purple-900/70">
              Kamu bisa memilih beberapa foto sekaligus. Kami akan mengambil <strong>{needed} foto pertama</strong>.
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(event) => void onUpload(event.target.files)}
            />
          </label>
          {photos.length > 0 && photos.length < needed ? (
            <p className="text-center text-xs font-semibold text-purple-900/80">
              Sudah terpilih {photos.length} dari {needed} foto. Silakan tambah foto lagi.
            </p>
          ) : null}
          {error ? (
            <p className="rounded-2xl bg-pink-100 p-3.5 text-xs text-pink-900 font-medium">{error}</p>
          ) : null}
          <Button
            variant="secondary"
            onClick={() => {
              setSource("camera");
              setError("");
            }}
          >
            Buka Kamera Saja
          </Button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell
      title={retakeIndex !== null ? "Ulangi Jepretan" : "Sesi Foto"}
      subtitle={`Foto ke-${currentSlot} dari ${needed} · 4:3 Ratio`}
      progress={45}
      wide
      onBack={() => {
        stopCam();
        setStep("layout");
      }}
    >
      <div className="flex flex-1 flex-col gap-6 lg:flex-row lg:items-start lg:justify-center lg:gap-8">
        {/* Camera Viewfinder */}
        <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl bg-slate-950 shadow-xl border-4 border-white/60 lg:mx-0 lg:max-w-[440px] lg:shrink-0">
          <video
            ref={videoRef}
            playsInline
            muted
            className={`aspect-[4/3] h-full w-full object-cover ${mirrored ? "-scale-x-100" : ""}`}
          />

          {/* Viewfinder overlays */}
          <div className="pointer-events-none absolute inset-3 z-30 flex flex-col justify-between rounded-2xl border border-white/20 p-2.5 select-none sm:inset-4 sm:p-3">
            <div className="flex items-start justify-between gap-2">
              <span className="rounded-full bg-violet-600/90 px-3 py-1 text-[11px] font-bold text-white shadow-xs backdrop-blur-md">
                {currentSlot} / {needed} 📸
              </span>

              {count !== null ? (
                <AnimatePresence mode="wait">
                  <motion.span
                    key={count}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    className="grid min-w-12 place-items-center rounded-2xl bg-black/55 px-3.5 py-1.5 font-display text-4xl font-black leading-none text-white shadow-lg backdrop-blur-md [text-shadow:0_2px_8px_rgba(0,0,0,0.45)] sm:min-w-14 sm:text-5xl"
                  >
                    {count}
                  </motion.span>
                </AnimatePresence>
              ) : (
                <span className="flex items-center gap-1.5 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-bold text-white shadow-xs backdrop-blur-md">
                  <span className="size-2 rounded-full bg-red-500 animate-ping" /> LIVE
                </span>
              )}
            </div>

            {count === null ? (
              <div className="text-center">
                <motion.span
                  key={poseIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-block rounded-full border border-white/20 bg-purple-950/70 px-3.5 py-1 text-xs font-semibold text-purple-200 shadow-xs backdrop-blur-md"
                >
                  Ide Pose: {POSE_SUGGESTIONS[poseIndex]}
                </motion.span>
              </div>
            ) : (
              <div />
            )}
          </div>

          {/* Shutter Flash */}
          {flash ? <div className="absolute inset-0 z-40 bg-white transition-opacity" /> : null}

          {!ready && !error ? (
            <div className="absolute inset-0 z-20 grid place-items-center bg-slate-900 text-xs font-bold text-purple-200">
              <div className="flex flex-col items-center gap-2">
                <span className="animate-spin text-2xl">📸</span>
                <span>Menyalakan kamera...</span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Controls & Options Panel */}
        <div className="flex min-w-0 flex-1 flex-col lg:max-w-md">
          {error && !ready ? (
            <div className="mb-4 rounded-3xl bg-pink-100 p-4 text-xs text-pink-900 border border-pink-200">
              <p className="font-bold text-sm">{error}</p>
              <div className="mt-3 flex gap-2">
                <Button variant="secondary" className="py-2 text-xs" onClick={() => void startCam()}>
                  Coba lagi
                </Button>
                <Button variant="ghost" className="py-2 text-xs" onClick={() => setSource("upload")}>
                  Unggah foto
                </Button>
              </div>
            </div>
          ) : null}

          {/* Mascot Info */}
          <div className="mb-4 rounded-3xl glass-card p-4">
            <CuteMascot
              expression={busy ? "excited" : "happy"}
              speech={
                busy
                  ? "Tahan pose! 📸"
                  : retakeIndex !== null
                  ? "Ulangi yang ini ya"
                  : "Foto ke-" + currentSlot + " dari " + needed
              }
            />
          </div>

          {/* Countdown & Mode Selectors */}
          <div className="rounded-3xl glass-card p-4 space-y-3">
            <div>
              <p className="text-xs font-bold text-purple-900/70 mb-2">Timer Hitung Mundur:</p>
              <div className="flex flex-wrap gap-2">
                {([3, 5, 10] as const).map((value) => (
                  <Chip key={value} active={countdownSeconds === value} onClick={() => setCountdown(value)}>
                    ⏱️ {value} dtk
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-purple-900/70 mb-2">Mode Jepretan:</p>
              <div className="flex flex-wrap gap-2">
                <Chip active={captureMode === "auto"} onClick={() => setCaptureMode("auto")}>
                  ⚡ Otomatis Seri
                </Chip>
                <Chip active={captureMode === "manual"} onClick={() => setCaptureMode("manual")}>
                  👆 Manual Satuan
                </Chip>
              </div>
            </div>
          </div>

          {/* Action Button Strip */}
          <div className="mt-5 flex items-center justify-between gap-3">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              type="button"
              className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/90 text-purple-950 shadow-sm border border-purple-100"
              onClick={toggleSound}
              aria-label={soundEnabled ? "Matikan Suara" : "Nyalakan Suara"}
            >
              {soundEnabled ? <Volume2 size={20} className="text-purple-700" /> : <VolumeX size={20} className="text-purple-400" />}
            </motion.button>

            {captureMode === "manual" && remaining > 0 ? (
              <Button
                variant="primary"
                className="flex-1 py-4 text-base shadow-md"
                disabled={!ready || busy}
                onClick={() => void runCountdownThenSnap()}
                icon={<Camera size={22} />}
              >
                {busy ? "Mengambil..." : "Jepret Foto"}
              </Button>
            ) : remaining <= 0 && retakeIndex === null ? (
              <Button
                variant="primary"
                className="flex-1 py-4 text-base"
                onClick={() => {
                  stopCam();
                  setStep("review");
                }}
                icon={<ArrowRight size={20} />}
              >
                Lanjut Review Foto
              </Button>
            ) : (
              <Button
                variant="primary"
                className="flex-1 py-4 text-base"
                disabled={!ready || busy}
                onClick={() => void startAutoSession()}
                icon={<Camera size={22} />}
              >
                {busy ? "Sesi Berjalan..." : retakeIndex !== null ? "Ulangi Jepretan Ini" : "Mulai Sesi Foto"}
              </Button>
            )}

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              type="button"
              className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/90 text-purple-950 shadow-sm border border-purple-100"
              onClick={flip}
              aria-label="Ganti Kamera"
            >
              <SwitchCamera size={20} className="text-purple-700" />
            </motion.button>
          </div>

          <button
            type="button"
            className="mt-4 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-purple-800/70 hover:text-purple-900"
            onClick={() => setSource("upload")}
          >
            <RefreshCw size={14} /> Pilih foto dari galeri HP sebagai gantinya
          </button>
        </div>
      </div>
    </Shell>
  );
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

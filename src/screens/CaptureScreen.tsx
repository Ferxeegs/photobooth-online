import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { getLayout } from "@/data/layouts";
import { track } from "@/lib/analytics";
import { playShutter, playTick } from "@/lib/audio";
import {
  cameraErrorMessage,
  captureFromVideo,
  filesToPhotos,
  startCamera,
  stopStream,
} from "@/lib/camera";
import { useSession } from "@/store/session";
import { Camera, ImageUp, RefreshCw, SwitchCamera, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [busy, setBusy] = useState(false);
  const running = useRef(false);

  const taken = photos.length;
  const currentSlot = retakeIndex !== null ? retakeIndex + 1 : Math.min(taken + 1, needed);
  const remaining = retakeIndex !== null ? 1 : needed - taken;
  const mirrored = facing === "user";

  const stopCam = useCallback(() => {
    stopStream(streamRef.current);
    streamRef.current = null;
    setReady(false);
  }, []);

  const startCam = useCallback(async (mode = facing) => {
    setError("");
    setReady(false);
    try {
      stopStream(streamRef.current);
      const stream = await startCamera(mode);
      streamRef.current = stream;
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await video.play();
        setReady(true);
      }
    } catch (err) {
      setError(cameraErrorMessage(err));
    }
  }, [facing]);

  useEffect(() => {
    if (source !== "camera") return;
    void startCam();
    return () => stopCam();
  }, [source, startCam, stopCam]);

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
    window.setTimeout(() => setFlash(false), 160);
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
      stopCam();
      setStep("review");
      return true;
    }
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
        await wait(350);
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
        title="Unggah foto"
        subtitle={`Pilih ${needed} foto untuk ${layout.name}`}
        progress={45}
        onBack={() => setStep("layout")}
      >
        <label className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-blush bg-white/70 p-6 text-center">
          <ImageUp className="text-heart" size={36} />
          <p className="mt-3 font-display text-xl">Pilih dari galeri</p>
          <p className="mt-1 text-sm text-ink-soft">
            Bisa pilih banyak sekaligus. Kami memakai {needed} foto pertama.
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
          <p className="mt-3 text-center text-sm text-ink-soft">
            {photos.length} dari {needed} foto. Tambah lagi ya.
          </p>
        ) : null}
        {error ? (
          <p className="mt-3 rounded-2xl bg-violet-50 px-4 py-3 text-sm text-violet-900">{error}</p>
        ) : null}
        <Button
          className="mt-4"
          variant="secondary"
          onClick={() => {
            setSource("camera");
            setError("");
          }}
        >
          Gunakan kamera saja
        </Button>
      </Shell>
    );
  }

  return (
    <Shell
      title={retakeIndex !== null ? "Ulangi foto" : "Sesi foto"}
      subtitle={`Foto ${currentSlot} dari ${needed} · landscape 4:3`}
      progress={45}
      wide
      onBack={() => {
        stopCam();
        setStep("layout");
      }}
    >
      <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-start lg:justify-center lg:gap-8">
        <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl bg-black shadow-lg lg:mx-0 lg:max-w-[420px] lg:shrink-0">
          <video
            ref={videoRef}
            playsInline
            muted
            className={`aspect-[4/3] h-full w-full object-cover ${mirrored ? "-scale-x-100" : ""}`}
          />
          {flash ? <div className="absolute inset-0 bg-white/90" /> : null}
          {count !== null ? (
            <div className="absolute inset-0 grid place-items-center bg-black/25">
              <p className="font-display text-7xl text-white drop-shadow-lg lg:text-6xl">{count}</p>
            </div>
          ) : null}
          {!ready && !error ? (
            <div className="absolute inset-0 grid place-items-center text-sm text-white">
              Menyalakan kamera…
            </div>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-1 flex-col lg:max-w-sm lg:pt-1">
          {error ? (
            <div className="mb-3 rounded-2xl bg-violet-50 px-4 py-3 text-sm text-violet-900">
              {error}
              <div className="mt-2 flex gap-2">
                <Button variant="secondary" onClick={() => void startCam()}>
                  Coba lagi
                </Button>
                <Button variant="ghost" onClick={() => setSource("upload")}>
                  Unggah foto
                </Button>
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {([3, 5, 10] as const).map((value) => (
              <Chip key={value} active={countdownSeconds === value} onClick={() => setCountdown(value)}>
                {value} dtk
              </Chip>
            ))}
            <Chip active={captureMode === "auto"} onClick={() => setCaptureMode("auto")}>
              Otomatis
            </Chip>
            <Chip active={captureMode === "manual"} onClick={() => setCaptureMode("manual")}>
              Manual
            </Chip>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3 lg:justify-start">
            <button
              type="button"
              className="grid size-12 place-items-center rounded-full bg-white/80"
              onClick={toggleSound}
              aria-label={soundEnabled ? "Matikan suara" : "Nyalakan suara"}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            {captureMode === "manual" && remaining > 0 ? (
              <Button
                className="size-16 rounded-full px-0 lg:size-14"
                disabled={!ready || busy}
                onClick={() => void runCountdownThenSnap()}
                icon={<Camera size={24} />}
                aria-label="Jepret"
              />
            ) : remaining <= 0 && retakeIndex === null ? (
              <Button
                onClick={() => {
                  stopCam();
                  setStep("review");
                }}
              >
                Lanjut review
              </Button>
            ) : (
              <Button
                disabled={!ready || busy}
                onClick={() => void startAutoSession()}
              >
                {busy ? "Mengambil…" : retakeIndex !== null ? "Ulangi" : "Mulai sesi"}
              </Button>
            )}
            <button
              type="button"
              className="grid size-12 place-items-center rounded-full bg-white/80"
              onClick={flip}
              aria-label="Ganti kamera"
            >
              <SwitchCamera size={18} />
            </button>
          </div>
          <button
            type="button"
            className="mt-3 inline-flex items-center justify-center gap-2 text-sm text-ink-soft lg:justify-start"
            onClick={() => setSource("upload")}
          >
            <RefreshCw size={14} /> atau unggah dari galeri
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

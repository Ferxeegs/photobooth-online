import { CuteMascot } from "@/components/CuteMascot";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import {
  cameraErrorMessage,
  isInAppBrowser,
  startCamera,
  stopStream,
} from "@/lib/camera";
import { useSession } from "@/store/session";
import { motion } from "framer-motion";
import { Camera, ImageUp, ShieldAlert } from "lucide-react";
import { useState } from "react";

export function PermissionScreen() {
  const { setStep, setSource, setCameraDenied, cameraDenied } = useSession();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const inApp = isInAppBrowser();

  async function allowCamera(): Promise<void> {
    setBusy(true);
    setError("");
    try {
      const stream = await startCamera("user");
      stopStream(stream);
      setCameraDenied(false);
      setSource("camera");
      track("camera_granted");
      setStep("layout");
    } catch (err) {
      setCameraDenied(true);
      track("camera_denied");
      setError(cameraErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  function useUpload(): void {
    setSource("upload");
    setStep("layout");
  }

  return (
    <Shell
      title="Izin Kamera"
      subtitle="Foto diproses lokal di HP-mu tanpa diunggah"
      progress={15}
      onBack={() => setStep("landing")}
    >
      <div className="flex flex-1 flex-col gap-5 py-2">
        {inApp ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-amber-300/80 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-950 backdrop-blur-md"
          >
            ⚠️ <strong>Perhatian:</strong> Kamu membuka Snapie via browser internal (Instagram / TikTok). Jika kamera tidak muncul, ketuk titik 3 di kanan atas lalu pilih <strong>"Buka di Chrome / Safari"</strong>.
          </motion.div>
        ) : null}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl glass-card p-6 shadow-md"
        >
          <div className="flex items-center gap-4">
            <CuteMascot expression="camera" />
            <div>
              <h2 className="font-display text-2xl font-bold text-purple-950">Siapkan Kamera</h2>
              <p className="mt-1 text-xs text-purple-900/70">
                Izinkan akses kamera untuk memulai foto strip otomatis.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3 border-t border-purple-100 pt-4 text-xs text-purple-900/80">
            <div className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">✓</span>
              <p><strong>Privasi Dijamin:</strong> Foto tidak pernah dikirim atau disimpan di server mana pun.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-pink-100 font-bold text-pink-700">✓</span>
              <p><strong>Bisa Ganti Kamera:</strong> Bisa pakai kamera depan atau belakang sesuai selera.</p>
            </div>
          </div>
        </motion.div>

        {error || cameraDenied ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-pink-300/80 bg-pink-500/10 p-5 text-xs text-pink-950 shadow-sm"
          >
            <div className="flex items-center gap-2 font-bold text-pink-900 text-sm">
              <ShieldAlert size={18} />
              <span>{error || "Izin kamera belum diberikan."}</span>
            </div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-purple-950/80">
              <li>Chrome: Ketuk ikon gembok 🔒 di URL &rarr; Izin Kamera &rarr; Izinkan.</li>
              <li>Safari: Pengaturan HP &rarr; Safari &rarr; Kamera &rarr; Izinkan.</li>
              <li>Atau gunakan opsi <strong>Unggah dari Galeri</strong> di bawah ini!</li>
            </ul>
          </motion.div>
        ) : null}

        <div className="mt-auto flex flex-col gap-3 pt-4">
          <Button
            variant="primary"
            className="py-3.5 text-base"
            onClick={() => void allowCamera()}
            disabled={busy}
            icon={<Camera size={20} />}
          >
            {busy ? "Meminta izin kamera…" : "Izinkan & Buka Kamera"}
          </Button>

          <Button
            variant="secondary"
            className="py-3.5 text-base"
            onClick={useUpload}
            icon={<ImageUp size={20} />}
          >
            Pilih Foto dari Galeri
          </Button>
        </div>
      </div>
    </Shell>
  );
}

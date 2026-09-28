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
import { Camera, ImageUp, Shield } from "lucide-react";
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
      title="Siapkan kamera"
      subtitle="Foto tidak pernah meninggalkan HP-mu"
      progress={15}
      onBack={() => setStep("landing")}
    >
      <div className="flex flex-1 flex-col gap-4">
        {inApp ? (
          <div className="rounded-2xl bg-amber-100 px-4 py-3 text-sm text-amber-950">
            Browser dalam aplikasi (IG/TikTok) sering memblokir kamera. Buka
            tautan ini di Chrome atau Safari untuk hasil terbaik.
          </div>
        ) : null}

        <div className="rounded-3xl bg-white/80 p-5 shadow-sm">
          <div className="grid size-14 place-items-center rounded-2xl bg-blush/60 text-heart">
            <Shield />
          </div>
          <h2 className="mt-4 font-display text-2xl">Kenapa perlu kamera?</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Snapie memakai kamera perangkatmu untuk sesi photobooth. Pratinjau
            dan hasil kolase diproses di browser. Tidak ada akun, tidak ada
            unggahan ke server.
          </p>
        </div>

        {error || cameraDenied ? (
          <div className="rounded-2xl bg-violet-50 px-4 py-3 text-sm text-violet-900">
            <p>{error || "Izin kamera belum diberikan."}</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs">
              <li>Chrome: ikon gembok di bilah alamat → Izinkan kamera.</li>
              <li>Safari: Pengaturan → Safari → Kamera → Izinkan.</li>
              <li>Atau unggah foto dari galeri sebagai alternatif.</li>
            </ul>
          </div>
        ) : null}

        <div className="mt-auto grid gap-3">
          <Button
            onClick={() => void allowCamera()}
            disabled={busy}
            icon={<Camera size={18} />}
          >
            {busy ? "Meminta izin…" : "Izinkan Kamera"}
          </Button>
          <Button variant="secondary" onClick={useUpload} icon={<ImageUp size={18} />}>
            Unggah dari Galeri
          </Button>
        </div>
      </div>
    </Shell>
  );
}

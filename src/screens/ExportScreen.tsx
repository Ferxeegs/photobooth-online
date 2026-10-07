import { CollagePreview } from "@/components/CollagePreview";
import { CuteMascot } from "@/components/CuteMascot";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { getFrame } from "@/data/frames";
import { getLayout } from "@/data/layouts";
import { track } from "@/lib/analytics";
import { triggerConfetti } from "@/lib/confetti";
import { canvasToBlob, fileNameNow, isIOS } from "@/lib/camera";
import { renderCollage, renderPrintSheet } from "@/lib/render";
import { useSession } from "@/store/session";
import { motion } from "framer-motion";
import { Download, RefreshCw, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

export function ExportScreen() {
  const session = useSession();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fallbackUrl, setFallbackUrl] = useState("");
  const ios = isIOS();
  const canShare = typeof navigator.share === "function";

  useEffect(() => {
    triggerConfetti();
  }, []);

  async function makeCanvas(): Promise<HTMLCanvasElement> {
    const layout = getLayout(session.layoutId);
    const frame = getFrame(session.frameId);
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const lowMem = memory !== undefined && memory <= 2;
    const scale = lowMem ? 1 : session.exportScale;
    const collage = await renderCollage({
      layout,
      photos: session.photos,
      frame,
      background: session.background,
      filter: session.filter,
      stickers: session.stickers,
      caption: session.caption,
      showDate: session.showDate,
      watermark: session.watermark,
      scale,
    });
    if (session.print4R) return renderPrintSheet(collage);
    return collage;
  }

  async function exportBlob(): Promise<{ blob: Blob; name: string }> {
    const canvas = await makeCanvas();
    const type = session.exportFormat === "png" ? "image/png" : "image/jpeg";
    const quality = session.exportFormat === "jpg" ? 0.92 : undefined;
    try {
      const blob = await canvasToBlob(canvas, type, quality);
      return { blob, name: fileNameNow(session.exportFormat) };
    } catch {
      const smaller = await renderCollage({
        layout: getLayout(session.layoutId),
        photos: session.photos,
        frame: getFrame(session.frameId),
        background: session.background,
        filter: session.filter,
        stickers: session.stickers,
        caption: session.caption,
        showDate: session.showDate,
        watermark: session.watermark,
        scale: 1,
      });
      const blob = await canvasToBlob(
        smaller,
        type,
        session.exportFormat === "jpg" ? 0.85 : undefined,
      );
      return { blob, name: fileNameNow(session.exportFormat) };
    }
  }

  async function download(): Promise<void> {
    setBusy(true);
    setError("");
    try {
      const { blob, name } = await exportBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      link.click();
      triggerConfetti();
      if (ios) setFallbackUrl(url);
      else window.setTimeout(() => URL.revokeObjectURL(url), 4000);
      track("export_success", { format: session.exportFormat, scale: session.exportScale });
    } catch {
      setError("Ekspor gagal. Coba turunkan ke 1× atau format JPG.");
    } finally {
      setBusy(false);
    }
  }

  async function share(): Promise<void> {
    setBusy(true);
    setError("");
    track("share_click");
    try {
      const { blob, name } = await exportBlob();
      const file = new File([blob], name, { type: blob.type });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Snapie",
          text: "Foto strip dari Snapie",
        });
        track("export_success", { format: session.exportFormat, share: true });
        return;
      }
      if (canShare) {
        await navigator.share({ title: "Snapie", text: "Foto strip dari Snapie" });
        return;
      }
      setError("Berbagi tidak didukung browser ini. Unduh saja lalu kirim via galeri HP.");
    } catch (err) {
      if ((err as DOMException).name !== "AbortError") {
        setError("Gagal membagikan. Coba unduh dulu.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell
      title="Pratinjau Akhir & Unduh"
      subtitle="Foto strip siap diunduh, dibagikan ke IG Story, atau dicetak"
      progress={100}
      onBack={() => session.setStep("customize")}
    >
      <div className="flex flex-col gap-4">
        {/* Mascot Banner */}
        <div className="rounded-3xl glass-card p-4">
          <CuteMascot expression="excited" speech="Jadi deh. Simpan foto ini ya 🎉" />
        </div>

        {/* Final Collage Preview */}
        <div className="relative">
          <CollagePreview maxHeight={540} />
        </div>

        {/* Options & Settings */}
        <div className="rounded-3xl glass-card p-4 space-y-3">
          <p className="text-xs font-bold text-purple-950">Opsi Format & Cetak:</p>
          <div className="flex flex-wrap gap-2">
            <Chip
              active={session.exportFormat === "png"}
              onClick={() => session.setExportFormat("png")}
            >
              🌟 PNG Jernih
            </Chip>
            <Chip
              active={session.exportFormat === "jpg"}
              onClick={() => session.setExportFormat("jpg")}
            >
              ⚡ JPG (Ringan)
            </Chip>
            <Chip active={session.exportScale === 1} onClick={() => session.setExportScale(1)}>
              📱 1× Standar
            </Chip>
            <Chip active={session.exportScale === 2} onClick={() => session.setExportScale(2)}>
              💎 2× Ultra HD
            </Chip>
            <Chip active={session.print4R} onClick={session.togglePrint4R}>
              🖨️ Format Cetak 4R (2 Strip)
            </Chip>
            <Chip active={session.watermark} onClick={session.toggleWatermark}>
              ✨ Watermark Snapie
            </Chip>
          </div>
        </div>

        {error ? (
          <p className="rounded-2xl bg-pink-100 p-4 text-xs font-semibold text-pink-950">{error}</p>
        ) : null}

        {fallbackUrl ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl glass-card p-4 text-xs space-y-2"
          >
            <p className="font-bold text-purple-950">💡 Khusus pengguna iPhone / iOS Safari:</p>
            <p className="text-purple-900/70">Tekan dan tahan gambar di bawah ini, lalu pilih <strong>"Simpan ke Foto"</strong>.</p>
            <img src={fallbackUrl} alt="Hasil Snapie" className="w-full rounded-2xl border border-purple-200 shadow-sm" />
          </motion.div>
        ) : null}

        {/* Main Action Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <Button
            variant="primary"
            className="w-full py-4 text-lg shadow-lg animate-pulse-glow"
            disabled={busy}
            icon={<Download size={22} className="animate-bounce" />}
            onClick={() => void download()}
          >
            {busy ? "Menyusun Gambar..." : "Unduh Foto Strip HD"}
          </Button>

          <Button
            variant="secondary"
            className="w-full py-3.5 text-base"
            disabled={busy}
            icon={<Share2 size={20} />}
            onClick={() => void share()}
          >
            Bagikan Foto Strip
          </Button>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              variant="ghost"
              className="py-3 text-xs"
              icon={<RefreshCw size={16} />}
              onClick={() => {
                session.setPhotos([]);
                session.setStep("layout");
              }}
            >
              Foto Lagi
            </Button>
            <Button
              variant="dark"
              className="py-3 text-xs"
              onClick={() => session.resetSession()}
            >
              Selesai & Reset
            </Button>
          </div>
        </div>
      </div>
    </Shell>
  );
}

import { CollagePreview } from "@/components/CollagePreview";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { getFrame } from "@/data/frames";
import { getLayout } from "@/data/layouts";
import { track } from "@/lib/analytics";
import { canvasToBlob, fileNameNow, isIOS } from "@/lib/camera";
import { renderCollage, renderPrintSheet } from "@/lib/render";
import { useSession } from "@/store/session";
import { Download, RefreshCw, Share2 } from "lucide-react";
import { useState } from "react";

export function ExportScreen() {
  const session = useSession();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fallbackUrl, setFallbackUrl] = useState("");
  const ios = isIOS();
  const canShare = typeof navigator.share === "function";

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
          text: "Hasil photobooth Snapie",
        });
        track("export_success", { format: session.exportFormat, share: true });
        return;
      }
      if (canShare) {
        await navigator.share({ title: "Snapie", text: "Hasil photobooth Snapie" });
        return;
      }
      setError("Berbagi tidak didukung. Unduh saja, lalu kirim dari galeri.");
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
      title="Pratinjau & unduh"
      subtitle="Hasil siap dibagikan atau dicetak"
      progress={100}
      onBack={() => session.setStep("customize")}
    >
      <CollagePreview maxHeight={560} />
      <div className="mt-4 flex flex-wrap gap-2">
        <Chip
          active={session.exportFormat === "png"}
          onClick={() => session.setExportFormat("png")}
        >
          PNG
        </Chip>
        <Chip
          active={session.exportFormat === "jpg"}
          onClick={() => session.setExportFormat("jpg")}
        >
          JPG 92%
        </Chip>
        <Chip active={session.exportScale === 1} onClick={() => session.setExportScale(1)}>
          1× ringan
        </Chip>
        <Chip active={session.exportScale === 2} onClick={() => session.setExportScale(2)}>
          2× HD
        </Chip>
        <Chip active={session.print4R} onClick={session.togglePrint4R}>
          Lembar 4R (2 strip)
        </Chip>
        <Chip active={session.watermark} onClick={session.toggleWatermark}>
          Watermark
        </Chip>
      </div>
      {error ? (
        <p className="mt-3 rounded-2xl bg-violet-50 px-4 py-3 text-sm text-violet-900">{error}</p>
      ) : null}
      {fallbackUrl ? (
        <div className="mt-3 rounded-2xl bg-white/80 p-3 text-sm">
          <p className="text-ink-soft">iOS: tekan lama gambar lalu pilih Simpan.</p>
          <img src={fallbackUrl} alt="Hasil Snapie" className="mt-2 w-full rounded-xl" />
        </div>
      ) : null}
      <div className="mt-4 grid gap-3">
        <Button
          className="w-full"
          disabled={busy}
          icon={<Download size={18} />}
          onClick={() => void download()}
        >
          {busy ? "Menyusun…" : "Unduh"}
        </Button>
        <Button
          className="w-full"
          variant="secondary"
          disabled={busy}
          icon={<Share2 size={18} />}
          onClick={() => void share()}
        >
          Bagikan
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="ghost"
            icon={<RefreshCw size={16} />}
            onClick={() => {
              session.setPhotos([]);
              session.setStep("layout");
            }}
          >
            Foto lagi
          </Button>
          <Button variant="dark" onClick={() => session.resetSession()}>
            Selesai
          </Button>
        </div>
      </div>
    </Shell>
  );
}

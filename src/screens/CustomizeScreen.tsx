import { CollagePreview } from "@/components/CollagePreview";
import { CuteMascot } from "@/components/CuteMascot";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { filters, stickerCatalog } from "@/data/filters";
import { track } from "@/lib/analytics";
import { useSession } from "@/store/session";
import { motion } from "framer-motion";
import { RotateCcw, Undo2, ArrowRight } from "lucide-react";
import { useState } from "react";

type Tab = "filter" | "sticker" | "text";

export function CustomizeScreen() {
  const {
    filter,
    setFilter,
    addSticker,
    undoSticker,
    resetCustomize,
    caption,
    setCaption,
    showDate,
    toggleDate,
    setStep,
    stickerHistory,
  } = useSession();
  const [tab, setTab] = useState<Tab>("filter");

  return (
    <Shell
      title="Kustomisasi & Hiaskan Foto"
      subtitle="Tambahkan filter aesthetic, stiker lucu, dan caption tulisan"
      progress={88}
      onBack={() => setStep("frame")}
      footer={
        <Button
          className="w-full py-3.5 text-base"
          onClick={() => setStep("export")}
          icon={<ArrowRight size={18} />}
        >
          Lanjut ke Pratinjau & Unduh
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Interactive Collage Preview */}
        <div className="relative">
          <CollagePreview interactive />
          <p className="mt-2 text-center text-[11px] font-semibold text-purple-900/60">
            👉 Ketuk stiker untuk menambah, lalu <strong>geser langsung di gambar</strong> untuk mengatur posisinya!
          </p>
        </div>

        {/* Mascot Info */}
        <div className="rounded-3xl glass-card p-4">
          <CuteMascot expression="love" speech="Hias foto kamu sesuka hati! ✨" />
        </div>

        {/* Tab Selectors */}
        <div className="flex gap-2">
          {(
            [
              ["filter", "🎨 Filter Tone"],
              ["sticker", "🧸 Stiker Gemoy"],
              ["text", "✍️ Caption Teks"],
            ] as const
          ).map(([id, label]) => (
            <Chip key={id} active={tab === id} onClick={() => setTab(id)}>
              {label}
            </Chip>
          ))}
        </div>

        {/* Filter Tab */}
        {tab === "filter" ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl glass-card p-4 space-y-2.5"
          >
            <p className="text-xs font-bold text-purple-950">Pilih Filter Warna:</p>
            <div className="flex flex-wrap gap-2">
              {filters.map((item) => (
                <Chip
                  key={item.id}
                  active={filter === item.id}
                  onClick={() => {
                    setFilter(item.id);
                    track("filter_used", { filter: item.id });
                  }}
                >
                  {item.name}
                </Chip>
              ))}
            </div>
          </motion.div>
        ) : null}

        {/* Sticker Tab */}
        {tab === "sticker" ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl glass-card p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-purple-950">Ketuk emoji untuk menempel stiker:</p>
              <span className="text-[11px] text-purple-800/60 font-semibold">{stickerHistory.length} stiker terpasang</span>
            </div>

            <div className="mt-3 grid grid-cols-6 gap-2.5 sm:grid-cols-8">
              {stickerCatalog.map((emoji) => (
                <motion.button
                  key={emoji}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.85 }}
                  type="button"
                  className="grid size-11 place-items-center rounded-2xl bg-white/90 text-2xl shadow-xs border border-purple-100 hover:bg-white"
                  onClick={() =>
                    addSticker({
                      id: crypto.randomUUID(),
                      emoji,
                      x: 0.5,
                      y: 0.5,
                      scale: 1,
                      rotation: 0,
                    })
                  }
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : null}

        {/* Text Tab */}
        {tab === "text" ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl glass-card p-4 space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-purple-950">
                Tulisan Caption Bingkai:
              </label>
              <input
                value={caption}
                maxLength={48}
                placeholder="mis. Date Night 💕 / Wisuda 2026 🎓 / Photobooth Gemoy"
                onChange={(event) => setCaption(event.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-purple-200 bg-white/90 px-4 py-3 text-sm font-medium text-purple-950 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <label className="flex items-center gap-2.5 text-xs font-bold text-purple-950 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showDate}
                onChange={toggleDate}
                className="size-4 rounded-md accent-purple-600 cursor-pointer"
              />
              Tampilkan tanggal otomatis di bagian bawah bingkai 📅
            </label>
          </motion.div>
        ) : null}

        {/* Undo & Reset Controls */}
        <div className="flex gap-2.5">
          <Button
            variant="secondary"
            className="flex-1 py-3 text-xs"
            icon={<Undo2 size={16} />}
            disabled={!stickerHistory.length}
            onClick={undoSticker}
          >
            Undo Stiker ({stickerHistory.length})
          </Button>
          <Button
            variant="ghost"
            className="flex-1 py-3 text-xs"
            icon={<RotateCcw size={16} />}
            onClick={resetCustomize}
          >
            Reset Semua Hiasan
          </Button>
        </div>
      </div>
    </Shell>
  );
}

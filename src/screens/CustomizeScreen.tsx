import { CollagePreview } from "@/components/CollagePreview";
import { CuteMascot } from "@/components/CuteMascot";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { filters, stickerCatalog } from "@/data/filters";
import { track } from "@/lib/analytics";
import { MOFUSAND_STICKERS } from "@/lib/mofusand";
import { useSession } from "@/store/session";
import { motion } from "framer-motion";
import { ArrowRight, Minus, Plus, RotateCcw, Trash2, Undo2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Tab = "filter" | "sticker" | "text";

const MIN_SCALE = 0.2;
const MAX_SCALE = 2.5;
const SCALE_STEP = 0.1;

export function CustomizeScreen() {
  const {
    filter,
    setFilter,
    stickers,
    addSticker,
    updateSticker,
    removeSticker,
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
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

  const selected = useMemo(
    () => stickers.find((item) => item.id === selectedStickerId) ?? null,
    [stickers, selectedStickerId],
  );

  useEffect(() => {
    if (selectedStickerId && !stickers.some((item) => item.id === selectedStickerId)) {
      setSelectedStickerId(null);
    }
  }, [stickers, selectedStickerId]);

  function setScale(next: number): void {
    if (!selected) return;
    const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round(next * 10) / 10));
    updateSticker(selected.id, { scale });
  }

  function placeEmoji(emoji: string): void {
    const id = crypto.randomUUID();
    addSticker({
      id,
      emoji,
      x: 0.35 + Math.random() * 0.3,
      y: 0.3 + Math.random() * 0.4,
      scale: 1,
      rotation: 0,
    });
    setSelectedStickerId(id);
  }

  function placeMofusand(mofusandId: number): void {
    const id = crypto.randomUUID();
    addSticker({
      id,
      emoji: "",
      mofusandId,
      x: 0.35 + Math.random() * 0.3,
      y: 0.3 + Math.random() * 0.4,
      scale: 1.2,
      rotation: 0,
    });
    setSelectedStickerId(id);
  }

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
        <div className="relative">
          <CollagePreview
            interactive
            selectedStickerId={selectedStickerId}
            onSelectSticker={(id) => {
              setSelectedStickerId(id);
              if (id) setTab("sticker");
            }}
          />
          <p className="mt-2 text-center text-[11px] font-semibold text-purple-900/60">
            Ketuk stiker di foto untuk memilih, lalu atur ukuran di bawah.
          </p>
        </div>

        {selected ? (
          <div className="space-y-3 rounded-3xl glass-card p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-xs font-bold text-purple-950">
                {selected.mofusandId ? (
                  <img
                    src={`/frames/mofusand/mofusand_${selected.mofusandId}.png`}
                    alt=""
                    className="size-8 rounded-lg bg-[#1a1a1a] object-contain p-0.5"
                  />
                ) : (
                  <span className="text-2xl leading-none">{selected.emoji}</span>
                )}
                Ukuran stiker
              </p>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700"
                onClick={() => {
                  removeSticker(selected.id);
                  setSelectedStickerId(null);
                }}
              >
                <Trash2 size={12} /> Hapus
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Perkecil"
                className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white text-purple-800 shadow-sm ring-1 ring-purple-100 disabled:opacity-40"
                onClick={() => setScale(selected.scale - SCALE_STEP)}
                disabled={selected.scale <= MIN_SCALE}
              >
                <Minus size={16} />
              </button>
              <input
                type="range"
                min={MIN_SCALE}
                max={MAX_SCALE}
                step={SCALE_STEP}
                value={selected.scale}
                onChange={(event) => setScale(Number(event.target.value))}
                className="h-2 w-full cursor-pointer accent-violet-600"
                aria-label="Slider ukuran stiker"
              />
              <button
                type="button"
                aria-label="Perbesar"
                className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white text-purple-800 shadow-sm ring-1 ring-purple-100 disabled:opacity-40"
                onClick={() => setScale(selected.scale + SCALE_STEP)}
                disabled={selected.scale >= MAX_SCALE}
              >
                <Plus size={16} />
              </button>
              <span className="w-12 shrink-0 text-center text-xs font-bold text-purple-800">
                {Math.round(selected.scale * 100)}%
              </span>
            </div>
          </div>
        ) : null}

        <div className="rounded-3xl glass-card p-4">
          <CuteMascot expression="love" speech="Hias foto kamu sesuka hati! ✨" />
        </div>

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

        {tab === "filter" ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2.5 rounded-3xl glass-card p-4"
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

        {tab === "sticker" ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5 rounded-3xl glass-card p-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-purple-950">Mofusand</p>
                <span className="text-[11px] font-semibold text-purple-800/60">
                  {stickers.length} stiker
                </span>
              </div>
              <p className="mt-0.5 text-[11px] font-medium text-purple-800/55">
                Ketuk karakter untuk menempel di foto
              </p>
              <div className="mt-3 grid grid-cols-4 gap-2.5 sm:grid-cols-6">
                {MOFUSAND_STICKERS.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    aria-label={`Tempel Mofusand ${item.id}`}
                    className="grid aspect-square place-items-center overflow-hidden rounded-2xl border border-purple-100 bg-[#1c1c1e] p-1 shadow-xs hover:border-violet-300 hover:ring-2 hover:ring-violet-200"
                    onClick={() => placeMofusand(item.id)}
                  >
                    <img
                      src={item.src}
                      alt=""
                      className="max-h-full max-w-full object-contain"
                      draggable={false}
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-purple-950">Emoji</p>
              <div className="mt-3 grid grid-cols-6 gap-2.5 sm:grid-cols-8">
                {stickerCatalog.map((emoji) => (
                  <motion.button
                    key={emoji}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.85 }}
                    type="button"
                    className="grid size-11 place-items-center rounded-2xl border border-purple-100 bg-white/90 text-2xl shadow-xs hover:bg-white"
                    onClick={() => placeEmoji(emoji)}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}

        {tab === "text" ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 rounded-3xl glass-card p-4"
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

            <label className="flex cursor-pointer select-none items-center gap-2.5 text-xs font-bold text-purple-950">
              <input
                type="checkbox"
                checked={showDate}
                onChange={toggleDate}
                className="size-4 cursor-pointer rounded-md accent-purple-600"
              />
              Tampilkan tanggal otomatis di bagian bawah bingkai 📅
            </label>
          </motion.div>
        ) : null}

        <div className="flex gap-2.5">
          <Button
            variant="secondary"
            className="flex-1 py-3 text-xs"
            icon={<Undo2 size={16} />}
            disabled={!stickerHistory.length}
            onClick={() => {
              undoSticker();
              setSelectedStickerId(null);
            }}
          >
            Undo Stiker ({stickerHistory.length})
          </Button>
          <Button
            variant="ghost"
            className="flex-1 py-3 text-xs"
            icon={<RotateCcw size={16} />}
            onClick={() => {
              resetCustomize();
              setSelectedStickerId(null);
            }}
          >
            Reset Semua Hiasan
          </Button>
        </div>
      </div>
    </Shell>
  );
}

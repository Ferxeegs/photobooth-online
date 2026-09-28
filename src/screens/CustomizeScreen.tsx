import { CollagePreview } from "@/components/CollagePreview";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { filters, stickerCatalog } from "@/data/filters";
import { track } from "@/lib/analytics";
import { useSession } from "@/store/session";
import { RotateCcw, Undo2 } from "lucide-react";
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
      title="Kustomisasi"
      subtitle="Filter, stiker, dan teks ringan"
      progress={88}
      onBack={() => setStep("frame")}
      footer={
        <Button className="w-full" onClick={() => setStep("export")}>
          Pratinjau akhir
        </Button>
      }
    >
      <CollagePreview interactive />
      <div className="mt-4 flex gap-2">
        {(
          [
            ["filter", "Filter"],
            ["sticker", "Stiker"],
            ["text", "Teks"],
          ] as const
        ).map(([id, label]) => (
          <Chip key={id} active={tab === id} onClick={() => setTab(id)}>
            {label}
          </Chip>
        ))}
      </div>

      {tab === "filter" ? (
        <div className="mt-3 flex flex-wrap gap-2">
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
      ) : null}

      {tab === "sticker" ? (
        <div className="mt-3">
          <p className="text-xs text-ink-soft">Ketuk untuk menambah, geser di pratinjau.</p>
          <div className="mt-2 grid grid-cols-8 gap-2">
            {stickerCatalog.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="grid size-10 place-items-center rounded-xl bg-white/80 text-xl"
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
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "text" ? (
        <div className="mt-3 space-y-3">
          <label className="block text-sm">
            Caption
            <input
              value={caption}
              maxLength={48}
              placeholder="mis. date night / wisuda"
              onChange={(event) => setCaption(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-blush/60 bg-white/80 px-4 py-3"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={showDate} onChange={toggleDate} />
            Tampilkan tanggal otomatis
          </label>
        </div>
      ) : null}

      <div className="mt-4 flex gap-2">
        <Button
          variant="secondary"
          className="flex-1"
          icon={<Undo2 size={16} />}
          disabled={!stickerHistory.length}
          onClick={undoSticker}
        >
          Undo
        </Button>
        <Button
          variant="ghost"
          className="flex-1"
          icon={<RotateCcw size={16} />}
          onClick={resetCustomize}
        >
          Reset
        </Button>
      </div>
    </Shell>
  );
}

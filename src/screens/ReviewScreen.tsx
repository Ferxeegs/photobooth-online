import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/Button";
import { getLayout } from "@/data/layouts";
import { track } from "@/lib/analytics";
import { useSession } from "@/store/session";
import { RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export function ReviewScreen() {
  const {
    photos,
    layoutId,
    setStep,
    setRetakeIndex,
    movePhoto,
    updatePhoto,
    setPhotos,
  } = useSession();
  const layout = getLayout(layoutId);

  return (
    <Shell
      title="Review foto"
      subtitle="Ulangi, geser, atau atur wajah di dalam slot"
      progress={60}
      onBack={() => setStep("capture")}
      footer={
        <Button className="w-full" onClick={() => setStep("frame")}>
          Pilih bingkai
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        {photos.map((photo, index) => (
          <article key={photo.id} className="overflow-hidden rounded-2xl bg-white/80 p-2 shadow-sm">
            <div className="relative overflow-hidden rounded-xl bg-black">
              <img
                src={photo.src}
                alt={`Foto ${index + 1}`}
                className="aspect-[4/3] w-full object-cover"
                style={{
                  objectPosition: `${photo.offsetX * 100}% ${photo.offsetY * 100}%`,
                  transform: `scale(${photo.zoom})`,
                }}
              />
            </div>
            <p className="mt-2 text-center text-xs font-medium">Foto {index + 1}</p>
            <div className="mt-2 flex justify-center gap-1">
              <IconBtn
                label="Geser kiri"
                disabled={index === 0}
                onClick={() => movePhoto(index, index - 1)}
              >
                <ChevronLeft size={16} />
              </IconBtn>
              <IconBtn
                label="Geser kanan"
                disabled={index === photos.length - 1}
                onClick={() => movePhoto(index, index + 1)}
              >
                <ChevronRight size={16} />
              </IconBtn>
            </div>
            <label className="mt-2 block text-[11px] text-ink-soft">
              Zoom
              <input
                type="range"
                min={1}
                max={2}
                step={0.05}
                value={photo.zoom}
                className="w-full"
                onChange={(event) =>
                  updatePhoto(index, { zoom: Number(event.target.value) })
                }
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-[11px] text-ink-soft">
                Horizontal
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={photo.offsetX}
                  className="w-full"
                  onChange={(event) =>
                    updatePhoto(index, { offsetX: Number(event.target.value) })
                  }
                />
              </label>
              <label className="text-[11px] text-ink-soft">
                Vertikal
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={photo.offsetY}
                  className="w-full"
                  onChange={(event) =>
                    updatePhoto(index, { offsetY: Number(event.target.value) })
                  }
                />
              </label>
            </div>
            <button
              type="button"
              className="mt-2 w-full rounded-xl bg-blush/60 py-2 text-xs font-semibold"
              onClick={() => {
                track("retake_count", { index });
                setRetakeIndex(index);
                setStep("capture");
              }}
            >
              Ulangi foto ini
            </button>
          </article>
        ))}
      </div>
      <Button
        className="mt-4 w-full"
        variant="secondary"
        icon={<RotateCcw size={16} />}
        onClick={() => {
          track("retake_count", { all: true });
          setPhotos([]);
          setRetakeIndex(null);
          setStep("capture");
        }}
      >
        Ulangi semua foto
      </Button>
      <p className="mt-2 text-center text-xs text-ink-soft">
        Layout {layout.name} · {photos.length}/{layout.photoCount}
      </p>
    </Shell>
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
  label,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-8 place-items-center rounded-full bg-cream disabled:opacity-40"
    >
      {children}
    </button>
  );
}

import { CuteMascot } from "@/components/CuteMascot";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/Button";
import { getLayout } from "@/data/layouts";
import { track } from "@/lib/analytics";
import { useSession } from "@/store/session";
import { motion } from "framer-motion";
import { RotateCcw, ChevronLeft, ChevronRight, ArrowRight, MoveHorizontal, MoveVertical, ZoomIn } from "lucide-react";
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
      title="Review & Atur Posisi Foto"
      subtitle="Geser urutan, sesuaikan zoom, atau ulangi foto yang kurang pas"
      progress={60}
      onBack={() => setStep("capture")}
      footer={
        <Button
          className="w-full py-3.5 text-base"
          onClick={() => setStep("frame")}
          icon={<ArrowRight size={18} />}
        >
          Lanjut ke Pilih Bingkai
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Mascot Header */}
        <div className="rounded-3xl glass-card p-4">
          <CuteMascot expression="love" speech="Foto-fotomu manis banget! Atur posisinya ya ✨" />
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {photos.map((photo, index) => (
            <motion.article
              key={photo.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="relative overflow-hidden rounded-3xl glass-card p-3.5 shadow-md border border-white/80"
            >
              {/* Cute Tape Accent */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-amber-200/60 rotate-2 backdrop-blur-xs rounded-sm shadow-2xs z-10 pointer-events-none" />

              <div className="relative overflow-hidden rounded-2xl bg-slate-950 aspect-[4/3]">
                <img
                  src={photo.src}
                  alt={`Foto ${index + 1}`}
                  className="h-full w-full object-cover transition-transform"
                  style={{
                    objectPosition: `${photo.offsetX * 100}% ${photo.offsetY * 100}%`,
                    transform: `scale(${photo.zoom})`,
                  }}
                />
                <span className="absolute top-2 left-2 rounded-full bg-slate-950/70 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
                  Foto {index + 1}
                </span>
              </div>

              {/* Controls */}
              <div className="mt-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-950">Urutan Foto:</span>
                  <div className="flex gap-1.5">
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
                </div>

                <div className="space-y-1.5 rounded-2xl bg-purple-100/50 p-2.5 text-[11px] font-semibold text-purple-950">
                  <label className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1"><ZoomIn size={13} /> Zoom:</span>
                    <input
                      type="range"
                      min={1}
                      max={2}
                      step={0.05}
                      value={photo.zoom}
                      className="w-28 accent-purple-600 cursor-pointer"
                      onChange={(event) =>
                        updatePhoto(index, { zoom: Number(event.target.value) })
                      }
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-purple-200/50">
                    <label className="flex items-center justify-between gap-1">
                      <span className="flex items-center gap-0.5"><MoveHorizontal size={12} /> H:</span>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={photo.offsetX}
                        className="w-16 accent-purple-600 cursor-pointer"
                        onChange={(event) =>
                          updatePhoto(index, { offsetX: Number(event.target.value) })
                        }
                      />
                    </label>
                    <label className="flex items-center justify-between gap-1">
                      <span className="flex items-center gap-0.5"><MoveVertical size={12} /> V:</span>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={photo.offsetY}
                        className="w-16 accent-purple-600 cursor-pointer"
                        onChange={(event) =>
                          updatePhoto(index, { offsetY: Number(event.target.value) })
                        }
                      />
                    </label>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  className="w-full py-2 text-xs"
                  onClick={() => {
                    track("retake_count", { index });
                    setRetakeIndex(index);
                    setStep("capture");
                  }}
                >
                  📸 Ulangi Foto {index + 1} Saja
                </Button>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-2 space-y-2">
          <Button
            className="w-full py-3 text-sm"
            variant="ghost"
            icon={<RotateCcw size={16} />}
            onClick={() => {
              track("retake_count", { all: true });
              setPhotos([]);
              setRetakeIndex(null);
              setStep("capture");
            }}
          >
            Ulangi Semua Jepretan Foto
          </Button>
          <p className="text-center text-xs font-medium text-purple-900/60">
            Layout {layout.name} · Total {photos.length} dari {layout.photoCount} foto terisi
          </p>
        </div>
      </div>
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
    <motion.button
      whileHover={disabled ? {} : { scale: 1.1 }}
      whileTap={disabled ? {} : { scale: 0.9 }}
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-8 place-items-center rounded-full bg-white font-bold text-purple-950 shadow-xs border border-purple-200 disabled:opacity-30 disabled:shadow-none"
    >
      {children}
    </motion.button>
  );
}

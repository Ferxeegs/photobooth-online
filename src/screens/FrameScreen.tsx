import { CollagePreview } from "@/components/CollagePreview";
import { CuteMascot } from "@/components/CuteMascot";
import { FrameSwatch } from "@/components/FrameSwatch";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { bgPalettes, frames, themeLabels } from "@/data/frames";
import { track } from "@/lib/analytics";
import { useSession } from "@/store/session";
import type { ThemeId } from "@/types";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const themes: ThemeId[] = ["cute", "romantic", "cool"];

export function FrameScreen() {
  const { frameId, setFrame, background, setBackground, setStep } = useSession();
  const current = frames.find((item) => item.id === frameId) ?? frames[0];
  const [theme, setTheme] = useState<ThemeId>(current?.theme ?? "cute");
  if (!current) return null;
  const visible = frames.filter((item) => item.theme === theme);

  return (
    <Shell
      title="Pilih Bingkai Foto"
      subtitle="Bingkai akan disesuaikan dengan foto aslimu secara langsung"
      progress={75}
      onBack={() => setStep("review")}
      dark={theme === "cool"}
      footer={
        <Button
          className="w-full py-3.5 text-base"
          onClick={() => {
            track("frame_selected", { id: frameId, theme });
            setStep("customize");
          }}
          icon={<ArrowRight size={18} />}
        >
          Lanjut ke Kustomisasi (Stiker & Filter)
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Live Collage Preview */}
        <div className="relative">
          <CollagePreview />
        </div>

        {/* Mascot Advice */}
        <div className={`rounded-3xl p-4 ${theme === "cool" ? "bg-slate-900 border border-slate-800" : "glass-card"}`}>
          <CuteMascot expression="excited" speech={`Bingkai ${current.name} pas banget!`} />
        </div>

        {/* Theme Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {themes.map((id) => (
            <Chip key={id} active={theme === id} onClick={() => setTheme(id)}>
              {id === "cute" ? "🧸" : id === "romantic" ? "💕" : "😎"} {themeLabels[id]}
            </Chip>
          ))}
        </div>

        {/* Frame Cards Grid */}
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
          {visible.map((frame) => (
            <button
              key={frame.id}
              type="button"
              onClick={() => setFrame(frame.id, frame.bg)}
              aria-pressed={frame.id === frameId}
              className="text-left outline-none"
            >
              <FrameSwatch frameId={frame.id} selected={frame.id === frameId} />
            </button>
          ))}
        </div>

        {/* Color Palette Switcher */}
        <div className={`rounded-3xl p-4 space-y-2.5 ${theme === "cool" ? "bg-slate-900 border border-slate-800" : "glass-card"}`}>
          <p className="text-xs font-bold tracking-wide">🎨 Ubah Warna Latar Bingkai:</p>
          <div className="flex flex-wrap gap-2.5">
            {(bgPalettes[theme] ?? []).concat(current.palette).filter(unique).map((color) => (
              <motion.button
                key={color}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                aria-label={`Warna ${color}`}
                onClick={() => setBackground(color)}
                className={`size-9 rounded-full border-2 transition-all shadow-xs ${
                  background === color ? "border-purple-600 scale-110 ring-2 ring-purple-300" : "border-white"
                }`}
                style={{ background: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function unique(color: string, index: number, list: string[]): boolean {
  return list.indexOf(color) === index;
}

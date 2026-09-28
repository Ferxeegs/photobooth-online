import { CollagePreview } from "@/components/CollagePreview";
import { FrameSwatch } from "@/components/FrameSwatch";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { bgPalettes, frames, themeLabels } from "@/data/frames";
import { track } from "@/lib/analytics";
import { useSession } from "@/store/session";
import type { ThemeId } from "@/types";
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
      title="Pilih bingkai"
      subtitle="Pratinjau memakai fotomu yang asli"
      progress={75}
      onBack={() => setStep("review")}
      dark={theme === "cool"}
      footer={
        <Button
          className="w-full"
          onClick={() => {
            track("frame_selected", { id: frameId, theme });
            setStep("customize");
          }}
        >
          Kustomisasi
        </Button>
      }
    >
      <CollagePreview />
      <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
        {themes.map((id) => (
          <Chip key={id} active={theme === id} onClick={() => setTheme(id)}>
            {id === "cute" ? "🧸" : id === "romantic" ? "💕" : "😎"} {themeLabels[id]}
          </Chip>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {visible.map((frame) => (
          <button
            key={frame.id}
            type="button"
            onClick={() => setFrame(frame.id, frame.bg)}
            aria-pressed={frame.id === frameId}
          >
            <FrameSwatch frameId={frame.id} selected={frame.id === frameId} />
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm font-medium">Warna latar</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {(bgPalettes[theme] ?? []).concat(current.palette).filter(unique).map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`Warna ${color}`}
            onClick={() => setBackground(color)}
            className={`size-9 rounded-full border-2 ${
              background === color ? "border-ink scale-110" : "border-white"
            }`}
            style={{ background: color }}
          />
        ))}
      </div>
    </Shell>
  );
}

function unique(color: string, index: number, list: string[]): boolean {
  return list.indexOf(color) === index;
}

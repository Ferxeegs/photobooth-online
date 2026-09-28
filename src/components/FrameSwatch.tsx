import { frames, themeLabels } from "@/data/frames";
import type { ThemeId } from "@/types";
import { useMemo } from "react";

export function FrameSwatch({
  frameId,
  selected,
}: {
  frameId: string;
  selected: boolean;
}) {
  const frame = useMemo(
    () => frames.find((item) => item.id === frameId),
    [frameId],
  );
  if (!frame) return null;
  return (
    <div
      className={`overflow-hidden rounded-2xl border-2 transition ${
        selected ? "border-heart shadow-lg" : "border-transparent"
      }`}
    >
      <div
        className="flex h-28 items-end justify-center p-2"
        style={{ background: frame.bg }}
      >
        <div
          className="h-16 w-12 rounded-md shadow-sm"
          style={{ background: frame.accent }}
        />
      </div>
      <div className="bg-white px-2 py-2">
        <p className="truncate font-display text-sm">{frame.name}</p>
        <p className="text-[11px] text-ink-soft">{themeLabels[frame.theme as ThemeId]}</p>
      </div>
    </div>
  );
}

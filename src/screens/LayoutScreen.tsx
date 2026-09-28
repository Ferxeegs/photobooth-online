import { LayoutThumb } from "@/components/LayoutThumb";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/Button";
import { layouts } from "@/data/layouts";
import { track } from "@/lib/analytics";
import { useSession } from "@/store/session";

export function LayoutScreen() {
  const { layoutId, setLayout, setStep } = useSession();
  const selected = layouts.find((item) => item.id === layoutId) ?? layouts[0];
  if (!selected) return null;

  return (
    <Shell
      title="Pilih layout"
      subtitle="Jumlah foto mengikuti layout yang kamu pilih"
      progress={30}
      onBack={() => setStep("permission")}
      footer={
        <Button
          className="w-full"
          onClick={() => {
            track("layout_selected", { layout: selected.id });
            setStep("capture");
          }}
        >
          Lanjut · {selected.photoCount} foto
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {layouts.map((layout) => (
          <button
            key={layout.id}
            type="button"
            onClick={() => setLayout(layout.id)}
            aria-pressed={layout.id === layoutId}
          >
            <LayoutThumb layout={layout} selected={layout.id === layoutId} />
          </button>
        ))}
      </div>
      <p className="mt-4 text-center text-sm text-ink-soft">{selected.description}</p>
    </Shell>
  );
}

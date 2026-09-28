import { CuteMascot } from "@/components/CuteMascot";
import { LayoutThumb } from "@/components/LayoutThumb";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/Button";
import { layouts } from "@/data/layouts";
import { track } from "@/lib/analytics";
import { useSession } from "@/store/session";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function LayoutScreen() {
  const { layoutId, setLayout, setStep } = useSession();
  const selected = layouts.find((item) => item.id === layoutId) ?? layouts[0];
  if (!selected) return null;

  return (
    <Shell
      title="Pilih Layout Foto"
      subtitle="Jumlah foto & ukuran bingkai akan mengikuti layout yang kamu pilih"
      progress={30}
      onBack={() => setStep("permission")}
      footer={
        <Button
          className="w-full text-base py-3.5"
          onClick={() => {
            track("layout_selected", { layout: selected.id });
            setStep("capture");
          }}
          icon={<ArrowRight size={18} />}
        >
          Lanjut ke Foto · {selected.photoCount} Jepretan
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Mascot Banner */}
        <div className="flex items-center justify-between rounded-3xl glass-card p-4">
          <CuteMascot expression="happy" speech={`Layout ${selected.name} dipilih! (${selected.photoCount} foto)`} />
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          {layouts.map((layout) => (
            <button
              key={layout.id}
              type="button"
              onClick={() => setLayout(layout.id)}
              aria-pressed={layout.id === layoutId}
              className="text-left outline-none"
            >
              <LayoutThumb layout={layout} selected={layout.id === layoutId} />
            </button>
          ))}
        </div>

        {/* Description Banner */}
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-purple-200/60 bg-white/70 p-3.5 text-center text-xs text-purple-900/80 shadow-xs"
        >
          💡 <strong>Info Layout:</strong> {selected.description}
        </motion.div>
      </div>
    </Shell>
  );
}

import { Button } from "@/components/ui/Button";
import { layouts } from "@/data/layouts";
import { track } from "@/lib/analytics";
import { useSession } from "@/store/session";
import { motion } from "framer-motion";
import { Camera, Heart, ShieldCheck } from "lucide-react";

const samples = [
  { name: "Strip couple", colors: ["#DDD6FE", "#C4B5FD", "#A78BFA", "#EDE9FE"] },
  { name: "Grid ungu", colors: ["#7C3AED", "#A78BFA", "#C4B5FD", "#5B21B6"] },
  { name: "Neon night", colors: ["#1A1024", "#8B5CF6", "#3DF0FF", "#111111"] },
];

export function LandingScreen() {
  const setStep = useSession((s) => s.setStep);

  return (
    <div className="bg-app min-h-dvh">
      <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-5 pb-10 pt-8">
        <header className="flex items-center justify-between">
          <p className="font-display text-2xl text-heart">Snapie</p>
          <button
            type="button"
            className="text-sm font-medium text-ink-soft underline-offset-4 hover:underline"
            onClick={() => setStep("privacy")}
          >
            Privasi
          </button>
        </header>

        <section className="mt-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-heart"
          >
            <Heart size={12} fill="currentColor" /> photobooth online
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-4 font-display text-4xl leading-tight sm:text-5xl"
          >
            Jepret. Bingkai.
            <span className="block text-heart">Bagikan.</span>
          </motion.h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft sm:text-base">
            Foto strip instan di browser. Lucu, romantis, atau keren — tanpa
            instal, tanpa akun, dan fotomu tidak pernah diunggah.
          </p>
          <div className="mt-6 flex justify-center">
            <Button
              className="min-w-52 text-lg"
              icon={<Camera size={20} />}
              onClick={() => {
                track("start_click");
                setStep("permission");
              }}
            >
              Mulai Foto
            </Button>
          </div>
        </section>

        <section className="mt-10" aria-label="Contoh hasil">
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {samples.map((sample, index) => (
              <motion.article
                key={sample.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="w-36 shrink-0 rounded-3xl bg-white/80 p-3 shadow-md"
              >
                <div className="flex flex-col gap-2">
                  {sample.colors.map((color) => (
                    <div
                      key={color}
                      className="h-16 rounded-xl"
                      style={{ background: color }}
                    />
                  ))}
                </div>
                <p className="mt-2 text-center font-display text-sm">{sample.name}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            { n: "1", t: "Pilih layout", d: "Strip, grid, polaroid — jumlah foto mengikuti layout." },
            { n: "2", t: "Jepret berurutan", d: "Hitung mundur lucu, lalu foto otomatis per slot." },
            { n: "3", t: "Bingkai & unduh", d: "Pilih tema, pratinjau langsung, unduh PNG/JPG." },
          ].map((step) => (
            <div key={step.n} className="rounded-3xl bg-white/70 p-4">
              <p className="font-display text-3xl text-heart">{step.n}</p>
              <p className="mt-1 font-display text-lg">{step.t}</p>
              <p className="mt-1 text-sm text-ink-soft">{step.d}</p>
            </div>
          ))}
        </section>

        <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-ink-soft">
          <ShieldCheck size={14} /> Fotomu tidak diunggah. Diproses 100% di perangkatmu.
        </p>
        <p className="mt-2 text-center text-xs text-ink-soft">
          {layouts.length} layout · 15 bingkai · siap dibagikan
        </p>
      </div>
    </div>
  );
}

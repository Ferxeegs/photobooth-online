import { CuteMascot } from "@/components/CuteMascot";
import { FloatingParticles } from "@/components/FloatingParticles";
import { Button } from "@/components/ui/Button";
import { layouts } from "@/data/layouts";
import { track } from "@/lib/analytics";
import { useSession } from "@/store/session";
import { motion } from "framer-motion";
import { Camera, Heart, Sparkles, ShieldCheck, Wand2, Frame, Download } from "lucide-react";

const samples = [
  { name: "Cute Strip", theme: "Strip 4 Slot", tag: "Populer 🔥", colors: ["#F472B6", "#DDD6FE", "#C4B5FD", "#FCE7F3"] },
  { name: "Grid Pastel", theme: "Grid 4 Box", tag: "Aesthetic ✨", colors: ["#7C3AED", "#A78BFA", "#C4B5FD", "#F3E8FF"] },
  { name: "Neon Night", theme: "Vintage 3", tag: "Keren 😎", colors: ["#1E1B4B", "#8B5CF6", "#EC4899", "#38BDF8"] },
];

export function LandingScreen() {
  const setStep = useSession((s) => s.setStep);

  return (
    <div className="relative min-h-dvh bg-app text-purple-950 overflow-hidden">
      <FloatingParticles count={16} />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-4xl flex-col px-5 pb-12 pt-6 sm:px-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="flex size-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-pink-500 text-white font-black text-lg shadow-md">
              S
            </span>
            <span className="font-display text-2xl font-bold tracking-tight text-gradient-purple">
              Snapie
            </span>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="rounded-full bg-white/80 px-4 py-1.5 text-xs font-semibold text-purple-900 shadow-xs border border-purple-100 hover:bg-white"
            onClick={() => setStep("privacy")}
          >
            🔒 Privasi 100% Aman
          </motion.button>
        </header>

        {/* Hero Section */}
        <section className="mt-8 text-center sm:mt-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-white/80 px-4 py-1.5 text-xs font-bold text-violet-700 shadow-xs backdrop-blur-md"
          >
            <Heart size={14} className="fill-pink-500 text-pink-500 animate-pulse" />
            <span>Photobooth Online Instan & Gratis</span>
            <Sparkles size={14} className="text-amber-400" />
          </motion.div>

          {/* Mascot Header */}
          <div className="mt-6 flex justify-center">
            <CuteMascot expression="excited" speech="Yuk jepret foto strip lucu & aesthetic bareng! 📸✨" />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 font-display text-4xl font-extrabold leading-tight text-slate-900 sm:text-6xl"
          >
            Jepret. Bingkai. <br className="hidden sm:inline" />
            <span className="text-gradient-purple">Abadikan Momen.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-purple-900/70 sm:text-base"
          >
            Buat foto strip gemoy & estetik langsung dari browsermu. Gratis, tanpa aplikasi, tanpa daftar akun, dan fotomu <strong>tidak pernah diunggah ke server</strong>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex justify-center"
          >
            <Button
              variant="primary"
              className="min-w-60 text-lg py-4 animate-pulse-glow"
              icon={<Camera size={22} className="animate-bounce" />}
              onClick={() => {
                track("start_click");
                setStep("permission");
              }}
            >
              Mulai Foto Sekarang
            </Button>
          </motion.div>
        </section>

        {/* Sample Showcase */}
        <section className="mt-12" aria-label="Contoh hasil foto strip">
          <div className="flex items-center justify-between px-1">
            <p className="font-display text-lg font-bold text-purple-950 flex items-center gap-1.5">
              <span>🎨</span> Pilihan Layout & Bingkai Viral
            </p>
            <span className="text-xs text-purple-700/70">Geser untuk lihat &rarr;</span>
          </div>

          <div className="mt-3 flex gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar">
            {samples.map((sample, index) => (
              <motion.article
                key={sample.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.25 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="w-44 shrink-0 rounded-3xl glass-card p-3.5 shadow-md relative"
              >
                <span className="absolute -top-2 -right-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                  {sample.tag}
                </span>

                <div className="flex flex-col gap-2 rounded-2xl bg-slate-950/5 p-2 border border-white/60">
                  {sample.colors.map((color, i) => (
                    <div
                      key={`${sample.name}-${i}`}
                      className="h-14 w-full rounded-xl shadow-xs transition-transform hover:scale-[1.02]"
                      style={{ background: color }}
                    />
                  ))}
                </div>

                <div className="mt-2.5 text-center">
                  <p className="font-display text-sm font-bold text-purple-950">{sample.name}</p>
                  <p className="text-[11px] text-purple-700/60">{sample.theme}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* 3 Step Process Cards */}
        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              n: "1",
              icon: <Frame size={20} className="text-violet-600" />,
              t: "Pilih Layout",
              d: "Tersedia format Strip 4, Grid, Wide, dan Polaroid cute.",
            },
            {
              n: "2",
              icon: <Wand2 size={20} className="text-pink-500" />,
              t: "Jepret & Hias",
              d: "Hitung mundur otomatis, filter vintage, & stiker emoji gemes.",
            },
            {
              n: "3",
              icon: <Download size={20} className="text-purple-600" />,
              t: "Unduh HD",
              d: "Simpan dalam format PNG / JPG high quality atau cetak 4R.",
            },
          ].map((step, idx) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl glass-card p-5 glass-card-hover"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-3xl font-black text-gradient-purple">{step.n}</span>
                <div className="flex size-10 items-center justify-center rounded-2xl bg-purple-100/80 shadow-inner">
                  {step.icon}
                </div>
              </div>
              <p className="mt-3 font-display text-lg font-bold text-purple-950">{step.t}</p>
              <p className="mt-1 text-xs leading-relaxed text-purple-900/70">{step.d}</p>
            </motion.div>
          ))}
        </section>

        {/* Footer Badges */}
        <footer className="mt-12 border-t border-purple-200/50 pt-6 text-center">
          <p className="flex items-center justify-center gap-2 text-xs font-medium text-purple-900/70">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>Diproses 100% di browser-mu · Bebas Iklan · Tanpa Server Upload</span>
          </p>
          <p className="mt-2 text-xs text-purple-700/50">
            {layouts.length} pilihan layout · 15+ tema bingkai cute · Siap dipamerkan di Story! ✨
          </p>
        </footer>
      </div>
    </div>
  );
}

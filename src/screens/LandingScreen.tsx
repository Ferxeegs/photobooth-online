import { CuteMascot } from "@/components/CuteMascot";
import { Button } from "@/components/ui/Button";
import { frames } from "@/data/frames";
import { layouts } from "@/data/layouts";
import { track } from "@/lib/analytics";
import { useSession } from "@/store/session";
import { motion } from "framer-motion";
import { Camera, ShieldCheck } from "lucide-react";

const strips = [
  {
    name: "Violet Soft",
    bg: "#EDE9FE",
    accent: "#7C3AED",
    faces: ["😺", "✨", "🌸", "😸"],
    slots: ["#C4B5FD", "#A78BFA", "#8B5CF6", "#DDD6FE"],
  },
  {
    name: "Kitty Pop",
    bg: "#FFF0F5",
    accent: "#EC4899",
    faces: ["😻", "🎀", "💕", "🐱"],
    slots: ["#F9A8D4", "#F472B6", "#FBCFE8", "#FCE7F3"],
  },
  {
    name: "Neon Cute",
    bg: "#1A1030",
    accent: "#E9D5FF",
    faces: ["😎", "⭐", "🌙", "💫"],
    slots: ["#4C1D95", "#7C3AED", "#A78BFA", "#312E81"],
  },
];

const floaties = [
  { emoji: "✨", x: "8%", y: "18%", delay: 0 },
  { emoji: "💖", x: "88%", y: "22%", delay: 0.4 },
  { emoji: "🌸", x: "12%", y: "72%", delay: 0.8 },
  { emoji: "🐱", x: "90%", y: "68%", delay: 1.2 },
  { emoji: "⭐", x: "78%", y: "48%", delay: 0.2 },
  { emoji: "🫧", x: "5%", y: "42%", delay: 1 },
];

export function LandingScreen() {
  const setStep = useSession((s) => s.setStep);

  function start(): void {
    track("start_click");
    setStep("permission");
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-app text-ink">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-24 top-10 size-72 rounded-full bg-violet-400/30 blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, 14, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-16 top-32 size-80 rounded-full bg-pink-300/25 blur-3xl"
          animate={{ x: [0, -18, 0], y: [0, 22, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        {floaties.map((item) => (
          <motion.span
            key={`${item.emoji}-${item.x}`}
            className="absolute text-xl opacity-50 sm:text-2xl"
            style={{ left: item.x, top: item.y }}
            animate={{ y: [0, -12, 0], rotate: [0, 12, -8, 0], scale: [1, 1.12, 1] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: item.delay,
            }}
          >
            {item.emoji}
          </motion.span>
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-5 pb-10 pt-5 sm:px-8 sm:pt-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 text-sm shadow-md">
              📸
            </span>
            <p className="font-display text-xl font-extrabold tracking-tight text-heart">
              Snapie
            </p>
          </div>
          <button
            type="button"
            className="rounded-full bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-ink-soft shadow-sm transition hover:text-heart"
            onClick={() => setStep("privacy")}
          >
            🔒 Privasi
          </button>
        </header>

        {/* Hero */}
        <section className="mt-7 flex flex-1 flex-col items-center text-center lg:mt-8 lg:grid lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-10 lg:text-left">
          <div className="w-full max-w-xl lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center lg:justify-start"
            >
              <CuteMascot
                expression="excited"
                speech="Yuk bikin foto strip gemoy bareng! ✨"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 }}
              className="mt-5 font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
            >
              <span className="text-heart">Snap</span>
              <span className="text-gradient-purple">ie</span>
              <motion.span
                className="ml-1 inline-block"
                animate={{ rotate: [0, 14, -8, 0], y: [0, -4, 0] }}
                transition={{ duration: 2.8, repeat: Infinity }}
              >
                💕
              </motion.span>
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mt-4 font-display text-2xl font-bold leading-snug text-ink sm:text-3xl"
            >
              Jepret. Bingkai.{" "}
              <span className="text-gradient-purple">Gemoyin.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft sm:text-base lg:mx-0"
            >
              Photobooth online yang lucu & estetik. Tanpa aplikasi, tanpa akun —
              fotomu aman di HP-mu sendiri.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mt-7 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
            >
              <Button
                className="min-w-56 animate-pulse-glow px-8 py-3.5 text-base"
                icon={<Camera size={20} />}
                onClick={start}
              >
                Mulai Foto Yuk ✨
              </Button>
              <p className="flex items-center gap-1.5 text-xs font-medium text-ink-soft">
                <ShieldCheck size={14} className="text-emerald-500" />
                Tidak diunggah ke server
              </p>
            </motion.div>
          </div>

          {/* Strip showcase with stickers */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.5 }}
            className="relative mt-10 w-full max-w-md lg:mt-0 lg:ml-auto"
          >
            <div className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-violet-400/35 via-pink-300/25 to-amber-200/20 blur-2xl" />

            <motion.span
              className="absolute -left-1 top-6 z-20 text-3xl sm:left-2"
              animate={{ y: [0, -10, 0], rotate: [-8, 8, -8] }}
              transition={{ duration: 3.2, repeat: Infinity }}
            >
              🎀
            </motion.span>
            <motion.span
              className="absolute -right-1 top-16 z-20 text-2xl sm:right-4"
              animate={{ y: [0, 8, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: 0.3 }}
            >
              ✨
            </motion.span>
            <motion.span
              className="absolute bottom-8 left-0 z-20 text-2xl sm:left-6"
              animate={{ rotate: [0, 15, 0] }}
              transition={{ duration: 3.8, repeat: Infinity }}
            >
              🐱
            </motion.span>

            <motion.div
              className="relative mx-auto flex w-[min(100%,300px)] justify-center gap-3 sm:w-[340px] sm:gap-4"
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <StripCard strip={strips[0]} tilt={-7} delay={0} />
              <StripCard strip={strips[1]} tilt={3} delay={0.08} featured />
              <StripCard strip={strips[2]} tilt={-4} delay={0.16} className="hidden sm:flex" />
            </motion.div>
          </motion.div>
        </section>

        {/* Steps */}
        <section className="mt-14 sm:mt-16" aria-labelledby="how-title">
          <h2 id="how-title" className="text-center font-display text-2xl font-extrabold text-ink sm:text-left">
            Gampang banget! 🎉
          </h2>
          <p className="mt-1 text-center text-sm text-ink-soft sm:text-left">
            Dari buka kamera sampai unduh, biasanya di bawah 2 menit.
          </p>

          <ol className="mt-6 grid gap-4 sm:grid-cols-3 sm:gap-5">
            {[
              {
                n: "1",
                emoji: "🖼️",
                title: "Pilih layout",
                body: "Strip, grid, atau polaroid — sesuaikan mood.",
                tint: "from-violet-100 to-purple-50",
              },
              {
                n: "2",
                emoji: "📸",
                title: "Jepret & hias",
                body: "Countdown lucu, filter, stiker, bingkai kucing!",
                tint: "from-pink-100 to-rose-50",
              },
              {
                n: "3",
                emoji: "💾",
                title: "Unduh & bagikan",
                body: "PNG/JPG tajam, siap dipamerin ke story.",
                tint: "from-amber-50 to-orange-50",
              },
            ].map((step, i) => (
              <motion.li
                key={step.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4, rotate: i === 1 ? 1 : -1 }}
                className={`rounded-3xl bg-gradient-to-br ${step.tint} p-5 shadow-sm ring-1 ring-white/80`}
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-2xl bg-white text-xl shadow-sm">
                    {step.emoji}
                  </span>
                  <span className="font-display text-2xl font-black text-heart/40">
                    {step.n}
                  </span>
                </div>
                <p className="mt-3 font-display text-lg font-bold text-ink">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </motion.li>
            ))}
          </ol>
        </section>

        {/* Themes */}
        <section className="mt-14 sm:mt-16" aria-labelledby="themes-title">
          <h2 id="themes-title" className="text-center font-display text-2xl font-extrabold text-ink sm:text-left">
            Pilih vibe-mu ✨
          </h2>
          <p className="mt-1 text-center text-sm text-ink-soft sm:text-left">
            {frames.length} bingkai: lucu, kucing, romantis, sampai yang edgy.
          </p>

          <div className="mt-5 flex gap-3 overflow-x-auto pb-2 no-scrollbar sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible">
            {[
              { label: "Lucu", blurb: "Bear & candy", from: "#E9D5FF", to: "#F5F3FF", mark: "🧸" },
              { label: "Kucing", blurb: "Meow mode", from: "#FBCFE8", to: "#FFF7ED", mark: "🐱" },
              { label: "Romantis", blurb: "Date night", from: "#FCE7F3", to: "#FDF2F8", mark: "💕" },
              { label: "Keren", blurb: "Neon vibes", from: "#1E1B4B", to: "#4C1D95", mark: "😎", dark: true },
            ].map((theme, i) => (
              <motion.div
                key={theme.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.04, y: -3 }}
                className="flex h-32 w-40 shrink-0 flex-col justify-between rounded-3xl p-4 shadow-md sm:h-36 sm:w-auto"
                style={{
                  background: `linear-gradient(145deg, ${theme.from}, ${theme.to})`,
                }}
              >
                <motion.span
                  className="text-3xl"
                  animate={{ rotate: [0, 8, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.2 }}
                >
                  {theme.mark}
                </motion.span>
                <div>
                  <p
                    className={`font-display text-lg font-bold ${
                      theme.dark ? "text-white" : "text-ink"
                    }`}
                  >
                    {theme.label}
                  </p>
                  <p
                    className={`text-xs ${
                      theme.dark ? "text-white/70" : "text-ink-soft"
                    }`}
                  >
                    {theme.blurb}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="relative mt-14 overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500 px-6 py-11 text-center text-white shadow-[0_20px_50px_-12px_rgba(236,72,153,0.4)] sm:mt-16 sm:px-10">
          <motion.span
            className="pointer-events-none absolute left-6 top-5 text-3xl opacity-80"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            🥳
          </motion.span>
          <motion.span
            className="pointer-events-none absolute right-8 bottom-6 text-3xl opacity-80"
            animate={{ rotate: [0, 12, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🎉
          </motion.span>

          <p className="font-display text-2xl font-extrabold sm:text-3xl">
            Siap jadi bintang photobooth?
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-white/90">
            {layouts.length} layout · {frames.length} bingkai · hasil HD siap share
          </p>
          <Button
            variant="secondary"
            className="mt-6 min-w-52 border-0 bg-white text-heart hover:bg-pink-50"
            icon={<Camera size={18} />}
            onClick={start}
          >
            Mulai Foto Sekarang
          </Button>
        </section>

        <footer className="mt-8 pb-2 text-center text-xs text-ink-soft">
          🛡️ Fotomu tidak diunggah. Diproses 100% di browser.
        </footer>
      </div>
    </div>
  );
}

function StripCard({
  strip,
  tilt,
  delay,
  featured,
  className = "",
}: {
  strip: (typeof strips)[number];
  tilt: number;
  delay: number;
  featured?: boolean;
  className?: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + delay, type: "spring", stiffness: 160 }}
      whileHover={{ y: -6 }}
      className={`flex w-[96px] flex-col gap-1.5 rounded-[1.25rem] p-2.5 sm:w-[112px] ${
        featured ? "z-10" : "opacity-95"
      } ${className}`}
      style={{
        background: strip.bg,
        transform: `rotate(${tilt}deg) scale(${featured ? 1.08 : 1})`,
        boxShadow: featured
          ? "0 24px 48px -10px rgba(236,72,153,0.35)"
          : "0 16px 32px -12px rgba(42,24,72,0.18)",
      }}
    >
      {strip.slots.map((color, i) => (
        <div
          key={`${strip.name}-${i}`}
          className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl"
          style={{ background: color }}
        >
          <span className="text-lg drop-shadow-sm sm:text-xl">{strip.faces[i]}</span>
        </div>
      ))}
      <p
        className="pt-1 text-center font-display text-[10px] font-bold"
        style={{ color: strip.accent }}
      >
        {strip.name}
      </p>
    </motion.article>
  );
}

import { motion } from "framer-motion";

interface MascotProps {
  expression?: "happy" | "wink" | "camera" | "excited" | "love";
  speech?: string;
  className?: string;
}

export function CuteMascot({ expression = "happy", speech, className = "" }: MascotProps) {
  const getEyes = () => {
    switch (expression) {
      case "wink":
        return { left: "•", right: "◠" };
      case "excited":
        return { left: "★", right: "★" };
      case "love":
        return { left: "♥", right: "♥" };
      case "camera":
        return { left: "⊙", right: "⊙" };
      default:
        return { left: "•", right: "•" };
    }
  };

  const eyes = getEyes();

  return (
    <div className={`relative inline-flex items-center gap-3 ${className}`}>
      <motion.div
        className="relative flex size-14 items-center justify-center rounded-3xl bg-gradient-to-tr from-violet-600 via-purple-500 to-fuchsia-400 shadow-[0_8px_20px_rgba(124,58,237,0.35)]"
        animate={{
          y: [0, -4, 0],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Flash lens accent */}
        <div className="absolute top-2 left-2 size-2.5 rounded-full bg-white/70 shadow-sm" />
        
        {/* Cute Lens / Face */}
        <div className="relative flex size-9 flex-col items-center justify-center rounded-2xl bg-white/90 shadow-inner">
          {/* Eyes */}
          <div className="flex w-full items-center justify-around px-1 text-xs font-bold text-violet-950 select-none">
            <motion.span
              animate={expression === "happy" ? { scaleY: [1, 0.1, 1] } : {}}
              transition={{ repeat: Infinity, repeatDelay: 3.5, duration: 0.15 }}
            >
              {eyes.left}
            </motion.span>
            <span className="text-[10px] text-pink-400 font-bold">🌸</span>
            <span>{eyes.right}</span>
          </div>

          {/* Cute Smile */}
          <div className="text-[10px] leading-none text-violet-900 font-black">
            {expression === "love" ? "w" : expression === "excited" ? "D" : "◡"}
          </div>
        </div>

        {/* Floating Sparkles around Mascot */}
        <motion.span
          className="absolute -top-1 -right-1 text-xs select-none"
          animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ✨
        </motion.span>
      </motion.div>

      {speech && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -5 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          className="relative max-w-xs rounded-2xl border border-purple-200/80 bg-white/90 px-3.5 py-2 text-xs font-medium text-purple-950 shadow-md backdrop-blur-sm"
        >
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 size-3 rotate-45 border-b border-l border-purple-200/80 bg-white/90" />
          <p className="relative z-10 flex items-center gap-1.5">
            {speech}
          </p>
        </motion.div>
      )}
    </div>
  );
}

import { motion } from "framer-motion";
import { useMemo } from "react";

const PARTICLES = ["✨", "🌸", "💖", "⭐", "🎀", "🫧", "☁️", "🧁", "🌷", "💫"];

interface Particle {
  id: number;
  symbol: string;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
}

export function FloatingParticles({ count = 12 }: { count?: number }) {
  const items = useMemo(() => {
    const list: Particle[] = [];
    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        symbol: PARTICLES[i % PARTICLES.length],
        left: Math.random() * 95,
        top: Math.random() * 95,
        size: Math.floor(Math.random() * 12) + 14,
        duration: Math.random() * 6 + 6,
        delay: Math.random() * 4,
      });
    }
    return list;
  }, [count]);

  return (
    <div className="aria-hidden pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {items.map((p) => (
        <motion.span
          key={p.id}
          className="absolute opacity-40"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            fontSize: `${p.size}px`,
          }}
          animate={{
            y: [-12, 12, -12],
            x: [-6, 6, -6],
            rotate: [-10, 10, -10],
            scale: [0.9, 1.1, 0.9],
            opacity: [0.3, 0.65, 0.3],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        >
          {p.symbol}
        </motion.span>
      ))}
    </div>
  );
}

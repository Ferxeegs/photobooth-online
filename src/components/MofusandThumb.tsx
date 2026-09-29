import { loadMofusandSprite } from "@/lib/mofusand";
import { useEffect, useRef } from "react";

/** Renders a Mofusand PNG with studio black keyed out (transparent). */
export function MofusandThumb({
  id,
  className = "",
  size = 96,
}: {
  id: number;
  className?: string;
  size?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    void loadMofusandSprite(id).then((sprite) => {
      if (cancelled || !sprite || !canvasRef.current) return;
      const canvas = canvasRef.current;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, size, size);
      const scale = Math.min(size / sprite.width, size / sprite.height) * 0.92;
      const dw = sprite.width * scale;
      const dh = sprite.height * scale;
      ctx.drawImage(sprite, (size - dw) / 2, (size - dh) / 2, dw, dh);
    });
    return () => {
      cancelled = true;
    };
  }, [id, size]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%" }}
      aria-hidden
    />
  );
}

export function triggerConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "99999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colors = ["#a78bfa", "#c4b5fd", "#f472b6", "#fb7185", "#38bdf8", "#facc15", "#4ade80"];
  const pieces: {
    x: number;
    y: number;
    size: number;
    color: string;
    vx: number;
    vy: number;
    rotation: number;
    rotSpeed: number;
    shape: "circle" | "rect" | "heart";
  }[] = [];

  for (let i = 0; i < 70; i++) {
    pieces.push({
      x: width / 2,
      y: height * 0.4,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.8) * 14,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      shape: i % 3 === 0 ? "heart" : i % 2 === 0 ? "circle" : "rect",
    });
  }

  let animationFrame: number;
  let opacity = 1;

  const render = () => {
    ctx.clearRect(0, 0, width, height);
    let alive = false;

    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25; // gravity
      p.vx *= 0.98; // air resistance
      p.rotation += p.rotSpeed;

      if (p.y < height) alive = true;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = p.color;

      if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else {
        // heart shape
        ctx.beginPath();
        const topCurveHeight = p.size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -p.size / 2, 0, -p.size / 2, topCurveHeight);
        ctx.bezierCurveTo(-p.size / 2, (p.size + topCurveHeight) / 2, 0, p.size, 0, p.size);
        ctx.bezierCurveTo(0, p.size, p.size / 2, (p.size + topCurveHeight) / 2, p.size / 2, topCurveHeight);
        ctx.bezierCurveTo(p.size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.fill();
      }

      ctx.restore();
    });

    opacity -= 0.008;

    if (alive && opacity > 0) {
      animationFrame = requestAnimationFrame(render);
    } else {
      canvas.remove();
    }
  };

  animationFrame = requestAnimationFrame(render);

  setTimeout(() => {
    cancelAnimationFrame(animationFrame);
    canvas.remove();
  }, 2500);
}

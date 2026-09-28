let audioCtx: AudioContext | null = null;

function context(): AudioContext | null {
  const Ctor = window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) audioCtx = new Ctor();
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

export function playShutter(): void {
  const ctx = context();
  if (!ctx) return;
  const now = ctx.currentTime;
  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 1200;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 0.09);

  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);
  const og = ctx.createGain();
  og.gain.setValueAtTime(0.08, now);
  og.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
  osc.connect(og);
  og.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.07);
}

export function playTick(): void {
  const ctx = context();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = 660;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.13);
}

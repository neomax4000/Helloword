// ESTÁNDAR PRO v1 — sistema visual único del canal (2026-11-13)
// Una sola identidad para todos los videos: fondo profundo con malla de color y grano,
// tarjetas crema con sombra, un acento ámbar, números gigantes y subtítulos por frase.
import React from 'react';
import {AbsoluteFill, Img, spring, staticFile, useCurrentFrame} from 'remotion';

export const W = 1080;
export const H = 1920;
export const FPS = 30;
export const FONT = '"Poppins", system-ui, sans-serif';

// Zonas seguras de TikTok: arriba 170 px, abajo 420 px (descripción) y 130 px a la derecha (botones)
export const SAFE = {top: 170, bottom: 1500, left: 70, right: 950};

export const P = {
  ink: '#0A0F1F',
  paper: '#F7F2E8',
  paper2: '#E9E1D0',
  amber: '#FFC247',
  amberDeep: '#E59A12',
  mint: '#35E0A1',
  coral: '#FF5A5F',
  sky: '#7FB2FF',
  white: '#FFFFFF',
  mute: 'rgba(255,255,255,0.62)',
};

export type Mood = {a: string; b: string; blob: string; blob2: string};
export const MOODS: Record<string, Mood> = {
  navy: {a: '#070D26', b: '#16307A', blob: '#3D6BFF', blob2: '#12B5E5'},
  forest: {a: '#04191A', b: '#0C4B43', blob: '#19C79C', blob2: '#B7E24A'},
  plum: {a: '#170A2C', b: '#4B1A78', blob: '#B455FF', blob2: '#FF5FA8'},
  ember: {a: '#1A0B0B', b: '#5E1D16', blob: '#FF6A3D', blob2: '#FFC247'},
};

export const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOut = (t: number) => 1 - Math.pow(1 - cl(t), 3);
export const easeIO = (t: number) => {
  const x = cl(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
/** resorte que arranca en el segundo `at` */
export const spr = (frame: number, at: number, damping = 13, stiffness = 170, mass = 0.7) =>
  spring({frame: frame - Math.round(at * FPS), fps: FPS, config: {damping, stiffness, mass}});
/** progreso lineal 0..1 entre dos segundos */
export const prog = (t: number, a: number, b: number) => cl((t - a) / Math.max(0.001, b - a));
export const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

/* ---------------- fondo ---------------- */
const MoodLayer: React.FC<{m: Mood; f: number}> = ({m, f}) => {
  const k = f / FPS;
  const b1x = 22 + Math.sin(k * 0.35) * 10;
  const b1y = 18 + Math.cos(k * 0.27) * 6;
  const b2x = 82 + Math.cos(k * 0.31) * 9;
  const b2y = 62 + Math.sin(k * 0.22) * 8;
  return (
    <AbsoluteFill style={{background: `linear-gradient(165deg, ${m.b} 0%, ${m.a} 62%)`}}>
      <AbsoluteFill style={{background: `radial-gradient(760px 760px at ${b1x}% ${b1y}%, ${m.blob}88, transparent 70%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(640px 640px at ${b2x}% ${b2y}%, ${m.blob2}40, transparent 70%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(900px 620px at 50% 104%, ${m.blob}55, transparent 72%)`}} />
    </AbsoluteFill>
  );
};

export const Backdrop: React.FC<{moods: {at: number; mood: string}[]}> = ({moods}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  let i = 0;
  for (let k = 0; k < moods.length; k++) if (t >= moods[k].at) i = k;
  const cur = MOODS[moods[i].mood];
  const prev = i > 0 ? MOODS[moods[i - 1].mood] : null;
  const p = i === 0 ? 1 : easeIO((t - moods[i].at) / 0.42);
  // rejilla de puntos que se desplaza muy lento (da profundidad sin distraer)
  const off = (f * 0.35) % 54;
  return (
    <AbsoluteFill style={{background: P.ink}}>
      {prev && p < 1 && <MoodLayer m={prev} f={f} />}
      <AbsoluteFill style={{clipPath: p < 1 ? `circle(${p * 135}% at 50% 42%)` : undefined}}>
        <MoodLayer m={cur} f={f} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.11) 2px, transparent 2.6px)',
          backgroundSize: '54px 54px',
          backgroundPosition: `${off}px ${-off}px`,
          maskImage: 'linear-gradient(180deg, transparent 4%, #000 30%, #000 60%, transparent 92%)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent 4%, #000 30%, #000 60%, transparent 92%)',
        }}
      />
      <AbsoluteFill style={{background: 'radial-gradient(1300px 1700px at 50% 44%, transparent 55%, rgba(0,0,0,0.5) 100%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, transparent 58%, rgba(0,0,0,0.42) 78%, rgba(0,0,0,0.6) 100%)'}} />
    </AbsoluteFill>
  );
};

export const Grain: React.FC = () => {
  const f = useCurrentFrame();
  const j = (f % 4) * 90;
  return (
    <AbsoluteFill style={{opacity: 0.085, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <Img src={staticFile('grain.png')} style={{position: 'absolute', width: 0, height: 0}} />
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '360px 360px', backgroundPosition: `${j}px ${j * 0.7}px`}} />
    </AbsoluteFill>
  );
};

/* ---------------- escena con entrada/salida ---------------- */
type Kind = 'up' | 'left' | 'zoom' | 'down' | 'none';
export const Scene: React.FC<{a: number; b: number; kind?: Kind; out?: Kind; children: (lt: number, f: number) => React.ReactNode}> = ({a, b, kind = 'up', out = 'zoom', children}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  if (t < a - 0.001 || t >= b + 0.17) return null;
  const pin = kind === 'none' ? 1 : spr(f, a, 15, 190, 0.6);
  const pout = easeIO((t - b) / 0.17);
  const drift = 1 + 0.035 * cl((t - a) / Math.max(1, b - a));
  let tx = 0;
  let ty = 0;
  let sc = drift;
  if (kind === 'up') ty = (1 - pin) * 170;
  if (kind === 'down') ty = -(1 - pin) * 170;
  if (kind === 'left') tx = (1 - pin) * 260;
  if (kind === 'zoom') sc = drift * lerp(0.86, 1, pin);
  if (out === 'zoom') sc *= 1 + pout * 0.1;
  if (out === 'up') ty -= pout * 200;
  if (out === 'left') tx -= pout * 300;
  if (out === 'down') ty += pout * 200;
  const op = Math.min(kind === 'none' ? 1 : cl(pin * 1.6), 1 - pout);
  return (
    <AbsoluteFill style={{opacity: op, transform: `translate(${tx}px, ${ty}px) scale(${sc})`, transformOrigin: '50% 42%'}}>{children(t - a, f)}</AbsoluteFill>
  );
};

/* ---------------- piezas de movimiento ---------------- */
export const Rise: React.FC<{at: number; dy?: number; dx?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({at, dy = 70, dx = 0, style, children}) => {
  const f = useCurrentFrame();
  const p = spr(f, at);
  return <div style={{...style, opacity: cl(p * 1.8), transform: `${style?.transform ?? ''} translate(${(1 - p) * dx}px, ${(1 - p) * dy}px)`}}>{children}</div>;
};
export const Pop: React.FC<{at: number; from?: number; rot?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({at, from = 0.4, rot = 0, style, children}) => {
  const f = useCurrentFrame();
  const p = spr(f, at, 9, 200, 0.6);
  return <div style={{...style, opacity: cl(p * 2.2), transform: `${style?.transform ?? ''} scale(${lerp(from, 1, p)}) rotate(${rot}deg)`}}>{children}</div>;
};
/** texto que sube desde detrás de una máscara */
export const Mask: React.FC<{at: number; size: number; weight?: number; color?: string; ls?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, size, weight = 800, color = P.white, ls = -0.02, children, style}) => {
  const f = useCurrentFrame();
  const p = spr(f, at, 16, 150);
  return (
    <div style={{overflow: 'hidden', lineHeight: 1.05, paddingBottom: size * 0.08, ...style}}>
      <div style={{fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, transform: `translateY(${(1 - p) * 110}%)`, whiteSpace: 'nowrap'}}>{children}</div>
    </div>
  );
};
export const Chip: React.FC<{children: React.ReactNode; bg?: string; color?: string; size?: number; style?: React.CSSProperties}> = ({children, bg = 'rgba(255,255,255,0.12)', color = P.white, size = 30, style}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: `${size * 0.42}px ${size * 0.9}px`, borderRadius: 999, background: bg, color, fontFamily: FONT, fontWeight: 700, fontSize: size, letterSpacing: '0.12em', border: bg.startsWith('rgba') ? '2px solid rgba(255,255,255,0.22)' : 'none', whiteSpace: 'nowrap', ...style}}>{children}</div>
);
export const Card: React.FC<{style?: React.CSSProperties; children: React.ReactNode}> = ({style, children}) => (
  <div style={{background: `linear-gradient(180deg, ${P.paper} 0%, ${P.paper2} 100%)`, borderRadius: 44, boxShadow: '0 40px 80px rgba(0,0,0,0.45), 0 6px 0 rgba(255,255,255,0.6) inset', color: P.ink, fontFamily: FONT, ...style}}>{children}</div>
);

/* ---------------- subtítulos por frase ---------------- */
export type Wd = {i: number; w: string; s: number; e: number; b: number; g?: number};
type Group = {ws: Wd[]; a: number; b: number};
export const buildGroups = (words: Wd[], blocks: {s: number; e: number}[], maxChars = 15, maxWords = 3): Group[] => {
  const gs: Group[] = [];
  let cur: Wd[] = [];
  const flush = () => {
    if (cur.length) gs.push({ws: cur, a: cur[0].s, b: cur[cur.length - 1].e});
    cur = [];
  };
  words.forEach((w, k) => {
    const len = cur.reduce((n, x) => n + x.w.length + 1, 0) + w.w.length;
    const manual = w.g !== undefined;
    if (cur.length && (manual ? cur[0].g !== w.g : cur[0].b !== w.b || cur.length >= maxWords || len > maxChars)) flush();
    cur.push(w);
    if ((!manual && /[.,:;!?]$/.test(w.w)) || k === words.length - 1) flush();
  });
  gs.forEach((g, k) => {
    const next = gs[k + 1];
    g.a = g.a - 0.06;
    g.b = next && next.ws[0].b === g.ws[0].b ? next.a - 0.06 : Math.min(blocks[g.ws[0].b].e + 0.2, next ? next.a - 0.06 : 1e9);
  });
  return gs;
};
export const Captions: React.FC<{groups: Group[]; keys?: string[]; y?: number}> = ({groups, keys = [], y = 1300}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const g = groups.find((x) => t >= x.a && t < x.b);
  if (!g) return null;
  const pin = spr(f, g.a, 14, 240, 0.5);
  const clean = (s: string) => s.replace(/[.,:;]/g, '').toUpperCase();
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: y, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 22px', transform: `translateY(${(1 - pin) * 26}px) scale(${lerp(0.9, 1, pin)})`, opacity: cl(pin * 2)}}>
      {g.ws.map((w, wi) => {
        const on = t >= w.s - 0.04;
        const nx = g.ws[wi + 1];
        const act = on && t < (nx ? nx.s - 0.04 : w.e + 0.3);
        const key = keys.includes(clean(w.w));
        const k = spr(f, w.s - 0.04, 10, 260, 0.5);
        return (
          <span
            key={w.i}
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 76,
              lineHeight: 1.14,
              letterSpacing: '-0.01em',
              color: act || (on && key) ? P.amber : P.white,
              opacity: on ? 1 : 0.38,
              transform: `scale(${on ? lerp(1.14, 1, k) : 1})`,
              display: 'inline-block',
              textShadow: '0 6px 0 rgba(0,0,0,0.55), 0 0 34px rgba(0,0,0,0.6)',
              WebkitTextStroke: '3px rgba(8,10,22,0.9)',
              paintOrder: 'stroke fill',
            }}
          >
            {clean(w.w)}
          </span>
        );
      })}
    </div>
  );
};

/* ---------------- marco fijo: serie, progreso, nota legal ---------------- */
export const Frame: React.FC<{serie: string; total: number; nota: string; pasos?: {at: number; label: string}[]}> = ({serie, total, nota, pasos}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  let paso = '';
  (pasos ?? []).forEach((p) => {
    if (t >= p.at) paso = p.label;
  });
  return (
    <>
      <div style={{position: 'absolute', left: 0, top: 0, height: 10, width: `${(t / total) * 100}%`, background: `linear-gradient(90deg, ${P.amberDeep}, ${P.amber})`, borderRadius: '0 8px 8px 0'}} />
      <div style={{position: 'absolute', top: 96, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: '0.2em', color: P.mute}}>
          <span style={{width: 16, height: 16, borderRadius: 99, background: P.amber, display: 'inline-block'}} />
          {serie}
        </div>
        {paso && (
          <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: '0.14em', color: P.ink, background: P.amber, borderRadius: 999, padding: '8px 26px'}}>{paso}</div>
        )}
      </div>
      <div style={{position: 'absolute', left: 70, right: 200, top: 1532, fontFamily: FONT, fontWeight: 400, fontSize: 23, lineHeight: 1.3, color: 'rgba(255,255,255,0.5)'}}>{nota}</div>
    </>
  );
};

import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT, FPS, H, W, SC_H, SC_W} from './theme';

export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const P = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
export const PL = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
export const sp = (f: number, delay = 0, damping = 15, stiffness = 110, mass = 0.9) =>
  spring({frame: f - delay, fps: FPS, config: {damping, stiffness, mass}});

/* ---------- Fondo ---------- */
export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const parts = React.useMemo(
    () =>
      Array.from({length: 26}, (_, i) => ({
        x: random('x' + i) * W,
        y0: random('y' + i) * H,
        s: 0.25 + random('s' + i) * 0.6,
        r: 2 + random('r' + i) * 4,
        o: 0.1 + random('o' + i) * 0.25,
      })),
    [],
  );
  const gx = 540 + Math.sin(f / 90) * 170;
  const gy = 560 + Math.cos(f / 110) * 130;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(950px 950px at ${gx}px ${gy}px, rgba(24,70,150,0.42), rgba(0,0,0,0) 62%), radial-gradient(820px 820px at ${W - gx * 0.35}px ${H - 340 + Math.sin(f / 70) * 90}px, rgba(179,163,105,0.16), rgba(0,0,0,0) 62%), linear-gradient(180deg, ${C.bg1} 0%, ${C.bg0} 100%)`,
      }}
    >
      {parts.map((p, i) => {
        const y = (((p.y0 - f * p.s * 1.2) % H) + H) % H;
        return (
          <div
            key={i}
            style={{position: 'absolute', left: p.x, top: y, width: p.r, height: p.r, borderRadius: '50%', background: C.gold, opacity: p.o}}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- Escena con cross-fade ---------- */
export const SceneFrame: React.FC<{dur: number; first?: boolean; last?: boolean; children: React.ReactNode}> = ({
  dur,
  first,
  last,
  children,
}) => {
  const f = useCurrentFrame();
  const fin = first ? 1 : PL(f, 0, 8);
  const fout = last ? 1 : 1 - PL(f, dur - 8, dur);
  return <AbsoluteFill style={{opacity: Math.min(fin, fout)}}>{children}</AbsoluteFill>;
};

/* ---------- Teléfono ---------- */
export const PH_W = 568;
export const PH_H = 996;
export const PH_TOP = 330;

export const Phone: React.FC<{f: number; enter?: boolean; children: React.ReactNode}> = ({f, enter, children}) => {
  const s = enter ? sp(f, 4, 18, 90) : 1;
  return (
    <div
      style={{
        position: 'absolute',
        left: (W - PH_W) / 2,
        top: PH_TOP,
        width: PH_W,
        height: PH_H,
        borderRadius: 70,
        background: 'linear-gradient(160deg,#313a4f,#0d1119 42%,#1a2130)',
        padding: 14,
        boxSizing: 'border-box',
        boxShadow: '0 50px 90px rgba(0,0,0,0.55), inset 0 0 0 2px rgba(255,255,255,0.09)',
        transform: `translateY(${(1 - s) * 110}px) scale(${0.94 + 0.06 * s})`,
        opacity: Math.min(1, s * 1.8),
      }}
    >
      <div style={{position: 'relative', width: SC_W, height: SC_H, borderRadius: 58, overflow: 'hidden', background: C.appBg}}>
        {children}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 118,
            height: 30,
            borderRadius: 20,
            background: '#000',
          }}
        />
      </div>
    </div>
  );
};

/* ---------- Encabezado con pasos ---------- */
export const Header: React.FC<{
  f: number;
  dur: number;
  label: string;
  title: string;
  seg: number; // 0..2 paso actual, 3 = todo completo
  fill0: number;
  fill1: number;
}> = ({f, dur, label, title, seg, fill0, fill1}) => {
  const a = P(f, 0, 18);
  const t = P(f, 3, 24);
  const fill = interpolate(f, [8, Math.max(20, dur * 0.7)], [fill0, fill1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 96,
          width: W,
          textAlign: 'center',
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 26,
          letterSpacing: 8,
          color: C.gold,
          opacity: a,
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 150,
          width: W,
          textAlign: 'center',
          fontFamily: FONT,
          fontSize: 62,
          letterSpacing: 0,
          color: C.text,
          opacity: t,
          transform: `translateY(${(1 - t) * 26}px)`,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{fontWeight: 300}}>{title.split('|')[0]} </span>
        <span style={{fontWeight: 700}}>{title.split('|')[1]}</span>
      </div>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', right: 56, top: 60, width: 200, opacity: a}} />
      <div style={{position: 'absolute', top: 262, left: 0, width: W, display: 'flex', justifyContent: 'center', gap: 16, opacity: a}}>
        {[0, 1, 2].map((i) => {
          const v = seg >= 3 ? 1 : i < seg ? 1 : i === seg ? fill : 0;
          return (
            <div key={i} style={{width: 200, height: 10, borderRadius: 6, background: 'rgba(255,255,255,0.14)', overflow: 'hidden'}}>
              <div style={{width: `${v * 100}%`, height: '100%', borderRadius: 6, background: `linear-gradient(90deg, ${C.goldDeep}, ${C.gold})`}} />
            </div>
          );
        })}
      </div>
    </>
  );
};

/* ---------- Subtítulos ---------- */
const chunkSentence = (text: string) => {
  const parts = text.split(/(?<=[,:])\s+/);
  const out: string[] = [];
  for (const p of parts) {
    if (out.length && out[out.length - 1].length < 24) out[out.length - 1] += ' ' + p;
    else out.push(p);
  }
  if (out.length > 1 && out[out.length - 1].length < 18) {
    const l = out.pop() as string;
    out[out.length - 1] += ' ' + l;
  }
  const res: string[] = [];
  for (const c of out) {
    if (c.length > 60) {
      const mid = c.length / 2;
      let best = -1;
      for (let i = 0; i < c.length; i++) if (c[i] === ' ' && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
      res.push(c.slice(0, best), c.slice(best + 1));
    } else res.push(c);
  }
  return res;
};

export type Sentence = {text: string; start: number; end: number};

export const Captions: React.FC<{f: number; sentences: Sentence[]; sceneStart: number}> = ({f, sentences, sceneStart}) => {
  const items: {text: string; a: number; b: number}[] = [];
  for (const s of sentences) {
    const chunks = chunkSentence(s.text);
    const total = chunks.reduce((n, c) => n + c.length, 0);
    let acc = 0;
    chunks.forEach((c, i) => {
      const a = s.start + ((s.end - s.start) * acc) / total;
      acc += c.length;
      const b = i === chunks.length - 1 ? s.end + 0.3 : s.start + ((s.end - s.start) * acc) / total;
      items.push({text: c, a: (a - sceneStart) * FPS, b: (b - sceneStart) * FPS});
    });
  }
  const cur = items.find((it) => f >= it.a - 2 && f < it.b);
  if (!cur) return null;
  const inn = P(f, cur.a - 2, cur.a + 7);
  const out = 1 - PL(f, cur.b - 5, cur.b);
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 1398, height: 270, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 46,
          lineHeight: 1.3,
          textAlign: 'center',
          color: C.text,
          padding: '24px 40px',
          borderRadius: 38,
          background: 'rgba(6,11,24,0.74)',
          border: '1.5px solid rgba(179,163,105,0.28)',
          opacity: inn * out,
          transform: `translateY(${(1 - inn) * 18}px)`,
        }}
      >
        {cur.text}
      </div>
    </div>
  );
};

/* ---------- Iconos ---------- */
export const Check: React.FC<{size?: number; p: number; color?: string; stroke?: number}> = ({size = 40, p, color = '#fff', stroke = 7}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path d="M10 25 L20 35 L38 13" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
  </svg>
);

export const Ripple: React.FC<{x: number; y: number; f: number; at: number}> = ({x, y, f, at}) => {
  const p = PL(f, at, at + 20);
  if (p <= 0 || p >= 1) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 60,
        top: y - 60,
        width: 120,
        height: 120,
        borderRadius: '50%',
        border: `4px solid ${C.gold}`,
        background: 'rgba(179,163,105,0.22)',
        transform: `scale(${0.3 + p * 1.1})`,
        opacity: 1 - p,
      }}
    />
  );
};

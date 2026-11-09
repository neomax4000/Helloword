import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig, Easing, random} from 'remotion';

export const C = {
  red: '#E3122B', redD: '#7A0A14', bone: '#EDE6D6', dim: 'rgba(237,230,214,0.62)', faint: 'rgba(237,230,214,0.35)',
  green: '#4CFF8A', amber: '#FFB020', ink: '#07070A', line: 'rgba(237,230,214,0.18)', card: 'rgba(10,10,12,0.72)',
};
export const F = {title: 'Oswald, sans-serif', type: '"Special Elite", monospace', body: 'Poppins, sans-serif'};

export const useSp = (delay = 0, damping = 12, stiffness = 140) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - delay, fps, config: {damping, stiffness}});
};
export const lerp = (f: number, a: number, b: number, x: number, y: number, ease = true) =>
  interpolate(f, [a, b], [x, y], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease ? Easing.out(Easing.cubic) : undefined});

export const Pop: React.FC<{d?: number; y?: number; children: React.ReactNode; style?: React.CSSProperties; slam?: boolean}> = ({d = 0, y = 40, children, style, slam}) => {
  const s = useSp(d, slam ? 9 : 13, slam ? 220 : 140);
  return <div style={{opacity: Math.min(1, s * 1.4), transform: slam ? `scale(${2.2 - 1.2 * s})` : `translateY(${(1 - s) * y}px)`, ...style}}>{children}</div>;
};

// text that types itself
export const Type: React.FC<{text: string; d?: number; cps?: number; style?: React.CSSProperties; cursor?: boolean}> = ({text, d = 0, cps = 40, style, cursor = true}) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.floor(((f - d) / 30) * cps));
  const done = n >= text.length;
  return (
    <span style={{fontFamily: F.type, ...style}}>
      {text.slice(0, n)}
      {cursor && (!done || Math.floor(f / 12) % 2 === 0) ? <span style={{opacity: 0.8}}>▌</span> : null}
    </span>
  );
};

// glitchy title with RGB split on some frames
export const Glitch: React.FC<{text: string; size?: number; color?: string; d?: number; style?: React.CSSProperties}> = ({text, size = 120, color = C.bone, d = 0, style}) => {
  const f = useCurrentFrame();
  const g = f >= d && (f - d < 8 || random(`g${Math.floor(f / 3)}`) > 0.86);
  const dx = g ? (random(`x${f}`) - 0.5) * 18 : 0;
  const s = useSp(d, 14, 160);
  const base: React.CSSProperties = {fontFamily: F.title, fontWeight: 700, fontSize: size, lineHeight: 0.98, textTransform: 'uppercase', letterSpacing: 1};
  return (
    <div style={{position: 'relative', opacity: s, transform: `translateX(${(1 - s) * -30}px)`, ...style}}>
      {g && <div style={{...base, position: 'absolute', inset: 0, color: 'rgba(227,18,43,0.85)', transform: `translate(${dx}px, 2px)`}}>{text}</div>}
      {g && <div style={{...base, position: 'absolute', inset: 0, color: 'rgba(80,220,255,0.6)', transform: `translate(${-dx}px, -2px)`}}>{text}</div>}
      <div style={{...base, position: 'relative', color}}>{text}</div>
    </div>
  );
};

export const Kicker: React.FC<{text: string; d?: number; color?: string}> = ({text, d = 0, color = C.red}) => (
  <Pop d={d} y={14}>
    <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, fontFamily: F.type, fontSize: 32, color, letterSpacing: 3, textTransform: 'uppercase'}}>
      <span style={{width: 16, height: 16, borderRadius: 8, background: color, boxShadow: `0 0 18px ${color}`}} />{text}
    </div>
  </Pop>
);

export const Stamp: React.FC<{text: string; d?: number; rot?: number; color?: string; size?: number}> = ({text, d = 0, rot = -8, color = C.red, size = 64}) => {
  const s = useSp(d, 8, 260);
  const f = useCurrentFrame();
  if (f < d) return null;
  return (
    <div style={{display: 'inline-block', transform: `rotate(${rot}deg) scale(${2.4 - 1.4 * s})`, opacity: Math.min(1, s * 2), border: `6px solid ${color}`, color, fontFamily: F.title, fontWeight: 700, fontSize: size, padding: '6px 26px', letterSpacing: 4, textTransform: 'uppercase'}}>
      {text}
    </div>
  );
};

export const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties; d?: number}> = ({children, style, d = 0}) => (
  <Pop d={d}>
    <div style={{background: C.card, border: `2px solid ${C.line}`, borderRadius: 10, padding: '30px 36px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', ...style}}>{children}</div>
  </Pop>
);

// evidence photo / polaroid with tape
export const Evidence: React.FC<{children: React.ReactNode; d?: number; rot?: number; w?: number; label?: string; style?: React.CSSProperties}> = ({children, d = 0, rot = -3, w = 420, label, style}) => {
  const s = useSp(d, 12, 150);
  return (
    <div style={{width: w, transform: `rotate(${rot}deg) translateY(${(1 - s) * -80}px)`, opacity: s, position: 'relative', ...style}}>
      <div style={{position: 'absolute', top: -18, left: '50%', width: 140, height: 36, marginLeft: -70, background: 'rgba(230,220,190,0.55)', transform: 'rotate(2deg)', zIndex: 2}} />
      <div style={{background: '#E9E3D3', padding: '18px 18px 14px', boxShadow: '0 18px 40px rgba(0,0,0,0.7)'}}>
        <div style={{background: '#121214', padding: 22, minHeight: 120}}>{children}</div>
        {label && <div style={{fontFamily: F.type, fontSize: 26, color: '#2a2622', marginTop: 10}}>{label}</div>}
      </div>
    </div>
  );
};

export const Source: React.FC<{text: string; d?: number}> = ({text, d = 10}) => {
  const f = useCurrentFrame();
  return <div style={{position: 'absolute', left: 80, right: 80, top: 1398, fontFamily: F.type, fontSize: 23, color: C.faint, opacity: lerp(f, d, d + 10, 0, 1)}}>FUENTE: {text}</div>;
};

export const Counter: React.FC<{from?: number; to: number; d?: number; dur?: number; dec?: number; pre?: string; suf?: string}> = ({from = 0, to, d = 0, dur = 30, dec = 0, pre = '', suf = ''}) => {
  const f = useCurrentFrame();
  const v = lerp(f, d, d + dur, from, to);
  return <>{pre}{v.toLocaleString('en-US', {minimumFractionDigits: dec, maximumFractionDigits: dec})}{suf}</>;
};

export const Stage: React.FC<{children: React.ReactNode; gap?: number}> = ({children, gap = 40}) => (
  <div style={{position: 'absolute', left: 80, right: 80, top: 150, bottom: 530, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap}}>{children}</div>
);

export const Big: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({children, size = 160, color = C.bone, style}) => (
  <div style={{fontFamily: F.title, fontWeight: 700, fontSize: size, lineHeight: 1, color, ...style}}>{children}</div>
);
export const P: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({children, size = 36, color = C.dim, style}) => (
  <div style={{fontFamily: F.body, fontWeight: 400, fontSize: size, lineHeight: 1.3, color, ...style}}>{children}</div>
);

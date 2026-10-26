import React from 'react';
import {AbsoluteFill, Audio, interpolate, random, spring, staticFile, useCurrentFrame} from 'remotion';
import timing from '../public/replica/timing.json';
import {FONT, FPS, H, W} from './theme';

const F = (s: number) => Math.round(s * FPS);
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => 1 - Math.pow(1 - cl(t), 3);
const sp = (f: number, d = 0, damping = 11, stiffness = 140) =>
  spring({frame: f - d, fps: FPS, config: {damping, stiffness, mass: 0.7}});

const SKIN = '#F2B98C';
const SKIN_D = '#DB9A6E';
const INK = '#2A1B14';
const GOLD = '#FFC93C';
const KEY = '#FFD23F';

type Beat = {text: string; emo: string; start: number; end: number};
const beats = timing.beats as Beat[];
const env = timing.env as number[];

const beatAt = (t: number) => {
  let cur = beats[0];
  for (const b of beats) if (b.start - 0.05 <= t) cur = b;
  return cur;
};

/* ------------------------------------------------------------------ */
/* Personajes                                                          */
/* ------------------------------------------------------------------ */
type Ex = {brow: number; open: number; smile: number; tilt: number};
const KID_EX: Record<string, Ex> = {
  whisper: {brow: -0.3, open: 0.8, smile: 0.1, tilt: 0.15},
  calm: {brow: 0, open: 1, smile: 0.35, tilt: 0},
  doubt: {brow: 0.5, open: 0.85, smile: -0.1, tilt: -0.1},
  hype: {brow: 0.8, open: 1.15, smile: 0.8, tilt: 0},
  peak: {brow: 1, open: 1.25, smile: 1, tilt: 0},
  reveal: {brow: -0.5, open: 1, smile: 0.1, tilt: 0.3},
  slow: {brow: -0.6, open: 0.9, smile: -0.2, tilt: 0.25},
};

const Brow: React.FC<{side: -1 | 1; y: number; b: number; tilt: number; color: string; w?: number; skew?: number}> = ({side, y, b, tilt, color, w = 14, skew = 0}) => {
  const cx = 300 + side * 100;
  const innerX = 300 + side * 28;
  const outerX = 300 + side * 128;
  const yy = y - b * 22 + skew;
  const yi = yy + tilt * 18;
  const yo = yy - tilt * 6;
  return <path d={`M${outerX} ${yo} Q${cx} ${yy - 14} ${innerX} ${yi}`} stroke={color} strokeWidth={w} strokeLinecap="round" fill="none" />;
};

const Eye: React.FC<{x: number; y: number; open: number; look: number[]; r?: number}> = ({x, y, open, look, r = 36}) => {
  const ry = Math.max(2, r * 1.18 * open);
  return (
    <g>
      <ellipse cx={x} cy={y} rx={r} ry={ry} fill="#fff" stroke={INK} strokeWidth={4} />
      <ellipse cx={x + look[0] * 10} cy={y + look[1] * 8} rx={r * 0.48} ry={Math.min(ry, r * 0.5)} fill="#2B1A12" />
      <circle cx={x + look[0] * 10 - 6} cy={y + look[1] * 8 - 7} r={5} fill="#fff" opacity={open > 0.3 ? 1 : 0} />
    </g>
  );
};

const Mouth: React.FC<{y: number; m: number; smile: number; w?: number}> = ({y, m, smile, w = 52}) => {
  const ww = w + smile * 16;
  const open = m * 54;
  const corner = -smile * 16;
  if (open < 3) {
    return <path d={`M${300 - ww} ${y + corner} Q300 ${y - corner * 1.6 + 6} ${300 + ww} ${y + corner}`} stroke="#7A2A2A" strokeWidth={9} strokeLinecap="round" fill="none" />;
  }
  return (
    <g>
      <path d={`M${300 - ww} ${y + corner} Q300 ${y + corner - 4} ${300 + ww} ${y + corner} Q300 ${y + open * 1.9} ${300 - ww} ${y + corner} Z`} fill="#7A1F2B" stroke="#5A1620" strokeWidth={5} strokeLinejoin="round" />
      <ellipse cx={300} cy={y + open * 1.05} rx={ww * 0.5} ry={Math.min(open * 0.38, 20)} fill="#E8707A" />
      <path d={`M${300 - ww + 8} ${y + corner + 3} Q300 ${y + corner - 1} ${300 + ww - 8} ${y + corner + 3}`} stroke="#fff" strokeWidth={9} strokeLinecap="round" fill="none" opacity={0.95} />
    </g>
  );
};

const Mic: React.FC<{tilt?: number}> = ({tilt = -12}) => (
  <g transform={`translate(468 500) rotate(${tilt})`}>
    <rect x={-8} y={150} width={16} height={190} fill="#3a3f4b" />
    <rect x={-38} y={-20} width={76} height={190} rx={36} fill="#2c313c" stroke="#171a21" strokeWidth={5} />
    {Array.from({length: 7}, (_, i) => (
      <line key={i} x1={-34} x2={34} y1={4 + i * 24} y2={4 + i * 24} stroke="#4a515f" strokeWidth={4} />
    ))}
    <rect x={-44} y={146} width={88} height={22} rx={10} fill="#d5453f" />
  </g>
);

export const Kid: React.FC<{f: number; t: number; emo: string; gest: 'none' | 'raise' | 'point'}> = ({f, t, emo, gest}) => {
  const e = KID_EX[emo] || KID_EX.calm;
  const m = env[Math.min(env.length - 1, Math.floor(t * FPS))] || 0;
  const amp = emo === 'peak' ? 11 : emo === 'hype' ? 7 : emo === 'whisper' ? 2 : 4;
  const bob = Math.sin(f * 0.42) * amp * (0.35 + m) - m * 5;
  const rot = Math.sin(f * 0.13) * (emo === 'hype' || emo === 'peak' ? 4 : 1.6) + (emo === 'whisper' ? -3 : emo === 'doubt' ? 4 : 0);
  const blinkP = (f % 96) / 96;
  const blink = blinkP > 0.93 ? 1 - Math.abs(blinkP - 0.965) / 0.035 : 0;
  const look = emo === 'doubt' ? [0.8, -0.5] : emo === 'whisper' ? [-0.7, 0.2] : [0, 0.1];
  const open = e.open * (1 - blink * 0.95);
  const g = gest === 'raise' ? 1 : 0;
  const wob = Math.sin(f * 0.5) * 8;
  return (
    <svg width={1080} height={1260} viewBox="0 0 600 700" style={{overflow: 'visible'}}>
      {/* torso */}
      <g transform={`translate(0 ${bob * 0.5})`}>
        <path d="M70 720 C70 580 130 520 220 505 L380 505 C470 520 530 580 530 720 Z" fill="#F4A62A" stroke={INK} strokeWidth={6} />
        <path d="M215 505 Q300 600 385 505 Q300 540 215 505Z" fill="#D9871B" />
        <line x1={262} y1={560} x2={256} y2={640} stroke="#fff" strokeWidth={7} strokeLinecap="round" />
        <line x1={340} y1={560} x2={346} y2={640} stroke="#fff" strokeWidth={7} strokeLinecap="round" />
        <rect x={262} y={455} width={76} height={70} fill={SKIN_D} />
      </g>
      {/* brazos */}
      {gest === 'raise' && (
        <g>
          <path d={`M130 600 Q60 ${470 + wob} 78 ${330 + wob}`} stroke="#F4A62A" strokeWidth={62} strokeLinecap="round" fill="none" />
          <circle cx={78} cy={310 + wob} r={46} fill={SKIN} stroke={INK} strokeWidth={5} />
          <path d={`M470 600 Q540 ${470 - wob} 522 ${330 - wob}`} stroke="#F4A62A" strokeWidth={62} strokeLinecap="round" fill="none" />
          <circle cx={522} cy={310 - wob} r={46} fill={SKIN} stroke={INK} strokeWidth={5} />
        </g>
      )}
      {gest === 'point' && (
        <g transform={`translate(${400 + Math.sin(f * 0.3) * 6} ${560 - Math.abs(Math.sin(f * 0.3)) * 18}) rotate(-24) scale(${1.5 + 0.08 * Math.sin(f * 0.3)})`}>
          <rect x={-30} y={-20} width={70} height={130} rx={34} fill="#F4A62A" stroke={INK} strokeWidth={5} />
          <circle cx={0} cy={-34} r={44} fill={SKIN} stroke={INK} strokeWidth={5} />
          <rect x={-12} y={-130} width={26} height={96} rx={13} fill={SKIN} stroke={INK} strokeWidth={5} />
        </g>
      )}
      {gest === 'none' && <Mic />}
      {/* cabeza */}
      <g transform={`translate(0 ${bob}) rotate(${rot} 300 470)`}>
        <circle cx={150} cy={345} r={30} fill={SKIN} stroke={INK} strokeWidth={5} />
        <circle cx={450} cy={345} r={30} fill={SKIN} stroke={INK} strokeWidth={5} />
        <ellipse cx={300} cy={330} rx={152} ry={142} fill={SKIN} stroke={INK} strokeWidth={6} />
        <path d="M146 318 C128 170 238 118 300 130 C372 112 478 170 454 318 C438 246 392 226 300 232 C214 226 166 244 146 318 Z" fill="#3B2418" stroke={INK} strokeWidth={5} />
        <path d="M250 150 L272 78 L304 138 L340 72 L352 150 Z" fill="#3B2418" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <Brow side={-1} y={282} b={e.brow} tilt={e.tilt} color="#3B2418" />
        <Brow side={1} y={282} b={e.brow} tilt={e.tilt} color="#3B2418" skew={emo === 'doubt' ? -14 : 0} />
        <Eye x={238} y={334} open={open} look={look} />
        <Eye x={362} y={334} open={open} look={look} />
        <path d="M300 352 Q286 378 300 384 Q312 384 314 376" stroke={SKIN_D} strokeWidth={6} fill="none" strokeLinecap="round" />
        <circle cx={196} cy={392} r={22} fill="#F28A7E" opacity={0.55} />
        <circle cx={404} cy={392} r={22} fill="#F28A7E" opacity={0.55} />
        <Mouth y={424} m={m * e.open} smile={e.smile} />
      </g>
      {/* silla alta / libros: sugiere que es pequeño */}
    </svg>
  );
};

type BEx = 'skeptic' | 'shock' | 'amazed' | 'curious';
export const Beto: React.FC<{f: number; ex: BEx}> = ({f, ex}) => {
  const bob = Math.sin(f * 0.18) * 3;
  const nod = ex === 'amazed' ? Math.sin(f * 0.35) * 4 : 0;
  const blinkP = (f % 110) / 110;
  const blink = blinkP > 0.94 ? 1 - Math.abs(blinkP - 0.97) / 0.03 : 0;
  const sh = ex === 'shock' ? ease((f % 600) / 8) : 0;
  const open = (ex === 'shock' ? 1.25 : ex === 'skeptic' ? 0.55 : 1) * (1 - blink * 0.9);
  const mouthO = ex === 'shock' ? 0.7 * sh + 0.1 : ex === 'amazed' ? 0.3 : 0;
  return (
    <svg width={1080} height={1260} viewBox="0 0 600 700" style={{overflow: 'visible'}}>
      <g transform={`translate(0 ${bob})`}>
        <path d="M30 720 C30 570 110 510 200 497 L400 497 C490 510 570 570 570 720 Z" fill="#5E8F5A" stroke={INK} strokeWidth={6} />
        <path d="M200 497 L300 600 L400 497 Z" fill="#F4EDE2" stroke={INK} strokeWidth={5} />
        <rect x={252} y={440} width={96} height={70} fill="#C58B63" />
      </g>
      <g transform={`translate(0 ${bob + nod}) rotate(${ex === 'skeptic' ? -5 : ex === 'curious' ? 5 : 0} 300 480)`}>
        <circle cx={128} cy={345} r={34} fill="#D9A37A" stroke={INK} strokeWidth={5} />
        <circle cx={472} cy={345} r={34} fill="#D9A37A" stroke={INK} strokeWidth={5} />
        <ellipse cx={300} cy={335} rx={170} ry={150} fill="#D9A37A" stroke={INK} strokeWidth={6} />
        {/* gorra */}
        <path d="M128 296 C128 150 230 112 300 112 C380 112 472 150 472 296 C400 262 200 262 128 296 Z" fill="#C8372D" stroke={INK} strokeWidth={6} />
        <path d="M110 300 C200 262 400 262 490 300 C440 330 160 330 110 300 Z" fill="#9E2820" stroke={INK} strokeWidth={5} />
        <circle cx={300} cy={118} r={14} fill="#9E2820" />
        {/* cejas */}
        <Brow side={-1} y={300} b={ex === 'shock' ? 1.3 : ex === 'amazed' ? 0.9 : ex === 'skeptic' ? -0.2 : 0.5} tilt={ex === 'skeptic' ? 0.35 : 0} color="#6B6B6B" w={18} />
        <Brow side={1} y={300} b={ex === 'shock' ? 1.3 : ex === 'amazed' ? 0.9 : ex === 'skeptic' ? 1.1 : 0.5} tilt={0} color="#6B6B6B" w={18} />
        {/* lentes */}
        <circle cx={240} cy={346} r={46} fill="rgba(255,255,255,0.35)" stroke="#222" strokeWidth={8} />
        <circle cx={360} cy={346} r={46} fill="rgba(255,255,255,0.35)" stroke="#222" strokeWidth={8} />
        <line x1={286} y1={344} x2={314} y2={344} stroke="#222" strokeWidth={8} />
        <Eye x={240} y={346} open={open} look={ex === 'skeptic' ? [-0.6, -0.3] : [0.3, 0]} r={24} />
        <Eye x={360} y={346} open={open} look={ex === 'skeptic' ? [-0.6, -0.3] : [0.3, 0]} r={24} />
        <path d="M296 372 Q276 408 300 414 Q326 408 304 372" fill="#C58B63" stroke={INK} strokeWidth={4} />
        {/* boca + bigote */}
        {mouthO > 0.15 ? (
          <ellipse cx={300} cy={470} rx={30} ry={14 + mouthO * 40} fill="#6B1F28" stroke="#4A141B" strokeWidth={5} />
        ) : (
          <path d={`M252 ${ex === 'skeptic' ? 474 : 468} Q300 ${ex === 'skeptic' ? 462 : 486} 350 ${ex === 'skeptic' ? 482 : 468}`} stroke="#6B2A2A" strokeWidth={9} fill="none" strokeLinecap="round" />
        )}
        <path d="M300 428 C270 404 200 416 190 446 C220 438 262 444 300 436 C338 444 380 438 410 446 C400 416 330 404 300 428 Z" fill="#8A8A8A" stroke={INK} strokeWidth={5} />
      </g>
      {/* manos */}
      {ex === 'skeptic' && (
        <g>
          <path d="M470 700 Q470 560 340 500" stroke="#5E8F5A" strokeWidth={66} strokeLinecap="round" fill="none" />
          <circle cx={326} cy={494} r={42} fill="#D9A37A" stroke={INK} strokeWidth={5} />
        </g>
      )}
      {ex === 'shock' && (
        <g>
          <path d="M80 700 Q40 520 90 380" stroke="#5E8F5A" strokeWidth={66} strokeLinecap="round" fill="none" />
          <circle cx={92} cy={360 + Math.sin(f) * 3} r={46} fill="#D9A37A" stroke={INK} strokeWidth={5} />
          <path d="M520 700 Q560 520 510 380" stroke="#5E8F5A" strokeWidth={66} strokeLinecap="round" fill="none" />
          <circle cx={508} cy={360 + Math.cos(f) * 3} r={46} fill="#D9A37A" stroke={INK} strokeWidth={5} />
        </g>
      )}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Fondos de estudio                                                   */
/* ------------------------------------------------------------------ */
const Studio: React.FC<{kind: 'kid' | 'beto'; f: number; peak: boolean}> = ({kind, f, peak}) => {
  const kid = kind === 'kid';
  const c1 = kid ? '#14394A' : '#4A2B2B';
  const c2 = kid ? '#0A1A28' : '#2A1616';
  return (
    <AbsoluteFill style={{background: `radial-gradient(900px 900px at 50% 40%, ${c1}, ${c2})`}}>
      {Array.from({length: 6}, (_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 60 + (i % 3) * 330,
            top: 90 + Math.floor(i / 3) * 360,
            width: 290,
            height: 320,
            borderRadius: 26,
            background: kid ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.035)',
            boxShadow: 'inset 0 0 0 3px rgba(255,255,255,0.05)',
          }}
        />
      ))}
      {kid ? (
        <div style={{position: 'absolute', top: 70, width: W, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 44, letterSpacing: 6, color: '#FF7AC3', textShadow: '0 0 18px #FF4FB0, 0 0 40px #FF4FB0', opacity: 0.82 + 0.18 * Math.sin(f / 5)}}>
          EL PODCAST DE NICO
        </div>
      ) : (
        <div style={{position: 'absolute', top: 70, left: 90, display: 'flex', gap: 14}}>
          {['#E9C46A', '#9BC1BC', '#E76F51', '#8AB17D'].map((c, i) => (
            <div key={i} style={{width: 56, height: 180 + (i % 2) * 40, background: c, borderRadius: 6, opacity: 0.55}} />
          ))}
        </div>
      )}
      {peak && (
        <AbsoluteFill style={{opacity: 0.35}}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            {Array.from({length: 24}, (_, i) => {
              const a = (i / 24) * Math.PI * 2 + f * 0.012;
              const x1 = 540 + Math.cos(a) * 200, y1 = 780 + Math.sin(a) * 200;
              const x2 = 540 + Math.cos(a + 0.09) * 1500, y2 = 780 + Math.sin(a + 0.09) * 1500;
              return <polygon key={i} points={`${x1},${y1} ${x2},${y2} ${540 + Math.cos(a - 0.09) * 1500},${780 + Math.sin(a - 0.09) * 1500}`} fill={i % 2 ? '#FFC93C' : 'transparent'} opacity={0.35} />;
            })}
          </svg>
        </AbsoluteFill>
      )}
      <div style={{position: 'absolute', left: 0, bottom: 0, width: W, height: 360, background: 'linear-gradient(0deg,#0A0F18 20%,transparent)'}} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* B-roll                                                              */
/* ------------------------------------------------------------------ */
const Coin: React.FC<{x: number; y: number; r: number; label?: string; s?: number; dull?: boolean; rot?: number}> = ({x, y, r, label = '$', s = 1, dull, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <circle r={r} fill={dull ? '#B89B3E' : GOLD} stroke="#8A5A00" strokeWidth={r * 0.07} />
    <circle r={r * 0.78} fill="none" stroke={dull ? '#8E7424' : '#E0A100'} strokeWidth={r * 0.06} />
    <text y={r * 0.28} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={r * 0.9} fill={dull ? '#6E5A18' : '#9A6700'}>
      {label}
    </text>
    <path d={`M${-r * 0.6} ${-r * 0.3} A${r * 0.7} ${r * 0.7} 0 0 1 ${r * 0.1} ${-r * 0.68}`} stroke="#fff" strokeOpacity={0.55} strokeWidth={r * 0.07} fill="none" strokeLinecap="round" />
  </g>
);

const BrollBg: React.FC<{c1: string; c2: string}> = ({c1, c2}) => (
  <AbsoluteFill style={{background: `linear-gradient(180deg,${c1},${c2})`}} />
);

const SingleCoin: React.FC<{f: number; d: number}> = ({f, d}) => {
  const p = cl(f / d);
  const s = lerp(1.25, 0.55, ease(p));
  return (
    <AbsoluteFill>
      <BrollBg c1="#2A3A52" c2="#10161F" />
      <div style={{position: 'absolute', left: 0, top: 1000, width: W, height: 920, background: '#4A3424'}} />
      <div style={{position: 'absolute', left: 0, top: 1000, width: W, height: 14, background: '#6B4A33'}} />
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <ellipse cx={540} cy={1000} rx={170 * s} ry={26 * s} fill="rgba(0,0,0,0.35)" />
        <Coin x={540} y={1000 - 150 * s + Math.sin(f / 9) * 4} r={150 * s} label="$1" dull />
        {p > 0.45 && (
          <text x={780} y={760} fontFamily={FONT} fontWeight={700} fontSize={70} fill="#9fb0c9" opacity={cl((p - 0.45) * 4) * (0.6 + 0.4 * Math.sin(f / 6))}>
            ...
          </text>
        )}
      </svg>
    </AbsoluteFill>
  );
};

const Doubling: React.FC<{f: number}> = ({f}) => {
  const rows = [1, 2, 4, 8, 16];
  const stageEvery = F(0.62);
  let k = 0;
  const items: JSX.Element[] = [];
  rows.forEach((n, ri) => {
    const start = ri * stageEvery;
    const per = n > 8 ? 8 : n;
    const lines = n > 8 ? 2 : 1;
    for (let li = 0; li < lines; li++) {
      const y = 330 + (ri + (ri === 4 ? li * 0.62 : 0)) * 220;
      for (let i = 0; i < per; i++) {
        const sc = sp(f, start + i * 1.5 + li * 6);
        const sz = 52;
        const gap = 118;
        const x = 540 + (i - (per - 1) / 2) * gap;
        items.push(<Coin key={k++} x={x} y={y} r={sz} s={sc} label="$" />);
      }
    }
  });
  const arrows = [1, 2, 3, 4].map((r) => {
    const a = sp(f, r * stageEvery - 4);
    return (
      <text key={r} x={118} y={330 + r * 220 - 80} fontFamily={FONT} fontWeight={700} fontSize={64} fill="#FFFFFF" opacity={a} transform={`scale(${a})`} style={{transformOrigin: '118px 0'}}>
        ×2
      </text>
    );
  });
  const shake = f > stageEvery * 4 ? Math.sin(f * 1.7) * 3 : 0;
  return (
    <AbsoluteFill>
      <BrollBg c1="#1D4B43" c2="#0A1A1C" />
      <svg width={W} height={H} style={{position: 'absolute', transform: `translateX(${shake}px)`}}>
        {arrows}
        {items}
      </svg>
    </AbsoluteFill>
  );
};

const Snowball: React.FC<{f: number; d: number}> = ({f, d}) => {
  const p = cl(f / d);
  const r = lerp(46, 340, p * p);
  const x = lerp(160, 760, p);
  const yLine = (xx: number) => 640 + (xx - 100) * 0.62;
  const y = yLine(x) - r - 8;
  const rot = p * 900;
  const stickers = Array.from({length: 7}, (_, i) => i);
  return (
    <AbsoluteFill>
      <BrollBg c1="#5A8FC7" c2="#1E3556" />
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <polygon points={`0,${yLine(0)} ${W},${yLine(W)} ${W},${H} 0,${H}`} fill="#EAF2FA" />
        <polygon points={`0,${yLine(0) + 40} ${W},${yLine(W) + 40} ${W},${H} 0,${H}`} fill="#CFE0F0" />
        <g transform={`translate(${x} ${y}) rotate(${rot})`}>
          <circle r={r} fill="#fff" stroke="#9FB9D4" strokeWidth={6} />
          {stickers.map((i) => {
            const a = (i / 7) * Math.PI * 2;
            return <Coin key={i} x={Math.cos(a) * r * 0.58} y={Math.sin(a) * r * 0.58} r={r * 0.19} rot={-rot} s={cl(p * 4 - i * 0.35)} />;
          })}
        </g>
        {/* rastro de monedas */}
        {Array.from({length: 6}, (_, i) => {
          const xx = lerp(160, x, i / 6);
          return <Coin key={i} x={xx} y={yLine(xx) - 22} r={20} s={cl((p - i / 8) * 5)} />;
        })}
      </svg>
      <div style={{position: 'absolute', left: 60, top: 190, fontFamily: FONT, fontWeight: 700, fontSize: 72, color: '#fff', textShadow: '0 4px 0 #1E3556', opacity: ease(f / 10)}}>
        interés
      </div>
      <div style={{position: 'absolute', left: 60, top: 290, fontFamily: FONT, fontWeight: 700, fontSize: 88, color: KEY, textShadow: '0 4px 0 #6B4A00', opacity: ease((f - F(1.3)) / 10), transform: `scale(${0.7 + 0.3 * sp(f, F(1.3))})`, transformOrigin: 'left'}}>
        del interés
      </div>
    </AbsoluteFill>
  );
};

const Hourglass: React.FC<{f: number; d: number}> = ({f, d}) => {
  const p = cl(f / d);
  const top = 1 - p;
  const years = Math.floor(lerp(1, 30, p));
  const wob = Math.sin(f / 7) * 2;
  return (
    <AbsoluteFill>
      <BrollBg c1="#3B2A5E" c2="#120C22" />
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <g transform={`translate(540 ${880 + wob}) scale(1.9)`}>
          <path d="M-120 -230 L120 -230 L120 -200 C120 -110 20 -60 8 0 C20 60 120 110 120 200 L120 230 L-120 230 L-120 200 C-120 110 -20 60 -8 0 C-20 -60 -120 -110 -120 -200 Z" fill="rgba(255,255,255,0.12)" stroke="#fff" strokeWidth={7} strokeLinejoin="round" />
          <clipPath id="hgT"><path d="M-112 -222 L112 -222 L112 -200 C112 -112 14 -64 2 -4 L-2 -4 C-14 -64 -112 -112 -112 -200 Z" /></clipPath>
          <clipPath id="hgB"><path d="M-2 4 L2 4 C14 64 112 112 112 200 L112 222 L-112 222 L-112 200 C-112 112 -14 64 -2 4 Z" /></clipPath>
          <rect x={-120} y={-222 + (1 - top) * 220} width={240} height={222} fill={GOLD} clipPath="url(#hgT)" />
          <rect x={-120} y={222 - (1 - top) * 200} width={240} height={222} fill={GOLD} clipPath="url(#hgB)" />
          {p < 0.98 && <rect x={-3} y={-4} width={6} height={226} fill={GOLD} />}
          <rect x={-136} y={-250} width={272} height={26} rx={10} fill="#D5453F" />
          <rect x={-136} y={224} width={272} height={26} rx={10} fill="#D5453F" />
        </g>
      </svg>
      <div style={{position: 'absolute', top: 190, width: W, textAlign: 'center', fontFamily: FONT, fontWeight: 700, color: '#fff'}}>
        <div style={{fontSize: 170, lineHeight: 1, color: KEY, textShadow: '0 6px 0 #6B4A00'}}>{years}</div>
        <div style={{fontSize: 56, letterSpacing: 10}}>{years === 1 ? 'AÑO' : 'AÑOS'}</div>
      </div>
    </AbsoluteFill>
  );
};

const Sprout: React.FC<{f: number; d: number}> = ({f, d}) => {
  const p = ease(f / d);
  const h = lerp(40, 700, p);
  const leaves = Array.from({length: 9}, (_, i) => i);
  return (
    <AbsoluteFill>
      <BrollBg c1="#F4B860" c2="#C9663B" />
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <circle cx={540} cy={680} r={190} fill="#FFE3A3" opacity={0.7} />
        <path d={`M0 1560 Q540 1440 ${W} 1560 L${W} ${H} L0 ${H} Z`} fill="#6B4A2E" />
        <path d={`M0 1560 Q540 1440 ${W} 1560`} stroke="#4E8A3A" strokeWidth={26} fill="none" />
        <path d={`M540 1500 C530 ${1500 - h * 0.5} 556 ${1500 - h * 0.8} 540 ${1500 - h}`} stroke="#6A4630" strokeWidth={lerp(14, 46, p)} strokeLinecap="round" fill="none" />
        {leaves.map((i) => {
          const a = (i / 9) * Math.PI * 2;
          const pp = cl(p * 1.6 - 0.35 - i * 0.04);
          return (
            <g key={i}>
              <ellipse cx={540 + Math.cos(a) * 250 * pp} cy={1500 - h + Math.sin(a) * 160 * pp} rx={110 * pp} ry={70 * pp} fill={i % 2 ? '#5FA84A' : '#4E8A3A'} />
              <Coin x={540 + Math.cos(a + 0.4) * 240 * pp} y={1500 - h + Math.sin(a + 0.4) * 170 * pp} r={36 * pp} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const TitleStamp: React.FC<{f: number}> = ({f}) => {
  const s = sp(f, 0, 9, 200);
  return (
    <div style={{position: 'absolute', left: 0, top: 560, width: W, textAlign: 'center', transform: `scale(${0.2 + 0.8 * s}) rotate(${-6 + (1 - s) * 14}deg)`, opacity: cl(s * 2)}}>
      <div style={{display: 'inline-block', fontFamily: FONT, fontWeight: 700, fontSize: 112, lineHeight: 1.05, color: '#fff', background: '#E4405F', padding: '16px 44px 20px', borderRadius: 24, border: '8px solid #fff', boxShadow: '0 14px 0 rgba(0,0,0,0.35)'}}>
        INTERÉS
        <br />
        COMPUESTO
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Subtítulos estilo "pódcast"                                         */
/* ------------------------------------------------------------------ */
type Tok = {w: string; key: boolean};
const tokens = (text: string): Tok[] => {
  const out: Tok[] = [];
  text.split(/(\*[^*]+\*)/).forEach((part) => {
    if (!part) return;
    const key = part.startsWith('*');
    part
      .replace(/\*/g, '')
      .split(/\s+/)
      .filter(Boolean)
      .forEach((w) => out.push({w, key}));
  });
  return out;
};
const group = (toks: Tok[]) => {
  const g: Tok[][] = [];
  let cur: Tok[] = [];
  let len = 0;
  toks.forEach((t) => {
    if (cur.length && (cur.length >= 3 || len + t.w.length > 20)) {
      g.push(cur);
      cur = [];
      len = 0;
    }
    cur.push(t);
    len += t.w.length + 1;
  });
  if (cur.length) g.push(cur);
  return g;
};

const Captions: React.FC<{t: number; f: number}> = ({t, f}) => {
  const idx = beats.findIndex((b, i) => t >= b.start - 0.04 && t < (beats[i + 1] ? Math.min(b.end + 0.3, beats[i + 1].start - 0.02) : b.end + 0.5));
  if (idx < 0) return null;
  const b = beats[idx];
  const gs = group(tokens(b.text));
  const tot = gs.reduce((n, g) => n + g.reduce((m, x) => m + x.w.length, 0), 0);
  let acc = 0;
  let cur = gs[0];
  let st = b.start;
  const dur = b.end - b.start;
  for (const g of gs) {
    const a = b.start + (dur * acc) / tot;
    if (t >= a - 0.02) {
      cur = g;
      st = a;
    }
    acc += g.reduce((m, x) => m + x.w.length, 0);
  }
  const k = sp(f, Math.floor(st * FPS), 10, 220);
  const big = b.emo === 'peak' || b.emo === 'reveal';
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: 1430, display: 'flex', justifyContent: 'center'}}>
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: big ? 104 : 88, lineHeight: 1.12, textAlign: 'center', color: '#fff', textShadow: '0 5px 0 rgba(0,0,0,0.55), 0 0 22px rgba(0,0,0,0.6)', transform: `scale(${0.8 + 0.2 * k})`, opacity: cl(k * 2)}}>
        {cur.map((tk, i) => (
          <span key={i} style={{color: tk.key ? KEY : '#fff'}}>
            {tk.w}{' '}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Guion de planos                                                     */
/* ------------------------------------------------------------------ */
type Shot = {a: number; b: number; kind: string; z0?: number; z1?: number; gest?: 'none' | 'raise' | 'point'; ex?: BEx; rot?: number};
const SHOTS: Shot[] = [
  {a: 0, b: 2.75, kind: 'kid', z0: 1.0, z1: 1.12},
  {a: 2.75, b: 5.25, kind: 'kid', z0: 1.28, z1: 1.42},
  {a: 5.25, b: 8.15, kind: 'coin'},
  {a: 8.15, b: 10.15, kind: 'beto', ex: 'skeptic', z0: 1.05, z1: 1.14},
  {a: 10.15, b: 13.45, kind: 'kid', gest: 'raise', z0: 1.1, z1: 1.0, rot: 2},
  {a: 13.45, b: 17.1, kind: 'double'},
  {a: 17.1, b: 20.5, kind: 'kidtitle', z0: 1.0, z1: 1.12},
  {a: 20.5, b: 25.15, kind: 'snow'},
  {a: 25.15, b: 28.95, kind: 'kid', z0: 1.2, z1: 1.32},
  {a: 28.95, b: 30.95, kind: 'kid', gest: 'point', z0: 1.0, z1: 1.1},
  {a: 30.95, b: 32.65, kind: 'beto', ex: 'curious', z0: 1.0, z1: 1.1},
  {a: 32.65, b: 36.1, kind: 'hour'},
  {a: 36.1, b: 39.35, kind: 'kid', z0: 1.05, z1: 1.0, rot: -1.5},
  {a: 39.35, b: 41.2, kind: 'sprout'},
  {a: 41.2, b: 43.9, kind: 'kid', gest: 'raise', z0: 1.15, z1: 1.0},
  {a: 43.9, b: 99, kind: 'end'},
];

const Vignette = () => <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.5))', pointerEvents: 'none'}} />;

export const Replica: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const shot = SHOTS.find((s) => t >= s.a && t < s.b) || SHOTS[SHOTS.length - 1];
  const lf = f - F(shot.a);
  const sd = F(Math.min(shot.b, timing.total) - shot.a);
  const beat = beatAt(t);
  const emo = beat.emo;
  const peak = emo === 'peak';
  const prog = cl(lf / Math.max(1, sd));
  const z = lerp(shot.z0 ?? 1, shot.z1 ?? 1, prog) + (peak ? 0.03 * Math.sin(f * 1.6) : 0) + 0.12 * Math.exp(-lf / 5) * (lf < 12 ? 1 : 0) * 0.5;
  const rot = shot.rot ? shot.rot * (1 - prog * 2) : 0;
  const flash = lf < 4 ? 0.55 * (1 - lf / 4) : 0;

  let body: React.ReactNode = null;
  const charWrap = (child: React.ReactNode) => (
    <div style={{position: 'absolute', left: 0, top: 150, width: W, height: 1260, transformOrigin: '540px 760px', transform: `scale(${z}) rotate(${rot}deg)`}}>{child}</div>
  );
  switch (shot.kind) {
    case 'kid':
    case 'kidtitle':
      body = (
        <>
          <Studio kind="kid" f={f} peak={peak} />
          {charWrap(<Kid f={f} t={t} emo={emo} gest={shot.gest || 'none'} />)}
          {shot.kind === 'kidtitle' && lf > F(1.1) && <TitleStamp f={lf - F(1.1)} />}
        </>
      );
      break;
    case 'beto':
      body = (
        <>
          <Studio kind="beto" f={f} peak={false} />
          {charWrap(<Beto f={f} ex={shot.ex || 'skeptic'} />)}
        </>
      );
      break;
    case 'coin':
      body = <SingleCoin f={lf} d={sd} />;
      break;
    case 'double':
      body = <Doubling f={lf} />;
      break;
    case 'snow':
      body = <Snowball f={lf} d={sd} />;
      break;
    case 'hour':
      body = <Hourglass f={lf} d={sd - 8} />;
      break;
    case 'sprout':
      body = <Sprout f={lf} d={sd * 0.9} />;
      break;
    case 'end':
      body = (
        <>
          <Studio kind="kid" f={f} peak={false} />
          <div style={{position: 'absolute', left: 0, top: 330, width: W, transform: `scale(${0.62 + 0.05 * sp(lf, 0)})`, transformOrigin: '540px 0'}}>
            <Kid f={f} t={t} emo="hype" gest="raise" />
          </div>
        </>
      );
      break;
  }
  const endP = shot.kind === 'end' ? sp(lf, 4) : 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', inset: 0, transform: shot.kind === 'coin' || shot.kind === 'double' || shot.kind === 'snow' || shot.kind === 'hour' || shot.kind === 'sprout' ? `scale(${1 + prog * 0.05})` : undefined}}>{body}</div>
      <Vignette />
      {shot.kind !== 'end' && <Captions t={t} f={f} />}
      {shot.kind === 'end' && (
        <>
          <div style={{position: 'absolute', top: 1180, width: W, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 130, color: KEY, textShadow: '0 8px 0 rgba(0,0,0,0.5)', transform: `scale(${0.5 + 0.5 * endP})`, opacity: cl(endP * 2)}}>
            EMPIEZA HOY
          </div>
          <div style={{position: 'absolute', bottom: 120, left: 70, right: 70, textAlign: 'center', fontFamily: FONT, fontWeight: 400, fontSize: 28, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4, opacity: cl((lf - 20) / 12)}}>
            Contenido educativo. Los ejemplos son ilustrativos y no representan una promesa de rendimientos.
          </div>
        </>
      )}
      {flash > 0 && <AbsoluteFill style={{background: '#fff', opacity: flash}} />}
      <Audio src={staticFile('replica/voz.wav')} />
    </AbsoluteFill>
  );
};

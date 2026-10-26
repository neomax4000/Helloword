import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {flip} from '@remotion/transitions/flip';
import {iris} from '@remotion/transitions/iris';
import {clockWipe} from '@remotion/transitions/clock-wipe';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {noise2D} from '@remotion/noise';
import {evolvePath} from '@remotion/paths';
import {Star} from '@remotion/shapes';
import {LightLeak} from '@remotion/light-leaks';
import data from '../public/maya/words.json';
import {FONT, FPS, W} from './theme';
import {F, cl, ease, sp} from './narrador';
import {NAVY, NAVY2, OCRE, WARM, GRAY, OK, THEMES, ThemeBg} from './banca';


type Word = {i: number; w: string; s: number; e: number; k: boolean; p: number; spk: string};
const words = data.words as Word[];
const lines = data.lines as {p: number; spk: string; s: number; e: number}[];
const LAST = words[words.length - 1];
export const MY_TOTAL = data.total;
const TW = (i: number) => words[i].s;
const L = (p: number) => ({w0: words.findIndex((w) => w.p === p)});

const SC = [
  {p: 0, k: 'hook', bg: 0},
  {p: 2, k: 'sigue', bg: 0},
  {p: 4, k: 'intro', bg: 1},
  {p: 5, k: 'equipo', bg: 1},
  {p: 7, k: 'objetivo', bg: 2},
  {p: 9, k: 'riesgo', bg: 2},
  {p: 11, k: 'liq', bg: 3},
  {p: 13, k: 'resumen', bg: 4},
  {p: 17, k: 'end', bg: 0},
];
const TD = 12;
const starts = SC.map((s, i) => (i === 0 ? 0 : F(lines[s.p].s - 0.14)));
const totalF = F(MY_TOTAL);
const TRANS = [
  slide({direction: 'from-right'}),
  iris({width: 1080, height: 1920}),
  wipe({direction: 'from-bottom-left'}),
  flip({direction: 'from-right'}),
  clockWipe({width: 1080, height: 1920}),
  slide({direction: 'from-bottom'}),
  wipe({direction: 'from-right'}),
  iris({width: 1080, height: 1920}),
];

type P = {f: number; at: (i: number) => number; dark: boolean};

const Particles: React.FC<{f: number; dark: boolean; seed: string}> = ({f, dark, seed}) => (
  <AbsoluteFill>
    {new Array(26).fill(0).map((_, i) => {
      const x = 540 + noise2D(seed + 'x', i * 0.37, f / 160) * 620;
      const y = 960 + noise2D(seed + 'y', i * 0.53, f / 170) * 1050;
      const r = 4 + (i % 4) * 3;
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: r, height: r, borderRadius: r, background: i % 3 === 0 ? OCRE : dark ? 'rgba(4,30,66,0.35)' : 'rgba(245,243,238,0.35)', opacity: 0.6}} />;
    })}
  </AbsoluteFill>
);
const Head: React.FC<{light: string; bold: string; f: number; d?: number; dark: boolean; size?: number; top?: number}> = ({light, bold, f, d = 0, dark, size = 92, top = 260}) => {
  const k = sp(f, d, 12, 200);
  const k2 = sp(f, d + 5, 12, 200);
  return (
    <div style={{position: 'absolute', left: 96, right: 70, top, fontFamily: FONT, fontSize: size, lineHeight: 1.04, color: dark ? NAVY : WARM, textTransform: 'uppercase'}}>
      <div style={{fontWeight: 300, transform: `translateX(${(1 - k) * -120}px)`, opacity: cl(k * 1.5), filter: `blur(${(1 - cl(k)) * 10}px)`}}>{light}</div>
      <div style={{fontWeight: 700, transform: `translateX(${(1 - k2) * 160}px)`, opacity: cl(k2 * 1.5), filter: `blur(${(1 - cl(k2)) * 10}px)`}}>{bold}</div>
    </div>
  );
};
const Note: React.FC<{text: string; f: number; d?: number; dark: boolean; top?: number}> = ({text, f, d = 0, dark, top = 1340}) => (
  <div style={{position: 'absolute', left: 96, right: 96, top, fontFamily: FONT, fontSize: 28, color: dark ? GRAY : 'rgba(245,243,238,0.75)', opacity: ease((f - d) / 10)}}>{text}</div>
);
const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>{children}</svg>
);
const Pill: React.FC<{text: string; x: number; y: number; k: number; c?: string; tc?: string; size?: number}> = ({text, x, y, k, c = OCRE, tc = NAVY, size = 52}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${k})`, background: c, color: tc, fontFamily: FONT, fontWeight: 700, fontSize: size, padding: `${size * 0.3}px ${size * 0.7}px`, borderRadius: 100, whiteSpace: 'nowrap', boxShadow: '0 16px 40px rgba(0,0,0,0.25)'}}>{text}</div>
);
const Person: React.FC<{who: 'ana' | 'rob'; s?: number; wave?: number}> = ({who, s = 1, wave = 0}) => {
  const ana = who === 'ana';
  const skin = ana ? '#E8B48F' : '#D9A47E';
  const hair = ana ? '#3B2418' : '#B8B8B8';
  const shirt = ana ? OCRE : '#2E5C8A';
  return (
    <g transform={`scale(${s})`}>
      <path d="M-120 230 Q-120 110 0 110 Q120 110 120 230Z" fill={shirt} />
      {ana && <path d="M-95 -40 Q-110 120 -60 150 L60 150 Q110 120 95 -40Z" fill={hair} />}
      <rect x={-22} y={70} width={44} height={50} rx={14} fill={skin} />
      <circle cy={0} r={92} fill={skin} />
      {ana ? (
        <path d="M-96 -10 Q-100 -105 0 -105 Q100 -105 96 -10 Q60 -70 -20 -60 Q-70 -55 -96 -10Z" fill={hair} />
      ) : (
        <>
          <path d="M-90 -20 Q-92 -95 0 -98 Q92 -95 90 -20 Q80 -60 40 -66 Q-20 -72 -90 -20Z" fill={hair} />
          <g fill="none" stroke={NAVY} strokeWidth={6}>
            <circle cx={-34} cy={6} r={24} />
            <circle cx={34} cy={6} r={24} />
            <path d="M-10 6 H10" />
          </g>
          <path d="M-40 52 Q0 40 40 52" stroke={hair} strokeWidth={12} strokeLinecap="round" fill="none" />
        </>
      )}
      {ana && (
        <>
          <circle cx={-32} cy={8} r={9} fill={NAVY} />
          <circle cx={32} cy={8} r={9} fill={NAVY} />
        </>
      )}
      {!ana && (
        <>
          <circle cx={-34} cy={6} r={7} fill={NAVY} />
          <circle cx={34} cy={6} r={7} fill={NAVY} />
        </>
      )}
      <path d="M-28 40 Q0 62 28 40" stroke={NAVY} strokeWidth={7} strokeLinecap="round" fill="none" />
      {wave > 0 && <g transform={`translate(120 160) rotate(${-30 + Math.sin(wave) * 20})`}><rect x={-14} y={-110} width={28} height={110} rx={14} fill={shirt} /><circle cy={-115} r={22} fill={skin} /></g>}
    </g>
  );
};
/* ---------- asesor ---------- */
const Asesor: React.FC<{s?: number; talk?: number}> = ({s = 1, talk = 0}) => (
  <g transform={`scale(${s})`}>
    <path d="M-125 230 Q-125 110 0 110 Q125 110 125 230Z" fill={NAVY} />
    <path d="M-40 112 L0 175 L40 112Z" fill="#FFFFFF" />
    <path d="M0 125 L-14 150 L0 215 L14 150Z" fill={OCRE} />
    <rect x={-22} y={70} width={44} height={50} rx={14} fill="#C98F6B" />
    <circle r={92} fill="#C98F6B" />
    <path d="M-92 -18 Q-95 -100 0 -102 Q95 -100 92 -18 Q70 -70 10 -62 Q-50 -58 -92 -18Z" fill="#2A1C14" />
    <circle cx={-32} cy={8} r={9} fill={NAVY} />
    <circle cx={32} cy={8} r={9} fill={NAVY} />
    <path d="M-44 -20 Q-32 -28 -18 -22 M18 -22 Q32 -28 44 -20" stroke="#2A1C14" strokeWidth={6} fill="none" strokeLinecap="round" />
    <ellipse cy={46} rx={24} ry={6 + 10 * talk} fill={NAVY} />
  </g>
);

/* hablantes arriba: el que habla se agranda */
const Speakers: React.FC<{f: number; g: number; dark: boolean}> = ({f, g, dark}) => {
  const t = g / FPS;
  const ln = lines.find((l) => t >= l.s - 0.05 && t <= l.e + 0.05);
  const spk = ln ? ln.spk : null;
  const talk = spk ? 0.5 + 0.5 * Math.sin(g * 1.7) : 0;
  const box = (who: 'A' | 'B', x: number) => {
    const on = spk === who;
    const k = on ? 1.12 : 0.88;
    return (
      <g transform={`translate(${x} 330) scale(${k})`} opacity={on || !spk ? 1 : 0.55}>
        <circle r={118} fill={on ? (who === 'A' ? OCRE : WARM) : 'rgba(245,243,238,0.12)'} />
        <clipPath id={`c${who}`}><circle r={110} /></clipPath>
        <g clipPath={`url(#c${who})`}>
          <g transform="translate(0 20) scale(0.62)">{who === 'A' ? <Person who="ana" /> : <Asesor talk={on ? talk : 0} />}</g>
        </g>
        <text textAnchor="middle" y={160} fontFamily={FONT} fontWeight={700} fontSize={36} fill={dark ? NAVY : WARM}>{who === 'A' ? 'ANA' : 'ASESOR'}</text>
      </g>
    );
  };
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      {box('A', 230)}
      {box('B', 850)}
      {spk && <g transform={`translate(${spk === 'A' ? 380 : 700} 260)`} opacity={0.9}>{[0, 1, 2].map((i) => <circle key={i} cx={(spk === 'A' ? 1 : -1) * i * 28} r={9} fill={OCRE} opacity={0.4 + 0.6 * ((Math.floor(f / 5) + i) % 3 === 0 ? 1 : 0)} />)}</g>}
    </svg>
  );
};
const Big: React.FC<{a: string; b: string; f: number; d?: number; dark: boolean; top?: number; size?: number; c?: string}> = ({a, b, f, d = 0, dark, top = 575, size = 104, c = OCRE}) => {
  const k = sp(f, d, 11, 200);
  return (
    <div style={{position: 'absolute', left: 80, right: 80, top, textAlign: 'center', fontFamily: FONT, lineHeight: 1.04, color: dark ? NAVY : WARM, transform: `scale(${0.6 + 0.4 * k})`, opacity: cl(k * 2)}}>
      <div style={{fontWeight: 300, fontSize: size * 0.8}}>{a}</div>
      <div style={{fontWeight: 700, fontSize: size, color: c}}>{b}</div>
    </div>
  );
};
const SECT = ['BANCOS', 'MINERÍA', 'CEMENTO', 'TELECOM', 'TIENDAS', 'CONSUMO'];

const Hook: React.FC<P> = ({f, at, dark}) => {
  const idxD = ease((f - at(L(0).w0 + 2)) / 50);
  const upD = ease((f - at(L(0).w0 + 5)) / 45);
  const n = 40;
  const a: string[] = [];
  const b: string[] = [];
  for (let i = 0; i <= n; i++) {
    const y = -Math.sin(i / 3.2) * 55;
    if (i / n <= idxD) a.push(`${i * 21},${y}`);
    if (i / n <= upD) b.push(`${i * 21},${y - 20 - (i / n) * 110}`);
  }
  const c = dark ? NAVY : WARM;
  return (
    <AbsoluteFill>
      <Big a="¿Seguir al índice" b="o superarlo?" f={f} d={2} dark={dark} size={100} />
      <Svg>
        <g transform="translate(120 1210)">
          <line x1={0} y1={90} x2={840} y2={90} stroke={c} strokeWidth={4} opacity={0.25} />
          <polyline points={a.join(' ')} fill="none" stroke={c} strokeWidth={14} strokeLinejoin="round" strokeLinecap="round" />
          <polyline points={b.join(' ')} fill="none" stroke={OCRE} strokeWidth={10} strokeDasharray="22 14" strokeLinejoin="round" strokeLinecap="round" />
        </g>
      </Svg>
      <Pill text="ÍNDICE" x={230} y={1330} k={sp(f, at(L(0).w0 + 3) - 4, 9, 230)} c={WARM} size={40} />
      <Pill text="¿SUPERARLO?" x={760} y={950} k={sp(f, at(L(0).w0 + 6) - 4, 9, 230)} size={42} />
    </AbsoluteFill>
  );
};

const Sigue: React.FC<P> = ({f, at, dark}) => {
  const d = ease((f - at(L(2).w0 + 3)) / 60);
  const n = 40;
  const idx: string[] = [];
  const fon: string[] = [];
  for (let i = 0; i <= n; i++) {
    if (i / n > d) break;
    const y = -Math.sin(i / 3.2) * 70 + Math.sin(i / 1.3) * 12;
    idx.push(`${i * 21},${y}`);
    fon.push(`${i * 21},${y + 10}`);
  }
  const c = dark ? NAVY : WARM;
  return (
    <AbsoluteFill>
      <Big a="Seguir" b="AL ÍNDICE" f={f} d={at(L(2).w0) - 4} dark={dark} size={110} />
      <Svg>
        <g transform="translate(120 1180)">
          <line x1={0} y1={90} x2={840} y2={90} stroke={c} strokeWidth={4} opacity={0.25} />
          <polyline points={idx.join(' ')} fill="none" stroke={c} strokeWidth={8} strokeDasharray="16 12" opacity={0.7} />
          <polyline points={fon.join(' ')} fill="none" stroke="#8DB3E2" strokeWidth={14} strokeLinejoin="round" strokeLinecap="round" />
          <text x={0} y={150} fontFamily={FONT} fontWeight={600} fontSize={32} fill={c}>— — Índice   ━ ACTIVAR</text>
        </g>
      </Svg>
      <Pill text="ACTIVAR · MANEJO PASIVO" x={540} y={900} k={sp(f, at(L(2).w0 + 2) - 4, 9, 230)} c="#8DB3E2" size={44} />
    </AbsoluteFill>
  );
};

const Intro: React.FC<P> = ({f, at}) => {
  const a = sp(f, 4, 10, 220);
  const b = sp(f, 9, 10, 220);
  const logo = sp(f, at(L(4).w0 + 7) - 4);
  const lens = sp(f, at(L(4).w0 + 4) - 4, 10, 200);
  const bars = ease((f - at(L(4).w0 + 6)) / 20);
  return (
    <AbsoluteFill>
      <CameraMotionBlur shutterAngle={200} samples={5}>
        <AbsoluteFill>
          <div style={{position: 'absolute', left: 96, top: 520, fontFamily: FONT, color: WARM, lineHeight: 0.95}}>
            <div style={{fontWeight: 300, fontSize: 200, transform: `translateX(${(1 - a) * -900}px)`}}>MA</div>
            <div style={{fontWeight: 700, fontSize: 200, color: OCRE, transform: `translateX(${(1 - b) * 1000}px)`}}>YA</div>
          </div>
        </AbsoluteFill>
      </CameraMotionBlur>
      <Svg>
        <g transform={`translate(790 780) scale(${lens})`}>
          <circle r={120} fill="rgba(245,243,238,0.1)" stroke={WARM} strokeWidth={14} />
          <line x1={86} y1={86} x2={170} y2={170} stroke={WARM} strokeWidth={26} strokeLinecap="round" />
          {[-50, 0, 50].map((x, i) => (
            <rect key={i} x={x - 16} y={50 - [60, 100, 80][i] * bars} width={32} height={[60, 100, 80][i] * bars} rx={6} fill={OCRE} />
          ))}
        </g>
      </Svg>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 100, top: 960, width: 280, opacity: cl(logo * 1.5)}} />
      <div style={{position: 'absolute', left: 100, top: 1050, fontFamily: FONT, fontSize: 44, color: WARM, opacity: ease((f - at(L(4).w0 + 5)) / 10)}}>Fondo de renta variable</div>
      <Pill text="BOLSA MEXICANA" x={540} y={1230} k={sp(f, at(L(4).w0 + 11) - 4)} size={52} />
      <Sequence from={0} durationInFrames={40}>
        <AbsoluteFill style={{mixBlendMode: 'screen', opacity: 0.4}}>
          <LightLeak seed={23} hueShift={60} durationInFrames={40} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

const Equipo: React.FC<P> = ({f, at, dark}) => {
  const k = sp(f, at(L(6).w0) - 6, 10, 220);
  const pick = [1, 3, 4];
  const c = dark ? NAVY : WARM;
  return (
    <AbsoluteFill>
      <Big a="¿Quién elige" b="LAS EMPRESAS?" f={f} d={at(L(5).w0) - 4} dark={dark} size={90} />
      <Svg>
        <g transform={`translate(540 980) scale(${k})`}>
          {[-180, 0, 180].map((x, i) => (
            <g key={i} transform={`translate(${x} 0)`}>
              <circle cy={-40} r={50} fill="#C98F6B" />
              <path d="M-75 90 Q-75 10 0 10 Q75 10 75 90Z" fill={i === 1 ? OCRE : NAVY} />
            </g>
          ))}
        </g>
      </Svg>
      {SECT.map((t, i) => {
        const kk = sp(f, at(L(6).w0 + 2) + i * 2, 10, 220);
        const pi = pick.indexOf(i);
        const on = pi >= 0 ? ease((f - at(L(6).w0 + 5) - pi * 6) / 8) : 0;
        return (
          <div key={i} style={{position: 'absolute', left: 127 + i * 140, top: 1180, width: 125, height: 84, borderRadius: 18, background: pi >= 0 && on > 0.5 ? OCRE : dark ? '#FFFFFF' : NAVY2, border: `3px solid ${pi >= 0 && on > 0.5 ? NAVY : 'rgba(4,30,66,0.2)'}`, opacity: (pi < 0 && f > at(L(6).w0 + 7) ? 0.4 : 1) * cl(kk * 2), transform: `scale(${kk})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 22, color: pi >= 0 && on > 0.5 ? NAVY : c}}>{t}</div>
        );
      })}
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        {pick.map((i, pi) => {
          const on = ease((f - at(L(6).w0 + 5) - pi * 6) / 8);
          return (
            <g key={i} transform={`translate(${127 + i * 140 + 62} 1296) scale(${on})`}>
              <circle r={26} fill={OK} />
              <path d="M-12 0 L-3 10 L13 -10" stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}
      </svg>
      <Pill text="ANÁLISIS FUNDAMENTAL" x={540} y={1400} k={sp(f, at(L(6).w0 + 6) - 4)} size={44} />
    </AbsoluteFill>
  );
};

const Objetivo: React.FC<P> = ({f, at, dark}) => {
  const b1 = ease((f - at(L(8).w0 + 3)) / 18);
  const b2 = ease((f - at(L(8).w0 + 2)) / 24);
  const c = dark ? NAVY : WARM;
  return (
    <AbsoluteFill>
      <Big a="¿Qué" b="BUSCA?" f={f} d={at(L(7).w0) - 4} dark={dark} size={110} />
      <Svg>
        <line x1={150} x2={930} y1={1230} y2={1230} stroke={c} strokeWidth={4} opacity={0.4} />
        <rect x={230} y={1230 - 300 * b1} width={240} height={300 * b1} rx={20} fill={GRAY} />
        <rect x={610} y={1230 - 390 * b2} width={240} height={390 * b2} rx={20} fill={OCRE} />
        <text x={350} y={1290} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill={c} opacity={b1}>IPC Compuesto</text>
        <text x={730} y={1290} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill={c} opacity={b2}>MAYA busca</text>
        <text x={730} y={1230 - 390 * b2 - 30} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={dark ? NAVY2 : OCRE} opacity={b2}>superarlo</text>
      </Svg>
      <Note text="Ilustrativo. Es un objetivo de largo plazo, no una garantía." f={f} d={at(L(8).w0 + 7)} dark={dark} top={1360} />
    </AbsoluteFill>
  );
};

const Riesgo: React.FC<P> = ({f, at, dark}) => {
  const d = ease((f - 6) / 120);
  const n = 50;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    if (i / n > d) break;
    pts.push(`${i * 16},${-Math.sin(i / 3.5) * 90 - Math.sin(i / 1.4) * 20}`);
  }
  const up = sp(f, at(L(10).w0 + 10) - 4, 9, 240);
  const dn = sp(f, at(L(10).w0 + 12) - 4, 9, 240);
  const ng = sp(f, at(L(10).w0 + 3) - 4, 9, 240);
  const c = dark ? NAVY : WARM;
  return (
    <AbsoluteFill>
      <Big a="¿Está" b="GARANTIZADO?" f={f} d={at(L(9).w0) - 4} dark={dark} size={100} />
      <Svg>
        <g transform="translate(140 1130)">
          <polyline points={pts.join(' ')} fill="none" stroke={c} strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" />
        </g>
      </Svg>
      <Pill text="NO ES GARANTÍA" x={540} y={880} k={ng} c="#D9534F" tc="#fff" size={50} />
      <Pill text="PUEDE SUBIR ↑" x={330} y={1010} k={up} c={OK} tc="#fff" size={42} />
      <Pill text="PUEDE BAJAR ↓" x={750} y={1330} k={dn} c="#D9534F" tc="#fff" size={42} />
      <Note text="Renta variable: el valor puede subir o bajar." f={f} d={at(L(10).w0 + 9)} dark={dark} top={1430} />
    </AbsoluteFill>
  );
};

const Liq: React.FC<P> = ({f, at, dark}) => {
  const days = ['L', 'M', 'M', 'J', 'V'];
  const clock = sp(f, at(L(12).w0 + 9) - 4);
  return (
    <AbsoluteFill>
      <Big a="¿Y si necesito" b="MI DINERO?" f={f} d={at(L(11).w0) - 4} dark={dark} size={96} />
      <div style={{position: 'absolute', left: 90, right: 90, top: 860, display: 'flex', justifyContent: 'space-between'}}>
        {days.map((d, i) => {
          const k = sp(f, at(L(12).w0 + 3) + i * 4, 10, 240);
          return (
            <div key={i} style={{width: 160, height: 190, borderRadius: 26, background: NAVY2, border: '2px solid rgba(245,243,238,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: WARM}}>
              <div style={{fontSize: 54, fontWeight: 700}}>{d}</div>
              <div style={{width: 70, height: 70, borderRadius: 40, background: OK, color: '#fff', fontSize: 46, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${k})`}}>✓</div>
            </div>
          );
        })}
      </div>
      <Pill text="⏱ LIQUIDACIÓN EN 24 H" x={540} y={1180} k={clock} size={54} />
      <Note text="Días hábiles, según el prospecto del fondo." f={f} d={at(L(12).w0 + 9)} dark={dark} top={1270} />
    </AbsoluteFill>
  );
};

const Resumen: React.FC<P> = ({f, at, dark}) => {
  const rows = [
    {t: 'ACTIVAR', s: 'Seguir al índice', c: '#8DB3E2', p: 14},
    {t: 'MAYA', s: 'Buscar superarlo', c: OCRE, p: 15},
  ];
  return (
    <AbsoluteFill>
      <Big a="¿Seguir o" b="SUPERAR?" f={f} d={at(L(13).w0) - 4} dark={dark} size={104} />
      {rows.map((r, i) => {
        const k = sp(f, at(L(r.p).w0) - 5, 11, 220);
        return (
          <div key={i} style={{position: 'absolute', left: 90, right: 90, top: 860 + i * 170, height: 140, borderRadius: 30, background: r.c, color: NAVY, fontFamily: FONT, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', boxSizing: 'border-box', transform: `translateX(${(1 - k) * (i % 2 ? -1100 : 1100)}px)`, boxShadow: '0 16px 40px rgba(0,0,0,0.3)'}}>
            <span style={{fontWeight: 700, fontSize: 58}}>{r.t}</span>
            <span style={{fontWeight: 500, fontSize: 36}}>{r.s}</span>
          </div>
        );
      })}
      <Pill text="¿Y TÚ, QUÉ PREFIERES?" x={540} y={1280} k={sp(f, at(L(16).w0) - 4)} c={WARM} size={46} />
    </AbsoluteFill>
  );
};

const LEGAL =
  'El contenido es únicamente informativo, no constituye recomendación, consejo o sugerencia personalizada de algún producto y/o servicio que le sugieran la toma de decisiones de inversión, para lo que se necesita previamente verificar la congruencia entre el perfil del cliente y el perfil del producto financiero. Rendimientos pasados no garantizan rendimientos futuros. El valor de las acciones de Fondos de Inversión conlleva un riesgo de mercado incluyendo una posible minusvalía del capital invertido. Los fondos de inversión no están garantizados por Grupo Financiero Actinver S.A. de C.V, o por alguna entidad integrante del Grupo Financiero Actinver, ni por ninguna entidad gubernamental, ni por el IPAB y pueden tener minusvalías del capital invertido. Todos los Fondos de Actinver cuentan con Prospecto de Información al Público Inversionista y Documentos con Información Clave, los cuales se encuentran a su disposición en www.actinver.com/fondos.';

const End: React.FC<P> = ({f, at}) => {
  const dm = sp(f, 2, 11, 200);
  const fol = sp(f, at(L(18).w0 + 1) - 4, 10, 200);
  const tap = f - at(L(18).w0 + 1) - 4;
  const pressed = tap > 0 && tap < 8;
  const legalAt = at(words.length - 1) + F(LAST.e - LAST.s + 0.5);
  const fade = ease((f - legalAt) / 10);
  const serie = sp(f, at(L(18).w0 + 4) - 4);
  return (
    <AbsoluteFill>
      <div style={{opacity: 1 - fade}}>
        <div style={{position: 'absolute', left: 120, top: 520, width: 760, padding: '36px 44px', borderRadius: '40px 40px 40px 8px', background: WARM, fontFamily: FONT, fontSize: 54, fontWeight: 600, color: NAVY, transform: `scale(${dm})`, transformOrigin: 'left bottom', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'}}>
          ✉️ Escríbeme y vemos cuál va contigo
        </div>
        <div style={{position: 'absolute', left: 540, top: 880, transform: `translate(-50%,-50%) scale(${fol * (pressed ? 0.9 : 1)})`, background: pressed || tap >= 8 ? WARM : OCRE, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 60, padding: '24px 64px', borderRadius: 100, boxShadow: '0 16px 40px rgba(0,0,0,0.3)'}}>
          {tap >= 8 ? '✓ SIGUIENDO' : '+ SÍGUEME'}
        </div>
        <div style={{position: 'absolute', left: 100, right: 100, top: 1040, display: 'flex', gap: 16, justifyContent: 'center', transform: `scale(${serie})`}}>
          {['1 ACTIVAR', '2 MAYA', '3 ACTICRE', '4 ACTIED'].map((t, i) => (
            <div key={i} style={{background: i === 1 ? OCRE : 'rgba(245,243,238,0.12)', color: i === 1 ? NAVY : WARM, border: `2px solid ${OCRE}`, fontFamily: FONT, fontWeight: 700, fontSize: 30, padding: '16px 18px', borderRadius: 20}}>{t}</div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 1150, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 38, color: OCRE, opacity: serie}}>Serie renta variable local</div>
      </div>
      <div style={{position: 'absolute', inset: 0, background: NAVY, opacity: fade}} />
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 96, top: 420, width: 330, opacity: fade}} />
      <div style={{position: 'absolute', left: 96, right: 96, top: 560, fontFamily: FONT, fontSize: 64, color: WARM, opacity: fade, lineHeight: 1.1}}>
        <span style={{fontWeight: 300}}>FONDO </span>
        <span style={{fontWeight: 700, color: OCRE}}>MAYA</span>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 90, fontFamily: FONT, fontSize: 21, lineHeight: 1.38, color: 'rgba(245,243,238,0.8)', opacity: fade}}>
        <div style={{fontWeight: 600, fontSize: 24, color: WARM, marginBottom: 10}}>Datos de actinver.com/maya al 31 de marzo de 2026. Renta variable: el valor puede subir o bajar. Rendimientos pasados no garantizan rendimientos futuros. Consulta términos y condiciones de los productos en actinver.com</div>
        {LEGAL}
      </div>
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC<P>> = {hook: Hook, sigue: Sigue, intro: Intro, equipo: Equipo, objetivo: Objetivo, riesgo: Riesgo, liq: Liq, resumen: Resumen, end: End};

const Scene: React.FC<{idx: number}> = ({idx}) => {
  const f = useCurrentFrame();
  const s0 = starts[idx];
  const g = s0 + f;
  const at = (i: number) => F(TW(i)) - s0;
  const sc = SC[idx];
  const dark = THEMES[sc.bg].light;
  const next = idx < SC.length - 1 ? starts[idx + 1] : totalF;
  const keys = words.filter((w) => w.k && F(w.s) >= s0 && F(w.s) < next).map((w) => F(w.s) - 2);
  let last = -999;
  let n = 0;
  keys.forEach((kf, i) => {
    if (kf <= g) {
      last = kf;
      n = i + 1;
    }
  });
  const isEnd = sc.k === 'end';
  const punch = isEnd ? 0 : 0.05 * Math.exp(-(g - last) / 4);
  const zs = [1, 1.04, 1.02, 1.05];
  const z = isEnd ? 1 : zs[n % 4] + 0.02 * (f / Math.max(1, next - s0));
  const C = MAP[sc.k];
  return (
    <AbsoluteFill>
      <ThemeBg n={sc.bg} f={g} />
      <Particles f={g} dark={dark} seed={sc.k} />
      <AbsoluteFill style={{transform: `scale(${z + punch})`, transformOrigin: '540px 960px'}}>
        <C f={f} at={at} dark={dark} />
      </AbsoluteFill>
      {!isEnd && <Speakers f={f} g={g} dark={dark} />}
    </AbsoluteFill>
  );
};

/* ---------- subtítulos por hablante ---------- */
type G = {ws: Word[]; a: number; b: number; spk: string};
const groups: G[] = (() => {
  const gs: G[] = [];
  let cur: Word[] = [];
  let len = 0;
  words.forEach((w, idx) => {
    cur.push(w);
    len += w.w.length + 1;
    const nx = words[idx + 1];
    const brk = /[,.?!:…]$/.test(w.w) || cur.length >= 4 || len > 18 || !nx || nx.p !== w.p;
    if (brk) {
      gs.push({ws: cur, a: cur[0].s - 0.06, b: 0, spk: w.spk});
      cur = [];
      len = 0;
    }
  });
  gs.forEach((g, i) => {
    const l = g.ws[g.ws.length - 1];
    g.b = gs[i + 1] ? Math.min(gs[i + 1].a, l.e + 0.35) : l.e + 0.6;
  });
  return gs;
})();
const Captions: React.FC<{t: number; f: number}> = ({t, f}) => {
  const g = groups.find((x) => t >= x.a && t < x.b);
  if (!g) return null;
  const ana = g.spk === 'A';
  const k = sp(f, F(g.a), 12, 260);
  let active = -1;
  g.ws.forEach((w) => {
    if (t >= w.s - 0.03) active = w.i;
  });
  if (t > g.ws[g.ws.length - 1].e + 0.1) active = -1;
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: 1540, display: 'flex', flexDirection: 'column', alignItems: ana ? 'flex-start' : 'flex-end', transform: `scale(${0.85 + 0.15 * k})`, opacity: cl(k * 2)}}>
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 30, color: ana ? OCRE : WARM, margin: '0 24px 8px', letterSpacing: 2}}>{ana ? 'ANA' : 'ASESOR'}</div>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 16px', background: ana ? 'rgba(179,163,105,0.95)' : 'rgba(4,30,66,0.92)', borderRadius: ana ? '30px 30px 30px 6px' : '30px 30px 6px 30px', padding: '16px 28px', border: '1.5px solid rgba(245,243,238,0.35)', maxWidth: 940}}>
        {g.ws.map((w) => {
          const on = w.i === active;
          const base = ana ? NAVY : WARM;
          const key = ana ? '#FFFFFF' : OCRE;
          return (
            <span key={w.i} style={{fontFamily: FONT, fontWeight: 700, fontSize: 68, lineHeight: 1.15, color: on ? (ana ? OCRE : NAVY) : w.k ? key : base, background: on ? (ana ? NAVY : OCRE) : 'transparent', borderRadius: 14, padding: '0 10px', display: 'inline-block', transform: on ? 'scale(1.06)' : 'none'}}>
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const Maya: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const cur = SC[Math.max(0, starts.filter((s) => s <= f).length - 1)];
  const light = THEMES[cur.bg].light;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <TransitionSeries>
        {SC.map((s, i) => {
          const dur = (i < SC.length - 1 ? starts[i + 1] : totalF) - starts[i] + (i < SC.length - 1 ? TD : 0);
          return (
            <React.Fragment key={s.k}>
              <TransitionSeries.Sequence durationInFrames={dur}>
                <Scene idx={i} />
              </TransitionSeries.Sequence>
              {i < SC.length - 1 && <TransitionSeries.Transition presentation={TRANS[i] as any} timing={linearTiming({durationInFrames: TD})} />}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
      {cur.k !== 'end' && <Img src={staticFile(light ? 'logo_azul.png' : 'logo_blanco.png')} style={{position: 'absolute', right: 60, top: 70, width: 200}} />}
      {cur.k !== 'end' && <div style={{position: 'absolute', left: 60, top: 76, fontFamily: FONT, fontWeight: 700, fontSize: 30, color: light ? NAVY : OCRE, letterSpacing: 2}}>RENTA VARIABLE LOCAL · 2</div>}
      {t < LAST.e + 0.3 && <Captions t={t} f={f} />}
      <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: W * cl(t / MY_TOTAL), background: OCRE}} />
      <Audio src={staticFile('maya/voz_mix.wav')} />
    </AbsoluteFill>
  );
};
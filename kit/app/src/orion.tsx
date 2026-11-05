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
import data from '../public/orion/words.json';
import {FONT, FPS, W} from './theme';
import {F, cl, ease, sp} from './narrador';
import {NAVY, NAVY2, OCRE, WARM, GRAY, OK, THEMES, ThemeBg} from './banca';


type Word = {i: number; w: string; s: number; e: number; k: boolean; p: number; spk: string};
const words = data.words as Word[];
const lines = data.lines as {p: number; spk: string; s: number; e: number}[];
const LAST = words[words.length - 1];
export const OR_TOTAL = data.total;
const TW = (i: number) => words[i].s;
const L = (p: number) => ({w0: words.findIndex((w) => w.p === p)});

const SC = [
  {p: 0, k: 'hook', bg: 0},
  {p: 1, k: 'baja', bg: 0},
  {p: 2, k: 'sube', bg: 1},
  {p: 3, k: 'intro', bg: 1},
  {p: 6, k: 'equipo', bg: 2},
  {p: 8, k: 'riesgo', bg: 3},
  {p: 10, k: 'plazo', bg: 3},
  {p: 12, k: 'liq', bg: 4},
  {p: 14, k: 'quien', bg: 5},
  {p: 16, k: 'end', bg: 0},
];
const TD = 12;
const starts = SC.map((s, i) => (i === 0 ? 0 : F(lines[s.p].s - 0.14)));
const totalF = F(OR_TOTAL);
const TRANS = [
  slide({direction: 'from-right'}),
  iris({width: 1080, height: 1920}),
  wipe({direction: 'from-bottom-left'}),
  flip({direction: 'from-right'}),
  clockWipe({width: 1080, height: 1920}),
  slide({direction: 'from-bottom'}),
  wipe({direction: 'from-right'}),
  flip({direction: 'from-left'}),
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
const Badge: React.FC<{n: string; k: number; x: number; y: number; c?: string}> = ({n, k, x, y, c = OCRE}) => (
  <g transform={`translate(${x} ${y}) scale(${k})`}>
    <circle r={78} fill={c} />
    <text textAnchor="middle" y={22} fontFamily={FONT} fontWeight={700} fontSize={70} fill={NAVY}>{n}</text>
    <text textAnchor="middle" y={56} fontFamily={FONT} fontWeight={600} fontSize={22} fill={NAVY}>AÑOS</text>
  </g>
);
const Shield: React.FC<{s?: number; fill?: string; stroke?: string}> = ({s = 1, fill = NAVY2, stroke = OCRE}) => (
  <g transform={`scale(${s})`}>
    <path d="M0 -150 L120 -105 V10 Q120 105 0 150 Q-120 105 -120 10 V-105Z" fill={fill} stroke={stroke} strokeWidth={10} />
    <path d="M-45 5 L-12 38 L50 -30" stroke={stroke} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);
const Jar: React.FC<{lvl: number; s?: number}> = ({lvl, s = 1}) => (
  <g transform={`scale(${s})`}>
    <clipPath id="jarclip"><path d="M-110 -120 H110 V120 Q110 160 70 160 H-70 Q-110 160 -110 120Z" /></clipPath>
    <g clipPath="url(#jarclip)">
      <rect x={-120} y={160 - 290 * lvl} width={240} height={300} fill={OCRE} />
      {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={-60 + i * 40} cy={160 - 290 * lvl + 8} rx={26} ry={9} fill="#8F8250" opacity={lvl > 0.05 ? 1 : 0} />)}
    </g>
    <path d="M-110 -120 H110 V120 Q110 160 70 160 H-70 Q-110 160 -110 120Z" fill="none" stroke={WARM} strokeWidth={10} />
    <rect x={-125} y={-150} width={250} height={36} rx={12} fill={WARM} />
  </g>
);

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

/* ---------- escenas (centro: 560–1420) ---------- */
const UP = '#7BC4A4';
const DOWN = '#E8845F';
const Big: React.FC<{a: string; b: string; f: number; d?: number; dark: boolean; top?: number; size?: number; c?: string}> = ({a, b, f, d = 0, dark, top = 575, size = 104, c = OCRE}) => {
  const k = sp(f, d, 11, 200);
  return (
    <div style={{position: 'absolute', left: 80, right: 80, top, textAlign: 'center', fontFamily: FONT, lineHeight: 1.04, color: dark ? NAVY : WARM, transform: `scale(${0.6 + 0.4 * k})`, opacity: cl(k * 2)}}>
      <div style={{fontWeight: 300, fontSize: size * 0.8}}>{a}</div>
      <div style={{fontWeight: 700, fontSize: size, color: c}}>{b}</div>
    </div>
  );
};
/* balanza: ang<0 => tasas abajo, precio arriba */
const Balanza: React.FC<{ang: number; y?: number; dark?: boolean; tasa: '↓' | '↑'; precio: '↓' | '↑'; k?: number}> = ({ang, y = 1150, dark = false, tasa, precio, k = 1}) => {
  const r = (ang * Math.PI) / 180;
  const R = 300;
  const lx = -R * Math.cos(r), ly = -R * Math.sin(r);
  const rx = R * Math.cos(r), ry = R * Math.sin(r);
  const c = dark ? NAVY : WARM;
  const lab = (x: number, yy: number, t: string, ar: string, col: string) => (
    <g transform={`translate(${x} ${yy - 100})`}>
      <rect x={-130} y={-48} width={260} height={96} rx={48} fill={col} />
      <text textAnchor="middle" y={14} fontFamily={FONT} fontWeight={700} fontSize={42} fill={NAVY}>{t} {ar}</text>
    </g>
  );
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <g transform={`translate(540 ${y}) scale(${k})`}>
        <path d="M0 0 L-80 190 H80Z" fill={OCRE} />
        <g transform={`rotate(${ang})`}>
          <rect x={-R - 40} y={-12} width={2 * R + 80} height={24} rx={12} fill={c} />
        </g>
        {lab(lx, ly, 'TASAS', tasa, tasa === '↓' ? UP : DOWN)}
        {lab(rx, ry, 'PRECIO', precio, precio === '↑' ? UP : DOWN)}
        <circle r={22} fill={NAVY} stroke={OCRE} strokeWidth={8} />
      </g>
    </svg>
  );
};

const Hook: React.FC<P> = ({f, at, dark}) => {
  const m = ease((f - at(L(0).w0 + 7)) / 26);
  return (
    <AbsoluteFill>
      <Big a="¿Qué pasa si" b="LAS TASAS BAJAN?" f={f} d={2} dark={dark} size={92} />
      <Balanza ang={14 - 28 * m} dark={dark} tasa={m > 0.5 ? '↓' : '↑'} precio={m > 0.5 ? '↑' : '↓'} k={sp(f, 6, 10, 200)} />
    </AbsoluteFill>
  );
};

const Baja: React.FC<P> = ({f, at, dark}) => {
  const k = ease((f - at(L(1).w0 + 5)) / 34);
  const plazo = sp(f, at(L(1).w0 + 3) - 4);
  const pts = [0, 0.15, 0.1, 0.3, 0.28, 0.5, 0.6, 0.85, 1];
  const path = pts.map((v, i) => `${i ? 'L' : 'M'}${160 + (i * 760) / 8} ${1300 - v * 360}`).join(' ');
  const ev = evolvePath(k, path);
  const c = dark ? NAVY : WARM;
  return (
    <AbsoluteFill>
      <Big a="Tasas abajo," b="BONOS ARRIBA" f={f} d={at(L(1).w0) - 4} dark={dark} size={92} />
      <Svg>
        <line x1={140} x2={940} y1={1330} y2={1330} stroke={c} strokeWidth={4} opacity={0.4} />
        <line x1={140} x2={140} y1={900} y2={1330} stroke={c} strokeWidth={4} opacity={0.4} />
        <path d={path} fill="none" stroke={UP} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
        <text x={160} y={880} fontFamily={FONT} fontWeight={700} fontSize={34} fill={c}>PRECIO DEL BONO</text>
        <g transform={`translate(${920} ${1300 - 360 * k}) scale(${cl(k * 3)})`}><circle r={26} fill={OCRE} /></g>
      </Svg>
      <Pill text="LARGO PLAZO" x={540} y={1440} k={plazo} size={46} />
      <Note text="Ilustrativo, no representa un rendimiento." f={f} d={at(L(1).w0 + 6)} dark={dark} top={1500} />
    </AbsoluteFill>
  );
};

const Sube: React.FC<P> = ({f, at, dark}) => {
  const m = ease((f - at(L(2).w0 + 3)) / 24);
  return (
    <AbsoluteFill>
      <Big a="Tasas arriba," b="BONOS ABAJO" f={f} d={at(L(2).w0) - 4} dark={dark} size={92} />
      <Balanza ang={-14 + 28 * m} dark={dark} tasa={m > 0.5 ? '↑' : '↓'} precio={m > 0.5 ? '↓' : '↑'} />
      <Note text="Así suelen moverse; no es una regla exacta." f={f} d={at(L(2).w0 + 5)} dark={dark} top={1440} />
    </AbsoluteFill>
  );
};

const Stars = [[300, 0], [800, 40], [440, 330], [540, 350], [640, 370], [330, 700], [790, 720]] as const;
const Constel: React.FC<{k: number; s?: number}> = ({k, s = 1}) => (
  <g transform={`scale(${s})`}>
    {[[0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6], [0, 1]].map(([a, b], i) => (
      <line key={i} x1={Stars[a][0]} y1={Stars[a][1]} x2={Stars[b][0]} y2={Stars[b][1]} stroke={OCRE} strokeWidth={4} opacity={0.5 * k} />
    ))}
    {Stars.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={(i >= 2 && i <= 4 ? 14 : 20) * (0.5 + 0.5 * k)} fill={i === 5 || i === 0 ? OCRE : WARM} opacity={0.4 + 0.6 * k} />)}
  </g>
);
const Intro: React.FC<P> = ({f, at}) => {
  const q = sp(f, 4, 10, 200);
  const a = sp(f, at(L(4).w0) - 4, 10, 220);
  const logo = sp(f, at(L(4).w0 + 3) - 4);
  const act = sp(f, at(L(5).w0 + 1) - 4);
  const star = ease((f - 4) / 40);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <g transform="translate(290 840)"><Constel k={star} s={0.62} /></g>
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 90, color: WARM, opacity: (1 - cl(a * 1.5)) * cl(q), transform: `scale(${0.8 + 0.2 * q})`}}>¿Un fondo que<br />trabaje con eso?</div>
      <CameraMotionBlur shutterAngle={200} samples={5}>
        <AbsoluteFill>
          <div style={{position: 'absolute', left: 0, right: 0, top: 540, textAlign: 'center', fontFamily: FONT, color: OCRE, fontWeight: 700, fontSize: 200, letterSpacing: 6, transform: `translateY(${(1 - a) * 400}px) scale(${a})`, opacity: cl(a * 1.5)}}>ORION</div>
        </AbsoluteFill>
      </CameraMotionBlur>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 400, top: 1370, width: 280, opacity: cl(logo * 1.5)}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1450, textAlign: 'center', fontFamily: FONT, fontSize: 44, color: WARM, opacity: logo}}>Fondo de deuda</div>
      <Pill text="ADMINISTRACIÓN ACTIVA" x={540} y={1260} k={act} size={46} />
      <Sequence from={0} durationInFrames={40}>
        <AbsoluteFill style={{mixBlendMode: 'screen', opacity: 0.4}}>
          <LightLeak seed={23} hueShift={40} durationInFrames={40} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

const Equipo: React.FC<P> = ({f, at, dark}) => {
  const bars = sp(f, at(L(6).w0 + 4) - 4, 12, 200);
  const adj = ease((f - at(L(7).w0 + 1)) / 8);
  const base = [0.35, 0.65, 1];
  const c = dark ? NAVY : WARM;
  const team = sp(f, at(L(7).w0 + 1) - 6, 10, 220);
  const names = ['Corto', 'Medio', 'Largo'];
  return (
    <AbsoluteFill>
      <Big a="Deuda de" b="DISTINTOS PLAZOS" f={f} d={at(L(6).w0) - 4} dark={dark} size={84} />
      <Svg>
        <line x1={150} x2={930} y1={1250} y2={1250} stroke={c} strokeWidth={4} opacity={0.4} />
        {base.map((v, i) => {
          const h = (v + adj * 0.18 * Math.sin(f / 7 + i * 2)) * 340 * bars;
          return (
            <g key={i}>
              <rect x={210 + i * 260} y={1250 - h} width={190} height={h} rx={18} fill={i === 1 ? OCRE : '#8DB3E2'} />
              <text x={305 + i * 260} y={1305} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill={c} opacity={bars}>{names[i]}</text>
            </g>
          );
        })}
        <g transform={`translate(540 1130) scale(${team * 0.7})`} opacity={adj}>
          {[-150, 0, 150].map((x, i) => (
            <g key={i} transform={`translate(${x} -300)`}>
              <circle cy={-30} r={40} fill="#C98F6B" />
              <path d="M-60 70 Q-60 10 0 10 Q60 10 60 70Z" fill={i === 1 ? OCRE : NAVY} />
            </g>
          ))}
        </g>
      </Svg>
      <Pill text="UN EQUIPO AJUSTA LA CARTERA" x={540} y={1440} k={sp(f, at(L(7).w0 + 3) - 4)} size={40} />
      <Note text="Ilustrativo." f={f} d={at(L(7).w0 + 4)} dark={dark} top={1500} />
    </AbsoluteFill>
  );
};

const Riesgo: React.FC<P> = ({f, at, dark}) => {
  const g = sp(f, at(L(9).w0 + 2) - 4, 14, 120);
  const ang = -70 + 130 * g + Math.sin(f / 4) * 3 * g;
  const arrow = sp(f, at(L(9).w0 + 6) - 4);
  const c = dark ? NAVY : WARM;
  return (
    <AbsoluteFill>
      <Big a="¿Y el" b="RIESGO?" f={f} d={at(L(8).w0) - 4} dark={dark} size={110} />
      <Svg>
        <g transform="translate(540 1230)">
          <path d="M-300 0 A300 300 0 0 1 -100 -283" stroke={UP} strokeWidth={46} fill="none" />
          <path d="M-100 -283 A300 300 0 0 1 100 -283" stroke={OCRE} strokeWidth={46} fill="none" />
          <path d="M100 -283 A300 300 0 0 1 300 0" stroke={DOWN} strokeWidth={46} fill="none" />
          <g transform={`rotate(${ang})`}><rect x={-10} y={-260} width={20} height={260} rx={10} fill={c} /></g>
          <circle r={34} fill={c} />
          <text y={110} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill={c}>SENSIBLE A TASAS</text>
        </g>
        <g transform={`translate(540 1470) scale(${arrow})`}>
          <text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill={c}>tasas ↑ → valor puede ↓</text>
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

const Plazo: React.FC<P> = ({f, at, dark}) => {
  const b = sp(f, at(L(10).w0 + 4) - 4, 10, 220);
  const warn = sp(f, at(L(11).w0 + 3) - 4);
  const c = dark ? NAVY : WARM;
  return (
    <AbsoluteFill>
      <Big a="Es para" b="LARGO PLAZO" f={f} d={at(L(10).w0) - 4} dark={dark} size={100} />
      <Svg>
        <g transform={`translate(540 1060) scale(${b})`}>
          <circle r={150} fill={OCRE} />
          <text textAnchor="middle" y={30} fontFamily={FONT} fontWeight={700} fontSize={130} fill={NAVY}>+3</text>
          <text textAnchor="middle" y={92} fontFamily={FONT} fontWeight={700} fontSize={44} fill={NAVY}>AÑOS</text>
        </g>
        <text x={540} y={1300} textAnchor="middle" fontFamily={FONT} fontWeight={500} fontSize={34} fill={c} opacity={b}>según su documento de información clave</text>
      </Svg>
      <Pill text="⚠️ NO ES GARANTÍA" x={540} y={1420} k={warn} c="#D9534F" tc="#fff" size={46} />
      <Note text="El valor puede subir o bajar." f={f} d={at(L(11).w0 + 3)} dark={dark} top={1490} />
    </AbsoluteFill>
  );
};

const Liq: React.FC<P> = ({f, at, dark}) => {
  const days = ['L', 'M', 'M', 'J', 'V'];
  const clock = sp(f, at(L(13).w0 + 10) - 4);
  return (
    <AbsoluteFill>
      <Big a="¿Y si necesito" b="MI DINERO?" f={f} d={at(L(12).w0) - 4} dark={dark} size={96} />
      <div style={{position: 'absolute', left: 90, right: 90, top: 860, display: 'flex', justifyContent: 'space-between'}}>
        {days.map((d, i) => {
          const k = sp(f, at(L(13).w0 + 3) + i * 4, 10, 240);
          return (
            <div key={i} style={{width: 160, height: 190, borderRadius: 26, background: NAVY2, border: '2px solid rgba(245,243,238,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: WARM}}>
              <div style={{fontSize: 54, fontWeight: 700}}>{d}</div>
              <div style={{width: 70, height: 70, borderRadius: 40, background: OK, color: '#fff', fontSize: 46, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${k})`}}>✓</div>
            </div>
          );
        })}
      </div>
      <Pill text="⏱ LIQUIDACIÓN EN 48 H" x={540} y={1180} k={clock} size={54} />
      <Note text="Días hábiles, según el documento del fondo." f={f} d={at(L(13).w0 + 10)} dark={dark} top={1270} />
    </AbsoluteFill>
  );
};

const Quien: React.FC<P> = ({f, at, dark}) => {
  const rows = [
    {t: 'YA INVIERTE', s: 'Conoce los fondos de deuda', c: OCRE, d: at(L(15).w0 + 1)},
    {t: 'ENTIENDE QUE SU VALOR SE MUEVE CON LAS TASAS', s: '', c: '#8DB3E2', d: at(L(15).w0 + 5)},
  ];
  return (
    <AbsoluteFill>
      <Big a="¿Para" b="QUIÉN ES?" f={f} d={at(L(14).w0) - 4} dark={dark} size={110} />
      {rows.map((r, i) => {
        const k = sp(f, r.d - 5, 11, 220);
        return (
          <div key={i} style={{position: 'absolute', left: 90, right: 90, top: 880 + i * 250, height: 210, borderRadius: 30, background: r.c, color: NAVY, fontFamily: FONT, display: 'flex', alignItems: 'center', padding: '0 44px', boxSizing: 'border-box', fontWeight: 700, fontSize: i ? 44 : 62, lineHeight: 1.1, transform: `translateX(${(1 - k) * (i % 2 ? -1100 : 1100)}px)`, boxShadow: '0 16px 40px rgba(0,0,0,0.3)'}}>
            {r.t}
          </div>
        );
      })}
      <Note text="Antes de invertir, revisa que el fondo vaya con tu perfil." f={f} d={at(L(15).w0 + 8)} dark={dark} top={1420} />
    </AbsoluteFill>
  );
};

const LEGAL =
  'El contenido es únicamente informativo, no constituye recomendación, consejo o sugerencia personalizada de algún producto y/o servicio que le sugieran la toma de decisiones de inversión, para lo que se necesita previamente verificar la congruencia entre el perfil del cliente y el perfil del producto financiero. Rendimientos pasados no garantizan rendimientos futuros. El valor de las acciones de Fondos de Inversión conlleva un riesgo de mercado incluyendo una posible minusvalía del capital invertido. Los fondos de inversión no están garantizados por Grupo Financiero Actinver S.A. de C.V, o por alguna entidad integrante del Grupo Financiero Actinver, ni por ninguna entidad gubernamental, ni por el IPAB y pueden tener minusvalías del capital invertido. Todos los Fondos de Actinver cuentan con Prospecto de Información al Público Inversionista y Documentos con Información Clave, los cuales se encuentran a su disposición en www.actinver.com/fondos.';

const End: React.FC<P> = ({f, at}) => {
  const q = sp(f, at(L(16).w0) - 4, 10, 200);
  const dm = sp(f, at(L(17).w0) - 4, 11, 200);
  const fol = sp(f, at(L(18).w0 + 1) - 4, 10, 200);
  const tap = f - at(L(18).w0 + 1) - 4;
  const pressed = tap > 0 && tap < 8;
  const legalAt = at(words.length - 1) + F(LAST.e - LAST.s + 0.5);
  const fade = ease((f - legalAt) / 10);
  const st = [
    {t: '1 ACTIREN', s: 'Corto plazo', y: 880},
    {t: '2 ACTIGOB', s: '100% gobierno', y: 800},
    {t: '3 ORION', s: 'Largo plazo', y: 720},
  ];
  return (
    <AbsoluteFill>
      <div style={{opacity: 1 - fade}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 470, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 64, color: WARM, transform: `scale(${q})`}}>¿Qué <span style={{color: OCRE}}>escalón</span> va contigo?</div>
        {st.map((s, i) => {
          const k = sp(f, 6 + i * 5, 11, 200);
          const hot = i === 2;
          return (
            <div key={i} style={{position: 'absolute', left: 70 + i * 300, top: s.y + (1 - k) * 200, width: 280, height: 1180 - s.y - 150 + 0, background: hot ? OCRE : 'rgba(245,243,238,0.14)', border: `3px solid ${OCRE}`, borderRadius: '24px 24px 0 0', fontFamily: FONT, color: hot ? NAVY : WARM, padding: '22px 18px', boxSizing: 'border-box', opacity: cl(k * 2)}}>
              <div style={{fontWeight: 700, fontSize: 36}}>{s.t}</div>
              <div style={{fontWeight: 400, fontSize: 28, marginTop: 8}}>{s.s}</div>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 120, top: 1210, width: 760, padding: '30px 44px', borderRadius: '40px 40px 40px 8px', background: WARM, fontFamily: FONT, fontSize: 50, fontWeight: 600, color: NAVY, transform: `scale(${dm})`, transformOrigin: 'left bottom', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'}}>
          ✉️ Escríbeme y lo vemos
        </div>
        <div style={{position: 'absolute', left: 540, top: 1420, transform: `translate(-50%,-50%) scale(${fol * (pressed ? 0.9 : 1)})`, background: pressed || tap >= 8 ? WARM : OCRE, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 56, padding: '20px 60px', borderRadius: 100, boxShadow: '0 16px 40px rgba(0,0,0,0.3)'}}>
          {tap >= 8 ? '✓ SIGUIENDO' : '+ SÍGUEME'}
        </div>
      </div>
      <div style={{position: 'absolute', inset: 0, background: NAVY, opacity: fade}} />
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 96, top: 420, width: 330, opacity: fade}} />
      <div style={{position: 'absolute', left: 96, right: 96, top: 560, fontFamily: FONT, fontSize: 64, color: WARM, opacity: fade, lineHeight: 1.1}}>
        <span style={{fontWeight: 300}}>FONDO </span>
        <span style={{fontWeight: 700, color: OCRE}}>ORION</span>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 90, fontFamily: FONT, fontSize: 21, lineHeight: 1.38, color: 'rgba(245,243,238,0.8)', opacity: fade}}>
        <div style={{fontWeight: 600, fontSize: 24, color: WARM, marginBottom: 10}}>Datos de la ficha del fondo (noviembre de 2025) y su Documento con Información Clave. Rendimientos pasados no garantizan rendimientos futuros. Consulta términos y condiciones de los productos en actinver.com</div>
        {LEGAL}
      </div>
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC<P>> = {hook: Hook, baja: Baja, sube: Sube, intro: Intro, equipo: Equipo, riesgo: Riesgo, plazo: Plazo, liq: Liq, quien: Quien, end: End};

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

export const Orion: React.FC = () => {
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
      {cur.k !== 'end' && <div style={{position: 'absolute', left: 60, top: 76, fontFamily: FONT, fontWeight: 700, fontSize: 30, color: light ? NAVY : OCRE, letterSpacing: 2}}>SERIE DEUDA EN PESOS · 3</div>}
      {t < LAST.e + 0.3 && <Captions t={t} f={f} />}
      <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: W * cl(t / OR_TOTAL), background: OCRE}} />
      <Audio src={staticFile('orion/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

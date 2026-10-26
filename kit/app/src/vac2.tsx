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
import data from '../public/vac2/words.json';
import {FONT, FPS, W} from './theme';
import {F, cl, ease, sp} from './narrador';
import {NAVY, NAVY2, OCRE, WARM, GRAY, OK, THEMES, ThemeBg} from './banca';


type Word = {i: number; w: string; s: number; e: number; k: boolean; p: number; spk: string};
const words = data.words as Word[];
const lines = data.lines as {p: number; spk: string; s: number; e: number}[];
const LAST = words[words.length - 1];
export const V2_TOTAL = data.total;
const TW = (i: number) => words[i].s;
const L = (p: number) => ({w0: words.findIndex((w) => w.p === p)});

const SC = [
  {p: 0, k: 'hook', bg: 0},
  {p: 2, k: 'descanso', bg: 0},
  {p: 4, k: 'linea', bg: 2},
  {p: 7, k: 'proteccion', bg: 2},
  {p: 10, k: 'requisitos', bg: 1},
  {p: 15, k: 'retiros', bg: 3},
  {p: 18, k: 'aportes', bg: 3},
  {p: 20, k: 'adapta', bg: 4},
  {p: 22, k: 'tuque', bg: 5},
  {p: 23, k: 'end', bg: 0},
];
const TD = 12;
const starts = SC.map((s, i) => (i === 0 ? 0 : F(lines[s.p].s - 0.14)));
const totalF = F(V2_TOTAL);
const TRANS = [
  slide({direction: 'from-right'}),
  wipe({direction: 'from-bottom-left'}),
  iris({width: 1080, height: 1920}),
  flip({direction: 'from-right'}),
  clockWipe({width: 1080, height: 1920}),
  slide({direction: 'from-bottom'}),
  wipe({direction: 'from-right'}),
  iris({width: 1080, height: 1920}),
  slide({direction: 'from-left'}),
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

/* ---------- escenas (centro: 480–1420) ---------- */
const Big: React.FC<{a: string; b: string; f: number; d?: number; dark: boolean; top?: number; size?: number; c?: string}> = ({a, b, f, d = 0, dark, top = 560, size = 104, c = OCRE}) => {
  const k = sp(f, d, 11, 200);
  return (
    <div style={{position: 'absolute', left: 80, right: 80, top, textAlign: 'center', fontFamily: FONT, lineHeight: 1.04, color: dark ? NAVY : WARM, transform: `scale(${0.6 + 0.4 * k})`, opacity: cl(k * 2)}}>
      <div style={{fontWeight: 300, fontSize: size * 0.8}}>{a}</div>
      <div style={{fontWeight: 700, fontSize: size, color: c}}>{b}</div>
    </div>
  );
};

const Hook: React.FC<P> = ({f, at, dark}) => {
  const k = sp(f, at(4) - 4, 9, 220);
  const cross = ease((f - at(9) + 4) / 10);
  return (
    <AbsoluteFill>
      <Big a="¿Y si un año" b="NO PUEDO PAGAR?" f={f} d={at(4) - 6} dark={dark} top={560} size={96} />
      <Svg>
        <g transform={`translate(540 1060) scale(${k})`}>
          <rect x={-200} y={-170} width={400} height={340} rx={34} fill={WARM} />
          <rect x={-200} y={-170} width={400} height={90} rx={34} fill={OCRE} />
          <rect x={-200} y={-110} width={400} height={30} fill={OCRE} />
          {new Array(12).fill(0).map((_, i) => <rect key={i} x={-160 + (i % 4) * 82} y={-50 + Math.floor(i / 4) * 66} width={60} height={46} rx={10} fill="rgba(4,30,66,0.15)" />)}
          <path d={`M-150 -40 L${-150 + 300 * cross} ${-40 + 200 * cross}`} stroke="#D9534F" strokeWidth={18} strokeLinecap="round" />
          <path d={`M150 -40 L${150 - 300 * cross} ${-40 + 200 * cross}`} stroke="#D9534F" strokeWidth={18} strokeLinecap="round" />
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

const Descanso: React.FC<P> = ({f, at, dark}) => {
  const k = sp(f, at(L(2).w0 + 6) - 6, 9, 220);
  const breathe = 1 + 0.04 * Math.sin(f / 8);
  return (
    <AbsoluteFill>
      <Svg>
        <g transform={`translate(540 860) scale(${k * breathe})`}>
          <circle r={220} fill="none" stroke={OCRE} strokeWidth={14} />
          <rect x={-80} y={-110} width={56} height={220} rx={16} fill={WARM} />
          <rect x={24} y={-110} width={56} height={220} rx={16} fill={WARM} />
        </g>
      </Svg>
      <Big a="Periodo de" b="DESCANSO" f={f} d={at(L(2).w0 + 6) - 2} dark={dark} top={1140} size={110} />
    </AbsoluteFill>
  );
};

const Linea: React.FC<P> = ({f, at, dark}) => {
  const y1 = sp(f, at(L(4).w0 + 3) - 4);
  const pause = ease((f - at(L(5).w0 + 5)) / 22);
  const once = sp(f, at(L(6).w0 + 1) - 4, 9, 260);
  const c = dark ? NAVY : WARM;
  const yrs = ['Año 1', 'Año 2', 'Año 3', 'Año 4'];
  return (
    <AbsoluteFill>
      <Svg>
        <g transform="translate(110 820)">
          <line x1={0} y1={0} x2={860} y2={0} stroke={c} strokeWidth={6} opacity={0.3} />
          {yrs.map((y, i) => (
            <g key={i} transform={`translate(${i * 280 + 20} 0)`} opacity={i === 0 ? 1 : y1}>
              <circle r={14} fill={i === 1 ? OCRE : c} />
              <text y={60} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={34} fill={c}>{y}</text>
            </g>
          ))}
          {new Array(10).fill(0).map((_, i) => <circle key={i} cx={30 + i * 26} cy={-40} r={9} fill={OCRE} opacity={y1} />)}
          <rect x={300} y={-80} width={280 * pause} height={80} rx={18} fill="#8DB3E2" />
          <text x={440} y={-28} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={38} fill={NAVY} opacity={pause}>⏸ 12 MESES</text>
          {new Array(10).fill(0).map((_, i) => <circle key={i} cx={600 + i * 26} cy={-40} r={9} fill={OCRE} opacity={pause} />)}
        </g>
      </Svg>
      <Pill text="1 VEZ EN LA VIDA DE LA PÓLIZA" x={540} y={1060} k={once} size={46} />
      <Note text="Disponible a partir del año 2. Se avisa con 30 días hábiles de anticipación." f={f} d={at(L(6).w0 + 4)} dark={dark} top={1170} />
    </AbsoluteFill>
  );
};

const Proteccion: React.FC<P> = ({f, at, dark}) => {
  const no = sp(f, at(L(8).w0) - 3, 9, 260);
  const drain = ease((f - at(L(9).w0 + 3)) / 40);
  return (
    <AbsoluteFill>
      <Svg>
        <g transform={`translate(330 860) scale(${0.9 * sp(f, 4)})`}><Shield fill={NAVY} /></g>
        <g transform={`translate(330 860) scale(${no})`} opacity={no}>
          <circle cx={120} cy={-120} r={52} fill="#2E7D4F" />
          <text x={120} y={-104} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={48} fill="#fff">✓</text>
        </g>
        <g transform={`translate(780 880) scale(${0.62 * sp(f, at(L(9).w0) - 4)})`}><Jar lvl={0.75 - 0.25 * drain} /></g>
        {drain > 0 && drain < 1 && [0, 1, 2].map((i) => {
          const t = (drain * 3 + i / 3) % 1;
          return <circle key={i} cx={780 - 450 * t} cy={760 - Math.sin(t * Math.PI) * 120} r={14} fill={OCRE} />;
        })}
      </Svg>
      <Pill text="TU PROTECCIÓN SIGUE" x={330} y={1130} k={no} c="#2E7D4F" tc="#fff" size={42} />
      <Note text="Durante la pausa, los costos del seguro y de administración se descuentan del saldo de tu fondo." f={f} d={at(L(9).w0 + 6)} dark={dark} top={1230} />
    </AbsoluteFill>
  );
};

const Requisitos: React.FC<P> = ({f, at, dark}) => {
  const items = [
    {t: 'Saldo suficiente en tu fondo', p: 12},
    {t: 'No haber retirado más de la mitad', p: 13},
    {t: 'Avisar con 30 días hábiles', p: 14},
  ];
  return (
    <AbsoluteFill>
      <Big a="Requisitos:" b="3" f={f} d={at(L(11).w0) - 4} dark={dark} top={560} size={110} />
      {items.map((it, i) => {
        const k = sp(f, at(L(it.p).w0) - 5, 11, 220);
        const ck = sp(f, at(L(it.p).w0) + 6, 9, 280);
        return (
          <div key={i} style={{position: 'absolute', left: 90, right: 90, top: 850 + i * 175, height: 150, borderRadius: 30, background: NAVY2, border: '2px solid rgba(245,243,238,0.25)', display: 'flex', alignItems: 'center', gap: 30, padding: '0 36px', boxSizing: 'border-box', transform: `translateX(${(1 - k) * 1100}px)`}}>
            <div style={{width: 80, height: 80, borderRadius: 40, background: OK, color: '#fff', fontSize: 50, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${ck})`, flexShrink: 0}}>✓</div>
            <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 46, color: WARM, lineHeight: 1.1}}>{it.t}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Retiros: React.FC<P> = ({f, at, dark}) => {
  const out = ease((f - at(L(16).w0 + 7)) / 30);
  const two = sp(f, at(L(16).w0 + 7) - 4, 9, 260);
  return (
    <AbsoluteFill>
      <Big a="¿Necesitas" b="DINERO?" f={f} d={at(L(15).w0) - 6} dark={dark} top={575} size={100} />
      <Svg>
        <g transform={`translate(330 1000) scale(${0.6 * sp(f, 4)})`}><Jar lvl={0.8 - 0.2 * out} /></g>
        {[0, 1].map((i) => {
          const t = cl(out * 1.6 - i * 0.4);
          return <g key={i} transform={`translate(${330 + 380 * t} ${880 - Math.sin(t * Math.PI) * 200 + i * 40})`} opacity={t > 0 ? 1 : 0}><circle r={44} fill={OCRE} stroke="#8F8250" strokeWidth={6} /><text textAnchor="middle" y={16} fontFamily={FONT} fontWeight={700} fontSize={44} fill={NAVY}>$</text></g>;
        })}
      </Svg>
      <Pill text="2 RETIROS AL AÑO" x={760} y={1150} k={two} size={44} />
      <Pill text="⚠️ COMISIÓN LOS PRIMEROS 10 AÑOS" x={540} y={1290} k={sp(f, at(L(17).w0 + 5) - 4)} c="#D9534F" tc="#fff" size={40} />
      <Note text="Retiros parciales a partir del año 2 de la póliza." f={f} d={at(L(16).w0 + 3)} dark={dark} top={1370} />
    </AbsoluteFill>
  );
};

const Aportes: React.FC<P> = ({f, at, dark}) => {
  const inn = ease((f - at(L(19).w0 + 2)) / 30);
  return (
    <AbsoluteFill>
      <Big a="¿Y cuando" b="TE SOBRA?" f={f} d={at(L(18).w0) - 6} dark={dark} top={575} size={100} />
      <Svg>
        {[0, 1, 2].map((i) => {
          const t = cl(inn * 1.8 - i * 0.35);
          return <g key={i} transform={`translate(${200 + i * 120 + (540 - 200 - i * 120) * t} ${820 + 180 * t - Math.sin(t * Math.PI) * 120})`} opacity={t > 0 && t < 1 ? 1 : 0}><circle r={40} fill={OCRE} stroke="#8F8250" strokeWidth={6} /><text textAnchor="middle" y={15} fontFamily={FONT} fontWeight={700} fontSize={40} fill={NAVY}>$</text></g>;
        })}
        <g transform={`translate(540 1030) scale(${0.6 * sp(f, 4)})`}><Jar lvl={0.4 + 0.45 * inn} /></g>
      </Svg>
      <Pill text="+ HASTA 3 APORTACIONES EXTRA AL AÑO" x={540} y={1280} k={sp(f, at(L(19).w0 + 6) - 4)} size={40} />
      <Note text="Sujetas a montos mínimos y a un cargo de gestión." f={f} d={at(L(19).w0 + 7)} dark={dark} top={1360} />
    </AbsoluteFill>
  );
};

const Adapta: React.FC<P> = ({f, at, dark}) => {
  const opts = [
    {t: '⏸ PAUSAR', c: '#8DB3E2'},
    {t: '↗ RETIRAR', c: OCRE},
    {t: '+ APORTAR', c: '#7BC4A4'},
  ];
  const ex = sp(f, at(L(21).w0) - 3, 9, 260);
  return (
    <AbsoluteFill>
      <Big a="Se adapta" b="A TU VIDA" f={f} d={at(L(20).w0 + 3) - 4} dark={dark} top={575} size={104} />
      {opts.map((o, i) => (
        <div key={i} style={{position: 'absolute', left: 150, right: 150, top: 830 + i * 170, height: 130, borderRadius: 30, background: o.c, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 58, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${sp(f, at(L(20).w0) + i * 6, 10, 240)})`}}>{o.t}</div>
      ))}
      <Pill text="✓ EXACTO" x={540} y={1380} k={ex} c="#2E7D4F" tc="#fff" size={52} />
    </AbsoluteFill>
  );
};

const TuQue: React.FC<P> = ({f, at}) => {
  const items = [
    {t: 'PAUSAR', c: '#8DB3E2', w: 3},
    {t: 'RETIRAR', c: OCRE, w: 4},
    {t: 'APORTAR', c: '#7BC4A4', w: 6},
  ];
  return (
    <AbsoluteFill>
      <Big a="¿Tú qué" b="HARÍAS?" f={f} d={0} dark={false} top={575} size={120} c={OCRE} />
      {items.map((it, i) => {
        const on = f >= at(L(22).w0 + it.w) - 3;
        return (
          <div key={i} style={{position: 'absolute', left: 120 + i * 290, top: 900, width: 260, height: 260, borderRadius: 40, background: on ? it.c : 'rgba(245,243,238,0.1)', border: `4px solid ${it.c}`, color: on ? NAVY : WARM, fontFamily: FONT, fontWeight: 700, fontSize: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${on ? sp(f, at(L(22).w0 + it.w) - 3, 9, 260) * 0.15 + 0.9 : 0.9})`}}>{it.t}</div>
        );
      })}
    </AbsoluteFill>
  );
};

const LEGAL =
  'Vida Ahorro Creciente es un seguro de vida con ahorro vinculado a fondos de inversión, emitido por Zurich en alianza con Actinver. Contenido únicamente informativo; no constituye recomendación ni oferta. Coberturas, exclusiones, requisitos de suscripción, comisiones y costos sujetos a las condiciones generales del producto. El ahorro invertido en fondos está sujeto a riesgo de mercado y puede presentar minusvalías; rendimientos pasados no garantizan rendimientos futuros.';

const End: React.FC<P> = ({f, at}) => {
  const w0 = L(23).w0;
  const dm = sp(f, 2, 11, 200);
  const fol = sp(f, at(L(24).w0 + 1) - 4, 10, 200);
  const tap = f - at(L(24).w0 + 1) - 4;
  const pressed = tap > 0 && tap < 8;
  const legalAt = at(words.length - 1) + F(LAST.e - LAST.s + 0.5);
  const fade = ease((f - legalAt) / 10);
  return (
    <AbsoluteFill>
      <div style={{opacity: 1 - fade}}>
        <div style={{position: 'absolute', left: 120, top: 560, width: 760, padding: '36px 44px', borderRadius: '40px 40px 40px 8px', background: WARM, fontFamily: FONT, fontSize: 54, fontWeight: 600, color: NAVY, transform: `scale(${dm})`, transformOrigin: 'left bottom', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'}}>
          ✉️ Escríbeme y lo vemos con tu cotización
        </div>
        <div style={{position: 'absolute', left: 120, top: 860, padding: '24px 36px', borderRadius: 30, background: OCRE, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 46, transform: `scale(${sp(f, at(w0 + 6) - 4)})`, transformOrigin: 'left center'}}>📋 COTÍZALO CONMIGO</div>
        <div style={{position: 'absolute', left: 540, top: 1180, transform: `translate(-50%,-50%) scale(${fol * (pressed ? 0.9 : 1)})`, background: pressed || tap >= 8 ? WARM : OCRE, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 60, padding: '24px 64px', borderRadius: 100, boxShadow: '0 16px 40px rgba(0,0,0,0.3)'}}>
          {tap >= 8 ? '✓ SIGUIENDO' : '+ SÍGUEME'}
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 1280, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 40, color: OCRE, opacity: ease((f - at(L(24).w0 + 3)) / 10)}}>Próximo capítulo: muy pronto</div>
      </div>
      <div style={{position: 'absolute', inset: 0, background: NAVY, opacity: fade}} />
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 96, top: 420, width: 330, opacity: fade}} />
      <div style={{position: 'absolute', left: 96, right: 96, top: 560, fontFamily: FONT, fontSize: 64, color: WARM, opacity: fade, lineHeight: 1.1}}>
        <div style={{fontWeight: 300}}>VIDA AHORRO</div>
        <div style={{fontWeight: 700, color: OCRE}}>CRECIENTE</div>
        <div style={{fontWeight: 400, fontSize: 36, marginTop: 14}}>Capítulo 2 · En alianza con Zurich</div>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 110, fontFamily: FONT, fontSize: 24, lineHeight: 1.42, color: 'rgba(245,243,238,0.82)', opacity: fade}}>
        <div style={{fontWeight: 600, fontSize: 26, color: WARM, marginBottom: 12}}>Consulta términos y condiciones de los productos en actinver.com</div>
        {LEGAL}
      </div>
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC<P>> = {hook: Hook, descanso: Descanso, linea: Linea, proteccion: Proteccion, requisitos: Requisitos, retiros: Retiros, aportes: Aportes, adapta: Adapta, tuque: TuQue, end: End};

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

export const Vac2: React.FC = () => {
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
      {cur.k !== 'end' && <div style={{position: 'absolute', left: 60, top: 76, fontFamily: FONT, fontWeight: 700, fontSize: 30, color: light ? NAVY : OCRE, letterSpacing: 2}}>VAC · CAPÍTULO 2</div>}
      {t < LAST.e + 0.3 && <Captions t={t} f={f} />}
      <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: W * cl(t / V2_TOTAL), background: OCRE}} />
      <Audio src={staticFile('vac2/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

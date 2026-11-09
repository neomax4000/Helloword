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
import data from '../public/jpmrvus/words.json';
import {FONT, FPS, W} from './theme';
import {F, cl, ease, sp} from './narrador';
import {NAVY, NAVY2, OCRE, WARM, GRAY, OK, THEMES, ThemeBg} from './banca';

type Word = {i: number; w: string; s: number; e: number; k: boolean};
const words = data.words as Word[];
const LAST = words[words.length - 1];
export const AU_TOTAL = Math.round((LAST.e + 4.6) * 100) / 100; // voz + pantalla legal
const TW = (i: number) => words[i].s;


/* escenas: palabra inicial, componente, fondo (cambia cada 2–3 escenas) */
const SC = [
  {w: 0, k: 'hook', bg: 0},
  {w: 7, k: 'value', bg: 0},
  {w: 13, k: 'growth', bg: 1},
  {w: 18, k: 'intro', bg: 1},
  {w: 23, k: 'jpm', bg: 3},
  {w: 26, k: 'clave', bg: 3},
  {w: 32, k: 'usa', bg: 4},
  {w: 39, k: 'mitad', bg: 4},
  {w: 43, k: 'activa', bg: 5},
  {w: 54, k: 'largo', bg: 5},
  {w: 60, k: 'dias', bg: 0},
  {w: 71, k: 'riesgo', bg: 0},
  {w: 80, k: 'cta1', bg: 1},
  {w: 87, k: 'end', bg: 1},
];
const TD = 12;
const starts = SC.map((s, i) => (i === 0 ? 0 : F(TW(s.w) - 0.14)));
const totalF = F(AU_TOTAL);

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
  flip({direction: 'from-bottom'}),
  wipe({direction: 'from-top-left'}),
  slide({direction: 'from-right'}),
  iris({width: 1080, height: 1920}),
];

type P = {f: number; at: (i: number) => number; dark: boolean};

/* ---------- utilidades ---------- */
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
const Bill: React.FC<{s?: number; o?: number}> = ({s = 1, o = 1}) => (
  <g transform={`scale(${s})`} opacity={o}>
    <rect x={-230} y={-120} width={460} height={240} rx={26} fill="#5E8C6A" stroke="#3E6B4C" strokeWidth={8} />
    <rect x={-200} y={-92} width={400} height={184} rx={16} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={4} />
    <circle r={70} fill="rgba(255,255,255,0.18)" />
    <text textAnchor="middle" y={30} fontFamily={FONT} fontWeight={700} fontSize={96} fill="#fff">$</text>
  </g>
);


const Coin: React.FC<{x: number; y: number; r: number; t: string; k: number; c?: string; tc?: string; fs?: number; o?: number}> = ({x, y, r, t, k, c = OCRE, tc = NAVY, fs, o = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${k})`} opacity={o}>
    <circle r={r} fill={c} />
    <circle r={r - 14} fill="none" stroke="rgba(4,30,66,0.25)" strokeWidth={4} />
    <text textAnchor="middle" y={(fs ?? r) * 0.36} fontFamily={FONT} fontWeight={700} fontSize={fs ?? r} fill={tc}>{t}</text>
  </g>
);


const Shield: React.FC<{x: number; y: number; s: number; c?: string; label?: string; o?: number}> = ({x, y, s, c = OCRE, label, o = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <path d="M0 -150 L120 -105 V10 C120 90 60 140 0 165 C-60 140 -120 90 -120 10 V-105Z" fill={c} stroke={NAVY} strokeWidth={8} />
    {label && <text textAnchor="middle" y={34} fontFamily={FONT} fontWeight={700} fontSize={110} fill={NAVY}>{label}</text>}
  </g>
);

const Hook: React.FC<P> = ({f, at}) => {
  const a = sp(f, 3, 11, 200);
  const b = sp(f, 8, 11, 200);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 60, top: 250, fontFamily: FONT, color: WARM, lineHeight: 1.0, textTransform: 'uppercase'}}>
        <div style={{fontWeight: 700, fontSize: 190, color: WARM}}>VALUE</div>
        <div style={{fontWeight: 300, fontSize: 120}}>o</div>
        <div style={{fontWeight: 700, fontSize: 190, color: OCRE}}>GROWTH</div>
      </div>
      <Svg>
        <g transform={`translate(330 1150) scale(${0.6 + 0.4 * a})`}>
          <rect x={-190} y={-170} width={380} height={340} rx={40} fill={WARM} />
          <text textAnchor="middle" y={-20} fontFamily={FONT} fontWeight={700} fontSize={64} fill={NAVY}>VALUE</text>
          <text textAnchor="middle" y={60} fontFamily={FONT} fontWeight={400} fontSize={36} fill={NAVY}>sólidas</text>
        </g>
        <g transform={`translate(750 1150) scale(${0.6 + 0.4 * b})`}>
          <rect x={-190} y={-170} width={380} height={340} rx={40} fill={OCRE} />
          <text textAnchor="middle" y={-20} fontFamily={FONT} fontWeight={700} fontSize={60} fill={NAVY}>GROWTH</text>
          <text textAnchor="middle" y={60} fontFamily={FONT} fontWeight={400} fontSize={36} fill={NAVY}>crecen</text>
        </g>
      </Svg>
      <Pill text="NO TIENES QUE ELEGIR" x={540} y={1440} k={sp(f, at(3), 10, 220)} c={NAVY2} tc={WARM} size={46} />
    </AbsoluteFill>
  );
};

const ValueS: React.FC<P> = ({f, at, dark}) => {
  const tilt = -9 * (1 - ease((f - at(8)) / 18));
  const k1 = sp(f, at(8) - 4, 11, 200);
  const k2 = sp(f, at(11) - 4, 11, 200);
  return (
    <AbsoluteFill>
      <Head light="Estilo" bold="value" f={f} dark={dark} size={150} />
      <Svg>
        <rect x={525} y={1010} width={30} height={290} fill={WARM} />
        <rect x={400} y={1290} width={280} height={30} rx={12} fill={OCRE} />
        <g transform={`translate(540 1010) rotate(${tilt})`}>
          <rect x={-380} y={-12} width={760} height={24} rx={12} fill={WARM} />
          <g transform={`translate(-330 0) scale(${k1})`}>
            <line x1={0} y1={0} x2={-90} y2={150} stroke={WARM} strokeWidth={6} />
            <line x1={0} y1={0} x2={90} y2={150} stroke={WARM} strokeWidth={6} />
            <path d="M-110 150 H110 Q100 210 0 210 Q-100 210 -110 150Z" fill={OCRE} />
            <rect x={-60} y={60} width={120} height={90} rx={10} fill={WARM} />
            <rect x={-60} y={60} width={120} height={16} fill={NAVY2} />
          </g>
          <g transform={`translate(330 0) scale(${k2})`}>
            <line x1={0} y1={0} x2={-90} y2={150} stroke={WARM} strokeWidth={6} />
            <line x1={0} y1={0} x2={90} y2={150} stroke={WARM} strokeWidth={6} />
            <path d="M-110 150 H110 Q100 210 0 210 Q-100 210 -110 150Z" fill={OCRE} />
            <text textAnchor="middle" y={130} fontFamily={FONT} fontWeight={700} fontSize={90} fill={WARM}>$</text>
          </g>
        </g>
      </Svg>
      <Pill text="EMPRESAS SÓLIDAS" x={330} y={1440} k={sp(f, at(8))} c={NAVY2} tc={WARM} size={36} />
      <Pill text="A BUEN PRECIO" x={760} y={1500} k={sp(f, at(11))} size={36} />
    </AbsoluteFill>
  );
};

const GrowthS: React.FC<P> = ({f, at, dark}) => {
  const up = ease((f - (at(14) - 2)) / 30);
  const e = evolvePath(up, 'M110 1300 L330 1150 L520 1060 L720 880 L930 680');
  const bars = [90, 150, 230, 330, 450];
  const rk = sp(f, at(16) - 6, 12, 160);
  return (
    <AbsoluteFill>
      <Head light="Estilo" bold="growth" f={f} dark={dark} size={150} />
      <Svg>
        {bars.map((h, i) => {
          const g = ease((f - (at(14) + i * 3)) / 10);
          return <rect key={i} x={140 + i * 170} y={1380 - h * g} width={120} height={h * g} rx={14} fill={i === 4 ? OCRE : WARM} opacity={0.9} />;
        })}
        <path d="M110 1300 L330 1150 L520 1060 L720 880 L930 680" stroke={OK} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={e.strokeDasharray} strokeDashoffset={e.strokeDashoffset} />
        <g transform={`translate(${930} ${680 - 20 * rk}) rotate(35) scale(${rk})`}>
          <path d="M0 -90 C40 -50 40 20 20 60 H-20 C-40 20 -40 -50 0 -90Z" fill={WARM} />
          <circle cy={-30} r={14} fill={NAVY} />
          <path d="M-20 40 L-55 80 L-20 70Z M20 40 L55 80 L20 70Z" fill={OCRE} />
        </g>
      </Svg>
      <Pill text="EMPRESAS QUE CRECEN RÁPIDO" x={540} y={1490} k={sp(f, at(16))} c={NAVY2} tc={WARM} size={36} />
    </AbsoluteFill>
  );
};

const Intro: React.FC<P> = ({f, at}) => {
  const a = sp(f, 4, 10, 220);
  const b = sp(f, 9, 10, 220);
  const line = ease((f - 14) / 16);
  const logo = sp(f, 18);
  const e = evolvePath(line, 'M100 980 H860');
  return (
    <AbsoluteFill>
      <CameraMotionBlur shutterAngle={200} samples={5}>
        <AbsoluteFill>
          <div style={{position: 'absolute', left: 96, top: 480, fontFamily: FONT, color: WARM, lineHeight: 0.95}}>
            <div style={{fontWeight: 300, fontSize: 210, transform: `translateX(${(1 - a) * -900}px)`}}>JPM</div>
            <div style={{fontWeight: 700, fontSize: 250, color: OCRE, transform: `translateX(${(1 - b) * 1000}px)`}}>RVUS</div>
          </div>
        </AbsoluteFill>
      </CameraMotionBlur>
      <Svg>
        <path d="M100 980 H860" stroke={WARM} strokeWidth={6} strokeLinecap="round" strokeDasharray={e.strokeDasharray} strokeDashoffset={e.strokeDashoffset} />
      </Svg>
      <div style={{position: 'absolute', left: 100, top: 1020, fontFamily: FONT, fontSize: 42, color: WARM, opacity: ease((f - 12) / 10)}}>Renta variable especializada global</div>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 100, top: 1110, width: 300, opacity: cl(logo * 1.5), transform: `scale(${0.8 + 0.2 * logo})`, transformOrigin: 'left center'}} />
      <Pill text="JUNTA LOS DOS ESTILOS" x={400} y={1400} k={sp(f, at(19))} size={46} />
      <Sequence from={0} durationInFrames={40}>
        <AbsoluteFill style={{mixBlendMode: 'screen', opacity: 0.4}}>
          <LightLeak seed={11} hueShift={30} durationInFrames={40} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

const Jpm: React.FC<P> = ({f, at, dark}) => {
  const l = sp(f, 2, 12, 170);
  const r = sp(f, 6, 12, 170);
  const m = sp(f, 12, 10, 200);
  return (
    <AbsoluteFill>
      <Head light="En alianza" bold="con J.P. Morgan" f={f} dark={dark} size={96} />
      <Svg>
        <g transform={`translate(${200 + 150 * m} 1090) scale(${l})`}>
          <circle r={190} fill={WARM} />
          <text textAnchor="middle" y={14} fontFamily={FONT} fontWeight={700} fontSize={52} fill={NAVY}>ACTINVER</text>
        </g>
        <g transform={`translate(${880 - 150 * m} 1090) scale(${r})`}>
          <circle r={190} fill={OCRE} />
          <text textAnchor="middle" y={-6} fontFamily={FONT} fontWeight={700} fontSize={50} fill={NAVY}>J.P. Morgan</text>
          <text textAnchor="middle" y={44} fontFamily={FONT} fontWeight={400} fontSize={30} fill={NAVY}>Asset Management</text>
        </g>
      </Svg>
      <Note text="Fondo de Actinver en alianza con J.P. Morgan Asset Management." f={f} d={8} dark={dark} top={1400} />
    </AbsoluteFill>
  );
};

const Clave: React.FC<P> = ({f, at, dark}) => {
  const tap = f - at(27) - 6;
  const pressed = tap > 0 && tap < 8;
  const fol = sp(f, at(27) - 8, 10, 200);
  return (
    <AbsoluteFill>
      <Head light="Aquí viene" bold="lo clave" f={f} dark={dark} size={130} />
      <div style={{position: 'absolute', left: 540, top: 1130, transform: `translate(-50%,-50%) scale(${fol * (pressed ? 0.9 : 1)})`, background: tap >= 8 ? WARM : OCRE, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 72, padding: '28px 80px', borderRadius: 100, boxShadow: '0 16px 40px rgba(0,0,0,0.3)', whiteSpace: 'nowrap'}}>
        {tap >= 8 ? '✓ SIGUIENDO' : '+ SÍGUEME'}
      </div>
      {tap > -6 && tap < 14 && <div style={{position: 'absolute', left: 650 - Math.min(tap + 6, 6) * 6, top: 1150 - Math.min(tap + 6, 6) * 4, fontSize: 96, transform: pressed ? 'scale(0.85)' : 'none'}}>👆</div>}
    </AbsoluteFill>
  );
};

const Usa: React.FC<P> = ({f, at, dark}) => {
  const hs = [260, 420, 330, 560, 380, 480, 300];
  const st = sp(f, at(37) - 4, 10, 220);
  return (
    <AbsoluteFill>
      <Head light="Emisoras" bold="americanas" f={f} dark={dark} size={118} />
      <Svg>
        <rect x={80} y={1380} width={920} height={20} rx={8} fill={OCRE} />
        {hs.map((h, i) => {
          const g = ease((f - (at(34) + i * 3)) / 12);
          return (
            <g key={i}>
              <rect x={100 + i * 130} y={1380 - h * g} width={110} height={h * g} rx={10} fill={i === 3 ? OCRE : WARM} />
              {g > 0.9 && [0, 1, 2].map((j) => <rect key={j} x={120 + i * 130} y={1380 - h + 30 + j * 55} width={22} height={26} fill={NAVY2} opacity={0.6} />)}
            </g>
          );
        })}
        <g transform={`translate(830 760) scale(${st})`}>
          <Star points={5} innerRadius={42} outerRadius={100} fill={OCRE} cornerRadius={6} />
        </g>
      </Svg>
      <Pill text="MAYOR CONVICCIÓN" x={540} y={1470} k={sp(f, at(37))} c={NAVY2} tc={WARM} size={44} />
      <Note text="Ilustración, no representa la composición exacta del fondo." f={f} d={at(34)} dark={dark} top={565} />
    </AbsoluteFill>
  );
};

const Mitad: React.FC<P> = ({f, at, dark}) => {
  const l = sp(f, at(39) - 5, 11, 180);
  const r = sp(f, at(41) - 5, 11, 180);
  return (
    <AbsoluteFill>
      <Head light="Mitad value," bold="mitad growth" f={f} dark={dark} size={100} />
      <Svg>
        <g transform={`translate(${540 - 12 * l} 1120)`}>
          <path d="M0 -230 A230 230 0 0 0 0 230Z" fill={WARM} transform={`scale(${l})`} />
          <text x={-120} y={10} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill={NAVY} opacity={l}>VALUE</text>
        </g>
        <g transform={`translate(${540 + 12 * r} 1120)`}>
          <path d="M0 -230 A230 230 0 0 1 0 230Z" fill={OCRE} transform={`scale(${r})`} />
          <text x={120} y={10} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={NAVY} opacity={r}>GROWTH</text>
        </g>
      </Svg>
      <Note text="Enfoque según la ficha del fondo. Ilustración." f={f} d={at(39)} dark={dark} top={565} />
    </AbsoluteFill>
  );
};

const Activa: React.FC<P> = ({f, at, dark}) => {
  const n = 14;
  const sel = [1, 4, 6, 9, 12];
  const star = sp(f, at(52) - 4, 10, 220);
  return (
    <AbsoluteFill>
      <Head light="Gestión activa," bold="pocas emisoras" f={f} dark={dark} size={90} />
      <Svg>
        {new Array(n).fill(0).map((_, i) => {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2;
          const x = 540 + Math.cos(a) * 300;
          const y = 1100 + Math.sin(a) * 300;
          const show = sp(f, 3 + i, 12, 180);
          const hi = sel.includes(i) ? ease((f - (at(48) - 2 + sel.indexOf(i) * 3)) / 8) : 0;
          return <circle key={i} cx={x} cy={y} r={(34 + 24 * hi) * show} fill={hi > 0.5 ? OCRE : WARM} opacity={hi > 0.5 ? 1 : 0.35} />;
        })}
        <circle cx={540} cy={1100} r={110 * star} fill={WARM} />
        <text x={540} y={1130} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={90 * star} fill={NAVY}>★</text>
      </Svg>
      <Pill text="ALTA CALIDAD" x={540} y={1500} k={sp(f, at(52))} c={NAVY2} tc={WARM} size={46} />
      <Note text="Ilustración, no representa la cartera del fondo." f={f} d={at(48)} dark={dark} top={565} />
    </AbsoluteFill>
  );
};

const Largo: React.FC<P> = ({f, at, dark}) => {
  const g = ease((f - (at(58) - 10)) / 40);
  const pts = 'M110 1330 C300 1330 380 1130 560 1100 S800 880 960 760';
  const e = evolvePath(g, pts);
  return (
    <AbsoluteFill>
      <Head light="Fondo de" bold="largo plazo" f={f} dark={dark} size={118} />
      <Svg>
        <line x1={100} y1={1380} x2={980} y2={1380} stroke="rgba(245,243,238,0.4)" strokeWidth={4} />
        {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={160 + i * 160} y1={1370} x2={160 + i * 160} y2={1390} stroke={WARM} strokeWidth={4} />)}
        <path d={pts} stroke={OK} strokeWidth={16} fill="none" strokeLinecap="round" strokeDasharray={e.strokeDasharray} strokeDashoffset={e.strokeDashoffset} />
      </Svg>
      <Pill text="TU HORIZONTE: LARGO PLAZO" x={540} y={1490} k={sp(f, at(58))} size={38} />
      <Note text="Ilustración, no representa datos reales." f={f} d={at(58)} dark={dark} top={565} />
    </AbsoluteFill>
  );
};

const Dias: React.FC<P> = ({f, at, dark}) => {
  const days = ['L', 'M', 'M', 'J', 'V'];
  const badge = sp(f, at(69) - 5, 10, 220);
  return (
    <AbsoluteFill>
      <Head light="Cualquier" bold="día hábil" f={f} dark={dark} size={118} />
      <div style={{position: 'absolute', left: 70, right: 70, top: 640, display: 'flex', gap: 14, justifyContent: 'center'}}>
        {days.map((d, i) => {
          const on = ease((f - (at(63) - 2 + i * 4)) / 8);
          return (
            <div key={i} style={{width: 176, height: 230, borderRadius: 30, background: on > 0.5 ? OCRE : WARM, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6}}>
              {d}
              <span style={{fontSize: 56, opacity: on > 0.5 ? 1 : 0}}>✓</span>
            </div>
          );
        })}
      </div>
      <Svg>
        <Coin x={540} y={1210} r={140} t="24 H" k={badge} fs={96} />
      </Svg>
      <Pill text="LIQUIDACIÓN EN 24 HORAS" x={540} y={1440} k={sp(f, at(67))} c={NAVY2} tc={WARM} size={42} />
      <Note text="Compras y ventas todos los días hábiles, según la ficha." f={f} d={at(63)} dark={dark} top={565} />
    </AbsoluteFill>
  );
};

const Riesgo: React.FC<P> = ({f, at, dark}) => {
  const up = ease((f - at(74)) / 14);
  const down = ease((f - at(76)) / 14);
  const stamp = sp(f, at(77) - 3, 9, 240);
  const path = 'M100 1040 L240 760 L380 960 L520 700 L640 900 L760 660';
  const path2 = 'M760 660 L900 980';
  const e1 = evolvePath(up, path);
  const e2 = evolvePath(down, path2);
  return (
    <AbsoluteFill>
      <Head light="El valor puede" bold="subir o bajar" f={f} dark={dark} size={92} />
      <Svg>
        <line x1={100} y1={1100} x2={980} y2={1100} stroke="rgba(245,243,238,0.4)" strokeWidth={4} />
        <path d={path} stroke={OK} strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={e1.strokeDasharray} strokeDashoffset={e1.strokeDashoffset} />
        <path d={path2} stroke="#D9534F" strokeWidth={18} fill="none" strokeLinecap="round" strokeDasharray={e2.strokeDasharray} strokeDashoffset={e2.strokeDashoffset} />
        <g transform={`translate(540 1330) rotate(-3) scale(${stamp})`}>
          <rect x={-300} y={-80} width={600} height={160} rx={30} fill="none" stroke={OCRE} strokeWidth={10} />
          <text textAnchor="middle" y={26} fontFamily={FONT} fontWeight={700} fontSize={78} fill={OCRE}>NO ES GARANTÍA</text>
        </g>
      </Svg>
      <Pill text="PUEDE HABER MINUSVALÍAS" x={540} y={1476} k={sp(f, at(73))} c={NAVY2} tc={WARM} size={40} />
      <Note text="Ilustración, no representa datos reales." f={f} d={at(73)} dark={dark} top={565} />
    </AbsoluteFill>
  );
};

const Cta1: React.FC<P> = ({f, at}) => {
  const k = sp(f, 2, 10, 200);
  const q = sp(f, at(85), 10, 220);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 70, top: 300, fontFamily: FONT, color: WARM, fontSize: 120, lineHeight: 1.05, transform: `scale(${0.7 + 0.3 * k})`, transformOrigin: 'left top', opacity: cl(k * 2)}}>
        <div style={{fontWeight: 300}}>¿VALUE O</div>
        <div style={{fontWeight: 700, color: OCRE}}>GROWTH?</div>
      </div>
      <Svg>
        <Coin x={300} y={1100} r={140} t="V" k={sp(f, at(80), 10, 220)} c={WARM} fs={170} />
        <Coin x={780} y={1100} r={140} t="G" k={sp(f, at(82), 10, 220)} fs={170} />
        <Coin x={540} y={1100} r={90} t="?" k={q * (1 + 0.04 * Math.sin(f / 5))} c={NAVY2} tc={WARM} fs={120} />
      </Svg>
      <Pill text="¿CUÁL VA MÁS CONTIGO?" x={540} y={1440} k={sp(f, at(83), 10, 220)} size={46} />
    </AbsoluteFill>
  );
};

const LEGAL =
  'El contenido es únicamente informativo, no constituye recomendación, consejo o sugerencia personalizada de algún producto y/o servicio que le sugieran la toma de decisiones de inversión, para lo que se necesita previamente verificar la congruencia entre el perfil del cliente y el perfil del producto financiero. Rendimientos pasados no garantizan rendimientos futuros. El valor de las acciones de Fondos de Inversión conlleva un riesgo de mercado incluyendo una posible minusvalía del capital invertido. Los fondos de inversión no están garantizados por Grupo Financiero Actinver S.A. de C.V, o por alguna entidad integrante del Grupo Financiero Actinver, ni por ninguna entidad gubernamental, ni por el IPAB y pueden tener minusvalías del capital invertido. Todos los Fondos de Actinver cuentan con Prospecto de Información al Público Inversionista y Documentos con Información Clave, los cuales se encuentran a su disposición en www.actinver.com/fondos.';

const End: React.FC<P> = ({f, at}) => {
  const dm = sp(f, 2, 11, 200);
  const send = ease((f - at(87)) / 10);
  const card = sp(f, at(88) - 4, 11, 220);
  const fol = sp(f, at(92), 10, 200);
  const tap = f - at(95) - 4;
  const pressed = tap > 0 && tap < 8;
  const legalAt = F(LAST.e + 0.5) - starts[SC.length - 1];
  const fade = ease((f - legalAt) / 10);
  return (
    <AbsoluteFill>
      <div style={{opacity: 1 - fade}}>
        <div style={{position: 'absolute', left: 120, top: 260, width: 700, padding: '34px 40px', borderRadius: '40px 40px 40px 8px', background: WARM, fontFamily: FONT, fontSize: 52, fontWeight: 600, color: NAVY, transform: `scale(${dm}) translateY(${-send * 30}px)`, transformOrigin: 'left bottom', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'}}>
          ✉️ Escríbeme y lo revisamos juntos
        </div>
        <div style={{position: 'absolute', left: 96, top: 600, width: 888, borderRadius: 32, background: OCRE, color: NAVY, fontFamily: FONT, padding: '40px 44px', boxSizing: 'border-box', transform: `translateX(${(1 - card) * 1000}px)`, boxShadow: '0 16px 40px rgba(0,0,0,0.3)'}}>
          <div style={{fontWeight: 700, fontSize: 84}}>JPMRVUS</div>
          <div style={{fontWeight: 400, fontSize: 36, marginTop: 6}}>Renta variable especializada global</div>
          <div style={{fontWeight: 400, fontSize: 40}}>En alianza con J.P. Morgan Asset Management</div>
        </div>
        <div style={{position: 'absolute', left: 540, top: 1190, transform: `translate(-50%,-50%) scale(${fol * (pressed ? 0.9 : 1)})`, background: pressed || tap >= 8 ? WARM : OCRE, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 64, padding: '26px 70px', borderRadius: 100, whiteSpace: 'nowrap', boxShadow: '0 16px 40px rgba(0,0,0,0.3)'}}>
          {tap >= 8 ? '✓ SIGUIENDO' : '+ SÍGUEME'}
        </div>
        {tap > -6 && tap < 14 && <div style={{position: 'absolute', left: 600 - Math.min(tap + 6, 6) * 6, top: 1210 - Math.min(tap + 6, 6) * 4, fontSize: 90, transform: pressed ? 'scale(0.85)' : 'none'}}>👆</div>}
      </div>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 96, top: 420, width: 330, opacity: fade}} />
      <div style={{position: 'absolute', left: 96, right: 96, top: 560, fontFamily: FONT, fontSize: 64, color: WARM, opacity: fade, lineHeight: 1.1}}>
        <span style={{fontWeight: 300}}>FONDO </span>
        <span style={{fontWeight: 700, color: OCRE}}>JPMRVUS</span>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 90, fontFamily: FONT, fontSize: 21, lineHeight: 1.38, color: 'rgba(245,243,238,0.8)', opacity: fade}}>
        <div style={{fontWeight: 600, fontSize: 24, color: WARM, marginBottom: 10}}>Datos de la ficha de actinver.com/jpmrvus. Rendimientos pasados no garantizan rendimientos futuros. Consulta términos y condiciones de los productos en actinver.com</div>
        {LEGAL}
      </div>
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC<P>> = {hook: Hook, value: ValueS, growth: GrowthS, intro: Intro, jpm: Jpm, clave: Clave, usa: Usa, mitad: Mitad, activa: Activa, largo: Largo, dias: Dias, riesgo: Riesgo, cta1: Cta1, end: End};

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
  const punch = isEnd ? 0 : 0.07 * Math.exp(-(g - last) / 4);
  const zs = [1, 1.05, 1.02, 1.07];
  const z = isEnd ? 1 : zs[n % 4] + 0.02 * (f / Math.max(1, next - s0));
  const rot = isEnd ? 0 : [0, -0.6, 0.5, 0][n % 4];
  const C = MAP[sc.k];
  return (
    <AbsoluteFill>
      <ThemeBg n={sc.bg} f={g} />
      <Particles f={g} dark={dark} seed={sc.k} />
      <AbsoluteFill style={{transform: `scale(${z + punch}) rotate(${rot}deg)`, transformOrigin: '540px 860px'}}>
        <C f={f} at={at} dark={dark} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- subtítulos karaoke ---------- */
type G = {ws: Word[]; a: number; b: number};
const groups: G[] = (() => {
  const gs: G[] = [];
  let cur: Word[] = [];
  let len = 0;
  words.forEach((w, idx) => {
    cur.push(w);
    len += w.w.length + 1;
    const nx = words[idx + 1];
    const brk = /[,.?!:…]$/.test(w.w) || cur.length >= 4 || len > 18 || !nx || nx.s - w.e > 0.5;
    if (brk) {
      gs.push({ws: cur, a: cur[0].s - 0.06, b: 0});
      cur = [];
      len = 0;
    }
  });
  gs.forEach((g, i) => {
    const l = g.ws[g.ws.length - 1];
    g.b = gs[i + 1] ? Math.min(gs[i + 1].a, l.e + 0.4) : l.e + 0.6;
  });
  return gs;
})();
const Captions: React.FC<{t: number; f: number}> = ({t, f}) => {
  const g = groups.find((x) => t >= x.a && t < x.b);
  if (!g) return null;
  const k = sp(f, F(g.a), 12, 260);
  let active = -1;
  g.ws.forEach((w) => {
    if (t >= w.s - 0.03) active = w.i;
  });
  if (t > g.ws[g.ws.length - 1].e + 0.1) active = -1;
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: 1560, display: 'flex', justifyContent: 'center', transform: `scale(${0.85 + 0.15 * k})`, opacity: cl(k * 2)}}>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 16px', background: 'rgba(4,30,66,0.9)', borderRadius: 30, padding: '16px 28px', border: '1.5px solid rgba(179,163,105,0.35)'}}>
        {g.ws.map((w) => {
          const on = w.i === active;
          return (
            <span key={w.i} style={{fontFamily: FONT, fontWeight: 700, fontSize: 72, lineHeight: 1.15, color: on ? NAVY : w.k ? OCRE : WARM, background: on ? OCRE : 'transparent', borderRadius: 14, padding: '0 10px', display: 'inline-block', transform: on ? 'scale(1.06)' : 'none'}}>
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const Jpmrvus: React.FC = () => {
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
      {cur.k !== 'intro' && cur.k !== 'end' && cur.k !== 'hook' && <Img src={staticFile(light ? 'logo_azul.png' : 'logo_blanco.png')} style={{position: 'absolute', right: 60, top: 70, width: 210}} />}
      {t < LAST.e + 0.3 && <Captions t={t} f={f} />}
      <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: W * cl(t / AU_TOTAL), background: OCRE}} />
      <Audio src={staticFile('jpmrvus/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

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
import {Star, Pie as PieShape} from '@remotion/shapes';
import {LightLeak} from '@remotion/light-leaks';
import data from '../public/actigob/words.json';
import {FONT, FPS, W} from './theme';
import {F, cl, ease, sp} from './narrador';
import {NAVY, NAVY2, OCRE, WARM, GRAY, OK, THEMES, ThemeBg} from './banca';

type Word = {i: number; w: string; s: number; e: number; k: boolean; p: number};
const words = data.words as Word[];
const phrases = data.phrases as {p: number; s: number; e: number}[];
export const AG_TOTAL = data.total;
const TW = (i: number) => words[i].s;

/* escenas: frase inicial, componente, fondo */
const SC = [
  {p: 0, k: 'idle', bg: 0},
  {p: 2, k: 'work', bg: 0},
  {p: 4, k: 'intro', bg: 1},
  {p: 6, k: 'gob', bg: 1},
  {p: 8, k: 'cetes', bg: 2},
  {p: 10, k: 'rating', bg: 2},
  {p: 11, k: 'liq', bg: 3},
  {p: 14, k: 'usos', bg: 3},
  {p: 15, k: 'uso1', bg: 4},
  {p: 16, k: 'uso2', bg: 4},
  {p: 18, k: 'uso3', bg: 5},
  {p: 21, k: 'empresa', bg: 5},
  {p: 22, k: 'cta1', bg: 0},
  {p: 23, k: 'end', bg: 0},
];
const TD = 12; // frames de transición
const starts = SC.map((s, i) => (i === 0 ? 0 : F(phrases[s.p].s - 0.12)));
const totalF = F(AG_TOTAL);
export const sceneStarts = starts;

const TRANS = [
  slide({direction: 'from-right'}),
  iris({width: 1080, height: 1920}),
  wipe({direction: 'from-bottom-left'}),
  flip({direction: 'from-right'}),
  clockWipe({width: 1080, height: 1920}),
  slide({direction: 'from-bottom'}),
  iris({width: 1080, height: 1920}),
  wipe({direction: 'from-right'}),
  flip({direction: 'from-bottom'}),
  slide({direction: 'from-left'}),
  clockWipe({width: 1080, height: 1920}),
  wipe({direction: 'from-top'}),
  slide({direction: 'from-right'}),
];

type P = {f: number; at: (i: number) => number; dark: boolean};

/* ---------- utilidades visuales ---------- */
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
const Coin: React.FC<{x: number; y: number; s?: number; r?: number}> = ({x, y, s = 1, r = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${r})`}>
    <circle r={60} fill={OCRE} stroke="#8F8250" strokeWidth={8} />
    <circle r={42} fill="none" stroke="#8F8250" strokeWidth={4} />
    <text textAnchor="middle" y={20} fontFamily={FONT} fontWeight={700} fontSize={56} fill={NAVY}>$</text>
  </g>
);

/* ---------- escenas ---------- */
const Idle: React.FC<P> = ({f, at, dark}) => {
  const k = sp(f, 4, 12, 160);
  const nada = sp(f, at(8));
  return (
    <AbsoluteFill>
      <Head light="¿Dinero" bold="parado?" f={f} dark={dark} size={120} />
      <Svg>
        <g transform={`translate(540 900) scale(${k})`}>
          <rect x={-330} y={-200} width={660} height={400} rx={40} fill={NAVY2} stroke="rgba(245,243,238,0.25)" strokeWidth={3} />
          <text x={-280} y={-120} fontFamily={FONT} fontSize={38} fill="rgba(245,243,238,0.7)">Tu cuenta</text>
          <path d="M-280 80 H280" stroke={GRAY} strokeWidth={10} strokeLinecap="round" />
          <circle cx={-280 + ((f * 4) % 560)} cy={80} r={14} fill={nada > 0.1 ? '#8A8F96' : OCRE} />
          <text x={-280} y={-40} fontFamily={FONT} fontWeight={700} fontSize={64} fill={WARM}>$ • • • • • •</text>
        </g>
        {[0, 1, 2].map((i) => {
          const z = ((f + i * 14) % 42) / 42;
          return <text key={i} x={760 + z * 90 + i * 20} y={640 - z * 160} fontFamily={FONT} fontWeight={700} fontSize={50 + i * 14} fill={OCRE} opacity={(1 - z) * cl(nada * 2)}>z</text>;
        })}
      </Svg>
      <Pill text="SIN HACER NADA" x={540} y={1260} k={nada} c={GRAY} tc={WARM} />
    </AbsoluteFill>
  );
};

const Work: React.FC<P> = ({f, at, dark}) => {
  const k = sp(f, 2);
  const disp = sp(f, at(18));
  return (
    <AbsoluteFill>
      <Head light="Ponlo a" bold="trabajar" f={f} dark={dark} size={110} />
      <Svg>
        <g transform={`translate(540 980) scale(${k})`}>
          <g transform={`rotate(${f * 3})`}>
            {new Array(10).fill(0).map((_, i) => <rect key={i} x={-26} y={-200} width={52} height={60} rx={10} fill={GRAY} transform={`rotate(${i * 36})`} />)}
            <circle r={160} fill={GRAY} />
            <circle r={70} fill={NAVY} />
          </g>
          {[0, 1, 2].map((i) => {
            const ph = ((f + i * 12) % 36) / 36;
            return <Coin key={i} x={-200 + i * 200} y={-250 - Math.sin(ph * Math.PI) * 90} s={0.7} r={ph * 360} />;
          })}
        </g>
      </Svg>
      <Pill text="✓ DISPONIBLE" x={540} y={1240} k={disp} c={OK} tc="#fff" size={60} />
    </AbsoluteFill>
  );
};

const Intro: React.FC<P> = ({f, at}) => {
  const a = sp(f, 4, 10, 220);
  const b = sp(f, 9, 10, 220);
  const line = ease((f - 14) / 16);
  const sub = sp(f, at(22));
  const logo = sp(f, at(27));
  return (
    <AbsoluteFill>
      <CameraMotionBlur shutterAngle={200} samples={5}>
        <AbsoluteFill>
          <div style={{position: 'absolute', left: 96, top: 520, fontFamily: FONT, color: WARM, lineHeight: 0.95}}>
            <div style={{fontWeight: 300, fontSize: 230, transform: `translateX(${(1 - a) * -900}px)`}}>ACTI</div>
            <div style={{fontWeight: 700, fontSize: 250, color: OCRE, transform: `translateX(${(1 - b) * 1000}px)`}}>GOB</div>
          </div>
        </AbsoluteFill>
      </CameraMotionBlur>
      <Svg>
        <path d="M100 1020 H860" stroke={WARM} strokeWidth={6} strokeLinecap="round" {...(() => { const e = evolvePath(line, 'M100 1020 H860'); return {strokeDasharray: e.strokeDasharray, strokeDashoffset: e.strokeDashoffset}; })()} />
      </Svg>
      <div style={{position: 'absolute', left: 100, top: 1060, fontFamily: FONT, fontSize: 50, color: WARM, opacity: cl(sub * 1.5), transform: `translateY(${(1 - sub) * 30}px)`}}>Fondo de inversión de deuda</div>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 100, top: 1170, width: 300, opacity: cl(logo * 1.5), transform: `scale(${0.8 + 0.2 * logo})`, transformOrigin: 'left center'}} />
      <Sequence from={0} durationInFrames={40}>
        <AbsoluteFill style={{mixBlendMode: 'screen', opacity: 0.4}}>
          <LightLeak seed={3} hueShift={30} durationInFrames={40} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

const Gob: React.FC<P> = ({f, at, dark}) => {
  const c = ease((f - at(33)) / 24);
  const g = sp(f, at(35));
  const needle = interpolate(ease((f - at(35)) / 18), [0, 1], [90, -55]);
  return (
    <AbsoluteFill>
      <Head light="Deuda" bold="gubernamental" f={f} dark={dark} size={96} />
      <Svg>
        <g transform="translate(330 820)">
          <circle r={190} fill="none" stroke="rgba(245,243,238,0.15)" strokeWidth={34} />
          <circle r={190} fill="none" stroke={OCRE} strokeWidth={34} strokeLinecap="round" strokeDasharray={`${1194 * c} 1194`} transform="rotate(-90)" />
          <text textAnchor="middle" y={30} fontFamily={FONT} fontWeight={700} fontSize={110} fill={WARM}>{Math.round(c * 100)}%</text>
          <text textAnchor="middle" y={300} fontFamily={FONT} fontSize={40} fill={WARM}>gubernamental</text>
        </g>
        <g transform={`translate(800 900) scale(${g})`}>
          <path d="M-190 0 A190 190 0 0 1 -63 -179" stroke={OK} strokeWidth={40} fill="none" />
          <path d="M-63 -179 A190 190 0 0 1 63 -179" stroke={OCRE} strokeWidth={40} fill="none" />
          <path d="M63 -179 A190 190 0 0 1 190 0" stroke="#D9534F" strokeWidth={40} fill="none" />
          <g transform={`rotate(${needle})`}>
            <path d="M-10 0 L0 -160 L10 0Z" fill={WARM} />
          </g>
          <circle r={20} fill={WARM} />
          <text textAnchor="middle" y={90} fontFamily={FONT} fontWeight={700} fontSize={48} fill={WARM}>RIESGO</text>
          <text textAnchor="middle" y={150} fontFamily={FONT} fontWeight={700} fontSize={48} fill={OK}>BAJO</text>
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

const Cetes: React.FC<P> = ({f, at, dark}) => {
  const b1 = ease((f - 8) / 20);
  const b2 = ease((f - at(42)) / 20);
  const ce = sp(f, at(45));
  const c = dark ? NAVY : WARM;
  return (
    <AbsoluteFill>
      <Head light="Su" bold="objetivo" f={f} dark={dark} size={110} />
      <Svg>
        <line x1={150} x2={930} y1={1200} y2={1200} stroke={c} strokeWidth={4} opacity={0.4} />
        <rect x={230} y={1200 - 520 * b1} width={240} height={520 * b1} rx={20} fill={GRAY} />
        <rect x={610} y={1200 - 560 * b2} width={240} height={560 * b2} rx={20} fill={NAVY} />
        <text x={350} y={1270} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill={c} opacity={b1} transform={`translate(350 1255) scale(${1 + 0.25 * ce}) translate(-350 -1255)`}>CETES</text>
        <text x={730} y={1270} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill={c} opacity={b2}>ACTIGOB</text>
        <text x={730} y={1200 - 560 * b2 - 40} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={OCRE} opacity={b2}>similar o superior</text>
      </Svg>
      <Note text="Es el objetivo del fondo, no una garantía." f={f} d={at(45)} dark={dark} top={1310} />
    </AbsoluteFill>
  );
};

const Rating: React.FC<P> = ({f, at, dark}) => {
  const st = sp(f, at(51), 9, 260);
  const shake = f > at(51) && f < at(51) + 8 ? Math.sin(f * 3) * 10 : 0;
  return (
    <AbsoluteFill style={{transform: `translate(${shake}px, ${shake / 2}px)`}}>
      <Head light="Calificación" bold="HR Ratings" f={f} dark={dark} size={100} />
      <Svg>
        <g transform={`translate(540 860) scale(${0.3 + 0.7 * st}) rotate(${(1 - st) * -40 + f * 0.3})`}>
          <g transform="translate(-260 -260)">
            <Star points={18} innerRadius={220} outerRadius={260} fill={OCRE} />
          </g>
          <circle r={190} fill={NAVY} />
          <circle r={170} fill="none" stroke={OCRE} strokeWidth={4} />
        </g>
        <g transform={`translate(540 860) scale(${0.3 + 0.7 * st})`}>
          <text textAnchor="middle" y={30} fontFamily={FONT} fontWeight={700} fontSize={110} fill={WARM}>AAA/2</text>
          <text textAnchor="middle" y={100} fontFamily={FONT} fontSize={42} fill={OCRE}>HR Ratings</text>
        </g>
      </Svg>
      <Note text="Calificación según actinver.com, marzo 2026." f={f} d={at(53)} dark={dark} top={1240} />
    </AbsoluteFill>
  );
};

const Liq: React.FC<P> = ({f, at, dark}) => {
  const big = sp(f, 2, 9, 220);
  const out = ease((f - at(57)) / 8);
  const days = ['L', 'M', 'M', 'J', 'V'];
  const same = sp(f, at(69));
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', fontFamily: FONT, color: WARM, fontSize: 150, lineHeight: 1, transform: `scale(${big * (1 - out)})`, opacity: 1 - out}}>
        <div style={{fontWeight: 300}}>Y LO</div>
        <div style={{fontWeight: 700, color: OCRE}}>MEJOR</div>
      </div>
      <div style={{opacity: out}}>
        <Head light="Compra y venta" bold="diaria" f={f} d={at(58)} dark={dark} size={92} />
        <div style={{position: 'absolute', left: 90, right: 90, top: 640, display: 'flex', justifyContent: 'space-between'}}>
          {days.map((d, i) => {
            const k = sp(f, at(59) + i * 5, 10, 240);
            return (
              <div key={i} style={{width: 160, height: 200, borderRadius: 26, background: NAVY2, border: '2px solid rgba(245,243,238,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: WARM}}>
                <div style={{fontSize: 56, fontWeight: 700}}>{d}</div>
                <div style={{width: 74, height: 74, borderRadius: 40, background: OK, color: '#fff', fontSize: 50, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${k})`}}>✓</div>
              </div>
            );
          })}
        </div>
        <Pill text="SE LIQUIDA EL MISMO DÍA" x={540} y={1080} k={same} size={56} />
        <Note text="Días hábiles. Horario del fondo: 8:00 a 13:45 h (Centro de México)." f={f} d={at(69)} dark={dark} top={1200} />
      </div>
    </AbsoluteFill>
  );
};

const Usos: React.FC<P> = ({f}) => {
  const k = sp(f, 2, 9, 200);
  return (
    <AbsoluteFill>
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 540 + noise2D('q' + i, f / 40, i) * 380;
        const y = 820 + noise2D('w' + i, i, f / 40) * 420;
        return <div key={i} style={{position: 'absolute', left: x, top: y, fontFamily: FONT, fontWeight: 700, fontSize: 90 + i * 20, color: OCRE, opacity: 0.25}}>?</div>;
      })}
      <div style={{position: 'absolute', left: 96, right: 60, top: 640, fontFamily: FONT, color: WARM, fontSize: 130, lineHeight: 1.02, transform: `scale(${0.6 + 0.4 * k})`, transformOrigin: 'left center', opacity: cl(k * 2)}}>
        <div style={{fontWeight: 300}}>¿PARA QUÉ</div>
        <div style={{fontWeight: 700}}>
          TE <span style={{color: OCRE}}>SIRVE?</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Num: React.FC<{n: string; f: number}> = ({n, f}) => {
  const k = sp(f, 0, 9, 240);
  return <div style={{position: 'absolute', left: 80, top: 230, fontFamily: FONT, fontWeight: 700, fontSize: 300, color: OCRE, lineHeight: 1, transform: `scale(${k}) rotate(${(1 - k) * -30}deg)`, transformOrigin: 'left top'}}>{n}</div>;
};

const Uso1: React.FC<P> = ({f, at, dark}) => {
  const open = sp(f, at(78), 10, 160);
  return (
    <AbsoluteFill>
      <Num n="1" f={f} />
      <Svg>
        {new Array(14).fill(0).map((_, i) => {
          const y = ((f * 14 + i * 97) % 700) + 380;
          const x = 200 + ((i * 131) % 700);
          const blocked = Math.abs(x - 560) < 300 * open && y > 700;
          return !blocked && <line key={i} x1={x} x2={x - 10} y1={y} y2={y + 40} stroke="rgba(245,243,238,0.5)" strokeWidth={5} strokeLinecap="round" />;
        })}
        <g transform="translate(560 860)">
          <path d={`M${-300 * open} 0 Q0 ${-300 * open - 40} ${300 * open} 0 Z`} fill={OCRE} />
          <line x1={0} y1={-20} x2={0} y2={300} stroke={WARM} strokeWidth={14} strokeLinecap="round" />
          <path d="M0 300 Q0 350 -50 350" stroke={WARM} strokeWidth={14} fill="none" strokeLinecap="round" />
        </g>
      </Svg>
      <Head light="Fondo de" bold="emergencia" f={f} d={at(78)} dark={dark} size={92} top={1230} />
    </AbsoluteFill>
  );
};

const Uso2: React.FC<P> = ({f, at, dark}) => {
  const cards = [
    {t: 'Colegiaturas', w: 91, y: 720, r: -4},
    {t: 'Impuestos', w: 92, y: 930, r: 3},
  ];
  return (
    <AbsoluteFill>
      <Num n="2" f={f} />
      <Head light="Gastos que" bold="ya vienen" f={f} d={at(85)} dark={dark} size={92} top={1230} />
      {cards.map((c, i) => {
        const k = sp(f, at(c.w) - 4, 11, 200);
        return (
          <div key={i} style={{position: 'absolute', left: 300, top: c.y, width: 640, height: 170, borderRadius: 30, background: WARM, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 60, display: 'flex', alignItems: 'center', gap: 30, padding: '0 40px', boxSizing: 'border-box', transform: `translateX(${(1 - k) * 900}px) rotate(${c.r}deg)`, boxShadow: '0 20px 50px rgba(0,0,0,0.35)'}}>
            <div style={{width: 80, height: 80, borderRadius: 20, background: OCRE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 46}}>📅</div>
            {c.t}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Uso3: React.FC<P> = ({f, at, dark}) => {
  const k = sp(f, 4);
  const pop = sp(f, at(96), 10, 200);
  const opp = sp(f, at(102));
  const lock = sp(f, at(104));
  const slices = [
    {from: 0, p: 0.45, c: GRAY},
    {from: 0.45, p: 0.3, c: '#2B3F5C'},
    {from: 0.75, p: 0.25, c: OCRE},
  ];
  return (
    <AbsoluteFill>
      <Num n="3" f={f} />
      <Svg>
        <g transform={`translate(560 840) scale(${k})`}>
          {slices.map((s, i) => {
            const mid = (s.from + s.p / 2) * 2 * Math.PI - Math.PI / 2;
            const off = i === 2 ? pop * 60 : 0;
            return (
              <g key={i} transform={`translate(${Math.cos(mid) * off - 260} ${Math.sin(mid) * off - 260}) rotate(${s.from * 360} 260 260)`}>
                <PieShape radius={260} progress={s.p} fill={s.c} closePath />
              </g>
            );
          })}
          {[0, 1].map((i) => {
            const mid = ([0.225, 0.6][i]) * 2 * Math.PI - Math.PI / 2;
            return <text key={i} x={Math.cos(mid) * 150} y={Math.sin(mid) * 150 + 26} textAnchor="middle" fontSize={70} opacity={lock}>🔒</text>;
          })}
          <text x={-60} y={-340} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={46} fill={OCRE} opacity={pop}>LIQUIDEZ</text>
        </g>
        <g transform={`translate(880 520) scale(${opp})`}>
          <path d="M0 -70 L18 -18 L70 0 L18 18 L0 70 L-18 18 L-70 0 L-18 -18Z" fill={OCRE} transform={`rotate(${f * 4})`} />
        </g>
      </Svg>
      <Head light="La parte líquida" bold="de tu portafolio" f={f} d={at(93)} dark={dark} size={80} top={1220} />
    </AbsoluteFill>
  );
};

const Empresa: React.FC<P> = ({f, at, dark}) => {
  const k = sp(f, 4);
  const t = sp(f, at(116));
  return (
    <AbsoluteFill>
      <Head light="Para tu" bold="empresa" f={f} dark={dark} size={110} />
      <Svg>
        <g transform={`translate(540 960) scale(${k})`}>
          <rect x={-200} y={-330} width={400} height={480} rx={16} fill={NAVY2} stroke="rgba(245,243,238,0.3)" strokeWidth={3} />
          {new Array(12).fill(0).map((_, i) => (
            <rect key={i} x={-150 + (i % 3) * 110} y={-280 + Math.floor(i / 3) * 100} width={80} height={60} rx={8} fill={(f / 6 + i) % 5 < 1 ? OCRE : 'rgba(245,243,238,0.25)'} />
          ))}
        </g>
      </Svg>
      <Pill text="TESORERÍA" x={540} y={1230} k={t} size={64} />
      <Note text="Disponible para personas físicas y morales." f={f} d={at(116)} dark={dark} top={1320} />
    </AbsoluteFill>
  );
};

const Cta1: React.FC<P> = ({f, dark}) => {
  const k = sp(f, 2, 10, 200);
  const lvl = 0.25 + 0.5 * (0.5 + 0.5 * Math.sin(f / 9));
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 70, top: 300, fontFamily: FONT, color: WARM, fontSize: 96, lineHeight: 1.05, transform: `scale(${0.7 + 0.3 * k})`, transformOrigin: 'left top', opacity: cl(k * 2)}}>
        <div style={{fontWeight: 300}}>¿CUÁNTO DE TU DINERO</div>
        <div style={{fontWeight: 700}}>
          DEBERÍA ESTAR <span style={{color: OCRE}}>DISPONIBLE?</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 390, top: 800, width: 300, height: 480, borderRadius: 40, border: `6px solid ${WARM}`, overflow: 'hidden', transform: `scale(${k})`}}>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${lvl * 100}%`, background: OCRE}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: '45%', textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 90, color: WARM, mixBlendMode: 'difference'}}>?</div>
      </div>
      {!dark && null}
    </AbsoluteFill>
  );
};

const LEGAL =
  'El contenido es únicamente informativo, no constituye recomendación, consejo o sugerencia personalizada de algún producto y/o servicio que le sugieran la toma de decisiones de inversión, para lo que se necesita previamente verificar la congruencia entre el perfil del cliente y el perfil del producto financiero. Rendimientos pasados no garantizan rendimientos futuros. El valor de las acciones de Fondos de Inversión conlleva un riesgo de mercado incluyendo una posible minusvalía del capital invertido. Los fondos de inversión no están garantizados por Grupo Financiero Actinver S.A. de C.V, o por alguna entidad integrante del Grupo Financiero Actinver, ni por ninguna entidad gubernamental, ni por el IPAB y pueden tener minusvalías del capital invertido. Todos los Fondos de Actinver cuentan con Prospecto de Información al Público Inversionista y Documentos con Información Clave, los cuales se encuentran a su disposición en www.actinver.com/fondos.';

const End: React.FC<P> = ({f, at}) => {
  const dm = sp(f, 2, 11, 200);
  const send = ease((f - at(126)) / 10);
  const com = (i: number) => sp(f, at(130) + i * 6, 11, 220);
  const fol = sp(f, at(138), 10, 200);
  const tap = f - at(139);
  const pressed = tap > 0 && tap < 8;
  const legalAt = F(words[words.length - 1].e + 0.4) - (F(TW(124)) - at(124));
  const fade = ease((f - legalAt) / 10);
  return (
    <AbsoluteFill>
      <div style={{opacity: 1 - fade}}>
        <div style={{position: 'absolute', left: 120, top: 330, width: 700, padding: '34px 40px', borderRadius: '40px 40px 40px 8px', background: WARM, fontFamily: FONT, fontSize: 52, fontWeight: 600, color: NAVY, transform: `scale(${dm}) translateY(${-send * 30}px)`, transformOrigin: 'left bottom', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'}}>
          ✉️ Escríbeme y lo revisamos juntos
        </div>
        {['¡No lo conocía! 👀', 'Me interesa 🙌', 'LIQUIDEZ 💬'].map((t, i) => (
          <div key={i} style={{position: 'absolute', left: i % 2 ? 300 : 120, top: 620 + i * 150, padding: '24px 36px', borderRadius: 40, background: i === 2 ? OCRE : 'rgba(245,243,238,0.14)', color: i === 2 ? NAVY : WARM, fontFamily: FONT, fontSize: 46, fontWeight: 600, transform: `scale(${com(i)})`, transformOrigin: 'left center'}}>{t}</div>
        ))}
        <div style={{position: 'absolute', left: 540, top: 1150, transform: `translate(-50%,-50%) scale(${fol * (pressed ? 0.9 : 1)})`, background: pressed || tap >= 8 ? WARM : OCRE, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 64, padding: '26px 70px', borderRadius: 100, boxShadow: '0 16px 40px rgba(0,0,0,0.3)'}}>
          {tap >= 8 ? '✓ SIGUIENDO' : '+ SÍGUEME'}
        </div>
        {tap > -6 && tap < 14 && <div style={{position: 'absolute', left: 600 - Math.min(tap + 6, 6) * 6, top: 1170 - Math.min(tap + 6, 6) * 4, fontSize: 90, transform: pressed ? 'scale(0.85)' : 'none'}}>👆</div>}
      </div>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 96, top: 420, width: 330, opacity: fade}} />
      <div style={{position: 'absolute', left: 96, right: 96, top: 560, fontFamily: FONT, fontSize: 64, color: WARM, opacity: fade, lineHeight: 1.1}}>
        <span style={{fontWeight: 300}}>FONDO </span>
        <span style={{fontWeight: 700, color: OCRE}}>ACTIGOB</span>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 90, fontFamily: FONT, fontSize: 21, lineHeight: 1.38, color: 'rgba(245,243,238,0.8)', opacity: fade}}>
        <div style={{fontWeight: 600, fontSize: 24, color: WARM, marginBottom: 10}}>Datos de actinver.com/actigob al 31 de marzo de 2026. Rendimientos pasados no garantizan rendimientos futuros. Consulta términos y condiciones de los productos en actinver.com</div>
        {LEGAL}
      </div>
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC<P>> = {idle: Idle, work: Work, intro: Intro, gob: Gob, cetes: Cetes, rating: Rating, liq: Liq, usos: Usos, uso1: Uso1, uso2: Uso2, uso3: Uso3, empresa: Empresa, cta1: Cta1, end: End};

/* escena con fondo, partículas y cámara con golpe en palabras clave */
const Scene: React.FC<{idx: number}> = ({idx}) => {
  const f = useCurrentFrame();
  const s0 = starts[idx];
  const g = s0 + f; // frame global
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
  const punch = sc.k === 'end' ? 0 : 0.07 * Math.exp(-(g - last) / 4);
  const zs = [1, 1.05, 1.02, 1.07];
  const z = sc.k === 'end' ? 1 : zs[n % 4] + 0.02 * (f / Math.max(1, next - s0));
  const rot = sc.k === 'end' ? 0 : [0, -0.6, 0.5, 0][n % 4];
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
    const brk = /[,.?!:]$/.test(w.w) || cur.length >= 4 || len > 18 || !nx || nx.s - w.e > 0.5;
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
    <div style={{position: 'absolute', left: 40, right: 40, top: 1500, display: 'flex', justifyContent: 'center', transform: `scale(${0.85 + 0.15 * k})`, opacity: cl(k * 2)}}>
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

export const Actigob: React.FC = () => {
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
      {cur.k !== 'intro' && cur.k !== 'end' && <Img src={staticFile(light ? 'logo_azul.png' : 'logo_blanco.png')} style={{position: 'absolute', right: 60, top: 70, width: 210}} />}
      {t < words[words.length - 1].e + 0.3 && <Captions t={t} f={f} />}
      <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: W * cl(t / AG_TOTAL), background: OCRE}} />
      <Audio src={staticFile('actigob/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

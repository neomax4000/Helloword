import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {flip} from '@remotion/transitions/flip';
import {iris} from '@remotion/transitions/iris';
import {clockWipe} from '@remotion/transitions/clock-wipe';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {noise2D} from '@remotion/noise';
import {LightLeak} from '@remotion/light-leaks';
import data from '../public/fondos/words.json';
import {FONT, FPS, W} from './theme';
import {F, cl, ease, sp} from './narrador';

/* Paleta propia (sin marca Actinver) */
const INK = '#1B1F3B';
const INK2 = '#2A2F5A';
const RED = '#E5484D';
const LEAF = '#3FA34D';
const CREAM = '#FFF6E9';
const SUN = '#FFC857';
const SKY = '#4EA8DE';

type Word = {i: number; w: string; s: number; e: number};
const words = data.words as Word[];
export const FD_TOTAL = data.total;
const byI: Record<number, Word> = {};
words.forEach((w) => (byI[w.i] = w));
const TW = (i: number) => byI[i].s;

const THEMES = [
  {bg: `radial-gradient(1100px 1100px at 50% 35%, ${INK2}, #0E1024 75%)`, light: false, pat: 'dots'},
  {bg: `radial-gradient(1100px 1100px at 50% 35%, #FFFFFF, ${CREAM} 80%)`, light: true, pat: 'check'},
  {bg: `linear-gradient(160deg, #3A2350, ${INK} 75%)`, light: false, pat: 'lines'},
  {bg: `radial-gradient(1100px 1100px at 50% 40%, #FFF1D6, #FFE2A8 85%)`, light: true, pat: 'dots'},
  {bg: `linear-gradient(160deg, #123B3A, #0B1E28 80%)`, light: false, pat: 'grid'},
  {bg: `radial-gradient(1100px 1100px at 50% 35%, #1F4E79, #0B1A33 80%)`, light: false, pat: 'lines'},
];
const Bg: React.FC<{n: number; f: number}> = ({n, f}) => {
  const t = THEMES[n];
  const ink = t.light ? 'rgba(27,31,59,0.07)' : 'rgba(255,255,255,0.06)';
  let img = '';
  let size: string | undefined;
  if (t.pat === 'grid') {
    img = `linear-gradient(${ink} 2px, transparent 2px), linear-gradient(90deg, ${ink} 2px, transparent 2px)`;
    size = '90px 90px';
  } else if (t.pat === 'lines') img = `repeating-linear-gradient(135deg, ${ink} 0 2px, transparent 2px 46px)`;
  else if (t.pat === 'dots') {
    img = `radial-gradient(${ink} 6px, transparent 7px)`;
    size = '64px 64px';
  } else if (t.pat === 'check') {
    img = `repeating-conic-gradient(rgba(229,72,77,0.06) 0 25%, transparent 0 50%)`;
    size = '120px 120px';
  }
  const off = (f * 1.1) % 90;
  return (
    <AbsoluteFill style={{background: t.bg}}>
      <AbsoluteFill style={{backgroundImage: img, backgroundSize: size, backgroundPosition: `${off}px ${off}px`}} />
      <div style={{position: 'absolute', width: 900, height: 900, borderRadius: '50%', right: -420 + Math.sin(f / 80) * 30, top: -260, background: t.light ? 'rgba(229,72,77,0.07)' : 'rgba(255,255,255,0.05)'}} />
      <div style={{position: 'absolute', width: 700, height: 700, borderRadius: '50%', left: -380, bottom: 120 + Math.cos(f / 90) * 30, background: t.light ? 'rgba(63,163,77,0.10)' : 'rgba(255,200,87,0.07)'}} />
    </AbsoluteFill>
  );
};

/* escenas por palabra inicial */
const SC = [
  {w: 0, k: 'hook', bg: 0},
  {w: 11, k: 'basket', bg: 0},
  {w: 31, k: 'market', bg: 1},
  {w: 44, k: 'pick', bg: 1},
  {w: 61, k: 'reveal', bg: 2},
  {w: 74, k: 'easy', bg: 2},
  {w: 83, k: 'maze', bg: 3},
  {w: 96, k: 'choose', bg: 3},
  {w: 105, k: 'types', bg: 4},
  {w: 110, k: 'ready', bg: 4},
  {w: 123, k: 'liq', bg: 5},
  {w: 132, k: 'vs', bg: 5},
  {w: 138, k: 'end', bg: 0},
];
const TD = 12;
const starts = SC.map((s, i) => (i === 0 ? 0 : F(TW(s.w) - 0.14)));
export const fdStarts = starts.map((x) => x / FPS);
const totalF = F(FD_TOTAL);
const TRANS = [
  iris({width: 1080, height: 1920}),
  slide({direction: 'from-right'}),
  wipe({direction: 'from-bottom-left'}),
  flip({direction: 'from-right'}),
  clockWipe({width: 1080, height: 1920}),
  slide({direction: 'from-bottom'}),
  wipe({direction: 'from-right'}),
  iris({width: 1080, height: 1920}),
  flip({direction: 'from-bottom'}),
  slide({direction: 'from-left'}),
  clockWipe({width: 1080, height: 1920}),
  wipe({direction: 'from-top'}),
];

type P = {f: number; at: (i: number) => number; dark: boolean};

/* ---------- piezas ---------- */
const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>{children}</svg>
);
const Head: React.FC<{light: string; bold: string; f: number; d?: number; dark: boolean; size?: number; top?: number; accent?: string}> = ({light, bold, f, d = 0, dark, size = 96, top = 250, accent}) => {
  const k = sp(f, d, 12, 200);
  const k2 = sp(f, d + 5, 12, 200);
  return (
    <div style={{position: 'absolute', left: 90, right: 70, top, fontFamily: FONT, fontSize: size, lineHeight: 1.04, color: dark ? INK : CREAM, textTransform: 'uppercase'}}>
      <div style={{fontWeight: 300, transform: `translateX(${(1 - k) * -120}px)`, opacity: cl(k * 1.5), filter: `blur(${(1 - cl(k)) * 10}px)`}}>{light}</div>
      <div style={{fontWeight: 800, color: accent ?? (dark ? INK : CREAM), transform: `translateX(${(1 - k2) * 160}px)`, opacity: cl(k2 * 1.5), filter: `blur(${(1 - cl(k2)) * 10}px)`}}>{bold}</div>
    </div>
  );
};
const Pill: React.FC<{text: string; x: number; y: number; k: number; c?: string; tc?: string; size?: number}> = ({text, x, y, k, c = SUN, tc = INK, size = 52}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${k})`, background: c, color: tc, fontFamily: FONT, fontWeight: 700, fontSize: size, padding: `${size * 0.3}px ${size * 0.7}px`, borderRadius: 100, whiteSpace: 'nowrap', boxShadow: '0 16px 40px rgba(0,0,0,0.25)'}}>{text}</div>
);
const Berry: React.FC<{x: number; y: number; s?: number; r?: number; bad?: boolean}> = ({x, y, s = 1, r = 0, bad}) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M0 -40 C38 -40 50 -8 40 20 C30 48 10 62 0 66 C-10 62 -30 48 -40 20 C-50 -8 -38 -40 0 -40Z" fill={bad ? '#9C4A3A' : RED} />
    {[[-18, -8], [14, -14], [0, 12], [-22, 26], [20, 22], [0, 40]].map(([a, b], i) => <ellipse key={i} cx={a} cy={b} rx={3} ry={5} fill={bad ? '#C9A27A' : '#FFE08A'} />)}
    <path d="M-28 -40 L-10 -52 L0 -40 L10 -54 L28 -40 L12 -36 L0 -30 L-12 -36Z" fill={LEAF} />
    {bad && <ellipse cx={18} cy={2} rx={14} ry={10} fill="#5E2E25" opacity={0.7} />}
  </g>
);
const Basket: React.FC<{x: number; y: number; s?: number; children?: React.ReactNode; c?: string}> = ({x, y, s = 1, children, c = '#C98B4B'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-200 -120 C-200 -260 200 -260 200 -120" stroke={c} strokeWidth={22} fill="none" strokeLinecap="round" />
    {children}
    <path d="M-240 -120 H240 L200 120 H-200Z" fill={c} />
    {[-140, -70, 0, 70, 140].map((a) => <line key={a} x1={a} y1={-110} x2={a * 0.85} y2={110} stroke="rgba(0,0,0,0.18)" strokeWidth={8} />)}
    {[-60, 10, 70].map((b) => <line key={b} x1={-232 + (b + 120) * 0.15} y1={b} x2={232 - (b + 120) * 0.15} y2={b} stroke="rgba(0,0,0,0.15)" strokeWidth={8} />)}
  </g>
);
const Icon: React.FC<{k: 'bond' | 'coin' | 'chart'; x: number; y: number; s?: number}> = ({k, x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {k === 'bond' && (
      <>
        <rect x={-60} y={-45} width={120} height={90} rx={12} fill={CREAM} stroke={INK} strokeWidth={6} />
        <line x1={-38} x2={38} y1={-15} y2={-15} stroke={INK} strokeWidth={6} />
        <line x1={-38} x2={20} y1={8} y2={8} stroke={INK} strokeWidth={6} />
      </>
    )}
    {k === 'coin' && (
      <>
        <circle r={52} fill={SUN} stroke="#B88A2E" strokeWidth={7} />
        <text textAnchor="middle" y={20} fontFamily={FONT} fontWeight={800} fontSize={56} fill={INK}>$</text>
      </>
    )}
    {k === 'chart' && (
      <>
        <rect x={-60} y={-50} width={120} height={100} rx={14} fill={INK2} />
        <path d="M-40 25 L-12 -2 L8 12 L40 -28" stroke={LEAF} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>
    )}
  </g>
);
const Particles: React.FC<{f: number; dark: boolean; seed: string}> = ({f, dark, seed}) => (
  <AbsoluteFill>
    {new Array(22).fill(0).map((_, i) => {
      const x = 540 + noise2D(seed + 'x', i * 0.37, f / 160) * 620;
      const y = 960 + noise2D(seed + 'y', i * 0.53, f / 170) * 1050;
      const r = 4 + (i % 4) * 3;
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: r, height: r, borderRadius: r, background: i % 3 === 0 ? RED : i % 3 === 1 ? SUN : dark ? 'rgba(27,31,59,0.3)' : 'rgba(255,246,233,0.35)', opacity: 0.55}} />;
    })}
  </AbsoluteFill>
);

/* ---------- escenas ---------- */
const Hook: React.FC<P> = ({f, at}) => {
  const a = sp(f, at(7), 10, 220);
  const b = sp(f, at(9), 10, 220);
  return (
    <AbsoluteFill>
      <CameraMotionBlur shutterAngle={200} samples={5}>
        <AbsoluteFill>
          <div style={{position: 'absolute', left: 90, top: 360, fontFamily: FONT, color: CREAM, fontSize: 64, fontWeight: 300, opacity: ease(f / 10)}}>Te voy a platicar de qué van…</div>
          <div style={{position: 'absolute', left: 90, top: 520, fontFamily: FONT, color: CREAM, lineHeight: 0.95}}>
            <div style={{fontWeight: 300, fontSize: 190, transform: `translateX(${(1 - a) * -900}px)`}}>FONDOS</div>
            <div style={{fontWeight: 800, fontSize: 150, color: SUN, transform: `translateX(${(1 - b) * 1000}px)`}}>DE INVERSIÓN</div>
          </div>
        </AbsoluteFill>
      </CameraMotionBlur>
      <Svg>
        {[0, 1, 2, 3, 4].map((i) => {
          const k = sp(f, at(9) + 6 + i * 4, 9, 200);
          return <Berry key={i} x={180 + i * 180} y={1080 + Math.sin((f + i * 9) / 8) * 12} s={k * 1.1} r={(i - 2) * 8} />;
        })}
      </Svg>
      <Sequence from={Math.max(0, at(9) - 4)} durationInFrames={36}>
        <AbsoluteFill style={{mixBlendMode: 'screen', opacity: 0.35}}>
          <LightLeak seed={7} hueShift={340} durationInFrames={36} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

const BasketScene: React.FC<P> = ({f, at, dark}) => {
  const bk = sp(f, at(18) - 2, 10, 200);
  const items = [
    {k: 'bond', w: 25, x: -120},
    {k: 'coin', w: 26, x: 0},
    {k: 'chart', w: 27, x: 120},
  ] as const;
  const same = sp(f, at(28));
  return (
    <AbsoluteFill>
      <Head light="Es como una" bold="canasta" f={f} d={at(16)} dark={dark} size={110} accent={SUN} />
      <Svg>
        <Basket x={540} y={1040} s={bk}>
          {items.map((it, i) => {
            const t = ease((f - at(it.w)) / 12);
            return <Icon key={i} k={it.k} x={it.x} y={-520 + t * 420} s={0.9} />;
          })}
        </Basket>
      </Svg>
      <Pill text="DEL MISMO TIPO" x={540} y={1300} k={same} />
    </AbsoluteFill>
  );
};

const Market: React.FC<P> = ({f, at, dark}) => {
  const k = sp(f, 4, 11, 180);
  const box = sp(f, at(40), 10, 200);
  const sel = sp(f, at(43), 9, 240);
  return (
    <AbsoluteFill>
      <Head light="En la" bold="verdulería" f={f} dark={dark} size={110} accent={LEAF} />
      <Svg>
        <g transform={`translate(540 640) scale(${k})`}>
          <path d="M-380 -40 L-320 -120 H320 L380 -40Z" fill={RED} />
          {[-300, -180, -60, 60, 180, 300].map((x, i) => <path key={i} d={`M${x - 60} -40 Q${x} 20 ${x + 60} -40`} fill={i % 2 ? CREAM : RED} />)}
        </g>
        <g transform={`translate(540 1050) scale(${box})`}>
          <rect x={-260} y={-150} width={520} height={300} rx={30} fill="rgba(255,255,255,0.6)" stroke={INK} strokeWidth={6} />
          {new Array(8).fill(0).map((_, i) => (
            <Berry key={i} x={-180 + (i % 4) * 120} y={-50 + Math.floor(i / 4) * 110} s={0.85} r={(i % 3) * 10 - 10} />
          ))}
          <rect x={-260} y={-150} width={520} height={300} rx={30} fill="none" stroke={INK} strokeWidth={6} />
        </g>
      </Svg>
      <Pill text="✓ SELECCIONADAS" x={540} y={1300} k={sel} c={LEAF} tc="#fff" />
    </AbsoluteFill>
  );
};

const Pick: React.FC<P> = ({f, at, dark}) => {
  const l = sp(f, 4);
  const bad = sp(f, at(51), 9, 220);
  const r = sp(f, at(57), 10, 200);
  return (
    <AbsoluteFill>
      <Head light="Si tú" bold="escogieras…" f={f} dark={dark} size={100} accent={RED} />
      <Svg>
        <g transform={`translate(290 940) scale(${l})`}>
          <text textAnchor="middle" y={-220} fontFamily={FONT} fontWeight={800} fontSize={52} fill={INK}>TÚ</text>
          <Berry x={-70} y={-80} s={0.9} />
          <Berry x={70} y={-60} s={0.9} bad={bad > 0.3} r={10} />
          <Berry x={-40} y={70} s={0.9} bad={bad > 0.6} r={-12} />
          <Berry x={80} y={90} s={0.9} />
          <text textAnchor="middle" y={250} fontFamily={FONT} fontWeight={800} fontSize={110} fill={RED} opacity={bad}>✗</text>
        </g>
        <g transform={`translate(790 940) scale(${r})`}>
          <text textAnchor="middle" y={-220} fontFamily={FONT} fontWeight={800} fontSize={52} fill={INK}>PAQUETE</text>
          {[0, 1, 2, 3].map((i) => <Berry key={i} x={-70 + (i % 2) * 140} y={-70 + Math.floor(i / 2) * 150} s={0.9} />)}
          <text textAnchor="middle" y={250} fontFamily={FONT} fontWeight={800} fontSize={110} fill={LEAF}>✓</text>
        </g>
        <line x1={540} x2={540} y1={700} y2={1220} stroke="rgba(27,31,59,0.2)" strokeWidth={4} strokeDasharray="14 14" />
      </Svg>
    </AbsoluteFill>
  );
};

const Reveal: React.FC<P> = ({f, at, dark}) => {
  const m = ease((f - at(67)) / 22);
  const bk = sp(f, 4, 10, 180);
  return (
    <AbsoluteFill>
      <Head light="Los fondos" bold="son así" f={f} dark={dark} size={110} accent={SUN} />
      <Svg>
        <Basket x={540} y={1060} s={bk} c={interpolate(m, [0, 1], [0, 1]) > 0.5 ? SKY : '#C98B4B'}>
          {[0, 1, 2, 3, 4].map((i) => {
            const x = -160 + i * 80;
            const y = -150 - (i % 2) * 50;
            return (
              <g key={i}>
                <g opacity={1 - m}>
                  <Berry x={x} y={y} s={0.75} />
                </g>
                <g opacity={m}>
                  <Icon k={(['bond', 'coin', 'chart', 'bond', 'coin'] as const)[i]} x={x} y={y} s={0.6} />
                </g>
              </g>
            );
          })}
        </Basket>
      </Svg>
      <Pill text="FONDO DE INVERSIÓN" x={540} y={1300} k={sp(f, at(69))} c={SKY} tc="#fff" />
    </AbsoluteFill>
  );
};

const Easy: React.FC<P> = ({f, at, dark}) => {
  const k = sp(f, at(77), 9, 220);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontFamily: FONT, color: CREAM, fontSize: 130, lineHeight: 1, transform: `scale(${0.5 + 0.5 * k})`}}>
        <div style={{fontWeight: 300}}>MÁS</div>
        <div style={{fontWeight: 800, color: SUN}}>FÁCIL</div>
      </div>
      <Svg>
        {[0, 1, 2].map((i) => {
          const c = sp(f, at(80) + i * 5, 9, 240);
          return (
            <g key={i} transform={`translate(${300 + i * 240} 1120) scale(${c})`}>
              <circle r={70} fill={LEAF} />
              <path d="M-30 0 L-8 24 L34 -24" stroke="#fff" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}
      </Svg>
      {!dark && null}
    </AbsoluteFill>
  );
};

const Maze: React.FC<P> = ({f, at, dark}) => {
  const cross = ease((f - at(91)) / 10);
  return (
    <AbsoluteFill>
      <Head light="Sin escoger" bold="uno a uno" f={f} d={at(87)} dark={dark} size={100} accent={RED} />
      <Svg>
        {new Array(24).fill(0).map((_, i) => {
          const x = 180 + (i % 6) * 145;
          const y = 760 + Math.floor(i / 6) * 150;
          const wob = Math.sin((f + i * 7) / 6) * 6;
          const k = sp(f, 2 + i * 1.2, 10, 200);
          return (
            <g key={i} transform={`translate(${x} ${y + wob}) scale(${k * 0.55}) rotate(${(i % 5) * 9 - 18})`}>
              <Icon k={(['bond', 'coin', 'chart'] as const)[i % 3]} x={0} y={0} />
            </g>
          );
        })}
        <path d="M160 700 L920 1360" stroke={RED} strokeWidth={26} strokeLinecap="round" strokeDasharray={1010} strokeDashoffset={1010 * (1 - cross)} />
        <path d="M920 700 L160 1360" stroke={RED} strokeWidth={26} strokeLinecap="round" strokeDasharray={1010} strokeDashoffset={1010 * (1 - cross)} />
      </Svg>
    </AbsoluteFill>
  );
};

const Choose: React.FC<P> = ({f, at, dark}) => {
  const k = sp(f, at(99), 9, 220);
  return (
    <AbsoluteFill>
      <Head light="Tú escoges" bold="el tipo" f={f} dark={dark} size={110} accent={RED} />
      <Svg>
        <g transform={`translate(540 1000) scale(${k})`}>
          <circle r={200} fill={INK} />
          <text textAnchor="middle" y={-20} fontFamily={FONT} fontWeight={800} fontSize={80} fill={SUN}>TIPO</text>
          <text textAnchor="middle" y={60} fontFamily={FONT} fontWeight={400} fontSize={44} fill={CREAM}>de fondo</text>
        </g>
        {[0, 1, 2].map((i) => {
          const a = (f / 30 + (i * 2 * Math.PI) / 3);
          return <circle key={i} cx={540 + Math.cos(a) * 300} cy={1000 + Math.sin(a) * 300} r={34} fill={[SKY, SUN, LEAF][i]} opacity={k} />;
        })}
      </Svg>
    </AbsoluteFill>
  );
};

const Types: React.FC<P> = ({f, at}) => {
  const T = [
    {t: 'DEUDA', w: 105, c: SKY, k: 'bond'},
    {t: 'DIVISAS', w: 106, c: SUN, k: 'coin'},
    {t: 'RENTA VARIABLE', w: 108, c: LEAF, k: 'chart'},
  ] as const;
  return (
    <AbsoluteFill>
      {T.map((x, i) => {
        const k = sp(f, at(x.w) - 3, 10, 220);
        return (
          <div key={i} style={{position: 'absolute', left: 90, right: 90, top: 380 + i * 330, height: 270, borderRadius: 40, background: x.c, transform: `translateX(${(1 - k) * 1100}px) rotate(${(1 - k) * 8}deg)`, display: 'flex', alignItems: 'center', gap: 40, padding: '0 50px', boxSizing: 'border-box', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'}}>
            <svg width={160} height={160} viewBox="-80 -80 160 160">
              <Icon k={x.k} x={0} y={0} s={1.15} />
            </svg>
            <div style={{fontFamily: FONT, fontWeight: 800, fontSize: x.t.length > 10 ? 70 : 90, color: INK}}>{x.t}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Ready: React.FC<P> = ({f, at, dark}) => {
  const k = sp(f, at(114), 10, 200);
  const chk = sp(f, at(119), 9, 240);
  return (
    <AbsoluteFill>
      <Head light="Ya hay un fondo" bold="para eso" f={f} dark={dark} size={96} accent={SUN} />
      <Svg>
        <Basket x={540} y={1060} s={k} c={SKY}>
          <Icon k="bond" x={-110} y={-170} s={0.8} />
          <Icon k="bond" x={0} y={-200} s={0.8} />
          <Icon k="bond" x={110} y={-170} s={0.8} />
        </Basket>
        <g transform={`translate(820 760) scale(${chk})`}>
          <circle r={90} fill={LEAF} />
          <path d="M-40 0 L-10 32 L44 -32" stroke="#fff" strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

const Liq: React.FC<P> = ({f, at, dark}) => {
  const k = sp(f, at(130), 9, 200);
  const drops = new Array(7).fill(0);
  return (
    <AbsoluteFill>
      <Head light="Además, más" bold="liquidez" f={f} dark={dark} size={110} accent={SKY} />
      <Svg>
        <g transform={`translate(540 1000) scale(${k})`}>
          <path d="M0 -260 C120 -90 190 10 190 110 C190 220 100 290 0 290 C-100 290 -190 220 -190 110 C-190 10 -120 -90 0 -260Z" fill={SKY} />
          <path d="M-90 120 C-90 180 -50 220 0 230" stroke="rgba(255,255,255,0.6)" strokeWidth={18} fill="none" strokeLinecap="round" />
        </g>
        {drops.map((_, i) => {
          const t = ((f + i * 11) % 40) / 40;
          return <circle key={i} cx={200 + i * 110} cy={600 + t * 800} r={10} fill={SKY} opacity={(1 - t) * k * 0.7} />;
        })}
      </Svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1320, textAlign: 'center', fontFamily: FONT, fontSize: 40, color: 'rgba(255,246,233,0.8)', opacity: k}}>Liquidez = qué tan rápido recuperas tu dinero</div>
    </AbsoluteFill>
  );
};

const Vs: React.FC<P> = ({f, at}) => {
  const a = sp(f, at(134), 10, 200);
  const b = sp(f, at(135), 10, 200);
  const c = sp(f, at(137), 10, 200);
  const Card: React.FC<{x: number; k: number; title: string; sub: string; col: string; icon: string}> = ({x, k, title, sub, col, icon}) => (
    <div style={{position: 'absolute', left: x, top: 560, width: 420, height: 560, borderRadius: 40, background: CREAM, transform: `scale(${k})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, fontFamily: FONT, color: INK, boxShadow: '0 20px 50px rgba(0,0,0,0.35)'}}>
      <div style={{fontSize: 120}}>{icon}</div>
      <div style={{fontWeight: 800, fontSize: 60, color: col}}>{title}</div>
      <div style={{fontWeight: 500, fontSize: 36, textAlign: 'center', padding: '0 30px'}}>{sub}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Card x={80} k={a} title="FONDO" sub="Compras y vendes según su liquidez" col={LEAF} icon="💧" />
      <Card x={580} k={b} title={c > 0.5 ? 'CETES · PAGARÉ' : 'CETES'} sub="Tu dinero queda a un plazo" col={RED} icon="🔒" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 70, color: SUN, opacity: a}}>VS</div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 1170, textAlign: 'center', fontFamily: FONT, fontSize: 32, color: 'rgba(255,246,233,0.8)', opacity: c}}>En general. Cada fondo tiene sus propias reglas de compra y venta.</div>
    </AbsoluteFill>
  );
};

const End: React.FC<P> = ({f, at}) => {
  const k = sp(f, 2, 10, 200);
  const com = (i: number) => sp(f, at(144) + i * 6, 11, 220);
  const fade = ease((f - (F(byI[147].e + 0.4) - (F(TW(138)) - at(138)))) / 10);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 90, right: 70, top: 280, fontFamily: FONT, color: CREAM, fontSize: 100, lineHeight: 1.04, transform: `scale(${0.7 + 0.3 * k})`, transformOrigin: 'left top', opacity: cl(k * 2)}}>
        <div style={{fontWeight: 300}}>¿YA CONOCÍAS</div>
        <div style={{fontWeight: 800}}>
          LOS <span style={{color: SUN}}>FONDOS?</span>
        </div>
      </div>
      {['¡Ya invierto en uno! 🙌', 'Nunca lo había visto así 🍓', 'Explícame más 👀'].map((t, i) => (
        <div key={i} style={{position: 'absolute', left: i % 2 ? 260 : 90, top: 680 + i * 160, padding: '26px 38px', borderRadius: 40, background: i === 1 ? SUN : 'rgba(255,246,233,0.14)', color: i === 1 ? INK : CREAM, fontFamily: FONT, fontSize: 46, fontWeight: 600, transform: `scale(${com(i)})`, transformOrigin: 'left center'}}>{t}</div>
      ))}
      <div style={{position: 'absolute', left: 90, right: 90, bottom: 150, textAlign: 'center', fontFamily: FONT, fontSize: 30, color: 'rgba(255,246,233,0.75)', opacity: fade}}>Contenido educativo. No es una recomendación de inversión.</div>
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC<P>> = {hook: Hook, basket: BasketScene, market: Market, pick: Pick, reveal: Reveal, easy: Easy, maze: Maze, choose: Choose, types: Types, ready: Ready, liq: Liq, vs: Vs, end: End};
const KEYS = new Set([8, 9, 18, 30, 36, 42, 43, 53, 66, 68, 78, 87, 91, 99, 101, 105, 106, 108, 109, 114, 119, 131, 135, 137, 141, 147]);

const Scene: React.FC<{idx: number}> = ({idx}) => {
  const f = useCurrentFrame();
  const s0 = starts[idx];
  const g = s0 + f;
  const at = (i: number) => F(TW(i)) - s0;
  const sc = SC[idx];
  const dark = THEMES[sc.bg].light;
  const next = idx < SC.length - 1 ? starts[idx + 1] : totalF;
  const keys = words.filter((w) => KEYS.has(w.i) && F(w.s) >= s0 && F(w.s) < next).map((w) => F(w.s) - 2);
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
      <Bg n={sc.bg} f={g} />
      <Particles f={g} dark={dark} seed={sc.k} />
      <AbsoluteFill style={{transform: `scale(${z + punch}) rotate(${rot}deg)`, transformOrigin: '540px 860px'}}>
        <C f={f} at={at} dark={dark} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- subtítulos karaoke ---------- */
type Gr = {ws: Word[]; a: number; b: number};
const groups: Gr[] = (() => {
  const gs: Gr[] = [];
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
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 16px', background: 'rgba(27,31,59,0.92)', borderRadius: 30, padding: '16px 28px', border: '1.5px solid rgba(255,200,87,0.4)'}}>
        {g.ws.map((w) => {
          const on = w.i === active;
          const key = KEYS.has(w.i);
          return (
            <span key={w.i} style={{fontFamily: FONT, fontWeight: 700, fontSize: 72, lineHeight: 1.15, color: on ? INK : key ? SUN : CREAM, background: on ? SUN : 'transparent', borderRadius: 14, padding: '0 10px', display: 'inline-block', transform: on ? 'scale(1.06)' : 'none'}}>
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const Fondos: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
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
      {t < words[words.length - 1].e + 0.3 && <Captions t={t} f={f} />}
      <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: W * cl(t / FD_TOTAL), background: SUN}} />
      <Audio src={staticFile('fondos/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

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
import data from '../public/vac/words.json';
import {FONT, FPS, W} from './theme';
import {F, cl, ease, sp} from './narrador';
import {NAVY, NAVY2, OCRE, WARM, GRAY, OK, THEMES, ThemeBg} from './banca';

type Word = {i: number; w: string; s: number; e: number; k: boolean};
const words = data.words as Word[];
const LAST = words[words.length - 1];
export const VC_TOTAL = Math.round((LAST.e + 5.2) * 100) / 100; // voz + pantalla legal
const TW = (i: number) => words[i].s;

/* escenas: palabra inicial, componente, fondo (cambia cada 2–3 escenas) */
const SC = [
  {w: 0, k: 'hook', bg: 0},
  {w: 16, k: 'ana', bg: 2},
  {w: 27, k: 'rob', bg: 2},
  {w: 38, k: 'nombre', bg: 1},
  {w: 50, k: 'aport', bg: 1},
  {w: 70, k: 'fondos', bg: 3},
  {w: 79, k: 'faltar', bg: 3},
  {w: 93, k: 'final', bg: 4},
  {w: 105, k: 'mercado', bg: 4},
  {w: 113, k: 'anax', bg: 2},
  {w: 128, k: 'robx', bg: 2},
  {w: 156, k: 'pregunta', bg: 5},
  {w: 161, k: 'end', bg: 0},
];
const TD = 12;
const starts = SC.map((s, i) => (i === 0 ? 0 : F(TW(s.w) - 0.14)));
const totalF = F(VC_TOTAL);

const TRANS = [
  slide({direction: 'from-right'}),
  wipe({direction: 'from-bottom-left'}),
  iris({width: 1080, height: 1920}),
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
/* ---------- personajes ---------- */
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

/* ---------- escenas ---------- */
const Hook: React.FC<P> = ({f, at, dark}) => {
  const k = sp(f, 3);
  const join = ease((f - at(6)) / 18);
  const merged = sp(f, at(9), 9, 220);
  const two = sp(f, at(13), 9, 240);
  return (
    <AbsoluteFill>
      <Head light="Protege y" bold="hace crecer" f={f} dark={dark} size={104} />
      <Svg>
        <g transform={`translate(${300 + 240 * join} 900) scale(${k * (1 - 0.15 * merged)})`} opacity={1 - 0.4 * merged}>
          <Shield />
        </g>
        <g transform={`translate(${780 - 240 * join} 900) scale(${k * (1 - 0.15 * merged)})`} opacity={1 - 0.4 * merged}>
          <Jar lvl={0.3 + 0.4 * ease((f - at(9)) / 20)} s={0.8} />
        </g>
        <g transform={`translate(540 900) scale(${merged * (1 + 0.04 * Math.sin(f / 5))})`}>
          <circle r={200} fill="none" stroke={OCRE} strokeWidth={8} strokeDasharray="20 18" transform={`rotate(${f * 2})`} />
        </g>
      </Svg>
      <Pill text="PROTECCIÓN + AHORRO" x={540} y={1210} k={sp(f, at(12) - 4)} size={58} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1300, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 120, color: OCRE, transform: `scale(${two})`}}>2 EN 1</div>
    </AbsoluteFill>
  );
};

const Intro2: React.FC<P & {who: 'ana' | 'rob'}> = ({f, at, dark, who}) => {
  const ana = who === 'ana';
  const name = ana ? 18 : 29;
  const age = ana ? 20 : 31;
  const goal = ana ? 24 : 34;
  const p = sp(f, at(name) - 6, 11, 180);
  const b = sp(f, at(age) - 3, 9, 260);
  const tl = ease((f - at(goal)) / 26);
  const len = ana ? 760 : 300;
  return (
    <AbsoluteFill>
      <Head light={ana ? 'Ella es' : 'Él es'} bold={ana ? 'Ana' : 'Roberto'} f={f} dark={dark} size={118} />
      <Svg>
        <g transform={`translate(${ana ? 470 : 610} ${900 + (1 - p) * 500})`} opacity={cl(p * 2)}>
          <Person who={who} s={1.25} wave={f > at(name) - 6 && f < at(name) + 30 ? f / 2 : 0} />
        </g>
        <Badge n={ana ? '28' : '55'} k={b} x={ana ? 820 : 260} y={760} />
        <g transform="translate(160 1290)">
          <line x1={0} y1={0} x2={760} y2={0} stroke={dark ? 'rgba(4,30,66,0.2)' : 'rgba(245,243,238,0.2)'} strokeWidth={14} strokeLinecap="round" />
          <line x1={0} y1={0} x2={len * tl} y2={0} stroke={OCRE} strokeWidth={14} strokeLinecap="round" />
          <circle cx={len * tl} cy={0} r={18} fill={OCRE} opacity={tl > 0.02 ? 1 : 0} />
          {!ana && <g transform={`translate(${len + 40} 0) scale(${sp(f, at(37) - 4)})`}><line x1={0} y1={0} x2={0} y2={-90} stroke={dark ? NAVY : WARM} strokeWidth={8} /><path d="M0 -90 L70 -70 L0 -50Z" fill="#D9534F" /></g>}
          <text x={0} y={70} fontFamily={FONT} fontWeight={600} fontSize={40} fill={dark ? NAVY : WARM} opacity={tl}>{ana ? 'Construyendo su patrimonio' : 'Su retiro, cada vez más cerca'}</text>
        </g>
      </Svg>
    </AbsoluteFill>
  );
};
const Ana: React.FC<P> = (p) => <Intro2 {...p} who="ana" />;
const Rob: React.FC<P> = (p) => <Intro2 {...p} who="rob" />;

const Nombre: React.FC<P> = ({f, at}) => {
  const a = sp(f, at(41) - 4, 10, 220);
  const b = sp(f, at(42) - 2, 10, 220);
  const c = sp(f, at(43) - 2, 10, 220);
  const logo = sp(f, at(47) - 4);
  const z = ease((f - at(48)) / 10);
  const ppl = sp(f, 2);
  return (
    <AbsoluteFill>
      <Svg>
        <g transform={`translate(330 470) scale(${0.62 * ppl})`}><Person who="ana" /></g>
        <g transform={`translate(750 470) scale(${0.62 * ppl})`}><Person who="rob" /></g>
      </Svg>
      <CameraMotionBlur shutterAngle={200} samples={5}>
        <AbsoluteFill>
          <div style={{position: 'absolute', left: 96, top: 760, fontFamily: FONT, color: WARM, lineHeight: 0.98}}>
            <div style={{fontWeight: 300, fontSize: 130, transform: `translateX(${(1 - a) * -900}px)`}}>VIDA</div>
            <div style={{fontWeight: 700, fontSize: 130, transform: `translateX(${(1 - b) * 1000}px)`}}>AHORRO</div>
            <div style={{fontWeight: 700, fontSize: 130, color: OCRE, transform: `translateX(${(1 - c) * -1000}px)`}}>CRECIENTE</div>
          </div>
        </AbsoluteFill>
      </CameraMotionBlur>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 100, top: 1220, width: 300, opacity: cl(logo * 1.5), transform: `scale(${0.8 + 0.2 * logo})`, transformOrigin: 'left center'}} />
      <div style={{position: 'absolute', left: 430, top: 1232, fontFamily: FONT, fontSize: 46, color: WARM, opacity: z}}>
        <span style={{fontWeight: 300}}>con </span>
        <span style={{fontWeight: 600}}>Zurich</span>
      </div>
      <Sequence from={0} durationInFrames={40}>
        <AbsoluteFill style={{mixBlendMode: 'screen', opacity: 0.4}}>
          <LightLeak seed={9} hueShift={30} durationInFrames={40} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

const Aport: React.FC<P> = ({f, at, dark}) => {
  const drop = ease((f - at(52) + 6) / 14);
  const split = ease((f - at(54) + 4) / 14);
  const sh = sp(f, at(54) - 2);
  const jar = sp(f, at(59) - 4);
  const lvl = 0.15 + 0.6 * ease((f - at(62)) / 40);
  return (
    <AbsoluteFill>
      <Head light="Cada" bold="aportación" f={f} dark={dark} size={110} />
      <Svg>
        <g transform={`translate(540 ${480 + 220 * drop}) scale(${1 - split})`}>
          <circle r={70} fill={OCRE} stroke="#8F8250" strokeWidth={8} />
          <text textAnchor="middle" y={24} fontFamily={FONT} fontWeight={700} fontSize={66} fill={NAVY}>$</text>
        </g>
        {split > 0 && (
          <>
            <path d={`M540 720 Q400 760 ${540 - 250 * split} 860`} stroke={OCRE} strokeWidth={8} fill="none" strokeDasharray="16 14" />
            <path d={`M540 720 Q680 760 ${540 + 250 * split} 860`} stroke={OCRE} strokeWidth={8} fill="none" strokeDasharray="16 14" />
          </>
        )}
        <g transform={`translate(290 1020) scale(${0.9 * sh})`}><Shield /></g>
        <g transform={`translate(790 1020) scale(${0.75 * jar})`}><Jar lvl={lvl} /></g>
        <text x={290} y={1250} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={46} fill={dark ? NAVY : WARM} opacity={sh}>PROTECCIÓN</text>
        <text x={790} y={1250} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={46} fill={dark ? NAVY : WARM} opacity={jar}>AHORRO</text>
      </Svg>
      <Pill text="SE INVIERTE EN FONDOS ACTINVER" x={540} y={1360} k={sp(f, at(66) - 4)} size={44} />
    </AbsoluteFill>
  );
};

const Fondos3: React.FC<P> = ({f, at, dark}) => {
  const cards = [
    {t: 'ACTIGOB', s: 'Deuda gubernamental', w: 71, c: WARM},
    {t: 'ACTIVAR', s: 'Asignación dinámica', w: 74, c: '#C9CED6'},
    {t: 'ACTI500', s: 'Empresas del S&P 500', w: 77, c: OCRE},
  ];
  return (
    <AbsoluteFill>
      <Head light="Tu ahorro" bold="se invierte" f={f} dark={dark} size={104} />
      {cards.map((c, i) => {
        const k = sp(f, at(c.w) - 6, 11, 220);
        return (
          <div key={i} style={{position: 'absolute', left: 110, top: 560 + i * 220, width: 860, height: 180, borderRadius: 30, background: c.c, color: NAVY, fontFamily: FONT, padding: '0 46px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', transform: `translateX(${(1 - k) * (i % 2 ? -1100 : 1100)}px) rotate(${[-2, 1.5, -1][i]}deg)`, boxShadow: '0 20px 50px rgba(0,0,0,0.35)'}}>
            <div style={{fontWeight: 700, fontSize: 66, lineHeight: 1}}>{c.t}</div>
            <div style={{fontWeight: 400, fontSize: 38, marginTop: 8}}>{c.s}</div>
          </div>
        );
      })}
      <Note text="El ahorro está expuesto al riesgo de mercado." f={f} d={at(77)} dark={dark} top={1260} />
    </AbsoluteFill>
  );
};

const Faltar: React.FC<P> = ({f, at, dark}) => {
  const fam = sp(f, 3);
  const sa = ease((f - at(88)) / 16);
  const ah = ease((f - at(91)) / 16);
  return (
    <AbsoluteFill>
      <Head light="Si llegara" bold="a faltar" f={f} dark={dark} size={110} />
      <Svg>
        <g transform={`translate(540 760) scale(${fam})`}>
          {[[-170, 0, 1, '#2E5C8A'], [170, 0, 1, OCRE], [-60, 40, 0.7, '#5E8C6A'], [60, 40, 0.7, '#D9534F']].map(([x, y, s, c], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
              <circle cy={-60} r={50} fill="#E8B48F" />
              <path d="M-80 120 Q-80 10 0 10 Q80 10 80 120Z" fill={c as string} />
            </g>
          ))}
        </g>
        <g transform="translate(540 1110)">
          <rect x={-330} y={-90} width={660} height={180} rx={24} fill={NAVY2} stroke={WARM} strokeWidth={4} />
          <rect x={-310} y={-70} width={400 * sa} height={140} rx={16} fill={WARM} />
          <rect x={-310 + 400 * sa + 10} y={-70} width={210 * ah} height={140} rx={16} fill={OCRE} />
          <text x={-110} y={16} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={38} fill={NAVY} opacity={sa}>SUMA ASEGURADA</text>
          <text x={195} y={16} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={38} fill={NAVY} opacity={ah}>+ AHORRO</text>
        </g>
      </Svg>
      <Note text="Tus beneficiarios reciben la suma asegurada más el saldo del fondo." f={f} d={at(92)} dark={dark} top={1240} />
    </AbsoluteFill>
  );
};

const Final: React.FC<P> = ({f, at, dark}) => {
  const k = sp(f, 3);
  const go = ease((f - at(100)) / 18);
  const pill = sp(f, at(103) - 4);
  return (
    <AbsoluteFill>
      <Head light="Y si no," bold="es para ti" f={f} dark={dark} size={110} />
      <Svg>
        <g transform={`translate(540 ${780 + go * 60}) scale(${k * (1 - 0.3 * go)})`}><Jar lvl={0.85} /></g>
        {[0, 1, 2, 3, 4].map((i) => {
          const t = cl(go * 1.4 - i * 0.1);
          const side = i % 2 ? 1 : -1;
          return <circle key={i} cx={540 + side * 260 * t} cy={860 + 260 * t - Math.sin(t * Math.PI) * 160} r={22} fill={OCRE} opacity={t > 0 && t < 1 ? 1 : 0} />;
        })}
        <g transform={`translate(250 1130) scale(${0.62 * sp(f, at(97) - 6)})`}><Person who="ana" /></g>
        <g transform={`translate(830 1130) scale(${0.62 * sp(f, at(98) - 6)})`}><Person who="rob" /></g>
      </Svg>
      <Pill text="AL FINAL DEL PLAZO, EL AHORRO ES TUYO" x={540} y={1330} k={pill} size={42} />
    </AbsoluteFill>
  );
};

const Mercado: React.FC<P> = ({f, at, dark}) => {
  const draw = ease((f - at(106)) / 26);
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const x = 120 + i * 21;
    const y = 640 + i * 9 + Math.sin(i * 1.3) * 45 + noise2D('m', i / 4, 0) * 30;
    if (i / 40 <= draw) pts.push(`${x},${y}`);
  }
  const sh = sp(f, at(109) - 6, 10, 220);
  return (
    <AbsoluteFill>
      <Head light="Aunque el" bold="mercado baje" f={f} dark={dark} size={104} />
      <Svg>
        <polyline points={pts.join(' ')} fill="none" stroke="#D9534F" strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" opacity={0.8} />
        <g transform={`translate(540 900) scale(${1.1 * sh})`}><Shield /></g>
      </Svg>
      <Pill text="LA PROTECCIÓN NO CAMBIA" x={540} y={1210} k={sp(f, at(110) - 4)} size={54} />
      <Note text="La suma asegurada por fallecimiento no se reduce por el mercado; el saldo del ahorro sí puede variar." f={f} d={at(112)} dark={dark} top={1300} />
    </AbsoluteFill>
  );
};

const Extra: React.FC<P & {who: 'ana' | 'rob'}> = ({f, at, dark, who}) => {
  const ana = who === 'ana';
  const p = sp(f, 2, 11, 180);
  const chips = ana
    ? [{t: 'Muchos años de ahorro', w: 115}, {t: 'Accidente', w: 123}, {t: 'Invalidez', w: 124}, {t: 'Enfermedades graves', w: 126}]
    : [{t: 'Pagos en pocos años', w: 133}, {t: '60 años + 5 de póliza', w: 143}];
  const isr = sp(f, ana ? 9999 : at(153) - 4, 9, 260);
  const hit = ana ? 9999 : at(153) - 4;
  const shake = f > hit && f < hit + 8 ? Math.sin(f * 3) * 10 : 0;
  return (
    <AbsoluteFill style={{transform: `translate(${shake}px, ${shake / 2}px)`}}>
      <Head light="Para" bold={ana ? 'Ana' : 'Roberto'} f={f} dark={dark} size={118} />
      <Svg>
        <g transform={`translate(${ana ? 260 : 820} 680) scale(${0.75 * p})`}><Person who={who} /></g>
        {!ana && (
          <g transform={`translate(330 1040) scale(${isr}) rotate(${(1 - isr) * -30 - 8})`}>
            <circle r={150} fill="none" stroke="#2E7D4F" strokeWidth={12} />
            <circle r={128} fill="none" stroke="#2E7D4F" strokeWidth={4} />
            <text textAnchor="middle" y={-10} fontFamily={FONT} fontWeight={700} fontSize={70} fill="#2E7D4F">ISR</text>
            <text textAnchor="middle" y={70} fontFamily={FONT} fontWeight={700} fontSize={84} fill="#2E7D4F">0*</text>
          </g>
        )}
      </Svg>
      {chips.map((c, i) => {
        const k = sp(f, at(c.w) - 6, 11, 240);
        return (
          <div key={i} style={{position: 'absolute', left: ana ? 470 : 96, top: (ana ? 560 : 560) + i * 130, padding: '22px 34px', borderRadius: 40, background: i === 0 ? OCRE : NAVY, color: i === 0 ? NAVY : WARM, fontFamily: FONT, fontWeight: 700, fontSize: 44, whiteSpace: 'nowrap', transform: `scale(${k})`, transformOrigin: 'left center', boxShadow: '0 12px 30px rgba(0,0,0,0.25)'}}>{c.t}</div>
        );
      })}
      <Note
        text={ana ? 'Coberturas adicionales disponibles de 18 a 54 años, sujetas a condiciones.' : '*Exención sujeta a los requisitos del Art. 93, fracc. XXI de la LISR.'}
        f={f}
        d={ana ? at(126) : at(153)}
        dark={dark}
        top={1300}
      />
    </AbsoluteFill>
  );
};
const AnaX: React.FC<P> = (p) => <Extra {...p} who="ana" />;
const RobX: React.FC<P> = (p) => <Extra {...p} who="rob" />;

const Pregunta: React.FC<P> = ({f, at}) => {
  const k = sp(f, 2, 10, 200);
  const a = f >= at(158) - 3 && f < at(160) - 3;
  const r = f >= at(160) - 3;
  const card = (on: boolean, x: number, who: 'ana' | 'rob', t: string) => (
    <g transform={`translate(${x} 1000) scale(${k * (on ? 1.08 : 0.94)})`}>
      <rect x={-210} y={-270} width={420} height={540} rx={40} fill={on ? OCRE : NAVY2} stroke={WARM} strokeWidth={on ? 0 : 3} />
      <g transform="translate(0 -40) scale(0.85)"><Person who={who} /></g>
      <text textAnchor="middle" y={220} fontFamily={FONT} fontWeight={700} fontSize={56} fill={on ? NAVY : WARM}>{t}</text>
    </g>
  );
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 70, top: 300, fontFamily: FONT, color: WARM, fontSize: 110, lineHeight: 1.04, transform: `scale(${0.7 + 0.3 * k})`, transformOrigin: 'left top', opacity: cl(k * 2)}}>
        <div style={{fontWeight: 300}}>¿TÚ SERÍAS</div>
        <div style={{fontWeight: 700}}>
          <span style={{color: OCRE}}>ANA</span> O <span style={{color: OCRE}}>ROBERTO?</span>
        </div>
      </div>
      <Svg>
        {card(a, 300, 'ana', 'ANA')}
        {card(r, 780, 'rob', 'ROBERTO')}
      </Svg>
    </AbsoluteFill>
  );
};

const LEGAL =
  'Vida Ahorro Creciente es un seguro de vida con ahorro vinculado a fondos de inversión, emitido por Zurich en alianza con Actinver. Contenido únicamente informativo; no constituye recomendación ni oferta. Coberturas, exclusiones, requisitos de suscripción y costos sujetos a las condiciones generales del producto. El ahorro invertido en fondos está sujeto a riesgo de mercado y puede presentar minusvalías; rendimientos pasados no garantizan rendimientos futuros. El tratamiento fiscal depende del cumplimiento de los requisitos de la Ley del ISR vigente.';

const End: React.FC<P> = ({f, at}) => {
  const dm = sp(f, 2, 11, 200);
  const send = ease((f - at(167)) / 10);
  const fol = sp(f, at(168), 10, 200);
  const tap = f - at(169) - 4;
  const pressed = tap > 0 && tap < 8;
  const legalAt = at(174) + F(LAST.e - LAST.s + 0.4);
  const fade = ease((f - legalAt) / 10);
  return (
    <AbsoluteFill>
      <div style={{opacity: 1 - fade}}>
        <div style={{position: 'absolute', left: 120, top: 380, width: 760, padding: '36px 44px', borderRadius: '40px 40px 40px 8px', background: WARM, fontFamily: FONT, fontSize: 56, fontWeight: 600, color: NAVY, transform: `scale(${dm}) translateY(${-send * 30}px)`, transformOrigin: 'left bottom', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'}}>
          ✉️ Escríbeme y te hago tu cotización personalizada
        </div>
        <div style={{position: 'absolute', left: 120, top: 760, padding: '28px 40px', borderRadius: 30, background: OCRE, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 52, transform: `scale(${sp(f, at(166) - 4)})`, transformOrigin: 'left center'}}>
          📋 COTÍZALO CONMIGO
        </div>
        <div style={{position: 'absolute', left: 540, top: 1150, transform: `translate(-50%,-50%) scale(${fol * (pressed ? 0.9 : 1)})`, background: pressed || tap >= 8 ? WARM : OCRE, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 64, padding: '26px 70px', borderRadius: 100, boxShadow: '0 16px 40px rgba(0,0,0,0.3)'}}>
          {tap >= 8 ? '✓ SIGUIENDO' : '+ SÍGUEME'}
        </div>
        {tap > -6 && tap < 14 && <div style={{position: 'absolute', left: 600 - Math.min(tap + 6, 6) * 6, top: 1170 - Math.min(tap + 6, 6) * 4, fontSize: 90, transform: pressed ? 'scale(0.85)' : 'none'}}>👆</div>}
      </div>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 96, top: 420, width: 330, opacity: fade}} />
      <div style={{position: 'absolute', left: 96, right: 96, top: 560, fontFamily: FONT, fontSize: 64, color: WARM, opacity: fade, lineHeight: 1.1}}>
        <div style={{fontWeight: 300}}>VIDA AHORRO</div>
        <div style={{fontWeight: 700, color: OCRE}}>CRECIENTE</div>
        <div style={{fontWeight: 400, fontSize: 36, marginTop: 14}}>En alianza con Zurich</div>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 110, fontFamily: FONT, fontSize: 24, lineHeight: 1.42, color: 'rgba(245,243,238,0.82)', opacity: fade}}>
        <div style={{fontWeight: 600, fontSize: 26, color: WARM, marginBottom: 12}}>Consulta términos y condiciones de los productos en actinver.com</div>
        {LEGAL}
      </div>
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC<P>> = {hook: Hook, ana: Ana, rob: Rob, nombre: Nombre, aport: Aport, fondos: Fondos3, faltar: Faltar, final: Final, mercado: Mercado, anax: AnaX, robx: RobX, pregunta: Pregunta, end: End};


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

export const Vac: React.FC = () => {
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
      {cur.k !== 'nombre' && cur.k !== 'end' && <Img src={staticFile(light ? 'logo_azul.png' : 'logo_blanco.png')} style={{position: 'absolute', right: 60, top: 70, width: 210}} />}
      {t < LAST.e + 0.3 && <Captions t={t} f={f} />}
      <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: W * cl(t / VC_TOTAL), background: OCRE}} />
      <Audio src={staticFile('vac/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

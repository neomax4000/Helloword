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
import data from '../public/actimed/words.json';
import {FONT, FPS, W} from './theme';
import {F, cl, ease, sp} from './narrador';
import {NAVY, NAVY2, OCRE, WARM, GRAY, OK, THEMES, ThemeBg} from './banca';

type Word = {i: number; w: string; s: number; e: number; k: boolean};
const words = data.words as Word[];
const LAST = words[words.length - 1];
export const AM_TOTAL = Math.round((LAST.e + 4.6) * 100) / 100; // voz + pantalla legal
const TW = (i: number) => words[i].s;

/* escenas: palabra inicial, componente, fondo (cambia cada 2–3 escenas) */
const SC = [
  {w: 0, k: 'meta', bg: 0},
  {w: 10, k: 'metas', bg: 0},
  {w: 19, k: 'infla', bg: 2},
  {w: 31, k: 'intro', bg: 1},
  {w: 44, k: 'deuda', bg: 1},
  {w: 57, k: 'escudo', bg: 2},
  {w: 67, k: 'rating', bg: 3},
  {w: 73, k: 'liq', bg: 3},
  {w: 86, k: 'cta1', bg: 5},
  {w: 94, k: 'end', bg: 0},
];
const TD = 12;
const starts = SC.map((s, i) => (i === 0 ? 0 : F(TW(s.w) - 0.14)));
const totalF = F(AM_TOTAL);

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

/* ---------- escenas ---------- */
const Meta: React.FC<P> = ({f, at, dark}) => {
  const k = sp(f, 3, 12, 160);
  const yrs = [2027, 2028, 2029];
  const step = [at(6), at(7) + 3, at(8)];
  let idx = 0;
  step.forEach((s, i) => { if (f >= s) idx = i; });
  const flipK = sp(f, step[idx], 10, 260);
  const flag = sp(f, at(8) + 6, 10, 220);
  return (
    <AbsoluteFill>
      <Head light="¿Tienes" bold="una meta?" f={f} dark={dark} size={118} />
      <Svg>
        <g transform={`translate(540 930) scale(${k})`}>
          <rect x={-250} y={-230} width={500} height={460} rx={40} fill={WARM} />
          <rect x={-250} y={-230} width={500} height={120} rx={40} fill={OCRE} />
          <rect x={-250} y={-150} width={500} height={40} fill={OCRE} />
          {[-140, 140].map((x) => <rect key={x} x={x - 14} y={-270} width={28} height={80} rx={14} fill={GRAY} />)}
          <g transform={`scale(1 ${0.2 + 0.8 * flipK})`}>
            <text textAnchor="middle" y={90} fontFamily={FONT} fontWeight={700} fontSize={150} fill={NAVY}>{yrs[idx]}</text>
          </g>
          <g transform={`translate(230 -230) scale(${flag})`}>
            <line x1={0} y1={0} x2={0} y2={-150} stroke={NAVY} strokeWidth={10} strokeLinecap="round" />
            <path d="M0 -150 L110 -118 L0 -86Z" fill="#D9534F" />
          </g>
        </g>
      </Svg>
      <Pill text="1 A 3 AÑOS" x={540} y={1290} k={sp(f, at(9))} size={62} />
    </AbsoluteFill>
  );
};

const House = () => (
  <g>
    <path d="M-70 -10 L0 -75 L70 -10" stroke={NAVY} strokeWidth={14} fill="none" strokeLinejoin="round" strokeLinecap="round" />
    <rect x={-52} y={-16} width={104} height={80} rx={8} fill={NAVY} />
    <rect x={-16} y={18} width={32} height={46} rx={4} fill={OCRE} />
  </g>
);
const Car = () => (
  <g>
    <path d="M-80 20 L-62 -22 Q-56 -38 -38 -38 H38 Q56 -38 62 -22 L80 20 V44 H-80Z" fill={NAVY} />
    <rect x={-46} y={-28} width={92} height={30} rx={6} fill={WARM} />
    <circle cx={-48} cy={46} r={18} fill={GRAY} stroke={NAVY} strokeWidth={6} />
    <circle cx={48} cy={46} r={18} fill={GRAY} stroke={NAVY} strokeWidth={6} />
  </g>
);
const Cap = () => (
  <g>
    <path d="M0 -60 L95 -20 L0 20 L-95 -20Z" fill={NAVY} />
    <path d="M-55 0 V40 Q0 70 55 40 V0 L0 22Z" fill={NAVY} />
    <path d="M80 -14 V40" stroke={OCRE} strokeWidth={8} strokeLinecap="round" />
    <circle cx={80} cy={46} r={10} fill={OCRE} />
  </g>
);
const Metas: React.FC<P> = ({f, at, dark}) => {
  const items = [
    {C: House, t: 'Casa', w: 14, y: 640},
    {C: Car, t: 'Auto', w: 16, y: 880},
    {C: Cap, t: 'Maestría', w: 18, y: 1120},
  ];
  return (
    <AbsoluteFill>
      <Head light="Tus" bold="metas" f={f} dark={dark} size={110} top={250} />
      {items.map((it, i) => {
        const k = sp(f, at(it.w) - 6, 11, 220);
        const C = it.C;
        return (
          <div key={i} style={{position: 'absolute', left: 120 + (i % 2) * 120, top: it.y, width: 720, height: 190, borderRadius: 34, background: WARM, display: 'flex', alignItems: 'center', gap: 40, padding: '0 40px', boxSizing: 'border-box', transform: `translateX(${(1 - k) * 1100}px) rotate(${[-3, 2, -2][i]}deg)`, boxShadow: '0 20px 50px rgba(0,0,0,0.35)'}}>
            <svg width={190} height={170} viewBox="-100 -90 200 170"><C /></svg>
            <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 70, color: NAVY}}>{it.t}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Infla: React.FC<P> = ({f, at, dark}) => {
  const k = sp(f, 3);
  const shrink = ease((f - at(27)) / 30);
  const press = sp(f, at(27) - 4, 10, 200);
  return (
    <AbsoluteFill>
      <Head light="Que no pierda" bold="poder de compra" f={f} dark={dark} size={84} />
      <Svg>
        <g transform={`translate(540 ${960 + shrink * 60}) scale(${k})`}>
          <Bill s={1 - 0.42 * shrink} o={1 - 0.35 * shrink} />
        </g>
        <g transform={`translate(540 ${560 + press * 160 + shrink * 70})`} opacity={press}>
          <path d="M-60 -60 H60 V10 H110 L0 110 L-110 10 H-60Z" fill="#D9534F" />
          <text textAnchor="middle" y={-80} fontFamily={FONT} fontWeight={700} fontSize={46} fill="#D9534F">INFLACIÓN</text>
        </g>
      </Svg>
      <Pill text="MENOS PODER DE COMPRA" x={540} y={1300} k={sp(f, at(29))} c={NAVY} tc={WARM} size={50} />
    </AbsoluteFill>
  );
};

const Intro: React.FC<P> = ({f, at}) => {
  const a = sp(f, 4, 10, 220);
  const b = sp(f, 9, 10, 220);
  const line = ease((f - 14) / 16);
  const logo = sp(f, at(37));
  const sub = sp(f, at(41));
  return (
    <AbsoluteFill>
      <CameraMotionBlur shutterAngle={200} samples={5}>
        <AbsoluteFill>
          <div style={{position: 'absolute', left: 96, top: 480, fontFamily: FONT, color: WARM, lineHeight: 0.95}}>
            <div style={{fontWeight: 300, fontSize: 230, transform: `translateX(${(1 - a) * -900}px)`}}>ACTI</div>
            <div style={{fontWeight: 700, fontSize: 250, color: OCRE, transform: `translateX(${(1 - b) * 1000}px)`}}>MED</div>
          </div>
        </AbsoluteFill>
      </CameraMotionBlur>
      <Svg>
        <path d="M100 980 H860" stroke={WARM} strokeWidth={6} strokeLinecap="round" {...(() => { const e = evolvePath(line, 'M100 980 H860'); return {strokeDasharray: e.strokeDasharray, strokeDashoffset: e.strokeDashoffset}; })()} />
      </Svg>
      <div style={{position: 'absolute', left: 100, top: 1020, fontFamily: FONT, fontSize: 50, color: WARM, opacity: ease((f - at(34)) / 10)}}>Fondo de inversión de deuda</div>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 100, top: 1110, width: 300, opacity: cl(logo * 1.5), transform: `scale(${0.8 + 0.2 * logo})`, transformOrigin: 'left center'}} />
      <Pill text="MEDIANO PLAZO" x={360} y={1290} k={sub} size={58} />
      <Sequence from={0} durationInFrames={40}>
        <AbsoluteFill style={{mixBlendMode: 'screen', opacity: 0.4}}>
          <LightLeak seed={5} hueShift={30} durationInFrames={40} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

const Deuda: React.FC<P> = ({f, at, dark}) => {
  const cards = [
    {t: 'Gubernamental', w: 47, y: 560, ic: '🏛️'},
    {t: 'Corporativa', w: 49, y: 760, ic: '🏢'},
  ];
  const g = sp(f, at(52) - 4);
  const needle = interpolate(ease((f - at(54)) / 22), [0, 1], [-90, -18]);
  return (
    <AbsoluteFill>
      <Head light="Invierte en" bold="deuda" f={f} dark={dark} size={100} top={250} />
      {cards.map((c, i) => {
        const k = sp(f, at(c.w) - 5, 11, 220);
        return (
          <div key={i} style={{position: 'absolute', left: 120, top: c.y, width: 840, height: 160, borderRadius: 30, background: i ? OCRE : WARM, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 64, display: 'flex', alignItems: 'center', gap: 30, padding: '0 44px', boxSizing: 'border-box', transform: `translateX(${(1 - k) * (i ? 1100 : -1100)}px)`, boxShadow: '0 20px 50px rgba(0,0,0,0.35)'}}>
            <span style={{fontSize: 70}}>{c.ic}</span>
            {c.t}
          </div>
        );
      })}
      <Svg>
        <g transform={`translate(540 1250) scale(${g})`}>
          <path d="M-210 0 A210 210 0 0 1 -105 -182" stroke={OK} strokeWidth={42} fill="none" />
          <path d="M-105 -182 A210 210 0 0 1 105 -182" stroke={OCRE} strokeWidth={42} fill="none" />
          <path d="M105 -182 A210 210 0 0 1 210 0" stroke="#D9534F" strokeWidth={42} fill="none" />
          <g transform={`rotate(${needle})`}>
            <path d="M-11 0 L0 -175 L11 0Z" fill={WARM} />
          </g>
          <circle r={22} fill={WARM} />
          <text textAnchor="middle" y={-240} fontFamily={FONT} fontWeight={700} fontSize={44} fill={WARM}>RIESGO</text>
        </g>
      </Svg>
      <Pill text="BAJO A MODERADO" x={540} y={1330} k={sp(f, at(56))} c={WARM} tc={NAVY} size={52} />
    </AbsoluteFill>
  );
};

const Escudo: React.FC<P> = ({f, at, dark}) => {
  const k = sp(f, 3);
  const drop = sp(f, at(58) - 4, 9, 200);
  const glow = 0.5 + 0.5 * Math.sin(f / 7);
  return (
    <AbsoluteFill>
      <Head light="Busca" bold="preservar" f={f} dark={dark} size={110} />
      <Svg>
        <g transform={`translate(540 980) scale(${k})`}>
          <Bill s={0.8} />
        </g>
        <g transform={`translate(540 ${960 - (1 - drop) * 700}) scale(${0.9 + 0.1 * drop})`}>
          <path d="M0 -300 L240 -210 V20 Q240 210 0 300 Q-240 210 -240 20 V-210Z" fill="rgba(4,30,66,0.12)" stroke={NAVY} strokeWidth={16} />
          <path d="M0 -300 L240 -210 V20 Q240 210 0 300 Q-240 210 -240 20 V-210Z" fill="none" stroke={OCRE} strokeWidth={6} opacity={glow} transform="scale(1.06)" />
        </g>
      </Svg>
      <Pill text="TU CAPITAL" x={330} y={1360} k={sp(f, at(60))} c={NAVY} tc={WARM} size={50} />
      <Pill text="PODER ADQUISITIVO" x={640} y={1470} k={sp(f, at(66) - 6)} size={46} />
    </AbsoluteFill>
  );
};

const Rating: React.FC<P> = ({f, at, dark}) => {
  const st = sp(f, at(69) - 3, 9, 260);
  const hit = at(69) - 3;
  const shake = f > hit && f < hit + 8 ? Math.sin(f * 3) * 10 : 0;
  return (
    <AbsoluteFill style={{transform: `translate(${shake}px, ${shake / 2}px)`}}>
      <Head light="Calificación" bold="HR Ratings" f={f} dark={dark} size={100} />
      <Svg>
        <g transform={`translate(540 880) scale(${0.3 + 0.7 * st}) rotate(${(1 - st) * -40 + f * 0.3})`}>
          <g transform="translate(-260 -260)">
            <Star points={18} innerRadius={220} outerRadius={260} fill={OCRE} />
          </g>
          <circle r={190} fill={NAVY} />
          <circle r={170} fill="none" stroke={OCRE} strokeWidth={4} />
        </g>
        <g transform={`translate(540 880) scale(${0.3 + 0.7 * st})`}>
          <text textAnchor="middle" y={30} fontFamily={FONT} fontWeight={700} fontSize={110} fill={WARM}>AAA/3</text>
          <text textAnchor="middle" y={100} fontFamily={FONT} fontSize={42} fill={OCRE}>HR Ratings</text>
        </g>
      </Svg>
      <Note text="Calificación según actinver.com, marzo 2026." f={f} d={at(71)} dark={dark} top={1240} />
    </AbsoluteFill>
  );
};

const Liq: React.FC<P> = ({f, at, dark}) => {
  const days = ['L', 'M', 'M', 'J', 'V'];
  const clock = sp(f, at(82) - 4);
  const sweep = ease((f - at(84)) / 20);
  return (
    <AbsoluteFill>
      <Head light="Compra y venta" bold="cualquier día hábil" f={f} dark={dark} size={80} />
      <div style={{position: 'absolute', left: 90, right: 90, top: 560, display: 'flex', justifyContent: 'space-between'}}>
        {days.map((d, i) => {
          const k = sp(f, at(75) + i * 4, 10, 240);
          return (
            <div key={i} style={{width: 160, height: 200, borderRadius: 26, background: NAVY2, border: '2px solid rgba(245,243,238,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: WARM}}>
              <div style={{fontSize: 56, fontWeight: 700}}>{d}</div>
              <div style={{width: 74, height: 74, borderRadius: 40, background: OK, color: '#fff', fontSize: 50, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${k})`}}>✓</div>
            </div>
          );
        })}
      </div>
      <Svg>
        <g transform={`translate(300 1030) scale(${clock})`}>
          <circle r={120} fill={WARM} />
          <circle r={120} fill="none" stroke={OCRE} strokeWidth={14} strokeDasharray={`${754 * sweep} 754`} transform="rotate(-90)" />
          <line x1={0} y1={0} x2={0} y2={-80} stroke={NAVY} strokeWidth={10} strokeLinecap="round" transform={`rotate(${sweep * 360})`} />
          <circle r={12} fill={NAVY} />
        </g>
      </Svg>
      <div style={{position: 'absolute', left: 470, top: 940, fontFamily: FONT, color: WARM, lineHeight: 1, transform: `scale(${clock})`, transformOrigin: 'left center'}}>
        <div style={{fontWeight: 700, fontSize: 150, color: OCRE}}>24 H</div>
        <div style={{fontWeight: 400, fontSize: 40}}>liquidación</div>
      </div>
      <Note text="Días hábiles, según el prospecto del fondo." f={f} d={at(82)} dark={dark} top={1240} />
    </AbsoluteFill>
  );
};

const Cta1: React.FC<P> = ({f, at}) => {
  const k = sp(f, 2, 10, 200);
  const arrow = ease((f - at(91)) / 10);
  const hit = f > at(91) + 10 ? sp(f, at(91) + 10, 8, 300) : 0;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 70, top: 300, fontFamily: FONT, color: WARM, fontSize: 100, lineHeight: 1.05, transform: `scale(${0.7 + 0.3 * k})`, transformOrigin: 'left top', opacity: cl(k * 2)}}>
        <div style={{fontWeight: 300}}>¿QUÉ META TIENES</div>
        <div style={{fontWeight: 700}}>
          PARA LOS PRÓXIMOS <span style={{color: OCRE}}>3 AÑOS?</span>
        </div>
      </div>
      <Svg>
        <g transform={`translate(540 1040) scale(${k * (1 + 0.06 * hit * Math.sin(f))})`}>
          {[200, 150, 100, 50].map((r, i) => <circle key={r} r={r} fill={i % 2 ? WARM : '#D9534F'} />)}
        </g>
        <g transform={`translate(${540 + (1 - arrow) * 600} ${1040 - (1 - arrow) * 400}) rotate(-34)`} opacity={cl(arrow * 3)}>
          <line x1={0} y1={0} x2={260} y2={0} stroke={OCRE} strokeWidth={14} strokeLinecap="round" />
          <path d="M0 0 L36 -20 L36 20Z" fill={OCRE} />
          <path d="M240 0 L280 -30 H310 L270 0 L310 30 H280Z" fill={OCRE} />
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

const LEGAL =
  'El contenido es únicamente informativo, no constituye recomendación, consejo o sugerencia personalizada de algún producto y/o servicio que le sugieran la toma de decisiones de inversión, para lo que se necesita previamente verificar la congruencia entre el perfil del cliente y el perfil del producto financiero. Rendimientos pasados no garantizan rendimientos futuros. El valor de las acciones de Fondos de Inversión conlleva un riesgo de mercado incluyendo una posible minusvalía del capital invertido. Los fondos de inversión no están garantizados por Grupo Financiero Actinver S.A. de C.V, o por alguna entidad integrante del Grupo Financiero Actinver, ni por ninguna entidad gubernamental, ni por el IPAB y pueden tener minusvalías del capital invertido. Todos los Fondos de Actinver cuentan con Prospecto de Información al Público Inversionista y Documentos con Información Clave, los cuales se encuentran a su disposición en www.actinver.com/fondos.';

const End: React.FC<P> = ({f, at}) => {
  const dm = sp(f, 2, 11, 200);
  const send = ease((f - at(98)) / 10);
  const com = (i: number) => sp(f, at(102) - 4 + i * 6, 11, 220);
  const fol = sp(f, at(107), 10, 200);
  const tap = f - at(108) - 4;
  const pressed = tap > 0 && tap < 8;
  const legalAt = at(113) + F(LAST.e - LAST.s + 0.4);
  const fade = ease((f - legalAt) / 10);
  return (
    <AbsoluteFill>
      <div style={{opacity: 1 - fade}}>
        <div style={{position: 'absolute', left: 120, top: 330, width: 700, padding: '34px 40px', borderRadius: '40px 40px 40px 8px', background: WARM, fontFamily: FONT, fontSize: 52, fontWeight: 600, color: NAVY, transform: `scale(${dm}) translateY(${-send * 30}px)`, transformOrigin: 'left bottom', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'}}>
          ✉️ Escríbeme y lo revisamos juntos
        </div>
        {['¡No lo conocía! 👀', 'Me interesa 🙌', 'MI META 🏠'].map((t, i) => (
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
        <span style={{fontWeight: 700, color: OCRE}}>ACTIMED</span>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 90, fontFamily: FONT, fontSize: 21, lineHeight: 1.38, color: 'rgba(245,243,238,0.8)', opacity: fade}}>
        <div style={{fontWeight: 600, fontSize: 24, color: WARM, marginBottom: 10}}>Datos de actinver.com/actimed al 31 de marzo de 2026. Rendimientos pasados no garantizan rendimientos futuros. Consulta términos y condiciones de los productos en actinver.com</div>
        {LEGAL}
      </div>
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC<P>> = {meta: Meta, metas: Metas, infla: Infla, intro: Intro, deuda: Deuda, escudo: Escudo, rating: Rating, liq: Liq, cta1: Cta1, end: End};

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

export const Actimed: React.FC = () => {
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
      {t < LAST.e + 0.3 && <Captions t={t} f={f} />}
      <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: W * cl(t / AM_TOTAL), background: OCRE}} />
      <Audio src={staticFile('actimed/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

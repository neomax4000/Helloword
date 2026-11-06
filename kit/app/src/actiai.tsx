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
import data from '../public/actiai/words.json';
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
  {w: 0, k: 'ia', bg: 0},
  {w: 8, k: 'chip', bg: 0},
  {w: 15, k: 'intro', bg: 1},
  {w: 26, k: 'red', bg: 2},
  {w: 38, k: 'digital', bg: 3},
  {w: 47, k: 'liq', bg: 3},
  {w: 62, k: 'riesgo', bg: 4},
  {w: 80, k: 'cta1', bg: 5},
  {w: 89, k: 'end', bg: 5},
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


/* ---------- escenas ---------- */
const AppTile: React.FC<{x: number; y: number; k: number; c: string; children: React.ReactNode}> = ({x, y, k, c, children}) => (
  <g transform={`translate(${x} ${y}) scale(${k})`}>
    <rect x={-120} y={-120} width={240} height={240} rx={56} fill={c} stroke="rgba(245,243,238,0.5)" strokeWidth={5} />
    {children}
  </g>
);

const Ia: React.FC<P> = ({f, at, dark}) => {
  const t = (w: number, d = 0) => sp(f, at(w) - 4 + d, 11, 210);
  return (
    <AbsoluteFill>
      <Head light="Usas IA" bold="sin darte cuenta" f={f} dark={dark} size={96} />
      <Svg>
        <AppTile x={330} y={800} k={t(2)} c={OCRE}>
          <rect x={-22} y={-62} width={44} height={80} rx={22} fill={NAVY} />
          <path d="M-46 4 A46 46 0 0 0 46 4" stroke={NAVY} strokeWidth={9} fill="none" strokeLinecap="round" />
          <line x1={0} y1={50} x2={0} y2={78} stroke={NAVY} strokeWidth={9} strokeLinecap="round" />
        </AppTile>
        <AppTile x={750} y={800} k={t(3)} c={WARM}>
          <path d="M0 -76 C-48 -76 -62 -36 -62 -12 C-62 24 0 80 0 80 C0 80 62 24 62 -12 C62 -36 48 -76 0 -76Z" fill={NAVY} />
          <circle cx={0} cy={-20} r={22} fill={WARM} />
        </AppTile>
        <AppTile x={330} y={1130} k={t(4)} c={WARM}>
          <path d="M-70 -50 H70 V30 H-10 L-44 66 V30 H-70Z" fill={NAVY} />
          <circle cx={-34} cy={-10} r={8} fill={WARM} /><circle cx={0} cy={-10} r={8} fill={WARM} /><circle cx={34} cy={-10} r={8} fill={WARM} />
        </AppTile>
        <AppTile x={750} y={1130} k={t(6)} c={OCRE}>
          <rect x={-70} y={-48} width={140} height={100} rx={18} fill={NAVY} />
          <circle cx={0} cy={2} r={28} fill={OCRE} /><rect x={-24} y={-66} width={48} height={22} rx={8} fill={NAVY} />
        </AppTile>
      </Svg>
      <Pill text="INTELIGENCIA ARTIFICIAL" x={540} y={1440} k={sp(f, at(3))} c={NAVY2} tc={WARM} size={44} />
    </AbsoluteFill>
  );
};

const Chip: React.FC<P> = ({f, at, dark}) => {
  const k = sp(f, 6, 12, 200);
  const glow = ease((f - at(12) + 4) / 12);
  const pins = new Array(8).fill(0);
  return (
    <AbsoluteFill>
      <Head light="¿Y si invirtieras" bold="en ella?" f={f} dark={dark} size={92} />
      <Svg>
        <g transform={`translate(540 1030) scale(${k * (1 + 0.025 * glow * Math.sin(f / 4))})`}>
          {pins.map((_, i) => {
            const x = -150 + (i % 4) * 100, side = i < 4;
            return <rect key={i} x={x - 12} y={side ? -280 : 190} width={24} height={90} rx={8} fill={OCRE} opacity={0.4 + 0.6 * glow} />;
          })}
          {pins.map((_, i) => {
            const y = -150 + (i % 4) * 100, side = i < 4;
            return <rect key={'h' + i} x={side ? -280 : 190} y={y - 12} width={90} height={24} rx={8} fill={OCRE} opacity={0.4 + 0.6 * glow} />;
          })}
          <rect x={-190} y={-190} width={380} height={380} rx={50} fill={NAVY2} stroke={glow > 0.2 ? OCRE : WARM} strokeWidth={10} />
          <text textAnchor="middle" y={44} fontFamily={FONT} fontWeight={700} fontSize={140} fill={glow > 0.2 ? OCRE : WARM}>IA</text>
        </g>
      </Svg>
      <Pill text="INVERTIR EN IA" x={540} y={1430} k={sp(f, at(12))} />
    </AbsoluteFill>
  );
};

const Intro: React.FC<P> = ({f, at}) => {
  const a = sp(f, 4, 10, 220);
  const b = sp(f, 9, 10, 220);
  const line = ease((f - 14) / 16);
  const logo = sp(f, at(20));
  const e = evolvePath(line, 'M100 980 H860');
  return (
    <AbsoluteFill>
      <CameraMotionBlur shutterAngle={200} samples={5}>
        <AbsoluteFill>
          <div style={{position: 'absolute', left: 96, top: 480, fontFamily: FONT, color: WARM, lineHeight: 0.95}}>
            <div style={{fontWeight: 300, fontSize: 230, transform: `translateX(${(1 - a) * -900}px)`}}>ACTI</div>
            <div style={{fontWeight: 700, fontSize: 250, color: OCRE, transform: `translateX(${(1 - b) * 1000}px)`}}>AI</div>
          </div>
        </AbsoluteFill>
      </CameraMotionBlur>
      <Svg>
        <path d="M100 980 H860" stroke={WARM} strokeWidth={6} strokeLinecap="round" strokeDasharray={e.strokeDasharray} strokeDashoffset={e.strokeDashoffset} />
      </Svg>
      <div style={{position: 'absolute', left: 100, top: 1020, fontFamily: FONT, fontSize: 50, color: WARM, opacity: ease((f - at(18)) / 10)}}>Fondo de inversión</div>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 100, top: 1110, width: 300, opacity: cl(logo * 1.5), transform: `scale(${0.8 + 0.2 * logo})`, transformOrigin: 'left center'}} />
      <div style={{position: 'absolute', left: 100, top: 1250, fontFamily: FONT, fontSize: 40, color: WARM, opacity: ease((f - at(21)) / 10)}}>Asesorado por AXA Investment Managers</div>
      <Pill text="RENTA VARIABLE GLOBAL" x={400} y={1400} k={sp(f, at(21) + 6)} size={50} />
      <Sequence from={0} durationInFrames={40}>
        <AbsoluteFill style={{mixBlendMode: 'screen', opacity: 0.4}}>
          <LightLeak seed={11} hueShift={30} durationInFrames={40} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

const Red: React.FC<P> = ({f, at, dark}) => {
  const L = [
    [{x: 200, y: 900}, {x: 200, y: 1060}, {x: 200, y: 1220}],
    [{x: 420, y: 820}, {x: 420, y: 980}, {x: 420, y: 1140}, {x: 420, y: 1300}],
    [{x: 640, y: 900}, {x: 640, y: 1060}, {x: 640, y: 1220}],
    [{x: 860, y: 1060}],
  ];
  const wlayer = [28, 29, 33, 36];
  return (
    <AbsoluteFill>
      <Head light="Empresas globales" bold="e IA" f={f} dark={dark} size={92} />
      <Svg>
        {L.slice(0, -1).map((la, li) => la.map((a, ai) => L[li + 1].map((b, bi) => {
          const p = ease((f - (at(wlayer[li]) - 4) - (ai + bi) * 1.5) / 14);
          const e = evolvePath(p, `M${a.x} ${a.y} L${b.x} ${b.y}`);
          return <path key={`${li}-${ai}-${bi}`} d={`M${a.x} ${a.y} L${b.x} ${b.y}`} stroke={WARM} strokeOpacity={0.5} strokeWidth={3} fill="none" strokeDasharray={e.strokeDasharray} strokeDashoffset={e.strokeDashoffset} />;
        })))}
        {L.map((la, li) => la.map((a, ai) => {
          const k = sp(f, at(wlayer[li]) - 8 + ai * 2, 10, 220);
          const pulse = li === 3 ? 1 + 0.05 * Math.sin(f / 5) : 1;
          return <circle key={`n${li}-${ai}`} cx={a.x} cy={a.y} r={li === 3 ? 70 : 34} fill={li === 3 ? OCRE : WARM} transform={`translate(${a.x} ${a.y}) scale(${k * pulse}) translate(${-a.x} ${-a.y})`} />;
        }))}
        <text x={860} y={1082} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={56} fill={NAVY} opacity={ease((f - at(36)) / 8)}>IA</text>
      </Svg>
      <Pill text="REVOLUCIÓN DE LA IA" x={540} y={1470} k={sp(f, at(33))} c={NAVY2} tc={WARM} size={44} />
      <Note text="Ilustración, no representa las inversiones del fondo." f={f} d={at(33)} dark={dark} top={1540} />
    </AbsoluteFill>
  );
};

const Digital: React.FC<P> = ({f, at, dark}) => {
  const cart = sp(f, at(43) - 5, 12, 200);
  const lock = sp(f, at(46) - 5, 12, 200);
  const shackle = ease((f - at(46) - 6) / 10);
  return (
    <AbsoluteFill>
      <Head light="Economía" bold="digital" f={f} dark={dark} size={118} />
      <Svg>
        <g transform={`translate(330 1030) scale(${cart})`}>
          <circle r={190} fill={WARM} />
          <path d="M-110 -80 H-70 L-40 40 H70 L100 -40 H-60" stroke={NAVY} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={-26} cy={84} r={16} fill={NAVY} /><circle cx={56} cy={84} r={16} fill={NAVY} />
        </g>
        <g transform={`translate(760 1030) scale(${lock})`}>
          <circle r={190} fill={OCRE} />
          <path d={`M-52 -20 V-${50 + 14 * (1 - shackle)} A52 52 0 0 1 52 -${50 + 14 * (1 - shackle)} V-20`} stroke={NAVY} strokeWidth={18} fill="none" strokeLinecap="round" />
          <rect x={-86} y={-22} width={172} height={136} rx={26} fill={NAVY} />
          <circle cy={42} r={16} fill={OCRE} />
        </g>
      </Svg>
      <Pill text="COMERCIO ELECTRÓNICO" x={330} y={1360} k={sp(f, at(43))} c={NAVY2} tc={WARM} size={34} />
      <Pill text="CIBERSEGURIDAD" x={760} y={1440} k={sp(f, at(46))} c={NAVY2} tc={WARM} size={34} />
    </AbsoluteFill>
  );
};

const Liq: React.FC<P> = ({f, at, dark}) => {
  const days = ['L', 'M', 'M', 'J', 'V'];
  const stamp = sp(f, at(60) - 4, 9, 220);
  const hand = ease((f - at(60)) / 24) * 360;
  return (
    <AbsoluteFill>
      <Head light="Largo" bold="plazo" f={f} dark={dark} size={118} />
      <div style={{position: 'absolute', left: 60, right: 60, top: 540, display: 'flex', justifyContent: 'space-between'}}>
        {days.map((d, i) => {
          const k = sp(f, at(55) + i * 4, 10, 240);
          return (
            <div key={i} style={{width: 170, height: 200, borderRadius: 26, background: WARM, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: NAVY, boxShadow: '0 14px 30px rgba(0,0,0,0.25)'}}>
              <div style={{fontSize: 58, fontWeight: 700}}>{d}</div>
              <div style={{width: 76, height: 76, borderRadius: 38, background: OK, color: '#fff', fontSize: 50, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${k})`}}>✓</div>
            </div>
          );
        })}
      </div>
      <Svg>
        <g transform={`translate(540 1020) scale(${sp(f, at(59) - 4, 12, 200)})`}>
          <circle r={150} fill={WARM} stroke={OCRE} strokeWidth={14} />
          {new Array(12).fill(0).map((_, i) => <rect key={i} x={-4} y={-136} width={8} height={i % 3 === 0 ? 28 : 14} fill={NAVY} transform={`rotate(${i * 30})`} />)}
          <rect x={-5} y={-110} width={10} height={110} rx={5} fill={NAVY} transform={`rotate(${hand})`} />
          <circle r={12} fill={OCRE} />
        </g>
        <g transform={`translate(540 1330) rotate(-4) scale(${stamp})`}>
          <rect x={-330} y={-90} width={660} height={180} rx={32} fill="none" stroke={OCRE} strokeWidth={12} />
          <text textAnchor="middle" y={28} fontFamily={FONT} fontWeight={700} fontSize={100} fill={OCRE}>24 HORAS</text>
        </g>
      </Svg>
      <Note text="Liquidación en 24 horas. Compras y ventas en días hábiles." f={f} d={at(60)} dark={dark} top={1450} />
    </AbsoluteFill>
  );
};

const Riesgo: React.FC<P> = ({f, at, dark}) => {
  const up = ease((f - at(72)) / 14);
  const down = ease((f - at(74)) / 14);
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
      <Pill text="MAYOR VOLATILIDAD" x={540} y={1450} k={sp(f, at(68))} c={NAVY2} tc={WARM} size={44} />
      <Note text="Ilustración, no representa datos reales." f={f} d={at(68)} dark={dark} top={1510} />
    </AbsoluteFill>
  );
};

const Cta1: React.FC<P> = ({f, at}) => {
  const k = sp(f, 2, 10, 200);
  const q = sp(f, at(86), 10, 220);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 70, top: 300, fontFamily: FONT, color: WARM, fontSize: 100, lineHeight: 1.05, transform: `scale(${0.7 + 0.3 * k})`, transformOrigin: 'left top', opacity: cl(k * 2)}}>
        <div style={{fontWeight: 300}}>¿LA IA CAMBIARÁ</div>
        <div style={{fontWeight: 700}}>TU <span style={{color: OCRE}}>TRABAJO?</span></div>
      </div>
      <Svg>
        <Coin x={300} y={1080} r={150} t="IA" k={sp(f, at(82) - 6, 10, 220)} c={WARM} fs={110} />
        <g transform={`translate(540 1080) scale(${sp(f, at(85), 10, 220)})`}>
          <rect x={-60} y={-36} width={120} height={80} rx={14} fill={OCRE} /><rect x={-26} y={-62} width={52} height={28} rx={8} fill="none" stroke={OCRE} strokeWidth={10} />
        </g>
        <Coin x={790} y={1080} r={130} t="?" k={q * (1 + 0.04 * Math.sin(f / 5))} fs={190} />
      </Svg>
    </AbsoluteFill>
  );
};

const LEGAL =
  'El contenido es únicamente informativo, no constituye recomendación, consejo o sugerencia personalizada de algún producto y/o servicio que le sugieran la toma de decisiones de inversión, para lo que se necesita previamente verificar la congruencia entre el perfil del cliente y el perfil del producto financiero. Rendimientos pasados no garantizan rendimientos futuros. El valor de las acciones de Fondos de Inversión conlleva un riesgo de mercado incluyendo una posible minusvalía del capital invertido. Los fondos de inversión no están garantizados por Grupo Financiero Actinver S.A. de C.V, o por alguna entidad integrante del Grupo Financiero Actinver, ni por ninguna entidad gubernamental, ni por el IPAB y pueden tener minusvalías del capital invertido. Todos los Fondos de Actinver cuentan con Prospecto de Información al Público Inversionista y Documentos con Información Clave, los cuales se encuentran a su disposición en www.actinver.com/fondos.';

const End: React.FC<P> = ({f, at}) => {
  const dm = sp(f, 2, 11, 200);
  const send = ease((f - at(89)) / 10);
  const card = sp(f, at(90) - 4, 11, 220);
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
          <div style={{fontWeight: 700, fontSize: 84}}>ACTIAI</div>
          <div style={{fontWeight: 400, fontSize: 40, marginTop: 6}}>Fondo de renta variable global</div>
          <div style={{fontWeight: 400, fontSize: 40}}>Enfoque en inteligencia artificial</div>
        </div>
        <div style={{position: 'absolute', left: 540, top: 1190, transform: `translate(-50%,-50%) scale(${fol * (pressed ? 0.9 : 1)})`, background: pressed || tap >= 8 ? WARM : OCRE, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 64, padding: '26px 70px', borderRadius: 100, boxShadow: '0 16px 40px rgba(0,0,0,0.3)'}}>
          {tap >= 8 ? '✓ SIGUIENDO' : '+ SÍGUEME'}
        </div>
        {tap > -6 && tap < 14 && <div style={{position: 'absolute', left: 600 - Math.min(tap + 6, 6) * 6, top: 1210 - Math.min(tap + 6, 6) * 4, fontSize: 90, transform: pressed ? 'scale(0.85)' : 'none'}}>👆</div>}
      </div>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 96, top: 420, width: 330, opacity: fade}} />
      <div style={{position: 'absolute', left: 96, right: 96, top: 560, fontFamily: FONT, fontSize: 64, color: WARM, opacity: fade, lineHeight: 1.1}}>
        <span style={{fontWeight: 300}}>FONDO </span>
        <span style={{fontWeight: 700, color: OCRE}}>ACTIAI</span>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 90, fontFamily: FONT, fontSize: 21, lineHeight: 1.38, color: 'rgba(245,243,238,0.8)', opacity: fade}}>
        <div style={{fontWeight: 600, fontSize: 24, color: WARM, marginBottom: 10}}>Datos de actinver.com/actiai al 31 de marzo de 2026. Rendimientos pasados no garantizan rendimientos futuros. Consulta términos y condiciones de los productos en actinver.com</div>
        {LEGAL}
      </div>
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC<P>> = {ia: Ia, chip: Chip, intro: Intro, red: Red, digital: Digital, liq: Liq, riesgo: Riesgo, cta1: Cta1, end: End};

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

export const Actiai: React.FC = () => {
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
      <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: W * cl(t / AU_TOTAL), background: OCRE}} />
      <Audio src={staticFile('actiai/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

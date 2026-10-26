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
import data from '../public/activar/words.json';
import {FONT, FPS, W} from './theme';
import {F, cl, ease, sp} from './narrador';
import {NAVY, NAVY2, OCRE, WARM, GRAY, OK, THEMES, ThemeBg} from './banca';


type Word = {i: number; w: string; s: number; e: number; k: boolean; p: number};
const words = data.words as Word[];
const lines = data.lines as {p: number; s: number; e: number}[];
const LAST = words[words.length - 1];
export const AV_TOTAL = data.total;
const TW = (i: number) => words[i].s;
const L = (p: number) => ({w0: words.findIndex((w) => w.p === p)});

const SC = [
  {p: 0, k: 'hook', bg: 0},
  {p: 2, k: 'indice', bg: 0},
  {p: 3, k: 'intro', bg: 1},
  {p: 5, k: 'pasivo', bg: 1},
  {p: 6, k: 'mapa', bg: 2},
  {p: 7, k: 'plazo', bg: 2},
  {p: 9, k: 'liq', bg: 3},
  {p: 11, k: 'cta1', bg: 5},
  {p: 12, k: 'end', bg: 0},
];
const TD = 12;
const starts = SC.map((s, i) => (i === 0 ? 0 : F(lines[s.p].s - 0.14)));
const totalF = F(AV_TOTAL);
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
/* ---------- escenas ---------- */
const SECT = ['BANCOS', 'COMERCIO', 'MINERÍA', 'TELECOM', 'CEMENTO', 'ALIMENTOS'];

const Hook: React.FC<P> = ({f, at, dark}) => {
  const ws = [2, 5, 6, 8, 10, 11];
  const band = sp(f, at(L(1).w0 + 10) - 4, 11, 220);
  return (
    <AbsoluteFill>
      <Head light="¿Ya inviertes en la" bold="bolsa mexicana?" f={f} dark={dark} size={96} />
      <Svg>
        <g transform="translate(150 930)">
          <line x1={-20} y1={0} x2={800} y2={0} stroke="rgba(245,243,238,0.3)" strokeWidth={4} />
          {new Array(9).fill(0).map((_, i) => {
            const k = sp(f, 4 + i * 2, 11, 220);
            const h = (90 + 130 * (0.5 + 0.5 * noise2D('bmv', i * 0.8, f / 40))) * k;
            return <rect key={i} x={i * 80} y={-h} width={56} height={h} rx={10} fill={i % 3 === 1 ? OCRE : WARM} opacity={0.9} />;
          })}
        </g>
      </Svg>
      <Pill text="BMV · BOLSA MEXICANA" x={540} y={620} k={sp(f, 8, 10, 220)} c={WARM} size={40} />
      {SECT.map((t, i) => {
        const k = sp(f, at(L(1).w0 + ws[i]) - 4, 10, 200);
        const x = 300 + (i % 3) * 240;
        const y = 1000 + Math.floor(i / 3) * 150;
        const fall = (1 - Math.min(1, k)) * -900;
        return (
          <div key={i} style={{position: 'absolute', left: x - 100, top: y + fall, width: 200, height: 130, borderRadius: 26, background: i % 2 ? OCRE : WARM, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 30, color: NAVY, transform: `rotate(${[-4, 3, -2, 4, -3, 2][i] * (1 - Math.min(1, k) * 0.5)}deg)`, boxShadow: '0 16px 36px rgba(0,0,0,0.35)', opacity: cl(k * 3)}}>{t}</div>
        );
      })}
      <div style={{position: 'absolute', left: 150, top: 1215, width: 780, height: 230, borderRadius: '24px 24px 60px 60px', background: OCRE, boxShadow: '0 20px 50px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 60, color: NAVY, transform: `scale(${0.9 + 0.1 * band})`, opacity: cl(band * 2)}}>UN SOLO FONDO</div>
    </AbsoluteFill>
  );
};

const Indice: React.FC<P> = ({f, dark}) => {
  const circ = sp(f, 22, 11, 220);
  const zig: string[] = [];
  for (let i = 0; i <= 14; i++) zig.push(`${-100 + i * 14},${40 - Math.sin(i / 1.6) * 24 - i * 3}`);
  return (
    <AbsoluteFill>
      <Head light="Eso es invertir" bold="en un índice" f={f} dark={dark} size={100} />
      <Svg>
        {SECT.map((t, i) => {
          const y = 640 + i * 112;
          const e = evolvePath(ease((f - 10 - i * 2) / 18), `M400 ${y + 40} C560 ${y + 40} 560 930 660 930`);
          return (
            <g key={i}>
              <path d={`M400 ${y + 40} C560 ${y + 40} 560 930 660 930`} stroke={OCRE} strokeWidth={5} fill="none" strokeDasharray={e.strokeDasharray} strokeDashoffset={e.strokeDashoffset} />
            </g>
          );
        })}
        <g transform={`translate(810 930) scale(${circ})`}>
          <circle r={160} fill={WARM} />
          <circle r={160} fill="none" stroke={OCRE} strokeWidth={10} />
          <text textAnchor="middle" y={-30} fontFamily={FONT} fontWeight={700} fontSize={60} fill={NAVY}>ÍNDICE</text>
          <polyline points={zig.join(' ')} transform="translate(-10 40)" fill="none" stroke={NAVY2} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </Svg>
      {SECT.map((t, i) => {
        const k = sp(f, 4 + i * 2, 11, 240);
        return (
          <div key={i} style={{position: 'absolute', left: 96, top: 640 + i * 112, width: 304, height: 80, borderRadius: 22, background: i % 2 ? OCRE : WARM, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 32, color: NAVY, transform: `translateX(${(1 - k) * -500}px)`}}>{t}</div>
        );
      })}
      <Note text="Un índice resume el comportamiento de un grupo de empresas." f={f} d={34} dark={dark} top={1390} />
    </AbsoluteFill>
  );
};

const Intro: React.FC<P> = ({f, at}) => {
  const a = sp(f, 4, 10, 220);
  const b = sp(f, 9, 10, 220);
  const line = ease((f - 14) / 16);
  const logo = sp(f, at(L(4).w0 + 3) - 4);
  const sub = sp(f, at(L(4).w0 + 5) - 4);
  return (
    <AbsoluteFill>
      <CameraMotionBlur shutterAngle={200} samples={5}>
        <AbsoluteFill>
          <div style={{position: 'absolute', left: 96, top: 480, fontFamily: FONT, color: WARM, lineHeight: 0.95}}>
            <div style={{fontWeight: 300, fontSize: 230, transform: `translateX(${(1 - a) * -900}px)`}}>ACTI</div>
            <div style={{fontWeight: 700, fontSize: 250, color: OCRE, transform: `translateX(${(1 - b) * 1000}px)`}}>VAR</div>
          </div>
        </AbsoluteFill>
      </CameraMotionBlur>
      <Svg>
        <path d="M100 980 H860" stroke={WARM} strokeWidth={6} strokeLinecap="round" {...(() => { const e = evolvePath(line, 'M100 980 H860'); return {strokeDasharray: e.strokeDasharray, strokeDashoffset: e.strokeDashoffset}; })()} />
      </Svg>
      <div style={{position: 'absolute', left: 100, top: 1020, fontFamily: FONT, fontSize: 50, color: WARM, opacity: ease((f - at(L(4).w0 + 1)) / 10)}}>Fondo de renta variable</div>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 100, top: 1110, width: 300, opacity: cl(logo * 1.5), transform: `scale(${0.8 + 0.2 * logo})`, transformOrigin: 'left center'}} />
      <Pill text="REPLICA EL ÍNDICE DE LA BMV" x={540} y={1300} k={sub} size={44} />
      <Sequence from={0} durationInFrames={40}>
        <AbsoluteFill style={{mixBlendMode: 'screen', opacity: 0.4}}>
          <LightLeak seed={7} hueShift={30} durationInFrames={40} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

const Pasivo: React.FC<P> = ({f, at, dark}) => {
  const d = ease((f - at(L(5).w0 + 2)) / 70);
  const n = 40;
  const idx: string[] = [];
  const fon: string[] = [];
  for (let i = 0; i <= n; i++) {
    if (i / n > d) break;
    const y = -Math.sin(i / 3.2) * 90 - i * 2 + Math.sin(i / 1.3) * 14;
    idx.push(`${i * 21},${y}`);
    fon.push(`${i * 21},${y + 10}`);
  }
  const p1 = sp(f, at(L(5).w0 + 3) - 4, 9, 240);
  const p2 = sp(f, at(L(5).w0 + 7) - 4, 9, 240);
  const c = dark ? NAVY : WARM;
  return (
    <AbsoluteFill>
      <Head light="Manejo" bold="pasivo" f={f} dark={dark} size={118} />
      <Svg>
        <g transform="translate(120 1050)">
          <line x1={0} y1={60} x2={840} y2={60} stroke={c} strokeWidth={4} opacity={0.25} />
          <polyline points={idx.join(' ')} fill="none" stroke={c} strokeWidth={8} strokeDasharray="16 12" opacity={0.7} />
          <polyline points={fon.join(' ')} fill="none" stroke={OCRE} strokeWidth={14} strokeLinejoin="round" strokeLinecap="round" />
          <text x={0} y={120} fontFamily={FONT} fontWeight={600} fontSize={32} fill={c} opacity={ease(f / 12)}>— — Índice   ━ ACTIVAR</text>
        </g>
      </Svg>
      <Pill text="NO INTENTA ADIVINAR" x={540} y={650} k={p1} c={WARM} size={44} />
      <Pill text="SIGUE AL ÍNDICE" x={540} y={770} k={p2} size={50} />
      <Note text="Busca replicar el comportamiento del índice; no es una garantía." f={f} d={at(L(5).w0 + 8)} dark={dark} top={1340} />
    </AbsoluteFill>
  );
};

const MX: [number, number][] = [
  [-117, 32.5], [-114.8, 32.5], [-111, 31.3], [-108.2, 31.3], [-106.5, 31.8], [-104.5, 29.5], [-103, 29], [-101.5, 29.8], [-99.5, 27.5], [-97.2, 25.9],
  [-97.8, 22], [-97.2, 20], [-96, 19], [-94.5, 18.2], [-92, 18.5], [-90.5, 19.8], [-90.3, 21], [-88, 21.5], [-87, 21.3], [-87.5, 18.5], [-88.3, 18], [-89.2, 17.8],
  [-91, 17.8], [-91.5, 16], [-92.2, 14.5], [-94, 16], [-96, 15.7], [-99, 16.7], [-101.5, 17.8], [-104.5, 19.2], [-105.7, 21], [-105.5, 23], [-107.5, 25.5], [-109.5, 27], [-111, 28.5], [-112.7, 30], [-114.7, 31.7],
  [-114.5, 30], [-112.8, 28], [-111.5, 26], [-110, 24], [-109.4, 23], [-110.3, 23.5], [-112, 24.5], [-113.5, 26.5], [-115, 28.5], [-116, 30.5],
];
const mxPath = 'M' + MX.map(([lo, la]) => `${(90 + (lo + 117.3) * 27).toFixed(1)} ${(720 + (32.8 - la) * 30).toFixed(1)}`).join(' L') + ' Z';

const Mapa: React.FC<P> = ({f, at, dark}) => {
  const draw = ease((f - 4) / 26);
  const fill = ease((f - 24) / 14);
  const pin = sp(f, at(L(6).w0 + 1) - 4, 9, 230);
  const e = evolvePath(draw, mxPath);
  const px = 581;
  const py = 1122;
  const ring = (f % 40) / 40;
  const c = dark ? NAVY : WARM;
  return (
    <AbsoluteFill>
      <Head light="Un mercado" bold="emergente" f={f} dark={dark} size={110} />
      <Svg>
        <path d={mxPath} fill={c} fillOpacity={0.18 * fill} stroke={c} strokeWidth={6} strokeLinejoin="round" strokeDasharray={e.strokeDasharray} strokeDashoffset={e.strokeDashoffset} />
        <g transform={`translate(${px} ${py}) scale(${pin})`}>
          <circle r={20 + ring * 90} fill="none" stroke={OCRE} strokeWidth={6} opacity={1 - ring} />
          <path d="M0 0 C-50 -60 -50 -110 0 -110 C50 -110 50 -60 0 0Z" fill={OCRE} stroke={NAVY} strokeWidth={5} />
          <circle cy={-76} r={16} fill={NAVY} />
        </g>
      </Svg>
      <Pill text="MÉXICO" x={400} y={1020} k={pin} c={OCRE} size={44} />
      <Note text="Según la ficha del fondo en actinver.com." f={f} d={at(L(6).w0 + 6)} dark={dark} top={1400} />
    </AbsoluteFill>
  );
};

const Plazo: React.FC<P> = ({f, at, dark}) => {
  const d = ease((f - 6) / 130);
  const n = 50;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    if (i / n > d) break;
    pts.push(`${i * 16},${-Math.sin(i / 3.5) * 100 - Math.sin(i / 1.4) * 22}`);
  }
  const up = sp(f, at(L(8).w0 + 5) - 4, 9, 240);
  const dn = sp(f, at(L(8).w0 + 7) - 4, 9, 240);
  const arrow = ease((f - 4) / 20);
  const c = dark ? NAVY : WARM;
  return (
    <AbsoluteFill>
      <Head light="Pensado para" bold="el largo plazo" f={f} dark={dark} size={96} />
      <Svg>
        <g transform="translate(140 980)">
          <polyline points={pts.join(' ')} fill="none" stroke={c} strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" />
        </g>
        <g transform="translate(120 1190)" opacity={arrow}>
          <line x1={0} y1={0} x2={820 * arrow} y2={0} stroke={c} strokeWidth={6} />
          <path d={`M${820 * arrow - 22} -16 L${820 * arrow} 0 L${820 * arrow - 22} 16`} stroke={c} strokeWidth={6} fill="none" strokeLinecap="round" />
          <text x={0} y={60} fontFamily={FONT} fontWeight={600} fontSize={36} fill={c}>TIEMPO</text>
        </g>
      </Svg>
      <Pill text="PUEDE SUBIR ↑" x={330} y={700} k={up} c={OK} tc="#fff" size={46} />
      <Pill text="PUEDE BAJAR ↓" x={750} y={1330} k={dn} c="#D9534F" tc="#fff" size={46} />
      <Note text="El valor puede subir o bajar. No es una garantía." f={f} d={at(L(8).w0 + 9)} dark={dark} top={1440} />
    </AbsoluteFill>
  );
};

const Liq: React.FC<P> = ({f, at, dark}) => {
  const days = ['L', 'M', 'M', 'J', 'V'];
  const clock = sp(f, at(L(10).w0 + 3) - 4);
  const sweep = ease((f - at(L(10).w0 + 3)) / 24);
  return (
    <AbsoluteFill>
      <Head light="Compra y venta" bold="cualquier día hábil" f={f} dark={dark} size={80} />
      <div style={{position: 'absolute', left: 90, right: 90, top: 560, display: 'flex', justifyContent: 'space-between'}}>
        {days.map((d, i) => {
          const k = sp(f, at(L(9).w0 + 2) + i * 4, 10, 240);
          return (
            <div key={i} style={{width: 160, height: 200, borderRadius: 26, background: dark ? '#FFFFFF' : NAVY2, border: '2px solid rgba(4,30,66,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: dark ? NAVY : WARM}}>
              <div style={{fontSize: 56, fontWeight: 700}}>{d}</div>
              <div style={{width: 74, height: 74, borderRadius: 40, background: OK, color: '#fff', fontSize: 50, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${k})`}}>✓</div>
            </div>
          );
        })}
      </div>
      <Svg>
        <g transform={`translate(300 1030) scale(${clock})`}>
          <circle r={120} fill={dark ? NAVY : WARM} />
          <circle r={120} fill="none" stroke={OCRE} strokeWidth={14} strokeDasharray={`${754 * sweep} 754`} transform="rotate(-90)" />
          <line x1={0} y1={0} x2={0} y2={-80} stroke={dark ? WARM : NAVY} strokeWidth={10} strokeLinecap="round" transform={`rotate(${sweep * 720})`} />
        </g>
      </Svg>
      <div style={{position: 'absolute', left: 470, top: 940, fontFamily: FONT, color: dark ? NAVY : WARM, lineHeight: 1, transform: `scale(${clock})`, transformOrigin: 'left center'}}>
        <div style={{fontWeight: 700, fontSize: 150, color: OCRE}}>24 H</div>
        <div style={{fontWeight: 400, fontSize: 40}}>liquidación</div>
      </div>
      <Note text="Días hábiles, según la ficha del fondo." f={f} d={at(L(10).w0 + 2)} dark={dark} top={1240} />
    </AbsoluteFill>
  );
};

const Cta1: React.FC<P> = ({f}) => {
  const k = sp(f, 2, 10, 200);
  const rot = f * 0.8;
  const segs: [number, string][] = [[0.34, WARM], [0.24, 'rgba(245,243,238,0.45)'], [0.18, 'rgba(245,243,238,0.22)'], [0.24, OCRE]];
  let acc = 0;
  const C = 2 * Math.PI * 170;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 70, top: 280, fontFamily: FONT, color: WARM, fontSize: 82, lineHeight: 1.06, transform: `scale(${0.7 + 0.3 * k})`, transformOrigin: 'left top', opacity: cl(k * 2)}}>
        <div style={{fontWeight: 300}}>¿CUÁNTO DE TU INVERSIÓN ESTÁ EN</div>
        <div style={{fontWeight: 700}}>
          EMPRESAS <span style={{color: OCRE}}>MEXICANAS?</span>
        </div>
      </div>
      <Svg>
        <g transform={`translate(540 1130) rotate(${rot}) scale(${k})`}>
          {segs.map(([p, col], i) => {
            const el = (
              <circle key={i} r={170} fill="none" stroke={col} strokeWidth={80} strokeDasharray={`${C * p - 8} ${C}`} strokeDashoffset={-C * acc} transform="rotate(-90)" />
            );
            acc += p;
            return el;
          })}
        </g>
        <text x={540} y={1185} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={150} fill={OCRE} opacity={k}>?</text>
      </Svg>
    </AbsoluteFill>
  );
};

const LEGAL =
  'El contenido es únicamente informativo, no constituye recomendación, consejo o sugerencia personalizada de algún producto y/o servicio que le sugieran la toma de decisiones de inversión, para lo que se necesita previamente verificar la congruencia entre el perfil del cliente y el perfil del producto financiero. Rendimientos pasados no garantizan rendimientos futuros. El valor de las acciones de Fondos de Inversión conlleva un riesgo de mercado incluyendo una posible minusvalía del capital invertido. Los fondos de inversión no están garantizados por Grupo Financiero Actinver S.A. de C.V, o por alguna entidad integrante del Grupo Financiero Actinver, ni por ninguna entidad gubernamental, ni por el IPAB y pueden tener minusvalías del capital invertido. Todos los Fondos de Actinver cuentan con Prospecto de Información al Público Inversionista y Documentos con Información Clave, los cuales se encuentran a su disposición en www.actinver.com/fondos.';

const End: React.FC<P> = ({f, at}) => {
  const dm = sp(f, 2, 11, 200);
  const fol = sp(f, at(L(13).w0 + 1) - 4, 10, 200);
  const tap = f - at(L(13).w0 + 1) - 4;
  const pressed = tap > 0 && tap < 8;
  const legalAt = at(words.length - 1) + F(LAST.e - LAST.s + 0.5);
  const fade = ease((f - legalAt) / 10);
  const serie = sp(f, at(L(13).w0 + 6) - 4);
  return (
    <AbsoluteFill>
      <div style={{opacity: 1 - fade}}>
        <div style={{position: 'absolute', left: 120, top: 360, width: 700, padding: '34px 40px', borderRadius: '40px 40px 40px 8px', background: WARM, fontFamily: FONT, fontSize: 52, fontWeight: 600, color: NAVY, transform: `scale(${dm})`, transformOrigin: 'left bottom', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'}}>
          ✉️ Escríbeme y lo revisamos juntos
        </div>
        <div style={{position: 'absolute', left: 540, top: 820, transform: `translate(-50%,-50%) scale(${fol * (pressed ? 0.9 : 1)})`, background: pressed || tap >= 8 ? WARM : OCRE, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 64, padding: '26px 70px', borderRadius: 100, boxShadow: '0 16px 40px rgba(0,0,0,0.3)'}}>
          {tap >= 8 ? '✓ SIGUIENDO' : '+ SÍGUEME'}
        </div>
        {tap > -6 && tap < 14 && <div style={{position: 'absolute', left: 600 - Math.min(tap + 6, 6) * 6, top: 840 - Math.min(tap + 6, 6) * 4, fontSize: 90, transform: pressed ? 'scale(0.85)' : 'none'}}>👆</div>}
        <div style={{position: 'absolute', left: 120, right: 120, top: 1000, display: 'flex', gap: 18, justifyContent: 'center', transform: `scale(${serie})`}}>
          {['1 ACTIVAR', '2 MAYA', '3 ACTICRE', '4 ACTIED'].map((t, i) => (
            <div key={i} style={{background: i === 0 ? OCRE : 'rgba(245,243,238,0.12)', color: i === 0 ? NAVY : WARM, border: `2px solid ${OCRE}`, fontFamily: FONT, fontWeight: 700, fontSize: 30, padding: '16px 18px', borderRadius: 20}}>{t}</div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 1110, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 38, color: OCRE, opacity: serie}}>Serie renta variable local</div>
      </div>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 96, top: 420, width: 330, opacity: fade}} />
      <div style={{position: 'absolute', left: 96, right: 96, top: 560, fontFamily: FONT, fontSize: 64, color: WARM, opacity: fade, lineHeight: 1.1}}>
        <span style={{fontWeight: 300}}>FONDO </span>
        <span style={{fontWeight: 700, color: OCRE}}>ACTIVAR</span>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 90, fontFamily: FONT, fontSize: 21, lineHeight: 1.38, color: 'rgba(245,243,238,0.8)', opacity: fade}}>
        <div style={{fontWeight: 600, fontSize: 24, color: WARM, marginBottom: 10}}>Datos de actinver.com/activar al 31 de marzo de 2026. Renta variable: el valor puede subir o bajar. Rendimientos pasados no garantizan rendimientos futuros. Consulta términos y condiciones de los productos en actinver.com</div>
        {LEGAL}
      </div>
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC<P>> = {hook: Hook, indice: Indice, intro: Intro, pasivo: Pasivo, mapa: Mapa, plazo: Plazo, liq: Liq, cta1: Cta1, end: End};

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
    const brk = /[,.?!:…]$/.test(w.w) || cur.length >= 4 || len > 18 || !nx || nx.p !== w.p;
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

export const Activar: React.FC = () => {
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
      <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: W * cl(t / AV_TOTAL), background: OCRE}} />
      <Audio src={staticFile('activar/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

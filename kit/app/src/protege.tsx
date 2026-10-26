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
import data from '../public/protege/words.json';
import {FONT, FPS, W} from './theme';
import {F, cl, ease, sp} from './narrador';
import {NAVY, NAVY2, OCRE, WARM, GRAY, OK, THEMES, ThemeBg} from './banca';


type Word = {i: number; w: string; s: number; e: number; k: boolean; p: number};
const words = data.words as Word[];
const lines = data.lines as {p: number; s: number; e: number}[];
const LAST = words[words.length - 1];
export const PR_TOTAL = data.total;
const TW = (i: number) => words[i].s;
const L = (p: number) => ({w0: words.findIndex((w) => w.p === p)});

const SC = [
  {p: 0, k: 'hook', bg: 0},
  {p: 3, k: 'intro', bg: 1},
  {p: 5, k: 'etf', bg: 2},
  {p: 7, k: 'objetivo', bg: 2},
  {p: 8, k: 'liq', bg: 3},
  {p: 10, k: 'cta1', bg: 5},
  {p: 11, k: 'end', bg: 0},
];
const TD = 12;
const starts = SC.map((s, i) => (i === 0 ? 0 : F(lines[s.p].s - 0.14)));
const totalF = F(PR_TOTAL);
const TRANS = [
  iris({width: 1080, height: 1920}),
  wipe({direction: 'from-bottom-left'}),
  slide({direction: 'from-right'}),
  flip({direction: 'from-right'}),
  clockWipe({width: 1080, height: 1920}),
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
/* ---------- piezas ---------- */
const USD = '#7BC4A4';
const Block: React.FC<{t: string; c: string; coins: number; k: number}> = ({t, c, coins, k}) => (
  <g transform={`scale(${k})`}>
    <rect x={-170} y={-150} width={340} height={300} rx={34} fill={c} />
    <text textAnchor="middle" y={-80} fontFamily={FONT} fontWeight={700} fontSize={54} fill={NAVY}>{t}</text>
    {new Array(coins).fill(0).map((_, i) => (
      <g key={i} transform={`translate(${-90 + (i % 4) * 60} ${20 + Math.floor(i / 4) * 60})`}>
        <circle r={24} fill={OCRE} stroke="#8F8250" strokeWidth={4} />
      </g>
    ))}
  </g>
);

/* ---------- escenas ---------- */
const Hook: React.FC<P> = ({f, at, dark}) => {
  const mx = sp(f, at(7) - 6, 10, 200);
  const one = sp(f, at(L(1).w0 + 4) - 4, 9, 260);
  const out = ease((f - at(L(2).w0 + 4)) / 22);
  const us = sp(f, at(L(2).w0 + 4) - 2, 10, 200);
  return (
    <AbsoluteFill>
      <Head light="¿Tu inversión en deuda," bold="solo en México?" f={f} dark={dark} size={96} />
      <Svg>
        <g transform={`translate(${540 - 230 * out} 900)`}><Block t="MÉXICO" c={WARM} coins={8} k={mx} /></g>
        <g transform="translate(770 900)" opacity={out}><Block t="EE.UU." c={USD} coins={4} k={us} /></g>
        {out > 0.1 && <path d={`M${370} 1110 Q540 ${1220} ${710} 1110`} stroke={OCRE} strokeWidth={10} fill="none" strokeDasharray="18 14" opacity={out} />}
      </Svg>
      <Pill text="1 SOLO PAÍS" x={540} y={1180} k={one * (1 - out)} c="#D9534F" tc="#fff" size={50} />
      <Pill text="DIVERSIFICA HACIA AFUERA" x={540} y={1290} k={sp(f, at(L(2).w0 + 2) - 4)} size={46} />
      <Note text="Hablamos de tus inversiones en instrumentos de deuda, no de lo que debes." f={f} d={at(L(1).w0)} dark={dark} top={1370} />
    </AbsoluteFill>
  );
};

const Intro: React.FC<P> = ({f, at}) => {
  const a = sp(f, 4, 10, 220);
  const b = sp(f, 9, 10, 220);
  const line = ease((f - 14) / 16);
  const logo = sp(f, at(L(4).w0 + 3) - 4);
  const sub = sp(f, at(L(4).w0 + 9) - 4);
  return (
    <AbsoluteFill>
      <CameraMotionBlur shutterAngle={200} samples={5}>
        <AbsoluteFill>
          <div style={{position: 'absolute', left: 96, top: 480, fontFamily: FONT, color: WARM, lineHeight: 0.95}}>
            <div style={{fontWeight: 300, fontSize: 210, transform: `translateX(${(1 - a) * -900}px)`}}>PRO</div>
            <div style={{fontWeight: 700, fontSize: 210, color: OCRE, transform: `translateX(${(1 - b) * 1000}px)`}}>TEGE</div>
          </div>
        </AbsoluteFill>
      </CameraMotionBlur>
      <Svg>
        <path d="M100 960 H860" stroke={WARM} strokeWidth={6} strokeLinecap="round" {...(() => { const e = evolvePath(line, 'M100 960 H860'); return {strokeDasharray: e.strokeDasharray, strokeDashoffset: e.strokeDashoffset}; })()} />
      </Svg>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 100, top: 1000, width: 300, opacity: cl(logo * 1.5), transform: `scale(${0.8 + 0.2 * logo})`, transformOrigin: 'left center'}} />
      <Pill text="🇺🇸 DEUDA DEL GOBIERNO DE EE.UU." x={540} y={1180} k={sub} c={USD} size={44} />
      <Pill text="CORTO PLAZO" x={540} y={1290} k={sp(f, at(L(4).w0 + 13) - 4)} size={48} />
      <Sequence from={0} durationInFrames={40}>
        <AbsoluteFill style={{mixBlendMode: 'screen', opacity: 0.4}}>
          <LightLeak seed={13} hueShift={150} durationInFrames={40} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

const Etf: React.FC<P> = ({f, at, dark}) => {
  const box = sp(f, at(L(5).w0 + 8) - 6, 10, 220);
  const loop = (f - at(L(5).w0 + 11)) / 30;
  const fx = sp(f, at(L(6).w0 + 2) - 4, 9, 240);
  const c = dark ? NAVY : WARM;
  return (
    <AbsoluteFill>
      <Head light="De forma" bold="eficiente" f={f} dark={dark} size={110} />
      <Svg>
        <g transform={`translate(540 760) scale(${box})`}>
          {[-220, 0, 220].map((x, i) => (
            <g key={i} transform={`translate(${x} 0)`}>
              <rect x={-90} y={-70} width={180} height={140} rx={22} fill={NAVY2} stroke={USD} strokeWidth={5} />
              <text textAnchor="middle" y={16} fontFamily={FONT} fontWeight={700} fontSize={46} fill={WARM}>ETF</text>
            </g>
          ))}
          {loop > 0 && (
            <g opacity={cl(loop * 2)}>
              <path d="M-220 -90 Q0 -230 220 -90" stroke={OCRE} strokeWidth={8} fill="none" strokeDasharray="14 10" strokeDashoffset={-f * 3} />
              <text textAnchor="middle" y={-190} fontFamily={FONT} fontWeight={700} fontSize={36} fill={c}>los intereses se reinvierten ↻</text>
            </g>
          )}
        </g>
        <g transform={`translate(540 1110) scale(${fx})`}>
          <rect x={-300} y={-70} width={600} height={140} rx={30} fill={dark ? '#FFFFFF' : NAVY2} stroke={OCRE} strokeWidth={4} />
          <text textAnchor="middle" x={-60} y={16} fontFamily={FONT} fontWeight={700} fontSize={48} fill={c}>USD ⇄ MXN</text>
          <line x1={-250} y1={-40} x2={130} y2={40} stroke="#D9534F" strokeWidth={10} strokeLinecap="round" />
          <text textAnchor="middle" x={210} y={14} fontFamily={FONT} fontWeight={700} fontSize={30} fill="#2E7D4F">busca eliminar</text>
        </g>
      </Svg>
      <Note text="ETF: fondo que cotiza en bolsa. Según la ficha, PROTEGE usa ETFs UCITS de acumulación." f={f} d={at(L(5).w0 + 9)} dark={dark} top={1240} />
      <Note text="Busca eliminar la exposición cambiaria; consulta el prospecto del fondo." f={f} d={at(L(6).w0 + 5)} dark={dark} top={1320} />
    </AbsoluteFill>
  );
};

const Objetivo: React.FC<P> = ({f, at, dark}) => {
  const d = ease((f - at(L(7).w0 + 3)) / 50);
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    if (i / 40 > d) break;
    pts.push(`${i * 20},${-i * 7 - Math.sin(i / 1.6) * 16}`);
  }
  return (
    <AbsoluteFill>
      <Head light="Su objetivo:" bold="crecer a largo plazo" f={f} dark={dark} size={86} />
      <Svg>
        <g transform="translate(140 1150)">
          <line x1={0} y1={0} x2={820} y2={0} stroke={dark ? 'rgba(4,30,66,0.25)' : 'rgba(245,243,238,0.3)'} strokeWidth={4} />
          <polyline points={pts.join(' ')} fill="none" stroke={USD} strokeWidth={14} strokeLinejoin="round" strokeLinecap="round" />
          {['Año 1', 'Año 3', 'Año 5+'].map((t, i) => <text key={i} x={i * 380} y={60} fontFamily={FONT} fontWeight={600} fontSize={34} fill={dark ? NAVY : WARM} opacity={d}>{t}</text>)}
        </g>
      </Svg>
      <Note text="Ilustrativo. Los rendimientos no están garantizados y el valor puede variar." f={f} d={at(L(7).w0 + 5)} dark={dark} top={1280} />
    </AbsoluteFill>
  );
};

const Liq: React.FC<P> = ({f, at, dark}) => {
  const days = ['L', 'M', 'M', 'J', 'V'];
  const clock = sp(f, at(L(9).w0 + 3) - 4);
  const sweep = ease((f - at(L(9).w0 + 3)) / 24);
  return (
    <AbsoluteFill>
      <Head light="Compra y venta" bold="cualquier día hábil" f={f} dark={dark} size={80} />
      <div style={{position: 'absolute', left: 90, right: 90, top: 560, display: 'flex', justifyContent: 'space-between'}}>
        {days.map((d, i) => {
          const k = sp(f, at(L(8).w0 + 2) + i * 4, 10, 240);
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
      <Note text="Días hábiles, según el prospecto del fondo." f={f} d={at(L(9).w0 + 2)} dark={dark} top={1240} />
    </AbsoluteFill>
  );
};


const Cta1: React.FC<P> = ({f}) => {
  const k = sp(f, 2, 10, 200);
  const sw = 0.5 + 0.5 * Math.sin(f / 10);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 70, top: 300, fontFamily: FONT, color: WARM, fontSize: 92, lineHeight: 1.05, transform: `scale(${0.7 + 0.3 * k})`, transformOrigin: 'left top', opacity: cl(k * 2)}}>
        <div style={{fontWeight: 300}}>¿QUÉ PARTE PODRÍAS</div>
        <div style={{fontWeight: 700}}>
          DIVERSIFICAR HACIA <span style={{color: OCRE}}>EE.UU.?</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 140, right: 140, top: 900, height: 120, borderRadius: 60, background: 'rgba(245,243,238,0.15)', overflow: 'hidden', transform: `scale(${k})`}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(1 - 0.35 * sw) * 100}%`, background: WARM}} />
        <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: `${0.35 * sw * 100}%`, background: USD}} />
      </div>
      <div style={{position: 'absolute', left: 140, right: 140, top: 1040, display: 'flex', justifyContent: 'space-between', fontFamily: FONT, fontWeight: 700, fontSize: 40, color: WARM, opacity: k}}>
        <span>MÉXICO</span>
        <span style={{color: USD}}>EE.UU.</span>
      </div>
    </AbsoluteFill>
  );
};

const LEGAL =
  'El contenido es únicamente informativo, no constituye recomendación, consejo o sugerencia personalizada de algún producto y/o servicio que le sugieran la toma de decisiones de inversión, para lo que se necesita previamente verificar la congruencia entre el perfil del cliente y el perfil del producto financiero. Rendimientos pasados no garantizan rendimientos futuros. El valor de las acciones de Fondos de Inversión conlleva un riesgo de mercado incluyendo una posible minusvalía del capital invertido. Los fondos de inversión no están garantizados por Grupo Financiero Actinver S.A. de C.V, o por alguna entidad integrante del Grupo Financiero Actinver, ni por ninguna entidad gubernamental, ni por el IPAB y pueden tener minusvalías del capital invertido. Todos los Fondos de Actinver cuentan con Prospecto de Información al Público Inversionista y Documentos con Información Clave, los cuales se encuentran a su disposición en www.actinver.com/fondos.';

const End: React.FC<P> = ({f, at}) => {
  const dm = sp(f, 2, 11, 200);
  const fol = sp(f, at(L(12).w0 + 1) - 4, 10, 200);
  const tap = f - at(L(12).w0 + 1) - 4;
  const pressed = tap > 0 && tap < 8;
  const legalAt = at(words.length - 1) + F(LAST.e - LAST.s + 0.5);
  const fade = ease((f - legalAt) / 10);
  const serie = sp(f, at(L(12).w0 + 6) - 4);
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
          {['1 ACTICOB', '2 PROTEGE', '3 ACTDUAL'].map((t, i) => (
            <div key={i} style={{background: i === 1 ? USD : 'rgba(245,243,238,0.12)', color: i === 1 ? NAVY : WARM, border: `2px solid ${USD}`, fontFamily: FONT, fontWeight: 700, fontSize: 34, padding: '16px 22px', borderRadius: 20}}>{t}</div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 1110, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 38, color: USD, opacity: serie}}>Serie del dólar</div>
      </div>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 96, top: 420, width: 330, opacity: fade}} />
      <div style={{position: 'absolute', left: 96, right: 96, top: 560, fontFamily: FONT, fontSize: 64, color: WARM, opacity: fade, lineHeight: 1.1}}>
        <span style={{fontWeight: 300}}>FONDO </span>
        <span style={{fontWeight: 700, color: OCRE}}>PROTEGE</span>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 90, fontFamily: FONT, fontSize: 21, lineHeight: 1.38, color: 'rgba(245,243,238,0.8)', opacity: fade}}>
        <div style={{fontWeight: 600, fontSize: 24, color: WARM, marginBottom: 10}}>Datos de actinver.com/protege al 31 de marzo de 2026. Rendimientos pasados no garantizan rendimientos futuros. Consulta términos y condiciones de los productos en actinver.com</div>
        {LEGAL}
      </div>
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC<P>> = {hook: Hook, intro: Intro, etf: Etf, objetivo: Objetivo, liq: Liq, cta1: Cta1, end: End};

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

export const Protege: React.FC = () => {
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
      <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: W * cl(t / PR_TOTAL), background: OCRE}} />
      <Audio src={staticFile('protege/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

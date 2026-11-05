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
import data from '../public/actieur/words.json';
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
  {w: 0, k: 'dolar', bg: 0},
  {w: 10, k: 'euro', bg: 0},
  {w: 16, k: 'intro', bg: 1},
  {w: 24, k: 'mapa', bg: 2},
  {w: 33, k: 'liq', bg: 3},
  {w: 49, k: 'pastel', bg: 3},
  {w: 60, k: 'riesgo', bg: 4},
  {w: 75, k: 'cta1', bg: 5},
  {w: 83, k: 'end', bg: 5},
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


/* ---------- escenas ---------- */
const Coin: React.FC<{x: number; y: number; r: number; t: string; k: number; c?: string; tc?: string; fs?: number; o?: number}> = ({x, y, r, t, k, c = OCRE, tc = NAVY, fs, o = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${k})`} opacity={o}>
    <circle r={r} fill={c} />
    <circle r={r - 14} fill="none" stroke="rgba(4,30,66,0.25)" strokeWidth={4} />
    <text textAnchor="middle" y={(fs ?? r) * 0.36} fontFamily={FONT} fontWeight={700} fontSize={fs ?? r} fill={tc}>{t}</text>
  </g>
);

const Dolar: React.FC<P> = ({f, at, dark}) => {
  const k = sp(f, 8, 12, 200);
  const away = ease((f - at(9) - 4) / 14);
  const q = sp(f, at(9) + 12, 10, 220);
  return (
    <AbsoluteFill>
      <Head light="¿Solo piensas" bold="en el dólar?" f={f} dark={dark} size={100} />
      <Svg>
        <Coin x={540 - away * 250} y={1020} r={230 - away * 100} t="$" k={k} fs={300 - away * 130} o={1 - away * 0.35} />
        <g transform={`translate(790 1020) scale(${q})`}>
          <circle r={130} fill="none" stroke={WARM} strokeWidth={10} strokeDasharray="22 18" />
          <text textAnchor="middle" y={44} fontFamily={FONT} fontWeight={700} fontSize={130} fill={WARM}>?</text>
        </g>
      </Svg>
      <Pill text="OTRA MONEDA" x={540} y={1400} k={sp(f, at(4))} c={WARM} tc={NAVY} size={54} />
    </AbsoluteFill>
  );
};

const Euro: React.FC<P> = ({f, at, dark}) => {
  const small = [
    {x: 200, y: 760, t: '£', w: 12},
    {x: 880, y: 800, t: '¥', w: 12},
    {x: 170, y: 1320, t: 'Fr', w: 13},
    {x: 900, y: 1300, t: 'kr', w: 13},
  ];
  const big = sp(f, at(15) - 6, 12, 190);
  return (
    <AbsoluteFill>
      <Head light="Existen otras" bold="divisas" f={f} dark={dark} size={104} />
      <Svg>
        {small.map((c, i) => (
          <Coin key={i} x={c.x} y={c.y + 10 * Math.sin(f / 8 + i)} r={90} t={c.t} k={sp(f, at(c.w) - 6 + i * 2, 11, 200)} c={WARM} fs={84} />
        ))}
        <Coin x={540} y={1040} r={250} t="€" k={big * (1 + 0.03 * Math.sin(f / 6))} fs={330} />
      </Svg>
      <Pill text="COMO EL EURO" x={540} y={1470} k={sp(f, at(13))} c={NAVY2} tc={WARM} size={50} />
    </AbsoluteFill>
  );
};

const Intro: React.FC<P> = ({f, at}) => {
  const a = sp(f, 4, 10, 220);
  const b = sp(f, 9, 10, 220);
  const line = ease((f - 14) / 16);
  const logo = sp(f, at(23));
  const e = evolvePath(line, 'M100 980 H860');
  return (
    <AbsoluteFill>
      <CameraMotionBlur shutterAngle={200} samples={5}>
        <AbsoluteFill>
          <div style={{position: 'absolute', left: 96, top: 480, fontFamily: FONT, color: WARM, lineHeight: 0.95}}>
            <div style={{fontWeight: 300, fontSize: 230, transform: `translateX(${(1 - a) * -900}px)`}}>ACTI</div>
            <div style={{fontWeight: 700, fontSize: 250, color: OCRE, transform: `translateX(${(1 - b) * 1000}px)`}}>EUR</div>
          </div>
        </AbsoluteFill>
      </CameraMotionBlur>
      <Svg>
        <path d="M100 980 H860" stroke={WARM} strokeWidth={6} strokeLinecap="round" strokeDasharray={e.strokeDasharray} strokeDashoffset={e.strokeDashoffset} />
      </Svg>
      <div style={{position: 'absolute', left: 100, top: 1020, fontFamily: FONT, fontSize: 50, color: WARM, opacity: ease((f - at(19)) / 10)}}>Fondo de inversión</div>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 100, top: 1110, width: 300, opacity: cl(logo * 1.5), transform: `scale(${0.8 + 0.2 * logo})`, transformOrigin: 'left center'}} />
      <Pill text="FONDO DE DEUDA" x={330} y={1330} k={sp(f, at(21))} size={54} />
      <Sequence from={0} durationInFrames={40}>
        <AbsoluteFill style={{mixBlendMode: 'screen', opacity: 0.4}}>
          <LightLeak seed={11} hueShift={30} durationInFrames={40} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

const starPath = (cx: number, cy: number, R: number, r: number) =>
  new Array(10).fill(0).map((_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r : R;
    return `${i ? 'L' : 'M'}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`;
  }).join(' ') + 'Z';

const Mapa: React.FC<P> = ({f, at, dark}) => {
  const n = 12;
  return (
    <AbsoluteFill>
      <Head light="Deuda" bold="europea" f={f} dark={dark} size={120} />
      <Svg>
        {new Array(n).fill(0).map((_, i) => {
          const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
          const k = sp(f, at(26) - 8 + i * 2, 10, 220);
          return (
            <g key={i} transform={`translate(${540 + 340 * Math.cos(a)} ${1010 + 340 * Math.sin(a)}) scale(${k})`}>
              <path d={starPath(0, 0, 54, 22)} fill={OCRE} />
            </g>
          );
        })}
        <Coin x={540} y={1010} r={210} t="€" k={sp(f, at(27) - 4, 12, 200)} c={WARM} fs={280} />
      </Svg>
      <Pill text="DIVISAS DISTINTAS AL DÓLAR" x={540} y={1450} k={sp(f, at(29))} c={NAVY2} tc={WARM} size={40} />
      <Note text="Ilustración, no representa las inversiones del fondo." f={f} d={at(29)} dark={dark} top={1500} />
    </AbsoluteFill>
  );
};

const Liq: React.FC<P> = ({f, at, dark}) => {
  const days = ['L', 'M', 'M', 'J', 'V'];
  const stamp = sp(f, at(47) - 4, 9, 220);
  const hand = ease((f - at(47)) / 24) * 360;
  return (
    <AbsoluteFill>
      <Head light="Corto" bold="plazo" f={f} dark={dark} size={118} />
      <div style={{position: 'absolute', left: 60, right: 60, top: 540, display: 'flex', justifyContent: 'space-between'}}>
        {days.map((d, i) => {
          const k = sp(f, at(41) + i * 4, 10, 240);
          return (
            <div key={i} style={{width: 170, height: 200, borderRadius: 26, background: WARM, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: NAVY, boxShadow: '0 14px 30px rgba(0,0,0,0.25)'}}>
              <div style={{fontSize: 58, fontWeight: 700}}>{d}</div>
              <div style={{width: 76, height: 76, borderRadius: 38, background: OK, color: '#fff', fontSize: 50, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${k})`}}>✓</div>
            </div>
          );
        })}
      </div>
      <Svg>
        <g transform={`translate(540 1020) scale(${sp(f, at(46) - 4, 12, 200)})`}>
          <circle r={150} fill={WARM} stroke={OCRE} strokeWidth={14} />
          {new Array(12).fill(0).map((_, i) => <rect key={i} x={-4} y={-136} width={8} height={i % 3 === 0 ? 28 : 14} fill={NAVY} transform={`rotate(${i * 30})`} />)}
          <rect x={-5} y={-110} width={10} height={110} rx={5} fill={NAVY} transform={`rotate(${hand})`} />
          <circle r={12} fill={OCRE} />
        </g>
        <g transform={`translate(540 1330) rotate(-4) scale(${stamp})`}>
          <rect x={-330} y={-90} width={660} height={180} rx={32} fill="none" stroke={OCRE} strokeWidth={12} />
          <text textAnchor="middle" y={28} fontFamily={FONT} fontWeight={700} fontSize={100} fill={OCRE}>48 HORAS</text>
        </g>
      </Svg>
      <Note text="Liquidación en 48 horas. Compras y ventas en días hábiles." f={f} d={at(47)} dark={dark} top={1450} />
    </AbsoluteFill>
  );
};

const slicePath = (a0: number, a1: number, R: number) => {
  const p = (a: number) => `${(R * Math.cos(a)).toFixed(1)} ${(R * Math.sin(a)).toFixed(1)}`;
  return `M0 0 L${p(a0)} A${R} ${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1)}Z`;
};
const Pastel: React.FC<P> = ({f, at, dark}) => {
  const sl = [
    {t: 'MXN', v: 0.5, w: 53, c: WARM, tc: NAVY},
    {t: 'EUR', v: 0.2, w: 55, c: OCRE, tc: NAVY},
    {t: 'USD', v: 0.3, w: 59, c: NAVY2, tc: WARM},
  ];
  let acc = -Math.PI / 2;
  return (
    <AbsoluteFill>
      <Head light="Diversifica" bold="tus divisas" f={f} dark={dark} size={104} />
      <Svg>
        <g transform="translate(540 1040)">
          {sl.map((s, i) => {
            const a0 = acc;
            const a1 = acc + s.v * 2 * Math.PI;
            acc = a1;
            const k = sp(f, at(s.w) - 5, 11, 200);
            const mid = (a0 + a1) / 2;
            return (
              <g key={i} transform={`translate(${Math.cos(mid) * 14 * k} ${Math.sin(mid) * 14 * k}) scale(${k})`}>
                <path d={slicePath(a0, a1, 300)} fill={s.c} stroke={NAVY} strokeWidth={6} />
                <text x={Math.cos(mid) * 185} y={Math.sin(mid) * 185 + 20} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={58} fill={s.tc}>{s.t}</text>
              </g>
            );
          })}
        </g>
      </Svg>
      <Note text="Ilustrativo: porcentajes no reales." f={f} d={at(55)} dark={dark} top={1470} />
    </AbsoluteFill>
  );
};

const Riesgo: React.FC<P> = ({f, at, dark}) => {
  const up = ease((f - at(68)) / 14);
  const down = ease((f - at(70)) / 14);
  const stamp = sp(f, at(72) - 3, 9, 240);
  const path = 'M120 1000 L360 800 L560 900 L760 700';
  const path2 = 'M760 700 L900 940';
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
      <Pill text="FONDO DE DEUDA" x={540} y={1450} k={sp(f, at(64))} c={NAVY2} tc={WARM} size={44} />
      <Note text="Ilustración, no representa datos reales." f={f} d={at(64)} dark={dark} top={1510} />
    </AbsoluteFill>
  );
};

const Cta1: React.FC<P> = ({f, at}) => {
  const k = sp(f, 2, 10, 200);
  const q = sp(f, at(80), 10, 220);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 70, top: 300, fontFamily: FONT, color: WARM, fontSize: 104, lineHeight: 1.05, transform: `scale(${0.7 + 0.3 * k})`, transformOrigin: 'left top', opacity: cl(k * 2)}}>
        <div style={{fontWeight: 300}}>¿SOLO PESOS</div>
        <div style={{fontWeight: 700}}>Y <span style={{color: OCRE}}>DÓLARES?</span></div>
      </div>
      <Svg>
        <Coin x={270} y={1080} r={130} t="MXN" k={sp(f, at(80) - 8, 10, 220)} c={WARM} fs={68} />
        <Coin x={540} y={1080} r={130} t="USD" k={sp(f, at(80) - 4, 10, 220)} c={WARM} fs={68} />
        <Coin x={810} y={1080} r={130} t="?" k={q * (1 + 0.04 * Math.sin(f / 5))} fs={190} />
      </Svg>
    </AbsoluteFill>
  );
};

const LEGAL =
  'El contenido es únicamente informativo, no constituye recomendación, consejo o sugerencia personalizada de algún producto y/o servicio que le sugieran la toma de decisiones de inversión, para lo que se necesita previamente verificar la congruencia entre el perfil del cliente y el perfil del producto financiero. Rendimientos pasados no garantizan rendimientos futuros. El valor de las acciones de Fondos de Inversión conlleva un riesgo de mercado incluyendo una posible minusvalía del capital invertido. Los fondos de inversión no están garantizados por Grupo Financiero Actinver S.A. de C.V, o por alguna entidad integrante del Grupo Financiero Actinver, ni por ninguna entidad gubernamental, ni por el IPAB y pueden tener minusvalías del capital invertido. Todos los Fondos de Actinver cuentan con Prospecto de Información al Público Inversionista y Documentos con Información Clave, los cuales se encuentran a su disposición en www.actinver.com/fondos.';

const End: React.FC<P> = ({f, at}) => {
  const dm = sp(f, 2, 11, 200);
  const send = ease((f - at(83)) / 10);
  const card = sp(f, at(84) - 4, 11, 220);
  const fol = sp(f, at(85), 10, 200);
  const tap = f - at(88) - 4;
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
          <div style={{fontWeight: 700, fontSize: 84}}>ACTIEUR</div>
          <div style={{fontWeight: 400, fontSize: 40, marginTop: 6}}>Fondo de deuda</div>
          <div style={{fontWeight: 400, fontSize: 40}}>Invierte en deuda europea</div>
        </div>
        <div style={{position: 'absolute', left: 540, top: 1190, transform: `translate(-50%,-50%) scale(${fol * (pressed ? 0.9 : 1)})`, background: pressed || tap >= 8 ? WARM : OCRE, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 64, padding: '26px 70px', borderRadius: 100, boxShadow: '0 16px 40px rgba(0,0,0,0.3)'}}>
          {tap >= 8 ? '✓ SIGUIENDO' : '+ SÍGUEME'}
        </div>
        {tap > -6 && tap < 14 && <div style={{position: 'absolute', left: 600 - Math.min(tap + 6, 6) * 6, top: 1210 - Math.min(tap + 6, 6) * 4, fontSize: 90, transform: pressed ? 'scale(0.85)' : 'none'}}>👆</div>}
      </div>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 96, top: 420, width: 330, opacity: fade}} />
      <div style={{position: 'absolute', left: 96, right: 96, top: 560, fontFamily: FONT, fontSize: 64, color: WARM, opacity: fade, lineHeight: 1.1}}>
        <span style={{fontWeight: 300}}>FONDO </span>
        <span style={{fontWeight: 700, color: OCRE}}>ACTIEUR</span>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 90, fontFamily: FONT, fontSize: 21, lineHeight: 1.38, color: 'rgba(245,243,238,0.8)', opacity: fade}}>
        <div style={{fontWeight: 600, fontSize: 24, color: WARM, marginBottom: 10}}>Datos de actinver.com/actieur al 31 de marzo de 2026. Rendimientos pasados no garantizan rendimientos futuros. Consulta términos y condiciones de los productos en actinver.com</div>
        {LEGAL}
      </div>
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC<P>> = {dolar: Dolar, euro: Euro, intro: Intro, mapa: Mapa, liq: Liq, pastel: Pastel, riesgo: Riesgo, cta1: Cta1, end: End};

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

export const Actieur: React.FC = () => {
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
      <Audio src={staticFile('actieur/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

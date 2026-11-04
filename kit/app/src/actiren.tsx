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
import data from '../public/actiren/words.json';
import {FONT, FPS, W} from './theme';
import {F, cl, ease, sp} from './narrador';
import {NAVY, NAVY2, OCRE, WARM, GRAY, OK, THEMES, ThemeBg} from './banca';

type Word = {i: number; w: string; s: number; e: number; k: boolean};
const words = data.words as Word[];
const LAST = words[words.length - 1];
export const AR2_TOTAL = Math.round((LAST.e + 4.6) * 100) / 100; // voz + pantalla legal
const TW = (i: number) => words[i].s;

/* escenas: palabra inicial, componente, fondo (cambia cada 2–3 escenas) */
const SC = [
  {w: 0, k: 'cal', bg: 0},
  {w: 7, k: 'zzz', bg: 0},
  {w: 14, k: 'intro', bg: 1},
  {w: 25, k: 'deuda', bg: 1},
  {w: 33, k: 'sem', bg: 2},
  {w: 51, k: 'rating', bg: 3},
  {w: 58, k: 'liq', bg: 3},
  {w: 68, k: 'riesgo', bg: 4},
  {w: 83, k: 'cta1', bg: 5},
  {w: 94, k: 'end', bg: 5},
];
const TD = 12;
const starts = SC.map((s, i) => (i === 0 ? 0 : F(TW(s.w) - 0.14)));
const totalF = F(AR2_TOTAL);

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
const Cal: React.FC<P> = ({f, at, dark}) => {
  const k = sp(f, 3, 12, 160);
  const items = [
    {t: 'Colegiatura', w: 3, ic: '🎓'},
    {t: 'Renta', w: 4, ic: '🏠'},
    {t: 'Viaje', w: 6, ic: '✈️'},
  ];
  return (
    <AbsoluteFill>
      <Head light="Dinero para" bold="pronto" f={f} dark={dark} size={110} />
      <Svg>
        <g transform={`translate(540 760) scale(${k})`}>
          <rect x={-290} y={-170} width={580} height={440} rx={40} fill={WARM} />
          <rect x={-290} y={-170} width={580} height={110} rx={40} fill={OCRE} />
          <rect x={-290} y={-100} width={580} height={40} fill={OCRE} />
          {[-160, 160].map((x) => <rect key={x} x={x - 14} y={-210} width={28} height={80} rx={14} fill={GRAY} />)}
          {new Array(15).fill(0).map((_, i) => <rect key={i} x={-250 + (i % 5) * 104} y={-30 + Math.floor(i / 5) * 90} width={72} height={60} rx={12} fill="rgba(4,30,66,0.1)" />)}
        </g>
      </Svg>
      {items.map((it, i) => {
        const s = sp(f, at(it.w) - 5, 11, 220);
        return (
          <div key={i} style={{position: 'absolute', left: 150 + (i % 2) * 130, top: 1130 + i * 150, padding: '16px 44px', borderRadius: 100, background: i === 1 ? OCRE : WARM, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 54, transform: `translateX(${(1 - s) * 1000}px) rotate(${[-2, 2, -1][i]}deg)`, boxShadow: '0 16px 40px rgba(0,0,0,0.3)'}}>
            {it.ic} {it.t}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Zzz: React.FC<P> = ({f, at, dark}) => {
  const k = sp(f, 3, 12, 160);
  const z = (i: number) => sp(f, at(10) + i * 6, 12, 200);
  return (
    <AbsoluteFill>
      <Head light="No lo dejes" bold="dormido" f={f} dark={dark} size={110} />
      <Svg>
        <g transform={`translate(540 960) scale(${k})`}>
          <rect x={-330} y={-190} width={660} height={380} rx={44} fill={WARM} />
          <rect x={-330} y={-190} width={660} height={90} rx={44} fill={NAVY} />
          <rect x={-330} y={-150} width={660} height={50} fill={NAVY} />
          <text x={-290} y={-125} fontFamily={FONT} fontWeight={600} fontSize={40} fill={WARM}>MI CUENTA</text>
          <rect x={-290} y={-40} width={420} height={36} rx={18} fill="rgba(4,30,66,0.15)" />
          <rect x={-290} y={30} width={300} height={36} rx={18} fill="rgba(4,30,66,0.15)" />
          <g transform="translate(180 80)"><Bill s={0.34} /></g>
        </g>
        {[0, 1, 2].map((i) => (
          <text key={i} x={520 + i * 110 + (1 - z(i)) * -40} y={800 - i * 80 - (1 - z(i)) * -40} fontFamily={FONT} fontWeight={700} fontSize={90 + i * 30} fill={OCRE} opacity={cl(z(i)) * (0.7 + 0.3 * Math.sin(f / 6 + i))}>z</text>
        ))}
      </Svg>
      <Pill text="PARADO = SIN TRABAJAR" x={540} y={1330} k={sp(f, at(12))} c={NAVY} tc={WARM} size={46} />
    </AbsoluteFill>
  );
};

const Intro: React.FC<P> = ({f, at}) => {
  const a = sp(f, 4, 10, 220);
  const b = sp(f, 9, 10, 220);
  const line = ease((f - 14) / 16);
  const logo = sp(f, at(21));
  const sub = sp(f, at(23));
  return (
    <AbsoluteFill>
      <CameraMotionBlur shutterAngle={200} samples={5}>
        <AbsoluteFill>
          <div style={{position: 'absolute', left: 96, top: 480, fontFamily: FONT, color: WARM, lineHeight: 0.95}}>
            <div style={{fontWeight: 300, fontSize: 230, transform: `translateX(${(1 - a) * -900}px)`}}>ACTI</div>
            <div style={{fontWeight: 700, fontSize: 250, color: OCRE, transform: `translateX(${(1 - b) * 1000}px)`}}>REN</div>
          </div>
        </AbsoluteFill>
      </CameraMotionBlur>
      <Svg>
        <path d="M100 980 H860" stroke={WARM} strokeWidth={6} strokeLinecap="round" {...(() => { const e = evolvePath(line, 'M100 980 H860'); return {strokeDasharray: e.strokeDasharray, strokeDashoffset: e.strokeDashoffset}; })()} />
      </Svg>
      <div style={{position: 'absolute', left: 100, top: 1020, fontFamily: FONT, fontSize: 50, color: WARM, opacity: ease((f - at(19)) / 10)}}>Fondo de inversión de deuda</div>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 100, top: 1110, width: 300, opacity: cl(logo * 1.5), transform: `scale(${0.8 + 0.2 * logo})`, transformOrigin: 'left center'}} />
      <Pill text="CORTO PLAZO" x={330} y={1290} k={sub} size={58} />
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
    {t: 'Gobierno', w: 29, y: 560, ic: '🏛️'},
    {t: 'Empresas', w: 32, y: 790, ic: '🏢'},
  ];
  const plus = sp(f, at(30), 10, 260);
  return (
    <AbsoluteFill>
      <Head light="Invierte en" bold="deuda" f={f} dark={dark} size={110} top={250} />
      {cards.map((c, i) => {
        const k = sp(f, at(c.w) - 5, 11, 220);
        return (
          <div key={i} style={{position: 'absolute', left: 120, top: c.y, width: 840, height: 170, borderRadius: 30, background: i ? OCRE : WARM, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 68, display: 'flex', alignItems: 'center', gap: 30, padding: '0 44px', boxSizing: 'border-box', transform: `translateX(${(1 - k) * (i ? 1100 : -1100)}px)`, boxShadow: '0 20px 50px rgba(0,0,0,0.35)'}}>
            <span style={{fontSize: 76}}>{c.ic}</span>
            {c.t}
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 540, top: 745, transform: `translate(-50%,-50%) scale(${plus})`, width: 80, height: 80, borderRadius: 40, background: NAVY, color: WARM, fontFamily: FONT, fontWeight: 700, fontSize: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2}}>+</div>
      <Pill text="DEUDA DE CORTO PLAZO" x={540} y={1200} k={sp(f, at(27) + 2)} c={WARM} tc={NAVY} size={52} />
    </AbsoluteFill>
  );
};

const Sem: React.FC<P> = ({f, at, dark}) => {
  const days = ['L', 'M', 'M', 'J', 'V'];
  const stamp = sp(f, at(49) - 4, 9, 220);
  return (
    <AbsoluteFill>
      <Head light="Disponible" bold="a diario" f={f} dark={dark} size={110} />
      <div style={{position: 'absolute', left: 60, right: 60, top: 560, display: 'flex', justifyContent: 'space-between'}}>
        {days.map((d, i) => {
          const k = sp(f, at(39) + i * 4, 10, 240);
          return (
            <div key={i} style={{width: 170, height: 220, borderRadius: 26, background: WARM, border: '2px solid rgba(4,30,66,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: NAVY, boxShadow: '0 14px 30px rgba(4,30,66,0.12)'}}>
              <div style={{fontSize: 60, fontWeight: 700}}>{d}</div>
              <div style={{width: 80, height: 80, borderRadius: 40, background: OK, color: '#fff', fontSize: 54, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${k})`}}>✓</div>
            </div>
          );
        })}
      </div>
      <Svg>
        <g transform={`translate(540 1080) rotate(-5) scale(${stamp})`}>
          <rect x={-330} y={-100} width={660} height={200} rx={32} fill="none" stroke="#D9534F" strokeWidth={14} />
          <text textAnchor="middle" y={26} fontFamily={FONT} fontWeight={700} fontSize={110} fill="#D9534F">MISMO DÍA</text>
        </g>
      </Svg>
      <Note text="Días hábiles. Horario del fondo: 8:00 a 13:45 h (centro de México)." f={f} d={at(49)} dark={dark} top={1290} />
    </AbsoluteFill>
  );
};

const Rating: React.FC<P> = ({f, at, dark}) => {
  const st = sp(f, at(53) - 3, 9, 260);
  const hit = at(53) - 3;
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
          <text textAnchor="middle" y={30} fontFamily={FONT} fontWeight={700} fontSize={110} fill={WARM}>AAA/2</text>
          <text textAnchor="middle" y={100} fontFamily={FONT} fontSize={42} fill={OCRE}>HR Ratings</text>
        </g>
      </Svg>
      <Note text="Calificación según actinver.com, marzo 2026." f={f} d={at(55)} dark={dark} top={1240} />
    </AbsoluteFill>
  );
};

const Liq: React.FC<P> = ({f, at, dark}) => {
  const drop = sp(f, at(64) - 4, 12, 200);
  const wave = Math.sin(f / 8) * 8;
  return (
    <AbsoluteFill>
      <Head light="Necesidades de" bold="liquidez" f={f} dark={dark} size={96} />
      <Svg>
        <g transform={`translate(540 ${900 + wave}) scale(${drop})`}>
          <path d="M0 -240 C120 -90 190 -10 190 80 A190 190 0 0 1 -190 80 C-190 -10 -120 -90 0 -240Z" fill={OCRE} />
          <path d="M-90 40 C-80 110 -40 140 20 150" stroke="rgba(255,255,255,0.55)" strokeWidth={14} fill="none" strokeLinecap="round" />
        </g>
      </Svg>
      <Pill text="LIQUIDEZ" x={540} y={1300} k={sp(f, at(64))} c={WARM} tc={NAVY} size={64} />
      <Pill text="CORTO PLAZO" x={540} y={1440} k={sp(f, at(66))} c={NAVY2} tc={WARM} size={46} />
    </AbsoluteFill>
  );
};

const Riesgo: React.FC<P> = ({f, at, dark}) => {
  const up = ease((f - at(76)) / 14);
  const down = ease((f - at(78)) / 14);
  const stamp = sp(f, at(80) - 3, 9, 240);
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
    </AbsoluteFill>
  );
};

const Cta1: React.FC<P> = ({f, at}) => {
  const k = sp(f, 2, 10, 200);
  const hand = sp(f, at(93) - 4, 10, 220);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 70, top: 300, fontFamily: FONT, color: WARM, fontSize: 100, lineHeight: 1.05, transform: `scale(${0.7 + 0.3 * k})`, transformOrigin: 'left top', opacity: cl(k * 2)}}>
        <div style={{fontWeight: 300}}>¿CUÁNTO NECESITAS</div>
        <div style={{fontWeight: 700}}>
          TENER <span style={{color: OCRE}}>A LA MANO?</span>
        </div>
      </div>
      <Svg>
        <g transform={`translate(540 1060) scale(${k})`}>
          <rect x={-210} y={-130} width={420} height={260} rx={36} fill={WARM} />
          <rect x={-210} y={-130} width={420} height={80} rx={36} fill={OCRE} />
          <rect x={-210} y={-90} width={420} height={40} fill={OCRE} />
          <circle cx={130} cy={20} r={30} fill={NAVY} />
          <g transform={`translate(0 ${(1 - hand) * -260}) scale(${hand})`} opacity={cl(hand * 2)}><Bill s={0.3} /></g>
        </g>
      </Svg>
    </AbsoluteFill>
  );
};
const LEGAL =
  'El contenido es únicamente informativo, no constituye recomendación, consejo o sugerencia personalizada de algún producto y/o servicio que le sugieran la toma de decisiones de inversión, para lo que se necesita previamente verificar la congruencia entre el perfil del cliente y el perfil del producto financiero. Rendimientos pasados no garantizan rendimientos futuros. El valor de las acciones de Fondos de Inversión conlleva un riesgo de mercado incluyendo una posible minusvalía del capital invertido. Los fondos de inversión no están garantizados por Grupo Financiero Actinver S.A. de C.V, o por alguna entidad integrante del Grupo Financiero Actinver, ni por ninguna entidad gubernamental, ni por el IPAB y pueden tener minusvalías del capital invertido. Todos los Fondos de Actinver cuentan con Prospecto de Información al Público Inversionista y Documentos con Información Clave, los cuales se encuentran a su disposición en www.actinver.com/fondos.';


const SERIE = [
  {n: 1, t: 'ACTIREN', s: 'Corto plazo', on: true},
  {n: 2, t: 'ACTIGOB', s: '100% gobierno', on: false},
  {n: 3, t: 'ORION', s: 'Largo plazo', on: false},
];
const End: React.FC<P> = ({f, at}) => {
  const dm = sp(f, 2, 11, 200);
  const send = ease((f - at(95)) / 10);
  const card = (i: number) => sp(f, at(101) - 6 + i * 6, 11, 220);
  const fol = sp(f, at(104), 10, 200);
  const tap = f - at(107) - 4;
  const pressed = tap > 0 && tap < 8;
  const legalAt = at(108) + F(LAST.e - LAST.s + 0.4);
  const fade = ease((f - legalAt) / 10);
  return (
    <AbsoluteFill>
      <div style={{opacity: 1 - fade}}>
        <div style={{position: 'absolute', left: 120, top: 260, width: 700, padding: '34px 40px', borderRadius: '40px 40px 40px 8px', background: WARM, fontFamily: FONT, fontSize: 52, fontWeight: 600, color: NAVY, transform: `scale(${dm}) translateY(${-send * 30}px)`, transformOrigin: 'left bottom', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'}}>
          ✉️ Escríbeme y lo revisamos juntos
        </div>
        <div style={{position: 'absolute', left: 96, top: 560, fontFamily: FONT, fontSize: 40, fontWeight: 600, color: OCRE, letterSpacing: 4, opacity: card(0)}}>SERIE · DEUDA EN PESOS</div>
        {SERIE.map((s, i) => (
          <div key={s.t} style={{position: 'absolute', left: 96, top: 640 + i * 150, width: 888, height: 124, borderRadius: 28, background: s.on ? OCRE : 'rgba(245,243,238,0.14)', color: s.on ? NAVY : WARM, fontFamily: FONT, display: 'flex', alignItems: 'center', gap: 30, padding: '0 36px', boxSizing: 'border-box', transform: `translateX(${(1 - card(i)) * 1000}px)`, boxShadow: s.on ? '0 16px 40px rgba(0,0,0,0.3)' : 'none'}}>
            <div style={{fontWeight: 700, fontSize: 56, width: 70}}>{s.n}</div>
            <div style={{fontWeight: 700, fontSize: 52}}>{s.t}</div>
            <div style={{fontWeight: 400, fontSize: 34, marginLeft: 'auto'}}>{s.s}</div>
          </div>
        ))}
        <div style={{position: 'absolute', left: 540, top: 1190, transform: `translate(-50%,-50%) scale(${fol * (pressed ? 0.9 : 1)})`, background: pressed || tap >= 8 ? WARM : OCRE, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 64, padding: '26px 70px', borderRadius: 100, boxShadow: '0 16px 40px rgba(0,0,0,0.3)'}}>
          {tap >= 8 ? '✓ SIGUIENDO' : '+ SÍGUEME'}
        </div>
        {tap > -6 && tap < 14 && <div style={{position: 'absolute', left: 600 - Math.min(tap + 6, 6) * 6, top: 1210 - Math.min(tap + 6, 6) * 4, fontSize: 90, transform: pressed ? 'scale(0.85)' : 'none'}}>👆</div>}
      </div>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 96, top: 420, width: 330, opacity: fade}} />
      <div style={{position: 'absolute', left: 96, right: 96, top: 560, fontFamily: FONT, fontSize: 64, color: WARM, opacity: fade, lineHeight: 1.1}}>
        <span style={{fontWeight: 300}}>FONDO </span>
        <span style={{fontWeight: 700, color: OCRE}}>ACTIREN</span>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 90, fontFamily: FONT, fontSize: 21, lineHeight: 1.38, color: 'rgba(245,243,238,0.8)', opacity: fade}}>
        <div style={{fontWeight: 600, fontSize: 24, color: WARM, marginBottom: 10}}>Datos de actinver.com/actiren al 31 de marzo de 2026. Rendimientos pasados no garantizan rendimientos futuros. Consulta términos y condiciones de los productos en actinver.com</div>
        {LEGAL}
      </div>
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC<P>> = {cal: Cal, zzz: Zzz, intro: Intro, deuda: Deuda, sem: Sem, rating: Rating, liq: Liq, riesgo: Riesgo, cta1: Cta1, end: End};

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

export const Actiren: React.FC = () => {
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
      <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: W * cl(t / AR2_TOTAL), background: OCRE}} />
      <Audio src={staticFile('actiren/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

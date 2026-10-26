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
import data from '../public/compara/words.json';
import {FONT, FPS, W} from './theme';
import {F, cl, ease, sp} from './narrador';
import {NAVY, NAVY2, OCRE, WARM, GRAY, OK, THEMES, ThemeBg} from './banca';

type Word = {i: number; w: string; s: number; e: number; k: boolean};
const words = data.words as Word[];
const LAST = words[words.length - 1];
export const CP_TOTAL = Math.round((LAST.e + 4.6) * 100) / 100; // voz + pantalla legal
const TW = (i: number) => words[i].s;

/* escenas: palabra inicial, componente, fondo (cambia cada 2–3 escenas) */
const SC = [
  {w: 0, k: 'hook', bg: 0},
  {w: 20, k: 'pagv', bg: 2},
  {w: 42, k: 'pagd', bg: 2},
  {w: 60, k: 'cdv', bg: 1},
  {w: 89, k: 'cdd', bg: 1},
  {w: 105, k: 'fonv', bg: 3},
  {w: 126, k: 'fond', bg: 3},
  {w: 144, k: 'resumen', bg: 4},
  {w: 158, k: 'pregunta', bg: 5},
  {w: 163, k: 'end', bg: 0},
];
const TD = 12;
const starts = SC.map((s, i) => (i === 0 ? 0 : F(TW(s.w) - 0.14)));
const totalF = F(CP_TOTAL);

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
/* ---------- piezas ---------- */
const C_PAG = OCRE;
const C_CD = '#8DB3E2';
const C_FON = '#7BC4A4';
const BAD = '#D9534F';

const Tag: React.FC<{t: string; c: string; k: number; x?: number; y?: number; size?: number}> = ({t, c, k, x = 96, y = 250, size = 100}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `scale(${k})`, transformOrigin: 'left center', background: c, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: size, padding: `${size * 0.12}px ${size * 0.42}px`, borderRadius: size * 0.3, boxShadow: '0 18px 40px rgba(0,0,0,0.3)', whiteSpace: 'nowrap'}}>{t}</div>
);
const Kind: React.FC<{good: boolean; k: number; dark: boolean}> = ({good, k, dark}) => (
  <div style={{position: 'absolute', left: 96, top: 420, display: 'flex', alignItems: 'center', gap: 22, fontFamily: FONT, fontWeight: 700, fontSize: 56, color: good ? (dark ? '#2E7D4F' : '#7BD3A0') : BAD, transform: `translateX(${(1 - k) * -500}px)`, opacity: cl(k * 2)}}>
    <div style={{width: 84, height: 84, borderRadius: 50, background: good ? '#2E7D4F' : BAD, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52}}>{good ? '✓' : '✕'}</div>
    {good ? 'VENTAJA' : 'DESVENTAJA'}
  </div>
);
const Item: React.FC<{t: string; k: number; y: number; good: boolean; dark: boolean}> = ({t, k, y, good, dark}) => (
  <div style={{position: 'absolute', left: 96, right: 96, top: y, padding: '28px 36px', borderRadius: 30, background: dark ? '#FFFFFF' : NAVY2, border: `3px solid ${good ? '#2E7D4F' : BAD}`, color: dark ? NAVY : WARM, fontFamily: FONT, fontWeight: 600, fontSize: 50, lineHeight: 1.15, transform: `translateX(${(1 - k) * 1100}px)`, boxShadow: '0 16px 40px rgba(0,0,0,0.25)'}}>{t}</div>
);
const PagareDoc: React.FC<{lock?: number}> = ({lock = 0}) => (
  <g>
    <rect x={-170} y={-210} width={340} height={420} rx={26} fill={WARM} stroke={C_PAG} strokeWidth={10} />
    <text x={0} y={-130} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill={NAVY}>PAGARÉ</text>
    {[0, 1, 2, 3].map((i) => <rect key={i} x={-120} y={-80 + i * 52} width={i === 3 ? 140 : 240} height={18} rx={9} fill="rgba(4,30,66,0.2)" />)}
    <g transform={`translate(110 150) scale(${lock})`}>
      <rect x={-46} y={-20} width={92} height={74} rx={14} fill={NAVY} />
      <path d="M-28 -20 V-46 Q-28 -76 0 -76 Q28 -76 28 -46 V-20" stroke={NAVY} strokeWidth={14} fill="none" />
      <circle cy={16} r={11} fill={OCRE} />
    </g>
  </g>
);

/* ---------- escenas ---------- */
const Hook: React.FC<P> = ({f, at}) => {
  const cards = [
    {t: 'PAGARÉ', c: C_PAG, w: 0, r: -8},
    {t: 'CD', c: C_CD, w: 1, r: 4},
    {t: 'FONDOS', c: C_FON, w: 3, r: -3},
  ];
  const neq = sp(f, at(13) - 3, 9, 240);
  const logo = sp(f, at(11) - 4);
  return (
    <AbsoluteFill>
      {cards.map((c, i) => {
        const k = sp(f, Math.max(0, at(c.w) - 6), 10, 240);
        return (
          <div key={i} style={{position: 'absolute', left: 140 + i * 40, top: 330 + i * 250, width: 760, height: 200, borderRadius: 36, background: c.c, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${k}) rotate(${c.r * (1 - 0.6 * neq)}deg)`, boxShadow: '0 24px 60px rgba(0,0,0,0.4)'}}>
            {c.t}
          </div>
        );
      })}
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 390, top: 1110, width: 300, opacity: cl(logo * 1.5), transform: `scale(${0.8 + 0.2 * logo})`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1240, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 84, color: WARM, transform: `scale(${neq})`}}>
        NO SON <span style={{color: OCRE}}>IGUALES</span>
      </div>
    </AbsoluteFill>
  );
};

const PagV: React.FC<P> = ({f, at, dark}) => {
  const tag = sp(f, at(22) - 4, 10, 220);
  return (
    <AbsoluteFill>
      <Tag t="PAGARÉ" c={C_PAG} k={tag} />
      <Kind good k={sp(f, at(24) - 4)} dark={dark} />
      <Item t="📌 Tasa fija: sabes cuánto ganas desde el día 1" k={sp(f, at(28) - 5, 11, 220)} y={600} good dark={dark} />
      <Item t="🛡️ Protegido por el IPAB" k={sp(f, at(39) - 5, 11, 220)} y={860} good dark={dark} />
      <Svg>
        <g transform={`translate(800 1210) scale(${0.55 * sp(f, at(33) - 4)}) rotate(6)`}><PagareDoc lock={sp(f, at(35) - 3, 9, 260)} /></g>
      </Svg>
      <Note text="Pagaré Platinum: plazos de 28 a 364 días. Tasas vigentes en actinver.com" f={f} d={at(35)} dark={dark} top={1060} />
    </AbsoluteFill>
  );
};

const PagD: React.FC<P> = ({f, at, dark}) => {
  const lock = sp(f, at(47) - 4, 9, 260);
  const up = ease((f - at(54)) / 18);
  return (
    <AbsoluteFill>
      <Tag t="PAGARÉ" c={C_PAG} k={1} />
      <Kind good={false} k={sp(f, 3)} dark={dark} />
      <Item t="🔒 Tu dinero se queda hasta el vencimiento" k={sp(f, at(44) - 5, 11, 220)} y={600} good={false} dark={dark} />
      <Item t="📈 Si las tasas suben, no lo aprovechas" k={sp(f, at(52) - 5, 11, 220)} y={860} good={false} dark={dark} />
      <Svg>
        <g transform="translate(300 1250)">
          <g transform={`scale(${0.5 * lock})`}><PagareDoc lock={1} /></g>
        </g>
        <g transform="translate(560 1380)" opacity={cl(up * 2)}>
          <line x1={0} y1={0} x2={300 * up} y2={-170 * up} stroke={BAD} strokeWidth={14} strokeLinecap="round" />
          <path d={`M${300 * up} ${-170 * up} l-46 -4 l26 40Z`} fill={BAD} />
          <text x={330} y={-150} fontFamily={FONT} fontWeight={700} fontSize={40} fill={BAD} opacity={up}>TASAS ↑</text>
          <text x={-10} y={70} fontFamily={FONT} fontWeight={700} fontSize={40} fill={dark ? NAVY : WARM} opacity={up}>Tu tasa: igual</text>
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

const CdChart: React.FC<{draw: number; down?: boolean; f: number}> = ({draw, down = false, f}) => {
  const n = 30;
  const ce: string[] = [];
  const cd: string[] = [];
  for (let i = 0; i <= n; i++) {
    if (i / n > draw) break;
    const x = i * 26;
    const base = down ? -i * 6 + Math.sin(i / 3) * 18 : i * 6 + Math.sin(i / 3) * 18;
    ce.push(`${x},${-base}`);
    cd.push(`${x},${-base - 30}`);
  }
  return (
    <g>
      <line x1={0} y1={160} x2={800} y2={160} stroke="rgba(245,243,238,0.3)" strokeWidth={4} />
      <polyline points={ce.join(' ')} fill="none" stroke="rgba(245,243,238,0.6)" strokeWidth={8} strokeDasharray="18 12" />
      <polyline points={cd.join(' ')} fill="none" stroke={down ? BAD : C_CD} strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" />
      {draw > 0.2 && <text x={790} y={down ? 210 : -200} textAnchor="end" fontFamily={FONT} fontWeight={600} fontSize={34} fill="rgba(245,243,238,0.7)">— — Cetes</text>}
      {draw > 0.2 && <text x={790} y={down ? 250 : -240} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={34} fill={down ? BAD : C_CD}>━ CD</text>}
      {[0, 1, 2, 3, 4, 5].map((m) => <circle key={m} cx={m * 156} cy={160} r={7} fill={OCRE} opacity={draw * (0.6 + 0.4 * Math.sin(f / 6 + m))} />)}
    </g>
  );
};

const CdV: React.FC<P> = ({f, at, dark}) => {
  const tag = sp(f, at(62) - 4, 10, 220);
  const draw = ease((f - at(67)) / 40);
  return (
    <AbsoluteFill>
      <Tag t="CD" c={C_CD} k={tag} />
      <Kind good k={sp(f, at(63) - 6)} dark={dark} />
      <Item t="📊 Tasa ligada a Cetes, se revisa cada mes" k={sp(f, at(64) - 5, 11, 220)} y={560} good dark={dark} />
      <Svg>
        <g transform="translate(140 1010)"><CdChart draw={draw} f={f} /></g>
      </Svg>
      <Pill text="¿SUBEN LAS TASAS? GANAS MÁS" x={540} y={1260} k={sp(f, at(79) - 4)} c={C_CD} size={46} />
      <Pill text="🛡️ PROTECCIÓN IPAB" x={540} y={1380} k={sp(f, at(86) - 4)} c={WARM} size={46} />
    </AbsoluteFill>
  );
};

const CdD: React.FC<P> = ({f, at, dark}) => {
  const draw = ease((f - at(93)) / 30);
  const min = sp(f, at(101) - 4, 9, 240);
  return (
    <AbsoluteFill>
      <Tag t="CD" c={C_CD} k={1} />
      <Kind good={false} k={sp(f, 3)} dark={dark} />
      <Item t="📉 Si las tasas bajan, tu rendimiento baja" k={sp(f, at(91) - 5, 11, 220)} y={560} good={false} dark={dark} />
      <Svg>
        <g transform="translate(140 920)"><CdChart draw={draw} down f={f} /></g>
      </Svg>
      <Item t="💰 Monto mínimo más alto" k={min} y={1240} good={false} dark={dark} />
    </AbsoluteFill>
  );
};

const FonV: React.FC<P> = ({f, at, dark}) => {
  const tag = sp(f, at(107) - 4, 10, 220);
  const steps = [
    {t: 'Deuda', w: 117, c: WARM},
    {t: 'Mixtos', w: 118, c: C_CD},
    {t: 'Acciones', w: 119, c: C_FON},
  ];
  const liq = sp(f, at(124) - 4, 9, 240);
  return (
    <AbsoluteFill>
      <Tag t="FONDOS" c={C_FON} k={tag} />
      <Kind good k={sp(f, at(110) - 4)} dark={dark} />
      <Item t="🎯 Hay para cada objetivo" k={sp(f, at(112) - 5, 11, 220)} y={560} good dark={dark} />
      {steps.map((s, i) => {
        const k = sp(f, at(s.w) - 5, 10, 240);
        return (
          <div key={i} style={{position: 'absolute', left: 96 + i * 300, top: 860 - i * 50, width: 270, height: 150 + i * 50, borderRadius: 26, background: s.c, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 44, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 26, boxSizing: 'border-box', transform: `scaleY(${k})`, transformOrigin: 'bottom'}}>{s.t}</div>
        );
      })}
      <div style={{position: 'absolute', left: 96, top: 1050, fontFamily: FONT, fontSize: 32, color: dark ? GRAY : 'rgba(245,243,238,0.75)', opacity: sp(f, at(119))}}>Menor riesgo ←──────────→ Mayor riesgo</div>
      <Pill text="💧 MUCHOS CON LIQUIDEZ DIARIA" x={540} y={1230} k={liq} c={C_FON} size={46} />
      <Note text="La liquidez depende del prospecto de cada fondo." f={f} d={at(125)} dark={dark} top={1320} />
    </AbsoluteFill>
  );
};

const FonD: React.FC<P> = ({f, at, dark}) => {
  const x = sp(f, at(130) - 4, 9, 260);
  const w = ease((f - at(136)) / 30);
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    if (i / 40 > w) break;
    pts.push(`${i * 20},${-Math.sin(i / 4) * 110 - noise2D('v', i / 5, 0) * 40}`);
  }
  return (
    <AbsoluteFill>
      <Tag t="FONDOS" c={C_FON} k={1} />
      <Kind good={false} k={sp(f, 3)} dark={dark} />
      <Item t="🚫 No están protegidos por el IPAB" k={sp(f, at(127) - 5, 11, 220)} y={560} good={false} dark={dark} />
      <Svg>
        <g transform="translate(300 930)" opacity={cl(x * 2)}>
          <g transform={`scale(${x})`}>
            <path d="M0 -110 L95 -75 V5 Q95 80 0 110 Q-95 80 -95 5 V-75Z" fill="none" stroke={WARM} strokeWidth={9} />
            <text textAnchor="middle" y={18} fontFamily={FONT} fontWeight={700} fontSize={44} fill={WARM}>IPAB</text>
            <line x1={-120} y1={-120} x2={120} y2={120} stroke={BAD} strokeWidth={16} strokeLinecap="round" />
          </g>
        </g>
        <g transform="translate(140 1230)">
          <line x1={0} y1={0} x2={800} y2={0} stroke="rgba(245,243,238,0.3)" strokeWidth={4} />
          <polyline points={pts.join(' ')} fill="none" stroke={C_FON} strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" />
        </g>
      </Svg>
      <Pill text="SU VALOR SUBE O BAJA CON EL MERCADO" x={540} y={1430} k={sp(f, at(138) - 4)} c={WARM} size={40} />
    </AbsoluteFill>
  );
};

const Resumen: React.FC<P> = ({f, at, dark}) => {
  const rows = [
    {q: '¿Certeza?', a: 'PAGARÉ', c: C_PAG, w: 145, wa: 147},
    {q: '¿Seguir a Cetes?', a: 'CD', c: C_CD, w: 148, wa: 152},
    {q: '¿Flexibilidad?', a: 'FONDOS', c: C_FON, w: 153, wa: 157},
  ];
  return (
    <AbsoluteFill>
      <Head light="Entonces," bold="¿cuál?" f={f} dark={dark} size={110} />
      {rows.map((r, i) => {
        const kq = sp(f, at(r.w) - 5, 11, 220);
        const ka = sp(f, at(r.wa) - 3, 9, 260);
        return (
          <div key={i} style={{position: 'absolute', left: 80, right: 80, top: 560 + i * 260, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 52, color: dark ? NAVY : WARM, transform: `translateX(${(1 - kq) * -900}px)`}}>{r.q}</div>
            <div style={{background: r.c, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 56, padding: '22px 40px', borderRadius: 26, transform: `scale(${ka})`, boxShadow: '0 16px 40px rgba(0,0,0,0.3)'}}>{r.a}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Pregunta: React.FC<P> = ({f}) => {
  const k = sp(f, 2, 10, 200);
  const sel = Math.floor(f / 8) % 3;
  const cs = [
    {t: 'PAGARÉ', c: C_PAG},
    {t: 'CD', c: C_CD},
    {t: 'FONDOS', c: C_FON},
  ];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 70, top: 300, fontFamily: FONT, color: WARM, fontSize: 120, lineHeight: 1.03, transform: `scale(${0.7 + 0.3 * k})`, transformOrigin: 'left top', opacity: cl(k * 2)}}>
        <div style={{fontWeight: 300}}>¿CON CUÁL</div>
        <div style={{fontWeight: 700}}>
          TE <span style={{color: OCRE}}>QUEDAS?</span>
        </div>
      </div>
      {cs.map((c, i) => (
        <div key={i} style={{position: 'absolute', left: 120, right: 120, top: 700 + i * 200, height: 160, borderRadius: 34, background: sel === i ? c.c : 'rgba(245,243,238,0.1)', border: `4px solid ${c.c}`, color: sel === i ? NAVY : WARM, fontFamily: FONT, fontWeight: 700, fontSize: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${k * (sel === i ? 1.05 : 0.95)})`}}>{c.t}</div>
      ))}
    </AbsoluteFill>
  );
};

const LEGAL =
  'El contenido es únicamente informativo, no constituye recomendación, consejo o sugerencia personalizada de algún producto y/o servicio que le sugieran la toma de decisiones de inversión, para lo que se necesita previamente verificar la congruencia entre el perfil del cliente y el perfil del producto financiero. Rendimientos pasados no garantizan rendimientos futuros. El valor de las acciones de Fondos de Inversión conlleva un riesgo de mercado incluyendo una posible minusvalía del capital invertido. Los fondos de inversión no están garantizados por Grupo Financiero Actinver S.A. de C.V, o por alguna entidad integrante del Grupo Financiero Actinver, ni por ninguna entidad gubernamental, ni por el IPAB y pueden tener minusvalías del capital invertido. Todos los Fondos de Actinver cuentan con Prospecto de Información al Público Inversionista y Documentos con Información Clave, los cuales se encuentran a su disposición en www.actinver.com/fondos.';

const End: React.FC<P> = ({f, at}) => {
  const dm = sp(f, 2, 11, 200);
  const send = ease((f - at(171)) / 10);
  const fol = sp(f, at(172), 10, 200);
  const tap = f - at(173) - 4;
  const pressed = tap > 0 && tap < 8;
  const legalAt = at(178) + F(LAST.e - LAST.s + 0.4);
  const fade = ease((f - legalAt) / 10);
  return (
    <AbsoluteFill>
      <div style={{opacity: 1 - fade}}>
        <div style={{position: 'absolute', left: 120, top: 380, width: 760, padding: '36px 44px', borderRadius: '40px 40px 40px 8px', background: WARM, fontFamily: FONT, fontSize: 54, fontWeight: 600, color: NAVY, transform: `scale(${dm}) translateY(${-send * 30}px)`, transformOrigin: 'left bottom', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'}}>
          ✉️ Escríbeme y armamos tu combinación
        </div>
        <div style={{position: 'absolute', left: 120, top: 700, display: 'flex', gap: 18}}>
          {[{t: 'PAGARÉ', c: C_PAG}, {t: 'CD', c: C_CD}, {t: 'FONDOS', c: C_FON}].map((c, i) => (
            <div key={i} style={{background: c.c, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 44, padding: '18px 30px', borderRadius: 24, transform: `scale(${sp(f, at(167) - 6 + i * 4, 10, 240)})`}}>{c.t}</div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 540, top: 1150, transform: `translate(-50%,-50%) scale(${fol * (pressed ? 0.9 : 1)})`, background: pressed || tap >= 8 ? WARM : OCRE, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 64, padding: '26px 70px', borderRadius: 100, boxShadow: '0 16px 40px rgba(0,0,0,0.3)'}}>
          {tap >= 8 ? '✓ SIGUIENDO' : '+ SÍGUEME'}
        </div>
        {tap > -6 && tap < 14 && <div style={{position: 'absolute', left: 600 - Math.min(tap + 6, 6) * 6, top: 1170 - Math.min(tap + 6, 6) * 4, fontSize: 90, transform: pressed ? 'scale(0.85)' : 'none'}}>👆</div>}
      </div>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 96, top: 380, width: 330, opacity: fade}} />
      <div style={{position: 'absolute', left: 96, right: 96, top: 520, fontFamily: FONT, fontSize: 60, color: WARM, opacity: fade, lineHeight: 1.1}}>
        <span style={{fontWeight: 300}}>PAGARÉ · CD · </span>
        <span style={{fontWeight: 700, color: OCRE}}>FONDOS</span>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 90, fontFamily: FONT, fontSize: 21, lineHeight: 1.38, color: 'rgba(245,243,238,0.8)', opacity: fade}}>
        <div style={{fontWeight: 600, fontSize: 24, color: WARM, marginBottom: 10}}>Consulta términos y condiciones de los productos en actinver.com. Tasas sujetas a cambio.</div>
        <div style={{fontWeight: 600, color: WARM, marginBottom: 10}}>Pagaré Platinum y CD Platinum: Producto garantizado por el Instituto de Protección al Ahorro Bancario hasta 400 mil UDIS, por cliente por institución.</div>
        <div style={{fontWeight: 600, color: WARM}}>Fondos de inversión:</div>
        {LEGAL}
      </div>
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC<P>> = {hook: Hook, pagv: PagV, pagd: PagD, cdv: CdV, cdd: CdD, fonv: FonV, fond: FonD, resumen: Resumen, pregunta: Pregunta, end: End};


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

export const Compara: React.FC = () => {
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
      {cur.k !== 'hook' && cur.k !== 'end' && <Img src={staticFile(light ? 'logo_azul.png' : 'logo_blanco.png')} style={{position: 'absolute', right: 60, top: 70, width: 210}} />}
      {t < LAST.e + 0.3 && <Captions t={t} f={f} />}
      <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: W * cl(t / CP_TOTAL), background: OCRE}} />
      <Audio src={staticFile('compara/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

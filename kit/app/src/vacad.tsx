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
import data from '../public/vacad/words.json';
import {FONT, FPS, W} from './theme';
import {F, cl, ease, sp} from './narrador';
import {NAVY, NAVY2, OCRE, WARM, GRAY, OK, THEMES, ThemeBg} from './banca';


type Word = {i: number; w: string; s: number; e: number; k: boolean; p: number};
const words = data.words as Word[];
const lines = data.lines as {p: number; s: number; e: number}[];
const LAST = words[words.length - 1];
export const VA_TOTAL = data.total;
const TW = (i: number) => words[i].s;
const L = (p: number) => ({w0: words.findIndex((w) => w.p === p)});

const SC = [
  {p: 0, k: 'hook', bg: 0},
  {p: 1, k: 'nombre', bg: 1},
  {p: 2, k: 'aport', bg: 1},
  {p: 4, k: 'mercado', bg: 2},
  {p: 5, k: 'faltar', bg: 2},
  {p: 6, k: 'final', bg: 3},
  {p: 7, k: 'condiciones', bg: 3},
  {p: 8, k: 'pregunta', bg: 5},
  {p: 9, k: 'end', bg: 0},
];
const TD = 12;
const starts = SC.map((s, i) => (i === 0 ? 0 : F(lines[s.p].s - 0.14)));
const totalF = F(VA_TOTAL);
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
/* ---------- personajes y piezas (de VAC cap. 1) ---------- */
const Person: React.FC<{who: 'ana' | 'rob'; s?: number}> = ({who, s = 1}) => {
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
        </>
      )}
      <circle cx={-32} cy={8} r={ana ? 9 : 7} fill={NAVY} />
      <circle cx={32} cy={8} r={ana ? 9 : 7} fill={NAVY} />
      <path d="M-28 40 Q0 62 28 40" stroke={NAVY} strokeWidth={7} strokeLinecap="round" fill="none" />
    </g>
  );
};
const Jar: React.FC<{lvl: number; s?: number}> = ({lvl, s = 1}) => (
  <g transform={`scale(${s})`}>
    <clipPath id="jarclip"><path d="M-110 -120 H110 V120 Q110 160 70 160 H-70 Q-110 160 -110 120Z" /></clipPath>
    <g clipPath="url(#jarclip)">
      <rect x={-120} y={160 - 290 * lvl} width={240} height={300} fill={OCRE} />
    </g>
    <path d="M-110 -120 H110 V120 Q110 160 70 160 H-70 Q-110 160 -110 120Z" fill="none" stroke={WARM} strokeWidth={10} />
    <rect x={-125} y={-150} width={250} height={36} rx={12} fill={WARM} />
  </g>
);
const Family: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    {([[-170, 0, 1, '#2E5C8A'], [170, 0, 1, OCRE], [-60, 40, 0.7, '#5E8C6A'], [60, 40, 0.7, '#D9534F']] as [number, number, number, string][]).map(([x, y, sc, c], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(${sc})`}>
        <circle cy={-60} r={50} fill="#E8B48F" />
        <path d="M-80 120 Q-80 10 0 10 Q80 10 80 120Z" fill={c} />
      </g>
    ))}
  </g>
);

/* ---------- escenas ---------- */
const Hook: React.FC<P> = ({f, at, dark}) => {
  const fam = sp(f, at(L(0).w0 + 6) - 6, 10, 200);
  const jar = sp(f, at(L(0).w0 + 10) - 6, 10, 200);
  return (
    <AbsoluteFill>
      <Head light="¿Protección" bold="y ahorro?" f={f} dark={dark} size={112} />
      <Svg>
        <g transform={`translate(340 920) scale(${0.95 * fam})`}><Family /></g>
        <g transform={`translate(800 930) scale(${0.62 * jar})`}><Jar lvl={0.45} /></g>
        <text x={340} y={1120} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={42} fill={WARM} opacity={fam}>PROTECCIÓN</text>
        <text x={800} y={1120} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={42} fill={WARM} opacity={jar}>AHORRO</text>
      </Svg>
      <Pill text="EN UN MISMO INSTRUMENTO" x={540} y={1260} k={sp(f, at(L(0).w0 + 12) - 4)} size={46} />
    </AbsoluteFill>
  );
};

const Nombre: React.FC<P> = ({f, at}) => {
  const a = sp(f, at(L(1).w0 + 2) - 4, 10, 220);
  const b = sp(f, at(L(1).w0 + 3) - 2, 10, 220);
  const c = sp(f, at(L(1).w0 + 4) - 2, 10, 220);
  const logo = sp(f, at(L(1).w0 + 6) - 4);
  const z = ease((f - at(L(1).w0 + 8)) / 10);
  const ppl = sp(f, 2);
  return (
    <AbsoluteFill>
      <Svg>
        <g transform={`translate(330 500) scale(${0.62 * ppl})`}><Person who="ana" /></g>
        <g transform={`translate(750 500) scale(${0.62 * ppl})`}><Person who="rob" /></g>
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
      <div style={{position: 'absolute', left: 100, top: 1310, fontFamily: FONT, fontSize: 44, color: WARM, opacity: z}}>
        <span style={{fontWeight: 300}}>en alianza con </span>
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
  const drop = ease((f - at(L(2).w0 + 2) + 6) / 14);
  const split = ease((f - at(L(2).w0 + 5) + 4) / 14);
  const fam = sp(f, at(L(2).w0 + 5) - 2);
  const jar = sp(f, at(L(3).w0 + 4) - 4);
  const c = dark ? NAVY : WARM;
  return (
    <AbsoluteFill>
      <Head light="Con tus" bold="aportaciones" f={f} dark={dark} size={104} />
      <Svg>
        <g transform={`translate(540 ${500 + 200 * drop}) scale(${1 - split})`}>
          <circle r={70} fill={OCRE} stroke="#8F8250" strokeWidth={8} />
          <text textAnchor="middle" y={24} fontFamily={FONT} fontWeight={700} fontSize={66} fill={NAVY}>$</text>
        </g>
        {split > 0 && (
          <>
            <path d={`M540 720 Q400 760 ${540 - 250 * split} 860`} stroke={OCRE} strokeWidth={8} fill="none" strokeDasharray="16 14" />
            <path d={`M540 720 Q680 760 ${540 + 250 * split} 860`} stroke={OCRE} strokeWidth={8} fill="none" strokeDasharray="16 14" />
          </>
        )}
        <g transform={`translate(290 1010) scale(${0.62 * fam})`}><Family /></g>
        <g transform={`translate(790 1010) scale(${0.62 * jar})`}><Jar lvl={0.45} /></g>
        <text x={290} y={1190} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={c} opacity={fam}>SUMA ASEGURADA</text>
        <text x={790} y={1190} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={c} opacity={jar}>AHORRO EN FONDOS</text>
      </Svg>
      <Pill text="UNA PARTE SE INVIERTE EN FONDOS ACTINVER" x={540} y={1330} k={sp(f, at(L(3).w0 + 6) - 4)} size={34} />
    </AbsoluteFill>
  );
};

const Mercado: React.FC<P> = ({f, at, dark}) => {
  const d = ease((f - 6) / 100);
  const n = 50;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    if (i / n > d) break;
    pts.push(`${i * 16},${-Math.sin(i / 3.5) * 100 - Math.sin(i / 1.4) * 22}`);
  }
  const up = sp(f, at(L(4).w0 + 10) - 4, 9, 240);
  const dn = sp(f, at(L(4).w0 + 12) - 4, 9, 240);
  const ng = sp(f, at(L(4).w0 + 12) + 8, 9, 240);
  const c = dark ? NAVY : WARM;
  return (
    <AbsoluteFill>
      <Head light="Expuesto" bold="al mercado" f={f} dark={dark} size={110} />
      <Svg>
        <g transform="translate(140 1000)">
          <polyline points={pts.join(' ')} fill="none" stroke={c} strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" />
        </g>
      </Svg>
      <Pill text="PUEDE SUBIR ↑" x={330} y={720} k={up} c={OK} tc="#fff" size={44} />
      <Pill text="PUEDE BAJAR ↓" x={750} y={1250} k={dn} c="#D9534F" tc="#fff" size={44} />
      <Pill text="NO ES GARANTÍA" x={540} y={1345} k={ng} c="#D9534F" tc="#fff" size={44} />
      <Note text="El ahorro en fondos está sujeto a riesgo de mercado." f={f} d={at(L(4).w0 + 6)} dark={dark} top={1400} />
    </AbsoluteFill>
  );
};

const Faltar: React.FC<P> = ({f, at, dark}) => {
  const fam = sp(f, 3);
  const sa = ease((f - at(L(5).w0 + 8)) / 16);
  const ah = ease((f - at(L(5).w0 + 12)) / 16);
  return (
    <AbsoluteFill>
      <Head light="Si llegaras" bold="a faltar" f={f} dark={dark} size={110} />
      <Svg>
        <g transform={`translate(540 780) scale(${fam})`}><Family /></g>
        <g transform="translate(540 1110)">
          <rect x={-340} y={-90} width={680} height={180} rx={24} fill={NAVY2} stroke={dark ? NAVY : WARM} strokeWidth={4} />
          <rect x={-320} y={-70} width={400 * sa} height={140} rx={16} fill={WARM} />
          <rect x={-320 + 400 * sa + 10} y={-70} width={220 * ah} height={140} rx={16} fill={OCRE} />
          <text x={-120} y={16} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={38} fill={NAVY} opacity={sa}>SUMA ASEGURADA</text>
          <text x={195} y={16} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={38} fill={NAVY} opacity={ah}>+ SALDO</text>
        </g>
      </Svg>
      <Note text="El saldo depende del desempeño de los fondos y de las condiciones de la póliza." f={f} d={at(L(5).w0 + 12)} dark={dark} top={1260} />
    </AbsoluteFill>
  );
};

const Final: React.FC<P> = ({f, at, dark}) => {
  const k = sp(f, 3);
  const go = ease((f - at(L(6).w0 + 5)) / 18);
  const pill = sp(f, at(L(6).w0 + 6) - 4);
  return (
    <AbsoluteFill>
      <Head light="Al final" bold="del plazo" f={f} dark={dark} size={110} />
      <Svg>
        <g transform={`translate(540 ${800 + go * 40}) scale(${0.85 * k * (1 - 0.2 * go)})`}><Jar lvl={0.6} /></g>
        <g transform={`translate(250 1130) scale(${0.6 * sp(f, at(L(6).w0 + 2) - 6)})`}><Person who="ana" /></g>
        <g transform={`translate(830 1130) scale(${0.6 * sp(f, at(L(6).w0 + 3) - 6)})`}><Person who="rob" /></g>
      </Svg>
      <Pill text="EL SALDO DEL AHORRO ES PARA TI" x={540} y={1330} k={pill} size={42} />
      <Note text="El saldo depende del desempeño de los fondos." f={f} d={at(L(6).w0 + 10)} dark={dark} top={1405} />
    </AbsoluteFill>
  );
};

const Condiciones: React.FC<P> = ({f, at, dark}) => {
  const doc = sp(f, 3, 11, 200);
  const items = [
    {t: 'COBERTURAS', w: 0},
    {t: 'COSTOS', w: 1},
    {t: 'CONDICIONES', w: 3},
  ];
  const c = dark ? NAVY : WARM;
  return (
    <AbsoluteFill>
      <Head light="Según" bold="tu póliza" f={f} dark={dark} size={118} />
      <Svg>
        <g transform={`translate(300 960) scale(${doc}) rotate(-4)`}>
          <rect x={-150} y={-200} width={300} height={400} rx={22} fill={WARM} stroke={NAVY} strokeWidth={6} />
          {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={-110} y={-150 + i * 52} width={i % 2 ? 160 : 220} height={16} rx={8} fill={NAVY} opacity={0.35} />)}
          <rect x={-110} y={150} width={120} height={20} rx={8} fill={OCRE} />
        </g>
      </Svg>
      {items.map((it, i) => {
        const k = sp(f, at(L(7).w0 + it.w) - 5, 10, 230);
        return (
          <div key={i} style={{position: 'absolute', left: 500, top: 760 + i * 150, padding: '22px 34px', borderRadius: 40, background: i === 2 ? OCRE : dark ? NAVY : WARM, color: i === 2 ? NAVY : dark ? WARM : NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 44, transform: `scale(${k})`, transformOrigin: 'left center', boxShadow: '0 12px 30px rgba(0,0,0,0.25)'}}>{it.t}</div>
        );
      })}
      <Note text="Consulta coberturas, exclusiones y requisitos en las condiciones generales." f={f} d={at(L(7).w0 + 7)} dark={dark} top={1300} />
    </AbsoluteFill>
  );
};

const Pregunta: React.FC<P> = ({f}) => {
  const k = sp(f, 2, 10, 200);
  const bob = Math.sin(f / 7) * 10;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 70, top: 300, fontFamily: FONT, color: WARM, fontSize: 104, lineHeight: 1.05, transform: `scale(${0.7 + 0.3 * k})`, transformOrigin: 'left top', opacity: cl(k * 2)}}>
        <div style={{fontWeight: 300}}>¿CÓMO</div>
        <div style={{fontWeight: 300}}>FUNCIONARÍA</div>
        <div style={{fontWeight: 700}}>EN <span style={{color: OCRE}}>TU CASO?</span></div>
      </div>
      <Svg>
        <g transform={`translate(540 ${1110 + bob}) scale(${1.3 * k})`}>
          <rect x={-120} y={-150} width={240} height={300} rx={26} fill={OCRE} />
          <rect x={-90} y={-120} width={180} height={70} rx={12} fill={NAVY} />
          {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={-90 + c * 64} y={-30 + r * 56} width={52} height={42} rx={10} fill={WARM} />))}
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

const LEGAL =
  'Vida Ahorro Creciente es un seguro de vida con ahorro vinculado a fondos de inversión, emitido por Zurich en alianza con Actinver. Contenido únicamente informativo; no constituye recomendación ni oferta. Coberturas, exclusiones, requisitos de suscripción y costos sujetos a las condiciones generales del producto. El ahorro invertido en fondos está sujeto a riesgo de mercado y puede presentar minusvalías; rendimientos pasados no garantizan rendimientos futuros. El tratamiento fiscal depende del cumplimiento de los requisitos de la Ley del ISR vigente.';

const End: React.FC<P> = ({f, at}) => {
  const dm = sp(f, 2, 11, 200);
  const fol = sp(f, at(L(10).w0 + 1) - 4, 10, 200);
  const tap = f - at(L(10).w0 + 1) - 4;
  const pressed = tap > 0 && tap < 8;
  const legalAt = at(words.length - 1) + F(LAST.e - LAST.s + 0.4);
  const fade = ease((f - legalAt) / 10);
  return (
    <AbsoluteFill>
      <div style={{opacity: 1 - fade}}>
        <div style={{position: 'absolute', left: 120, top: 380, width: 760, padding: '36px 44px', borderRadius: '40px 40px 40px 8px', background: WARM, fontFamily: FONT, fontSize: 56, fontWeight: 600, color: NAVY, transform: `scale(${dm})`, transformOrigin: 'left bottom', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'}}>
          ✉️ Escríbeme y te hago tu cotización personalizada
        </div>
        <div style={{position: 'absolute', left: 120, top: 760, padding: '28px 40px', borderRadius: 30, background: OCRE, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 52, transform: `scale(${sp(f, at(L(9).w0 + 5) - 4)})`, transformOrigin: 'left center'}}>
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
        <div style={{fontWeight: 400, fontSize: 36, marginTop: 14}}>Seguro de vida con ahorro · En alianza con Zurich</div>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 110, fontFamily: FONT, fontSize: 24, lineHeight: 1.42, color: 'rgba(245,243,238,0.82)', opacity: fade}}>
        <div style={{fontWeight: 600, fontSize: 26, color: WARM, marginBottom: 12}}>Consulta términos y condiciones de los productos en actinver.com</div>
        {LEGAL}
      </div>
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC<P>> = {hook: Hook, nombre: Nombre, aport: Aport, mercado: Mercado, faltar: Faltar, final: Final, condiciones: Condiciones, pregunta: Pregunta, end: End};

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
    <div style={{position: 'absolute', left: 40, right: 40, top: 1490, display: 'flex', justifyContent: 'center', transform: `scale(${0.85 + 0.15 * k})`, opacity: cl(k * 2)}}>
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

export const VacAd: React.FC = () => {
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
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center'}}>
        <div style={{background: 'rgba(4,30,66,0.88)', border: `2px solid ${OCRE}`, borderRadius: 40, padding: '10px 28px', fontFamily: FONT, fontWeight: 700, fontSize: 28, color: WARM, letterSpacing: 1, whiteSpace: 'nowrap'}}>
          VIDA AHORRO CRECIENTE · <span style={{color: OCRE}}>ACTINVER</span> · CON ZURICH
        </div>
      </div>
      {cur.k !== 'end' && (
        <div style={{position: 'absolute', left: 40, right: 40, top: 1765, background: 'rgba(4,30,66,0.88)', borderRadius: 18, padding: '12px 20px', fontFamily: FONT, fontSize: 28, lineHeight: 1.3, color: WARM, textAlign: 'center'}}>
          Seguro de vida con ahorro. La parte invertida en fondos puede subir o bajar; no es garantía. Sujeto a las condiciones de la póliza.
        </div>
      )}
      {t < LAST.e + 0.3 && <Captions t={t} f={f} />}
      <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: W * cl(t / VA_TOTAL), background: OCRE}} />
      <Audio src={staticFile('vacad/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

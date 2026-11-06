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
import data from '../public/actirvt/words.json';
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
  {w: 0, k: 'bolsa', bg: 0},
  {w: 7, k: 'intro', bg: 0},
  {w: 19, k: 'mezcla', bg: 1},
  {w: 32, k: 'piso', bg: 2},
  {w: 41, k: 'cal', bg: 2},
  {w: 59, k: 'consejo', bg: 3},
  {w: 70, k: 'riesgo', bg: 3},
  {w: 82, k: 'cta1', bg: 4},
  {w: 91, k: 'end', bg: 4},
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


const Coin: React.FC<{x: number; y: number; r: number; t: string; k: number; c?: string; tc?: string; fs?: number; o?: number}> = ({x, y, r, t, k, c = OCRE, tc = NAVY, fs, o = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${k})`} opacity={o}>
    <circle r={r} fill={c} />
    <circle r={r - 14} fill="none" stroke="rgba(4,30,66,0.25)" strokeWidth={4} />
    <text textAnchor="middle" y={(fs ?? r) * 0.36} fontFamily={FONT} fontWeight={700} fontSize={fs ?? r} fill={tc}>{t}</text>
  </g>
);


/* ---------- escenas ---------- */
const Shield: React.FC<{x: number; y: number; s: number; c?: string; label?: string; o?: number}> = ({x, y, s, c = OCRE, label, o = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <path d="M0 -150 L120 -105 V10 C120 90 60 140 0 165 C-60 140 -120 90 -120 10 V-105Z" fill={c} stroke={NAVY} strokeWidth={8} />
    {label && <text textAnchor="middle" y={34} fontFamily={FONT} fontWeight={700} fontSize={110} fill={NAVY}>{label}</text>}
  </g>
);

const Bolsa: React.FC<P> = ({f, at, dark}) => {
  const g = ease((f - (at(1) - 4)) / 22);
  const pts = 'M100 1000 L260 880 L400 950 L560 740 L700 800 L820 700';
  const e = evolvePath(g, pts);
  const dn = ease((f - (at(5) - 6)) / 12);
  const e2 = evolvePath(dn, 'M820 700 L930 980');
  const sh = sp(f, at(6) - 6, 12, 200);
  return (
    <AbsoluteFill>
      <Head light="¿Bolsa pero" bold="con miedo?" f={f} dark={dark} size={108} />
      <Svg>
        <line x1={100} y1={1060} x2={980} y2={1060} stroke="rgba(245,243,238,0.4)" strokeWidth={4} />
        <path d={pts} stroke={OK} strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={e.strokeDasharray} strokeDashoffset={e.strokeDashoffset} />
        <path d="M820 700 L930 980" stroke="#D9534F" strokeWidth={18} fill="none" strokeLinecap="round" strokeDasharray={e2.strokeDasharray} strokeDashoffset={e2.strokeDashoffset} />
        <Shield x={540} y={1260} s={0.8 * sh} />
      </Svg>
      <Pill text="MIEDO A PERDER" x={540} y={1450} k={sp(f, at(5))} c={NAVY2} tc={WARM} size={44} />
      <Note text="Ilustración, no representa datos reales." f={f} d={at(1)} dark={dark} top={1498} />
    </AbsoluteFill>
  );
};

const Intro: React.FC<P> = ({f, at}) => {
  const a = sp(f, 4, 10, 220);
  const b = sp(f, 9, 10, 220);
  const line = ease((f - 14) / 16);
  const logo = sp(f, at(11));
  const e = evolvePath(line, 'M100 980 H860');
  return (
    <AbsoluteFill>
      <CameraMotionBlur shutterAngle={200} samples={5}>
        <AbsoluteFill>
          <div style={{position: 'absolute', left: 96, top: 480, fontFamily: FONT, color: WARM, lineHeight: 0.95}}>
            <div style={{fontWeight: 300, fontSize: 230, transform: `translateX(${(1 - a) * -900}px)`}}>ACTI</div>
            <div style={{fontWeight: 700, fontSize: 250, color: OCRE, transform: `translateX(${(1 - b) * 1000}px)`}}>RVT</div>
          </div>
        </AbsoluteFill>
      </CameraMotionBlur>
      <Svg>
        <path d="M100 980 H860" stroke={WARM} strokeWidth={6} strokeLinecap="round" strokeDasharray={e.strokeDasharray} strokeDashoffset={e.strokeDashoffset} />
      </Svg>
      <div style={{position: 'absolute', left: 100, top: 1020, fontFamily: FONT, fontSize: 42, color: WARM, opacity: ease((f - at(10)) / 10)}}>Fondo de renta variable internacional</div>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 100, top: 1110, width: 300, opacity: cl(logo * 1.5), transform: `scale(${0.8 + 0.2 * logo})`, transformOrigin: 'left center'}} />
      <div style={{position: 'absolute', left: 100, top: 1250, fontFamily: FONT, fontSize: 40, color: WARM, opacity: ease((f - at(14)) / 10)}}>Referenciado a la bolsa de EE.UU.</div>
      <Pill text="CAPITAL PROTEGIDO" x={360} y={1400} k={sp(f, at(13))} size={50} />
      <Sequence from={0} durationInFrames={40}>
        <AbsoluteFill style={{mixBlendMode: 'screen', opacity: 0.4}}>
          <LightLeak seed={7} hueShift={30} durationInFrames={40} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

const Mezcla: React.FC<P> = ({f, at, dark}) => {
  const gov = sp(f, at(23) - 5, 12, 200);
  const bol = sp(f, at(30) - 5, 12, 200);
  const bars = [90, 150, 120, 200, 170];
  return (
    <AbsoluteFill>
      <Head light="¿Dónde" bold="invierte?" f={f} dark={dark} size={118} />
      <Svg>
        <g transform={`translate(330 1030) scale(${gov})`}>
          <circle r={190} fill={WARM} />
          <path d="M-100 -40 L0 -110 L100 -40Z" fill={NAVY} />
          {[-70, -23, 23, 70].map((x) => <rect key={x} x={x - 11} y={-30} width={22} height={90} fill={NAVY} />)}
          <rect x={-110} y={70} width={220} height={20} rx={6} fill={NAVY} />
        </g>
        <g transform={`translate(760 1030) scale(${bol})`}>
          <circle r={190} fill={OCRE} />
          {bars.map((h, i) => <rect key={i} x={-110 + i * 46} y={90 - h * 0.9} width={32} height={h * 0.9} rx={6} fill={NAVY} />)}
        </g>
      </Svg>
      <Pill text="DEUDA GUBERNAMENTAL" x={330} y={1360} k={sp(f, at(23))} c={NAVY2} tc={WARM} size={32} />
      <Pill text="BOLSA DE EE.UU." x={760} y={1440} k={sp(f, at(30))} c={NAVY2} tc={WARM} size={34} />
      <Note text="Ilustración, no representa la composición exacta del fondo." f={f} d={at(23)} dark={dark} top={1498} />
    </AbsoluteFill>
  );
};

const Piso: React.FC<P> = ({f, at, dark}) => {
  const fl = sp(f, at(33) - 4, 12, 200);
  const coin = sp(f, at(35) - 4, 12, 200);
  const fall = ease((f - (at(39) - 6)) / 20);
  const pts = 'M100 600 L260 700 L380 650 L560 860 L680 820 L880 1080';
  const e = evolvePath(fall, pts);
  return (
    <AbsoluteFill>
      <Head light="Protege" bold="tu capital" f={f} dark={dark} size={112} />
      <Svg>
        <rect x={540 - 440 * fl} y={1150} width={880 * fl} height={34} rx={12} fill={OCRE} />
        <Coin x={540} y={1040} r={105} t="$" k={coin} c={WARM} fs={120} />
        <path d={pts} stroke="#D9534F" strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={e.strokeDasharray} strokeDashoffset={e.strokeDashoffset} />
      </Svg>
      <Pill text="PROTECCIÓN DE CAPITAL" x={540} y={1290} k={sp(f, at(33))} c={NAVY2} tc={WARM} size={42} />
      <Note text="Ilustración. La protección aplica al concluir el periodo; no es garantía." f={f} d={at(33)} dark={dark} top={1498} />
    </AbsoluteFill>
  );
};

const Cal: React.FC<P> = ({f, at, dark}) => {
  const stamp = sp(f, at(56) - 4, 9, 220);
  const sh = sp(f, at(53) + 6, 12, 200);
  const months = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  return (
    <AbsoluteFill>
      <Head light="Periodo" bold="de protección" f={f} dark={dark} size={100} />
      <div style={{position: 'absolute', left: 90, right: 90, top: 590, display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center'}}>
        {months.map((m, i) => {
          const on = ease((f - (at(48) + i * 3)) / 8);
          return (
            <div key={i} style={{width: 210, height: 120, borderRadius: 22, background: on > 0.5 ? OCRE : WARM, fontFamily: FONT, fontWeight: 700, fontSize: 56, color: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.22)'}}>{m}</div>
          );
        })}
      </div>
      <Svg>
        <Shield x={260} y={1230} s={0.55 * sh} />
        <g transform={`translate(700 1230) rotate(-4) scale(${stamp})`}>
          <rect x={-300} y={-80} width={600} height={160} rx={30} fill="none" stroke={OCRE} strokeWidth={10} />
          <text textAnchor="middle" y={24} fontFamily={FONT} fontWeight={700} fontSize={64} fill={OCRE}>VENTAS ANUALES</text>
        </g>
      </Svg>
      <Note text="La protección aplica una vez concluido el periodo." f={f} d={at(53)} dark={dark} top={1400} />
    </AbsoluteFill>
  );
};

const Consejo: React.FC<P> = ({f, at, dark}) => {
  const hi = [{c: 2, r: 1, w: 64}, {c: 5, r: 2, w: 65}, {c: 1, r: 3, w: 66}];
  const people = [380, 540, 700];
  return (
    <AbsoluteFill>
      <Head light="Compras" bold="en fechas fijas" f={f} dark={dark} size={100} />
      <div style={{position: 'absolute', left: 119, top: 570, width: 842, display: 'flex', flexWrap: 'wrap', gap: 12}}>
        {new Array(35).fill(0).map((_, i) => {
          const c = i % 7, r = Math.floor(i / 7);
          const h = hi.find((x) => x.c === c && x.r === r);
          const on = h ? ease((f - (at(h.w) - 4)) / 8) : 0;
          return <div key={i} style={{width: 110, height: 92, borderRadius: 18, background: on > 0.5 ? OCRE : WARM, opacity: on > 0.5 ? 1 : 0.85, transform: on > 0 ? `scale(${1 + 0.06 * Math.sin(on * 3.14)})` : 'none'}} />;
        })}
      </div>
      <Svg>
        {people.map((x, i) => {
          const k = sp(f, at(67) + i * 3, 10, 220);
          return (
            <g key={x} transform={`translate(${x} 1290) scale(${k})`}>
              <circle cy={-34} r={36} fill={WARM} />
              <path d="M-58 50 C-58 4 58 4 58 50Z" fill={WARM} />
            </g>
          );
        })}
      </Svg>
      <Pill text="FIJA EL CONSEJO DE ADMINISTRACIÓN" x={540} y={1440} k={sp(f, at(67))} c={NAVY2} tc={WARM} size={34} />
      <Note text="Las fechas de compra las fija el Consejo; no hay disponibilidad todos los días." f={f} d={at(67)} dark={dark} top={1498} />
    </AbsoluteFill>
  );
};

const Riesgo: React.FC<P> = ({f, at, dark}) => {
  const up = ease((f - at(76)) / 14);
  const down = ease((f - at(78)) / 14);
  const stamp = sp(f, at(79) - 3, 9, 240);
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
      <Pill text="DURANTE EL PERIODO" x={540} y={1476} k={sp(f, at(72))} c={NAVY2} tc={WARM} size={44} />
      <Note text="Ilustración, no representa datos reales." f={f} d={at(72)} dark={dark} top={1522} />
    </AbsoluteFill>
  );
};

const Cta1: React.FC<P> = ({f, at}) => {
  const k = sp(f, 2, 10, 200);
  const q = sp(f, at(90), 10, 220);
  const bars = [60, 100, 80, 130];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 70, top: 300, fontFamily: FONT, color: WARM, fontSize: 100, lineHeight: 1.05, transform: `scale(${0.7 + 0.3 * k})`, transformOrigin: 'left top', opacity: cl(k * 2)}}>
        <div style={{fontWeight: 300}}>¿TE ANIMAS</div>
        <div style={{fontWeight: 700}}>A LA <span style={{color: OCRE}}>BOLSA?</span></div>
      </div>
      <Svg>
        <g transform={`translate(300 1080) scale(${sp(f, at(88) - 6, 10, 220)})`}>
          <circle r={150} fill={WARM} />
          {bars.map((h, i) => <rect key={i} x={-85 + i * 45} y={70 - h} width={30} height={h} rx={6} fill={NAVY} />)}
        </g>
        <Shield x={540} y={1080} s={0.7 * sp(f, at(89), 10, 220)} />
        <Coin x={790} y={1080} r={130} t="?" k={q * (1 + 0.04 * Math.sin(f / 5))} fs={190} />
      </Svg>
    </AbsoluteFill>
  );
};

const LEGAL =
  'El contenido es únicamente informativo, no constituye recomendación, consejo o sugerencia personalizada de algún producto y/o servicio que le sugieran la toma de decisiones de inversión, para lo que se necesita previamente verificar la congruencia entre el perfil del cliente y el perfil del producto financiero. Rendimientos pasados no garantizan rendimientos futuros. El valor de las acciones de Fondos de Inversión conlleva un riesgo de mercado incluyendo una posible minusvalía del capital invertido. Los fondos de inversión no están garantizados por Grupo Financiero Actinver S.A. de C.V, o por alguna entidad integrante del Grupo Financiero Actinver, ni por ninguna entidad gubernamental, ni por el IPAB y pueden tener minusvalías del capital invertido. Todos los Fondos de Actinver cuentan con Prospecto de Información al Público Inversionista y Documentos con Información Clave, los cuales se encuentran a su disposición en www.actinver.com/fondos.';

const End: React.FC<P> = ({f, at}) => {
  const dm = sp(f, 2, 11, 200);
  const send = ease((f - at(91)) / 10);
  const card = sp(f, at(92) - 4, 11, 220);
  const fol = sp(f, at(94), 10, 200);
  const tap = f - at(97) - 4;
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
          <div style={{fontWeight: 700, fontSize: 84}}>ACTIRVT</div>
          <div style={{fontWeight: 400, fontSize: 36, marginTop: 6}}>Fondo de renta variable internacional</div>
          <div style={{fontWeight: 400, fontSize: 40}}>Capital protegido</div>
        </div>
        <div style={{position: 'absolute', left: 540, top: 1190, transform: `translate(-50%,-50%) scale(${fol * (pressed ? 0.9 : 1)})`, background: pressed || tap >= 8 ? WARM : OCRE, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 64, padding: '26px 70px', borderRadius: 100, boxShadow: '0 16px 40px rgba(0,0,0,0.3)'}}>
          {tap >= 8 ? '✓ SIGUIENDO' : '+ SÍGUEME'}
        </div>
        {tap > -6 && tap < 14 && <div style={{position: 'absolute', left: 600 - Math.min(tap + 6, 6) * 6, top: 1210 - Math.min(tap + 6, 6) * 4, fontSize: 90, transform: pressed ? 'scale(0.85)' : 'none'}}>👆</div>}
      </div>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 96, top: 420, width: 330, opacity: fade}} />
      <div style={{position: 'absolute', left: 96, right: 96, top: 560, fontFamily: FONT, fontSize: 64, color: WARM, opacity: fade, lineHeight: 1.1}}>
        <span style={{fontWeight: 300}}>FONDO </span>
        <span style={{fontWeight: 700, color: OCRE}}>ACTIRVT</span>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 90, fontFamily: FONT, fontSize: 21, lineHeight: 1.38, color: 'rgba(245,243,238,0.8)', opacity: fade}}>
        <div style={{fontWeight: 600, fontSize: 24, color: WARM, marginBottom: 10}}>Datos de actinver.com/actirvt al 31 de marzo de 2026. Las condiciones de la protección de capital (periodo, compras y ventas) están en el prospecto. Rendimientos pasados no garantizan rendimientos futuros. Consulta términos y condiciones de los productos en actinver.com</div>
        {LEGAL}
      </div>
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC<P>> = {bolsa: Bolsa, intro: Intro, mezcla: Mezcla, piso: Piso, cal: Cal, consejo: Consejo, riesgo: Riesgo, cta1: Cta1, end: End};

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

export const Actirvt: React.FC = () => {
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
      <Audio src={staticFile('actirvt/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

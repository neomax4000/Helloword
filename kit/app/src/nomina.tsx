import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {flip} from '@remotion/transitions/flip';
import {iris} from '@remotion/transitions/iris';
import {clockWipe} from '@remotion/transitions/clock-wipe';
import {noise2D} from '@remotion/noise';
import data from '../public/nomina/words.json';
import {FONT, FPS, W} from './theme';
import {F, cl, ease, sp} from './narrador';
import {NAVY, OCRE, WARM, GRAY, THEMES, ThemeBg} from './banca';

/* Tutorial app: Portabilidad de nómina (traer tu nómina a Actinver).
   Capturas reales de la app con datos personales tapados (nombre, iniciales, cuenta, saldo, fecha de nacimiento)
   y sin el botón flotante de accesibilidad. Ver kit/scripts/capturas/limpia_nomina.py */

type Word = {i: number; w: string; s: number; e: number; k: boolean};
const words = data.words as Word[];
const LAST = words[words.length - 1];
export const AU_TOTAL = Math.round((LAST.e + 2.6) * 100) / 100;
const TW = (i: number) => words[i].s;

const SC = [
  {w: 0, k: 'hook', bg: 0},
  {w: 12, k: 'gratis', bg: 0},
  {w: 17, k: 'app', bg: 1},
  {w: 23, k: 'perfil', bg: 1},
  {w: 30, k: 'menu', bg: 1},
  {w: 35, k: 'benef', bg: 2},
  {w: 45, k: 'bancos', bg: 2},
  {w: 57, k: 'mitad', bg: 5},
  {w: 63, k: 'traer', bg: 3},
  {w: 68, k: 'confirma', bg: 3},
  {w: 71, k: 'clabe', bg: 1},
  {w: 82, k: 'pasos', bg: 1},
  {w: 92, k: 'plazo', bg: 2},
  {w: 102, k: 'estatus', bg: 2},
  {w: 110, k: 'credito', bg: 4},
  {w: 124, k: 'escribe', bg: 0},
  {w: 132, k: 'end', bg: 0},
];
const TD = 12;
const starts = SC.map((s, i) => (i === 0 ? 0 : F(TW(s.w) - 0.14)));
const totalF = F(AU_TOTAL);
const TRANS = [
  slide({direction: 'from-right'}),
  iris({width: 1080, height: 1920}),
  slide({direction: 'from-left'}),
  slide({direction: 'from-right'}),
  wipe({direction: 'from-bottom-left'}),
  slide({direction: 'from-bottom'}),
  clockWipe({width: 1080, height: 1920}),
  flip({direction: 'from-right'}),
  slide({direction: 'from-right'}),
  wipe({direction: 'from-right'}),
  slide({direction: 'from-left'}),
  iris({width: 1080, height: 1920}),
  slide({direction: 'from-bottom'}),
  wipe({direction: 'from-top-left'}),
  flip({direction: 'from-bottom'}),
  slide({direction: 'from-right'}),
];

type P = {f: number; at: (i: number) => number; dark: boolean};

/* ---------- piezas ---------- */
const Particles: React.FC<{f: number; dark: boolean; seed: string}> = ({f, dark, seed}) => (
  <AbsoluteFill>
    {new Array(22).fill(0).map((_, i) => {
      const x = 540 + noise2D(seed + 'x', i * 0.37, f / 160) * 620;
      const y = 960 + noise2D(seed + 'y', i * 0.53, f / 170) * 1050;
      const r = 4 + (i % 4) * 3;
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: r, height: r, borderRadius: r, background: i % 3 === 0 ? OCRE : dark ? 'rgba(4,30,66,0.35)' : 'rgba(245,243,238,0.35)', opacity: 0.6}} />;
    })}
  </AbsoluteFill>
);
const Head: React.FC<{light: string; bold: string; f: number; d?: number; dark: boolean; size?: number; top?: number; still?: boolean}> = ({light, bold, f, d = 0, dark, size = 92, top = 260, still}) => {
  const k = still ? 1 : sp(f, d, 12, 200);
  const k2 = still ? 1 : sp(f, d + 5, 12, 200);
  return (
    <div style={{position: 'absolute', left: 96, right: 70, top, fontFamily: FONT, fontSize: size, lineHeight: 1.04, color: dark ? NAVY : WARM, textTransform: 'uppercase'}}>
      <div style={{fontWeight: 300, transform: `translateX(${(1 - k) * -120}px)`, opacity: cl(k * 1.5)}}>{light}</div>
      <div style={{fontWeight: 700, color: OCRE, transform: `translateX(${(1 - k2) * 160}px)`, opacity: cl(k2 * 1.5)}}>{bold}</div>
    </div>
  );
};
const Pill: React.FC<{text: string; x: number; y: number; k: number; c?: string; tc?: string; size?: number}> = ({text, x, y, k, c = OCRE, tc = NAVY, size = 52}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${k})`, background: c, color: tc, fontFamily: FONT, fontWeight: 700, fontSize: size, padding: `${size * 0.3}px ${size * 0.7}px`, borderRadius: 100, whiteSpace: 'nowrap', boxShadow: '0 16px 40px rgba(0,0,0,0.25)'}}>{text}</div>
);
const Step: React.FC<{n?: string; text: string; f: number; dark: boolean}> = ({n, text, f, dark}) => {
  const k = sp(f, 0, 12, 200);
  return (
    <div style={{position: 'absolute', left: 80, top: 150, display: 'flex', alignItems: 'center', gap: 22, opacity: cl(k * 1.5), transform: `translateY(${(1 - k) * -40}px)`}}>
      {n && <div style={{width: 92, height: 92, borderRadius: 46, background: OCRE, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 50, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{n}</div>}
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 46, color: dark ? NAVY : WARM, textTransform: 'uppercase', maxWidth: 640, lineHeight: 1.05}}>{text}</div>
    </div>
  );
};
const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>{children}</svg>
);

/* ---------- teléfono con captura real ---------- */
const IMG_W = 1206;
const SCW = 540;
const K = SCW / IMG_W;
const SCH = Math.round(2482 * K);
const PW = SCW + 28;
const PTOP = 300;
type Box = {x0: number; y0: number; x1: number; y1: number; at: number; to?: number};
const Phone: React.FC<{
  f: number;
  img: string;
  img2?: string;
  swap?: number; // frame en que cambia a img2
  focus?: [number, number];
  zoom?: number;
  zAt?: number;
  boxes?: Box[];
  taps?: {x: number; y: number; at: number}[];
  enter?: boolean;
  dark: boolean;
  children?: React.ReactNode;
}> = ({f, img, img2, swap = 9999, focus = [603, 1240], zoom = 1, zAt = 4, boxes = [], taps = [], enter, dark, children}) => {
  const e = enter ? sp(f, 0, 14, 120) : 1;
  const zk = ease((f - zAt) / 16);
  const z = 1 + (zoom - 1) * zk;
  const sw = cl((f - swap) / 6);
  return (
    <div style={{position: 'absolute', left: (W - PW) / 2, top: PTOP, width: PW, height: SCH + 28, borderRadius: 64, padding: 14, boxSizing: 'border-box', background: 'linear-gradient(160deg,#3a4458,#0d1119 45%,#1d2535)', boxShadow: dark ? '0 40px 80px rgba(4,30,66,0.35)' : '0 50px 90px rgba(0,0,0,0.55)', transform: `translateY(${(1 - e) * 260}px)`, opacity: cl(e * 2)}}>
      <div style={{position: 'relative', width: SCW, height: SCH, borderRadius: 52, overflow: 'hidden', background: '#fff'}}>
        <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: `${focus[0] * K}px ${focus[1] * K}px`}}>
          <Img src={staticFile(`nomina/${img}.png`)} style={{position: 'absolute', width: SCW, height: SCH}} />
          {img2 && <Img src={staticFile(`nomina/${img2}.png`)} style={{position: 'absolute', width: SCW, height: SCH, opacity: sw, transform: `translateX(${(1 - sw) * 60}px)`}} />}
          {boxes.map((b, i) => {
            const k = ease((f - b.at) / 8) * (b.to === undefined ? 1 : 1 - cl((f - b.to) / 4));
            return k > 0 ? (
              <div key={i} style={{position: 'absolute', left: b.x0 * K - 6, top: b.y0 * K - 6, width: (b.x1 - b.x0) * K + 12, height: (b.y1 - b.y0) * K + 12, borderRadius: 14, border: `4px solid ${OCRE}`, boxShadow: `0 0 0 ${(1 - k) * 30}px rgba(179,163,105,0.25)`, opacity: k}} />
            ) : null;
          })}
          {taps.map((t, i) => {
            const p = cl((f - t.at) / 18);
            const on = f >= t.at - 6 && f < t.at + 24;
            const dot = cl((f - (t.at - 6)) / 6) * (1 - cl((f - t.at - 10) / 8));
            return on ? (
              <React.Fragment key={i}>
                <div style={{position: 'absolute', left: t.x * K - 26, top: t.y * K - 26, width: 52, height: 52, borderRadius: 26, background: 'rgba(179,163,105,0.75)', border: '3px solid #fff', opacity: dot}} />
                {p > 0 && p < 1 && <div style={{position: 'absolute', left: t.x * K - 50, top: t.y * K - 50, width: 100, height: 100, borderRadius: 50, border: `5px solid ${OCRE}`, transform: `scale(${0.4 + p * 1.2})`, opacity: 1 - p}} />}
              </React.Fragment>
            ) : null;
          })}
          {children}
        </div>
      </div>
    </div>
  );
};

/* ---------- escenas ---------- */
const Bank: React.FC<{x: number; y: number; c: string; s?: number}> = ({x, y, c, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-130 -50 L0 -120 L130 -50Z" fill={c} />
    {[-90, -30, 30, 90].map((xx) => (
      <rect key={xx} x={xx - 16} y={-40} width={32} height={110} rx={6} fill={c} />
    ))}
    <rect x={-145} y={78} width={290} height={30} rx={8} fill={c} />
  </g>
);
const Hook: React.FC<P> = ({f, at}) => {
  const mv = ((f % 40) / 40);
  const tag = sp(f, at(6), 11, 200);
  return (
    <AbsoluteFill>
      <Head light="Trae tu nómina" bold="a Actinver" f={f} dark={false} size={110} top={240} still />
      <Svg>
        <Bank x={250} y={1000} c="rgba(245,243,238,0.55)" />
        <text x={250} y={1170} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={40} fill={WARM}>TU BANCO</text>
        <g>
          <rect x={650} y={860} width={330} height={260} rx={36} fill={WARM} />
          <Bank x={815} y={985} c={NAVY} s={0.8} />
        </g>
        <text x={815} y={1170} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={OCRE}>ACTINVER</text>
        <path d="M400 990 L620 990" stroke={OCRE} strokeWidth={10} strokeDasharray="22 18" strokeDashoffset={-f * 3} />
        <path d="M600 960 L640 990 L600 1020" fill="none" stroke={OCRE} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
        {[0, 0.33, 0.66].map((o, i) => {
          const p = (mv + o) % 1;
          return (
            <g key={i} transform={`translate(${400 + p * 220} ${990 - Math.sin(p * Math.PI) * 70})`} opacity={Math.sin(p * Math.PI)}>
              <circle r={30} fill={OCRE} />
              <text textAnchor="middle" y={12} fontFamily={FONT} fontWeight={700} fontSize={34} fill={NAVY}>$</text>
            </g>
          );
        })}
      </Svg>
      <Pill text="SIN PERMISO DE TU EMPRESA" x={540} y={1340} k={tag} size={50} />
    </AbsoluteFill>
  );
};
const Gratis: React.FC<P> = ({f, at}) => {
  const a = sp(f, 2, 10, 180);
  const c = ease((f - at(16)) / 12);
  return (
    <AbsoluteFill>
      <Head light="El cambio" bold="es gratis" f={f} dark={false} />
      <Svg>
        <g transform={`translate(540 1000) scale(${a})`}>
          <circle r={250} fill={OCRE} />
          <circle r={215} fill="none" stroke="rgba(4,30,66,0.25)" strokeWidth={8} />
          <text textAnchor="middle" y={70} fontFamily={FONT} fontWeight={700} fontSize={220} fill={NAVY}>$0</text>
        </g>
        <g transform="translate(760 820)" opacity={c}>
          <circle r={70} fill={WARM} />
          <path d="M-32 2 L-8 26 L34 -22" fill="none" stroke={NAVY} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - c} />
        </g>
      </Svg>
      <Pill text="SIN COSTO" x={540} y={1340} k={sp(f, at(16) - 4, 11, 200)} c={WARM} />
    </AbsoluteFill>
  );
};
const App: React.FC<P> = ({f, dark}) => (
  <AbsoluteFill>
    <Step text="Desde tu app Actinver" f={f} dark={dark} />
    <Phone f={f} img="home" enter dark={dark} />
  </AbsoluteFill>
);
const Perfil: React.FC<P> = ({f, at, dark}) => (
  <AbsoluteFill>
    <Step n="1" text="Toca tu perfil" f={f} dark={dark} />
    <Phone f={f} img="home" focus={[130, 226]} zoom={1.9} zAt={2} taps={[{x: 130, y: 226, at: at(25)}]} boxes={[{x0: 40, y0: 140, x1: 222, y1: 312, at: at(26)}]} dark={dark} />
  </AbsoluteFill>
);
const Menu: React.FC<P> = ({f, at, dark}) => (
  <AbsoluteFill>
    <Step n="2" text="Portabilidad de nómina" f={f} dark={dark} />
    <Phone f={f} img="menu" focus={[600, 801]} zoom={1.35} zAt={2} boxes={[{x0: 60, y0: 750, x1: 1140, y1: 852, at: at(32) - 4}]} taps={[{x: 960, y: 801, at: at(34)}]} dark={dark} />
  </AbsoluteFill>
);
const Benef: React.FC<P> = ({f, at, dark}) => (
  <AbsoluteFill>
    <Step text="Sin costo y con beneficios" f={f} dark={dark} />
    <Phone f={f} img="porta" focus={[603, 880]} zoom={1.3} zAt={2} boxes={[{x0: 120, y0: 650, x1: 1010, y1: 712, at: at(36)}, {x0: 120, y0: 1065, x1: 1100, y1: 1130, at: at(42)}]} dark={dark} />
  </AbsoluteFill>
);
const Bancos: React.FC<P> = ({f, at, dark}) => {
  const sw = at(47) + 6;
  return (
    <AbsoluteFill>
      <Step n="3" text="Revisa que tu banco esté" f={f} dark={dark} />
      <Phone f={f} img="porta" img2="bancos" swap={sw} focus={[603, 1300]} taps={[{x: 604, y: 2139, at: at(46)}]} boxes={[{x0: 230, y0: 2105, x1: 980, y1: 2175, at: at(45), to: sw}, {x0: 160, y0: 580, x1: 560, y1: 648, at: at(52)}]} dark={dark} />
    </AbsoluteFill>
  );
};
const Mitad: React.FC<P> = ({f, at}) => {
  const k = sp(f, 3, 9, 170);
  const pulse = 1 + 0.03 * Math.sin(f / 4);
  return (
    <AbsoluteFill>
      <Head light="Ahora viene" bold="lo importante" f={f} dark={false} top={300} />
      <div style={{position: 'absolute', left: 540, top: 1050, transform: `translate(-50%,-50%) scale(${k * pulse})`, background: OCRE, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 96, padding: '34px 80px', borderRadius: 120, boxShadow: '0 30px 70px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', gap: 28}}>
        <svg width={90} height={90} viewBox="0 0 48 48"><circle cx={24} cy={16} r={9} fill={NAVY} /><path d="M6 44 C6 30 16 26 24 26 C32 26 42 30 42 44Z" fill={NAVY} /></svg>
        SÍGUEME
      </div>
      <Pill text="+" x={850} y={900} k={sp(f, at(57) + 6, 10, 220)} c={WARM} size={70} />
    </AbsoluteFill>
  );
};
const Traer: React.FC<P> = ({f, at, dark}) => (
  <AbsoluteFill>
    <Step n="4" text="Traer nómina a Actinver" f={f} dark={dark} />
    <Phone f={f} img="porta" focus={[603, 1405]} zoom={1.45} zAt={2} boxes={[{x0: 130, y0: 1335, x1: 1075, y1: 1478, at: at(64)}]} taps={[{x: 940, y: 1405, at: at(66)}]} dark={dark} />
  </AbsoluteFill>
);
const Confirma: React.FC<P> = ({f, at, dark}) => (
  <AbsoluteFill>
    <Step n="5" text="Confirma tus datos" f={f} dark={dark} />
    <Phone f={f} img="valida" focus={[603, 2150]} zoom={1.4} zAt={2} boxes={[{x0: 250, y0: 1790, x1: 960, y1: 1915, at: at(68)}]} taps={[{x: 872, y: 2258, at: at(70)}]} dark={dark} />
    <Pill text="Tus datos van tapados" x={540} y={1480} k={sp(f, 10, 12, 200) * 0.75} c={WARM} size={40} />
  </AbsoluteFill>
);
const Clabe: React.FC<P> = ({f, at, dark}) => {
  const typed = Math.max(0, Math.min(18, Math.floor((f - at(73)) / 1.6)));
  return (
    <AbsoluteFill>
      <Step n="6" text="La CLABE de tu nómina actual" f={f} dark={dark} />
      <Phone f={f} img="clabe" focus={[600, 960]} zoom={1.3} zAt={2} boxes={[{x0: 100, y0: 890, x1: 1096, y1: 1033, at: at(72)}]} dark={dark}>
        <div style={{position: 'absolute', left: 125 * K, top: 952 * K, fontFamily: 'monospace', fontSize: 30, letterSpacing: 1, color: NAVY}}>{'•'.repeat(typed)}</div>
      </Phone>
      <Pill text="18 DÍGITOS" x={540} y={1495} k={sp(f, at(80) - 3, 11, 200)} />
    </AbsoluteFill>
  );
};
const Pasos: React.FC<P> = ({f, at, dark}) => (
  <AbsoluteFill>
    <Step text="Sigue los 3 pasos de la app" f={f} dark={dark} />
    <Phone f={f} img="clabe" focus={[300, 280]} zoom={1.25} zAt={2} boxes={[{x0: 60, y0: 200, x1: 900, y1: 360, at: at(85)}]} dark={dark} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 1450, display: 'flex', justifyContent: 'center', gap: 40}}>
      {['1', '2', '3'].map((n, i) => {
        const k = sp(f, at(85) + i * 5, 11, 200);
        return <div key={n} style={{width: 96, height: 96, borderRadius: 48, background: i === 0 ? OCRE : WARM, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${k})`, boxShadow: '0 10px 30px rgba(0,0,0,0.2)'}}>{n}</div>;
      })}
    </div>
  </AbsoluteFill>
);
const Plazo: React.FC<P> = ({f, at, dark}) => {
  const k = sp(f, 3, 11, 170);
  const n = Math.round(10 * ease((f - at(97)) / 18));
  return (
    <AbsoluteFill>
      <Head light="Máximo" bold="10 días hábiles" f={f} dark={dark} />
      <Svg>
        <g transform={`translate(540 1010) scale(${k})`}>
          <rect x={-230} y={-210} width={460} height={440} rx={44} fill="#fff" stroke={NAVY} strokeWidth={10} />
          <rect x={-230} y={-210} width={460} height={110} rx={44} fill={NAVY} />
          <rect x={-230} y={-140} width={460} height={40} fill={NAVY} />
          {[-120, 120].map((x) => <rect key={x} x={x - 14} y={-250} width={28} height={80} rx={14} fill={OCRE} />)}
          <text textAnchor="middle" y={130} fontFamily={FONT} fontWeight={700} fontSize={230} fill={NAVY}>{n}</text>
        </g>
      </Svg>
      <Pill text="DÍAS HÁBILES" x={540} y={1340} k={sp(f, at(100) - 3, 11, 200)} />
    </AbsoluteFill>
  );
};
const Estatus: React.FC<P> = ({f, at, dark}) => (
  <AbsoluteFill>
    <Step text="Revisa cómo va" f={f} dark={dark} />
    <Phone f={f} img="porta" img2="estatus" swap={at(105) + 6} focus={[603, 1835]} zoom={1.3} zAt={2} boxes={[{x0: 330, y0: 1800, x1: 875, y1: 1870, at: at(104) - 4, to: at(105) + 6}]} taps={[{x: 603, y: 1835, at: at(105)}]} dark={dark} />
  </AbsoluteFill>
);
const Credito: React.FC<P> = ({f, at}) => {
  const k = sp(f, 3, 10, 180);
  const c = sp(f, at(114), 12, 200);
  return (
    <AbsoluteFill>
      <Svg>
        <g transform={`translate(540 560) scale(${k})`}>
          <path d="M0 -190 L200 160 L-200 160Z" fill={OCRE} stroke={WARM} strokeWidth={10} strokeLinejoin="round" />
          <rect x={-16} y={-80} width={32} height={140} rx={16} fill={NAVY} />
          <circle cy={112} r={20} fill={NAVY} />
        </g>
      </Svg>
      <div style={{position: 'absolute', left: 90, right: 90, top: 860, textAlign: 'center', fontFamily: FONT, color: WARM, opacity: cl(c * 1.5), transform: `translateY(${(1 - c) * 40}px)`}}>
        <div style={{fontWeight: 300, fontSize: 64, textTransform: 'uppercase'}}>Si tienes</div>
        <div style={{fontWeight: 700, fontSize: 92, color: OCRE, textTransform: 'uppercase', lineHeight: 1.05}}>crédito de nómina</div>
        <div style={{fontWeight: 500, fontSize: 48, marginTop: 40, lineHeight: 1.25, opacity: ease((f - at(117)) / 10)}}>tu banco actual puede retener ese pago</div>
      </div>
    </AbsoluteFill>
  );
};
const Escribe: React.FC<P> = ({f, at}) => {
  const k = sp(f, at(127) - 4, 10, 180);
  return (
    <AbsoluteFill>
      <Head light="¿Ya tienes tu nómina" bold="en Actinver?" f={f} dark={false} size={84} top={300} />
      <div style={{position: 'absolute', left: 540, top: 1060, transform: `translate(-50%,-50%) scale(${k})`, background: WARM, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 84, padding: '30px 70px', borderRadius: 120, display: 'flex', alignItems: 'center', gap: 26, boxShadow: '0 30px 70px rgba(0,0,0,0.35)'}}>
        <svg width={86} height={86} viewBox="0 0 48 48"><path d="M6 10 H42 V34 H20 L10 42 V34 H6Z" fill={NAVY} /><circle cx={16} cy={22} r={3} fill={WARM} /><circle cx={24} cy={22} r={3} fill={WARM} /><circle cx={32} cy={22} r={3} fill={WARM} /></svg>
        ESCRÍBEME
      </div>
    </AbsoluteFill>
  );
};
const End: React.FC<P> = ({f, at}) => {
  const k = sp(f, at(133) - 4, 10, 180);
  const pulse = 1 + 0.025 * Math.sin(f / 5);
  return (
    <AbsoluteFill>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 540 - 230, top: 470, width: 460, opacity: ease(f / 10)}} />
      <div style={{position: 'absolute', left: 540, top: 1000, transform: `translate(-50%,-50%) scale(${k * pulse})`, background: OCRE, color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 96, padding: '34px 84px', borderRadius: 120, boxShadow: '0 30px 70px rgba(0,0,0,0.35)'}}>SÍGUEME</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1180, textAlign: 'center', fontFamily: FONT, fontWeight: 500, fontSize: 44, color: WARM, opacity: ease((f - at(135)) / 10)}}>más trucos de tu app Actinver</div>
      <div style={{position: 'absolute', left: 80, right: 80, bottom: 70, textAlign: 'center', fontFamily: FONT, fontSize: 24, lineHeight: 1.4, color: 'rgba(245,243,238,0.78)'}}>
        Trámite de portabilidad de nómina gratuito. Capturas de la app Actinver con datos personales ocultos. Consulta términos y condiciones de los productos en actinver.com
      </div>
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC<P>> = {hook: Hook, gratis: Gratis, app: App, perfil: Perfil, menu: Menu, benef: Benef, bancos: Bancos, mitad: Mitad, traer: Traer, confirma: Confirma, clabe: Clabe, pasos: Pasos, plazo: Plazo, estatus: Estatus, credito: Credito, escribe: Escribe, end: End};
const PHONE = new Set(['app', 'perfil', 'menu', 'benef', 'bancos', 'traer', 'confirma', 'clabe', 'pasos', 'estatus']);

const Scene: React.FC<{idx: number}> = ({idx}) => {
  const f = useCurrentFrame();
  const s0 = starts[idx];
  const g = s0 + f;
  const at = (i: number) => F(TW(i)) - s0;
  const sc = SC[idx];
  const dark = THEMES[sc.bg].light;
  const next = idx < SC.length - 1 ? starts[idx + 1] : totalF;
  // golpe de cámara suave en palabras clave (no en escenas con teléfono: ahí manda el zoom de la captura)
  const keys = words.filter((w) => w.k && F(w.s) >= s0 && F(w.s) < next).map((w) => F(w.s) - 2);
  let last = -999;
  keys.forEach((kf) => {
    if (kf <= g) last = kf;
  });
  const ph = PHONE.has(sc.k);
  const punch = ph || sc.k === 'end' ? 0 : 0.06 * Math.exp(-(g - last) / 4);
  const z = ph ? 1 : 1 + 0.03 * (f / Math.max(1, next - s0));
  const C = MAP[sc.k];
  return (
    <AbsoluteFill>
      <ThemeBg n={sc.bg} f={g} />
      <Particles f={g} dark={dark} seed={sc.k} />
      <AbsoluteFill style={{transform: `scale(${z + punch})`, transformOrigin: '540px 860px'}}>
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
            <span key={w.i} style={{fontFamily: FONT, fontWeight: 700, fontSize: 68, lineHeight: 1.15, color: on ? NAVY : w.k ? OCRE : WARM, background: on ? OCRE : 'transparent', borderRadius: 14, padding: '0 10px', display: 'inline-block'}}>
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const Nomina: React.FC = () => {
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
      {cur.k !== 'end' && <Img src={staticFile(light ? 'logo_azul.png' : 'logo_blanco.png')} style={{position: 'absolute', right: 60, top: 70, width: 210}} />}
      {cur.k !== 'end' && <div style={{position: 'absolute', left: 80, top: 82, fontFamily: FONT, fontWeight: 600, fontSize: 26, letterSpacing: 6, color: OCRE}}>TUTORIAL APP</div>}
      {t < LAST.e + 0.3 && <Captions t={t} f={f} />}
      <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: W * cl(t / AU_TOTAL), background: OCRE}} />
      <Audio src={staticFile('nomina/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

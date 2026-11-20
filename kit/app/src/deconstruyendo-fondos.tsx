// DECONSTRUYENDO LAS FINANZAS — guion 1 COMPLETO («los fondos de inversión») en UNA SOLA ANIMACIÓN CONTINUA (sin cortes ni cambios de escena)
// Apertura (bloques 0–5) como en deconstruyendo-continuo.tsx; después, 23 estaciones en el mismo camino (kit/scripts/pro/estaciones_fondos.py).
// Paleta de la serie: Abyss #014E6A · Nebula #28AFCB · Pulse #FF3D8E
// Un solo mundo: la persona saca su dinero, camina hasta una barrera, llegan más personas, juntan el dinero y la barrera se abre.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/deconstruyendo-fondos/words.json';
import est from '../public/deconstruyendo-fondos/estaciones.json';
import {Backdrop, Brand, Captions, FONT, FPS, Frame, Grain, Mask, P, Wd, buildGroups, cl, lerp, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const DECOF_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
// Los tiempos de movimiento se escribieron sobre la voz Kokoro (KOK = inicio de cada palabra); W() los lleva a la voz actual palabra por palabra.
const KOK = [0.26, 0.56, 0.86, 1.2, 1.44, 1.7, 1.88, 2.1, 2.82, 2.98, 3.3, 3.66, 3.9, 4.54, 4.66, 5, 5.98, 6.22, 6.42, 6.74, 6.96, 7.24, 7.52, 8.06, 8.18, 8.32, 8.64, 8.96, 9.28, 9.92, 10.24, 10.52, 10.72, 11.84, 12.14, 12.38, 12.76, 12.98, 13.4, 14.2, 14.44, 14.62, 14.92, 15.08, 15.44, 16.1, 16.34, 16.72, 17.06, 17.48, 17.76, 18];
const W = (t: number) => {
  const n = KOK.length;
  if (t <= KOK[0]) return t - KOK[0] + words[0].s;
  for (let i = 1; i < n; i++) if (t <= KOK[i]) return lerp(words[i - 1].s, words[i].s, (t - KOK[i - 1]) / (KOK[i] - KOK[i - 1]));
  return t - KOK[n - 1] + words[n - 1].s;
};
const groups = buildGroups(words, blocks);
const KEYS = ['TÍTULOS', 'FONDO', 'OPERADORA', 'POLÍTICA', 'CUSTODIO', 'REGISTRO', 'COMITÉ', 'CUMPLIMIENTO', 'PRECIO', 'VALUACIÓN', 'PROVEEDOR', 'BOLSA', 'SUSCRIPCIÓN', 'REEMBOLSO', 'LÍQUIDOS', 'CORTE', 'LIQUIDACIÓN', 'COMISIÓN', 'REINVERSIÓN', 'RETENCIÓN', 'CONSTANCIA', 'PROSPECTO', 'REGULADOR', 'DINERO', 'CREZCA', 'INVERSIONISTA', 'ACCIONES', 'CARAS', 'ALCANZA', 'SOCIEDAD', 'INVERSIÓN'];

/* ---------------- paleta ---------------- */
const C = {
  abyss: '#014E6A', abyssD: '#012F40', abyssDD: '#011E2B',
  nebula: '#28AFCB', nebulaL: '#8FE0F0', nebulaLL: '#D8F5FB',
  pulse: '#FF3D8E', pulseD: '#C42A6C', pulseL: '#FFB3D1',
  white: '#FFFFFF', ink: '#011E2B', mute: 'rgba(255,255,255,0.62)',
};
const BRAND = {accent: C.pulse, accentDeep: C.pulseD, logo: false};

/* ---------------- mundo ---------------- */
const S = 0.85; // escala del mundo: cabe más escena en pantalla
const GY = 1330; // suelo (coordenadas del mundo) → y de pantalla ≈ 1130
const TUBE_X = 1600;
const GATE_X = 1830;
const MARKET_X = 2230;

const sm = (x: number) => {
  const k = cl(x);
  return k * k * (3 - 2 * k);
};
/** posición con arranque y frenado suaves (perfil trapezoidal de velocidad) */
const motion = (t: number, t0: number, t1: number, x0: number, x1: number, rin = 0.4, rout = 0.5) => {
  const L = t1 - t0;
  const D = x1 - x0;
  const v = D / (L - (rin + rout) / 2);
  const tau = cl(t - t0, 0, L);
  let d: number;
  if (tau < rin) d = (v * tau * tau) / (2 * rin);
  else if (tau < L - rout) d = (v * rin) / 2 + v * (tau - rin);
  else {
    const u = L - tau;
    d = D - (v * u * u) / (2 * rout);
  }
  return x0 + d;
};

/* ---------------- guion de movimiento (todo ligado a las palabras) ---------------- */
type WalkerSpec = {
  id: string;
  t0: number; t1: number; x0: number; x1: number; rin?: number; rout?: number;
  shirt: string; shirtD: string; skin: string; hair: string;
  rel: number[]; // instantes en que suelta una moneda hacia el tubo
  holdFrom: number; // desde cuándo lleva las monedas en la mano
  pick?: number[]; // monedas que saca del bolsillo (solo el protagonista)
};
const CHEER = T(49);
const MAIN: WalkerSpec = {
  id: 'main', t0: W(2.0), t1: W(9.1), x0: 250, x1: 1480, rin: 0.5, rout: 0.6,
  shirt: C.pulse, shirtD: C.pulseD, skin: '#F2D3B8', hair: '#1B1530',
  rel: [W(10.25), W(10.38), W(10.51)], holdFrom: W(1.2), pick: [W(1.1), W(1.35), W(1.6)],
};
const OTHERS: WalkerSpec[] = [
  {id: 'A', t0: W(10.7), t1: W(12.6), x0: 990, x1: 1375, rin: 0.2, rout: 0.35, shirt: '#F4FAFC', shirtD: '#BCD3DA', skin: '#D9A27E', hair: '#2B1B12', rel: [W(12.8), W(12.93), W(13.06)], holdFrom: -9},
  {id: 'B', t0: W(11.7), t1: W(13.6), x0: 990, x1: 1285, rin: 0.2, rout: 0.35, shirt: C.nebulaL, shirtD: '#4FB7CF', skin: '#A66E4B', hair: '#120C0A', rel: [W(13.85), W(13.98), W(14.11)], holdFrom: -9},
  {id: 'C', t0: W(12.9), t1: W(14.55), x0: 990, x1: 1195, rin: 0.2, rout: 0.35, shirt: C.pulseL, shirtD: '#E88FB4', skin: '#F0C8A0', hair: '#5B3A1E', rel: [W(14.8), W(14.93), W(15.06)], holdFrom: -9},
];
const ALL = [MAIN, ...OTHERS];
const FLIGHT = 0.55; // vuelo de la moneda hasta el tubo
const LANDINGS = ALL.flatMap((w) => w.rel.map((r) => r + FLIGHT)).sort((a, b) => a - b);
const NEED = LANDINGS.length; // 12 monedas = precio
const GATE_DROP = W(8.55); // la barrera baja justo antes de «caras»
const GATE_RISE = LANDINGS[NEED - 1] + 0.1;
const ST = est.estaciones;
const WALK = 2.3; // lo que tarda la caravana en llegar a cada estación
const DIST = 800;
/** desplazamiento de la caravana (los 4 inversionistas y el fondo) después de la apertura */
const shiftAt = (t: number) => ST.reduce((a, q) => a + motion(t, q.ws, q.ws + WALK, 0, DIST, 0.5, 0.6), 0);
const CH_OFF = ST[0].ws - 0.3; // aquí terminan los festejos y empiezan a caminar
const camAt = (t: number) => Math.max(0, motion(t, MAIN.t0, MAIN.t1, MAIN.x0, MAIN.x1, MAIN.rin, MAIN.rout) + shiftAt(t) - 430);

/* ---------------- pose de cada personaje ---------------- */
const pose = (w: WalkerSpec, t: number) => {
  const xOf = (u: number) => motion(u, w.t0, w.t1, w.x0, w.x1, w.rin ?? 0.4, w.rout ?? 0.5) + shiftAt(u) - (w.id === 'C' ? exitOff(u) : 0);
  const x = xOf(t);
  const speed = Math.abs(xOf(t + 0.03) - xOf(t - 0.03)) / 0.06;
  const amp = cl(speed / 60);
  const a = Math.sin(((x - w.x0) * 2 * Math.PI) / 190) * 0.52 * amp;
  const aDeg = (a * 180) / Math.PI;
  const relFirst = w.rel[0];
  const relLast = w.rel[w.rel.length - 1];
  const hold = sm(prog(t, w.holdFrom, w.holdFrom + 0.3)) * (1 - sm(prog(t, relLast, relLast + 0.4)));
  const lift = sm(prog(t, relFirst - 0.28, relFirst)) * (1 - sm(prog(t, relLast + 0.05, relLast + 0.4)));
  const cheer = sm(prog(t, CHEER, CHEER + 0.3)) * (1 - sm(prog(t, CH_OFF, CH_OFF + 0.3)));
  let armF = aDeg * 0.8 + Math.sin(t * 2.3 + x) * 2 * (1 - amp);
  armF = lerp(armF, -65, hold);
  armF = lerp(armF, -125, lift);
  armF = lerp(armF, -168, cheer);
  if (w.id === 'C') armF = lerp(armF, -62, sm(prog(t, Q(19).solve + 0.45, Q(19).solve + 0.6)));
  let armB = -aDeg * 0.8;
  armB = lerp(armB, -158, cheer);
  const hop = cheer * 24 * Math.abs(Math.sin((t - CHEER) * Math.PI * 1.7));
  const bob = (1 - amp) * Math.sin(t * 3 + x * 0.01) * 3 + amp * Math.abs(Math.sin(((x - w.x0) * Math.PI) / 190)) * 7;
  return {x, a, armF, armB, hop, bob, hold: hold > 0.5};
};
const handPos = (x: number, armDeg: number) => {
  const r = (armDeg * Math.PI) / 180;
  const L = 134;
  return {x: x + -L * Math.sin(r), y: GY - 250 + L * Math.cos(r)};
};

/* ---------------- dibujo: personaje (vista lateral, mira a la derecha) ---------------- */
type Look = Pick<WalkerSpec, 'shirt' | 'shirtD' | 'skin' | 'hair'>;
const Figure: React.FC<{x: number; spec: Look; p: ReturnType<typeof pose>; flip?: boolean; badge?: string}> = ({x, spec, p, flip = false, badge}) => {
  const aD = (p.a * 180) / Math.PI;
  const pants = C.abyssDD;
  return (
    <svg style={{position: 'absolute', left: x - 120, top: GY - 420 - p.hop - p.bob, overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}} width={240} height={440} viewBox="-120 -420 240 440">
      <ellipse cx={0} cy={6 + p.hop + p.bob} rx={74} ry={11} fill="rgba(0,0,0,0.35)" />
      <g transform={`rotate(${p.armB} 0 -250)`}>
        <rect x={-12} y={-252} width={24} height={124} rx={12} fill={spec.shirtD} />
        <circle cx={0} cy={-122} r={15} fill={spec.skin} />
      </g>
      <g transform={`rotate(${aD} 0 -100)`}>
        <rect x={-15} y={-104} width={30} height={106} rx={14} fill={pants} />
        <rect x={-14} y={-12} width={46} height={16} rx={8} fill={C.nebulaLL} />
      </g>
      <g transform={`rotate(${-aD} 0 -100)`}>
        <rect x={-15} y={-104} width={30} height={106} rx={14} fill="#023A50" />
        <rect x={-14} y={-12} width={46} height={16} rx={8} fill={C.white} />
      </g>
      <rect x={-50} y={-272} width={100} height={180} rx={46} fill={spec.shirt} />
      <rect x={-50} y={-272} width={100} height={180} rx={46} fill="url(#fsh)" />
      {badge && <rect x={6} y={-236} width={30} height={22} rx={5} fill={badge} stroke={C.white} strokeWidth={3} />}
      <circle cx={8} cy={-322} r={46} fill={spec.skin} />
      <ellipse cx={4} cy={-352} rx={46} ry={26} fill={spec.hair} />
      <circle cx={32} cy={-324} r={5.5} fill={C.ink} />
      <g transform={`rotate(${p.armF} 0 -250)`}>
        <rect x={-12} y={-252} width={24} height={124} rx={12} fill={spec.shirt} />
        <rect x={-12} y={-252} width={24} height={124} rx={12} fill="url(#fsh)" />
        <circle cx={0} cy={-122} r={15} fill={spec.skin} />
      </g>
      <defs>
        <linearGradient id="fsh" x1="0" x2="1">
          <stop offset="0" stopColor="rgba(1,30,43,0)" />
          <stop offset="1" stopColor="rgba(1,30,43,0.22)" />
        </linearGradient>
      </defs>
    </svg>
  );
};

/* ---------------- monedas ---------------- */
const CoinFlat: React.FC<{x: number; y: number; r?: number; rot?: number}> = ({x, y, r = 24, rot = 0}) => (
  <svg style={{position: 'absolute', left: x - r, top: y - r, overflow: 'visible'}} width={r * 2} height={r * 2} viewBox="-24 -24 48 48">
    <g transform={`rotate(${rot})`}>
      <circle r={23} fill={C.nebula} />
      <circle r={23} fill="none" stroke={C.abyss} strokeWidth={3} />
      <circle r={15} fill="none" stroke={C.nebulaLL} strokeWidth={3} opacity={0.8} />
      <text x={0} y={7} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={19} fill={C.abyss}>$</text>
    </g>
  </svg>
);
const HandCoins: React.FC<{x: number; y: number; n: number}> = ({x, y, n}) => (
  <svg style={{position: 'absolute', left: x - 34, top: y - 60, overflow: 'visible'}} width={68} height={80} viewBox="-34 -60 68 80">
    {Array.from({length: n}, (_, k) => {
      const yy = 4 - k * 11;
      return (
        <g key={k}>
          <rect x={-26} y={yy} width={52} height={11} fill={C.abyss} />
          <ellipse cx={0} cy={yy + 11} rx={26} ry={8} fill={C.abyss} />
          <ellipse cx={0} cy={yy} rx={26} ry={8} fill={C.nebula} />
          <ellipse cx={0} cy={yy} rx={17} ry={5} fill="none" stroke={C.nebulaLL} strokeWidth={2} />
        </g>
      );
    })}
  </svg>
);

/* ---------------- tubo con la línea del precio ---------------- */
const COIN_H = 34;
const LINE_Y = -18 - NEED * COIN_H - 4;
const Tube: React.FC<{n: number; t: number; f: number; dx?: number}> = ({n, t, f, dx = 0}) => {
  const full = n >= NEED;
  const lastLand = [...LANDINGS].filter((l) => l <= t).pop() ?? -9;
  const pop = 1 + 0.22 * Math.exp(-(t - lastLand) * 11) * (t >= lastLand ? 1 : 0);
  const flash = t > T(31) - 0.05 && n < NEED ? 0.55 + 0.45 * Math.sin(f / 3) : 1;
  const top = -18 - n * COIN_H;
  return (
    <svg style={{position: 'absolute', left: TUBE_X + dx - 120, top: GY - 560, overflow: 'visible'}} width={240} height={580} viewBox="-120 -560 240 580">
      <ellipse cx={0} cy={8} rx={100} ry={12} fill="rgba(0,0,0,0.35)" />
      <rect x={-76} y={-492} width={152} height={492} rx={34} fill="rgba(255,255,255,0.07)" stroke={full ? C.nebulaL : 'rgba(255,255,255,0.5)'} strokeWidth={full ? 7 : 5} style={{filter: full ? `drop-shadow(0 0 22px ${C.nebula})` : undefined}} />
      {Array.from({length: n}, (_, k) => {
        const y = -18 - k * COIN_H - COIN_H + 8;
        const s = k === n - 1 ? pop : 1;
        return (
          <g key={k} transform={`translate(0 ${y + COIN_H}) scale(${s}) translate(0 ${-(y + COIN_H)})`}>
            <rect x={-54} y={y} width={108} height={COIN_H - 10} fill={C.abyss} />
            <ellipse cx={0} cy={y + COIN_H - 10} rx={54} ry={12} fill={C.abyss} />
            <ellipse cx={0} cy={y} rx={54} ry={12} fill={C.nebula} />
            <ellipse cx={0} cy={y} rx={36} ry={7} fill="none" stroke={C.nebulaLL} strokeWidth={2.5} />
          </g>
        );
      })}
      <line x1={-100} x2={100} y1={LINE_Y} y2={LINE_Y} stroke={C.pulse} strokeWidth={6} strokeDasharray="16 12" opacity={flash} />
      <text x={0} y={LINE_Y - 76} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} letterSpacing="0.14em" fill={C.pulse} opacity={flash}>PRECIO</text>
      {n <= 3 && t > T(29) && (
        <g opacity={cl((t - T(29)) * 2)}>
          <line x1={0} x2={0} y1={top - 14} y2={LINE_Y + 14} stroke={C.pulse} strokeWidth={5} strokeDasharray="4 10" />
          <path d={`M0 ${LINE_Y + 8} l-12 18 h24z`} fill={C.pulse} />
          <text x={0} y={(top + LINE_Y) / 2 + 12} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={38} fill={C.pulse} style={{paintOrder: 'stroke', stroke: C.abyssDD, strokeWidth: 8}}>FALTA</text>
        </g>
      )}
    </svg>
  );
};

/* ---------------- barrera: cortina metálica que baja y sube ---------------- */
const SH_H = 600;
const Gate: React.FC<{hh: number}> = ({hh}) => (
  <svg style={{position: 'absolute', left: GATE_X - 180, top: GY - 700, overflow: 'visible'}} width={360} height={720} viewBox="-180 -700 360 720">
    <defs>
      <pattern id="hz" width={36} height={36} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width={18} height={36} fill={C.pulse} />
        <rect x={18} width={18} height={36} fill={C.abyssDD} />
      </pattern>
      <clipPath id="shc"><rect x={-135} y={-648} width={270} height={Math.max(0, hh)} /></clipPath>
    </defs>
    <ellipse cx={0} cy={8} rx={170} ry={12} fill="rgba(0,0,0,0.35)" />
    <rect x={-180} y={-660} width={40} height={660} rx={8} fill={C.abyssDD} />
    <rect x={140} y={-660} width={40} height={660} rx={8} fill={C.abyssDD} />
    <rect x={-180} y={-700} width={360} height={52} rx={12} fill="url(#hz)" />
    <rect x={-180} y={-700} width={360} height={52} rx={12} fill="none" stroke={C.abyssDD} strokeWidth={5} />
    <g clipPath="url(#shc)">
      <rect x={-135} y={-648} width={270} height={SH_H} fill="#0A4A63" />
      {Array.from({length: 17}, (_, k) => (
        <rect key={k} x={-135} y={-648 + k * 36} width={270} height={4} fill="rgba(1,30,43,0.55)" />
      ))}
      <text x={0} y={-545} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={46} letterSpacing="0.06em" fill={C.white}>ACCIONES</text>
      <text x={0} y={-440} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={104} fill={C.pulse}>$$$$</text>
    </g>
    <rect x={-135} y={-648 + Math.max(0, hh) - 16} width={270} height={16} fill="url(#hz)" opacity={hh > 6 ? 1 : 0} />
  </svg>
);

/* ---------------- destino: el mercado ---------------- */
const Market: React.FC<{lit: number; f: number}> = ({lit, f}) => (
  <svg style={{position: 'absolute', left: MARKET_X - 230, top: GY - 560, overflow: 'visible', opacity: 0.55 + 0.45 * lit, filter: `saturate(${0.45 + 0.55 * lit})`}} width={460} height={580} viewBox="-230 -560 460 580">
    <ellipse cx={0} cy={8} rx={220} ry={12} fill="rgba(0,0,0,0.35)" />
    <rect x={-190} y={-40} width={380} height={40} fill="#0A4A63" />
    <rect x={-170} y={-300} width={340} height={260} fill="#0C5B79" />
    {[-130, -65, 0, 65, 130].map((cx) => (
      <rect key={cx} x={cx - 17} y={-290} width={34} height={250} rx={8} fill={C.nebulaLL} opacity={0.9} />
    ))}
    <rect x={-170} y={-330} width={340} height={34} fill={C.nebulaL} />
    <path d="M-190 -330 L0 -430 L190 -330Z" fill={C.nebula} />
    <rect x={-150} y={-540} width={300} height={170} rx={22} fill={C.abyssDD} stroke={C.nebula} strokeWidth={6} />
    <text x={0} y={-495} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} letterSpacing="0.16em" fill={C.mute}>MERCADO</text>
    <polyline points="-110,-395 -60,-420 -20,-405 30,-450 80,-440 120,-480" fill="none" stroke={lit > 0.5 ? C.pulse : C.mute} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
    {lit > 0.2 && [-130, -65, 0, 65, 130].map((cx) => <rect key={'w' + cx} x={cx - 8} y={-200} width={16} height={90} rx={8} fill={C.nebulaL} opacity={lit * (0.65 + 0.35 * Math.sin(f / 8 + cx))} />)}
  </svg>
);

/* ---------------- fondo lejano (parallax) y suelo ---------------- */
const SKY = Array.from({length: 40}, (_, k) => ({w: 80 + ((k * 37) % 70), h: 140 + ((k * 91) % 260)}));
const SKY_W = 5200;
const Skyline: React.FC<{cam: number}> = ({cam}) => {
  const off = (cam * S * 0.28) % SKY_W;
  const row = (dx: number) => {
    let x = 0;
    return (
      <div style={{position: 'absolute', left: 0, top: 0, width: SKY_W, height: 1920, transform: `translateX(${dx}px)`}}>
        {SKY.map((b, k) => {
          const left = x;
          x += b.w + 26;
          return <div key={k} style={{position: 'absolute', left, top: 1130 - b.h, width: b.w, height: b.h, background: 'linear-gradient(180deg, rgba(40,175,203,0.16), rgba(40,175,203,0.04))', borderRadius: '10px 10px 0 0'}} />;
        })}
      </div>
    );
  };
  return (
    <>
      {row(-off)}
      {row(SKY_W - off)}
    </>
  );
};
const Ground: React.FC<{l: number; r: number; z: number}> = ({l, r, z}) => {
  const w = r - l;
  const t0 = Math.floor(l / 170) * 170;
  const nT = z > 0.3 ? Math.min(160, Math.ceil(w / 170) + 1) : 0;
  const p0 = Math.floor(l / 640) * 640;
  const nP = Math.min(60, Math.ceil(w / 640) + 1);
  return (
    <>
      <div style={{position: 'absolute', left: l, top: GY, width: w, height: 190 / Math.max(z, 0.2) * 0.85, background: 'linear-gradient(180deg, rgba(1,30,43,0.92), rgba(1,30,43,0))'}} />
      <div style={{position: 'absolute', left: l, top: GY - 2, width: w, height: 5 / Math.min(1, z / 0.85), background: C.nebula, opacity: 0.4}} />
      {Array.from({length: nT}, (_, k) => (
        <div key={k} style={{position: 'absolute', left: t0 + k * 170, top: GY + 44, width: 64, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.12)'}} />
      ))}
      {Array.from({length: nP}, (_, k) => (
        <div key={'p' + k} style={{position: 'absolute', left: p0 + k * 640, top: GY - 380, width: 10, height: 380, background: 'rgba(40,175,203,0.22)', borderRadius: 5}}>
          <div style={{position: 'absolute', left: -9, top: -10, width: 28, height: 28, borderRadius: 14, background: C.nebulaL, opacity: 0.55}} />
        </div>
      ))}
    </>
  );
};

/* ---------------- títulos grandes (cambian de texto, nunca de escena) ---------------- */
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
type Ln = {t: string; size: number; y: number; at: number; color?: string; ls?: number};
type Slot = {a: number; b: number; lines: Ln[]};
const SLOTS: Slot[] = [
  {a: W(0), b: W(2.62), lines: [{t: 'TU', size: 74, y: 230, at: 0, color: C.mute, ls: 0.3}, {t: 'DINERO', size: 190, y: 298, at: 0.05}]},
  {a: W(2.62), b: W(4.96), lines: [{t: 'EN ESE MOMENTO', size: 56, y: 240, at: W(2.7), color: C.mute, ls: 0.22}, {t: 'TÚ', size: 250, y: 300, at: T(11) - 0.08, color: C.white}]},
  {a: W(6.5), b: W(7.42), lines: [{t: 'AL MERCADO', size: 130, y: 280, at: T(19) - 0.1}]},
  {a: W(7.42), b: W(9.82), lines: [{t: 'ACCIONES', size: 150, y: 230, at: T(22) - 0.1}, {t: 'CARAS', size: 150, y: 372, at: T(28) - 0.06, color: C.pulse}]},
  {a: W(9.82), b: W(11.75), lines: [{t: 'TU DINERO', size: 70, y: 240, at: T(29) - 0.05, color: C.mute, ls: 0.12}, {t: 'NO ALCANZA', size: 135, y: 330, at: T(31) - 0.1, color: C.pulse}]},
  {a: W(11.75), b: W(16.0), lines: [{t: 'MÁS', size: 80, y: 250, at: T(33), color: C.mute, ls: 0.2}, {t: 'INVERSIONISTAS', size: 102, y: 340, at: T(37) - 0.1}]},
  {a: W(16.0), b: W(17.15), lines: [{t: 'AHORA YA TIENES', size: 70, y: 280, at: T(45), color: C.mute, ls: 0.12}]},
];
const Titles: React.FC<{t: number}> = ({t}) => (
  <>
    {SLOTS.map((s, i) => {
      if (t < s.a - 0.05 || t > s.b + 0.25) return null;
      const op = 1 - sm(prog(t, s.b, s.b + 0.2));
      return (
        <div key={i} style={{opacity: op}}>
          {s.lines.map((l, k) => (
            <Mask key={k} at={l.at} size={l.size} color={l.color ?? C.white} ls={l.ls ?? -0.02} style={center(l.y)}>
              {l.t}
            </Mask>
          ))}
        </div>
      );
    })}
  </>
);
const StampTitle: React.FC<{at: number; until: number; lines: string[]; size: number; y: number}> = ({at, until, lines, size, y}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const st = spr(f, at, 8, 240, 0.6);
  if (t < at - 0.02 || t > until + 0.25) return null;
  const shake = st > 0.05 && st < 0.95 ? Math.sin(f * 2.4) * 9 * (1 - st) : 0;
  const out = 1 - sm(prog(t, until, until + 0.2));
  return (
    <div style={{...center(y), opacity: cl(st * 3) * out, transform: `translateX(${shake}px) scale(${lerp(2.4, 1, st)}) rotate(-5deg)`}}>
      <div style={{fontFamily: FONT, fontWeight: 800, fontSize: size, letterSpacing: '-0.01em', lineHeight: 1.02, color: C.white, textAlign: 'center', background: C.pulse, padding: '16px 44px 8px', borderRadius: 26, boxShadow: '0 30px 60px rgba(0,0,0,0.5)', border: `8px solid ${C.abyssDD}`, outline: `8px solid ${C.pulse}`}}>
        {lines.map((ln, i) => (
          <div key={i}>{ln}</div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- la animación continua ---------------- */
const World: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const cam = camera(t);
  const vl = cam.cx - 540 / cam.z - 300;
  const vr = cam.cx + 540 / cam.z + 300;
  const mainP = pose(MAIN, t);
  const others = OTHERS.map((w) => ({w, p: pose(w, t)}));
  const n = LANDINGS.filter((l) => l <= t).length + TUBE_DELTA.filter((d) => t >= d.t).reduce((a, d) => a + d.d, 0);
  // barrera: baja antes de «caras» y sube cuando el tubo llega al precio
  const dropP = spr(f, GATE_DROP, 14, 200, 0.55);
  const rise = sm(prog(t, GATE_RISE, GATE_RISE + 0.7));
  const hh = Math.min(SH_H, SH_H * Math.max(0, dropP)) * (1 - rise);
  const impact = t > GATE_DROP + 0.28 && t < GATE_DROP + 0.8 ? Math.sin(f * 3.1) * 9 * Math.exp(-(t - GATE_DROP - 0.28) * 9) : 0;
  const lit = sm(prog(t, GATE_RISE + 0.15, GATE_RISE + 0.9));
  // monedas que salen del bolsillo (protagonista) y que vuelan al tubo
  const pk = MAIN.pick ?? [];
  const arrived = pk.filter((k) => t >= k + 0.28).length;
  const relDone = MAIN.rel.filter((r) => t >= r).length;
  const flying: React.ReactNode[] = [];
  pk.forEach((k, i) => {
    const u = (t - k) / 0.28;
    if (u > 0 && u < 1) {
      const h = handPos(mainP.x, mainP.armF);
      flying.push(<CoinFlat key={'p' + i} x={lerp(mainP.x + 14, h.x, u)} y={lerp(GY - 170, h.y - 10, u) - 60 * 4 * u * (1 - u)} r={18} rot={u * 360} />);
    }
  });
  ALL.forEach((w) => {
    const from = handPos(w.x1, -125);
    w.rel.forEach((r, i) => {
      const u = (t - r) / FLIGHT;
      if (u > 0 && u < 1) flying.push(<CoinFlat key={w.id + i} x={lerp(from.x, TUBE_X, u)} y={lerp(from.y, GY - 500, u) - 190 * 4 * u * (1 - u)} r={22} rot={u * 540} />);
    });
  });
  FLY.forEach((q, i) => {
    const u = (t - q.t0) / q.dur;
    if (u > 0 && u < 1) {
      const x = lerp(q.x0, q.x1, sm(u));
      const y = lerp(q.y0, q.y1, u) - q.arc * 4 * u * (1 - u);
      flying.push(q.kind === 'coin' ? <CoinFlat key={'f' + i} x={x} y={y} r={24} rot={u * 540} /> : <DocIcon key={'f' + i} x={x} y={y} rot={u * 360} />);
    }
  });
  // personas nuevas: D entra por la casa de bolsa; C sale con su reembolso
  const dOn = t >= D_T0;
  const dP = walkP(dX, t);
  const dHold = t < Q(18).solve + 0.2;
  if (dOn && dHold) dP.armF = lerp(dP.armF, -65, 1);
  if (dOn && t > Q(18).solve - 0.25 && t < Q(18).solve + 0.45) dP.armF = -125;
  const cP = others.find((o) => o.w.id === 'C')!;
  const cGone = t > EXIT_T + 5;
  // títulos sobre la cabeza (estación 6) y para D al suscribirse
  const tk6 = Q(6);
  const heads = [mainP, ...others.map((o) => o.p)];
  const ringP = spr(f, CHEER - 0.1, 14, 140, 0.8);
  return (
    <AbsoluteFill style={{transform: `translateX(${impact}px)`}}>
      <div style={{position: 'absolute', inset: 0, opacity: cl((cam.z - 0.35) / 0.35)}}>
        <Skyline cam={cam.cx - 540 / S} />
      </div>
      <div style={{position: 'absolute', left: 0, top: 0, width: 3000, height: 1920, transform: `translate(${540 - cam.cx * cam.z}px, ${cam.gy - GY * cam.z}px) scale(${cam.z})`, transformOrigin: '0 0'}}>
        <Ground l={vl} r={vr} z={cam.z} />
        <div style={{opacity: 1 - sm(prog(t, ST[0].ws, ST[0].ws + 1.4))}}>
          <Market lit={lit} f={f} />
          <Gate hh={hh} />
        </div>
        <Insts t={t} f={f} z={cam.z} vl={vl} vr={vr} />
        <Crowd t={t} />
        <Tube n={n} t={t} f={f} dx={shiftAt(t)} />
        <Stations t={t} f={f} />
        {dOn && <div style={{opacity: cl((t - D_T0) / 0.3)}}><Figure x={dP.x} spec={D_LOOK} p={dP} /></div>}
        {others.map(({w, p}) => (t >= w.t0 - 0.05 && !(w.id === 'C' && cGone) ? <Figure key={w.id} x={p.x} spec={w} p={p} flip={w.id === 'C' && t > EXIT_T - 0.1} /> : null))}
        <Figure x={mainP.x} spec={MAIN} p={mainP} />
        {others.map(({w, p}) => {
          const rl = w.rel.filter((r) => t >= r).length;
          const cnt = t >= w.t0 - 0.05 ? 3 - rl : 0;
          if (cnt <= 0) return null;
          const h = handPos(p.x, p.armF);
          return <HandCoins key={'h' + w.id} x={h.x} y={h.y - p.bob - p.hop} n={cnt} />;
        })}
        {(() => {
          const cnt = Math.max(0, arrived - relDone);
          if (cnt <= 0) return null;
          const h = handPos(mainP.x, mainP.armF);
          return <HandCoins x={h.x} y={h.y - mainP.bob - mainP.hop} n={cnt} />;
        })()}
        {dOn && dHold && (() => { const h = handPos(dP.x, dP.armF); return <HandCoins x={h.x} y={h.y - dP.bob} n={1} />; })()}
        {t > Q(19).solve + 0.55 && !cGone && (() => { const h = handPos(cP.p.x, cP.p.armF); const hx = t > EXIT_T - 0.1 ? 2 * cP.p.x - h.x : h.x; return <HandCoins x={hx} y={h.y - cP.p.bob} n={1} />; })()}
        {t > tk6.solve + 0.6 && t < Q(7).name &&
          heads.map((p, i) => {
            const s = spr(f, tk6.solve + 0.6 + i * 0.22, 12, 200, 0.6);
            return <Ticket key={'tk' + i} x={p.x + 8} y={GY - 470 - p.hop - p.bob} n={3} s={Math.max(0, s) * (1 - sm(prog(t, Q(7).name - 0.4, Q(7).name)))} />;
          })}
        {dOn && t > Q(18).name - 0.1 && t < Q(18).name + 2.4 && <Ticket x={dP.x + 8} y={GY - 470 - dP.bob} n={1} s={Math.max(0, spr(f, Q(18).name - 0.1, 12, 200, 0.6)) * (1 - sm(prog(t, Q(18).name + 2, Q(18).name + 2.4)))} />}
        {flying}
        {t > CHEER - 0.12 && t < CH_OFF + 0.4 && (
          <svg style={{position: 'absolute', left: 1330 + shiftAt(t) - 300, top: GY - 560, overflow: 'visible', opacity: cl(ringP * 2) * (1 - sm(prog(t, CH_OFF, CH_OFF + 0.3)))}} width={600} height={660} viewBox="-300 -560 600 660">
            <ellipse cx={0} cy={-190} rx={280 * lerp(0.7, 1, Math.min(1, ringP))} ry={330 * lerp(0.7, 1, Math.min(1, ringP))} fill="none" stroke={C.nebulaL} strokeWidth={7} strokeDasharray="26 18" strokeDashoffset={-f * 1.4} />
          </svg>
        )}
      </div>
    </AbsoluteFill>
  );
};

const PASOS = [
  {at: T(15), label: 'PIEZA 1'},
  {at: T(49), label: 'PIEZA 2'},
  ...ST.map((q, i) => ({at: q.dock, label: `PIEZA ${i + 3}`})),
];

export const DeconstruyendoFondosMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <Brand value={BRAND}>
    <AbsoluteFill style={{background: C.abyssDD}}>
      <Backdrop moods={[{at: 0, mood: 'abyss'}]} />
      <World />
      <Grain />
      <Frame serie="DECONSTRUYENDO LAS FINANZAS" total={DECOF_TOTAL} pasos={PASOS} nota="Contenido educativo, no es recomendación de inversión." />
      <Rail />
      <DatoCard />
      <TitlesLayer />
      <Captions groups={groups} keys={KEYS} />
      {audio && <Audio src={staticFile('deconstruyendo-fondos/voz_mix.wav')} />}
    </AbsoluteFill>
  </Brand>
);

const TitlesLayer: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const fit = (lines: string[], max: number, w: number) => Math.min(max, w / (Math.max(...lines.map((l) => l.length)) * 0.66));
  return (
    <>
      <Titles t={t} />
      <StampTitle at={T(15) - 0.04} until={T(19) - 0.15} lines={['INVERSIONISTA']} size={84} y={340} />
      <StampTitle at={T(49) - 0.05} until={blocks[6].s + 0.2} lines={['SOCIEDAD DE', 'INVERSIÓN']} size={86} y={290} />
      {ST.map((q, i) => {
        const next = ST[i + 1];
        const sz = fit(q.prob, 150, 880);
        const show = t > q.appear - 0.15 && t < q.solve + 0.4;
        return (
          <React.Fragment key={q.k}>
            {show && (
              <div style={{opacity: 1 - sm(prog(t, q.solve, q.solve + 0.3))}}>
                {q.prob.map((l, j) => (
                  <Mask key={j} at={q.appear - 0.1 + j * 0.12} size={sz} color={C.pulse} ls={-0.02} style={center(240 + j * sz * 1.05)}>
                    {l}
                  </Mask>
                ))}
              </div>
            )}
            <StampTitle at={q.name - 0.05} until={next ? next.appear - 0.2 : est.cierre.lit[0].t + 0.2} lines={q.nom} size={fit(q.nom, 96, 760)} y={290} />
          </React.Fragment>
        );
      })}
      <StampTitle at={est.cierre.fondo - 0.05} until={DECOF_TOTAL + 1} lines={['FONDO DE', 'INVERSIÓN']} size={96} y={290} />
    </>
  );
};

/* ---------------- símbolos de cada pieza (trazo, ±70) ---------------- */
const GL: Record<string, React.ReactNode> = {
  persona: (<><circle cx={0} cy={-30} r={22} /><path d="M-46 58 C-46 6 46 6 46 58Z" /></>),
  grupo: (<><circle cx={-40} cy={-22} r={15} /><circle cx={0} cy={-34} r={18} /><circle cx={40} cy={-22} r={15} /><path d="M-62 46 C-62 14 -20 14 -20 46Z M-24 52 C-24 12 24 12 24 52Z M20 46 C20 14 62 14 62 46Z" /></>),
  pie: (<><circle r={52} /><path d="M0 0V-52 M0 0L50 16 M0 0L-30 44" /></>),
  jar: (<><rect x={-46} y={-28} width={92} height={86} rx={18} /><rect x={-34} y={-52} width={68} height={22} rx={8} /><path d="M-20 10H20 M-20 32H20" /></>),
  gear: (<><circle r={44} strokeDasharray="14 10" strokeWidth={18} /><circle r={22} /></>),
  balanza: (<><path d="M0 -52V50 M-30 52H30 M-52 -30H52" /><path d="M-52 -30L-68 10H-36Z M52 -30L36 10H68Z" /></>),
  caja: (<><rect x={-52} y={-46} width={104} height={92} rx={14} /><circle cx={8} cy={0} r={20} /><path d="M8 -10V10 M-2 0H18" /></>),
  lista: (<><rect x={-44} y={-56} width={88} height={112} rx={10} /><path d="M-26 -28H26 M-26 -4H26 M-26 20H8" /></>),
  ojo: (<><path d="M-62 0Q0 -52 62 0Q0 52 -62 0Z" /><circle r={16} /></>),
  escudo: (<><path d="M0 -58L48 -38V4C48 34 24 52 0 62C-24 52 -48 34 -48 4V-38Z" /><path d="M-20 4L-4 22L24 -14" /></>),
  etiqueta: (<><path d="M-56 2L-6 -50H52V6L2 56Z" /><circle cx={26} cy={-24} r={8} /></>),
  calculadora: (<><rect x={-42} y={-56} width={84} height={112} rx={12} /><rect x={-28} y={-42} width={56} height={22} /><path d="M-22 0H-14 M0 0H8 M22 0H30 M-22 22H-14 M0 22H8 M22 22H30 M-22 42H-14 M0 42H8 M22 42H30" /></>),
  lupa: (<><circle cx={-10} cy={-10} r={34} /><path d="M16 16L52 52" /></>),
  tienda: (<><path d="M-56 -20L-44 -52H44L56 -20Z" /><rect x={-48} y={-20} width={96} height={72} /><rect x={-14} y={10} width={28} height={42} /></>),
  flechaEntra: (<><circle cx={0} cy={26} r={28} /><path d="M0 -58V-8 M-18 -26L0 -8L18 -26" /></>),
  flechaSale: (<><circle cx={0} cy={26} r={28} /><path d="M0 -8V-58 M-18 -40L0 -58L18 -40" /></>),
  gota: (<path d="M0 -58C-40 -4 -46 14 -46 26A46 46 0 0 0 46 26C46 14 40 -4 0 -58Z" />),
  reloj: (<><circle r={52} /><path d="M0 -30V0H24" /></>),
  calendario: (<><rect x={-52} y={-40} width={104} height={96} rx={12} /><path d="M-52 -14H52 M-24 -56V-34 M24 -56V-34" /><circle cx={-22} cy={20} r={4} /><circle cx={6} cy={20} r={4} /><circle cx={34} cy={20} r={4} /></>),
  porcentaje: (<><circle cx={-30} cy={-30} r={16} /><circle cx={30} cy={30} r={16} /><path d="M44 -52L-44 52" /></>),
  ciclo: (<><path d="M-46 -4A46 46 0 0 1 34 -32 M38 -54V-28H12" /><path d="M46 4A46 46 0 0 1 -34 32 M-38 54V28H-12" /></>),
  edificio: (<><path d="M-56 -8L0 -52L56 -8Z" /><path d="M-40 -8V44 M0 -8V44 M40 -8V44 M-58 54H58" /></>),
  recibo: (<><path d="M-40 -56H40V56L26 44L13 56L0 44L-13 56L-26 44L-40 56Z" /><path d="M-22 -28H22 M-22 -4H22 M-22 20H10" /></>),
  libro: (<><path d="M-58 -38Q-28 -52 0 -34V52Q-28 36 -58 48Z" /><path d="M58 -38Q28 -52 0 -34V52Q28 36 58 48Z" /></>),
  bandera: (<path d="M-40 58V-56 M-40 -56H44L28 -30L44 -4H-40" />),
};
const Glyph: React.FC<{id: string; scale: number; stroke: string; sw?: number}> = ({id, scale, stroke, sw = 9}) => (
  <g transform={`scale(${scale})`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {GL[id]}
  </g>
);

/* ---------------- estaciones: letrero del problema → insignia de la solución ---------------- */
const STOP0 = 1480; // donde queda la cabeza de la caravana al terminar la apertura
const PROP_DX = 500; // el letrero está delante de la caravana
const stopX = (k: number) => STOP0 + DIST * (k - 5);
const Station: React.FC<{q: (typeof ST)[number]; t: number; f: number}> = ({q, t, f}) => {
  const x = stopX(q.k) + PROP_DX;
  const ap = spr(f, q.appear, 12, 200, 0.7);
  const flip = sm(prog(t, q.solve, q.solve + 0.45));
  const collapse = sm(prog(t, q.dock + 0.35, q.dock + 0.8));
  const bx = flip < 0.5 ? 1 - flip * 2 : 0;
  const gx = flip >= 0.5 ? spr(f, q.solve + 0.22, 11, 220, 0.6) : 0;
  const bob = Math.sin(f / 12) * 5;
  const sz = Math.min(58, 340 / (Math.max(...q.prob.map((l) => l.length)) * 0.76));
  const burst = prog(t, q.solve + 0.2, q.solve + 0.9);
  return (
    <g transform={`translate(${x} ${GY}) scale(1 ${Math.max(0.001, ap) * (1 - collapse)})`}>
      <ellipse cx={0} cy={8} rx={110} ry={12} fill="rgba(0,0,0,0.35)" opacity={1 - flip} />
      <rect x={-9} y={-340} width={18} height={340} rx={6} fill="#0A4A63" stroke={C.nebula} strokeWidth={2} opacity={1 - flip} />
      <g transform={`translate(0 ${-440 + bob})`}>
        {bx > 0.01 && (
          <g transform={`scale(${bx} 1)`}>
            <rect x={-190} y={-115} width={380} height={230} rx={24} fill={C.pulse} stroke={C.abyssDD} strokeWidth={6} />
            <rect x={-190} y={-115} width={380} height={30} rx={14} fill="url(#hz2)" />
            {q.prob.map((l, i) => (
              <text key={i} x={0} y={8 + (i - (q.prob.length - 1) / 2) * sz * 1.15 + sz * 0.35} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={sz} fill={C.white}>
                {l}
              </text>
            ))}
          </g>
        )}
        {false && gx > 0.01 && t < q.dock && (
          <g transform={`scale(${gx} ${Math.min(1, gx)})`}>
            <circle r={128} fill={C.nebulaLL} stroke={C.nebula} strokeWidth={10} style={{filter: `drop-shadow(0 0 26px ${C.nebula})`}} />
            <Glyph id={q.glyph} scale={1.5} stroke={C.abyss} sw={8} />
          </g>
        )}
        {burst > 0 && burst < 1 && <circle r={110 + burst * 120} fill="none" stroke={C.nebulaL} strokeWidth={8 * (1 - burst)} opacity={1 - burst} />}
      </g>
    </g>
  );
};
const Stations: React.FC<{t: number; f: number}> = ({t, f}) => (
  <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
    <defs>
      <pattern id="hz2" width={36} height={36} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width={18} height={36} fill={C.pulseD} />
        <rect x={18} width={18} height={36} fill={C.abyssDD} />
      </pattern>
    </defs>
    {ST.map((q) => (t > q.appear - 0.3 && t < q.dock + 1 ? <Station key={q.k} q={q} t={t} f={f} /> : null))}
  </svg>
);

/* ---------------- tablero de piezas (medallas): lo que ya tienes armado ---------------- */
const MED = ['persona', 'grupo', ...ST.map((q) => q.glyph)];
const MED_AT = [T(15) + 0.4, T(49) + 0.55, ...ST.map((q) => q.dock)];
const MED_FROM = [{x: 540, y: 380}, {x: 540, y: 400}, ...ST.map(() => ({x: (PROP_DX + 430) * S, y: (GY - 650) * S}))];
const slot = (i: number) => {
  const r = i < 13 ? 0 : 1;
  const c = i < 13 ? i : i - 13;
  const n = r === 0 ? 13 : 12;
  return {x: 540 - ((n - 1) * 62) / 2 + c * 62, y: 1160 + r * 62};
};
const Rail: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  if (t < T(15)) return null;
  const lit = est.cierre.lit as {medal: number; t: number}[];
  const todo = est.cierre.todo;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0}} width={1080} height={1920}>
      {MED.map((g, i) => {
        const sl = slot(i);
        const a = MED_AT[i];
        const fly = prog(t, a, a + 0.75);
        const landed = t >= a + 0.75;
        const e = sm(fly);
        const cx = lerp(MED_FROM[i].x, sl.x, e);
        const cy = lerp(MED_FROM[i].y, sl.y, e) - 150 * 4 * fly * (1 - fly);
        const land = landed ? 1 + 0.35 * Math.exp(-(t - a - 0.75) * 10) : 1;
        const sc = (t < a ? 0 : lerp(2.2, 1, e)) * land;
        const lm = lit.filter((l) => l.medal === i).map((l) => l.t);
        const lt = lm.length ? lm[0] : 99;
        const glow = Math.max(t > lt ? Math.exp(-(t - lt) * 1.6) : 0, t > todo ? Math.exp(-(t - todo) * 1.2) : 0);
        const keep = t > lt || t > todo ? 1 : 0;
        return (
          <g key={i}>
            <circle cx={sl.x} cy={sl.y} r={26} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={2} strokeDasharray="5 6" />
            {t >= a && (
              <g transform={`translate(${cx} ${cy}) scale(${sc})`}>
                <circle r={26} fill={C.abyssDD} stroke={keep || glow > 0.05 ? C.pulse : C.nebula} strokeWidth={3} style={{filter: glow > 0.05 ? `drop-shadow(0 0 ${14 * glow + 2}px ${C.pulse})` : undefined}} />
                <Glyph id={g} scale={0.3} stroke={C.white} sw={9} />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};

/* =====================================================================================
   PRODUCCIÓN 2 (2026-11-20): instituciones en el camino, personal que se suma, datos en pantalla
   y recorrido final por toda la calle. Todo sigue siendo UN SOLO PLANO continuo.
   ===================================================================================== */
const Q = (k: number) => ST.find((q) => q.k === k)!;
const leadX = (t: number) => motion(t, MAIN.t0, MAIN.t1, MAIN.x0, MAIN.x1, MAIN.rin, MAIN.rout) + shiftAt(t);
const instX = (k: number) => stopX(k) + PROP_DX; // la institución aparece detrás del letrero del problema
const tubeTop = (k: number) => ({x: stopX(k) + 120, y: GY - 520});

/* ---- quien entra y quien sale ---- */
const EXIT_T = Q(19).solve + 0.9; // C pide su reembolso y se va
const exitOff = (u: number) => motion(u, EXIT_T, EXIT_T + 5, 0, 2300, 0.5, 0.2);
const D_T0 = Q(17).name + 0.7; // una persona nueva sale de la casa de bolsa
const D_LOOK: Look = {shirt: C.nebula, shirtD: '#1E8FA8', skin: '#C68B62', hair: '#2B1B12'};
const dX = (u: number) => {
  const fr = motion(u, D_T0, D_T0 + 2.1, 0, 1, 0.3, 0.4);
  return lerp(instX(17), leadX(u) - 375, fr) + motion(u, EXIT_T + 1.0, EXIT_T + 2.0, 0, 90, 0.3, 0.3);
};
const walkP = (xf: (u: number) => number, t: number) => {
  const x = xf(t);
  const sp = Math.abs(xf(t + 0.03) - xf(t - 0.03)) / 0.06;
  const amp = cl(sp / 60);
  const a = Math.sin((x * 2 * Math.PI) / 190) * 0.52 * amp;
  const aDeg = (a * 180) / Math.PI;
  return {x, a, armF: aDeg * 0.8 + Math.sin(t * 2.3 + x) * 2 * (1 - amp), armB: -aDeg * 0.8, hop: 0, bob: (1 - amp) * Math.sin(t * 3 + x * 0.01) * 3 + amp * Math.abs(Math.sin((x * Math.PI) / 190)) * 7, hold: false};
};

/* ---- personal que se suma a la caravana (filas de atrás) ---- */
const JOIN = [
  {k: 8, n: 2, role: 'SOCIEDAD OPERADORA', shirt: '#0A4A63'},
  {k: 10, n: 1, role: 'CUSTODIO', shirt: '#163F52'},
  {k: 12, n: 3, role: 'COMITÉ DE INVERSIÓN', shirt: '#1E7F98'},
  {k: 13, n: 2, role: 'CUMPLIMIENTO', shirt: '#3D5A6C'},
  {k: 17, n: 1, role: 'CASA DE BOLSA', shirt: '#0B5D7A'},
  {k: 28, n: 1, role: 'REGULADOR', shirt: '#7A1F45'},
];
const SKINS = ['#F2D3B8', '#C68B62', '#E8B894', '#8D5A3B', '#F0C8A0', '#A66E4B'];
const HAIRS = ['#1B1530', '#2B1B12', '#5B3A1E', '#120C0A', '#3A2A20', '#8A8A8A'];
const STAFF = JOIN.flatMap((j, gi) =>
  Array.from({length: j.n}, (_, i) => ({...j, i, spawn: Q(j.k).solve + 0.5 + i * 0.45, gi})),
).map((s, slot) => ({...s, slot, look: {shirt: s.shirt, shirtD: s.shirt, skin: SKINS[slot % 6], hair: HAIRS[(slot * 5) % 6]} as Look}));
const slotRel = (slot: number) => {
  const row = slot % 2;
  const col = Math.floor(slot / 2);
  return {dx: 30 - col * 85 - row * 42, dy: row ? -330 : -255, sc: row ? 0.6 : 0.7};
};

/* ---- monedas y documentos que viajan ---- */
type Fly = {t0: number; dur: number; x0: number; y0: number; x1: number; y1: number; kind: 'coin' | 'doc'; arc: number};
const handOf = (x: number, deg: number) => handPos(x, deg);
const FLY: Fly[] = [
  {t0: Q(14).solve + 0.1, dur: 0.6, x0: tubeTop(14).x, y0: GY - 1150, x1: tubeTop(14).x, y1: tubeTop(14).y, kind: 'coin', arc: 0},
  {t0: Q(18).solve + 0.2, dur: 0.55, x0: handOf(stopX(18) - 375, -65).x, y0: handOf(0, -65).y, ...{x1: tubeTop(18).x, y1: tubeTop(18).y}, kind: 'coin', arc: 220},
  {t0: Q(19).solve, dur: 0.55, x0: tubeTop(19).x, y0: tubeTop(19).y, x1: handOf(stopX(19) - 285, -62).x, y1: handOf(0, -62).y, kind: 'coin', arc: 200},
  {t0: Q(23).solve + 0.2, dur: 0.7, x0: tubeTop(23).x, y0: tubeTop(23).y, x1: stopX(23) + 30, y1: GY - 560, kind: 'coin', arc: 160},
  {t0: Q(24).solve + 0.3, dur: 0.75, x0: stopX(24) + 760, y0: GY - 1150, x1: tubeTop(24).x, y1: tubeTop(24).y, kind: 'coin', arc: 120},
  {t0: Q(25).solve + 0.2, dur: 0.8, x0: tubeTop(25).x, y0: tubeTop(25).y, x1: instX(25), y1: GY - 600, kind: 'coin', arc: 220},
  ...[0, -105, -195, -285].map((dx, i) => ({t0: Q(26).solve + 0.25 + i * 0.22, dur: 0.6, x0: instX(26), y0: GY - 520, x1: stopX(26) + dx, y1: GY - 470, kind: 'doc' as const, arc: 140})),
];
const TUBE_DELTA = [
  {t: Q(14).solve + 0.7, d: 1},
  {t: Q(18).solve + 0.75, d: 1},
  {t: Q(19).solve, d: -1},
  {t: Q(24).solve + 1.05, d: 1},
];
const DocIcon: React.FC<{x: number; y: number; rot: number}> = ({x, y, rot}) => (
  <svg style={{position: 'absolute', left: x - 26, top: y - 32, overflow: 'visible'}} width={52} height={64} viewBox="-26 -32 52 64">
    <g transform={`rotate(${rot})`}>
      <rect x={-22} y={-28} width={44} height={56} rx={6} fill={C.nebulaLL} stroke={C.abyss} strokeWidth={3} />
      <path d="M-12 -12H12 M-12 0H12 M-12 12H4" stroke={C.abyss} strokeWidth={3.5} strokeLinecap="round" />
    </g>
  </svg>
);
const Ticket: React.FC<{x: number; y: number; n: number; s: number}> = ({x, y, n, s}) => (
  <svg style={{position: 'absolute', left: x - 40, top: y - 50, overflow: 'visible', transform: `scale(${s})`}} width={80} height={60} viewBox="-40 -50 80 60">
    {Array.from({length: n}, (_, k) => (
      <g key={k} transform={`translate(${k * 9 - (n - 1) * 4.5} ${-k * 9}) rotate(${-6 + k * 5})`}>
        <rect x={-26} y={-16} width={52} height={32} rx={6} fill={C.nebulaLL} stroke={C.abyss} strokeWidth={3} />
        <circle cx={-26} cy={0} r={6} fill={C.abyss} />
        <circle cx={26} cy={0} r={6} fill={C.abyss} />
        <path d="M-12 -4H12 M-12 6H6" stroke={C.abyss} strokeWidth={3} strokeLinecap="round" />
      </g>
    ))}
  </svg>
);

/* ---- instituciones y anuncios del camino ---- */
type Kind = 'torre' | 'gob' | 'boveda' | 'sala' | 'pantallas' | 'bolsa' | 'reloj' | 'anuncio';
const INST: {k: number; kind: Kind; label: string; sub?: string}[] = [
  {k: 6, kind: 'anuncio', label: 'TÍTULOS'},
  {k: 7, kind: 'gob', label: 'AUTORIDAD', sub: 'AUTORIZA'},
  {k: 8, kind: 'torre', label: 'SOCIEDAD OPERADORA'},
  {k: 9, kind: 'anuncio', label: 'POLÍTICA DE INVERSIÓN'},
  {k: 10, kind: 'boveda', label: 'CUSTODIO'},
  {k: 11, kind: 'anuncio', label: 'REGISTRO DE TÍTULOS'},
  {k: 12, kind: 'sala', label: 'COMITÉ DE INVERSIÓN'},
  {k: 13, kind: 'torre', label: 'CUMPLIMIENTO'},
  {k: 14, kind: 'anuncio', label: 'PRECIO DEL TÍTULO'},
  {k: 15, kind: 'anuncio', label: 'VALUACIÓN'},
  {k: 16, kind: 'pantallas', label: 'PROVEEDOR DE PRECIOS'},
  {k: 17, kind: 'bolsa', label: 'CASA DE BOLSA'},
  {k: 18, kind: 'anuncio', label: 'SUSCRIPCIÓN'},
  {k: 19, kind: 'anuncio', label: 'REEMBOLSO'},
  {k: 20, kind: 'anuncio', label: 'ACTIVOS LÍQUIDOS'},
  {k: 21, kind: 'reloj', label: 'HORA DE CORTE'},
  {k: 22, kind: 'anuncio', label: 'PLAZO DE LIQUIDACIÓN'},
  {k: 23, kind: 'anuncio', label: 'COMISIÓN'},
  {k: 24, kind: 'anuncio', label: 'REINVERSIÓN'},
  {k: 25, kind: 'gob', label: 'AUTORIDAD FISCAL', sub: 'SAT'},
  {k: 26, kind: 'anuncio', label: 'CONSTANCIA FISCAL'},
  {k: 27, kind: 'anuncio', label: 'PROSPECTO'},
  {k: 28, kind: 'gob', label: 'REGULADOR', sub: 'CNBV'},
];
const KIND_H: Record<Kind, number> = {torre: 590, gob: 540, boveda: 430, sala: 400, pantallas: 540, bolsa: 570, reloj: 600, anuncio: 600};
const txt = (x: number, y: number, size: number, fill: string, s: string, ls = 0.04) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={size} letterSpacing={`${ls}em`} fill={fill}>
    {s}
  </text>
);
const coinG = (x: number, y: number, r = 26) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={C.nebula} stroke={C.abyss} strokeWidth={4} />
    {txt(0, r * 0.36, r, C.abyss, '$', 0)}
  </g>
);
const ticketG = (x: number, y: number, s = 1) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-26} y={-16} width={52} height={32} rx={6} fill={C.nebulaLL} stroke={C.abyss} strokeWidth={3} />
    <circle cx={-26} cy={0} r={6} fill={C.abyssDD} />
    <circle cx={26} cy={0} r={6} fill={C.abyssDD} />
  </g>
);
const arrowG = (x: number, y: number) => <path d={`M${x - 30} ${y}H${x + 24} M${x + 8} ${y - 16}L${x + 26} ${y}L${x + 8} ${y + 16}`} stroke={C.pulse} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
const INV_COLORS = [C.pulse, '#F4FAFC', C.nebulaL, C.pulseL];
/** contenido de cada anuncio (panel de 440 × 330, centro en 0,0) */
const Board: React.FC<{k: number; f: number; on: number}> = ({k, f, on}) => {
  switch (k) {
    case 6:
      return (<>{coinG(-130, -20)}{coinG(-100, 20)}{coinG(-150, 40)}{arrowG(-20, 10)}{ticketG(80, -30)}{ticketG(150, -30)}{ticketG(80, 30)}{ticketG(150, 30)}{txt(0, 120, 30, C.mute, 'PARTES IGUALES')}</>);
    case 9:
      return (<>{['QUÉ COMPRAR', 'CUÁNTO DE CADA COSA', 'LÍMITES'].map((l, i) => (<g key={i}><circle cx={-170} cy={-80 + i * 80} r={18} fill={C.nebula} /><path d={`M${-178} ${-80 + i * 80}l6 7l12 -14`} stroke={C.abyssDD} strokeWidth={5} fill="none" />{txt(20, -68 + i * 80, 34, C.white, l, 0)}</g>))}</>);
    case 11:
      return (<>{INV_COLORS.map((c, i) => (<g key={i}><circle cx={-160} cy={-105 + i * 68} r={22} fill={c} />{[0, 1, 2].map((j) => ticketG(-80 + j * 66, -105 + i * 68, 0.8))}{txt(150, -94 + i * 68, 32, C.white, '× 3', 0)}</g>))}</>);
    case 14:
      return (<><polyline points={`-170,90 -100,50 -40,64 30,0 100,-20 170,-90`} fill="none" stroke={C.pulse} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />{txt(-90, -60, 70, C.nebulaL, '$', 0)}{txt(70, 120, 30, C.mute, 'MISMOS TÍTULOS')}</>);
    case 15:
      return (<>{[['LO QUE VALE EL FONDO', C.white], ['− LO QUE DEBE', C.pulseL], ['÷ NÚMERO DE TÍTULOS', C.nebulaL], ['= PRECIO DEL TÍTULO', C.white]].map(([l, c], i) => <g key={i}>{txt(0, -88 + i * 64, 32, c, l, 0)}</g>)}</>);
    case 18:
      return (<>{coinG(-120, 0, 44)}{arrowG(0, 0)}{ticketG(120, 0, 1.6)}{txt(0, 120, 30, C.mute, 'DINERO → TÍTULOS')}</>);
    case 19:
      return (<>{ticketG(-120, 0, 1.6)}{arrowG(0, 0)}{coinG(120, 0, 44)}{txt(0, 120, 30, C.mute, 'TÍTULOS → DINERO')}</>);
    case 20:
      return (<><path d="M-90 -100C-130 -40 -136 -20 -136 0A46 46 0 0 0 -44 0C-44 -20 -50 -40 -90 -100Z" fill={C.nebula} />{[0, 1, 2, 3].map((i) => <rect key={i} x={10 + i * 44} y={60 - (i + 1) * 36} width={30} height={(i + 1) * 36} rx={6} fill={C.nebulaL} />)}{txt(0, 120, 30, C.mute, 'SE VUELVEN EFECTIVO RÁPIDO')}</>);
    case 22:
      return (<>{['HOY', '+1', '+2', '+3'].map((l, i) => (<g key={i}><rect x={-190 + i * 96} y={-70} width={84} height={100} rx={12} fill={i === 0 ? C.pulse : C.abyss} stroke={C.nebula} strokeWidth={4} />{txt(-148 + i * 96, -6, 34, C.white, l, 0)}</g>))}{txt(0, 100, 30, C.mute, 'DÍAS HÁBILES, SEGÚN EL FONDO')}</>);
    case 23:
      return (<>{txt(-80, 40, 150, C.pulse, '%', 0)}{txt(90, -10, 34, C.white, 'ANUAL', 0)}{txt(90, 40, 30, C.nebulaL, 'SE DESCUENTA', 0)}{txt(90, 76, 30, C.nebulaL, 'CADA DÍA', 0)}</>);
    case 24:
      return (<g transform={`rotate(${(f * 2) % 360})`}><path d="M-80 -10A80 80 0 0 1 60 -54 M66 -96V-50H20" stroke={C.nebula} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d="M80 10A80 80 0 0 1 -60 54 M-66 96V50H-20" stroke={C.pulse} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>);
    case 26:
      return (<><rect x={-110} y={-120} width={220} height={240} rx={14} fill={C.nebulaLL} />{txt(0, -70, 26, C.abyss, 'CONSTANCIA', 0)}{['INTERESES', 'ISR RETENIDO', 'AÑO'].map((l, i) => <g key={i}><rect x={-80} y={-40 + i * 50} width={160} height={10} rx={5} fill={C.abyss} opacity={0.25} />{txt(0, -24 + i * 50, 20, C.abyss, l, 0)}</g>)}</>);
    case 27:
      return (<><path d="M-170 -80Q-90 -110 0 -70V110Q-90 76 -170 100Z" fill={C.nebulaLL} /><path d="M170 -80Q90 -110 0 -70V110Q90 76 170 100Z" fill={C.nebulaL} />{['POLÍTICA', 'LÍMITES', 'COMISIONES', 'RIESGOS'].map((l, i) => <g key={i}>{txt(-86, -30 + i * 38, 22, C.abyss, l, 0)}</g>)}{txt(86, 10, 44, C.abyss, 'DICI', 0)}</>);
    default:
      return null;
  }
};
const Inst: React.FC<{s: (typeof INST)[number]; t: number; f: number; z: number}> = ({s, t, f, z}) => {
  const q = Q(s.k);
  const x = instX(s.k);
  const on = sm(prog(t, q.solve, q.solve + 0.7));
  const lt = (LIT.find((l) => l.medal === s.k - 4) ?? {t: 1e9}).t;
  const flash = Math.max(t > lt ? Math.exp(-(t - lt) * 1.6) : 0, t > CLOSE.todo ? 0.6 + 0.4 * Math.sin(f / 6 + s.k) : 0);
  const H = KIND_H[s.kind];
  const lab = s.label;
  const ls = Math.min(40, 380 / (lab.length * 0.66));
  const win = (on > 0.5 ? C.nebulaL : '#0A3F55');
  const glow = flash > 0.05 ? `drop-shadow(0 0 ${30 * flash}px ${C.pulse})` : on > 0.5 ? `drop-shadow(0 0 16px rgba(40,175,203,0.55))` : undefined;
  const beacon = cl((0.32 - z) / 0.18);
  let body: React.ReactNode = null;
  if (s.kind === 'torre') {
    body = (<><rect x={-170} y={-H} width={340} height={H} rx={10} fill="#0C5B79" />{Array.from({length: 4 * 7}, (_, i) => <rect key={i} x={-140 + (i % 4) * 74} y={-H + 40 + Math.floor(i / 4) * 62} width={50} height={40} rx={6} fill={win} opacity={on > 0.5 ? 0.55 + 0.45 * Math.sin(i * 7.1 + f / 25) : 1} />)}<rect x={-45} y={-115} width={90} height={115} rx={10} fill={C.abyssDD} /></>);
  } else if (s.kind === 'gob') {
    body = (<><rect x={-230} y={-40} width={460} height={40} fill="#0C5B79" />{[-170, -102, -34, 34, 102, 170].map((cx) => <rect key={cx} x={cx - 17} y={-380} width={34} height={340} fill={C.nebulaLL} opacity={0.85} />)}<rect x={-220} y={-420} width={440} height={44} fill={C.nebulaL} /><path d={`M-240 -420L0 ${-H}L240 -420Z`} fill={C.nebula} />{s.sub && txt(0, -440, s.sub.length > 4 ? 30 : 46, C.abyssDD, s.sub, 0.1)}<rect x={-40} y={-150} width={80} height={110} fill={C.abyssDD} /></>);
  } else if (s.kind === 'boveda') {
    body = (<><rect x={-210} y={-H} width={420} height={H} rx={34} fill="#0A4A63" /><circle cx={0} cy={-210} r={130} fill="#0C5B79" stroke={on > 0.5 ? C.nebulaL : C.mute} strokeWidth={16} /><g transform={`translate(0 -210) rotate(${on * 120 + (on > 0.99 ? (f % 360) * 0.2 : 0)})`}>{[0, 60, 120].map((r) => <rect key={r} x={-100} y={-7} width={200} height={14} rx={7} fill={C.nebulaL} transform={`rotate(${r})`} />)}<circle r={26} fill={C.abyssDD} /></g></>);
  } else if (s.kind === 'sala') {
    body = (<><rect x={-210} y={-H} width={420} height={H - 20} rx={16} fill="rgba(143,224,240,0.16)" stroke={C.nebulaL} strokeWidth={6} />{[-120, 0, 120].map((cx) => <g key={cx}><circle cx={cx} cy={-235} r={32} fill={on > 0.5 ? '#E8B894' : '#2a5566'} /><rect x={cx - 42} y={-200} width={84} height={70} rx={30} fill={on > 0.5 ? '#1E7F98' : '#24485a'} /></g>)}<rect x={-180} y={-140} width={360} height={22} rx={8} fill={C.nebulaLL} /><rect x={-160} y={-118} width={14} height={98} fill={C.nebulaL} /><rect x={146} y={-118} width={14} height={98} fill={C.nebulaL} /></>);
  } else if (s.kind === 'pantallas') {
    body = (<><rect x={-200} y={-H} width={400} height={H} rx={10} fill="#0C5B79" />{Array.from({length: 6}, (_, i) => { const sx = -170 + (i % 2) * 175; const sy = -H + 40 + Math.floor(i / 2) * 120; return (<g key={i}><rect x={sx} y={sy} width={165} height={100} rx={10} fill={C.abyssDD} stroke={C.nebula} strokeWidth={3} />{on > 0.5 && <polyline points={Array.from({length: 7}, (_, j) => `${sx + 12 + j * 23},${sy + 50 + 26 * Math.sin(j * 1.3 + i + f / 12)}`).join(' ')} fill="none" stroke={i % 2 ? C.pulse : C.nebulaL} strokeWidth={5} />}</g>); })}</>);
  } else if (s.kind === 'bolsa') {
    body = (<><rect x={-210} y={-H} width={420} height={H} rx={10} fill="#0C5B79" /><rect x={-210} y={-H + 70} width={420} height={60} fill={C.abyssDD} /><g>{Array.from({length: 7}, (_, i) => { const xx = ((i * 120 - (on > 0.5 ? f * 3 : 0)) % 840 + 840) % 840 - 420; return <path key={i} d={i % 3 === 1 ? `M${xx} ${-H + 88}l14 22l14 -22z` : `M${xx} ${-H + 112}l14 -22l14 22z`} fill={i % 3 === 1 ? C.pulse : C.nebulaL} opacity={Math.abs(xx) < 200 ? 1 : 0} />; })}</g>{Array.from({length: 3 * 4}, (_, i) => <rect key={i} x={-150 + (i % 3) * 110} y={-H + 170 + Math.floor(i / 3) * 70} width={80} height={46} rx={6} fill={win} />)}<path d="M-120 -150H120L100 -120H-100Z" fill={C.pulse} /><rect x={-60} y={-120} width={120} height={120} fill={C.abyssDD} /></>);
  } else if (s.kind === 'reloj') {
    const hr = (-60 + 30 * 2) * 1; // 2:00 pm
    body = (<><rect x={-90} y={-H} width={180} height={H} rx={12} fill="#0C5B79" /><circle cx={0} cy={-H + 120} r={92} fill={C.nebulaLL} stroke={C.nebula} strokeWidth={10} /><g transform={`translate(0 ${-H + 120})`}><rect x={-6} y={-50} width={12} height={54} rx={6} fill={C.abyssDD} transform={`rotate(${hr + 60})`} /><rect x={-4} y={-74} width={8} height={78} rx={4} fill={C.pulse} transform={`rotate(${on > 0.5 ? 0 : (f * 6) % 360})`} /></g><rect x={-40} y={-120} width={80} height={120} fill={C.abyssDD} /></>);
  } else {
    body = (<><rect x={-160} y={-270} width={16} height={270} fill="#0A4A63" /><rect x={144} y={-270} width={16} height={270} fill="#0A4A63" /><rect x={-230} y={-H} width={460} height={340} rx={20} fill={C.abyssDD} stroke={on > 0.5 ? C.nebula : '#2a5566'} strokeWidth={6} /><g transform={`translate(0 ${-H + 170})`} opacity={0.35 + 0.65 * on}><Board k={s.k} f={f} on={on} /></g></>);
  }
  return (
    <svg style={{position: 'absolute', left: x - 260, top: GY - 760, overflow: 'visible', opacity: 0.5 + 0.5 * on, filter: glow}} width={520} height={780} viewBox="-260 -760 520 780">
      <ellipse cx={0} cy={6} rx={230} ry={12} fill="rgba(0,0,0,0.3)" />
      {body}
      <rect x={-215} y={-H - 90} width={430} height={74} rx={16} fill={C.abyssDD} stroke={flash > 0.05 ? C.pulse : on > 0.5 ? C.nebula : '#2a5566'} strokeWidth={5} />
      {txt(0, -H - 90 + 37 + ls * 0.36, ls, on > 0.5 ? C.white : C.mute, lab, 0.03)}
      {beacon > 0 && (<g opacity={beacon}><rect x={-3 / z} y={-H - 160} width={6 / z} height={H + 160} fill={C.nebulaL} opacity={0.35} /><circle cx={0} cy={-H - 160} r={11 / z} fill={on > 0.5 ? (flash > 0.3 ? C.pulse : C.nebulaL) : '#2a5566'} /></g>)}
    </svg>
  );
};

/* ---- cámara: sigue a la caravana; al final recorre toda la calle y se aleja ---- */
const CLOSE = est.cierre;
const LIT = CLOSE.lit as {medal: number; t: number}[];
const tgX = (m: number) => (m === 0 ? stopX(6) - 450 : stopX(m + 4) + 260);
const Z_LIST = 0.55;
const STREET_L = 900;
const STREET_R = stopX(28) + 800;
const Z_FIT = 1000 / (STREET_R - STREET_L);
const F0 = Q(28).dock + 0.15;
const F1 = LIT[0].t + 0.45;
const camera = (t: number) => {
  if (t < F0) return {cx: camAt(t) + 540 / S, z: S, gy: 1130};
  if (t < F1) {
    const u = prog(t, F0, F1);
    const e = sm(u);
    return {cx: lerp(camAt(F0) + 540 / S, tgX(LIT[0].medal), e), z: Math.exp(lerp(Math.log(S), Math.log(Z_LIST), e) - 2.3 * Math.sin(Math.PI * u)), gy: 1130};
  }
  let cx = tgX(LIT[0].medal);
  for (let i = 1; i < LIT.length; i++) cx = lerp(cx, tgX(LIT[i].medal), sm(prog(t, LIT[i].t - 0.4, LIT[i].t + 0.1)));
  const zo = sm(prog(t, CLOSE.todo - 0.1, CLOSE.todo + 1.9));
  return {cx: lerp(cx, (STREET_L + STREET_R) / 2, zo), z: Math.exp(lerp(Math.log(Z_LIST), Math.log(Z_FIT), zo)), gy: lerp(1130, 960, zo)};
};

/* ---- datos en pantalla (verificados; fuentes en guiones/videos-producidos/deconstruyendo-fondos.md) ---- */
const DAT: Record<number, string[]> = {
  6: ['A los títulos también se les llama acciones del fondo.'],
  7: ['La ley nació en 2001 como Ley de Sociedades de Inversión; con la reforma financiera de 2014 se llama Ley de Fondos de Inversión.', 'Por ley hay 4 tipos de fondo: renta variable, deuda, capitales y cobertura (LFI, art. 6).'],
  8: ['En México hay 29 operadoras de fondos (AMIB, febrero de 2026).'],
  9: ['La política de inversión va en el prospecto, y la CNBV lo autoriza antes (LFI, art. 9).'],
  10: ['Por ley, los valores del fondo se depositan en una institución para el depósito de valores (LFI, art. 16).', 'En México, esa institución es el S.D. Indeval.'],
  11: ['Indeval lleva el registro electrónico de los valores y les asigna su código ISIN.'],
  12: ['El consejo de la operadora fija y revisa las políticas de inversión (LFI, art. 11).'],
  13: ['La vigilancia del fondo le toca al contralor normativo de la operadora (LFI, art. 10).'],
  14: ['Los fondos en México suman más de 5 billones de pesos (AMIB, febrero de 2026).'],
  15: ['El método y la frecuencia de valuación vienen en el prospecto (LFI, art. 9).'],
  16: ['La proveeduría de precios es un servicio que el fondo debe contratar (LFI, art. 32).', 'Valmer, de Grupo BMV, es uno de los proveedores de precios en México.'],
  17: ['En México operan 36 casas de bolsa autorizadas por la CNBV.', 'Hay dos bolsas de valores: la BMV y BIVA, que abrió en 2018.'],
  18: ['Hay fondos abiertos, que recompran sus acciones, y cerrados, que no lo hacen (LFI, art. 7).'],
  19: ['Cada fondo dice en su prospecto cada cuándo puedes vender: diario, semanal o mensual.'],
  20: ['Más de 16 millones de clientes tienen fondos de inversión en México (AMIB, 2026).'],
  21: ['La hora de corte de cada fondo viene en su prospecto.'],
  22: ['Desde el 27 de mayo de 2024, las operaciones de la bolsa mexicana se liquidan en T+1: un día hábil.'],
  23: ['La comisión se expresa como porcentaje anual y se descuenta todos los días del precio.'],
  24: ['Por eso la ganancia de un fondo se ve en el cambio de precio de su título.'],
  25: ['En 2026 la retención es de 0.90% anual sobre el capital invertido; en 2025 era de 0.50%.'],
  26: ['Con la constancia presentas tu declaración anual ante el SAT.'],
  27: ['Junto al prospecto va el DICI: el documento con información clave para la inversión (LFI, art. 9).'],
  28: ['La CNBV nació en 1995 al fusionarse la Comisión Nacional Bancaria y la Comisión Nacional de Valores.', 'También participan la SHCP, Banxico, la CONDUSEF y la AMIB, que es el organismo autorregulador.'],
};
type Dato = {a: number; b: number; txt: string; q?: boolean};
const DATOS: Dato[] = [
  {a: T(15) + 0.5, b: T(19) - 0.2, txt: 'En México, los fondos de inversión tienen más de 16 millones de clientes (AMIB, 2026).'},
  {a: T(22) + 0.2, b: T(33) - 0.2, txt: 'Las acciones se compran en la bolsa. En México hay dos: la BMV y BIVA.'},
  {a: T(49) + 0.5, b: ST[0].appear - 0.3, txt: 'Una sociedad de inversión junta el dinero de muchas personas para invertirlo en conjunto.'},
  ...ST.flatMap((q, i) => {
    const d = DAT[q.k] ?? [];
    const next = ST[i + 1];
    const end = next ? next.appear - 0.3 : LIT[0].t - 0.3;
    if (d.length === 1) return [{a: q.solve + 0.3, b: end, txt: d[0]}];
    if (d.length === 2) return [{a: q.solve + 0.3, b: q.name - 0.15, txt: d[0]}, {a: q.name + 0.5, b: end, txt: d[1]}];
    return [];
  }),
  {a: LIT[0].t + 0.2, b: CLOSE.todo - 0.2, txt: 'Fondos en México: 29 operadoras, más de 16 millones de clientes y más de 5 billones de pesos (AMIB, 2026).'},
  {a: CLOSE.fondo + 0.6, b: DECOF_TOTAL + 1, txt: '¿Cuál de estas piezas no conocías? Te leo en comentarios.', q: true},
];
const DatoCard: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const d = DATOS.find((x) => t >= x.a - 0.05 && t <= x.b + 0.3);
  if (!d) return null;
  const inn = sm(prog(t, d.a, d.a + 0.35));
  const out = 1 - sm(prog(t, d.b, d.b + 0.3));
  const size = d.txt.length > 90 ? 27 : 30;
  return (
    <div style={{position: 'absolute', left: 90, width: 900, top: 1378, opacity: inn * out, transform: `translateY(${(1 - inn) * 24}px)`}}>
      <div style={{display: 'flex', gap: 18, alignItems: 'flex-start', background: 'rgba(1,30,43,0.86)', border: `2px solid ${d.q ? C.pulse : 'rgba(40,175,203,0.55)'}`, borderLeft: `8px solid ${d.q ? C.pulse : C.nebula}`, borderRadius: 18, padding: '14px 22px 14px 18px', boxShadow: '0 18px 40px rgba(0,0,0,0.45)'}}>
        <div style={{flex: 'none', fontFamily: FONT, fontWeight: 800, fontSize: 20, letterSpacing: '0.16em', color: C.abyssDD, background: d.q ? C.pulse : C.nebula, borderRadius: 8, padding: '6px 10px 3px', marginTop: 4}}>{d.q ? 'TU TURNO' : 'DATO'}</div>
        <div style={{fontFamily: FONT, fontWeight: 600, fontSize: size, lineHeight: 1.22, color: C.white}}>{d.txt}</div>
      </div>
    </div>
  );
};

/* ---- capas nuevas del mundo ---- */
const Insts: React.FC<{t: number; f: number; z: number; vl: number; vr: number}> = ({t, f, z, vl, vr}) => (
  <>{INST.map((s) => (instX(s.k) > vl - 300 && instX(s.k) < vr + 300 ? <Inst key={s.k} s={s} t={t} f={f} z={z} /> : null))}</>
);
const Crowd: React.FC<{t: number}> = ({t}) => (
  <>
    {STAFF.map((s) => {
      if (t < s.spawn) return null;
      const r = slotRel(s.slot);
      const door = instX(s.k);
      const fr = (u: number) => motion(u, s.spawn, s.spawn + 1.9, 0, 1, 0.3, 0.5);
      const xf = (u: number) => lerp(door, leadX(u) + r.dx, fr(u));
      const p = walkP(xf, t);
      const e = fr(t);
      const yy = lerp(0, r.dy, e);
      const sc = lerp(0.82, r.sc, e);
      const fade = cl((t - s.spawn) / 0.3);
      const tag = cl((t - s.spawn) / 0.3) * (1 - sm(prog(t, s.spawn + 2.6, s.spawn + 3.1)));
      return (
        <div key={s.slot} style={{position: 'absolute', left: 0, top: 0, opacity: fade, transform: `translate(0px, ${yy}px)`}}>
          <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: `${p.x}px ${GY}px`, transform: `scale(${sc})`, filter: 'brightness(0.86)'}}>
            <Figure x={p.x} spec={s.look} p={p} badge={C.nebulaLL} />
          </div>
          {tag > 0.01 && s.i === 0 && (
            <div style={{position: 'absolute', left: p.x - 200, width: 400, top: GY - 420 * sc - 70, display: 'flex', justifyContent: 'center', opacity: tag}}>
              <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: '0.08em', color: C.abyssDD, background: C.nebulaL, borderRadius: 12, padding: '6px 14px 2px', whiteSpace: 'nowrap'}}>{s.role}</div>
            </div>
          )}
        </div>
      );
    })}
  </>
);

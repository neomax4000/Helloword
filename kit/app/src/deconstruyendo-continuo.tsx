// DECONSTRUYENDO LAS FINANZAS — guion 1, apertura en UNA SOLA ANIMACIÓN CONTINUA (sin cortes ni cambios de escena)
// Paleta de la serie: Abyss #014E6A · Nebula #28AFCB · Pulse #FF3D8E
// Un solo mundo: la persona saca su dinero, camina hasta una barrera, llegan más personas, juntan el dinero y la barrera se abre.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/deconstruyendo-continuo/words.json';
import {Backdrop, Brand, Captions, FONT, FPS, Frame, Grain, Mask, P, Wd, buildGroups, cl, lerp, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const DECOC_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const groups = buildGroups(words, blocks);
const KEYS = ['DINERO', 'CREZCA', 'INVERSIONISTA', 'ACCIONES', 'CARAS', 'ALCANZA', 'SOCIEDAD', 'INVERSIÓN'];

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
  id: 'main', t0: 2.0, t1: 9.1, x0: 250, x1: 1480, rin: 0.5, rout: 0.6,
  shirt: C.pulse, shirtD: C.pulseD, skin: '#F2D3B8', hair: '#1B1530',
  rel: [10.25, 10.38, 10.51], holdFrom: 1.2, pick: [1.1, 1.35, 1.6],
};
const OTHERS: WalkerSpec[] = [
  {id: 'A', t0: 10.7, t1: 12.6, x0: 990, x1: 1375, rin: 0.2, rout: 0.35, shirt: '#F4FAFC', shirtD: '#BCD3DA', skin: '#D9A27E', hair: '#2B1B12', rel: [12.8, 12.93, 13.06], holdFrom: -1},
  {id: 'B', t0: 11.7, t1: 13.6, x0: 990, x1: 1285, rin: 0.2, rout: 0.35, shirt: C.nebulaL, shirtD: '#4FB7CF', skin: '#A66E4B', hair: '#120C0A', rel: [13.85, 13.98, 14.11], holdFrom: -1},
  {id: 'C', t0: 12.9, t1: 14.55, x0: 990, x1: 1195, rin: 0.2, rout: 0.35, shirt: C.pulseL, shirtD: '#E88FB4', skin: '#F0C8A0', hair: '#5B3A1E', rel: [14.8, 14.93, 15.06], holdFrom: -1},
];
const ALL = [MAIN, ...OTHERS];
const FLIGHT = 0.55; // vuelo de la moneda hasta el tubo
const LANDINGS = ALL.flatMap((w) => w.rel.map((r) => r + FLIGHT)).sort((a, b) => a - b);
const NEED = LANDINGS.length; // 12 monedas = precio
const GATE_DROP = 8.55; // la barrera baja justo antes de «caras»
const GATE_RISE = LANDINGS[NEED - 1] + 0.1;
const camAt = (t: number) => Math.max(0, motion(t, MAIN.t0, MAIN.t1, MAIN.x0, MAIN.x1, MAIN.rin, MAIN.rout) - 430);

/* ---------------- pose de cada personaje ---------------- */
const pose = (w: WalkerSpec, t: number) => {
  const x = motion(t, w.t0, w.t1, w.x0, w.x1, w.rin ?? 0.4, w.rout ?? 0.5);
  const speed = Math.abs(motion(t + 0.03, w.t0, w.t1, w.x0, w.x1, w.rin ?? 0.4, w.rout ?? 0.5) - motion(t - 0.03, w.t0, w.t1, w.x0, w.x1, w.rin ?? 0.4, w.rout ?? 0.5)) / 0.06;
  const amp = cl(speed / 60);
  const a = Math.sin(((x - w.x0) * 2 * Math.PI) / 190) * 0.52 * amp;
  const aDeg = (a * 180) / Math.PI;
  const relFirst = w.rel[0];
  const relLast = w.rel[w.rel.length - 1];
  const hold = sm(prog(t, w.holdFrom, w.holdFrom + 0.3)) * (1 - sm(prog(t, relLast, relLast + 0.4)));
  const lift = sm(prog(t, relFirst - 0.28, relFirst)) * (1 - sm(prog(t, relLast + 0.05, relLast + 0.4)));
  const cheer = sm(prog(t, CHEER, CHEER + 0.3));
  let armF = aDeg * 0.8 + Math.sin(t * 2.3 + x) * 2 * (1 - amp);
  armF = lerp(armF, -65, hold);
  armF = lerp(armF, -125, lift);
  armF = lerp(armF, -168, cheer);
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
const Figure: React.FC<{x: number; spec: WalkerSpec; p: ReturnType<typeof pose>}> = ({x, spec, p}) => {
  const aD = (p.a * 180) / Math.PI;
  const pants = C.abyssDD;
  return (
    <svg style={{position: 'absolute', left: x - 120, top: GY - 420 - p.hop - p.bob, overflow: 'visible'}} width={240} height={440} viewBox="-120 -420 240 440">
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
const Tube: React.FC<{n: number; t: number; f: number}> = ({n, t, f}) => {
  const full = n >= NEED;
  const lastLand = [...LANDINGS].filter((l) => l <= t).pop() ?? -9;
  const pop = 1 + 0.22 * Math.exp(-(t - lastLand) * 11) * (t >= lastLand ? 1 : 0);
  const flash = t > T(31) - 0.05 && n < NEED ? 0.55 + 0.45 * Math.sin(f / 3) : 1;
  const top = -18 - n * COIN_H;
  return (
    <svg style={{position: 'absolute', left: TUBE_X - 120, top: GY - 560, overflow: 'visible'}} width={240} height={580} viewBox="-120 -560 240 580">
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
const Skyline: React.FC<{cam: number}> = ({cam}) => {
  let x = 0;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 5200, height: 1920, transform: `translateX(${-cam * S * 0.28}px)`}}>
      {SKY.map((b, k) => {
        const left = x;
        x += b.w + 26;
        return <div key={k} style={{position: 'absolute', left, top: 1130 - b.h, width: b.w, height: b.h, background: 'linear-gradient(180deg, rgba(40,175,203,0.16), rgba(40,175,203,0.04))', borderRadius: '10px 10px 0 0'}} />;
      })}
    </div>
  );
};
const Ground: React.FC = () => (
  <>
    <div style={{position: 'absolute', left: -400, top: GY, width: 3600, height: 190, background: 'linear-gradient(180deg, rgba(1,30,43,0.92), rgba(1,30,43,0))'}} />
    <div style={{position: 'absolute', left: -400, top: GY - 2, width: 3600, height: 5, background: C.nebula, opacity: 0.4}} />
    {Array.from({length: 24}, (_, k) => (
      <div key={k} style={{position: 'absolute', left: -200 + k * 170, top: GY + 44, width: 64, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.12)'}} />
    ))}
  </>
);

/* ---------------- títulos grandes (cambian de texto, nunca de escena) ---------------- */
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
type Ln = {t: string; size: number; y: number; at: number; color?: string; ls?: number};
type Slot = {a: number; b: number; lines: Ln[]};
const SLOTS: Slot[] = [
  {a: 0, b: 2.62, lines: [{t: 'TU', size: 74, y: 230, at: 0, color: C.mute, ls: 0.3}, {t: 'DINERO', size: 190, y: 298, at: 0.05}]},
  {a: 2.62, b: 4.96, lines: [{t: 'EN ESE MOMENTO', size: 56, y: 240, at: 2.7, color: C.mute, ls: 0.22}, {t: 'TÚ', size: 250, y: 300, at: T(11) - 0.08, color: C.white}]},
  {a: 6.5, b: 7.42, lines: [{t: 'AL MERCADO', size: 130, y: 280, at: T(19) - 0.1}]},
  {a: 7.42, b: 9.82, lines: [{t: 'ACCIONES', size: 150, y: 230, at: T(22) - 0.1}, {t: 'CARAS', size: 150, y: 372, at: T(28) - 0.06, color: C.pulse}]},
  {a: 9.82, b: 11.75, lines: [{t: 'TU DINERO', size: 70, y: 240, at: T(29) - 0.05, color: C.mute, ls: 0.12}, {t: 'NO ALCANZA', size: 135, y: 330, at: T(31) - 0.1, color: C.pulse}]},
  {a: 11.75, b: 16.0, lines: [{t: 'MÁS', size: 80, y: 250, at: T(33), color: C.mute, ls: 0.2}, {t: 'INVERSIONISTAS', size: 102, y: 340, at: T(37) - 0.1}]},
  {a: 16.0, b: 17.4, lines: [{t: 'AHORA YA TIENES', size: 70, y: 280, at: T(45), color: C.mute, ls: 0.12}]},
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
  const cam = camAt(t);
  const mainP = pose(MAIN, t);
  const others = OTHERS.map((w) => ({w, p: pose(w, t)}));
  const n = LANDINGS.filter((l) => l <= t).length;
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
      const sx = mainP.x + 14;
      const sy = GY - 170;
      flying.push(<CoinFlat key={'p' + i} x={lerp(sx, h.x, u)} y={lerp(sy, h.y - 10, u) - 60 * 4 * u * (1 - u)} r={18} rot={u * 360} />);
    }
  });
  ALL.forEach((w) => {
    const slotX = w.x1;
    const from = handPos(slotX, -125);
    w.rel.forEach((r, i) => {
      const u = (t - r) / FLIGHT;
      if (u > 0 && u < 1) {
        flying.push(<CoinFlat key={w.id + i} x={lerp(from.x, TUBE_X, u)} y={lerp(from.y, GY - 500, u) - 190 * 4 * u * (1 - u)} r={22} rot={u * 540} />);
      }
    });
  });
  // aro de la sociedad
  const ringP = spr(f, CHEER - 0.1, 14, 140, 0.8);
  return (
    <AbsoluteFill style={{transform: `translateX(${impact}px)`}}>
      <Skyline cam={cam} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 3000, height: 1920, transform: `translate(${-cam * S}px, 0) scale(${S})`, transformOrigin: '0 0'}}>
        <Ground />
        <Market lit={lit} f={f} />
        <Gate hh={hh} />
        <Tube n={n} t={t} f={f} />
        {others.map(({w, p}) => (t >= w.t0 - 0.05 ? <Figure key={w.id} x={p.x} spec={w} p={p} /> : null))}
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
        {flying}
        {t > CHEER - 0.12 && (
          <svg style={{position: 'absolute', left: 1330 - 300, top: GY - 560, overflow: 'visible', opacity: cl(ringP * 2)}} width={600} height={660} viewBox="-300 -560 600 660">
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
];

export const DeconstruyendoContinuoMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <Brand value={BRAND}>
    <AbsoluteFill style={{background: C.abyssDD}}>
      <Backdrop moods={[{at: 0, mood: 'abyss'}]} />
      <World />
      <Grain />
      <Frame serie="DECONSTRUYENDO LAS FINANZAS" total={DECOC_TOTAL} pasos={PASOS} nota="Contenido educativo, no es recomendación de inversión." />
      <TitlesLayer />
      <Captions groups={groups} keys={KEYS} />
      {audio && <Audio src={staticFile('deconstruyendo-continuo/voz_mix.wav')} />}
    </AbsoluteFill>
  </Brand>
);

const TitlesLayer: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <>
      <Titles t={t} />
      <StampTitle at={T(15) - 0.04} until={T(19) - 0.15} lines={['INVERSIONISTA']} size={84} y={340} />
      <StampTitle at={T(49) - 0.05} until={DECOC_TOTAL + 1} lines={['SOCIEDAD DE', 'INVERSIÓN']} size={86} y={290} />
    </>
  );
};

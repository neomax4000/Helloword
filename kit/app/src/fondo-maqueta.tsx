// CÓMO FUNCIONA UN FONDO DE INVERSIÓN — T07 de la semana de pruebas (28 nov 2026)
// Variables a probar: apertura = conclusión primero · texto = poco (una etiqueta por pieza) ·
// estructura = «Pero…» (cada solución crea el siguiente problema) · fondo = isométrico, maqueta que se arma ·
// 70–90 s · voz 3. Todo en SVG/Remotion, sin fotos ni material con derechos.
import React from 'react';
import {AbsoluteFill, Audio, spring, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/fondo-maqueta/words.json';
import {Backdrop, Brand, Captions, FONT, FPS, Frame, Grain, P, Wd, buildGroups, cl, easeIO, lerp, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const FM_TOTAL = blocks[blocks.length - 1].e + 0.3;
const T = (i: number) => words[i].s;
const groups = buildGroups(words, blocks, 24, 4);
const KEYS = ['FONDO', 'PERO', 'AUTORIZACIÓN', 'OPERADORA', 'CUSTODIO', 'CUMPLIMIENTO', 'PRECIO', 'DISTRIBUIDORA', 'LIQUIDACIÓN', 'GARANTIZA', 'SUBIR', 'BAJAR'];
const SERIE = {accent: '#FF3D8E', accentDeep: '#C21F66', logo: false}; // Pulse (paleta Deconstruyendo)

/* ---------- proyección isométrica ---------- */
const S = 48;
const C30 = 0.8660254;
const OX = 540;
const OY = 690;
const proj = (x: number, y: number, z: number): [number, number] => [OX + (x - y) * C30 * S, OY + (x + y) * 0.5 * S - z * S];
const sp = (t: number, at: number, d = 11, s = 150, m = 0.8) => spring({frame: Math.round((t - at) * FPS), fps: FPS, config: {damping: d, stiffness: s, mass: m}});

const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(cl(v * k, 0, 255)));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

type Bx = {k: string; x: number; y: number; z: number; w: number; d: number; h: number; c: string};
type Item = {sk: number; node: React.ReactNode};

const pts = (a: [number, number][]) => a.map((p) => p.join(',')).join(' ');

/** caja isométrica; dz = desplazamiento vertical (caída), op = opacidad */
const boxNode = (b: Bx, dz = 0, op = 1) => {
  const {x, y, w, d, h} = b;
  const z = b.z + dz;
  const top = pts([proj(x, y, z + h), proj(x + w, y, z + h), proj(x + w, y + d, z + h), proj(x, y + d, z + h)]);
  const left = pts([proj(x, y + d, z), proj(x + w, y + d, z), proj(x + w, y + d, z + h), proj(x, y + d, z + h)]);
  const right = pts([proj(x + w, y, z), proj(x + w, y + d, z), proj(x + w, y + d, z + h), proj(x + w, y, z + h)]);
  const st = 'rgba(0,0,0,0.22)';
  return (
    <g key={b.k} opacity={op}>
      <polygon points={left} fill={shade(b.c, 0.98)} stroke={st} strokeWidth={1.4} strokeLinejoin="round" />
      <polygon points={right} fill={shade(b.c, 0.7)} stroke={st} strokeWidth={1.4} strokeLinejoin="round" />
      <polygon points={top} fill={shade(b.c, 1.2)} stroke={st} strokeWidth={1.4} strokeLinejoin="round" />
    </g>
  );
};
/** matriz para dibujar sobre la cara izquierda (plano y = b.y + b.d): unidades (x local, z local) */
const mLeft = (b: Bx, dz = 0) => {
  const [e, f] = proj(b.x, b.y + b.d, b.z + dz);
  return `matrix(${C30 * S},${0.5 * S},0,${-S},${e},${f})`;
};
/** cara derecha (plano x = b.x + b.w): unidades (y local, z local) */
const mRight = (b: Bx, dz = 0) => {
  const [e, f] = proj(b.x + b.w, b.y, b.z + dz);
  return `matrix(${-C30 * S},${0.5 * S},0,${-S},${e},${f})`;
};

/* ---------- datos de la maqueta ---------- */
const SAND = '#EADFC6';
const TEAL = '#28AFCB';
const PINK = '#FF3D8E';
const BLUE = '#4C74FF';
const AMBER = '#FFC247';
const MINT = '#35E0A1';
const CORAL = '#FF6B5E';
const PLUM = '#B455FF';
const SKY = '#7FB2FF';
const STEEL = '#8FA3BF';

const INV = [
  {y: 3.3, c: AMBER, ty: 3.9},
  {y: 4.0, c: MINT, ty: 4.3},
  {y: 4.7, c: CORAL, ty: 4.7},
  {y: 5.4, c: SKY, ty: 5.1},
];
const IX = -2.4;

// tiempos de caída de cada pieza (segundos), atados a la palabra que la nombra
const AT = {
  gate: T(24) - 0.15,
  oper: T(42) - 0.15,
  wall: T(59) - 0.1,
  vault: T(79) - 0.15,
  comite: T(95) - 0.15,
  cumpl: T(101) - 0.15,
  meter: T(110) - 0.1,
  prov: T(144) - 0.15,
  kiosk: T(162) - 0.15,
  clock: T(174) - 0.1,
};
const END0 = T(219) - 0.6; // las piezas se levantan y la maqueta vuelve al primer cuadro
const END1 = END0 + 2.1;

// cámara: llega a cada punto en `t` (la transición dura 1 s antes)
const CAM = [
  {t: 0, fx: 4.5, fy: 4.5, fz: 0.5, z: 1.08},
  {t: 6.2, fx: 4.5, fy: 4.5, fz: 0.5, z: 1.08},
  {t: AT.gate, fx: 2.2, fy: 4.4, fz: 1.0, z: 1.32},
  {t: 13.6, fx: 4.5, fy: 4.5, fz: 0.5, z: 1.08},
  {t: AT.oper, fx: 6.6, fy: 2.4, fz: 1.2, z: 1.3},
  {t: 19.4, fx: 4.5, fy: 4.5, fz: 0.5, z: 1.08},
  {t: AT.wall + 0.4, fx: 4.5, fy: 4.5, fz: 0.5, z: 1.4},
  {t: AT.vault, fx: 1.9, fy: 6.6, fz: 0.9, z: 1.3},
  {t: AT.comite, fx: 6.6, fy: 4.2, fz: 1.0, z: 1.3},
  {t: AT.meter, fx: 6.4, fy: 6.6, fz: 0.9, z: 1.3},
  {t: AT.prov, fx: 5.2, fy: 7.0, fz: 0.9, z: 1.3},
  {t: AT.kiosk, fx: 3.2, fy: 7.1, fz: 0.7, z: 1.32},
  {t: AT.clock + 0.2, fx: 4.0, fy: 1.2, fz: 1.4, z: 1.28},
  {t: T(202) - 0.4, fx: 6.4, fy: 6.2, fz: 1.0, z: 1.18},
  {t: END0 + 0.3, fx: 4.5, fy: 4.5, fz: 0.5, z: 1.08},
  {t: 9999, fx: 4.5, fy: 4.5, fz: 0.5, z: 1.08},
];
const cam = (t: number) => {
  let i = 0;
  while (i < CAM.length - 2 && t >= CAM[i + 1].t) i++;
  const a = CAM[i];
  const b = CAM[i + 1];
  const p = easeIO(prog(t, b.t - 1.0, b.t));
  return {fx: lerp(a.fx, b.fx, p), fy: lerp(a.fy, b.fy, p), fz: lerp(a.fz, b.fz, p), z: lerp(a.z, b.z, p)};
};
const camPt = (t: number, wx: number, wy: number, wz: number): [number, number] => {
  const c = cam(t);
  const [px, py] = proj(wx, wy, wz);
  const [cx, cy] = proj(c.fx, c.fy, c.fz);
  return [540 + c.z * (px - cx), 760 + c.z * (py - cy)];
};

/* ---------- la maqueta ---------- */
const Maqueta: React.FC<{t: number}> = ({t}) => {
  const items: Item[] = [];
  const add = (sk: number, node: React.ReactNode) => items.push({sk, node});
  const endP = easeIO(prog(t, END0, END1));
  const key = (b: Bx) => b.x + b.w / 2 + b.y + b.d / 2 + b.z * 0.01;
  /** pieza que cae al aparecer y se levanta al final */
  const drop = (b: Bx, at: number, sk?: number, deco?: (dz: number) => React.ReactNode) => {
    const p = Math.min(sp(t, at), 1 - endP);
    if (p <= 0.001) return;
    const dz = (1 - p) * 6;
    add(sk ?? key(b), <g key={b.k}>{boxNode(b, dz, cl(p * 3))}{deco && <g opacity={cl(p * 3)}>{deco(dz)}</g>}</g>);
  };

  // plataforma y muelle (siempre)
  add(-1000, boxNode({k: 'slab', x: 0, y: 0, z: -0.4, w: 9, d: 9, h: 0.4, c: SAND}));
  add(-999, boxNode({k: 'dock', x: -3.4, y: 2.6, z: -0.4, w: 3.4, d: 3.6, h: 0.3, c: '#D8CCB0'}));
  // rejilla de la plataforma
  const grid: React.ReactNode[] = [];
  for (let i = 1; i < 9; i++) {
    const a = proj(i, 0, 0);
    const b = proj(i, 9, 0);
    const c = proj(0, i, 0);
    const d = proj(9, i, 0);
    grid.push(<line key={'gx' + i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="rgba(60,50,30,0.13)" strokeWidth={1.4} />);
    grid.push(<line key={'gy' + i} x1={c[0]} y1={c[1]} x2={d[0]} y2={d[1]} stroke="rgba(60,50,30,0.13)" strokeWidth={1.4} />);
  }
  add(-998, <g key="grid">{grid}</g>);

  // inversionistas (siempre; se mecen un poco)
  INV.forEach((v, i) => {
    const bob = Math.sin(t * 2.2 + i) * 0.04;
    const body: Bx = {k: 'inv' + i, x: IX, y: v.y, z: -0.1 + bob, w: 0.55, d: 0.55, h: 0.9, c: v.c};
    const head: Bx = {k: 'invh' + i, x: IX + 0.08, y: v.y + 0.08, z: 0.8 + bob, w: 0.4, d: 0.4, h: 0.4, c: shade(v.c, 1.15).replace(/rgb\((\d+),(\d+),(\d+)\)/, (_m, r, g, b) => '#' + [r, g, b].map((q) => (+q).toString(16).padStart(2, '0')).join(''))};
    add(IX + v.y + 0.5 + i * 0.001, <g key={'p' + i}>{boxNode(body)}{boxNode(head)}</g>);
  });

  // monedas: salen de cada inversionista hacia la reserva; al final regresan
  const coinAt = (k: number) => 0.45 + k * 0.32;
  INV.forEach((v, i) => {
    const fw = prog(t, coinAt(i), coinAt(i) + 1.0);
    const bw = 1 - prog(t, END0 + 0.5 + i * 0.25, END0 + 1.7 + i * 0.25);
    const pr = t < END0 ? fw : bw;
    if (pr <= 0.001 || pr >= 0.999) return;
    const e = easeIO(pr);
    const x = lerp(IX + 0.6, 3.6, e);
    const y = lerp(v.y + 0.1, v.ty, e);
    const z = 0.15 + Math.sin(pr * Math.PI) * 0.9;
    add(x + y + 0.4, boxNode({k: 'coin' + i, x, y, z, w: 0.34, d: 0.34, h: 0.12, c: AMBER}));
  });

  // reserva (4 partes iguales): crece al llegar las monedas; se abre en partes
  const arrival = t < END0 ? prog(t, 0.9, 2.7) : 1 - prog(t, END0 + 1.0, END1);
  const gap = 0.14 * easeIO(prog(t, T(6) - 0.05, T(7) + 0.1)) * (1 - endP);
  const osc = t > T(202) && t < END0 ? Math.sin((t - T(202)) * 2.3) * 0.22 * cl(prog(t, T(202), T(203)) * 1.5) : 0;
  const poolH = 0.14 + 0.96 * arrival + osc * arrival;
  [0, 1].forEach((a) =>
    [0, 1].forEach((b) => {
      const px = 3.6 + a * (0.9 + gap) - gap / 2;
      const py = 3.6 + b * (0.9 + gap) - gap / 2;
      add(px + py + 0.9 + 0.2, boxNode({k: `pool${a}${b}`, x: px, y: py, z: 0, w: 0.9, d: 0.9, h: poolH, c: TEAL}));
    })
  );

  // 1. autorización: arco sobre el camino de las monedas
  const gateP = Math.min(sp(t, AT.gate), 1 - endP);
  if (gateP > 0.001) {
    const dz = (1 - gateP) * 6;
    const o = cl(gateP * 3);
    const pil = (yy: number, k: string): Bx => ({k, x: 1.0, y: yy, z: 0, w: 0.4, d: 0.4, h: 2.3, c: PINK});
    const lin: Bx = {k: 'lintel', x: 1.0, y: 3.0, z: 2.3, w: 0.4, d: 3.3, h: 0.5, c: PINK};
    add(5.6, <g key="gate">{boxNode(pil(3.0, 'gp1'), dz, o)}{boxNode(pil(5.9, 'gp2'), dz, o)}{boxNode(lin, dz, o)}</g>);
    // sello que aparece al decir «ya autorizado»
    const st = sp(t, T(28), 9, 220, 0.6);
    if (st > 0.01 && t < T(35) + 0.8) {
      const [sx, sy] = proj(1.2, 4.5, 3.1 + dz);
      add(5.7, (
        <g key="stamp" transform={`translate(${sx},${sy - 26}) rotate(-6) scale(${lerp(1.7, 1, st)})`} opacity={cl(st * 2) * (1 - cl((t - T(35)) / 0.8))}>
          <rect x={-120} y={-30} width={240} height={60} rx={12} fill="none" stroke="#fff" strokeWidth={5} />
          <text x={0} y={14} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#fff" letterSpacing={4}>AUTORIZADO</text>
        </g>
      ));
    }
  }

  // 2. sociedad operadora: edificio + cubos que van y vienen (compra y venta)
  const oper: Bx = {k: 'oper', x: 6.4, y: 0.6, z: 0, w: 1.7, d: 1.7, h: 2.8, c: BLUE};
  drop(oper, AT.oper, undefined, (dz) => (
    <>
      {[0.5, 1.3, 2.1].map((zz) =>
        [0.3, 1.0].map((yy) => (
          <rect key={`w${zz}${yy}`} transform={mRight(oper, dz)} x={yy} y={-zz - 0.3} width={0.4} height={0.3} fill="#CFE0FF" opacity={0.9} />
        ))
      )}
    </>
  ));
  [0, 1, 2].forEach((i) => {
    const a = AT.oper + 1.5 + i * 0.5;
    const cyc = ((t - T(46)) * 0.55 + i / 3) % 1;
    if (t < T(46) - 0.2 || t > END0 - 0.5 || t > T(150) || t < a - 1.9) return;
    const pr = cyc;
    const x = lerp(6.7, 5.0, pr);
    const y = lerp(2.5, 4.2, pr);
    const z = 0.8 + Math.sin(pr * Math.PI) * 0.35;
    add(x + y + 0.5, boxNode({k: 'cv' + i, x, y, z, w: 0.3, d: 0.3, h: 0.3, c: i % 2 ? AMBER : MINT}));
  });

  // 3. política de inversión: muros de límites + activos que entran
  const wallP = Math.min(sp(t, AT.wall, 16, 120, 0.9), 1 - endP);
  if (wallP > 0.001) {
    const wh = 0.5 * cl(wallP);
    const o = cl(wallP * 3);
    const W: Bx[] = [
      {k: 'w1', x: 2.9, y: 2.9, z: 0, w: 3.3, d: 0.18, h: wh, c: AMBER},
      {k: 'w2', x: 2.9, y: 2.9, z: 0, w: 0.18, d: 3.3, h: wh, c: AMBER},
      {k: 'w3', x: 2.9, y: 6.02, z: 0, w: 3.3, d: 0.18, h: wh, c: AMBER},
      {k: 'w4', x: 6.02, y: 2.9, z: 0, w: 0.18, d: 3.3, h: wh, c: AMBER},
    ];
    add(3.5, <g key="w12">{boxNode(W[0], 0, o)}{boxNode(W[1], 0, o)}</g>);
    add(14.2, <g key="w34">{boxNode(W[2], 0, o)}{boxNode(W[3], 0, o)}</g>);
  }
  [
    {x: 3.25, y: 5.05, c: MINT, a: T(63)},
    {x: 5.4, y: 3.2, c: CORAL, a: T(64) - 0.1},
    {x: 5.45, y: 5.1, c: PLUM, a: T(65)},
  ].forEach((v, i) => {
    const p = Math.min(sp(t, v.a, 10, 190, 0.6), 1 - endP);
    if (p <= 0.001) return;
    add(v.x + v.y + 1.4, boxNode({k: 'act' + i, x: v.x, y: v.y, z: 0, w: 0.4, d: 0.4, h: 0.4, c: v.c}, (1 - p) * 5, cl(p * 3)));
  });

  // 4. custodio: bóveda aparte, a nombre de los inversionistas
  const vault: Bx = {k: 'vault', x: 0.5, y: 6.8, z: 0, w: 1.5, d: 1.5, h: 1.5, c: STEEL};
  drop(vault, AT.vault, undefined, (dz) => (
    <g transform={mLeft(vault, dz)}>
      <circle cx={0.75} cy={-0.75} r={0.46} fill="#2A3550" />
      <circle cx={0.75} cy={-0.75} r={0.34} fill="none" stroke={AMBER} strokeWidth={0.07} />
      <rect x={0.7} y={-1.12} width={0.1} height={0.74} fill={AMBER} />
      <rect x={0.38} y={-0.8} width={0.74} height={0.1} fill={AMBER} />
    </g>
  ));
  // hilo del custodio a la reserva (pulso)
  if (t > AT.vault + 0.6 && t < END0 - 0.3 && t < T(230 - 4) + 99) {
    const [x1, y1] = proj(1.6, 7.0, 1.55);
    const [x2, y2] = proj(3.7, 5.6, 0.3);
    const pr = (t * 0.7) % 1;
    add(7.9, (
      <g key="thread" opacity={cl(prog(t, AT.vault + 0.6, AT.vault + 1.1))}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={AMBER} strokeWidth={4} strokeDasharray="10 10" strokeDashoffset={-t * 40} />
        <circle cx={lerp(x1, x2, pr)} cy={lerp(y1, y2, pr)} r={8} fill={AMBER} />
      </g>
    ));
  }

  // 5. comité y cumplimiento: dos torres con ojo
  const com: Bx = {k: 'com', x: 6.8, y: 3.2, z: 0, w: 0.9, d: 0.9, h: 2.2, c: PLUM};
  const cum: Bx = {k: 'cum', x: 6.8, y: 4.8, z: 0, w: 0.9, d: 0.9, h: 2.7, c: MINT};
  const eye = (b: Bx, hh: number, ph: number) => (dz: number) => {
    const bl = 0.5 + 0.5 * Math.sin(t * 1.6 + ph);
    return (
      <g transform={mLeft(b, dz)}>
        <ellipse cx={0.45} cy={-hh} rx={0.32} ry={0.2 + 0.04 * bl} fill="#fff" />
        <circle cx={0.45 + Math.sin(t * 1.3 + ph) * 0.1} cy={-hh} r={0.12} fill="#10182E" />
      </g>
    );
  };
  drop(com, AT.comite, undefined, eye(com, 1.7, 0));
  drop(cum, AT.cumpl, undefined, eye(cum, 2.1, 1.7));

  // 6. precio por parte: medidor
  const ped: Bx = {k: 'ped', x: 6.9, y: 6.4, z: 0, w: 1.2, d: 1.2, h: 0.35, c: '#243049'};
  const mp = Math.min(sp(t, AT.meter), 1 - endP);
  if (mp > 0.001) {
    const suma = easeIO(prog(t, T(118), T(118) + 0.9));
    const resta = easeIO(prog(t, T(125), T(125) + 0.9));
    const div = easeIO(prog(t, T(131), T(131) + 0.9));
    let hh = 0.5 + 1.1 * suma - 0.5 * resta - 0.15 * div;
    if (t > T(202) && t < END0) hh += Math.sin((t - T(202)) * 2.3) * 0.5 * cl(prog(t, T(202), T(203)) * 1.5);
    const bar: Bx = {k: 'bar', x: 7.2, y: 6.7, z: 0.35, w: 0.6, d: 0.6, h: Math.max(0.15, hh), c: MINT};
    const dz = (1 - mp) * 6;
    add(14.2, <g key="meter">{boxNode(ped, dz, cl(mp * 3))}{boxNode(bar, dz, cl(mp * 3))}</g>);
  }

  // 7. proveedor de precios (independiente)
  const prov: Bx = {k: 'prov', x: 4.9, y: 7.4, z: 0, w: 1.0, d: 1.0, h: 1.8, c: SKY};
  drop(prov, AT.prov, undefined, (dz) => {
    const a = -0.9 + 1.8 * (0.5 + 0.5 * Math.sin(t * 1.4));
    return (
      <g transform={mRight(prov, dz)}>
        <circle cx={0.5} cy={-1.15} r={0.36} fill="#fff" stroke="#10182E" strokeWidth={0.05} />
        <line x1={0.5} y1={-1.15} x2={0.5 + Math.sin(a) * 0.28} y2={-1.15 - Math.cos(a) * 0.28} stroke={PINK} strokeWidth={0.06} strokeLinecap="round" />
      </g>
    );
  });

  // 8. distribuidora: kiosco + cliente que camina
  const kio: Bx = {k: 'kio', x: 2.3, y: 7.3, z: 0, w: 1.4, d: 1.1, h: 1.0, c: CORAL};
  const awn: Bx = {k: 'awn', x: 2.1, y: 7.1, z: 1.0, w: 1.8, d: 1.5, h: 0.15, c: '#FFFFFF'};
  const kp = Math.min(sp(t, AT.kiosk), 1 - endP);
  if (kp > 0.001) {
    const dz = (1 - kp) * 6;
    add(9.9, <g key="kiosk">{boxNode(kio, dz, cl(kp * 3))}{boxNode(awn, dz, cl(kp * 3))}</g>);
  }
  const cw = prog(t, T(165), T(171));
  if (t > T(163) && t < END0 - 0.2) {
    const back = prog(t, T(196), T(201));
    const e = easeIO(cw) * (1 - easeIO(back));
    const cx = lerp(IX, 1.9, e);
    const cy = lerp(5.9, 6.8, e);
    const cb: Bx = {k: 'cli', x: cx, y: cy, z: -0.1 + (e > 0 && e < 1 ? Math.abs(Math.sin(t * 9)) * 0.08 : 0), w: 0.5, d: 0.5, h: 0.8, c: '#FFFFFF'};
    const ch: Bx = {k: 'clih', x: cx + 0.07, y: cy + 0.07, z: cb.z + 0.7, w: 0.36, d: 0.36, h: 0.36, c: '#F3E5C8'};
    add(cx + cy + 0.6, <g key="cli" opacity={cl(prog(t, T(163), T(163) + 0.3))}>{boxNode(cb)}{boxNode(ch)}</g>);
  }
  // moneda del cliente: kiosco → reserva (compra), y reserva → cliente (reembolso, tras la liquidación)
  const buy = prog(t, T(170) + 0.1, T(172) + 0.6);
  if (buy > 0.001 && buy < 0.999 && t < END0) {
    const e = easeIO(buy);
    add(11, boxNode({k: 'buyc', x: lerp(2.8, 3.9, e), y: lerp(7.0, 5.0, e), z: 0.5 + Math.sin(buy * Math.PI) * 0.8, w: 0.34, d: 0.34, h: 0.12, c: AMBER}));
  }
  const sell = prog(t, T(197), T(201) + 0.6);
  if (sell > 0.001 && sell < 0.999) {
    const e = easeIO(sell);
    add(11, boxNode({k: 'sellc', x: lerp(4.1, 2.2, e), y: lerp(5.2, 6.9, e), z: 0.5 + Math.sin(sell * Math.PI) * 0.8, w: 0.34, d: 0.34, h: 0.12, c: MINT}));
  }

  // 9. hora de corte: torre con reloj
  const clk: Bx = {k: 'clk', x: 3.5, y: 0.5, z: 0, w: 0.8, d: 0.8, h: 2.9, c: '#F1EBDD'};
  drop(clk, AT.clock, undefined, (dz) => {
    const ang = ((t - AT.clock) / 4.2) * Math.PI * 2;
    const flash = t > T(187) && t < T(187) + 0.7 ? 1 - (t - T(187)) / 0.7 : 0;
    return (
      <g transform={mRight(clk, dz)}>
        <circle cx={0.4} cy={-2.35} r={0.33} fill="#fff" stroke="#10182E" strokeWidth={0.06} />
        <circle cx={0.4} cy={-2.35} r={0.33 + flash * 0.25} fill="none" stroke={PINK} strokeWidth={0.07 * flash} opacity={flash} />
        <line x1={0.4} y1={-2.35} x2={0.4 + Math.sin(ang) * 0.26} y2={-2.35 - Math.cos(ang) * 0.26} stroke="#10182E" strokeWidth={0.05} strokeLinecap="round" />
        <line x1={0.4} y1={-2.35} x2={0.4 + Math.sin(ang / 12) * 0.17} y2={-2.35 - Math.cos(ang / 12) * 0.17} stroke="#10182E" strokeWidth={0.07} strokeLinecap="round" />
      </g>
    );
  });

  items.sort((a, b) => a.sk - b.sk);
  const c = cam(t);
  const [cx, cy] = proj(c.fx, c.fy, c.fz);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
      <g transform={`translate(540,760) scale(${c.z}) translate(${-cx},${-cy})`}>{items.map((it, i) => <React.Fragment key={i}>{it.node}</React.Fragment>)}</g>
    </svg>
  );
};

/* ---------- etiquetas (pocas: una por pieza) ---------- */
type Lab = {text: string; a: number; b: number; at: [number, number, number]};
const LABS: Lab[] = [
  {text: 'AUTORIZACIÓN', a: AT.gate + 0.1, b: T(28) - 0.15, at: [1.2, 4.5, 3.3]},
  {text: 'SOCIEDAD OPERADORA', a: AT.oper + 0.1, b: blocks[3].s + 0.2, at: [7.25, 1.45, 3.6]},
  {text: 'POLÍTICA DE INVERSIÓN', a: AT.wall, b: blocks[4].s + 0.2, at: [4.5, 2.9, 2.4]},
  {text: 'CUSTODIO', a: AT.vault + 0.1, b: blocks[5].s + 0.2, at: [1.25, 7.55, 2.2]},
  {text: 'COMITÉ', a: AT.comite + 0.1, b: AT.cumpl, at: [7.25, 3.65, 3.0]},
  {text: 'CUMPLIMIENTO', a: AT.cumpl + 0.1, b: blocks[6].s + 0.2, at: [7.25, 5.25, 3.5]},
  {text: 'PRECIO POR PARTE', a: AT.meter + 0.1, b: blocks[7].s + 0.2, at: [7.5, 7.0, 2.4]},
  {text: 'PROVEEDOR DE PRECIOS', a: AT.prov + 0.1, b: blocks[8].s + 0.2, at: [5.4, 7.9, 2.5]},
  {text: 'DISTRIBUIDORA', a: AT.kiosk + 0.1, b: blocks[9].s + 0.2, at: [3.0, 7.85, 1.7]},
  {text: 'HORA DE CORTE', a: AT.clock + 0.1, b: T(187) + 0.6, at: [3.9, 0.9, 3.6]},
  {text: 'AL DÍA SIGUIENTE', a: T(187) + 0.6, b: T(194) - 0.1, at: [3.9, 0.9, 3.6]},
  {text: 'PLAZO DE LIQUIDACIÓN', a: T(194) - 0.1, b: blocks[10].s + 0.2, at: [3.9, 0.9, 3.6]},
  {text: 'EL VALOR PUEDE SUBIR O BAJAR', a: T(207) - 0.1, b: END0, at: [7.5, 7.0, 2.6]},
];
const Labels: React.FC<{t: number}> = ({t}) => (
  <>
    {LABS.map((l) => {
      if (t < l.a || t > l.b + 0.25) return null;
      const pin = sp(t, l.a, 13, 220, 0.6);
      const pout = cl((t - l.b) / 0.25);
      let [x, y] = camPt(t, l.at[0], l.at[1], l.at[2]);
      x = cl(x, 330, 750);
      y = cl(y, 300, 1180);
      return (
        <div key={l.text} style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-100%) translateY(${(1 - pin) * 30}px) scale(${lerp(0.8, 1, pin)})`, opacity: cl(pin * 2) * (1 - pout)}}>
          <div style={{background: '#fff', color: '#0A0F1F', fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: '0.08em', padding: '12px 28px', borderRadius: 999, whiteSpace: 'nowrap', boxShadow: '0 14px 30px rgba(0,0,0,0.4), 0 0 0 4px #FF3D8E'}}>{l.text}</div>
        </div>
      );
    })}
  </>
);

/** fórmula del precio: se arma con las palabras suma / resta / divide */
const Formula: React.FC<{t: number}> = ({t}) => {
  const parts = [
    {s: 'ACTIVOS', a: T(118) - 0.1},
    {s: '− DEUDAS', a: T(125) - 0.1},
    {s: '÷ PARTES', a: T(131) - 0.1},
  ];
  if (t < parts[0].a || t > T(139)) return null;
  const pout = cl((t - (T(139) - 0.3)) / 0.3);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 1180, display: 'flex', justifyContent: 'center', gap: 18, opacity: 1 - pout}}>
      {parts.map((p) => {
        const k = sp(t, p.a, 11, 230, 0.55);
        if (k <= 0.001) return null;
        return <div key={p.s} style={{background: 'rgba(255,255,255,0.14)', border: '3px solid rgba(255,255,255,0.4)', color: '#fff', fontFamily: FONT, fontWeight: 800, fontSize: 44, letterSpacing: '0.06em', padding: '10px 26px', borderRadius: 18, opacity: cl(k * 2), transform: `scale(${lerp(0.7, 1, k)})`}}>{p.s}</div>;
      })}
    </div>
  );
};

/** título: conclusión primero. Visible desde el cuadro 0 y de nuevo al cierre (bucle) */
const Title: React.FC<{t: number}> = ({t}) => {
  const vis = t < blocks[1].s ? 1 - cl((t - (blocks[0].e - 0.2)) / 0.4) : cl((t - (END0 + 1.0)) / 0.5);
  if (vis <= 0.01) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 215, textAlign: 'center', opacity: vis, fontFamily: FONT, textShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>
      <div style={{fontWeight: 700, fontSize: 70, color: P.mute, letterSpacing: '0.02em'}}>UN FONDO DE</div>
      <div style={{fontWeight: 800, fontSize: 142, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.0}}>INVERSIÓN</div>
      <div style={{width: 380, height: 12, background: PINK, borderRadius: 8, margin: '14px auto 0'}} />
    </div>
  );
};

const EndQ: React.FC<{t: number}> = ({t}) => {
  const a = blocks[11].s + 0.4;
  if (t < a) return null;
  const k = sp(t, a, 13, 200, 0.7);
  return (
    <>
      <div style={{position: 'absolute', left: 60, right: 60, top: 1165, textAlign: 'center', opacity: cl(k * 2), transform: `translateY(${(1 - k) * 24}px)`}}>
        <div style={{display: 'inline-block', background: '#FFE27A', color: '#0A0F1F', fontFamily: FONT, fontWeight: 800, fontSize: 36, padding: '14px 30px', borderRadius: 20, transform: 'rotate(-1.5deg)', boxShadow: '0 10px 0 rgba(0,0,0,0.25)'}}>¿QUÉ CAPA NO CONOCÍAS? ESCRÍBELO</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1245, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 38, color: '#fff', opacity: cl(k * 2)}}>＋ SÍGUEME</div>
    </>
  );
};

const NOTA = 'Contenido educativo, no es recomendación de inversión. El valor del fondo puede subir o bajar; no es garantía de rendimiento. Fuente: Ley de Fondos de Inversión (DOF) y CNBV.';

const Inner: React.FC<{t: number}> = ({t}) => (
  <>
    <Maqueta t={t} />
    <Formula t={t} />
    <Labels t={t} />
    <Title t={t} />
  </>
);

const Live: React.FC = () => {
  const f = useCurrentFrame();
  return <Inner t={f / FPS} />;
};
const LiveQ: React.FC = () => {
  const f = useCurrentFrame();
  return <EndQ t={f / FPS} />;
};

export const FondoMaquetaMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <Brand value={SERIE}>
    <AbsoluteFill style={{background: P.ink}}>
      <Backdrop moods={[{at: 0, mood: 'abyss'}]} />
      <Live />
      <Grain />
      <Frame serie="CÓMO FUNCIONA UN FONDO" total={FM_TOTAL} nota={NOTA} />
      <LiveQ />
      <Captions groups={groups} keys={KEYS} y={1300} />
      {audio && <Audio src={staticFile('fondo-maqueta/voz_mix.wav')} />}
    </AbsoluteFill>
  </Brand>
);

export const FondoMaquetaCover: React.FC = () => (
  <Brand value={SERIE}>
    <AbsoluteFill style={{background: P.ink}}>
      <Backdrop moods={[{at: 0, mood: 'abyss'}]} />
      <Maqueta t={73.5} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 200, textAlign: 'center', fontFamily: FONT, textShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>
        <div style={{fontWeight: 700, fontSize: 70, color: P.mute}}>UN FONDO DE INVERSIÓN</div>
        <div style={{fontWeight: 800, fontSize: 150, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.0}}>POR DENTRO</div>
        <div style={{width: 380, height: 12, background: PINK, borderRadius: 8, margin: '14px auto 0'}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1300, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 56, color: '#fff'}}>Cada capa, una pieza</div>
      <Grain />
    </AbsoluteFill>
  </Brand>
);

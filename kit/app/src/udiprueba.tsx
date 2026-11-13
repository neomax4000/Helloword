import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/udiprueba/words.json';
import {FONT, FPS, W} from './theme';
import {F, cl, ease} from './narrador';

/* ============ GLOSARIO FINANCIERO — estilo claro (plantilla) ============
   Fondo blanco con lavados pastel, texto azul Actinver, detalles dorados, gris de apoyo.
   Sin giros ni temblores: solo aparecer, subir/bajar, trasladar y desvanecer. Fondo casi quieto. */
const NAVY = '#041E42', GOLD = '#B3A369', GOLD_D = '#8F8250', GRAY = '#555759', STRONG = '#1B4FC4';
const P_BLUE = '#D3E3F8', P_MINT = '#D2EEE0', P_SAND = '#F6EBC8', P_ROSE = '#F7D8D4', P_LAV = '#E0DBF5';
const STROKE = 5;

type Word = {i: number; w: string; s: number; e: number};
const words = data.words as Word[];
const TS: Record<number, number> = {};
words.forEach((x) => (TS[x.i] = x.s));
const T = (i: number) => {
  for (let k = i; k < i + 5; k++) if (TS[k] !== undefined) return TS[k];
  return 0;
};

/* ---- ESCENAS ---- */
const SHOTS_RAW = [
  {w: 0, k: 'hook', bg: 0},
  {w: 8, k: 'def', bg: 1}, {w: 18, k: 'banxico', bg: 1},
  {w: 25, k: 'hipo', bg: 2}, {w: 38, k: 'ejemplo', bg: 2},
  {w: 49, k: 'consejo', bg: 0}, {w: 58, k: 'loop', bg: 0},
];
type Shot = {w: number; k: string; bg: number; a: number; b: number};
const shots: Shot[] = SHOTS_RAW.map((s, i, arr) => ({
  ...s,
  a: i === 0 ? 0 : T(s.w) - 0.08,
  b: i < arr.length - 1 ? T(arr[i + 1].w) - 0.08 : data.total + 1,
}));

/* ---------------- fondos: blanco con lavado pastel + círculos tenues y lentos ---------------- */
const WASH = ['#E3EDFA', '#E1F3EA', '#FAF1D6'];
const DOTS = [
  {x: 160, y: 380, r: 300, k: 0}, {x: 940, y: 980, r: 380, k: 1}, {x: 260, y: 1560, r: 260, k: 2},
];
const ThemeBg: React.FC<{n: number; f: number}> = ({n, f}) => (
  <AbsoluteFill style={{background: `radial-gradient(1300px 1300px at 50% 36%, #FFFFFF 0%, #FFFFFF 38%, ${WASH[n]} 100%)`}}>
    {DOTS.map((d) => (
      <div key={d.k} style={{position: 'absolute', left: d.x - d.r + Math.sin(f / 140 + d.k * 2) * 18, top: d.y - d.r + Math.cos(f / 170 + d.k) * 18, width: d.r * 2, height: d.r * 2, borderRadius: '50%', background: WASH[n], opacity: 0.55}} />
    ))}
  </AbsoluteFill>
);
const Background: React.FC<{f: number; t: number}> = ({f, t}) => {
  const idx = shots.findIndex((s) => t >= s.a && t < s.b);
  const cur = shots[Math.max(0, idx)];
  let start = cur.a;
  for (let i = Math.max(0, idx); i >= 0 && shots[i].bg === cur.bg; i--) start = shots[i].a;
  let si = Math.max(0, idx);
  while (si > 0 && shots[si].bg === cur.bg) si--;
  const prev = shots[si].bg !== cur.bg ? shots[si].bg : undefined;
  const p = ease((t - start) * FPS / 18);
  return (
    <AbsoluteFill>
      {prev !== undefined && p < 1 && <ThemeBg n={prev} f={f} />}
      <AbsoluteFill style={{opacity: prev === undefined ? 1 : p}}>
        <ThemeBg n={cur.bg} f={f} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- movimiento permitido: aparecer + subir (sin giros) ---------------- */
type SP = {f: number; at: (i: number) => number; d: number};
const Rise: React.FC<{f: number; d: number; x: number; y: number; dy?: number; dx?: number; children: React.ReactNode}> = ({f, d, x, y, dy = 34, dx = 0, children}) => {
  const k = ease((f - d) / 16);
  if (k <= 0) return null;
  return <g transform={`translate(${x + (1 - k) * dx} ${y + (1 - k) * dy})`} opacity={k}>{children}</g>;
};
const Pill: React.FC<{text: string; fill?: string; tc?: string; size?: number; w?: number}> = ({text, fill = '#fff', tc = NAVY, size = 54, w}) => {
  const ww = w || text.length * size * 0.66 + 90;
  return (
    <g>
      <rect x={-ww / 2} y={-size * 0.95} width={ww} height={size * 1.7} rx={size * 0.85} fill={fill} stroke={NAVY} strokeWidth={STROKE} />
      <text textAnchor="middle" y={size * 0.35} fontFamily={FONT} fontWeight={700} fontSize={size} fill={tc}>{text}</text>
    </g>
  );
};
const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={W} height={1400} viewBox="0 0 1080 1400" style={{position: 'absolute', left: 0, top: 120, overflow: 'visible'}}>
    <defs>
      <filter id="soft" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#041E42" floodOpacity="0.12" /></filter>
    </defs>
    {children}
  </svg>
);

const CreditCard: React.FC = () => (
  <g filter="url(#soft)">
    <rect x={-220} y={-135} width={440} height={270} rx={30} fill={P_LAV} stroke={NAVY} strokeWidth={STROKE} />
    <rect x={-220} y={-75} width={440} height={56} fill={NAVY} />
    <rect x={-180} y={30} width={150} height={24} rx={12} fill="#fff" />
    <rect x={-180} y={72} width={230} height={18} rx={9} fill="#fff" opacity={0.7} />
    <circle cx={150} cy={80} r={30} fill={GOLD} stroke={NAVY} strokeWidth={STROKE} />
  </g>
);
const Coin: React.FC = () => (
  <g filter="url(#soft)">
    <circle r={70} fill={P_SAND} stroke={NAVY} strokeWidth={STROKE} />
    <circle r={50} fill="none" stroke={GOLD} strokeWidth={4} />
    <text textAnchor="middle" y={22} fontFamily={FONT} fontWeight={700} fontSize={64} fill={GOLD_D}>$</text>
  </g>
);


const Warn: React.FC = () => (
  <g filter="url(#soft)">
    <path d="M0 -150 L150 110 H-150 Z" fill={P_ROSE} stroke={NAVY} strokeWidth={STROKE} strokeLinejoin="round" />
    <rect x={-10} y={-70} width={20} height={110} rx={10} fill={NAVY} />
    <circle cx={0} cy={72} r={14} fill={NAVY} />
  </g>
);
const Meter: React.FC<{v: number; label: string; fill: string}> = ({v, label, fill}) => (
  <g>
    <rect x={-320} y={0} width={640} height={36} rx={18} fill="#E4E7EE" />
    <rect x={-320} y={0} width={Math.max(0, 640 * v)} height={36} rx={18} fill={fill} stroke={NAVY} strokeWidth={4} />
    <text x={0} y={-22} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={NAVY}>{label}</text>
  </g>
);


const Tag: React.FC<{text: string; fill?: string; tc?: string; size?: number}> = ({text, fill = P_SAND, tc = NAVY, size = 64}) => (
  <g filter="url(#soft)">
    <path d="M-150 -60 H90 L170 0 L90 60 H-150 Q-170 60 -170 40 V-40 Q-170 -60 -150 -60 Z" fill={fill} stroke={NAVY} strokeWidth={STROKE} strokeLinejoin="round" />
    <circle cx={110} cy={0} r={11} fill="#fff" stroke={NAVY} strokeWidth={4} />
    <text x={-30} y={size * 0.35} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={size} fill={tc}>{text}</text>
  </g>
);
const Building: React.FC<{fill?: string}> = ({fill = P_BLUE}) => (
  <g filter="url(#soft)">
    <rect x={-120} y={-170} width={240} height={330} rx={14} fill={fill} stroke={NAVY} strokeWidth={STROKE} />
    {[-70, -10, 50].map((y) => [-60, 20].map((x) => <rect key={x + '' + y} x={x} y={y - 80} width={42} height={42} rx={8} fill="#fff" stroke={NAVY} strokeWidth={4} />))}
    <rect x={-34} y={70} width={68} height={90} rx={8} fill={GOLD} stroke={NAVY} strokeWidth={4} />
    <rect x={-170} y={158} width={340} height={20} rx={10} fill={NAVY} />
  </g>
);
const Arrow: React.FC<{c?: string}> = ({c = GOLD_D}) => (
  <g>
    <path d="M0 90 V-60" stroke={c} strokeWidth={16} strokeLinecap="round" />
    <path d="M-45 -15 L0 -70 L45 -15" fill="none" stroke={c} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);
const Calendar: React.FC = () => (
  <g filter="url(#soft)">
    <rect x={-130} y={-120} width={260} height={240} rx={22} fill="#fff" stroke={NAVY} strokeWidth={STROKE} />
    <path d="M-130 -98 Q-130 -120 -108 -120 H108 Q130 -120 130 -98 V-50 H-130 Z" fill={NAVY} />
    <rect x={-80} y={-146} width={16} height={46} rx={8} fill={GOLD} stroke={NAVY} strokeWidth={4} />
    <rect x={64} y={-146} width={16} height={46} rx={8} fill={GOLD} stroke={NAVY} strokeWidth={4} />
    {[-80, 0, 80].map((x) => [-5, 45, 95].map((y) => <rect key={x + '_' + y} x={x - 24} y={y - 14} width={48} height={32} rx={8} fill={y === 45 && x === 0 ? GOLD : P_BLUE} />))}
  </g>
);
const House: React.FC = () => (
  <g filter="url(#soft)">
    <path d="M-170 -10 L0 -150 L170 -10 V150 H-170 Z" fill={P_MINT} stroke={NAVY} strokeWidth={STROKE} strokeLinejoin="round" />
    <path d="M-200 -5 L0 -170 L200 -5" fill="none" stroke={NAVY} strokeWidth={STROKE + 3} strokeLinecap="round" strokeLinejoin="round" />
    <rect x={-40} y={30} width={80} height={120} rx={10} fill={GOLD} stroke={NAVY} strokeWidth={4} />
    <rect x={-130} y={10} width={56} height={56} rx={8} fill="#fff" stroke={NAVY} strokeWidth={4} />
    <rect x={74} y={10} width={56} height={56} rx={8} fill="#fff" stroke={NAVY} strokeWidth={4} />
  </g>
);
const Chip: React.FC<{text: string; fill?: string; tc?: string; size?: number; w?: number}> = ({text, fill = '#fff', tc = NAVY, size = 40, w}) => <Pill text={text} fill={fill} tc={tc} size={size} w={w} />;
const Check: React.FC = () => (
  <g>
    <circle r={34} fill={GOLD} stroke={NAVY} strokeWidth={4} />
    <path d="M-15 2 L-4 14 L17 -12" fill="none" stroke={NAVY} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);
const Right: React.FC<{c?: string}> = ({c}) => <g transform="rotate(90)"><Arrow c={c} /></g>;

const Hook: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform="translate(540 400)"><Pill text="UDI" fill={NAVY} tc="#fff" size={140} w={560} /></g>
    <Rise f={f} d={at(4)} x={300} y={780}><g transform="scale(1.3)"><Calendar /></g></Rise>
    <Rise f={f} d={at(4) + 6} x={780} y={780}><g transform="scale(1.6)"><Coin /></g></Rise>
    <Rise f={f} d={at(2)} x={540} y={1010}><Chip text="CAMBIA DE VALOR" fill={P_SAND} size={50} w={780} /></Rise>
    <Rise f={f} d={at(5)} x={540} y={1140}><Chip text="TODOS LOS DÍAS" fill={P_MINT} size={50} w={780} /></Rise>
  </Svg>
);
const Def: React.FC<SP> = ({f, at}) => {
  const m = ease((f - at(14)) / 26);
  return (
    <Svg>
      <Rise f={f} d={at(10)} x={540} y={370}><Chip text="UNIDAD DE CUENTA" fill={P_LAV} size={56} w={900} /></Rise>
      <Rise f={f} d={at(8)} x={230} y={640}><g transform="scale(1.3)"><Tag text="UDI" size={52} fill={P_BLUE} /></g></Rise>
      <Rise f={f} d={at(14)} x={560} y={640}><Right /></Rise>
      <Rise f={f} d={at(16)} x={840} y={640}><g transform="scale(1.2)"><Tag text="INFLACIÓN" size={32} fill={P_ROSE} /></g></Rise>
      <Rise f={f} d={at(14)} x={540} y={900}><Meter v={0.7 * m} label="UDI" fill={P_BLUE} /></Rise>
      <Rise f={f} d={at(14)} x={540} y={1070}><Meter v={0.7 * m} label="INFLACIÓN" fill={P_ROSE} /></Rise>
    </Svg>
  );
};
const Banxico: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={at(18)} x={260} y={640}><g transform="scale(1.2)"><Building fill={P_SAND} /></g></Rise>
    <Rise f={f} d={at(19)} x={260} y={940}><Chip text="BANXICO" fill={P_SAND} size={48} w={340} /></Rise>
    <Rise f={f} d={at(20)} x={540} y={640}><Right /></Rise>
    <Rise f={f} d={at(22)} x={820} y={640}><g transform="scale(1.1)"><Calendar /></g></Rise>
    <Rise f={f} d={at(23)} x={820} y={940}><Chip text="CADA DÍA" fill={P_MINT} size={48} w={340} /></Rise>
    <Rise f={f} d={at(20)} x={540} y={1090}><Chip text="PUBLICA SU VALOR" fill={NAVY} tc="#fff" size={54} w={860} /></Rise>
  </Svg>
);
const Hipo: React.FC<SP> = ({f, at}) => {
  const m = ease((f - at(33)) / 26);
  return (
    <Svg>
      <Rise f={f} d={at(28)} x={540} y={370}><Chip text="CRÉDITO HIPOTECARIO" fill={P_SAND} size={50} w={900} /></Rise>
      <Rise f={f} d={at(28)} x={290} y={680}><g transform="scale(1.3)"><House /></g></Rise>
      <Rise f={f} d={at(26)} x={820} y={680}><g transform="scale(1.4)"><Tag text="UDI" size={52} fill={P_BLUE} /></g></Rise>
      <Rise f={f} d={at(32)} x={540} y={1000}><Meter v={0.75 * m} label="SE AJUSTA" fill={P_MINT} /></Rise>
      <Rise f={f} d={at(36)} x={540} y={1130}><Chip text="CON LOS PRECIOS" fill={P_ROSE} size={48} w={760} /></Rise>
    </Svg>
  );
};
const Ejemplo: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={at(38)} x={540} y={370}><Chip text="EJEMPLO" fill={GOLD} size={60} w={520} /></Rise>
    <Rise f={f} d={at(41)} x={260} y={690}><g filter="url(#soft)"><circle r={140} fill={P_ROSE} stroke={NAVY} strokeWidth={STROKE} /></g><text textAnchor="middle" y={12} fontFamily={FONT} fontWeight={700} fontSize={38} fill={NAVY}>INFLACIÓN</text></Rise>
    <Rise f={f} d={at(42)} x={260} y={940}><g transform="scale(0.55)"><Arrow c={GOLD_D} /></g></Rise>
    <Rise f={f} d={at(43)} x={540} y={690}><Right /></Rise>
    <Rise f={f} d={at(44)} x={820} y={690}><g filter="url(#soft)"><circle r={140} fill={P_BLUE} stroke={NAVY} strokeWidth={STROKE} /></g><text textAnchor="middle" y={-6} fontFamily={FONT} fontWeight={700} fontSize={34} fill={NAVY}>DEUDA</text><text textAnchor="middle" y={36} fontFamily={FONT} fontWeight={700} fontSize={34} fill={NAVY}>EN UDIS</text></Rise>
    <Rise f={f} d={at(47)} x={820} y={940}><g transform="scale(0.55)"><Arrow c={GOLD_D} /></g></Rise>
    <Rise f={f} d={at(48)} x={540} y={1120}><Chip text="AMBAS SUBEN" fill={NAVY} tc="#fff" size={54} w={680} /></Rise>
  </Svg>
);
const Consejo: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={at(49)} x={540} y={370}><Chip text="ANTES DE CONTRATAR" fill={NAVY} tc="#fff" size={52} w={920} /></Rise>
    {[['REVISA', 52, 620, P_MINT], ['CÓMO SE AJUSTA', 55, 800, P_SAND], ['TU PAGO', 57, 980, P_ROSE]].map(([t, w, y, c]) => (
      <React.Fragment key={t as string}>
        <Rise f={f} d={at(w as number)} x={170} y={y as number}><Check /></Rise>
        <Rise f={f} d={at(w as number)} x={600} y={y as number}><Chip text={t as string} fill={c as string} size={50} w={760} /></Rise>
      </React.Fragment>
    ))}
  </Svg>
);
const Loop: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform="translate(540 400)"><Pill text="UDI" fill={NAVY} tc="#fff" size={140} w={560} /></g>
    <g transform="translate(300 780)"><g transform="scale(1.3)"><Calendar /></g></g>
    <g transform="translate(780 780)"><g transform="scale(1.6)"><Coin /></g></g>
    <g transform="translate(540 1010)"><Chip text="CAMBIA DE VALOR" fill={P_SAND} size={50} w={780} /></g>
    <g transform="translate(540 1140)"><Chip text="TODOS LOS DÍAS" fill={P_MINT} size={50} w={780} /></g>
  </Svg>
);

/* ---- llamadas a la acción: solo escritas, sin voz ---- */
const CTA_ITEMS = ['LIKE', 'SÍGUEME', 'COMPARTE', 'GUARDA'];
const CtaIcon: React.FC<{k: number}> = ({k}) => {
  if (k === 0) return <path d="M0 11 C-22 -4 -16 -22 0 -11 C16 -22 22 -4 0 11Z" fill="#E4575B" stroke={NAVY} strokeWidth={3} strokeLinejoin="round" />;
  if (k === 1) return <g><rect x={-3} y={-14} width={6} height={28} rx={3} fill={NAVY} /><rect x={-14} y={-3} width={28} height={6} rx={3} fill={NAVY} /></g>;
  if (k === 2) return <path d="M-14 0 L14 -12 L6 14 L1 4 Z" fill="none" stroke={NAVY} strokeWidth={4} strokeLinejoin="round" />;
  return <path d="M-10 -14 H10 V14 L0 6 L-10 14 Z" fill={GOLD} stroke={NAVY} strokeWidth={3} strokeLinejoin="round" />;
};
const CtaRow: React.FC<{f: number}> = ({f}) => {
  const active = Math.floor(f / 40) % 4;
  const widths = [190, 250, 270, 230];
  const gap = 18;
  const total = widths.reduce((a, b) => a + b, 0) + gap * 3;
  let x = (W - total) / 2;
  return (
    <svg width={W} height={110} style={{position: 'absolute', left: 0, top: 140}}>
      {CTA_ITEMS.map((t, i) => {
        const w = widths[i];
        const cx = x + w / 2;
        x += w + gap;
        const o = cl((f - i * 6) / 10);
        return (
          <g key={t} transform={`translate(${cx} 55)`} opacity={o}>
            <rect x={-w / 2} y={-34} width={w} height={68} rx={34} fill={i === active ? P_SAND : '#fff'} stroke={NAVY} strokeWidth={4} />
            <g transform={`translate(${-w / 2 + 40} 0)`}><CtaIcon k={i} /></g>
            <text x={14} y={11} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={27} fill={NAVY}>{t}</text>
          </g>
        );
      })}
    </svg>
  );
};

/* ---------------- subtítulos: sin fondo, azul fuerte ---------------- */
type G = {ws: Word[]; a: number; b: number};
const groups: G[] = (() => {
  const gs: G[] = [];
  let cur: Word[] = [];
  let len = 0;
  words.forEach((w, idx) => {
    cur.push(w);
    len += w.w.length + 1;
    const next = words[idx + 1];
    const brk = /[,.?!:]$/.test(w.w) || cur.length >= 4 || len > 18 || !next || next.s - w.e > 0.6;
    if (brk) {
      gs.push({ws: cur, a: cur[0].s - 0.06, b: 0});
      cur = [];
      len = 0;
    }
  });
  gs.forEach((g, i) => {
    const last = g.ws[g.ws.length - 1];
    g.b = gs[i + 1] ? Math.min(gs[i + 1].a, last.e + 0.5) : last.e + 0.8;
  });
  return gs;
})();
const KEYS = new Set(words.filter((x: any) => x.k).map((x) => x.i));

const Captions: React.FC<{t: number}> = ({t}) => {
  const g = groups.find((x) => t >= x.a && t < x.b);
  if (!g) return null;
  const k = ease((t - g.a) * FPS / 8);
  let active = -1;
  g.ws.forEach((w) => {
    if (t >= w.s - 0.03) active = w.i;
  });
  const lastW = g.ws[g.ws.length - 1];
  if (t > lastW.e + 0.1) active = -1;
  return (
    <div style={{position: 'absolute', left: 50, right: 50, top: 1440, display: 'flex', justifyContent: 'center', opacity: k, transform: `translateY(${(1 - k) * 16}px)`}}>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 20px', textShadow: '0 0 18px rgba(255,255,255,0.95), 0 0 6px rgba(255,255,255,0.95)'}}>
        {g.ws.map((w) => {
          const on = w.i === active;
          const key = KEYS.has(w.i);
          return (
            <span key={w.i} style={{fontFamily: FONT, fontWeight: 700, fontSize: 80, lineHeight: 1.2, color: on ? STRONG : NAVY, borderBottom: key ? `8px solid ${GOLD}` : '8px solid transparent', display: 'inline-block'}}>
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------- composición ---------------- */
export const UdiPrueba: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const shot = shots.find((s) => t >= s.a && t < s.b) || shots[shots.length - 1];
  const sf = F(shot.a);
  const lf = f - sf;
  const at = (i: number) => F(T(i)) - sf;
  const sd = F(shot.b - shot.a);
  const p: SP = {f: lf, at, d: sd};
  const drift = 1 + 0.025 * cl(f / (data.total * FPS));
  const enter = shot.w === 0 ? 1 : ease(lf / 9);
  const MAP: Record<string, React.FC<SP>> = {hook: Hook, def: Def, banxico: Banxico, hipo: Hipo, ejemplo: Ejemplo, consejo: Consejo, loop: Loop};
  const Comp = MAP[shot.k];
  return (
    <AbsoluteFill style={{background: '#fff'}}>
      <Background f={f} t={t} />
      <div style={{position: 'absolute', top: 80, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: 7, color: GRAY}}>
        <div style={{width: 60, height: 5, background: GOLD, borderRadius: 3}} />
        GLOSARIO FINANCIERO
        <div style={{width: 60, height: 5, background: GOLD, borderRadius: 3}} />
      </div>
      <AbsoluteFill style={{transform: `scale(${drift})`, transformOrigin: '540px 760px', opacity: enter}}>
        <Comp {...p} />
      </AbsoluteFill>
      <CtaRow f={f} />
      <Captions t={t} />
      <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: W * cl(t / data.total), background: GOLD}} />
      <Audio src={staticFile('udiprueba/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

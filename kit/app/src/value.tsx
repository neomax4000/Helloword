import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/value/words.json';
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
  {w: 0, k: 'hook', bg: 0}, {w: 5, k: 'valen', bg: 0},
  {w: 9, k: 'def', bg: 1}, {w: 14, k: 'solida', bg: 1}, {w: 19, k: 'real', bg: 1},
  {w: 22, k: 'margen', bg: 2}, {w: 26, k: 'seg', bg: 2},
  {w: 29, k: 'barato', bg: 0}, {w: 35, k: 'prob', bg: 0},
  {w: 41, k: 'revisa', bg: 1}, {w: 45, k: 'subir', bg: 1},
  {w: 50, k: 'final', bg: 0},
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
const Hook: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={0} x={540} y={460}><g transform="scale(1.6)"><Tag text="$ 50" /></g></Rise>
    <Rise f={f} d={at(5)} x={540} y={900}><Pill text="MENOS DE LO QUE VALEN" fill={NAVY} tc="#fff" size={50} w={900} /></Rise>
  </Svg>
);
const Valen: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={0} x={330} y={470}><g transform="scale(1.3)"><Tag text="PRECIO" size={46} /></g></Rise>
    <Rise f={f} d={at(7)} x={760} y={470}><g transform="scale(1.3)"><Tag text="VALOR" size={46} fill={P_MINT} /></g></Rise>
    <Rise f={f} d={at(7) + 4} x={540} y={900}><Pill text="PRECIO < VALOR" fill="#fff" size={64} /></Rise>
  </Svg>
);
const Def: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={0} x={540} y={460}><g transform="scale(1.35)"><Building /></g></Rise>
    <Rise f={f} d={0} x={540} y={960}><Pill text="VALUE" fill={P_SAND} size={90} /></Rise>
  </Svg>
);
const Solida: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={0} x={540} y={450}><g transform="scale(1.3)"><Building fill={P_MINT} /></g></Rise>
    <Rise f={f} d={at(14)} x={540} y={950}><Pill text="EMPRESAS SÓLIDAS" fill={NAVY} tc="#fff" size={62} /></Rise>
  </Svg>
);
const Real: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={0} x={540} y={430}><g transform="scale(1.4)"><Tag text="$ 50" fill={P_ROSE} /></g></Rise>
    <Rise f={f} d={at(20)} x={540} y={760}><g transform="scale(1.4)"><Tag text="$ 80" fill={P_MINT} /></g></Rise>
    <Rise f={f} d={at(20)} x={540} y={1050}><Pill text="VALOR REAL" fill="#fff" size={70} /></Rise>
  </Svg>
);
const Margen: React.FC<SP> = ({f, at}) => {
  const k = ease((f - 6) / 22);
  return (
    <Svg>
      <Rise f={f} d={0} x={300} y={560}><g transform="scale(1.2)"><Tag text="$ 50" fill={P_ROSE} /></g></Rise>
      <Rise f={f} d={4} x={780} y={560}><g transform="scale(1.2)"><Tag text="$ 80" fill={P_MINT} /></g></Rise>
      <Rise f={f} d={8} x={540} y={820}>
        <g opacity={k}>
          <path d="M-240 0 V30 H240 V0" fill="none" stroke={GOLD_D} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
          <text y={110} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={64} fill={GOLD_D}>LA DIFERENCIA</text>
        </g>
      </Rise>
    </Svg>
  );
};
const Seg: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={0} x={540} y={420}>
      <g transform="scale(1.5)" filter="url(#soft)">
        <path d="M0 -130 L110 -85 V10 Q110 90 0 140 Q-110 90 -110 10 V-85 Z" fill={P_BLUE} stroke={NAVY} strokeWidth={STROKE} strokeLinejoin="round" />
        <path d="M-45 5 L-12 40 L50 -35" fill="none" stroke={GOLD_D} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Rise>
    <Rise f={f} d={at(26)} x={540} y={940}><Pill text="MARGEN DE SEGURIDAD" fill={NAVY} tc="#fff" size={54} w={900} /></Rise>
  </Svg>
);
const Barato: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={0} x={540} y={460}><g transform="scale(1.7)"><Tag text="BARATO" size={48} fill={P_SAND} /></g></Rise>
    <Rise f={f} d={at(31)} x={540} y={900}><Pill text="NO SIEMPRE ES BUENO" fill={P_ROSE} size={56} w={860} /></Rise>
  </Svg>
);
const Prob: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={0} x={540} y={440}><g transform="scale(1.4)"><Warn /></g></Rise>
    <Rise f={f} d={at(38)} x={540} y={960}><Pill text="PUEDE ESCONDER PROBLEMAS" fill={NAVY} tc="#fff" size={48} w={920} /></Rise>
  </Svg>
);
const Revisa: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={0} x={500} y={470}><g transform="scale(1.2)"><Building fill={P_LAV} /></g></Rise>
    <Rise f={f} d={at(41) + 4} x={700} y={640}>
      <g filter="url(#soft)" transform="scale(1.5)">
        <circle r={78} fill="#ffffff" fillOpacity={0.55} stroke={NAVY} strokeWidth={STROKE} />
        <path d="M56 56 L130 130" stroke={NAVY} strokeWidth={16} strokeLinecap="round" />
      </g>
    </Rise>
    <Rise f={f} d={at(43)} x={540} y={1000}><Pill text="REVISA LA EMPRESA" fill={P_MINT} size={62} /></Rise>
  </Svg>
);
const Subir: React.FC<SP> = ({f, at}) => {
  const v = ease((f - at(47)) / 24);
  return (
    <Svg>
      <Rise f={f} d={0} x={540} y={400}><Pill text="EL VALOR" fill="#fff" size={64} /></Rise>
      <Rise f={f} d={at(47) - 2} x={540} y={700}>
        <g filter="url(#soft)" transform="scale(1.3)">
          <path d="M-200 60 L-90 -20 L-20 30 L90 -70 L200 -10" fill="none" stroke={NAVY} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="900" strokeDashoffset={900 * (1 - v)} />
        </g>
      </Rise>
      <Rise f={f} d={at(47)} x={540} y={1020}><Pill text="PUEDE SUBIR O BAJAR" fill={P_SAND} size={60} w={860} /></Rise>
    </Svg>
  );
};

const Final: React.FC<SP> = ({f, at}) => {
  const a = ease(f / 16), b = ease((f - (at(54) - 3)) / 16);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 380}}>
      <div style={{textAlign: 'center', opacity: a, transform: `translateY(${(1 - a) * 30}px)`}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 100, color: NAVY, lineHeight: 1.1}}>SI TE</div>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 100, color: GOLD_D, lineHeight: 1.1}}>SIRVIÓ</div>
      </div>
      <div style={{marginTop: 44, opacity: b, transform: `translateY(${(1 - b) * 30}px)`}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 88, color: '#fff', background: NAVY, padding: '8px 52px 16px', borderRadius: 34, borderBottom: `10px solid ${GOLD}`}}>LIKE + SÍGUEME</div>
      </div>
      <div style={{position: 'absolute', bottom: 120, left: 70, right: 70, textAlign: 'center', fontFamily: FONT, fontWeight: 400, fontSize: 28, color: GRAY, lineHeight: 1.4, opacity: cl((f - at(56)) / 14)}}>
        Contenido educativo. No constituye una recomendación de inversión.
      </div>
    </AbsoluteFill>
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
export const Value: React.FC = () => {
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
  const MAP: Record<string, React.FC<SP>> = {hook: Hook, valen: Valen, def: Def, solida: Solida, real: Real, margen: Margen, seg: Seg, barato: Barato, prob: Prob, revisa: Revisa, subir: Subir, final: Final};
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
      {shot.k !== 'final' && <Captions t={t} />}
      <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: W * cl(t / data.total), background: GOLD}} />
      <Audio src={staticFile('value/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

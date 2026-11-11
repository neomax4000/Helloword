import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/growth/words.json';
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
  {w: 9, k: 'def', bg: 1}, {w: 14, k: 'crec', bg: 1},
  {w: 18, k: 'reinv', bg: 2}, {w: 25, k: 'divid', bg: 2},
  {w: 31, k: 'mueve', bg: 0},
  {w: 37, k: 'pareja', bg: 1}, {w: 42, k: 'riesgo', bg: 1},
  {w: 46, k: 'final', bg: 0},
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
const Hook: React.FC<SP> = ({f, at}) => {
  const hs = [120, 200, 300];
  return (
    <Svg>
      {hs.map((h, i) => {
        const k = ease((f - 4 - i * 6) / 18);
        return (
          <g key={i} filter="url(#soft)">
            <rect x={330 + i * 170} y={640 - h * k} width={120} height={h * k} rx={14} fill={[P_BLUE, P_MINT, P_SAND][i]} stroke={NAVY} strokeWidth={STROKE} />
          </g>
        );
      })}
      <Rise f={f} d={at(3)} x={540} y={900}><Pill text="CRECEN MÁS RÁPIDO" fill={NAVY} tc="#fff" size={56} w={900} /></Rise>
    </Svg>
  );
};
const Def: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={0} x={440} y={470}><g transform="scale(1.3)"><Building /></g></Rise>
    <Rise f={f} d={6} x={800} y={470}><g transform="scale(1.3)"><Arrow /></g></Rise>
    <Rise f={f} d={0} x={540} y={960}><Pill text="GROWTH" fill={P_SAND} size={90} /></Rise>
  </Svg>
);
const Crec: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={0} x={540} y={450}><g transform="scale(1.35)"><Building fill={P_MINT} /></g></Rise>
    <Rise f={f} d={at(16)} x={540} y={950}><Pill text="EN PLENO CRECIMIENTO" fill={NAVY} tc="#fff" size={54} w={900} /></Rise>
  </Svg>
);
const Reinv: React.FC<SP> = ({f, at}) => {
  const k = ease((f - at(19)) / 26);
  return (
    <Svg>
      <Rise f={f} d={0} x={760} y={470}><g transform="scale(1.1)"><Building fill={P_LAV} /></g></Rise>
      <g transform={`translate(${300 + 330 * k} 470)`} opacity={f < 4 ? 0 : 1 - 0.0 * k}><g transform="scale(1.5)"><Coin /></g></g>
      <Rise f={f} d={at(19)} x={540} y={960}><Pill text="REINVIERTEN SUS GANANCIAS" fill={P_SAND} size={46} w={940} /></Rise>
    </Svg>
  );
};
const Divid: React.FC<SP> = ({f, at}) => {
  const k = ease((f - at(29)) / 14);
  return (
    <Svg>
      <Rise f={f} d={0} x={540} y={450}>
        <g transform="scale(2)"><Coin /></g>
        <g opacity={k} transform="scale(2)">
          <path d="M-60 -60 L60 60 M60 -60 L-60 60" stroke="#C0463B" strokeWidth={14} strokeLinecap="round" />
        </g>
      </Rise>
      <Rise f={f} d={at(30)} x={540} y={900}><Pill text="CASI SIN DIVIDENDOS" fill={NAVY} tc="#fff" size={58} w={900} /></Rise>
    </Svg>
  );
};
const Mueve: React.FC<SP> = ({f, at}) => {
  const v = ease((f - 4) / 30);
  return (
    <Svg>
      <Rise f={f} d={0} x={540} y={500}>
        <g filter="url(#soft)" transform="scale(1.5)">
          <path d="M-220 40 L-150 -80 L-90 70 L-20 -110 L50 60 L120 -90 L200 20" fill="none" stroke={NAVY} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1200" strokeDashoffset={1200 * (1 - v)} />
        </g>
      </Rise>
      <Rise f={f} d={at(35)} x={540} y={960}><Pill text="SE MUEVE MUCHO" fill={P_ROSE} size={64} /></Rise>
    </Svg>
  );
};
const Pareja: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={0} x={300} y={520}><g transform="scale(1.2)"><Tag text="GROWTH" size={44} /></g></Rise>
    <Rise f={f} d={at(41) - 4} x={790} y={520}><g transform="scale(1.2)"><Tag text="VALUE" size={46} fill={P_MINT} /></g></Rise>
    <Rise f={f} d={at(39)} x={540} y={900}><Pill text="LA PAREJA" fill="#fff" size={70} /></Rise>
  </Svg>
);
const Riesgo: React.FC<SP> = ({f, at}) => {
  const v = 0.2 + 0.55 * ease((f - at(43)) / 30);
  return (
    <Svg>
      <Rise f={f} d={0} x={540} y={520}><g transform="scale(1.4)"><Meter v={v} label="TU RIESGO" fill={P_ROSE} /></g></Rise>
      <Rise f={f} d={at(44)} x={540} y={900}><Pill text="REVISA CUÁNTO AGUANTAS" fill={P_MINT} size={52} w={900} /></Rise>
    </Svg>
  );
};

const Final: React.FC<SP> = ({f, at}) => {
  const a = ease(f / 16), b = ease((f - (at(50) - 3)) / 16);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 380}}>
      <div style={{textAlign: 'center', opacity: a, transform: `translateY(${(1 - a) * 30}px)`}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 100, color: NAVY, lineHeight: 1.1}}>SI TE</div>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 100, color: GOLD_D, lineHeight: 1.1}}>SIRVIÓ</div>
      </div>
      <div style={{marginTop: 44, opacity: b, transform: `translateY(${(1 - b) * 30}px)`}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 88, color: '#fff', background: NAVY, padding: '8px 52px 16px', borderRadius: 34, borderBottom: `10px solid ${GOLD}`}}>LIKE + SÍGUEME</div>
      </div>
      <div style={{position: 'absolute', bottom: 120, left: 70, right: 70, textAlign: 'center', fontFamily: FONT, fontWeight: 400, fontSize: 28, color: GRAY, lineHeight: 1.4, opacity: cl((f - at(52)) / 14)}}>
        Contenido educativo. El valor puede subir o bajar; no es garantía ni recomendación.
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
export const Growth: React.FC = () => {
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
  const MAP: Record<string, React.FC<SP>> = {hook: Hook, def: Def, crec: Crec, reinv: Reinv, divid: Divid, mueve: Mueve, pareja: Pareja, riesgo: Riesgo, final: Final};
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
      <Audio src={staticFile('growth/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

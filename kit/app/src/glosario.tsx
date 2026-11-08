import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/cat/words.json';
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

/* ---- ESCENAS: w = índice de la primera palabra; bg cambia cada 2–3 escenas ---- */
const SHOTS_RAW = [
  {w: 0, k: 'hook', bg: 0}, {w: 5, k: 'rate', bg: 0},
  {w: 9, k: 'sum', bg: 1}, {w: 23, k: 'compare', bg: 1},
  {w: 32, k: 'sign', bg: 2}, {w: 38, k: 'final', bg: 2},
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
  const prev = cur.bg - 1 >= 0 ? cur.bg - 1 : undefined;
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

const Hook: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={0} x={540} y={470}><CreditCard /></Rise>
    <Rise f={f} d={6} x={880} y={250} dy={20}>
      <text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={190} fill={GOLD}>%</text>
    </Rise>
    {[250, 540, 830].map((x, i) => (
      <Rise key={x} f={f} d={at(2) + i * 5 - 2} x={x} y={880}><Coin /></Rise>
    ))}
    <Rise f={f}  d={at(3)} x={540} y={1090}><Pill text="CUESTA MÁS" fill={P_SAND} size={62} /></Rise>
  </Svg>
);

const Rate: React.FC<SP> = ({f, at}) => {
  const k = ease((f - (at(6) - 2)) / 12);
  return (
    <Svg>
      <Rise f={f} d={0} x={540} y={500}>
        <g filter="url(#soft)">
          <rect x={-300} y={-190} width={600} height={380} rx={40} fill="#fff" stroke={NAVY} strokeWidth={STROKE} />
          <text textAnchor="middle" y={-30} fontFamily={FONT} fontWeight={700} fontSize={120} fill={NAVY}>TASA</text>
          <text textAnchor="middle" y={120} fontFamily={FONT} fontWeight={700} fontSize={110} fill={GOLD}>%</text>
          <path d="M-300 -190 L300 190" stroke="#C8454F" strokeWidth={18} strokeLinecap="round" strokeDasharray={760} strokeDashoffset={760 * (1 - k)} />
          <path d="M300 -190 L-300 190" stroke="#C8454F" strokeWidth={18} strokeLinecap="round" strokeDasharray={760} strokeDashoffset={760 * (1 - cl(k * 1.4 - 0.4))} />
        </g>
      </Rise>
      <Rise f={f} d={at(6)} x={540} y={960}><Pill text="NO ES SOLO LA TASA" fill={NAVY} tc="#fff" size={52} /></Rise>
      <Rise f={f} d={at(8)} x={540} y={1130}><Pill text="HAY MÁS COSTOS" fill={P_MINT} size={48} /></Rise>
    </Svg>
  );
};

const Sum: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={at(10) - 4} x={540} y={340}>
      <g filter="url(#soft)">
        <circle r={190} fill={P_SAND} stroke={GOLD} strokeWidth={9} />
        <text textAnchor="middle" y={28} fontFamily={FONT} fontWeight={700} fontSize={150} fill={NAVY}>CAT</text>
        <text textAnchor="middle" y={92} fontFamily={FONT} fontWeight={700} fontSize={25} fill={GRAY} letterSpacing={2}>COSTO ANUAL TOTAL</text>
      </g>
    </Rise>
    <Rise f={f} d={at(14)} x={540} y={630} dy={14}>
      <text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={100} fill={GOLD}>=</text>
    </Rise>
    <Rise f={f} d={at(16)} x={540} y={800}><Pill text="TASA" fill={P_BLUE} size={52} w={560} /></Rise>
    <Rise f={f} d={at(20)} x={540} y={950}><Pill text="+ COSTOS" fill={P_MINT} size={52} w={560} /></Rise>
    <Rise f={f} d={at(22)} x={540} y={1100}><Pill text="+ COMISIONES" fill={P_ROSE} size={52} w={560} /></Rise>
  </Svg>
);

const Bar: React.FC<{x: number; h: number; fill: string; label: string; f: number; d: number}> = ({x, h, fill, label, f, d}) => {
  const k = ease((f - d) / 22);
  return (
    <g>
      <g transform={`translate(${x} 960) scale(1 ${k})`}>
        <rect x={-110} y={-h} width={220} height={h} rx={22} fill={fill} stroke={NAVY} strokeWidth={STROKE} />
      </g>
      <Rise f={f} d={d + 6} x={x} y={1040} dy={14}>
        <text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={NAVY}>{label}</text>
      </Rise>
    </g>
  );
};
const Compare: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={0} x={540} y={250}><Pill text="% ANUAL" fill="#fff" size={66} /></Rise>
    <Bar x={340} h={430} fill={P_LAV} label="CRÉDITO A" f={f} d={at(28) - 6} />
    <Bar x={740} h={290} fill={P_MINT} label="CRÉDITO B" f={f} d={at(29) - 6} />
    <Rise f={f} d={at(30)} x={540} y={1160}><Pill text="COMPÁRALOS" fill={P_SAND} size={58} /></Rise>
  </Svg>
);

const Sign: React.FC<SP> = ({f, at}) => {
  const hi = ease((f - at(37)) / 14);
  return (
    <Svg>
      <Rise f={f} d={0} x={540} y={520}>
        <g filter="url(#soft)">
          <rect x={-270} y={-330} width={540} height={660} rx={26} fill="#fff" stroke={NAVY} strokeWidth={STROKE} />
          <text textAnchor="middle" y={-250} fontFamily={FONT} fontWeight={700} fontSize={52} fill={NAVY}>CONTRATO</text>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={-210} y={-190 + i * 50} width={i % 2 ? 300 : 400} height={18} rx={9} fill="#E4E7EE" />
          ))}
          <rect x={-210} y={-34 + 20} width={420} height={78} rx={18} fill={P_SAND} stroke={GOLD} strokeWidth={hi > 0 ? 3 + 5 * hi : 3} />
          <text textAnchor="middle" y={42} fontFamily={FONT} fontWeight={700} fontSize={56} fill={NAVY}>CAT</text>
          {[0, 1].map((i) => (
            <rect key={i} x={-210} y={140 + i * 50} width={i % 2 ? 260 : 360} height={18} rx={9} fill="#E4E7EE" />
          ))}
        </g>
      </Rise>
      <Rise f={f} d={at(36)} x={760} y={600} dx={60} dy={0}>
        <circle r={92} fill="rgba(255,255,255,0.5)" stroke={NAVY} strokeWidth={9} />
        <path d="M65 65 L140 140" stroke={NAVY} strokeWidth={22} strokeLinecap="round" />
      </Rise>
      <Rise f={f} d={at(32)} x={540} y={960}><Pill text="ANTES DE FIRMAR" fill="#fff" size={52} /></Rise>
      <Rise f={f} d={at(37)} x={540} y={1100}><Pill text="MIRA EL CAT" fill={NAVY} tc="#fff" size={58} /></Rise>
    </Svg>
  );
};

const Final: React.FC<SP> = ({f, at}) => {
  const a = ease(f / 16), b = ease((f - (at(41) - 3)) / 16);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 380}}>
      <div style={{textAlign: 'center', opacity: a, transform: `translateY(${(1 - a) * 30}px)`}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 100, color: NAVY, lineHeight: 1.1}}>SI TE</div>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 100, color: GOLD_D, lineHeight: 1.1}}>SIRVIÓ</div>
      </div>
      <div style={{marginTop: 44, opacity: b, transform: `translateY(${(1 - b) * 30}px)`}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 88, color: '#fff', background: NAVY, padding: '8px 52px 16px', borderRadius: 34, borderBottom: `10px solid ${GOLD}`}}>LIKE + SÍGUEME</div>
      </div>
      <div style={{position: 'absolute', bottom: 120, left: 70, right: 70, textAlign: 'center', fontFamily: FONT, fontWeight: 400, fontSize: 28, color: GRAY, lineHeight: 1.4, opacity: cl((f - at(42)) / 14)}}>
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
export const Glosario: React.FC = () => {
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
  const MAP: Record<string, React.FC<SP>> = {hook: Hook, rate: Rate, sum: Sum, compare: Compare, sign: Sign, final: Final};
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
      <Audio src={staticFile('cat/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

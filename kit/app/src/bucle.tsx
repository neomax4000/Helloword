import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/bucle/words.json';
import {FONT, FPS, W} from './theme';
import {F, cl, ease} from './narrador';

/* ============ BUCLE (experimento 2026-11-11) — estilo claro del glosario ============
   El video se repite sin costura: la última frase («todo lo que acabas de oír») se completa con la primera («…es lo que le pasa a tu dinero guardado»).
   - El primer fotograma y el último son la MISMA composición (escena 'hook'), el fondo vuelve al mismo lavado y no hay barra de progreso.
   - El audio acaba sin silencio ni cola y la música empata consigo misma (ver mezcla_bucle.py). */
const NAVY = '#041E42', GOLD = '#B3A369', GOLD_D = '#8F8250', GRAY = '#555759', STRONG = '#1B4FC4';
const P_BLUE = '#D3E3F8', P_MINT = '#D2EEE0', P_SAND = '#F6EBC8', P_ROSE = '#F7D8D4', P_LAV = '#E0DBF5';
const STROKE = 5;
const NF = Math.round(data.total * FPS);

type Word = {i: number; w: string; s: number; e: number};
const words = data.words as Word[];
const TS: Record<number, number> = {};
words.forEach((x) => (TS[x.i] = x.s));
const T = (i: number) => {
  for (let k = i; k < i + 5; k++) if (TS[k] !== undefined) return TS[k];
  return 0;
};

const SHOTS_RAW = [
  {w: 0, k: 'hook', bg: 0}, {w: 9, k: 'shrink', bg: 0},
  {w: 14, k: 'infl', bg: 1}, {w: 23, k: 'less', bg: 1},
  {w: 32, k: 'follow', bg: 2}, {w: 39, k: 'meta', bg: 2},
  {w: 49, k: 'hook', bg: 0},
];
type Shot = {w: number; k: string; bg: number; a: number; b: number};
const shots: Shot[] = SHOTS_RAW.map((s, i, arr) => ({
  ...s,
  a: i === 0 ? 0 : T(s.w) - 0.08,
  b: i < arr.length - 1 ? T(arr[i + 1].w) - 0.08 : data.total + 1,
}));

/* ---------------- fondos: lavado pastel; los círculos se mueven con periodo = duración del video (empata en el bucle) ---------------- */
const WASH = ['#E3EDFA', '#E1F3EA', '#FAF1D6'];
const DOTS = [
  {x: 160, y: 380, r: 300, k: 0}, {x: 940, y: 980, r: 380, k: 1}, {x: 260, y: 1560, r: 260, k: 2},
];
const ThemeBg: React.FC<{n: number; f: number}> = ({n, f}) => {
  const a = (2 * Math.PI * f) / NF;
  return (
    <AbsoluteFill style={{background: `radial-gradient(1300px 1300px at 50% 36%, #FFFFFF 0%, #FFFFFF 38%, ${WASH[n]} 100%)`}}>
      {DOTS.map((d) => (
        <div key={d.k} style={{position: 'absolute', left: d.x - d.r + Math.sin(a + d.k * 2) * 18, top: d.y - d.r + Math.cos(a + d.k) * 18, width: d.r * 2, height: d.r * 2, borderRadius: '50%', background: WASH[n], opacity: 0.55}} />
      ))}
    </AbsoluteFill>
  );
};
const Background: React.FC<{f: number; t: number}> = ({f, t}) => {
  const idx = Math.max(0, shots.findIndex((s) => t >= s.a && t < s.b));
  const cur = shots[idx];
  const prev = idx > 0 ? shots[idx - 1] : undefined;
  const p = prev && prev.bg !== cur.bg ? ease((t - cur.a) * FPS / 18) : 1;
  return (
    <AbsoluteFill>
      {prev && p < 1 && <ThemeBg n={prev.bg} f={f} />}
      <AbsoluteFill style={{opacity: p}}>
        <ThemeBg n={cur.bg} f={f} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

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
const Coin: React.FC<{s?: number}> = ({s = 1}) => (
  <g filter="url(#soft)" transform={`scale(${s})`}>
    <circle r={70} fill={P_SAND} stroke={NAVY} strokeWidth={STROKE} />
    <circle r={50} fill="none" stroke={GOLD} strokeWidth={4} />
    <text textAnchor="middle" y={22} fontFamily={FONT} fontWeight={700} fontSize={64} fill={GOLD_D}>$</text>
  </g>
);
/* flecha circular (el bucle) */
const Loop: React.FC<{rot?: number; s?: number}> = ({rot = 0, s = 1}) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    <path d="M-110 -20 A115 115 0 1 1 -40 100" fill="none" stroke={GOLD} strokeWidth={22} strokeLinecap="round" />
    <path d="M-150 20 L-110 -26 L-70 20Z" fill={GOLD} />
  </g>
);

/* ---------------- escenas ---------------- */
/* Hook = primer y último fotograma. Siempre armada (sin animación de entrada) para que el bucle no tenga costura. */
const Hook: React.FC<SP> = () => (
  <Svg>
    <g transform="translate(250 330)"><text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={220} fill={GOLD}>…</text></g>
    <g transform="translate(540 640)"><g filter="url(#soft)"><circle r={190} fill={P_SAND} stroke={NAVY} strokeWidth={STROKE} /><circle r={150} fill="none" stroke={GOLD} strokeWidth={8} /><text textAnchor="middle" y={62} fontFamily={FONT} fontWeight={700} fontSize={190} fill={GOLD_D}>$</text></g></g>
    <g transform="translate(540 1010)"><Pill text="TU DINERO GUARDADO" fill={NAVY} tc="#fff" size={56} /></g>
  </Svg>
);
const Shrink: React.FC<SP> = ({f, at}) => {
  const k = ease((f - 6) / 40);
  return (
    <Svg>
      <Rise f={f} d={0} x={540} y={560} dy={0}><g transform={`scale(${2.6 - 1.5 * k})`}><Coin /></g></Rise>
      <Rise f={f} d={4} x={880} y={380} dy={10}><g transform="rotate(0)"><path d="M0 -70 L0 70 M-50 20 L0 76 L50 20" stroke="#C8454F" strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g></Rise>
      <Rise f={f} d={at(10) - 2} x={540} y={960}><Pill text="PIERDE VALOR" fill={P_ROSE} size={64} /></Rise>
      <Rise f={f} d={at(13) - 2} x={540} y={1130}><Pill text="SIN HACER RUIDO" fill="#fff" size={48} /></Rise>
    </Svg>
  );
};
const Infl: React.FC<SP> = ({f, at}) => (
  <Svg>
    {[0, 1, 2].map((i) => {
      const h = [150, 260, 390][i];
      const k = ease((f - at(20 + i) + 6 - (i ? 0 : 6)) / 12);
      return (
        <Rise key={i} f={f} d={at(16) + i * 8 - 4} x={270 + i * 270} y={760} dy={0}>
          <g filter="url(#soft)">
            <rect x={-95} y={-h * Math.max(0.15, ease((f - (at(16) + i * 8 - 4)) / 14))} width={190} height={h * Math.max(0.15, ease((f - (at(16) + i * 8 - 4)) / 14))} rx={18} fill={[P_BLUE, P_SAND, P_ROSE][i]} stroke={NAVY} strokeWidth={STROKE} />
            <text textAnchor="middle" y={64} fontFamily={FONT} fontWeight={700} fontSize={38} fill={GRAY}>AÑO {i + 1}</text>
          </g>
        </Rise>
      );
    })}
    <Rise f={f} d={0} x={540} y={250} dy={20}><Pill text="PRECIOS" fill={NAVY} tc="#fff" size={62} /></Rise>
    <Rise f={f} d={at(16) - 2} x={540} y={1000}><Pill text="INFLACIÓN" fill={P_SAND} size={70} /></Rise>
  </Svg>
);
const Less: React.FC<SP> = ({f, at}) => (
  <Svg>
    {[3, 2, 1].map((n, i) => (
      <Rise key={i} f={f} d={i * 6} x={250 + i * 290} y={560}>
        <g filter="url(#soft)">
          <rect x={-120} y={-150} width={240} height={300} rx={26} fill="#fff" stroke={NAVY} strokeWidth={STROKE} />
          <text textAnchor="middle" y={-80} fontFamily={FONT} fontWeight={700} fontSize={44} fill={GOLD_D}>$ IGUAL</text>
          {Array.from({length: n}, (_, j) => <circle key={j} cx={-60 + j * 60} cy={30} r={24} fill={[P_MINT, P_BLUE, P_LAV][i]} stroke={NAVY} strokeWidth={4} />)}
        </g>
      </Rise>
    ))}
    <Rise f={f} d={at(27)} x={540} y={960}><Pill text="MISMO DINERO" fill="#fff" size={56} /></Rise>
    <Rise f={f} d={at(30) - 2} x={540} y={1130}><Pill text="CADA VEZ MENOS" fill={P_ROSE} size={60} /></Rise>
  </Svg>
);
const Follow: React.FC<SP> = ({f, at}) => {
  const pulse = 1 + Math.sin(f / 6) * 0.03;
  return (
    <Svg>
      <Rise f={f} d={0} x={540} y={540}>
        <g transform={`scale(${pulse})`} filter="url(#soft)">
          <rect x={-300} y={-110} width={600} height={220} rx={110} fill={NAVY} />
          <circle cx={-190} cy={0} r={58} fill={GOLD} />
          <path d="M-190 -28 L-190 28 M-218 0 L-162 0" stroke="#fff" strokeWidth={14} strokeLinecap="round" />
          <text x={85} y={30} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={74} fill="#fff">SÍGUEME</text>
        </g>
      </Rise>
      <Rise f={f} d={at(35) - 3} x={540} y={900}><Pill text="LIKE + SÍGUEME" fill={P_SAND} size={60} /></Rise>
    </Svg>
  );
};
const Meta: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={0} x={540} y={430} dy={0}><g transform={`rotate(${f * 3})`}><Loop s={1.4} /></g></Rise>
    <Rise f={f} d={at(46) - 6} x={540} y={760} dy={0}><text textAnchor="middle" y={44} fontFamily={FONT} fontWeight={700} fontSize={140} fill={NAVY}>OTRA VEZ</text></Rise>
    <Rise f={f} d={at(41) - 2} x={540} y={1000}><Pill text="¿YA LO ESCUCHASTE?" fill="#fff" size={52} /></Rise>
  </Svg>
);

/* ---------------- subtítulos ---------------- */
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
    g.b = gs[i + 1] ? Math.min(gs[i + 1].a, last.e + 0.5) : data.total + 1;
  });
  return gs;
})();
const KEYS = new Set(words.filter((x: any) => x.k).map((x) => x.i));
const Captions: React.FC<{t: number}> = ({t}) => {
  const gi = groups.findIndex((x) => t >= x.a && t < x.b);
  const g = groups[Math.max(0, gi)];
  const k = g === groups[0] ? 1 : ease((t - g.a) * FPS / 8);
  let active = -1;
  g.ws.forEach((w) => {
    if (t >= w.s - 0.03) active = w.i;
  });
  const lastW = g.ws[g.ws.length - 1];
  if (t > lastW.e + 0.1 && g !== groups[groups.length - 1]) active = -1;
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
export const Bucle: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const shot = shots.find((s) => t >= s.a && t < s.b) || shots[shots.length - 1];
  const sf = F(shot.a);
  const lf = f - sf;
  const at = (i: number) => F(T(i)) - sf;
  const sd = F(shot.b - shot.a);
  const p: SP = {f: lf, at, d: sd};
  const MAP: Record<string, React.FC<SP>> = {hook: Hook, shrink: Shrink, infl: Infl, less: Less, follow: Follow, meta: Meta};
  const Comp = MAP[shot.k];
  const enter = shot.k === 'hook' ? 1 : ease(lf / 9);
  return (
    <AbsoluteFill style={{background: '#fff'}}>
      <Background f={f} t={t} />
      <div style={{position: 'absolute', top: 80, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: 7, color: GRAY}}>
        <div style={{width: 60, height: 5, background: GOLD, borderRadius: 3}} />
        GLOSARIO FINANCIERO
        <div style={{width: 60, height: 5, background: GOLD, borderRadius: 3}} />
      </div>
      <AbsoluteFill style={{opacity: enter}}>
        <Comp {...p} />
      </AbsoluteFill>
      <Captions t={t} />
      <Audio src={staticFile('bucle/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/liquidez/words.json';
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
  {w: 0, k: 'hook', bg: 0}, {w: 6, k: 'alarm', bg: 0},
  {w: 9, k: 'def', bg: 1}, {w: 16, k: 'flow', bg: 1},
  {w: 20, k: 'cuenta', bg: 2}, {w: 28, k: 'plazo', bg: 2},
  {w: 37, k: 'rule', bg: 0}, {w: 48, k: 'final', bg: 0},
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


const Lock: React.FC<{open?: number; fill?: string}> = ({open = 0, fill = P_SAND}) => (
  <g filter="url(#soft)">
    <path d={`M-70 -40 V-${95 + open * 24} a70 70 0 0 1 140 0 V${-40 - open * 30}`} fill="none" stroke={NAVY} strokeWidth={22} strokeLinecap="round" transform={`translate(${open * 40} 0)`} />
    <rect x={-120} y={-40} width={240} height={190} rx={30} fill={fill} stroke={NAVY} strokeWidth={STROKE} />
    <circle cx={0} cy={50} r={22} fill={NAVY} />
    <rect x={-8} y={55} width={16} height={50} rx={8} fill={NAVY} />
  </g>
);
const Bell: React.FC = () => (
  <g filter="url(#soft)">
    <path d="M-110 70 C-110 -60 -80 -120 0 -120 C80 -120 110 -60 110 70 Z" fill={P_ROSE} stroke={NAVY} strokeWidth={STROKE} strokeLinejoin="round" />
    <rect x={-135} y={70} width={270} height={34} rx={17} fill={P_ROSE} stroke={NAVY} strokeWidth={STROKE} />
    <circle cx={0} cy={130} r={26} fill={GOLD} stroke={NAVY} strokeWidth={STROKE} />
    <circle cx={0} cy={-135} r={16} fill={NAVY} />
  </g>
);

const Hook: React.FC<SP> = ({f, at}) => {
  const k = ease((f - at(2)) / 14);
  return (
    <Svg>
      <Rise f={f} d={0} x={540} y={520}>
        <g filter="url(#soft)">
          <rect x={-250} y={-230} width={500} height={460} rx={44} fill="#fff" stroke={NAVY} strokeWidth={STROKE} />
          <rect x={-210} y={-190} width={420} height={380} rx={26} fill={P_BLUE} stroke={NAVY} strokeWidth={4} />
          <g transform="translate(-60 -40) scale(0.9)"><Coin /></g>
          <g transform="translate(70 70) scale(0.7)"><Coin /></g>
        </g>
      </Rise>
      <Rise f={f} d={at(2) - 2} x={540} y={520} dy={-40}>
        <g opacity={k} transform="scale(1.35)"><Lock fill={P_SAND} /></g>
      </Rise>
      <Rise f={f} d={at(2)} x={540} y={1010}><Pill text="DINERO ATRAPADO" fill={NAVY} tc="#fff" size={56} /></Rise>
    </Svg>
  );
};

const Alarm: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={0} x={540} y={500}><g transform="scale(1.5)"><Bell /></g></Rise>
    {[-1, 1].map((sd) => (
      <Rise key={sd} f={f} d={at(8) - 4} x={540 + sd * 330} y={470} dx={sd * -30} dy={0}>
        <path d={`M0 -70 Q${sd * 40} 0 0 70`} fill="none" stroke={GOLD} strokeWidth={14} strokeLinecap="round" />
      </Rise>
    ))}
    <Rise f={f} d={at(8)} x={540} y={1010}><Pill text="EMERGENCIA" fill={P_ROSE} size={64} /></Rise>
  </Svg>
);

const Def: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={0} x={540} y={420}>
      <g filter="url(#soft)">
        <circle r={230} fill={P_BLUE} stroke={NAVY} strokeWidth={STROKE} />
        <path d="M0 -150 C70 -60 110 -10 110 40 a110 110 0 0 1 -220 0 C-110 -10 -70 -60 0 -150 Z" fill="#fff" stroke={NAVY} strokeWidth={STROKE} strokeLinejoin="round" />
        <path d="M-50 60 a55 55 0 0 0 40 40" fill="none" stroke={GOLD} strokeWidth={10} strokeLinecap="round" />
      </g>
    </Rise>
    <Rise f={f} d={at(12) - 3} x={540} y={790}><Pill text="LIQUIDEZ" fill={P_SAND} size={86} /></Rise>
    <Rise f={f} d={at(14)} x={540} y={980}><Pill text="FACILIDAD" fill="#fff" size={56} w={640} /></Rise>
  </Svg>
);

const Flow: React.FC<SP> = ({f, at}) => {
  const k = ease((f - (at(16) - 3)) / 22);
  return (
    <Svg>
      <Rise f={f} d={0} x={260} y={560}>
        <g filter="url(#soft)">
          <rect x={-130} y={-100} width={260} height={200} rx={34} fill={P_MINT} stroke={NAVY} strokeWidth={STROKE} />
          <rect x={30} y={-26} width={110} height={52} rx={26} fill="#fff" stroke={NAVY} strokeWidth={STROKE} />
          <circle cx={70} cy={0} r={11} fill={GOLD} />
        </g>
      </Rise>
      <g transform={`translate(${340 + k * 300} 560)`} opacity={k > 0 ? 1 : 0}><Coin /></g>
      <Rise f={f} d={4} x={820} y={560}>
        <g filter="url(#soft)">
          <rect x={-95} y={-175} width={190} height={350} rx={34} fill="#fff" stroke={NAVY} strokeWidth={STROKE} />
          <rect x={-70} y={-130} width={140} height={230} rx={14} fill={P_BLUE} />
          <circle cx={0} cy={135} r={14} fill={NAVY} />
        </g>
      </Rise>
      <Rise f={f} d={at(16)} x={540} y={1000}><Pill text="DISPONER" fill={NAVY} tc="#fff" size={62} /></Rise>
      <Rise f={f} d={at(18)} x={540} y={1150}><Pill text="DE TU DINERO" fill={P_SAND} size={50} /></Rise>
    </Svg>
  );
};

const Meter: React.FC<{v: number; label: string; fill: string}> = ({v, label, fill}) => (
  <g>
    <rect x={-320} y={0} width={640} height={36} rx={18} fill="#E4E7EE" />
    <rect x={-320} y={0} width={640 * v} height={36} rx={18} fill={fill} stroke={NAVY} strokeWidth={4} />
    <text x={0} y={-22} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={NAVY}>{label}</text>
  </g>
);

const Cuenta: React.FC<SP> = ({f, at}) => {
  const v = ease((f - (at(26) - 2)) / 24);
  return (
    <Svg>
      <Rise f={f} d={0} x={540} y={430}><g transform="scale(1.3)"><Lock open={1} fill={P_MINT} /></g></Rise>
      <Rise f={f} d={at(22)} x={540} y={850}><Pill text="CUENTA A LA VISTA" fill="#fff" size={52} /></Rise>
      <Rise f={f} d={at(26)} x={540} y={1060}><Meter v={0.94 * v} label="MUY LÍQUIDA" fill={P_MINT} /></Rise>
    </Svg>
  );
};

const Plazo: React.FC<SP> = ({f, at}) => {
  const v = ease((f - (at(31) - 2)) / 24);
  return (
    <Svg>
      <Rise f={f} d={0} x={540} y={430}>
        <g filter="url(#soft)">
          <rect x={-190} y={-170} width={380} height={340} rx={34} fill="#fff" stroke={NAVY} strokeWidth={STROKE} />
          <rect x={-190} y={-170} width={380} height={90} rx={34} fill={P_LAV} stroke={NAVY} strokeWidth={STROKE} />
          {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => (
            <rect key={`${r}${c}`} x={-150 + c * 80} y={-50 + r * 70} width={50} height={40} rx={10} fill={r === 2 && c === 3 ? GOLD : '#E4E7EE'} />
          )))}
        </g>
      </Rise>
      <Rise f={f} d={at(30) - 3} x={540} y={810}><Pill text="PLAZO FIJO" fill="#fff" size={52} /></Rise>
      <Rise f={f} d={at(31)} x={540} y={1000}><Meter v={0.4 * v + 0.0} label="MENOS LÍQUIDO" fill={P_SAND} /></Rise>
      <Rise f={f} d={at(36)} x={540} y={1160}><Pill text="PUEDE HABER COMISIÓN" fill={P_ROSE} size={44} /></Rise>
    </Svg>
  );
};

const Rule: React.FC<SP> = ({f, at}) => {
  const a = ease((f - (at(41) - 2)) / 14);
  return (
    <Svg>
      <Rise f={f} d={0} x={540} y={300}><Pill text="LO QUE NECESITAS PRONTO" fill={P_SAND} size={46} w={800} /></Rise>
      <Rise f={f} d={at(41)} x={540} y={470} dy={-20}>
        <path d="M0 -40 V60 M-40 20 L0 70 L40 20" fill="none" stroke={GOLD} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
      </Rise>
      <Rise f={f} d={at(43)} x={540} y={790}><g transform="scale(1.15)"><Lock open={0} fill={P_ROSE} /></g></Rise>
      <g transform="translate(540 790)" opacity={a}>
        <path d="M-210 -200 L210 200 M210 -200 L-210 200" stroke="#C8454F" strokeWidth={22} strokeLinecap="round" />
      </g>
      <Rise f={f} d={at(44)} x={540} y={1130}><Pill text="DONDE NO PUEDAS SACARLO" fill={NAVY} tc="#fff" size={44} w={860} /></Rise>
    </Svg>
  );
};

const Final: React.FC<SP> = ({f, at}) => {
  const a = ease(f / 16), b = ease((f - (at(52) - 3)) / 16);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 380}}>
      <div style={{textAlign: 'center', opacity: a, transform: `translateY(${(1 - a) * 30}px)`}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 100, color: NAVY, lineHeight: 1.1}}>SI TE</div>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 100, color: GOLD_D, lineHeight: 1.1}}>SIRVIÓ</div>
      </div>
      <div style={{marginTop: 44, opacity: b, transform: `translateY(${(1 - b) * 30}px)`}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 88, color: '#fff', background: NAVY, padding: '8px 52px 16px', borderRadius: 34, borderBottom: `10px solid ${GOLD}`}}>LIKE + SÍGUEME</div>
      </div>
      <div style={{position: 'absolute', bottom: 120, left: 70, right: 70, textAlign: 'center', fontFamily: FONT, fontWeight: 400, fontSize: 28, color: GRAY, lineHeight: 1.4, opacity: cl((f - at(53)) / 14)}}>
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
export const Liquidez: React.FC = () => {
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
  const MAP: Record<string, React.FC<SP>> = {hook: Hook, alarm: Alarm, def: Def, flow: Flow, cuenta: Cuenta, plazo: Plazo, rule: Rule, final: Final};
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
      <Audio src={staticFile('liquidez/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/cetes/words.json';
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

/* ---- ESCENAS (cambio visual cada ~1.5–2 s); bg cambia cada 2–3 escenas ---- */
const SHOTS_RAW = [
  {w: 0, k: 'hook', bg: 0}, {w: 3, k: 'give', bg: 0},
  {w: 7, k: 'cetes', bg: 1}, {w: 11, k: 'cert', bg: 1},
  {w: 18, k: 'disc', bg: 2}, {w: 22, k: 'pay', bg: 2}, {w: 30, k: 'terms', bg: 2},
  {w: 35, k: 'small', bg: 3}, {w: 40, k: 'cal', bg: 3},
  {w: 46, k: 'drop', bg: 4}, {w: 53, k: 'final', bg: 4},
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
  <AbsoluteFill style={{background: `radial-gradient(1300px 1300px at 50% 36%, #FFFFFF 0%, #FFFFFF 38%, ${WASH[n % 3]} 100%)`}}>
    {DOTS.map((d) => (
      <div key={d.k} style={{position: 'absolute', left: d.x - d.r + Math.sin(f / 140 + d.k * 2) * 18, top: d.y - d.r + Math.cos(f / 170 + d.k) * 18, width: d.r * 2, height: d.r * 2, borderRadius: '50%', background: WASH[n % 3], opacity: 0.55}} />
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

const Coin: React.FC = () => (
  <g filter="url(#soft)">
    <circle r={70} fill={P_SAND} stroke={NAVY} strokeWidth={STROKE} />
    <circle r={50} fill="none" stroke={GOLD} strokeWidth={4} />
    <text textAnchor="middle" y={22} fontFamily={FONT} fontWeight={700} fontSize={64} fill={GOLD_D}>$</text>
  </g>
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
const Gov: React.FC = () => (
  <g filter="url(#soft)">
    <path d="M-210 -50 L0 -190 L210 -50 Z" fill={P_BLUE} stroke={NAVY} strokeWidth={STROKE} strokeLinejoin="round" />
    {[-140, -47, 47, 140].map((x) => (
      <rect key={x} x={x - 24} y={-30} width={48} height={170} rx={8} fill="#fff" stroke={NAVY} strokeWidth={STROKE} />
    ))}
    <rect x={-240} y={140} width={480} height={46} rx={12} fill={P_SAND} stroke={NAVY} strokeWidth={STROKE} />
    <circle cx={0} cy={-90} r={20} fill={GOLD} stroke={NAVY} strokeWidth={4} />
  </g>
);
const Sm: React.FC<{s: number; children: React.ReactNode}> = ({s, children}) => <g transform={`scale(${s})`}>{children}</g>;

const Hook: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={0} x={540} y={470}><Gov /></Rise>
    <Rise f={f} d={4} x={880} y={250} dy={20}>
      <text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={190} fill={GOLD}>?</text>
    </Rise>
    <Rise f={f} d={at(3) - 2} x={540} y={930}><Pill text="¿PRESTARLE AL GOBIERNO?" fill={P_SAND} size={50} /></Rise>
  </Svg>
);

const Give: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={0} x={540} y={400}><Sm s={0.8}><Gov /></Sm></Rise>
    {[0, 1, 2].map((i) => {
      const k = ease((f - (i * 8 + 4)) / 22);
      const x = 160 + i * 40 + (540 - 160 - i * 40) * k;
      const y = 1000 - 440 * k;
      return k > 0 ? <g key={i} transform={`translate(${x} ${y}) scale(${0.8 - 0.25 * k})`} opacity={1 - cl((k - 0.8) * 5)}><Coin /></g> : null;
    })}
    <Rise f={f} d={at(3)} x={540} y={1110}><Pill text="TÚ PRESTAS" fill={NAVY} tc="#fff" size={56} /></Rise>
  </Svg>
);

const CetesS: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={0} x={540} y={520}>
      <g filter="url(#soft)">
        <rect x={-380} y={-170} width={760} height={340} rx={50} fill={NAVY} stroke={GOLD} strokeWidth={9} />
        <text textAnchor="middle" y={62} fontFamily={FONT} fontWeight={700} fontSize={190} fill="#fff">CETES</text>
      </g>
    </Rise>
    <Rise f={f} d={at(8)} x={540} y={900}><Pill text="DEUDA DEL GOBIERNO" fill={P_SAND} size={52} /></Rise>
  </Svg>
);

const Cert: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={0} x={540} y={470}>
      <g filter="url(#soft)">
        <rect x={-330} y={-230} width={660} height={460} rx={28} fill="#fff" stroke={NAVY} strokeWidth={STROKE} />
        <rect x={-300} y={-200} width={600} height={400} rx={18} fill="none" stroke={GOLD} strokeWidth={4} />
        <text textAnchor="middle" y={-110} fontFamily={FONT} fontWeight={700} fontSize={54} fill={NAVY}>CERTIFICADO</text>
        {[0, 1, 2].map((i) => <rect key={i} x={-220} y={-60 + i * 44} width={i === 1 ? 300 : 440} height={16} rx={8} fill="#E4E7EE" />)}
        <circle cx={190} cy={110} r={52} fill={GOLD} stroke={NAVY} strokeWidth={STROKE} />
        <path d="M165 112 l18 18 l34 -40" stroke={NAVY} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Rise>
    <Rise f={f} d={at(11)} x={540} y={900}><Pill text="TESORERÍA" fill={P_BLUE} size={52} w={640} /></Rise>
    <Rise f={f} d={at(15)} x={540} y={1040}><Pill text="DE LA FEDERACIÓN" fill={P_MINT} size={52} w={640} /></Rise>
  </Svg>
);

const Disc: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={0} x={540} y={460}>
      <g filter="url(#soft)">
        <path d="M-210 -120 H120 L230 0 L120 120 H-210 Q-250 120 -250 80 V-80 Q-250 -120 -210 -120 Z" fill={P_ROSE} stroke={NAVY} strokeWidth={STROKE} strokeLinejoin="round" />
        <circle cx={140} cy={0} r={24} fill="#fff" stroke={NAVY} strokeWidth={STROKE} />
        <text textAnchor="middle" x={-40} y={-5} fontFamily={FONT} fontWeight={700} fontSize={64} fill={NAVY}>PRECIO</text>
        <text textAnchor="middle" x={-40} y={70} fontFamily={FONT} fontWeight={700} fontSize={64} fill={GOLD_D}>MENOR</text>
      </g>
    </Rise>
    <Rise f={f} d={at(20) - 2} x={540} y={900}><Pill text="CON DESCUENTO" fill={NAVY} tc="#fff" size={58} /></Rise>
  </Svg>
);

const Pay: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Bar x={340} h={260} fill={P_ROSE} label="COMPRAS" f={f} d={2} />
    <Rise f={f} d={at(24)} x={540} y={760} dx={-30} dy={0}>
      <path d="M-40 0 H40 M10 -30 L40 0 L10 30" stroke={GOLD} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Rise>
    <Bar x={740} h={440} fill={P_MINT} label="TE PAGAN" f={f} d={at(25)} />
    <Rise f={f} d={at(27)} x={540} y={1170}><Pill text="VALOR COMPLETO" fill={P_SAND} size={56} /></Rise>
  </Svg>
);

const HBar: React.FC<{y: number; w: number; fill: string; f: number; d: number}> = ({y, w, fill, f, d}) => {
  const k = ease((f - d) / 20);
  return <rect x={140} y={y} width={Math.max(1, w * k)} height={110} rx={30} fill={fill} stroke={NAVY} strokeWidth={STROKE} />;
};
const Terms: React.FC<SP> = ({f, at}) => (
  <Svg>
    <Rise f={f} d={0} x={540} y={260}><Pill text="PLAZOS" fill="#fff" size={66} /></Rise>
    <HBar y={470} w={300} fill={P_BLUE} f={f} d={at(31)} />
    <HBar y={690} w={800} fill={P_LAV} f={f} d={at(34) - 4} />
    <Rise f={f} d={at(32)} x={540} y={543} dy={14}><text textAnchor="start" fontFamily={FONT} fontWeight={700} fontSize={44} fill={NAVY} x={-370}>CORTOS</text></Rise>
    <Rise f={f} d={at(34)} x={540} y={763} dy={14}><text textAnchor="start" fontFamily={FONT} fontWeight={700} fontSize={44} fill={NAVY} x={-370}>LARGOS</text></Rise>
  </Svg>
);

const Small: React.FC<SP> = ({f, at}) => (
  <Svg>
    {[0, 1, 2].map((i) => (
      <Rise key={i} f={f} d={at(36) + i * 6} x={540} y={800 - i * 70} dy={40}>
        <g filter="url(#soft)"><ellipse rx={150} ry={42} fill={i % 2 ? P_SAND : P_MINT} stroke={NAVY} strokeWidth={STROKE} /></g>
      </Rise>
    ))}
    <Rise f={f} d={at(38)} x={540} y={470} dy={-30}><Coin /></Rise>
    <Rise f={f} d={at(39) - 2} x={540} y={1010}><Pill text="EMPIEZA CON POCO" fill={NAVY} tc="#fff" size={54} /></Rise>
  </Svg>
);

const Cal: React.FC<SP> = ({f, at}) => {
  const k = ease((f - (at(42) - 2)) / 16);
  return (
    <Svg>
      <Rise f={f} d={0} x={540} y={480}>
        <g filter="url(#soft)">
          <rect x={-290} y={-250} width={580} height={500} rx={34} fill="#fff" stroke={NAVY} strokeWidth={STROKE} />
          <path d="M-290 -250 H290 V-150 H-290 Z" fill={NAVY} />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
            <circle key={i} cx={-190 + (i % 4) * 127} cy={-60 + Math.floor(i / 4) * 100} r={24} fill={i === 6 ? P_SAND : '#E4E7EE'} stroke={i === 6 ? GOLD : 'none'} strokeWidth={5} />
          ))}
          <path d="M-90 -10 l-56 0" stroke="none" />
          <path d="M-40 70 l34 34 l70 -80" stroke={GOLD_D} strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={200} strokeDashoffset={200 * (1 - k)} />
        </g>
      </Rise>
      <Rise f={f} d={at(41)} x={540} y={920}><Pill text="ELIGE TU PLAZO" fill={P_MINT} size={56} /></Rise>
    </Svg>
  );
};

const Drop: React.FC<SP> = ({f, at}) => {
  const k = ease((f - (at(48) - 4)) / 26);
  return (
    <Svg>
      <Rise f={f} d={0} x={540} y={250}><Pill text="SI VENDES ANTES" fill="#fff" size={58} /></Rise>
      <Rise f={f} d={4} x={540} y={640}>
        <g filter="url(#soft)">
          <rect x={-340} y={-230} width={680} height={460} rx={30} fill="#fff" stroke={NAVY} strokeWidth={STROKE} />
          <path d="M-280 -120 L-120 -140 L40 -40 L160 -80 L280 130" stroke={NAVY} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={760} strokeDashoffset={760 * (1 - k)} />
        </g>
      </Rise>
      <Rise f={f} d={at(50)} x={540} y={1010}><Pill text="EL VALOR PUEDE BAJAR" fill={P_ROSE} size={50} /></Rise>
    </Svg>
  );
};

const Final: React.FC<SP> = ({f, at}) => {
  const a = ease(f / 16), b = ease((f - (at(57) - 3)) / 16);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 380}}>
      <div style={{textAlign: 'center', opacity: a, transform: `translateY(${(1 - a) * 30}px)`}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 100, color: NAVY, lineHeight: 1.1}}>SI TE</div>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 100, color: GOLD_D, lineHeight: 1.1}}>SIRVIÓ</div>
      </div>
      <div style={{marginTop: 44, opacity: b, transform: `translateY(${(1 - b) * 30}px)`}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 88, color: '#fff', background: NAVY, padding: '8px 52px 16px', borderRadius: 34, borderBottom: `10px solid ${GOLD}`}}>LIKE + SÍGUEME</div>
      </div>
      <div style={{position: 'absolute', bottom: 120, left: 70, right: 70, textAlign: 'center', fontFamily: FONT, fontWeight: 400, fontSize: 28, color: GRAY, lineHeight: 1.4, opacity: cl((f - at(57)) / 14)}}>
        Contenido educativo. No constituye una recomendación de inversión. El valor puede subir o bajar; no es garantía.
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
export const Cetes: React.FC = () => {
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
  const MAP: Record<string, React.FC<SP>> = {hook: Hook, give: Give, cetes: CetesS, cert: Cert, disc: Disc, pay: Pay, terms: Terms, small: Small, cal: Cal, drop: Drop, final: Final};
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
      <Audio src={staticFile('cetes/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

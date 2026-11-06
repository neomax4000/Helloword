import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/cat/words.json';
import {FONT, FPS, W} from './theme';
import {CORAL, CREAM, Chart, Coin, Cross, F, INK, PINK, Qmark, RED, Svg, TEAL, Txt, VIO, YEL, cl, ease, lerp, pop, sp} from './narrador';

type Word = {i: number; w: string; s: number; e: number};
const words = data.words as Word[];
const TS: Record<number, number> = {};
words.forEach((x) => (TS[x.i] = x.s));
const T = (i: number) => {
  for (let k = i; k < i + 5; k++) if (TS[k] !== undefined) return TS[k];
  return 0;
};

const FRAMES = [
  {z: 1, x: 0, y: 0, r: 0},
  {z: 1.15, x: 0, y: -40, r: -1.2},
  {z: 1.08, x: 50, y: 20, r: 1},
  {z: 1.2, x: -30, y: -20, r: 0},
];

/* ---------------- fondos con patrón (cambian cada 2–3 escenas) ---------------- */
const THEMES = [
  {c: '#16A99B', c2: '#0E8A7E', pat: 'grid'},
  {c: '#FF6B57', c2: '#E2503D', pat: 'stripes'},
  {c: '#6C4CF0', c2: '#5537D6', pat: 'dots'},
  {c: '#FFC93C', c2: '#F2B21E', pat: 'rays'},
  {c: '#FF5FA2', c2: '#E8458A', pat: 'dots'},
  {c: '#1F3A5F', c2: '#14273F', pat: 'grid'},
  {c: '#0E1020', c2: '#05060D', pat: 'spot'},
];
const ThemeBg: React.FC<{n: number; f: number}> = ({n, f}) => {
  const t = THEMES[n];
  let pattern = '';
  let size = '';
  if (t.pat === 'grid') {
    pattern = `linear-gradient(rgba(255,255,255,0.10) 3px, transparent 3px), linear-gradient(90deg, rgba(255,255,255,0.10) 3px, transparent 3px)`;
    size = '90px 90px';
  } else if (t.pat === 'stripes') {
    pattern = `repeating-linear-gradient(45deg, rgba(255,255,255,0.09) 0 40px, transparent 40px 80px)`;
  } else if (t.pat === 'dots') {
    pattern = `radial-gradient(rgba(255,255,255,0.16) 8px, transparent 9px)`;
    size = '70px 70px';
  }
  const off = (f * 1.2) % 90;
  return (
    <AbsoluteFill style={{background: `radial-gradient(1200px 1200px at 50% 38%, ${t.c}, ${t.c2} 75%)`}}>
      {pattern && <AbsoluteFill style={{backgroundImage: pattern, backgroundSize: size || undefined, backgroundPosition: `${off}px ${off}px`}} />}
      {t.pat === 'rays' && (
        <svg width={W} height={1920} style={{position: 'absolute'}}>
          {Array.from({length: 18}, (_, i) => {
            const a = (i / 18) * Math.PI * 2 + f * 0.004;
            return <path key={i} d={`M540 760 L${540 + Math.cos(a) * 1600} ${760 + Math.sin(a) * 1600} L${540 + Math.cos(a + 0.14) * 1600} ${760 + Math.sin(a + 0.14) * 1600}Z`} fill="rgba(255,255,255,0.18)" />;
          })}
        </svg>
      )}
      {t.pat === 'spot' && <AbsoluteFill style={{background: 'radial-gradient(700px 700px at 50% 40%, rgba(255,201,60,0.25), transparent 70%)'}} />}
    </AbsoluteFill>
  );
};
const Background: React.FC<{f: number; t: number}> = ({f, t}) => {
  const idx = shots.findIndex((s) => t >= s.a && t < s.b);
  const cur = shots[Math.max(0, idx)];
  // inicio del bloque de fondo actual
  let start = cur.a;
  for (let i = Math.max(0, idx); i >= 0 && shots[i].bg === cur.bg; i--) start = shots[i].a;
  const prevBg = shots.find((s) => s.bg === cur.bg - 1)?.bg;
  const p = ease((t - start) * FPS / 12);
  return (
    <AbsoluteFill>
      {prevBg !== undefined && p < 1 && <ThemeBg n={prevBg} f={f} />}
      <AbsoluteFill style={{clipPath: `circle(${p * 160}% at 50% 40%)`}}>
        <ThemeBg n={cur.bg} f={f} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};


const SHOTS_RAW = [
  {w: 0, k: 'hook', bg: 0}, {w: 7, k: 'rate', bg: 0},
  {w: 14, k: 'sum', bg: 1}, {w: 28, k: 'compare', bg: 1},
  {w: 37, k: 'sign', bg: 2}, {w: 43, k: 'final', bg: 2},
];
type Shot = {w: number; k: string; bg: number; a: number; b: number};
const shots: Shot[] = SHOTS_RAW.map((s, i, arr) => ({
  ...s,
  a: i === 0 ? 0 : T(s.w) - 0.08,
  b: i < arr.length - 1 ? T(arr[i + 1].w) - 0.08 : data.total + 1,
}));
const CUTZ = [3, 5, 9, 11, 17, 21, 25, 30, 35, 39, 42];

const Label: React.FC<{text: string; c?: string; tc?: string; size?: number; w?: number}> = ({text, c = CREAM, tc = INK, size = 60, w}) => {
  const ww = w || text.length * size * 0.68 + 80;
  return (
    <g>
      <rect x={-ww / 2} y={-size * 0.95} width={ww} height={size * 1.7} rx={size * 0.85} fill={c} stroke={INK} strokeWidth={8} />
      <text textAnchor="middle" y={size * 0.35} fontFamily={FONT} fontWeight={700} fontSize={size} fill={tc}>
        {text}
      </text>
    </g>
  );
};
type SP = {f: number; at: (i: number) => number; d: number};

const CreditCard: React.FC<{c?: string; s?: number}> = ({c = VIO, s = 1}) => (
  <g transform={`scale(${s})`}>
    <rect x={-220} y={-135} width={440} height={270} rx={30} fill={c} stroke={INK} strokeWidth={9} />
    <rect x={-220} y={-75} width={440} height={56} fill={INK} />
    <rect x={-180} y={30} width={150} height={26} rx={13} fill={CREAM} opacity={0.85} />
    <rect x={-180} y={72} width={230} height={20} rx={10} fill={CREAM} opacity={0.55} />
    <circle cx={150} cy={80} r={30} fill={YEL} stroke={INK} strokeWidth={6} />
  </g>
);

const Hook: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(540 520) rotate(${-6 + Math.sin(f / 9) * 3}) ${pop(f, 0, 1.25)}`}>
      <CreditCard />
    </g>
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${[250, 540, 830][i]} 880) ${pop(f, at(3) + i * 4 - 2)}`}>
        <Coin r={70} />
      </g>
    ))}
    <g transform={`translate(860 270) rotate(${Math.sin(f / 6) * 9}) ${pop(f, 4, 1.5)}`}>
      <Qmark c={YEL} />
    </g>
    {f >= at(4) && (
      <g transform={`translate(540 1090) rotate(-2) ${pop(f, at(4))}`}>
        <Label text="¿CUÁNTO CUESTA?" c={YEL} size={64} />
      </g>
    )}
  </Svg>
);

const Rate: React.FC<SP> = ({f, at}) => {
  const k = sp(f, at(9) - 2);
  return (
    <Svg>
      <g transform={`translate(540 520) rotate(-4) ${pop(f, 0, 1.2)}`}>
        <rect x={-300} y={-190} width={600} height={380} rx={40} fill={CREAM} stroke={INK} strokeWidth={10} />
        <text textAnchor="middle" y={-40} fontFamily={FONT} fontWeight={700} fontSize={120} fill={INK}>TASA</text>
        <text textAnchor="middle" y={120} fontFamily={FONT} fontWeight={700} fontSize={110} fill={CORAL}>%</text>
        {f >= at(9) - 2 && (
          <g transform={`scale(${k})`}>
            <path d="M-300 -190 L300 190 M300 -190 L-300 190" stroke={RED} strokeWidth={26} strokeLinecap="round" opacity={0.95} />
          </g>
        )}
      </g>
      {f >= at(9) && (
        <g transform={`translate(540 960) rotate(2) ${pop(f, at(9))}`}>
          <Label text="NO ES SOLO LA TASA" c={INK} tc={YEL} size={54} />
        </g>
      )}
      {f >= at(13) && (
        <g transform={`translate(540 1130) ${pop(f, at(13))}`}>
          <Label text="HAY MÁS COSTOS" c={CREAM} size={50} />
        </g>
      )}
    </Svg>
  );
};

const Chip: React.FC<{text: string; c: string; y: number; f: number; d: number}> = ({text, c, y, f, d}) =>
  f >= d - 1 ? (
    <g transform={`translate(540 ${y}) ${pop(f, d)}`}>
      <Label text={text} c={c} size={52} w={560} />
    </g>
  ) : null;

const Sum: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(540 330) ${pop(f, at(15) - 4, 1.2)}`}>
      <circle r={190} fill={YEL} stroke={INK} strokeWidth={12} />
      <text textAnchor="middle" y={30} fontFamily={FONT} fontWeight={700} fontSize={150} fill={INK}>CAT</text>
      <text textAnchor="middle" y={92} fontFamily={FONT} fontWeight={700} fontSize={25} fill={INK}>COSTO ANUAL TOTAL</text>
    </g>
    {f >= at(19) && (
      <text x={540} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={110} fill={CREAM} transform={`scale(${1}) `} opacity={cl((f - at(19)) / 6)}>=</text>
    )}
    <Chip text="TASA" c={TEAL} y={790} f={f} d={at(21)} />
    <Chip text="+ COSTOS" c={CORAL} y={940} f={f} d={at(25)} />
    <Chip text="+ COMISIONES" c={PINK} y={1090} f={f} d={at(27)} />
  </Svg>
);

const Compare: React.FC<SP> = ({f, at}) => {
  const tilt = Math.sin(cl((f - at(35)) / 18) * Math.PI) * 6 + 0;
  return (
    <Svg>
      <g transform={`translate(540 360) ${pop(f, 0, 1.1)}`}>
        <rect x={-230} y={-90} width={460} height={150} rx={75} fill={CREAM} stroke={INK} strokeWidth={9} />
        <text textAnchor="middle" y={22} fontFamily={FONT} fontWeight={700} fontSize={70} fill={INK}>% ANUAL</text>
      </g>
      <g transform={`translate(540 800) rotate(${tilt})`}>
        <rect x={-380} y={-14} width={760} height={28} rx={14} fill={INK} />
        <g transform={`translate(-260 -150) ${pop(f, at(33) - 6)}`}>
          <rect x={-150} y={-100} width={300} height={200} rx={26} fill={VIO} stroke={INK} strokeWidth={8} />
          <text textAnchor="middle" y={20} fontFamily={FONT} fontWeight={700} fontSize={42} fill={CREAM}>CRÉDITO A</text>
        </g>
        <g transform={`translate(260 -150) ${pop(f, at(34) - 6)}`}>
          <rect x={-150} y={-100} width={300} height={200} rx={26} fill={TEAL} stroke={INK} strokeWidth={8} />
          <text textAnchor="middle" y={20} fontFamily={FONT} fontWeight={700} fontSize={42} fill={INK}>CRÉDITO B</text>
        </g>
      </g>
      <path d="M540 814 L440 1030 L640 1030Z" fill={INK} />
      {f >= at(35) && (
        <g transform={`translate(540 1130) rotate(-2) ${pop(f, at(35))}`}>
          <Label text="COMPÁRALOS" c={YEL} size={60} />
        </g>
      )}
    </Svg>
  );
};

const Sign: React.FC<SP> = ({f, at}) => {
  const sweep = Math.sin(f / 12) * 25;
  const glow = f >= at(42) ? 1 + 0.06 * Math.sin((f - at(42)) / 3) : 1;
  return (
    <Svg>
      <g transform={`translate(540 520) rotate(-3) ${pop(f, 0, 1.15)}`}>
        <rect x={-270} y={-330} width={540} height={660} rx={26} fill="#fff" stroke={INK} strokeWidth={10} />
        <text textAnchor="middle" y={-250} fontFamily={FONT} fontWeight={700} fontSize={52} fill={INK}>CONTRATO</text>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={-210} y={-190 + i * 50} width={i % 2 ? 300 : 400} height={18} rx={9} fill="#d9d9e3" />
        ))}
        <g transform={`translate(0 20) scale(${glow})`}>
          <rect x={-210} y={-34} width={420} height={78} rx={18} fill={YEL} stroke={INK} strokeWidth={7} />
          <text textAnchor="middle" y={22} fontFamily={FONT} fontWeight={700} fontSize={56} fill={INK}>CAT</text>
        </g>
        {[0, 1].map((i) => (
          <rect key={i} x={-210} y={120 + i * 50} width={i % 2 ? 260 : 360} height={18} rx={9} fill="#d9d9e3" />
        ))}
        <path d="M-210 280 C-170 230 -130 320 -90 270" stroke={VIO} strokeWidth={9} fill="none" strokeLinecap="round" />
      </g>
      <g transform={`translate(${690 + sweep} 620) rotate(-20)`} opacity={f >= at(41) ? 1 : 0}>
        <circle r={95} fill="rgba(255,255,255,0.35)" stroke={INK} strokeWidth={13} />
        <path d="M68 68 L150 150" stroke={INK} strokeWidth={24} strokeLinecap="round" />
      </g>
      {f >= at(37) && (
        <g transform={`translate(540 1020) rotate(-2) ${pop(f, at(37))}`}>
          <Label text="ANTES DE FIRMAR" c={CREAM} size={56} />
        </g>
      )}
      {f >= at(42) && (
        <g transform={`translate(540 1150) ${pop(f, at(42))}`}>
          <Label text="MIRA EL CAT" c={INK} tc={YEL} size={60} />
        </g>
      )}
    </Svg>
  );
};

const Final: React.FC<SP> = ({f, at}) => {
  const k = sp(f, at(46) - 3, 9, 200);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 380}}>
      <div style={{transform: `scale(${0.7 + 0.3 * sp(f, 0)})`, textAlign: 'center'}}>
        <Txt size={100}>SI TE</Txt>
        <Txt size={100} color={YEL}>SIRVIÓ</Txt>
      </div>
      <div style={{marginTop: 40, transform: `scale(${k}) rotate(-4deg)`, opacity: cl(k * 2)}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 96, color: INK, background: YEL, padding: '6px 44px 14px', borderRadius: 30, border: `10px solid ${CREAM}`}}>LIKE + SÍGUEME</div>
      </div>
      <div style={{position: 'absolute', bottom: 120, left: 70, right: 70, textAlign: 'center', fontFamily: FONT, fontWeight: 400, fontSize: 28, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4, opacity: cl((f - at(47)) / 12)}}>
        Contenido educativo. No constituye una recomendación de inversión.
      </div>
    </AbsoluteFill>
  );
};

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
    g.b = gs[i + 1] ? Math.min(gs[i + 1].a, last.e + 0.5) : last.e + 0.8;
  });
  return gs;
})();
const KEYS = new Set(words.filter((x: any) => x.k).map((x) => x.i));

const Captions: React.FC<{t: number; f: number}> = ({t, f}) => {
  const g = groups.find((x) => t >= x.a && t < x.b);
  if (!g) return null;
  const k = sp(f, F(g.a), 12, 260);
  // palabra activa: la última que ya empezó (evita dos resaltadas)
  let active = -1;
  g.ws.forEach((w) => {
    if (t >= w.s - 0.03) active = w.i;
  });
  const lastW = g.ws[g.ws.length - 1];
  if (t > lastW.e + 0.1) active = -1;
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: 1440, display: 'flex', justifyContent: 'center', transform: `scale(${0.85 + 0.15 * k})`, opacity: cl(k * 2)}}>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 18px', background: 'rgba(14,16,32,0.82)', borderRadius: 34, padding: '18px 30px'}}>
        {g.ws.map((w) => {
          const on = w.i === active;
          const key = KEYS.has(w.i);
          return (
            <span key={w.i} style={{fontFamily: FONT, fontWeight: 700, fontSize: 80, lineHeight: 1.15, color: on ? INK : key ? YEL : '#fff', background: on ? YEL : 'transparent', borderRadius: 16, padding: '0 12px', transform: on ? 'scale(1.06)' : 'none', display: 'inline-block'}}>
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};


/* ---------------- composición ---------------- */
export const Cat: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const shot = shots.find((s) => t >= s.a && t < s.b) || shots[shots.length - 1];
  const sf = F(shot.a);
  const lf = f - sf;
  const at = (i: number) => F(T(i)) - sf;
  const sd = F(shot.b - shot.a);
  const p: SP = {f: lf, at, d: sd};

  let fi = 0;
  let lastCut = sf;
  CUTZ.forEach((ci, n) => {
    const cf = F(T(ci)) - 2;
    if (cf > sf && cf <= f) {
      fi = (n % 3) + 1;
      lastCut = cf;
    }
  });
  const fr = FRAMES[fi];
  const sinceCut = f - Math.max(sf, lastCut);
  const punch = 0.1 * Math.exp(-sinceCut / 4);
  const drift = 1 + 0.03 * cl(lf / Math.max(1, sd));
  const camera = `translate(${fr.x}px, ${fr.y}px) rotate(${fr.r}deg) scale(${(fr.z + punch) * drift})`;

  const MAP: Record<string, React.FC<SP>> = {hook: Hook, rate: Rate, sum: Sum, compare: Compare, sign: Sign, final: Final};
  const Comp = MAP[shot.k];
  const flash = lf < 3 && shot.w !== 0 ? 0.35 * (1 - lf / 3) : 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Background f={f} t={t} />
      <AbsoluteFill style={{transform: camera, transformOrigin: '540px 760px'}}>
        <Comp {...p} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 42%, transparent 60%, rgba(0,0,0,0.35))'}} />
      {shot.k !== 'final' && <Captions t={t} f={f} />}
      <div style={{position: 'absolute', left: 0, top: 0, height: 10, width: W * cl(t / data.total), background: YEL}} />
      {flash > 0 && <AbsoluteFill style={{background: '#fff', opacity: flash}} />}
      <Audio src={staticFile('cat/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

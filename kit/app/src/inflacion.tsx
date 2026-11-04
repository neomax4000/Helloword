import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/inflacion/words.json';
import shotsRaw from '../public/inflacion/shots.json';
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
type Shot = {w: number; k: string; bg: number; a: number; b: number};
const shots: Shot[] = (shotsRaw as {w: number; k: string; bg: number}[]).map((s, i, arr) => ({
  ...s,
  a: i === 0 ? 0 : T(s.w) - 0.08,
  b: i < arr.length - 1 ? T(arr[i + 1].w) - 0.08 : data.total + 1,
}));

const CUTZ = [5, 9, 15, 21, 31, 36, 46, 57, 62, 66, 74, 79, 86, 95, 103, 111, 118, 123, 128, 134, 138, 145, 153, 159, 165, 172, 177, 183];
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

/* ---------------- iconos nuevos ---------------- */
const Person: React.FC<{c: string}> = ({c}) => (
  <g>
    <circle cy={-70} r={48} fill="#F2B98C" stroke={INK} strokeWidth={7} />
    <path d="M-80 90 C-80 10 -40 -15 0 -15 C40 -15 80 10 80 90Z" fill={c} stroke={INK} strokeWidth={7} />
  </g>
);
const Bubble: React.FC<{w: number; h: number; c?: string; tail?: 'l' | 'r'; children?: React.ReactNode}> = ({w, h, c = CREAM, tail = 'l', children}) => (
  <g>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={40} fill={c} stroke={INK} strokeWidth={8} />
    <path d={tail === 'l' ? `M${-w / 4} ${h / 2 - 4} L${-w / 4 - 40} ${h / 2 + 60} L${-w / 4 + 50} ${h / 2 - 4}Z` : `M${w / 4} ${h / 2 - 4} L${w / 4 + 40} ${h / 2 + 60} L${w / 4 - 50} ${h / 2 - 4}Z`} fill={c} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <rect x={-w / 2 + 4} y={h / 2 - 12} width={w - 8} height={10} fill={c} />
    {children}
  </g>
);
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
const Doc: React.FC<{title: string}> = ({title}) => (
  <g>
    <rect x={-210} y={-270} width={420} height={540} rx={22} fill="#fff" stroke={INK} strokeWidth={9} />
    <text textAnchor="middle" y={-180} fontFamily={FONT} fontWeight={700} fontSize={58} fill={INK}>{title}</text>
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x={-160} y={-120 + i * 52} width={i % 2 ? 260 : 320} height={18} rx={9} fill="#d9d9e3" />
    ))}
    <path d="M60 200 C90 160 120 230 150 190" stroke={VIO} strokeWidth={8} fill="none" strokeLinecap="round" />
  </g>
);
const Stack: React.FC<{n: number; r?: number}> = ({n, r = 70}) => (
  <g>
    {Array.from({length: n}, (_, i) => (
      <g key={i}>
        <ellipse cy={-i * 22} rx={r} ry={r * 0.32} fill="#E0A100" stroke={INK} strokeWidth={6} />
        <ellipse cy={-i * 22 - 8} rx={r} ry={r * 0.32} fill={YEL} stroke={INK} strokeWidth={6} />
      </g>
    ))}
  </g>
);
const Bank: React.FC = () => (
  <g>
    <path d="M-150 -60 L0 -140 L150 -60Z" fill={CREAM} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    {[-100, -35, 35, 100].map((x) => (
      <rect key={x} x={x - 18} y={-50} width={36} height={130} fill={CREAM} stroke={INK} strokeWidth={6} />
    ))}
    <rect x={-165} y={80} width={330} height={36} fill={CREAM} stroke={INK} strokeWidth={8} />
  </g>
);
const Jar: React.FC<{p: number}> = ({p}) => (
  <g>
    <rect x={-150} y={-180} width={300} height={360} rx={50} fill="rgba(255,255,255,0.55)" stroke={INK} strokeWidth={9} />
    <rect x={-120} y={-230} width={240} height={60} rx={14} fill={VIO} stroke={INK} strokeWidth={8} />
    <clipPath id="jar"><rect x={-146} y={-176} width={292} height={352} rx={46} /></clipPath>
    <g clipPath="url(#jar)">
      {Array.from({length: 14}, (_, i) => (
        <g key={i} transform={`translate(${-90 + (i % 4) * 60 + (Math.floor(i / 4) % 2) * 30} ${150 - Math.floor(i / 4) * 55 + (1 - p) * 400})`}>
          <Coin r={30} />
        </g>
      ))}
    </g>
  </g>
);

/* ---------------- escenas ---------------- */
type SP = {f: number; at: (i: number) => number; d: number};

const Bill: React.FC<{c?: string; txt?: string}> = ({c = '#7BD389', txt = '$100'}) => (
  <g>
    <rect x={-190} y={-100} width={380} height={200} rx={22} fill={c} stroke={INK} strokeWidth={9} />
    <rect x={-160} y={-72} width={320} height={144} rx={12} fill="none" stroke={INK} strokeWidth={4} strokeDasharray="14 10" />
    <circle r={52} fill={CREAM} stroke={INK} strokeWidth={6} />
    <text textAnchor="middle" y={20} fontFamily={FONT} fontWeight={700} fontSize={62} fill={INK}>$</text>
    <text x={-120} y={-30} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill={INK}>{txt.replace('$', '')}</text>
    <text x={120} y={62} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill={INK}>{txt.replace('$', '')}</text>
  </g>
);
const Tag: React.FC<{c?: string}> = ({c = YEL}) => (
  <g>
    <path d="M-110 -70 L50 -70 L120 0 L50 70 L-110 70Z" fill={c} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <circle cx={70} cy={0} r={13} fill={INK} />
    <text x={-30} y={22} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={70} fill={INK}>$</text>
  </g>
);
const UpArrow: React.FC<{c?: string; s?: number}> = ({c = RED, s = 1}) => (
  <g transform={`scale(${s})`}>
    <path d="M0 80 L0 -60" stroke={c} strokeWidth={30} strokeLinecap="round" />
    <path d="M-60 0 L0 -70 L60 0" stroke={c} strokeWidth={30} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

const Mattress: React.FC<SP> = ({f, at}) => {
  const z = (i: number) => cl(((f - 20 - i * 9) % 60) / 20);
  return (
    <Svg>
      <g transform={`translate(540 720) rotate(-6) ${pop(f, 0, 1.1)}`}>
        <rect x={-330} y={-90} width={660} height={190} rx={36} fill="#9EC5FF" stroke={INK} strokeWidth={10} />
        {[-200, -70, 60, 190].map((x) => (
          <circle key={x} cx={x} cy={5} r={11} fill={INK} />
        ))}
        <rect x={-330} y={100} width={660} height={40} rx={14} fill="#6E9BE0" stroke={INK} strokeWidth={10} />
        <rect x={-300} y={140} width={30} height={60} fill={INK} />
        <rect x={270} y={140} width={30} height={60} fill={INK} />
        <g transform={`translate(${150 + Math.sin(f / 6) * 6} ${-120 - Math.abs(Math.sin(f / 9)) * 14})`}><Coin r={52} /></g>
        <g transform="translate(60 -100) rotate(20)"><Coin r={40} /></g>
      </g>
      {[0, 1, 2].map((i) => (
        <text key={i} x={760 + i * 55} y={420 - i * 70 - z(i) * 40} fontFamily={FONT} fontWeight={700} fontSize={90 - i * 14} fill={CREAM} stroke={INK} strokeWidth={8} paintOrder="stroke" opacity={cl(1 - z(i))}>Z</text>
      ))}
      <g transform={`translate(300 380) ${pop(f, at(9) - 2)}`}>
        <g transform="scale(1.2)"><Qmark c={YEL} /></g>
      </g>
    </Svg>
  );
};

const NoChange: React.FC<SP> = ({f, at}) => {
  const up = ease((f - at(21)) / 20);
  return (
    <Svg>
      <g transform={`translate(320 540) ${pop(f, 0, 0.78)}`}><Bill /></g>
      <g transform={`translate(320 760) ${pop(f, at(15) - 3)}`}>
        <Label text="NO CAMBIA" c={TEAL} size={52} />
      </g>
      <text x={555} y={590} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={90} fill={CREAM} stroke={INK} strokeWidth={8} paintOrder="stroke" opacity={cl(up * 3)}>VS</text>
      <g transform={`translate(790 ${1000 - up * 140}) rotate(${-8 + up * 8}) scale(${sp(f, at(21) - 2) * 1.35})`}>
        <Tag />
      </g>
      <g transform={`translate(790 ${760 - up * 80}) scale(${sp(f, at(21) + 4) * 0.7})`} opacity={cl(up * 2)}>
        <UpArrow />
      </g>
      <g transform={`translate(760 1190) ${pop(f, at(23))}`}>
        <Label text="LO QUE COMPRAS" c={YEL} size={40} />
      </g>
    </Svg>
  );
};

const Inflation: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(540 380) rotate(-4) ${pop(f, 0, 1)}`}>
      <text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={138} fill={CREAM} stroke={INK} strokeWidth={12} paintOrder="stroke">INFLACIÓN</text>
    </g>
    {[0, 1, 2, 3].map((i) => {
      const d = at(34) + i * 5;
      const k = ease((f - d) / 22);
      const x = [250, 470, 690, 860][i];
      const y0 = [1100, 1000, 1120, 980][i];
      return f >= d - 2 ? (
        <g key={i} transform={`translate(${x} ${y0 - k * 420}) rotate(${[-10, 8, -6, 12][i]}) scale(${sp(f, d) * 1.1})`} opacity={cl(1.3 - k * 0.5)}>
          <Tag c={[YEL, CORAL, CREAM, TEAL][i]} />
        </g>
      ) : null;
    })}
    {f >= at(34) && (
      <g transform={`translate(540 720) ${pop(f, at(34))}`}>
        <Label text="SUBEN DE PRECIO" c={INK} tc={YEL} size={62} />
      </g>
    )}
  </Svg>
);

const Basket: React.FC<SP> = ({f, at}) => {
  const less = f >= at(46);
  const Cart: React.FC<{n: number; label: string; c: string}> = ({n, label, c}) => (
    <g>
      <path d="M-130 -40 L130 -40 L100 120 L-100 120Z" fill={CREAM} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      <path d="M-130 -40 C-100 -140 100 -140 130 -40" fill="none" stroke={INK} strokeWidth={9} />
      {Array.from({length: n}, (_, i) => (
        <circle key={i} cx={-70 + (i % 3) * 70} cy={-70 - Math.floor(i / 3) * 52 + 18 * (i % 2)} r={34} fill={[CORAL, TEAL, YEL, PINK, VIO][i % 5]} stroke={INK} strokeWidth={6} />
      ))}
      <g transform="translate(0 220)"><Label text={label} c={c} size={44} /></g>
    </g>
  );
  return (
    <Svg>
      <g transform={`translate(540 330) ${pop(f, 0, 0.5)}`}><Bill /></g>
      <g transform={`translate(300 780) ${pop(f, 4)}`}><Cart n={5} label="ANTES" c={CREAM} /></g>
      <path d="M440 780 L600 780" stroke={CREAM} strokeWidth={22} strokeLinecap="round" />
      <path d="M570 740 L620 780 L570 820" stroke={CREAM} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <g transform={`translate(790 780) ${pop(f, at(44))}`}><Cart n={less ? 3 : 5} label="HOY" c={less ? CORAL : CREAM} /></g>
      {less && (
        <g transform={`translate(790 1090) rotate(-5) ${pop(f, at(46))}`}>
          <Label text="MENOS" c={INK} tc={YEL} size={64} />
        </g>
      )}
    </Svg>
  );
};

const Shrink: React.FC<SP> = ({f, at}) => {
  const k = ease((f - at(61)) / 26);
  return (
    <Svg>
      <g transform="translate(540 640)">
        <circle r={230} fill="none" stroke={CREAM} strokeWidth={8} strokeDasharray="22 18" opacity={0.8} />
        <g transform={`scale(${sp(f, 0) * (2.2 - k * 1.2)})`}><Coin r={100} /></g>
      </g>
      {f >= at(57) && (
        <g transform={`translate(540 1010) rotate(-3) ${pop(f, at(57))}`}>
          <Label text="PODER DE COMPRA" c={YEL} size={66} />
        </g>
      )}
      {k > 0.05 && (
        <g transform={`translate(540 380) ${pop(f, at(61))}`} opacity={cl(k * 2)}>
          <g transform="rotate(180)"><UpArrow c={RED} s={0.9} /></g>
        </g>
      )}
    </Svg>
  );
};

const Institutions: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(300 600) rotate(-4) ${pop(f, at(66) - at(63) + 0, 1)}`}>
      <rect x={-210} y={-250} width={420} height={500} rx={30} fill={CREAM} stroke={INK} strokeWidth={9} />
      <g transform="translate(0 -60) scale(1.2)"><Chart /></g>
      <text textAnchor="middle" y={150} fontFamily={FONT} fontWeight={700} fontSize={80} fill={INK}>INEGI</text>
      <text textAnchor="middle" y={210} fontFamily={FONT} fontWeight={700} fontSize={46} fill={CORAL}>MIDE</text>
    </g>
    {f >= at(74) - 4 && (
      <g transform={`translate(790 760) rotate(5) ${pop(f, at(74) - 4)}`}>
        <rect x={-210} y={-250} width={420} height={500} rx={30} fill={CREAM} stroke={INK} strokeWidth={9} />
        <g transform="translate(0 -60) scale(1.1)"><Bank /></g>
        <text textAnchor="middle" y={150} fontFamily={FONT} fontWeight={700} fontSize={64} fill={INK}>BANXICO</text>
        <text textAnchor="middle" y={210} fontFamily={FONT} fontWeight={700} fontSize={40} fill={TEAL}>ALZA BAJA</text>
      </g>
    )}
    {f >= at(79) && (
      <g transform={`translate(540 1180) ${pop(f, at(79))}`}>
        <Label text="BAJA Y ESTABLE" c={INK} tc={YEL} size={56} />
      </g>
    )}
  </Svg>
);

const Meta: React.FC<SP> = ({f, at}) => {
  const band = ease((f - at(89)) / 14);
  return (
    <Svg>
      <g transform={`translate(540 420) ${pop(f, at(83) - 3)}`}>
        <Label text="META" c={CREAM} size={56} />
      </g>
      <g transform={`translate(540 700) rotate(-3) scale(${sp(f, at(86) - 2, 9, 200)})`}>
        <text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={330} fill={YEL} stroke={INK} strokeWidth={20} paintOrder="stroke">3%</text>
      </g>
      <g transform="translate(540 1000)">
        <rect x={-380} y={-18} width={760} height={36} rx={18} fill={CREAM} stroke={INK} strokeWidth={7} />
        <rect x={-380 + 760 / 4} y={-30} width={(760 / 2) * band} height={60} rx={14} fill={TEAL} stroke={INK} strokeWidth={7} opacity={band} />
        <circle cx={0} cy={0} r={34} fill={CORAL} stroke={INK} strokeWidth={8} />
      </g>
      {f >= at(91) && (
        <g transform={`translate(540 1130) ${pop(f, at(91))}`}>
          <Label text="± 1 PUNTO" c={INK} tc={CREAM} size={56} />
        </g>
      )}
    </Svg>
  );
};

const Follow: React.FC<SP> = ({f, at}) => {
  const pulse = 1 + Math.sin(f / 4) * 0.05;
  return (
    <Svg>
      {[0, 1].map((i) => (
        <circle key={i} cx={540} cy={640} r={200 + ((f * 5 + i * 60) % 120)} fill="none" stroke={CREAM} strokeWidth={8} opacity={1 - ((f * 5 + i * 60) % 120) / 120} />
      ))}
      <g transform={`translate(540 640) scale(${sp(f, 0, 8, 200) * pulse})`}>
        <rect x={-300} y={-110} width={600} height={220} rx={110} fill={YEL} stroke={INK} strokeWidth={12} />
        <circle cx={-190} cy={0} r={58} fill={CORAL} stroke={INK} strokeWidth={8} />
        <path d="M-190 -28 L-190 28 M-218 0 L-162 0" stroke={CREAM} strokeWidth={14} strokeLinecap="round" />
        <text x={85} y={30} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={74} fill={INK}>SÍGUEME</text>
      </g>
      {f >= at(99) && (
        <g transform={`translate(540 1000) rotate(-3) ${pop(f, at(99))}`}>
          <Label text="LO QUE SIGUE…" c={INK} tc={YEL} size={64} />
        </g>
      )}
      {f >= at(103) && (
        <g transform={`translate(540 1200) ${pop(f, at(103))}`}>
          <Label text="CASI NADIE LO EXPLICA" c={CREAM} size={46} />
        </g>
      )}
    </Svg>
  );
};

const Accumulate: React.FC<SP> = ({f, at}) => {
  const base = at(111) - 6;
  return (
    <Svg>
      <g transform="translate(540 860)">
        <line x1={-420} x2={420} y1={0} y2={0} stroke={INK} strokeWidth={8} strokeLinecap="round" />
        {[1, 1.12, 1.26, 1.42, 1.6].map((v, i) => {
          const k = ease((f - base - i * 9) / 12);
          const h = 280 * v * k;
          return (
            <g key={i}>
              <rect x={-390 + i * 160} y={-h} width={120} height={h} rx={12} fill={i ? CORAL : CREAM} stroke={INK} strokeWidth={8} />
              <text x={-330 + i * 160} y={80} opacity={cl(k * 3)} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={INK}>AÑO {i + 1}</text>
            </g>
          );
        })}
      </g>
      {f >= at(109) && (
        <g transform={`translate(540 330) rotate(-3) ${pop(f, at(109))}`}>
          <Label text="NO DESAPARECE" c={INK} tc={YEL} size={64} />
        </g>
      )}
      {f >= at(115) && (
        <g transform={`translate(540 500) ${pop(f, at(115))}`}>
          <Label text="PRECIOS ↑ AÑO TRAS AÑO" c={CREAM} size={44} />
        </g>
      )}
    </Svg>
  );
};

const Idle: React.FC<SP> = ({f, at}) => {
  const k = ease((f - at(127)) / 40);
  return (
    <Svg>
      <g transform={`translate(540 650) ${pop(f, 0, 1.3)}`}>
        <Jar p={1} />
      </g>
      {[0, 1, 2].map((i) => (
        <text key={i} x={760 + i * 55} y={330 - i * 70 + Math.sin(f / 7 + i) * 8} fontFamily={FONT} fontWeight={700} fontSize={90 - i * 14} fill={CREAM} stroke={INK} strokeWidth={8} paintOrder="stroke">Z</text>
      ))}
      {f >= at(123) && (
        <g transform={`translate(540 1120) ${pop(f, at(123))}`}>
          <Label text="QUIETO" c={CREAM} size={72} />
        </g>
      )}
      {f >= at(127) && (
        <g transform={`translate(540 1300) rotate(-4) ${pop(f, at(127))}`}>
          <Label text="PIERDE MÁS" c={RED} tc={CREAM} size={64} />
        </g>
      )}
    </Svg>
  );
};

const Jobs: React.FC<SP> = ({f, at}) => {
  const items = [
    {w: 134, x: 230, label: 'EMERGENCIAS', c: CORAL, icon: <Cross />},
    {w: 135, x: 540, label: 'CORTO', c: TEAL, icon: (
      <g>
        <circle r={80} fill={CREAM} stroke={INK} strokeWidth={8} />
        <rect x={-6} y={-60} width={12} height={60} rx={6} fill={INK} />
        <rect x={-6} y={-6} width={50} height={12} rx={6} fill={INK} transform={`rotate(${f * 4})`} />
      </g>
    )},
    {w: 138, x: 850, label: 'LARGO', c: VIO, icon: <g transform="scale(0.9)"><Chart /></g>},
  ];
  return (
    <Svg>
      <g transform={`translate(540 340) ${pop(f, 0)}`}>
        <Label text="CADA PESO TIENE UN TRABAJO" c={INK} tc={YEL} size={44} />
      </g>
      {items.map((it) => {
        const d = at(it.w) - 3;
        return f >= d ? (
          <g key={it.w} transform={`translate(${it.x} 760) ${pop(f, d)}`}>
            <rect x={-140} y={-210} width={280} height={420} rx={30} fill={it.c} stroke={INK} strokeWidth={9} />
            <g transform="translate(0 -50)">{it.icon}</g>
            <text textAnchor="middle" y={130} fontFamily={FONT} fontWeight={700} fontSize={it.label.length > 8 ? 36 : 50} fill={CREAM} stroke={INK} strokeWidth={6} paintOrder="stroke">{it.label}</text>
            <text textAnchor="middle" y={178} fontFamily={FONT} fontWeight={700} fontSize={36} fill={CREAM} stroke={INK} strokeWidth={5} paintOrder="stroke">{it.w === 134 ? '' : 'PLAZO'}</text>
          </g>
        ) : null;
      })}
    </Svg>
  );
};

const Options: React.FC<SP> = ({f, at}) => {
  const k = ease((f - at(145) + 6) / 18);
  const cols = [CORAL, TEAL, VIO];
  return (
    <Svg>
      <g transform={`translate(540 520) ${pop(f, 0, 1.3)}`}><Coin r={80} /></g>
      {cols.map((c, i) => {
        const a = [-0.75, 0, 0.75][i];
        const L = 360 * k;
        return (
          <g key={i} transform="translate(540 620)">
            <path d={`M0 0 L${Math.sin(a) * L} ${Math.cos(a) * L}`} stroke={c} strokeWidth={26} strokeLinecap="round" />
            <circle cx={Math.sin(a) * L} cy={Math.cos(a) * L} r={44 * k} fill={c} stroke={INK} strokeWidth={8} />
          </g>
        );
      })}
      {f >= at(145) && (
        <g transform={`translate(540 1180) rotate(-3) ${pop(f, at(145))}`}>
          <Label text="OPCIÓN DISTINTA" c={YEL} size={66} />
        </g>
      )}
    </Svg>
  );
};

const Cash: React.FC<SP> = ({f, at}) => {
  const ok = f >= at(153);
  const bad = f >= at(159);
  return (
    <Svg>
      <g transform={`translate(540 560) ${pop(f, 0, 1)}`}>
        <rect x={-260} y={-130} width={520} height={300} rx={36} fill="#8B5A2B" stroke={INK} strokeWidth={10} />
        <rect x={-210} y={-170} width={420} height={110} rx={14} fill="#7BD389" stroke={INK} strokeWidth={8} />
        <rect x={110} y={-30} width={150} height={90} rx={24} fill={YEL} stroke={INK} strokeWidth={8} />
        <circle cx={160} cy={15} r={14} fill={INK} />
      </g>
      {ok && !bad && (
        <g transform={`translate(780 330) ${pop(f, at(153), 1)}`}>
          <circle r={90} fill={TEAL} stroke={INK} strokeWidth={10} />
          <path d="M-45 5 L-12 40 L48 -35" stroke={CREAM} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {ok && !bad && (
        <g transform={`translate(540 960) ${pop(f, at(153))}`}>
          <Label text="EFECTIVO A LA MANO: SANO" c={CREAM} size={44} />
        </g>
      )}
      {bad && (
        <g>
          <g transform={`translate(540 1000) rotate(-4) ${pop(f, at(159))}`}>
            <Label text="TODO QUIETO" c={INK} tc={CREAM} size={62} />
          </g>
          <g transform={`translate(540 1180) rotate(3) ${pop(f, at(161))}`}>
            <Label text="PARA SIEMPRE" c={RED} tc={CREAM} size={62} />
          </g>
          <g transform={`translate(540 560) scale(${sp(f, at(159))})`} opacity={0.95}>
            <path d="M-300 -200 L300 200 M300 -200 L-300 200" stroke={RED} strokeWidth={26} strokeLinecap="round" />
          </g>
        </g>
      )}
    </Svg>
  );
};

const Notice: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(540 640) rotate(-3) ${pop(f, 0, 1.2)}`}>
      <rect x={-250} y={-290} width={500} height={580} rx={26} fill="#fff" stroke={INK} strokeWidth={10} />
      <circle cx={0} cy={-170} r={70} fill={TEAL} stroke={INK} strokeWidth={8} />
      <text textAnchor="middle" y={-140} fontFamily={FONT} fontWeight={700} fontSize={100} fill={CREAM}>i</text>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={-190} y={-60 + i * 56} width={i % 2 ? 300 : 380} height={20} rx={10} fill="#d9d9e3" />
      ))}
    </g>
    <g transform={`translate(540 1060) ${pop(f, at(165) - 4)}`}>
      <Label text="INFORMACIÓN EDUCATIVA" c={YEL} size={50} />
    </g>
    {f >= at(169) && (
      <g transform={`translate(540 1220) ${pop(f, at(169))}`}>
        <Label text="NO ES RECOMENDACIÓN" c={CREAM} size={46} />
      </g>
    )}
  </Svg>
);

const HowMuch: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(540 760) ${pop(f, 0, 1.4)}`}>
      <Stack n={9} r={110} />
    </g>
    <g transform={`translate(540 420) rotate(${Math.sin(f / 5) * 8}) ${pop(f, 2, 1.6)}`}>
      <Qmark c={YEL} />
    </g>
    {f >= at(177) && (
      <g transform={`translate(540 1100) rotate(-3) ${pop(f, at(177))}`}>
        <Label text="¿QUIETO HOY?" c={INK} tc={YEL} size={74} />
      </g>
    )}
  </Svg>
);

const Final: React.FC<SP> = ({f, at}) => {
  const k = sp(f, at(183) - 3, 9, 200);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 380}}>
      <div style={{transform: `scale(${0.7 + 0.3 * sp(f, 0)})`, textAlign: 'center'}}>
        <Txt size={100}>SI TE</Txt>
        <Txt size={100} color={YEL}>SIRVIÓ</Txt>
      </div>
      <div style={{marginTop: 40, transform: `scale(${k}) rotate(-4deg)`, opacity: cl(k * 2)}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 96, color: INK, background: YEL, padding: '6px 44px 14px', borderRadius: 30, border: `10px solid ${CREAM}`}}>LIKE + SÍGUEME</div>
      </div>
      <div style={{position: 'absolute', bottom: 120, left: 70, right: 70, textAlign: 'center', fontFamily: FONT, fontWeight: 400, fontSize: 28, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4, opacity: cl((f - at(184)) / 12)}}>
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
export const Inflacion: React.FC = () => {
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

  const MAP: Record<string, React.FC<SP>> = {
    mattress: Mattress, nochange: NoChange, inflation: Inflation, basket: Basket, shrink: Shrink, inst: Institutions, meta: Meta,
    follow: Follow, accum: Accumulate, idle: Idle, jobs: Jobs, options: Options, cash: Cash, notice: Notice, howmuch: HowMuch, final: Final,
  };
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
      <Audio src={staticFile('inflacion/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

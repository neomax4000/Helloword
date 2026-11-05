import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/ipab/words.json';
import shotsRaw from '../public/ipab/shots.json';
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

const CUTZ = [3, 8, 14, 19, 27, 33, 43, 47, 52, 56, 61, 67, 74, 82, 86, 92, 100, 109, 115, 121, 127, 131, 140, 144, 151, 154, 160, 166, 172, 179, 187, 193];
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

const Shield: React.FC<{c?: string; s?: number; check?: boolean}> = ({c = TEAL, s = 1, check = true}) => (
  <g transform={`scale(${s})`}>
    <path d="M0 -150 L130 -100 L130 20 C130 100 60 150 0 180 C-60 150 -130 100 -130 20 L-130 -100Z" fill={c} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    {check && <path d="M-50 10 L-12 50 L58 -30" stroke={CREAM} strokeWidth={24} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
  </g>
);
const Chip: React.FC<{text: string; c: string; mark: 'ok' | 'no'; w?: number}> = ({text, c, mark, w = 640}) => (
  <g>
    <rect x={-w / 2} y={-52} width={w} height={104} rx={52} fill={c} stroke={INK} strokeWidth={8} />
    <text x={-w / 2 + 40} y={16} fontFamily={FONT} fontWeight={700} fontSize={text.length > 16 ? 40 : 50} fill={mark === 'ok' ? INK : CREAM} stroke={mark === 'ok' ? 'none' : INK} strokeWidth={5} paintOrder="stroke">{text}</text>
    <g transform={`translate(${w / 2 - 55} 0)`}>
      <circle r={36} fill={mark === 'ok' ? TEAL : RED} stroke={INK} strokeWidth={6} />
      {mark === 'ok' ? (
        <path d="M-16 2 L-4 16 L18 -12" stroke={CREAM} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M-14 -14 L14 14 M14 -14 L-14 14" stroke={CREAM} strokeWidth={9} strokeLinecap="round" />
      )}
    </g>
  </g>
);

const BankFall: React.FC<SP> = ({f, at}) => {
  const k = ease((f - at(3)) / 14);
  return (
    <Svg>
      <g transform={`translate(540 700) rotate(${k * 9}) ${pop(f, 0, 1.5)}`}>
        <Bank />
        {k > 0.1 && <path d="M-10 -130 L10 -60 L-20 0 L15 70 L-5 116" stroke={RED} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={cl(k * 2)} />}
      </g>
      {f >= at(3) && (
        <g transform={`translate(540 380) rotate(-4) ${pop(f, at(3) - 2)}`}>
          <Label text="¿SE CAE?" c={RED} tc={CREAM} size={72} />
        </g>
      )}
      {[0, 1, 2].map((i) => {
        const d = at(8) + i * 4;
        const q = ease((f - d) / 22);
        return f >= d - 1 ? (
          <g key={i} transform={`translate(${[300, 540, 780][i]} ${1080 - q * 260}) scale(${sp(f, d) * 0.9})`} opacity={cl(1.4 - q * 0.6)}>
            <Coin r={50} />
          </g>
        ) : null;
      })}
      {f >= at(8) && (
        <g transform={`translate(540 1110) ${pop(f, at(8))}`}>
          <Label text="¿TE LO DEVUELVEN?" c={YEL} size={56} />
        </g>
      )}
    </Svg>
  );
};

const Neither: React.FC<SP> = ({f, at}) => (
  <Svg>
    {[
      {x: 300, w: 12, label: 'TODO', c: TEAL, xw: 12},
      {x: 780, w: 14, label: 'NADA', c: CORAL, xw: 14},
    ].map((o, i) => (
      <g key={i} transform={`translate(${o.x} 520) ${pop(f, 0 + i * 6, 1)}`}>
        <circle r={150} fill={o.c} stroke={INK} strokeWidth={10} />
        <text textAnchor="middle" y={26} fontFamily={FONT} fontWeight={700} fontSize={84} fill={CREAM} stroke={INK} strokeWidth={8} paintOrder="stroke">{o.label}</text>
        {f >= at(o.xw) && (
          <g transform={`scale(${sp(f, at(o.xw))})`}>
            <path d="M-170 -170 L170 170 M170 -170 L-170 170" stroke={RED} strokeWidth={26} strokeLinecap="round" />
          </g>
        )}
      </g>
    ))}
    {f >= at(15) && (
      <g transform={`translate(540 880) rotate(-3) ${pop(f, at(15))}`}>
        <Label text="DEPENDE" c={INK} tc={YEL} size={80} />
      </g>
    )}
    {f >= at(17) && (
      <g transform={`translate(300 1090) ${pop(f, at(17))}`}>
        <Label text="¿DÓNDE?" c={CREAM} size={50} />
      </g>
    )}
    {f >= at(21) && (
      <g transform={`translate(780 1090) ${pop(f, at(21))}`}>
        <Label text="¿CUÁNTO?" c={YEL} size={50} />
      </g>
    )}
  </Svg>
);

const IpabIntro: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(540 500) ${pop(f, 0, 1.3)}`}>
      <Shield s={1.5} />
    </g>
    {f >= at(27) && (
      <g transform={`translate(540 930) rotate(-3) ${pop(f, at(27) - 2)}`}>
        <text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={190} fill={YEL} stroke={INK} strokeWidth={16} paintOrder="stroke">IPAB</text>
      </g>
    )}
    {f >= at(32) && (
      <g transform={`translate(540 1050) ${pop(f, at(32))}`}>
        <Label text="PROTECCIÓN AL AHORRO" c={CREAM} size={44} />
      </g>
    )}
    {f >= at(34) && (
      <g transform={`translate(540 1150) ${pop(f, at(34))}`}>
        <Label text="BANCARIO" c={INK} tc={CREAM} size={48} />
      </g>
    )}
  </Svg>
);

const Pays: React.FC<SP> = ({f, at}) => {
  const closed = f >= at(39);
  return (
    <Svg>
      <g transform={`translate(540 430) ${pop(f, 0, 0.9)}`}>
        <Bank />
        {closed && (
          <g transform={`translate(0 20) rotate(-8) ${pop(f, at(39) - 2, 1)}`}>
            <rect x={-170} y={-40} width={340} height={80} rx={12} fill={RED} stroke={INK} strokeWidth={8} />
            <text textAnchor="middle" y={20} fontFamily={FONT} fontWeight={700} fontSize={54} fill={CREAM}>CERRADO</text>
          </g>
        )}
      </g>
      {f >= at(43) && (
        <g transform={`translate(540 720) ${pop(f, at(43) - 2)}`}>
          <g transform="scale(0.8)"><Shield s={1} /></g>
        </g>
      )}
      {[0, 1, 2].map((i) => {
        const d = at(44) + i * 5;
        return f >= d - 1 ? (
          <g key={i} transform={`translate(${[250, 540, 830][i]} 1000) scale(${sp(f, d) * 0.62})`}>
            <Person c={[CORAL, TEAL, VIO][i]} />
            <g transform={`translate(0 -150) scale(0.8)`}><Coin r={42} /></g>
          </g>
        ) : null;
      })}
      {f >= at(44) && (
        <g transform={`translate(540 1140) ${pop(f, at(44))}`}>
          <Label text="PAGA A LOS AHORRADORES" c={YEL} size={44} />
        </g>
      )}
    </Svg>
  );
};

const Limit: React.FC<SP> = ({f, at}) => {
  const line = ease((f - at(51)) / 14);
  return (
    <Svg>
      <g transform={`translate(540 420) ${pop(f, 0, 1)}`}>
        <Label text="LÍMITE" c={INK} tc={YEL} size={64} />
      </g>
      {f >= at(52) - 3 && (
        <g transform={`translate(540 730) rotate(-3) ${pop(f, at(52) - 3)}`}>
          <text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={190} fill={YEL} stroke={INK} strokeWidth={16} paintOrder="stroke">400 MIL</text>
          <text textAnchor="middle" y={150} fontFamily={FONT} fontWeight={700} fontSize={120} fill={CREAM} stroke={INK} strokeWidth={12} paintOrder="stroke">UDIS</text>
        </g>
      )}
      <g transform="translate(540 1000)">
        <line x1={-380} x2={-380 + 760 * line} y1={0} y2={0} stroke={RED} strokeWidth={14} strokeLinecap="round" strokeDasharray="30 18" />
      </g>
      {f >= at(55) && (
        <g transform={`translate(300 1110) ${pop(f, at(55))}`}>
          <Label text="POR PERSONA" c={CREAM} size={42} />
        </g>
      )}
      {f >= at(58) && (
        <g transform={`translate(790 1110) ${pop(f, at(58))}`}>
          <Label text="POR BANCO" c={YEL} size={42} />
        </g>
      )}
    </Svg>
  );
};

const Udi: React.FC<SP> = ({f, at}) => {
  const k = ease((f - at(67)) / 30);
  return (
    <Svg>
      <g transform={`translate(540 520) ${pop(f, 0, 1.3)}`}>
        <Coin r={130} />
        <text textAnchor="middle" y={30} fontFamily={FONT} fontWeight={700} fontSize={84} fill={INK}>UDI</text>
      </g>
      {f >= at(67) && (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${[240, 540, 840][i]} ${920 - k * 100 * (i + 1) * 0.5}) rotate(${[-8, 4, 10][i]}) scale(${sp(f, at(67) + i * 4) * 0.9})`}>
              <Tag c={[YEL, CORAL, CREAM][i]} />
            </g>
          ))}
          <g transform={`translate(540 860)`} opacity={cl(k * 3)}><UpArrow c={RED} s={0.7} /></g>
        </g>
      )}
      {f >= at(67) && (
        <g transform={`translate(540 760) rotate(-3) ${pop(f, at(67))}`}>
          <Label text="SE AJUSTA CON LA INFLACIÓN" c={INK} tc={YEL} size={40} />
        </g>
      )}
      {f >= at(75) && (
        <g transform={`translate(540 1120) ${pop(f, at(75))}`}>
          <Label text="SE ACTUALIZA" c={TEAL} size={64} />
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
      {f >= at(82) && (
        <g transform={`translate(540 960) rotate(-3) ${pop(f, at(82))}`}>
          <Label text="LO QUE SIGUE…" c={INK} tc={YEL} size={64} />
        </g>
      )}
      {f >= at(86) && (
        <g transform={`translate(540 1090) ${pop(f, at(86))}`}>
          <Label text="CASI NADIE LO REVISA" c={CREAM} size={46} />
        </g>
      )}
    </Svg>
  );
};

const Covered: React.FC<SP> = ({f, at}) => {
  const items = [
    {w: 91, t: 'CUENTAS DE AHORRO', c: CREAM},
    {w: 93, t: 'CUENTAS DE NÓMINA', c: YEL},
    {w: 96, t: 'CUENTAS DE CHEQUES', c: CREAM},
    {w: 100, t: 'PAGARÉS', c: YEL},
    {w: 102, t: 'DEPÓSITOS A PLAZO', c: CREAM},
  ];
  return (
    <Svg>
      <g transform={`translate(540 330) ${pop(f, 0, 1)}`}>
        <Label text="SÍ PROTEGE" c={TEAL} tc={CREAM} size={72} />
      </g>
      {items.map((it, i) => {
        const d = at(it.w) - 2;
        return f >= d ? (
          <g key={it.w} transform={`translate(540 ${540 + i * 150}) ${pop(f, d)}`}>
            <Chip text={it.t} c={it.c} mark="ok" />
          </g>
        ) : null;
      })}
    </Svg>
  );
};

const NotCovered: React.FC<SP> = ({f, at}) => {
  const items = [
    {w: 109, t: 'FONDOS DE INVERSIÓN', c: VIO},
    {w: 112, t: 'CASAS DE BOLSA', c: CORAL},
    {w: 115, t: 'CAJAS DE AHORRO', c: PINK},
    {w: 118, t: 'COOPERATIVAS', c: TEAL},
  ];
  return (
    <Svg>
      <g transform={`translate(540 360) rotate(-3) ${pop(f, at(107) - 2)}`}>
        <Label text="NO PROTEGE" c={RED} tc={CREAM} size={78} />
      </g>
      {items.map((it, i) => {
        const d = at(it.w) - 2;
        return f >= d ? (
          <g key={it.w} transform={`translate(540 ${600 + i * 170}) ${pop(f, d)}`}>
            <Chip text={it.t} c={it.c} mark="no" />
          </g>
        ) : null;
      })}
    </Svg>
  );
};

const FundNotDeposit: React.FC<SP> = ({f, at}) => {
  const pts = [[0, 80], [90, -20], [180, 60], [270, -90], [360, 10], [450, -60]];
  const k = ease((f - 4) / 40);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0] - 225} ${p[1]}`).join(' ');
  return (
    <Svg>
      <g transform={`translate(540 560) ${pop(f, 0, 1.1)}`}>
        <rect x={-300} y={-220} width={600} height={440} rx={30} fill={CREAM} stroke={INK} strokeWidth={9} />
        <path d={d} stroke={CORAL} strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} transform="scale(1.1)" />
      </g>
      {f >= at(124) && (
        <g transform={`translate(540 960) rotate(-3) ${pop(f, at(124))}`}>
          <Label text="NO ES UN DEPÓSITO" c={INK} tc={YEL} size={56} />
        </g>
      )}
      {f >= at(129) && (
        <g transform={`translate(540 1120) ${pop(f, at(129))}`}>
          <Label text="PUEDE SUBIR O BAJAR" c={CREAM} size={50} />
        </g>
      )}
      {f >= at(131) && (
        <g transform={`translate(830 330) ${pop(f, at(131))}`}><UpArrow c={TEAL} s={0.7} /></g>
      )}
      {f >= at(133) - 2 && (
        <g transform={`translate(250 330) ${pop(f, at(133) - 2)}`}><g transform="rotate(180)"><UpArrow c={RED} s={0.7} /></g></g>
      )}
    </Svg>
  );
};

const PerBank: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(540 330) ${pop(f, at(137) - 2)}`}>
      <Label text="EL LÍMITE ES POR BANCO" c={INK} tc={YEL} size={46} />
    </g>
    {[0, 1, 2].map((i) => {
      const d = [at(140), at(142), at(144)][i];
      return f >= d - 1 ? (
        <g key={i} transform={`translate(${[220, 540, 860][i]} 760) ${pop(f, d - 1, 0.62)}`}>
          <Bank />
          <g transform="translate(0 260)">
            <Shield s={0.45} c={[CORAL, TEAL, VIO][i]} check />
          </g>
          <g transform="translate(0 440)">
            <Label text="400 MIL" c={CREAM} size={50} w={300} />
          </g>
        </g>
      ) : null;
    })}
    {f >= at(145) && (
      <g transform={`translate(540 1120) rotate(-3) ${pop(f, at(145))}`}>
        <Label text="CADA UNO CUENTA APARTE" c={YEL} size={46} />
      </g>
    )}
  </Svg>
);

const Real: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(540 380) rotate(-3) ${pop(f, at(151) - 3, 1)}`}>
      <rect x={-230} y={-130} width={460} height={260} rx={30} fill={CREAM} stroke={INK} strokeWidth={9} />
      <rect x={-230} y={-130} width={460} height={70} rx={30} fill={RED} stroke={INK} strokeWidth={9} />
      <text textAnchor="middle" y={92} fontFamily={FONT} fontWeight={700} fontSize={120} fill={INK}>2025</text>
    </g>
    {f >= at(153) && (
      <g transform={`translate(540 730) ${pop(f, at(153) - 2)}`}>
        <Shield s={0.9} />
      </g>
    )}
    {[0, 1, 2].map((i) => {
      const d = at(154) + i * 4;
      return f >= d - 1 ? (
        <g key={i} transform={`translate(${[250, 540, 830][i]} 990) scale(${sp(f, d) * 0.55})`}>
          <Person c={[CORAL, TEAL, VIO][i]} />
        </g>
      ) : null;
    })}
    {f >= at(160) && (
      <g transform={`translate(540 1120) rotate(-2) ${pop(f, at(160))}`}>
        <Label text="UN BANCO DEJÓ DE OPERAR" c={INK} tc={CREAM} size={40} />
      </g>
    )}
  </Svg>
);

const Review: React.FC<SP> = ({f, at}) => {
  const sweep = Math.sin(f / 14) * 70;
  return (
    <Svg>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(540 ${480 + i * 210}) ${pop(f, i * 5, 1)}`}>
          <rect x={-340} y={-80} width={680} height={160} rx={30} fill={CREAM} stroke={INK} strokeWidth={9} />
          <g transform="translate(-230 0) scale(0.32)"><Bank /></g>
          <rect x={-110} y={-20} width={[320, 240, 280][i]} height={30} rx={15} fill="#d9d9e3" />
          <rect x={-110} y={28} width={160} height={22} rx={11} fill={[CORAL, TEAL, VIO][i]} />
        </g>
      ))}
      <g transform={`translate(${620 + sweep} ${760}) rotate(-20)`}>
        <circle r={110} fill="rgba(255,255,255,0.35)" stroke={INK} strokeWidth={14} />
        <path d="M80 80 L170 170" stroke={INK} strokeWidth={26} strokeLinecap="round" />
      </g>
      {f >= at(166) && (
        <g transform={`translate(540 1050) ${pop(f, at(166))}`}>
          <Label text="¿EN QUÉ INSTITUCIÓN?" c={YEL} size={46} />
        </g>
      )}
      {f >= at(172) && (
        <g transform={`translate(540 1140) ${pop(f, at(172))}`}>
          <Label text="¿CUÁNTO EN CADA UNA?" c={CREAM} size={46} />
        </g>
      )}
    </Svg>
  );
};

const Notice: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(540 570) rotate(-3) ${pop(f, 0, 1.2)}`}>
      <rect x={-250} y={-290} width={500} height={580} rx={26} fill="#fff" stroke={INK} strokeWidth={10} />
      <circle cx={0} cy={-170} r={70} fill={TEAL} stroke={INK} strokeWidth={8} />
      <text textAnchor="middle" y={-140} fontFamily={FONT} fontWeight={700} fontSize={100} fill={CREAM}>i</text>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={-190} y={-60 + i * 56} width={i % 2 ? 300 : 380} height={20} rx={10} fill="#d9d9e3" />
      ))}
    </g>
    <g transform={`translate(540 1000) ${pop(f, at(179) - 4)}`}>
      <Label text="INFORMACIÓN EDUCATIVA" c={YEL} size={50} />
    </g>
    {f >= at(181) && (
      <g transform={`translate(540 1110) ${pop(f, at(181))}`}>
        <Label text="NO ES RECOMENDACIÓN" c={CREAM} size={46} />
      </g>
    )}
  </Svg>
);

const HowMuch: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(540 760) ${pop(f, 0, 1.2)}`}>
      <Shield s={1.4} c={VIO} check={false} />
    </g>
    <g transform={`translate(540 420) rotate(${Math.sin(f / 5) * 8}) ${pop(f, 2, 1.6)}`}>
      <Qmark c={YEL} />
    </g>
    {f >= at(193) && (
      <g transform={`translate(540 1110) rotate(-3) ${pop(f, at(193))}`}>
        <Label text="¿PROTEGIDO?" c={INK} tc={YEL} size={74} />
      </g>
    )}
  </Svg>
);

const Final: React.FC<SP> = ({f, at}) => {
  const k = sp(f, at(199) - 3, 9, 200);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 380}}>
      <div style={{transform: `scale(${0.7 + 0.3 * sp(f, 0)})`, textAlign: 'center'}}>
        <Txt size={100}>SI TE</Txt>
        <Txt size={100} color={YEL}>SIRVIÓ</Txt>
      </div>
      <div style={{marginTop: 40, transform: `scale(${k}) rotate(-4deg)`, opacity: cl(k * 2)}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 96, color: INK, background: YEL, padding: '6px 44px 14px', borderRadius: 30, border: `10px solid ${CREAM}`}}>LIKE + SÍGUEME</div>
      </div>
      <div style={{position: 'absolute', bottom: 120, left: 70, right: 70, textAlign: 'center', fontFamily: FONT, fontWeight: 400, fontSize: 28, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4, opacity: cl((f - at(200)) / 12)}}>
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
export const Ipab: React.FC = () => {
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
    bankfall: BankFall, neither: Neither, intro: IpabIntro, pays: Pays, limit: Limit, udi: Udi, follow: Follow, covered: Covered,
    notcovered: NotCovered, fund: FundNotDeposit, perbank: PerBank, real: Real, review: Review, notice: Notice, howmuch: HowMuch, final: Final,
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
      <Audio src={staticFile('ipab/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

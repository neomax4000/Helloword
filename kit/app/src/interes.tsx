import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/interes/words.json';
import shotsRaw from '../public/interes/shots.json';
import {FONT, FPS, W} from './theme';
import {CORAL, CREAM, Card, Chart, Coin, F, INK, PINK, Qmark, RED, Svg, TEAL, Txt, VIO, YEL, cl, ease, lerp, pop, sp} from './narrador';

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

const CUTZ = [5, 13, 23, 33, 42, 44, 46, 53, 57, 62, 68, 73, 80, 83, 92, 96, 103, 109, 114, 117, 120, 130, 138, 146, 155, 160, 164, 169, 176, 179, 183, 185];
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

const Crowd: React.FC<SP> = ({f}) => {
  const ppl = [[-330, CORAL], [-110, VIO], [110, YEL], [330, PINK]] as const;
  return (
    <Svg>
      {ppl.map(([x, c], i) => {
        const k = ease((f - i * 4) / 16);
        return (
          <g key={i} transform={`translate(${540 + x * lerp(1.6, 1, k)} ${860 + Math.abs(Math.sin(f / 4 + i)) * -14}) scale(1.5)`} opacity={cl(k * 2)}>
            <Person c={c} />
          </g>
        );
      })}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${300 + i * 240} ${400 - i * 30}) ${pop(f, 18 + i * 6, 0.55)}`}>
          <Bubble w={200} h={170} tail={i === 2 ? 'r' : 'l'}>
            <g transform="translate(0 -10) scale(0.7)"><Qmark c={CORAL} /></g>
          </Bubble>
        </g>
      ))}
    </Svg>
  );
};

const Ask: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(540 560) ${pop(f, 0)}`}>
      <Bubble w={880} h={480}>
        <text textAnchor="middle" y={-90} fontFamily={FONT} fontWeight={700} fontSize={60} fill={INK}>¿Qué instrumento de</text>
        <text textAnchor="middle" y={10} fontFamily={FONT} fontWeight={700} fontSize={70} fill={CORAL}>INTERÉS COMPUESTO</text>
        <text textAnchor="middle" y={100} fontFamily={FONT} fontWeight={700} fontSize={60} fill={INK}>me recomiendas?</text>
      </Bubble>
    </g>
    <g transform={`translate(860 1050) rotate(${Math.sin(f / 5) * 6}) ${pop(f, at(16))}`}>
      <Person c={VIO} />
    </g>
  </Svg>
);

const Why: React.FC<SP> = ({f, at}) => {
  const k = sp(f, at(21), 8, 220);
  return (
    <Svg>
      <g transform={`translate(540 600) rotate(${-4 + Math.sin(f / 7) * 2}) scale(${k})`}>
        <text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={230} fill={CREAM} stroke={INK} strokeWidth={16} paintOrder="stroke">¿POR</text>
        <text textAnchor="middle" y={220} fontFamily={FONT} fontWeight={700} fontSize={230} fill={YEL} stroke={INK} strokeWidth={16} paintOrder="stroke">QUÉ?</text>
      </g>
    </Svg>
  );
};

const PaysMore: React.FC<SP> = ({f, at}) => {
  const up = ease((f - at(37)) / 18);
  return (
    <Svg>
      <g transform={`translate(540 ${700 - up * 60}) ${pop(f, 0, 1.2)}`}>
        <path d="M-60 -200 L60 -200 L40 -150 C150 -100 210 20 210 110 C210 230 120 280 0 280 C-120 280 -210 230 -210 110 C-210 20 -150 -100 -40 -150Z" fill="#C9A35A" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
        <rect x={-70} y={-170} width={140} height={30} rx={10} fill="#8B6A2E" stroke={INK} strokeWidth={6} />
        <text textAnchor="middle" y={150} fontFamily={FONT} fontWeight={700} fontSize={220} fill={INK} opacity={0.85}>$</text>
      </g>
      <g opacity={up}>
        <path d={`M800 ${1000 - up * 600} L800 ${1000}`} stroke={CREAM} strokeWidth={30} strokeLinecap="round" />
        <path d={`M730 ${470 + (1 - up) * 530} L800 ${400 + (1 - up) * 600} L870 ${470 + (1 - up) * 530}`} stroke={CREAM} strokeWidth={30} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {f >= at(37) && (
        <g transform={`translate(540 1150) rotate(-4) ${pop(f, at(37))}`}>
          <Label text="¿PAGA MÁS?" c={YEL} size={80} />
        </g>
      )}
    </Svg>
  );
};

const NoNoNo: React.FC<SP> = ({f, at}) => {
  const ids = [42, 43, 44, 45, 46];
  const pos = [[540, 620, 2.2, -6], [260, 300, 1, 8], [830, 330, 1.1, -10], [250, 1000, 1.05, 12], [830, 990, 1.2, -8]];
  return (
    <Svg>
      {ids.map((id, i) => {
        if (f < at(id) - 2) return null;
        const [x, y, s, r] = pos[i];
        const k = sp(f, at(id) - 2, 7, 260);
        return (
          <g key={id} transform={`translate(${x} ${y}) rotate(${r}) scale(${s * (2 - k)})`} opacity={cl(k * 1.5)}>
            <rect x={-170} y={-105} width={340} height={190} rx={30} fill="none" stroke={RED} strokeWidth={18} />
            <text textAnchor="middle" y={55} fontFamily={FONT} fontWeight={700} fontSize={150} fill={RED} stroke={CREAM} strokeWidth={6} paintOrder="stroke">NO</text>
          </g>
        );
      })}
    </Svg>
  );
};

const NotExist: React.FC<SP> = ({f, at}) => {
  const ghost = cl((f - at(57)) / 14);
  return (
    <Svg>
      <g transform={`translate(540 600) ${pop(f, 0)}`} opacity={1 - ghost * 0.75}>
        <rect x={-300} y={-300} width={600} height={600} rx={40} fill={ghost > 0 ? 'transparent' : CREAM} stroke={INK} strokeWidth={10} strokeDasharray={ghost > 0 ? '30 22' : undefined} />
        <text textAnchor="middle" y={-170} fontFamily={FONT} fontWeight={700} fontSize={46} fill={INK}>INSTRUMENTO DE</text>
        <text textAnchor="middle" y={-110} fontFamily={FONT} fontWeight={700} fontSize={46} fill={CORAL}>INTERÉS COMPUESTO</text>
        <g transform="translate(0 80) scale(1.4)"><Chart /></g>
      </g>
      {f >= at(57) && (
        <g transform={`translate(540 600) rotate(-10) ${pop(f, at(57), 1)}`}>
          <rect x={-380} y={-110} width={760} height={200} rx={24} fill={INK} stroke={CREAM} strokeWidth={10} />
          <text textAnchor="middle" y={40} fontFamily={FONT} fontWeight={700} fontSize={120} fill={YEL}>NO EXISTE</text>
        </g>
      )}
    </Svg>
  );
};

const YouCreate: React.FC<SP> = ({f, at}) => {
  const k = sp(f, 0, 9, 200);
  return (
    <Svg>
      {Array.from({length: 10}, (_, i) => {
        const a = (i / 10) * Math.PI * 2 + f * 0.03;
        return (
          <g key={i} transform={`translate(${540 + Math.cos(a) * 360} ${620 + Math.sin(a) * 360}) scale(${k})`}>
            <path d="M0 -30 L9 -9 L30 0 L9 9 L0 30 L-9 9 L-30 0 L-9 -9Z" fill={i % 2 ? YEL : CREAM} />
          </g>
        );
      })}
      <g transform={`translate(540 620) scale(${k * 1.1})`}>
        <circle r={230} fill={YEL} stroke={INK} strokeWidth={12} />
        <text textAnchor="middle" y={70} fontFamily={FONT} fontWeight={700} fontSize={220} fill={INK}>TÚ</text>
      </g>
      <g transform={`translate(540 1060) ${pop(f, 4)}`}>
        <Label text="LO CREAS" size={70} />
      </g>
    </Svg>
  );
};

const Pagare: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(400 640) rotate(-5) ${pop(f, 0)}`}>
      <Doc title="PAGARÉ" />
    </g>
    <g transform={`translate(800 380) rotate(8) ${pop(f, at(70))}`}>
      <rect x={-150} y={-150} width={300} height={300} rx={30} fill={CREAM} stroke={INK} strokeWidth={9} />
      <rect x={-150} y={-150} width={300} height={80} rx={30} fill={CORAL} stroke={INK} strokeWidth={9} />
      <text textAnchor="middle" y={60} fontFamily={FONT} fontWeight={700} fontSize={110} fill={INK}>1</text>
      <text textAnchor="middle" y={120} fontFamily={FONT} fontWeight={700} fontSize={44} fill={INK}>MES</text>
    </g>
    {f >= at(76) && (
      <g transform={`translate(780 1000) ${pop(f, at(76))}`}>
        <Label text="¡VENCE!" c={YEL} size={70} />
      </g>
    )}
  </Svg>
);

const Reinvest: React.FC<SP> = ({f, at}) => {
  const m = ease((f - at(83)) / 16);
  return (
    <Svg>
      <g transform={`translate(${lerp(330, 540, m)} 760)`}>
        <Stack n={8 + Math.round(m * 2)} r={110} />
      </g>
      <g transform={`translate(${lerp(820, 600, m)} ${lerp(560, 640, m)}) scale(${1 - m * 0.6})`} opacity={1 - m * 0.8}>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${(i - 1) * 70} ${Math.sin(f / 5 + i) * 10})`} opacity={f >= at(84) - 6 || i === 0 ? 1 : 0}>
            <Coin r={50} />
          </g>
        ))}
      </g>
      <g transform={`translate(330 1000) ${pop(f, at(82))}`} opacity={1 - m}>
        <Label text="CAPITAL" size={52} />
      </g>
      <g transform={`translate(820 760) ${pop(f, at(84))}`} opacity={1 - m}>
        <Label text="INTERESES" c={YEL} size={46} />
      </g>
      {f >= at(80) && (
        <g transform={`translate(540 260) ${pop(f, at(80))}`}>
          <Label text="REINVIERTES" c={INK} tc={YEL} size={72} />
        </g>
      )}
      {m > 0.5 && (
        <g transform={`translate(540 1080) ${pop(f, at(83) + 10)}`}>
          <Label text="CAPITAL + INTERESES" c={CREAM} size={50} />
        </g>
      )}
    </Svg>
  );
};

const Bars: React.FC<{f: number; grow: boolean; start: number; label: string; c: string}> = ({f, grow, start, label, c}) => {
  const vals = grow ? [1, 1.1, 1.22, 1.36, 1.52, 1.72] : [1, 1, 1, 1, 1, 1];
  return (
    <g>
      <line x1={-400} x2={420} y1={0} y2={0} stroke={INK} strokeWidth={8} strokeLinecap="round" />
      {vals.map((v, i) => {
        const k = ease((f - start - i * 5) / 10);
        const h = 260 * v * k;
        return (
          <g key={i}>
            <rect x={-380 + i * 135} y={-h} width={100} height={h} rx={10} fill={c} stroke={INK} strokeWidth={7} />
            {grow && i > 0 && <rect x={-380 + i * 135} y={-h} width={100} height={Math.max(0, h - 260 * k)} rx={10} fill={YEL} stroke={INK} strokeWidth={7} />}
          </g>
        );
      })}
      <text textAnchor="middle" x={10} y={90} fontFamily={FONT} fontWeight={700} fontSize={44} fill={INK}>{label}</text>
    </g>
  );
};

const Compound: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform="translate(540 820)">
      <Bars f={f} grow start={4} label="MES 1 → MES 6" c={TEAL} />
    </g>
    {f >= at(92) && (
      <g transform={`translate(540 280) rotate(-3) ${pop(f, at(92))}`}>
        <Label text="INTERÉS COMPUESTO" c={INK} tc={YEL} size={56} />
      </g>
    )}
    {f >= at(97) && (
      <g transform={`translate(780 450) ${pop(f, at(97))}`}>
        <Label text="¡CRECIÓ!" c={CORAL} tc={CREAM} size={56} />
      </g>
    )}
  </Svg>
);

const Withdraw: React.FC<SP> = ({f, at}) => {
  const out = ease((f - at(103)) / 16);
  return (
    <Svg>
      <g transform="translate(540 820)">
        <Bars f={f} grow={false} start={2} label="SIEMPRE IGUAL" c={TEAL} />
      </g>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${lerp(300 + i * 140, 870, out)} ${lerp(470, 280, out) - Math.sin(out * Math.PI) * 120}) scale(${1 - out * 0.4})`} opacity={f >= at(103) - 6 ? 1 : 0}>
          <Coin r={42} />
        </g>
      ))}
      <g transform={`translate(870 260) ${pop(f, at(103))}`}>
        <rect x={-90} y={-60} width={180} height={120} rx={20} fill="#8B5A2B" stroke={INK} strokeWidth={8} />
        <rect x={40} y={-20} width={60} height={40} rx={10} fill={YEL} stroke={INK} strokeWidth={6} />
      </g>
      {f >= at(109) && (
        <g transform={`translate(540 280) rotate(3) ${pop(f, at(109))}`}>
          <Label text="INTERÉS SIMPLE" c={CREAM} size={64} />
        </g>
      )}
    </Svg>
  );
};

const Decide: React.FC<SP> = ({f, at}) => {
  const sw = ease((f - at(112)) / 10);
  const bank = f >= at(117);
  return (
    <Svg>
      <g transform={`translate(540 520) ${pop(f, 0)}`}>
        <rect x={-260} y={-110} width={520} height={220} rx={110} fill={sw > 0.5 ? TEAL : '#9aa0b5'} stroke={INK} strokeWidth={10} />
        <circle cx={lerp(-150, 150, sw)} r={88} fill={CREAM} stroke={INK} strokeWidth={10} />
        <text textAnchor="middle" y={250} fontFamily={FONT} fontWeight={700} fontSize={96} fill={INK}>TÚ DECIDES</text>
      </g>
      {bank && (
        <g transform={`translate(300 1060) scale(${0.8 * sp(f, at(117))})`}>
          <Bank />
          <path d="M-130 -130 L130 130 M130 -130 L-130 130" stroke={RED} strokeWidth={26} strokeLinecap="round" />
        </g>
      )}
      {f >= at(120) && (
        <g transform={`translate(780 1060) scale(${0.8 * sp(f, at(120))})`}>
          <Doc title="" />
          <path d="M-130 -130 L130 130 M130 -130 L-130 130" stroke={RED} strokeWidth={26} strokeLinecap="round" />
        </g>
      )}
    </Svg>
  );
};

const Fund: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(540 640) ${pop(f, 0, 1.3)}`}>
      <Jar p={ease(f / 30)} />
    </g>
    {f >= at(128) && (
      <g transform={`translate(540 1120) ${pop(f, at(128))}`}>
        <Label text="FONDO DE INVERSIÓN" c={CREAM} size={56} />
      </g>
    )}
  </Svg>
);

const Confusion: React.FC<SP> = ({f}) => (
  <Svg>
    <g transform={`translate(540 640) rotate(${f * 3}) ${pop(f, 0)}`}>
      {Array.from({length: 5}, (_, i) => (
        <path key={i} d={`M0 0 C${120 + i * 40} ${-80 - i * 30} ${180 + i * 30} ${140 + i * 20} ${-60 - i * 50} ${200 + i * 30}`} stroke={[CREAM, YEL, INK, TEAL, VIO][i]} strokeWidth={16} fill="none" strokeLinecap="round" transform={`rotate(${i * 72})`} />
      ))}
    </g>
    <g transform={`translate(540 640) rotate(${Math.sin(f / 4) * 12}) ${pop(f, 6, 1.4)}`}>
      <Qmark c={YEL} />
    </g>
    <g transform={`translate(540 1120) ${pop(f, 8)}`}>
      <Label text="LA CONFUSIÓN" c={INK} tc={CREAM} size={64} />
    </g>
  </Svg>
);

const NoTerm: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(540 600) ${pop(f, 0, 1.1)}`}>
      <circle r={260} fill={CREAM} stroke={INK} strokeWidth={12} />
      <g transform={`rotate(${f * 6})`}>
        <rect x={-8} y={-200} width={16} height={200} rx={8} fill={INK} />
      </g>
      <g transform={`rotate(${f * 0.6})`}>
        <rect x={-10} y={-140} width={20} height={140} rx={10} fill={CORAL} />
      </g>
      <circle r={20} fill={INK} />
    </g>
    {f >= at(145) && (
      <g transform={`translate(540 1100) rotate(-3) ${pop(f, at(145))}`}>
        <Label text="SIN PLAZO" c={YEL} size={78} />
      </g>
    )}
  </Svg>
);

const Monthly: React.FC<SP> = ({f, at}) => {
  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN'];
  const cross = f >= at(164);
  return (
    <Svg>
      {months.map((m, i) => {
        const d = at(151) + i * 7;
        const x = 200 + (i % 3) * 340;
        const y = 380 + Math.floor(i / 3) * 380;
        const flyK = ease((f - d - 8) / 12);
        return (
          <g key={m}>
            <g transform={`translate(${x} ${y}) ${pop(f, d, 1)}`}>
              <rect x={-130} y={-130} width={260} height={240} rx={24} fill={CREAM} stroke={INK} strokeWidth={8} />
              <rect x={-130} y={-130} width={260} height={66} rx={24} fill={CORAL} stroke={INK} strokeWidth={8} />
              <text textAnchor="middle" y={40} fontFamily={FONT} fontWeight={700} fontSize={64} fill={INK}>{m}</text>
            </g>
            {f >= d + 8 && (
              <g transform={`translate(${x + flyK * 140} ${y - 40 - flyK * 200})`} opacity={1 - flyK}>
                <Coin r={36} />
              </g>
            )}
          </g>
        );
      })}
      {cross && (
        <g transform={`translate(540 1150) rotate(-3) ${pop(f, at(164))}`}>
          <rect x={-420} y={-80} width={840} height={140} rx={30} fill={INK} stroke={CREAM} strokeWidth={8} />
          <text textAnchor="middle" y={22} fontFamily={FONT} fontWeight={700} fontSize={60} fill={CREAM}>INTERÉS SOBRE INTERÉS</text>
          <path d="M-400 0 L400 0" stroke={RED} strokeWidth={22} strokeLinecap="round" />
        </g>
      )}
    </Svg>
  );
};

const Simple: React.FC<SP> = ({f}) => (
  <Svg>
    <g transform="translate(540 780)">
      <Bars f={f} grow={false} start={0} label="" c={CREAM} />
    </g>
    <g transform={`translate(540 360) ${pop(f, 4)}`}>
      <Label text="SIGUE SIENDO SIMPLE" c={YEL} size={60} />
    </g>
  </Svg>
);

const Versus: React.FC<SP> = ({f, at}) => {
  const tilt = Math.sin(f / 6) * 10;
  return (
    <Svg>
      <g transform="translate(540 700)">
        <rect x={-14} y={-160} width={28} height={420} fill={INK} />
        <path d="M-120 280 L120 280 L60 240 L-60 240Z" fill={INK} />
        <g transform={`rotate(${tilt})`}>
          <rect x={-380} y={-180} width={760} height={24} rx={12} fill={INK} />
          <g transform="translate(-320 -100)">
            <Label text="COMPUESTO" c={YEL} size={44} />
          </g>
          <g transform="translate(320 -100)">
            <Label text="SIMPLE" c={CREAM} size={44} />
          </g>
        </g>
      </g>
      {f >= at(173) && (
        <g transform={`translate(540 1140) ${pop(f, at(173))}`}>
          <Label text="NO IMPORTA EL PRODUCTO" c={CORAL} tc={CREAM} size={50} />
        </g>
      )}
    </Svg>
  );
};

const Final: React.FC<SP> = ({f, at}) => {
  const k = sp(f, at(185) - 3, 9, 200);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 420}}>
      <div style={{transform: `scale(${0.7 + 0.3 * sp(f, 0)})`}}>
        <Txt size={96}>EL INTERÉS</Txt>
        <Txt size={96} color={YEL}>COMPUESTO</Txt>
      </div>
      <div style={{marginTop: 40, transform: `scale(${k}) rotate(-4deg)`, opacity: cl(k * 2)}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 118, color: INK, background: YEL, padding: '6px 50px 16px', borderRadius: 30, border: `10px solid ${CREAM}`}}>LO HACES TÚ</div>
      </div>
      <div style={{position: 'absolute', bottom: 120, left: 70, right: 70, textAlign: 'center', fontFamily: FONT, fontWeight: 400, fontSize: 28, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4, opacity: cl((f - at(187) - 10) / 12)}}>
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
const KEYS = new Set([13, 14, 26, 27, 37, 38, 56, 57, 58, 60, 61, 68, 80, 82, 85, 92, 93, 97, 103, 109, 110, 112, 114, 117, 128, 130, 138, 146, 148, 157, 165, 166, 170, 177, 180, 183, 184, 185, 187]);

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
export const Interes: React.FC = () => {
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
    crowd: Crowd, ask: Ask, why: Why, paysmore: PaysMore, nonono: NoNoNo, notexist: NotExist, youcreate: YouCreate,
    pagare: Pagare, reinvest: Reinvest, compound: Compound, withdraw: Withdraw, decide: Decide, fund: Fund,
    confusion: Confusion, noterm: NoTerm, monthly: Monthly, simple: Simple, versus: Versus, final: Final,
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
      <Audio src={staticFile('interes/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

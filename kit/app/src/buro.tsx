import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/buro/words.json';
import shotsRaw from '../public/buro/shots.json';
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

const CUTZ = [4, 8, 19, 30, 44, 57, 73, 85, 97, 108, 121, 136, 152, 163, 172, 183];
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


const Clock: React.FC<{c?: string}> = ({c = CREAM}) => (
  <g>
    <circle r={110} fill={c} stroke={INK} strokeWidth={9} />
    <path d="M0 -70 L0 0 L50 30" stroke={INK} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);
const Search: React.FC<{x: number}> = ({x}) => (
  <g transform={`translate(${x} 0) rotate(-20)`}>
    <circle r={110} fill="rgba(255,255,255,0.35)" stroke={INK} strokeWidth={14} />
    <path d="M80 80 L170 170" stroke={INK} strokeWidth={26} strokeLinecap="round" />
  </g>
);

const BlackList: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(540 560) ${pop(f, 0, 1.2)}`}>
      <Doc title="BURÓ" />
    </g>
    {f >= at(6) && (
      <g transform={`translate(540 560) rotate(-12) ${pop(f, at(6) - 2, 1.4)}`}>
        <rect x={-300} y={-70} width={600} height={140} rx={18} fill={INK} stroke={CREAM} strokeWidth={8} />
        <text textAnchor="middle" y={30} fontFamily={FONT} fontWeight={700} fontSize={84} fill={CREAM}>LISTA NEGRA</text>
      </g>
    )}
    {f >= at(10) && (
      <g transform={`translate(540 1050) ${pop(f, at(10))}`}>
        <Label text="¿TE CIERRA LAS PUERTAS?" c={YEL} size={46} />
      </g>
    )}
  </Svg>
);

const NotList: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(540 520) ${pop(f, 0, 1.4)}`}>
      <circle r={200} fill={RED} stroke={INK} strokeWidth={12} />
      <path d="M-100 -100 L100 100 M100 -100 L-100 100" stroke={CREAM} strokeWidth={34} strokeLinecap="round" />
    </g>
    <g transform={`translate(540 880) rotate(-3) ${pop(f, 2)}`}>
      <Label text="NO ES LISTA NEGRA" c={INK} tc={YEL} size={64} />
    </g>
    {f >= at(18) && (
      <g transform={`translate(540 1040) ${pop(f, at(18))}`}>
        <Label text="CASI NADIE SABE QUÉ ES" c={CREAM} size={46} />
      </g>
    )}
    {f >= at(21) && (
      <g transform={`translate(830 330) rotate(${Math.sin(f / 5) * 8}) ${pop(f, at(21), 1.2)}`}>
        <g transform="scale(0.8)"><Qmark c={YEL} /></g>
      </g>
    )}
  </Svg>
);

const WhatIs: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(540 480) ${pop(f, 0, 1.2)}`}>
      <rect x={-290} y={-200} width={580} height={400} rx={30} fill={CREAM} stroke={INK} strokeWidth={10} />
      <rect x={-290} y={-200} width={580} height={90} rx={30} fill={VIO} stroke={INK} strokeWidth={10} />
      <text textAnchor="middle" y={-135} fontFamily={FONT} fontWeight={700} fontSize={50} fill={CREAM}>HISTORIAL</text>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={-240} y={-70 + i * 80} width={300} height={26} rx={13} fill="#d9d9e3" />
          <circle cx={170} cy={-57 + i * 80} r={26} fill={[TEAL, TEAL, CORAL][i]} stroke={INK} strokeWidth={6} />
        </g>
      ))}
    </g>
    {f >= at(27) && (
      <g transform={`translate(540 850) ${pop(f, at(27) - 2)}`}>
        <Label text="EMPRESA PRIVADA" c={YEL} size={56} />
      </g>
    )}
    {f >= at(33) && (
      <g transform={`translate(540 1000) ${pop(f, at(33))}`}>
        <Label text="CÓMO PAGAS TUS CRÉDITOS" c={CREAM} size={44} />
      </g>
    )}
    {[0, 1, 2].map((i) => {
      const d = at(35) + i * 4;
      return f >= d - 1 ? (
        <g key={i} transform={`translate(${[300, 540, 780][i]} 1160) scale(${sp(f, d) * 0.5})`}>
          <Coin r={50} />
        </g>
      ) : null;
    })}
  </Svg>
);

const Monthly: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(540 420) ${pop(f, 0, 1.2)}`}>
      <rect x={-250} y={-170} width={500} height={340} rx={26} fill={CREAM} stroke={INK} strokeWidth={10} />
      <rect x={-250} y={-170} width={500} height={80} rx={26} fill={CORAL} stroke={INK} strokeWidth={10} />
      <text textAnchor="middle" y={-112} fontFamily={FONT} fontWeight={700} fontSize={50} fill={CREAM}>CADA MES</text>
      {Array.from({length: 12}, (_, i) => (
        <circle key={i} cx={-180 + (i % 6) * 72} cy={-30 + Math.floor(i / 6) * 90} r={20} fill="#d9d9e3" />
      ))}
    </g>
    {f >= at(39) && (
      <g transform={`translate(540 800) ${pop(f, at(39))}`}>
        <Label text="BANCOS REPORTAN" c={INK} tc={CREAM} size={52} />
      </g>
    )}
    {f >= at(46) && (
      <g transform={`translate(300 1000) ${pop(f, at(46) - 2)}`}>
        <Chip text="A TIEMPO" c={CREAM} mark="ok" w={440} />
      </g>
    )}
    {f >= at(50) && (
      <g transform={`translate(780 1150) ${pop(f, at(50) - 2)}`}>
        <Chip text="CON ATRASO" c={CORAL} mark="no" w={440} />
      </g>
    )}
  </Svg>
);

const Record: React.FC<SP> = ({f, at}) => {
  const k = ease((f - at(58)) / 30);
  return (
    <Svg>
      <g transform={`translate(540 420) ${pop(f, 0, 1.1)}`}>
        <Label text="BUENOS / MALOS" c={CREAM} size={56} />
      </g>
      {f >= at(53) && (
        <g transform={`translate(540 420)`}>
          <path d="M-330 0 L330 0" stroke={RED} strokeWidth={16} strokeLinecap="round" opacity={cl((f - at(53)) / 6)} />
        </g>
      )}
      {f >= at(58) && (
        <g transform={`translate(540 760) ${pop(f, at(58) - 2, 1)}`}>
          <rect x={-260} y={-160} width={520} height={320} rx={26} fill="#fff" stroke={INK} strokeWidth={9} />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={-210} y={-110 + i * 62} width={(i % 2 ? 300 : 400) * cl(k * 1.4 - i * 0.1)} height={24} rx={12} fill={[TEAL, TEAL, YEL, TEAL][i]} />
          ))}
        </g>
      )}
      {f >= at(58) && (
        <g transform={`translate(540 1060) ${pop(f, at(58))}`}>
          <Label text="UN REGISTRO" c={YEL} size={60} />
        </g>
      )}
      {f >= at(63) && (
        <g transform={`translate(540 1180) rotate(-3) ${pop(f, at(63))}`}>
          <Label text="LO CONSTRUYES TÚ" c={INK} tc={CREAM} size={54} />
        </g>
      )}
    </Svg>
  );
};

const Decides: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(300 520) ${pop(f, 0, 1)}`}>
      <Doc title="BURÓ" />
    </g>
    {f >= at(68) && (
      <g transform={`translate(300 520) ${pop(f, at(68) - 2, 1.4)}`}>
        <path d="M-200 -260 L200 260 M200 -260 L-200 260" stroke={RED} strokeWidth={26} strokeLinecap="round" />
      </g>
    )}
    <g transform={`translate(790 520) ${pop(f, at(76) - 6, 1)}`}>
      <g transform="scale(1.1)"><Bank /></g>
    </g>
    {f >= at(68) && (
      <g transform={`translate(300 930) ${pop(f, at(68))}`}>
        <Label text="NO APRUEBA" c={CORAL} size={44} />
      </g>
    )}
    {f >= at(70) && (
      <g transform={`translate(300 1030) ${pop(f, at(70))}`}>
        <Label text="NI RECHAZA" c={CORAL} size={44} />
      </g>
    )}
    {f >= at(76) && (
      <g transform={`translate(780 930) rotate(-3) ${pop(f, at(76))}`}>
        <Label text="DECIDE" c={INK} tc={YEL} size={60} />
      </g>
    )}
    {f >= at(77) && (
      <g transform={`translate(780 1060) ${pop(f, at(77))}`}>
        <Label text="CADA INSTITUCIÓN" c={YEL} size={40} />
      </g>
    )}
  </Svg>
);

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
      {f >= at(83) && (
        <g transform={`translate(540 960) rotate(-3) ${pop(f, at(83))}`}>
          <Label text="LO QUE SIGUE…" c={INK} tc={YEL} size={64} />
        </g>
      )}
      {f >= at(88) && (
        <g transform={`translate(540 1090) ${pop(f, at(88))}`}>
          <Label text="MÁS GENTE LO IGNORA" c={CREAM} size={46} />
        </g>
      )}
    </Svg>
  );
};

const Free: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(540 520) rotate(-3) ${pop(f, 0, 1.2)}`}>
      <Doc title="REPORTE" />
    </g>
    {f >= at(97) && (
      <g transform={`translate(740 330) rotate(12) ${pop(f, at(97) - 2, 1.5)}`}>
        <rect x={-190} y={-62} width={380} height={124} rx={62} fill={TEAL} stroke={INK} strokeWidth={9} />
        <text textAnchor="middle" y={26} fontFamily={FONT} fontWeight={700} fontSize={78} fill={CREAM} stroke={INK} strokeWidth={6} paintOrder="stroke">GRATIS</text>
      </g>
    )}
    {f >= at(98) && (
      <g transform={`translate(540 960) ${pop(f, at(98))}`}>
        <Label text="UNA VEZ" c={YEL} size={60} />
      </g>
    )}
    {f >= at(100) && (
      <g transform={`translate(540 1090) ${pop(f, at(100))}`}>
        <Label text="CADA 12 MESES" c={CREAM} size={54} />
      </g>
    )}
  </Svg>
);

const Where: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(540 360) ${pop(f, 0, 1)}`}>
      <Label text="SITIOS OFICIALES" c={INK} tc={YEL} size={60} />
    </g>
    {f >= at(109) - 2 && (
      <g transform={`translate(540 640) ${pop(f, at(109) - 2)}`}>
        <Chip text="BURÓ DE CRÉDITO" c={YEL} mark="ok" w={760} />
      </g>
    )}
    {f >= at(113) - 2 && (
      <g transform={`translate(540 820) ${pop(f, at(113) - 2)}`}>
        <Chip text="CÍRCULO DE CRÉDITO" c={CREAM} mark="ok" w={760} />
      </g>
    )}
    {f >= at(113) && (
      <g transform={`translate(540 1060) ${pop(f, at(113))}`}>
        <Label text="www · solo sitios oficiales" c={TEAL} tc={CREAM} size={40} />
      </g>
    )}
  </Svg>
);

const Errors: React.FC<SP> = ({f, at}) => {
  const fixed = f >= at(127);
  return (
    <Svg>
      <g transform={`translate(540 520) ${pop(f, 0, 1.1)}`}>
        <Doc title="REPORTE" />
        {f >= at(120) && (
          <g transform={`translate(90 -10) ${pop(f, at(120) - 2, 1.3)}`}>
            <circle r={60} fill={fixed ? TEAL : RED} stroke={INK} strokeWidth={8} />
            {fixed ? (
              <path d="M-28 4 L-8 26 L32 -20" stroke={CREAM} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <text textAnchor="middle" y={26} fontFamily={FONT} fontWeight={700} fontSize={80} fill={CREAM}>!</text>
            )}
          </g>
        )}
      </g>
      <g transform={`translate(${520 + Math.sin(f / 14) * 60} 520)`}><Search x={0} /></g>
      {f >= at(120) && (
        <g transform={`translate(540 1030) ${pop(f, at(120))}`}>
          <Label text="A VECES HAY ERRORES" c={CORAL} size={46} />
        </g>
      )}
      {fixed && (
        <g transform={`translate(540 1150) ${pop(f, at(127))}`}>
          <Label text="PUEDES CORREGIRLOS" c={YEL} size={48} />
        </g>
      )}
    </Svg>
  );
};

const Expire: React.FC<SP> = ({f, at}) => {
  const k = ease((f - at(138)) / 30);
  return (
    <Svg>
      <g transform={`translate(540 500) ${pop(f, 0, 1.2)}`}>
        <g transform="scale(1.5)"><Clock /></g>
      </g>
      <g transform={`translate(540 880) rotate(-3) ${pop(f, at(133) - 2)}`}>
        <Label text="NO ES PARA SIEMPRE" c={INK} tc={YEL} size={56} />
      </g>
      {f >= at(138) && (
        <g transform={`translate(540 1060) `} opacity={1 - k * 0.5}>
          <g transform={`scale(${sp(f, at(138) - 2)})`}>
            <rect x={-300} y={-52} width={600} height={104} rx={52} fill={CORAL} stroke={INK} strokeWidth={8} />
            <text textAnchor="middle" y={18} fontFamily={FONT} fontWeight={700} fontSize={50} fill={CREAM} stroke={INK} strokeWidth={5} paintOrder="stroke" opacity={1 - k * 0.7}>REGISTRO NEGATIVO</text>
          </g>
        </g>
      )}
      {f >= at(139) && (
        <g transform={`translate(540 1180) ${pop(f, at(139))}`}>
          <Label text="SE BORRA CON EL TIEMPO" c={CREAM} size={44} />
        </g>
      )}
    </Svg>
  );
};

const Scam: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(540 480) ${pop(f, 0, 1.2)}`}>
      <path d="M0 -190 L190 140 L-190 140Z" fill={YEL} stroke={INK} strokeWidth={12} strokeLinejoin="round" />
      <text textAnchor="middle" y={100} fontFamily={FONT} fontWeight={700} fontSize={190} fill={INK}>!</text>
    </g>
    {f >= at(147) && (
      <g transform={`translate(540 850) rotate(-3) ${pop(f, at(147) - 2)}`}>
        <Label text="¿“LIMPIAR” TU HISTORIAL?" c={CORAL} size={46} />
      </g>
    )}
    {f >= at(151) && (
      <g transform={`translate(540 990) ${pop(f, at(151) - 2)}`}>
        <Label text="ALERTA CONDUSEF" c={INK} tc={YEL} size={56} />
      </g>
    )}
    {f >= at(154) && (
      <g transform={`translate(540 1120) ${pop(f, at(154))}`}>
        <Label text="NADIE BORRA DEUDAS VIGENTES" c={CREAM} size={40} />
      </g>
    )}
  </Svg>
);

const Build: React.FC<SP> = ({f, at}) => (
  <Svg>
    {[0, 1, 2, 3, 4].map((i) => {
      const d = at(164) + i * 5;
      const k = ease((f - d) / 16);
      const h = 120 + i * 70;
      return (
        <g key={i} transform={`translate(${190 + i * 175} 900)`}>
          <rect x={-60} y={-h * k} width={120} height={h * k} rx={16} fill={[TEAL, TEAL, VIO, YEL, TEAL][i]} stroke={INK} strokeWidth={8} />
        </g>
      );
    })}
    <g transform={`translate(540 380) ${pop(f, 0, 1.1)}`}>
      <Label text="BUEN HISTORIAL" c={INK} tc={YEL} size={64} />
    </g>
    {f >= at(164) && (
      <g transform={`translate(540 1040) ${pop(f, at(164))}`}>
        <Label text="PAGAR A TIEMPO" c={CREAM} size={54} />
      </g>
    )}
    {f >= at(167) && (
      <g transform={`translate(540 1160) ${pop(f, at(167))}`}>
        <Label text="MES CON MES" c={YEL} size={54} />
      </g>
    )}
  </Svg>
);

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
    <g transform={`translate(540 1000) ${pop(f, at(172) - 4)}`}>
      <Label text="INFORMACIÓN EDUCATIVA" c={YEL} size={50} />
    </g>
    {f >= at(174) && (
      <g transform={`translate(540 1110) ${pop(f, at(174))}`}>
        <Label text="NO ES RECOMENDACIÓN" c={CREAM} size={46} />
      </g>
    )}
  </Svg>
);

const HowSee: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(540 720) ${pop(f, 0, 1.2)}`}>
      <Doc title="MI BURÓ" />
    </g>
    <g transform={`translate(${430 + Math.sin(f / 12) * 90} 760)`}><Search x={0} /></g>
    <g transform={`translate(540 330) rotate(${Math.sin(f / 5) * 8}) ${pop(f, 2, 1.4)}`}>
      <Qmark c={YEL} />
    </g>
    {f >= at(181) && (
      <g transform={`translate(540 1140) rotate(-3) ${pop(f, at(181))}`}>
        <Label text="¿CÓMO TE VE?" c={INK} tc={YEL} size={70} />
      </g>
    )}
  </Svg>
);

const Final: React.FC<SP> = ({f, at}) => {
  const k = sp(f, at(192) - 3, 9, 200);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 380}}>
      <div style={{transform: `scale(${0.7 + 0.3 * sp(f, 0)})`, textAlign: 'center'}}>
        <Txt size={100}>SI TE</Txt>
        <Txt size={100} color={YEL}>SIRVIÓ</Txt>
      </div>
      <div style={{marginTop: 40, transform: `scale(${k}) rotate(-4deg)`, opacity: cl(k * 2)}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 96, color: INK, background: YEL, padding: '6px 44px 14px', borderRadius: 30, border: `10px solid ${CREAM}`}}>LIKE + SÍGUEME</div>
      </div>
      <div style={{position: 'absolute', bottom: 120, left: 70, right: 70, textAlign: 'center', fontFamily: FONT, fontWeight: 400, fontSize: 28, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4, opacity: cl((f - at(190)) / 12)}}>
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
export const Buro: React.FC = () => {
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
    blacklist: BlackList, notlist: NotList, whatis: WhatIs, monthly: Monthly, record: Record, decides: Decides, follow: Follow, free: Free,
    where: Where, errors: Errors, expire: Expire, scam: Scam, build: Build, notice: Notice, howsee: HowSee, final: Final,
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
      <Audio src={staticFile('buro/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/afore/words.json';
import shotsRaw from '../public/afore/shots.json';
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
  const t = THEMES[n % THEMES.length];
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
  const p = start <= 0.001 ? 1 : ease((t - start) * FPS / 12);
  return (
    <AbsoluteFill>
      {prevBg !== undefined && p < 1 && <ThemeBg n={prevBg} f={f} />}
      <AbsoluteFill style={{clipPath: `circle(${p * 160}% at 50% 40%)`}}>
        <ThemeBg n={cur.bg} f={f} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
/* ---------------- piezas ---------------- */
const Person: React.FC<{c: string}> = ({c}) => (
  <g>
    <circle cy={-70} r={48} fill="#F2B98C" stroke={INK} strokeWidth={7} />
    <path d="M-80 90 C-80 10 -40 -15 0 -15 C40 -15 80 10 80 90Z" fill={c} stroke={INK} strokeWidth={7} />
  </g>
);
const Label: React.FC<{text: string; c?: string; tc?: string; size?: number}> = ({text, c = CREAM, tc = INK, size = 60}) => {
  const s = Math.min(size, 820 / (text.length * 0.68));
  const ww = text.length * s * 0.68 + 80;
  return (
    <g>
      <rect x={-ww / 2} y={-s * 0.95} width={ww} height={s * 1.7} rx={s * 0.85} fill={c} stroke={INK} strokeWidth={8} />
      <text textAnchor="middle" y={s * 0.35} fontFamily={FONT} fontWeight={700} fontSize={s} fill={tc}>
        {text}
      </text>
    </g>
  );
};
const Tag: React.FC<{c?: string; t?: string}> = ({c = YEL, t = '$'}) => (
  <g>
    <path d="M-110 -70 L50 -70 L120 0 L50 70 L-110 70Z" fill={c} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <circle cx={70} cy={0} r={13} fill={INK} />
    <text x={-30} y={22} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={70} fill={INK}>{t}</text>
  </g>
);
const Arrow: React.FC<{c?: string; s?: number; down?: boolean}> = ({c = RED, s = 1, down = false}) => (
  <g transform={`scale(${s} ${down ? -s : s})`}>
    <path d="M0 80 L0 -60" stroke={c} strokeWidth={30} strokeLinecap="round" />
    <path d="M-60 0 L0 -70 L60 0" stroke={c} strokeWidth={30} fill="none" strokeLinecap="round" strokeLinejoin="round" />
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
const arcP = (a0: number, a1: number, r = 200) => {
  const p = (a: number) => `${Math.cos(a) * r} ${Math.sin(a) * r}`;
  return `M${p(a0)} A${r} ${r} 0 0 1 ${p(a1)}`;
};
const Dial: React.FC<{ang: number}> = ({ang}) => (
  <g>
    <path d={arcP(Math.PI, Math.PI * 1.34)} stroke={TEAL} strokeWidth={56} fill="none" strokeLinecap="butt" />
    <path d={arcP(Math.PI * 1.34, Math.PI * 1.67)} stroke={YEL} strokeWidth={56} fill="none" />
    <path d={arcP(Math.PI * 1.67, Math.PI * 2)} stroke={CORAL} strokeWidth={56} fill="none" />
    <path d={arcP(Math.PI, Math.PI * 2, 232)} stroke={INK} strokeWidth={8} fill="none" />
    <path d={arcP(Math.PI, Math.PI * 2, 168)} stroke={INK} strokeWidth={8} fill="none" />
    <g transform={`rotate(${ang})`}>
      <path d="M-10 0 L0 -185 L10 0Z" fill={INK} />
    </g>
    <circle r={28} fill={INK} />
    <text y={96} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={70} fill={INK}>%</text>
  </g>
);
const Wallet: React.FC = () => (
  <g>
    <rect x={-190} y={-110} width={380} height={240} rx={34} fill={VIO} stroke={INK} strokeWidth={9} />
    <rect x={-190} y={-110} width={380} height={64} rx={30} fill="#6249E0" stroke={INK} strokeWidth={9} />
    <rect x={60} y={-10} width={150} height={90} rx={30} fill={YEL} stroke={INK} strokeWidth={8} />
    <circle cx={110} cy={35} r={14} fill={INK} />
  </g>
);
const Thermo: React.FC<{p: number}> = ({p}) => (
  <g>
    <rect x={-45} y={-210} width={90} height={330} rx={45} fill={CREAM} stroke={INK} strokeWidth={9} />
    <circle cy={150} r={80} fill={p > 0.5 ? CORAL : '#5BB8FF'} stroke={INK} strokeWidth={9} />
    <rect x={-22} y={-190 + 300 * (1 - p)} width={44} height={290 - 300 * (1 - p) + 20} rx={22} fill={p > 0.5 ? CORAL : '#5BB8FF'} />
    <circle cy={150} r={56} fill={p > 0.5 ? CORAL : '#5BB8FF'} />
  </g>
);
const Cart: React.FC = () => (
  <g>
    <path d="M-210 -120 L-150 -120 L-90 80 L170 80 L210 -70 L-130 -70" fill={CREAM} stroke={INK} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" />
    <circle cx={-60} cy={140} r={32} fill={INK} />
    <circle cx={140} cy={140} r={32} fill={INK} />
  </g>
);
const Percent: React.FC<{c?: string}> = ({c = YEL}) => (
  <g>
    <circle r={200} fill={c} stroke={INK} strokeWidth={12} />
    <text textAnchor="middle" y={85} fontFamily={FONT} fontWeight={700} fontSize={260} fill={INK}>%</text>
  </g>
);
const Doc: React.FC<{title: string}> = ({title}) => (
  <g>
    <rect x={-210} y={-270} width={420} height={540} rx={22} fill="#fff" stroke={INK} strokeWidth={9} />
    <text textAnchor="middle" y={-180} fontFamily={FONT} fontWeight={700} fontSize={58} fill={INK}>{title}</text>
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x={-160} y={-120 + i * 52} width={i % 2 ? 260 : 320} height={18} rx={9} fill="#d9d9e3" />
    ))}
  </g>
);

type SP = {f: number; at: (i: number) => number; d: number};
const Ic: React.FC<{y?: number; f: number; r?: number; s?: number; children: React.ReactNode}> = ({y = 520, f, r = 0, s = 1, children}) => (
  <g transform={`translate(540 ${y}) rotate(${r}) ${pop(f, 0, s)}`}>{children}</g>
);
const L1: React.FC<{f: number; d?: number; y?: number; text: string; c?: string; tc?: string; size?: number; rot?: number}> = ({f, d = 0, y = 960, text, c, tc, size = 64, rot = 0}) =>
  f >= d - 1 ? (
    <g transform={`translate(540 ${y}) rotate(${rot}) ${pop(f, d)}`}>
      <Label text={text} c={c} tc={tc} size={size} />
    </g>
  ) : null;
const Loan: React.FC<{name: string; c: string; bar?: number; badge?: string}> = ({name, c, bar, badge}) => (
  <g>
    <rect x={-150} y={-200} width={300} height={400} rx={26} fill="#fff" stroke={INK} strokeWidth={9} />
    <rect x={-150} y={-200} width={300} height={78} rx={24} fill={c} stroke={INK} strokeWidth={9} />
    <text textAnchor="middle" y={-146} fontFamily={FONT} fontWeight={700} fontSize={40} fill={INK}>{name}</text>
    <text textAnchor="middle" y={-60} fontFamily={FONT} fontWeight={700} fontSize={44} fill={INK}>TASA</text>
    <rect x={-90} y={-36} width={180} height={16} rx={8} fill="#d9d9e3" />
    {bar !== undefined && <rect x={-60} y={180 - bar} width={120} height={bar} rx={14} fill={c} stroke={INK} strokeWidth={7} />}
    {badge && (
      <g transform="translate(0 70)">
        <rect x={-110} y={-42} width={220} height={84} rx={42} fill={YEL} stroke={INK} strokeWidth={7} />
        <text textAnchor="middle" y={18} fontFamily={FONT} fontWeight={700} fontSize={54} fill={INK}>{badge}</text>
      </g>
    )}
  </g>
);
const T3=({f,y,text,c=YEL,w=640,d=0,s=56}:{f:number;y:number;text:string;c?:string;w?:number;d?:number;s?:number})=>(
  <g transform={`translate(540 ${y}) ${pop(f,d,1)}`}>
    <rect x={-w/2} y={-s*0.9} width={w} height={s*1.8} rx={s*0.9} fill={c} stroke={INK} strokeWidth={9} />
    <text textAnchor="middle" y={s*0.35} fontFamily={FONT} fontWeight={700} fontSize={s} fill={INK}>{text}</text>
  </g>
);
const MineS: React.FC<SP> = ({f}) => (
  <Svg>
    <g transform={`translate(380 500) ${pop(f, 0, 1.1)}`}><Person c={VIO} /></g>
    <g transform={`translate(720 520) rotate(-4) ${pop(f, 2, 1.0)}`}><Wallet /></g>
    <L1 f={f} d={2} y={930} text="TU AFORE MANEJA" c={CREAM} size={64} />
    <L1 f={f} d={6} y={1075} text="TU DINERO" c={INK} tc={YEL} size={86} rot={-3} />
  </Svg>
);
const NotItsS: React.FC<SP> = ({f}) => (
  <Svg>
    <g transform={`translate(540 520) ${pop(f, 0, 1.2)}`}>
      <Bank />
      <path d="M-150 -130 L150 150 M150 -130 L-150 150" stroke={RED} strokeWidth={30} strokeLinecap="round" opacity={cl((f - 6) / 5)} />
    </g>
    <L1 f={f} d={2} y={930} text="NO ES SUYO" c={INK} tc={YEL} size={86} rot={-3} />
    <L1 f={f} d={8} y={1075} text="ES TUYO" c={TEAL} tc={INK} size={74} />
  </Svg>
);
const NameS: React.FC<SP> = ({f}) => (
  <Svg>
    <g transform={`translate(540 270) ${pop(f, 0, 1)}`}><text textAnchor="middle" y={50} fontFamily={FONT} fontWeight={700} fontSize={140} fill={YEL}>AFORE</text></g>
    {['ADMINISTRADORA', 'DE FONDOS', 'PARA EL RETIRO'].map((w, i) => <T3 key={w} f={f} y={450 + i * 160} text={w} c={i === 2 ? YEL : CREAM} w={720} d={3 + i * 5} s={64} />)}
  </Svg>
);
const ThreeS: React.FC<SP> = ({f}) => (
  <Svg>
    {['GUARDA', 'ADMINISTRA', 'INVIERTE'].map((w, i) => <T3 key={w} f={f} y={380 + i * 180} text={w} c={[CREAM, YEL, TEAL][i]} w={640} d={2 + i * 6} s={78} />)}
    <L1 f={f} d={4} y={1000} text="TU AHORRO PARA PENSIONARTE" c={INK} tc={YEL} size={50} rot={-2} />
  </Svg>
);
const ContribS: React.FC<SP> = ({f}) => (
  <Svg>
    {[['TÚ', 220, CORAL], ['PATRÓN', 540, YEL], ['GOBIERNO', 860, TEAL]].map(([n, x, c]: any, i) => (
      <g key={n} transform={`translate(${x} ${420}) ${pop(f, 2 + i * 5, 0.95)}`}>
        <Person c={c} />
        <rect x={-110} y={110} width={220} height={70} rx={35} fill={CREAM} stroke={INK} strokeWidth={7} />
        <text textAnchor="middle" y={160} fontFamily={FONT} fontWeight={700} fontSize={n.length > 6 ? 34 : 44} fill={INK}>{n}</text>
        <g transform={`translate(0 ${240 + 14 * Math.sin(f / 4 + i)})`} opacity={cl((f - 8 - i * 5) / 5)}><Arrow c={CREAM} s={0.6} down /></g>
      </g>
    ))}
    <g transform={`translate(540 760) ${pop(f, 14, 0.7)}`}><Wallet /></g>
    <L1 f={f} d={2} y={1060} text="APORTAN TRES" c={INK} tc={YEL} size={76} rot={-3} />
  </Svg>
);
const AccountS: React.FC<SP> = ({f}) => (
  <Svg>
    <g transform={`translate(540 520) ${pop(f, 0, 1.15)}`}><Jar p={ease(f / 14)} /></g>
    <g transform={`translate(780 330) rotate(8) ${pop(f, 8)}`}><rect x={-130} y={-45} width={260} height={90} rx={45} fill={YEL} stroke={INK} strokeWidth={8} /><text textAnchor="middle" y={20} fontFamily={FONT} fontWeight={700} fontSize={50} fill={INK}>TUYA</text></g>
    <L1 f={f} d={2} y={960} text="CUENTA INDIVIDUAL" c={CREAM} size={62} />
    <L1 f={f} d={6} y={1100} text="SOLO TUYA" c={INK} tc={YEL} size={80} rot={-3} />
  </Svg>
);
const FollowS: React.FC<SP> = ({f, at}) => {
  const pulse = 1 + Math.sin(f / 4) * 0.05;
  return (
    <Svg>
      {[0, 1].map((i) => (
        <circle key={i} cx={540} cy={560} r={200 + ((f * 5 + i * 60) % 120)} fill="none" stroke={CREAM} strokeWidth={8} opacity={1 - ((f * 5 + i * 60) % 120) / 120} />
      ))}
      <g transform={`translate(540 560) scale(${sp(f, 0, 8, 200) * pulse})`}>
        <rect x={-300} y={-110} width={600} height={220} rx={110} fill={YEL} stroke={INK} strokeWidth={12} />
        <circle cx={-190} cy={0} r={58} fill={CORAL} stroke={INK} strokeWidth={8} />
        <path d="M-190 -28 L-190 28 M-218 0 L-162 0" stroke={CREAM} strokeWidth={14} strokeLinecap="round" />
        <text x={85} y={30} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={74} fill={INK}>SÍGUEME</text>
      </g>
      <L1 f={f} d={at(38) - 4} y={900} text="LO QUE CASI" c={INK} tc={YEL} size={64} rot={-3} />
      <L1 f={f} d={at(42) - 3} y={1040} text="NADIE REVISA" c={CREAM} size={60} />
    </Svg>
  );
};
const AgeS: React.FC<SP> = ({f}) => (
  <Svg>
    <g transform={`translate(540 560) ${pop(f, 0, 1.1)}`}><Dial ang={-60 + 100 * ease(f / 20)} /></g>
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${290 + i * 250} 300) scale(${0.45 + i * 0.1}) ${pop(f, 4 + i * 3)}`}><Person c={[TEAL, YEL, CORAL][i]} /></g>
    ))}
    <L1 f={f} d={2} y={960} text="SEGÚN TU EDAD" c={INK} tc={YEL} size={82} rot={-3} />
  </Svg>
);
const FeeS: React.FC<SP> = ({f}) => (
  <Svg>
    <g transform={`translate(380 520) ${pop(f, 0, 0.95)}`}><Bank /></g>
    <g transform={`translate(760 520) rotate(8) ${pop(f, 4, 1.1)}`}><Tag c={YEL} t="%" /></g>
    <L1 f={f} d={2} y={930} text="LA AFORE COBRA" c={CREAM} size={66} />
    <L1 f={f} d={3} y={1075} text="UNA COMISIÓN" c={INK} tc={YEL} size={80} rot={-3} />
  </Svg>
);
const at0 = (n: number) => n;
const MinusS: React.FC<SP> = ({f}) => {
  const a = ease(f / 12), b = ease((f - 8) / 12);
  return (
    <Svg>
      <g transform="translate(300 700)"><rect x={-90} y={-300 * a} width={180} height={300 * a} rx={14} fill={TEAL} stroke={INK} strokeWidth={8} /><text textAnchor="middle" y={50} fontFamily={FONT} fontWeight={700} fontSize={36} fill={CREAM}>RENDIMIENTO</text></g>
      <g transform="translate(540 540)" opacity={cl((f - 6) / 4)}><text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={110} fill={YEL}>−</text></g>
      <g transform="translate(780 700)"><rect x={-90} y={-90 * b} width={180} height={90 * b} rx={14} fill={CORAL} stroke={INK} strokeWidth={8} /><text textAnchor="middle" y={50} fontFamily={FONT} fontWeight={700} fontSize={36} fill={CREAM}>COMISIÓN</text></g>
      <L1 f={f} d={3} y={1000} text="LE RESTA A TU RENDIMIENTO" c={INK} tc={YEL} size={50} rot={-2} />
    </Svg>
  );
};
const CompareS: React.FC<SP> = ({f}) => (
  <Svg>
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${260 + i * 280} 560) ${pop(f, i * 3, 0.9)}`}>
        <rect x={-100} y={-170} width={200} height={340} rx={22} fill="#fff" stroke={INK} strokeWidth={8} />
        <text textAnchor="middle" y={-100} fontFamily={FONT} fontWeight={700} fontSize={44} fill={INK}>AFORE</text>
        <rect x={-60} y={20 - [60, 100, 40][i]} width={120} height={[60, 100, 40][i] + 100} rx={12} fill={[CORAL, YEL, TEAL][i]} stroke={INK} strokeWidth={6} />
      </g>
    ))}
    <g transform={`translate(${540 + Math.sin(f / 6) * 40} 340) rotate(-20) ${pop(f, 8)}`}>
      <circle r={70} fill="rgba(255,255,255,0.35)" stroke={INK} strokeWidth={11} />
      <path d="M50 50 L110 110" stroke={INK} strokeWidth={20} strokeLinecap="round" />
    </g>
    <L1 f={f} d={2} y={940} text="COMPARA COMISIONES" c={INK} tc={YEL} size={64} rot={-3} />
    <L1 f={f} d={9} y={1085} text="PÁGINA DE LA CONSAR" c={CREAM} size={56} />
  </Svg>
);
const SwitchS: React.FC<SP> = ({f}) => (
  <Svg>
    <g transform={`translate(270 520) scale(0.7) ${pop(f, 0, 1)}`}><Bank /></g>
    <g transform={`translate(810 520) scale(0.7) ${pop(f, 3, 1)}`}><Bank /></g>
    <g transform={`translate(540 ${520 + 10 * Math.sin(f / 4)}) ${pop(f, 5)}`}><Arrow c={YEL} s={0.9} /></g>
    <g transform={`translate(540 330) rotate(-8) ${pop(f, 7, 1.2)}`}><rect x={-170} y={-55} width={340} height={110} rx={55} fill={TEAL} stroke={INK} strokeWidth={9} /><text textAnchor="middle" y={26} fontFamily={FONT} fontWeight={700} fontSize={72} fill={INK}>GRATIS</text></g>
    <L1 f={f} d={2} y={950} text="CÁMBIATE DE AFORE" c={INK} tc={YEL} size={64} rot={-3} />
  </Svg>
);
const AppS: React.FC<SP> = ({f}) => (
  <Svg>
    <g transform={`translate(540 500) rotate(-4) ${pop(f, 0, 1.2)}`}>
      <rect x={-170} y={-290} width={340} height={580} rx={50} fill={INK} stroke={CREAM} strokeWidth={10} />
      <rect x={-140} y={-240} width={280} height={440} rx={26} fill={CREAM} />
      <circle cy={-130} r={60} fill={YEL} stroke={INK} strokeWidth={7} />
      <text textAnchor="middle" y={-108} fontFamily={FONT} fontWeight={700} fontSize={64} fill={INK}>A</text>
      {[0, 1, 2].map((i) => <rect key={i} x={-110} y={-40 + i * 60} width={i % 2 ? 160 : 220} height={22} rx={11} fill="#d9d9e3" />)}
    </g>
    <L1 f={f} d={2} y={960} text="AFORE MÓVIL" c={INK} tc={YEL} size={84} rot={-3} />
    <L1 f={f} d={8} y={1100} text="CUÁL TE ADMINISTRA" c={CREAM} size={54} />
  </Svg>
);
const NoticeS: React.FC<SP> = ({f}) => (
  <Svg>
    <g transform={`translate(540 520) rotate(-3) ${pop(f, 0, 1.2)}`}>
      <rect x={-230} y={-270} width={460} height={540} rx={26} fill="#fff" stroke={INK} strokeWidth={10} />
      <circle cx={0} cy={-150} r={70} fill={TEAL} stroke={INK} strokeWidth={8} />
      <text textAnchor="middle" y={-120} fontFamily={FONT} fontWeight={700} fontSize={100} fill={CREAM}>i</text>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={-170} y={-40 + i * 56} width={i % 2 ? 300 : 340} height={20} rx={10} fill="#d9d9e3" />
      ))}
    </g>
    <L1 f={f} d={3} y={960} text="INFORMACIÓN EDUCATIVA" c={YEL} size={52} />
  </Svg>
);
const Notice2S: React.FC<SP> = ({f}) => (
  <Svg>
    <g transform={`translate(540 520) ${pop(f, 0, 1.2)}`}>
      <circle r={190} fill={CREAM} stroke={INK} strokeWidth={12} />
      <path d="M-100 -100 L100 100 M100 -100 L-100 100" stroke={RED} strokeWidth={30} strokeLinecap="round" opacity={cl((f - 6) / 5)} />
      <text textAnchor="middle" y={30} fontFamily={FONT} fontWeight={700} fontSize={90} fill={INK} opacity={0.9}>$</text>
    </g>
    <L1 f={f} d={2} y={940} text="NO ES RECOMENDACIÓN" c={CREAM} size={52} />
    <L1 f={f} d={7} y={1060} text="DE INVERSIÓN" c={YEL} size={60} />
  </Svg>
);
const Final: React.FC<SP> = ({f, at}) => {
  const k = sp(f, at(92) - 3, 9, 200);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 380}}>
      <div style={{transform: `scale(${0.7 + 0.3 * sp(f, 0)})`, textAlign: 'center'}}>
        <Txt size={100}>SI TE</Txt>
        <Txt size={100} color={YEL}>SIRVIÓ</Txt>
      </div>
      <div style={{marginTop: 40, transform: `scale(${k}) rotate(-4deg)`, opacity: cl(k * 2)}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 96, color: INK, background: YEL, padding: '6px 44px 14px', borderRadius: 30, border: `10px solid ${CREAM}`}}>LIKE + SÍGUEME</div>
      </div>
      <div style={{position: 'absolute', bottom: 120, left: 70, right: 70, textAlign: 'center', fontFamily: FONT, fontWeight: 400, fontSize: 28, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4}}>
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
const FRAMES = [
  {z: 1, x: 0, y: 0, r: 0},
  {z: 1.06, x: 0, y: -18, r: -0.8},
  {z: 1.04, x: 14, y: 8, r: 0.6},
  {z: 1.08, x: -10, y: -10, r: 0},
];
export const Afore: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const si = Math.max(0, shots.findIndex((s) => t >= s.a && t < s.b));
  const shot = shots[si];
  const sf = F(shot.a);
  const lf = f - sf + (si === 0 ? 10 : 0); // 1.ª escena: ya viene armada en el primer fotograma
  const at = (i: number) => F(T(i)) - sf;
  const sd = F(shot.b - shot.a);
  const p: SP = {f: lf, at, d: sd};
  const fr = FRAMES[si % 4];
  const punch = 0.05 * Math.exp(-lf / 4);
  const drift = 1 + 0.025 * cl(lf / Math.max(1, sd));
  const camera = `translate(${fr.x}px, ${fr.y}px) rotate(${fr.r}deg) scale(${(fr.z + punch) * drift})`;
  const MAP: Record<string, React.FC<SP>> = {
    mine: MineS, notits: NotItsS, name: NameS, three: ThreeS, contrib: ContribS, account: AccountS, follow: FollowS,
    age: AgeS, fee: FeeS, minus: MinusS, compare: CompareS, switch: SwitchS, app: AppS, notice: NoticeS, notice2: Notice2S, final: Final,
  };
  const Comp = MAP[shot.k];
  const flash = lf < 3 && si !== 0 ? 0.3 * (1 - lf / 3) : 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Background f={f} t={t} />
      <AbsoluteFill style={{transform: camera, transformOrigin: '540px 760px'}}>
        <Comp {...p} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 42%, transparent 60%, rgba(0,0,0,0.35))'}} />
      {shot.k !== 'final' && (
        <div style={{position: 'absolute', top: 56, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 50, letterSpacing: 4, color: INK, background: CREAM, border: `6px solid ${INK}`, borderRadius: 50, padding: '6px 40px 12px'}}>LA AFORE</div>
        </div>
      )}
      {shot.k !== 'final' && <Captions t={t} f={f} />}
      <div style={{position: 'absolute', left: 0, top: 0, height: 10, width: W * cl(t / data.total), background: YEL}} />
      {flash > 0 && <AbsoluteFill style={{background: '#fff', opacity: flash}} />}
      <Audio src={staticFile('afore/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

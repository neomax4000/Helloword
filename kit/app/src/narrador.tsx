import React from 'react';
import {AbsoluteFill, Audio, random, spring, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/narrador/words.json';
import shotsRaw from '../public/narrador/shots.json';
import {FONT, FPS, H, W} from './theme';

/* ---------------- utilidades ---------------- */
export const F = (s: number) => Math.round(s * FPS);
export const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (t: number) => 1 - Math.pow(1 - cl(t), 3);
export const sp = (f: number, d = 0, damping = 12, stiffness = 160) =>
  spring({frame: f - d, fps: FPS, config: {damping, stiffness, mass: 0.7}});

type Word = {i: number; w: string; s: number; e: number};
const words = data.words as Word[];
const TS: Record<number, number> = {};
words.forEach((x) => (TS[x.i] = x.s));
const T = (i: number) => {
  for (let k = i; k < i + 5; k++) if (TS[k] !== undefined) return TS[k];
  return 0;
};

export const INK = '#0E1020';
export const CREAM = '#FFF4E0';
export const CORAL = '#FF6B57';
export const YEL = '#FFD23F';
export const TEAL = '#2EC4B6';
export const VIO = '#7B61FF';
export const PINK = '#FF5FA2';
export const RED = '#E63946';

type Shot = {w: number; k: string; a: number; b: number};
const shots: Shot[] = (shotsRaw as {w: number; k: string}[]).map((s, i, arr) => ({
  ...s,
  a: i === 0 ? 0 : T(s.w) - 0.08,
  b: i < arr.length - 1 ? T(arr[i + 1].w) - 0.08 : data.total + 1,
}));

/* cortes de encuadre dentro de cada plano */
const CUTZ = [5, 13, 23, 36, 59, 62, 69, 80, 83, 96, 107, 110, 118, 131, 142, 150, 166, 171, 182, 189, 204, 213, 227, 234, 243, 247, 262, 270, 283, 290, 298, 302];
const FRAMES = [
  {z: 1, x: 0, y: 0, r: 0},
  {z: 1.16, x: 0, y: -40, r: -1.2},
  {z: 1.08, x: 50, y: 20, r: 1},
  {z: 1.22, x: -30, y: -20, r: 0},
];

export const Txt: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({children, size, color = CREAM, style}) => (
  <div style={{fontFamily: FONT, fontWeight: 700, fontSize: size, color, lineHeight: 1.05, textAlign: 'center', textShadow: '0 6px 0 rgba(0,0,0,0.35)', ...style}}>{children}</div>
);

/* ---------------- iconos ---------------- */
export const Heart: React.FC<{c?: string; crack?: number}> = ({c = CORAL, crack = 0}) => (
  <g>
    <path d="M0 -30 C-40 -90 -125 -40 -70 35 L0 100 L70 35 C125 -40 40 -90 0 -30Z" fill={c} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <path d="M-60 -20 C-70 -40 -50 -55 -35 -48" stroke="#fff" strokeWidth={9} strokeLinecap="round" fill="none" opacity={0.6} />
    {crack > 0 && <path d="M0 -30 L-14 0 L12 22 L-8 52 L6 80" stroke={INK} strokeWidth={8} fill="none" strokeLinejoin="round" strokeDasharray={200} strokeDashoffset={200 * (1 - crack)} />}
  </g>
);
export const Coin: React.FC<{r?: number}> = ({r = 40}) => (
  <g>
    <circle r={r} fill={YEL} stroke="#8A5A00" strokeWidth={r * 0.1} />
    <text y={r * 0.33} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={r} fill="#9A6700">$</text>
  </g>
);
export const Chart: React.FC<{p?: number}> = ({p = 1}) => (
  <g>
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={-90 + i * 48} y={60 - (40 + i * 32) * p} width={34} height={(40 + i * 32) * p} rx={6} fill={[TEAL, TEAL, YEL, YEL][i]} stroke={INK} strokeWidth={6} />
    ))}
    <path d={`M-100 40 L-40 0 L10 20 L90 -80`} stroke={CORAL} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={300} strokeDashoffset={300 * (1 - p)} />
    <path d="M60 -84 L94 -84 L94 -50" stroke={CORAL} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={p > 0.9 ? 1 : 0} />
  </g>
);
export const Cross: React.FC = () => (
  <g>
    <rect x={-28} y={-80} width={56} height={160} rx={10} fill={RED} stroke={INK} strokeWidth={6} />
    <rect x={-80} y={-28} width={160} height={56} rx={10} fill={RED} stroke={INK} strokeWidth={6} />
  </g>
);
export const Globe: React.FC<{f?: number}> = ({f = 0}) => (
  <g>
    <circle r={85} fill={TEAL} stroke={INK} strokeWidth={7} />
    <ellipse rx={36 + 10 * Math.sin(f / 10)} ry={85} fill="none" stroke={INK} strokeWidth={5} />
    <line x1={-85} x2={85} y1={0} y2={0} stroke={INK} strokeWidth={5} />
    <path d="M-75 -40 Q0 -55 75 -40 M-75 40 Q0 55 75 40" stroke={INK} strokeWidth={5} fill="none" />
  </g>
);
const Tooth: React.FC = () => (
  <path d="M-50 -60 C-85 -60 -85 0 -62 30 C-52 60 -48 92 -30 92 C-14 92 -14 40 0 40 C14 40 14 92 30 92 C48 92 52 60 62 30 C85 0 85 -60 50 -60 C30 -60 20 -50 0 -50 C-20 -50 -30 -60 -50 -60Z" fill="#fff" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
);
const Note: React.FC<{c?: string}> = ({c = PINK}) => (
  <g>
    <path d="M-30 50 L-30 -60 L50 -80 L50 30" stroke={INK} strokeWidth={10} fill="none" strokeLinejoin="round" />
    <path d="M-30 -60 L50 -80 L50 -50 L-30 -30Z" fill={INK} />
    <ellipse cx={-48} cy={52} rx={26} ry={20} fill={c} stroke={INK} strokeWidth={7} />
    <ellipse cx={32} cy={32} rx={26} ry={20} fill={c} stroke={INK} strokeWidth={7} />
  </g>
);
const Palette: React.FC = () => (
  <g>
    <path d="M0 -85 C70 -85 100 -30 90 10 C80 50 40 30 30 55 C20 85 -10 90 -40 80 C-90 60 -100 0 -80 -40 C-65 -70 -35 -85 0 -85Z" fill="#F2D3A0" stroke={INK} strokeWidth={7} />
    {[[-45, -30, CORAL], [-5, -55, YEL], [40, -40, TEAL], [55, 0, VIO]].map(([x, y, c], i) => (
      <circle key={i} cx={x as number} cy={y as number} r={15} fill={c as string} stroke={INK} strokeWidth={4} />
    ))}
    <circle cx={-30} cy={35} r={14} fill={INK} opacity={0.25} />
  </g>
);
export const Qmark: React.FC<{c?: string}> = ({c = YEL}) => (
  <text textAnchor="middle" y={60} fontFamily={FONT} fontWeight={700} fontSize={180} fill={c} stroke={INK} strokeWidth={8} paintOrder="stroke">
    ?
  </text>
);

export const Card: React.FC<{label: string; c: string; children: React.ReactNode; w?: number; h?: number}> = ({label, c, children, w = 400, h = 430}) => (
  <g>
    <rect x={-w / 2} y={-h / 2 + 10} width={w} height={h} rx={36} fill="rgba(0,0,0,0.35)" />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={36} fill={c} stroke={INK} strokeWidth={8} />
    <g transform={`translate(0 ${-h * 0.1})`}>{children}</g>
    {label.includes(' ') && label.length > 14 ? (
      <text textAnchor="middle" y={h / 2 - 78} fontFamily={FONT} fontWeight={700} fontSize={34} fill={INK}>
        <tspan x={0}>{label.split(' ')[0]}</tspan>
        <tspan x={0} dy={40}>{label.split(' ').slice(1).join(' ')}</tspan>
      </text>
    ) : (
      <text textAnchor="middle" y={h / 2 - 46} fontFamily={FONT} fontWeight={700} fontSize={label.length > 10 ? 36 : 42} fill={INK}>
        {label}
      </text>
    )}
  </g>
);

export const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={W} height={1400} viewBox="0 0 1080 1400" style={{position: 'absolute', left: 0, top: 120, overflow: 'visible'}}>
    {children}
  </svg>
);
export const pop = (f: number, d: number, s = 1) => {
  const k = sp(f, d);
  return `scale(${k * s})`;
};

/* ---------------- escenas ---------------- */
type SP = {f: number; at: (i: number) => number; d: number};

const Feed: React.FC<SP> = ({f, at}) => {
  const scroll = (f * 4.2) % 520;
  const cols = [CORAL, TEAL, VIO, YEL, PINK, TEAL];
  return (
    <Svg>
      <g transform={`translate(540 700) ${pop(f, 0)}`}>
        <rect x={-260} y={-500} width={520} height={1000} rx={60} fill="#1B1E33" stroke={INK} strokeWidth={10} />
        <clipPath id="ph"><rect x={-240} y={-480} width={480} height={960} rx={44} /></clipPath>
        <g clipPath="url(#ph)">
          {cols.map((c, i) => {
            const y = -480 + i * 520 - scroll;
            return (
              <g key={i} transform={`translate(0 ${y})`}>
                <rect x={-240} y={0} width={480} height={500} fill={c} />
                <circle cx={0} cy={250} r={70} fill="rgba(255,255,255,0.85)" />
                <path d="M-22 215 L38 250 L-22 285Z" fill={INK} />
              </g>
            );
          })}
        </g>
        <g transform={`translate(170 340) ${pop(f, at(15), 1)}`}>
          <rect x={-90} y={-60} width={180} height={130} rx={18} fill="#8B5A2B" stroke={INK} strokeWidth={8} />
          <rect x={-40} y={-90} width={80} height={36} rx={10} fill="none" stroke={INK} strokeWidth={10} />
          <rect x={-90} y={-10} width={180} height={14} fill={INK} />
        </g>
      </g>
    </Svg>
  );
};

const HeartS: React.FC<SP> = ({f, at}) => {
  const beat = 1 + 0.06 * Math.max(0, Math.sin(f * 0.5)) + 0.25 * Math.exp(-Math.max(0, f - at(23)) / 6) * (f >= at(23) ? 1 : 0);
  return (
    <Svg>
      {Array.from({length: 10}, (_, i) => {
        const a = (i / 10) * Math.PI * 2 + f * 0.02;
        const r = 330 + 30 * Math.sin(f / 8 + i);
        const k = cl((f - at(23)) / 10);
        return <circle key={i} cx={540 + Math.cos(a) * r} cy={650 + Math.sin(a) * r} r={14 * k} fill={i % 2 ? YEL : PINK} />;
      })}
      <g transform={`translate(540 650) scale(${2.6 * beat * sp(f, 0)})`}>
        <Heart />
      </g>
    </Svg>
  );
};

const NotFin: React.FC<SP> = ({f, at}) => {
  const x = f >= at(37) ? -1200 * ease((f - at(37)) / 10) : 0;
  const st = sp(f, at(29), 9, 220);
  return (
    <Svg>
      <g transform={`translate(${540 + x} 650) rotate(${x / 40}) ${pop(f, 0)}`}>
        <Card label="FINANZAS" c={CREAM} w={560} h={600}>
          <g transform="scale(1.7)">
            <Chart />
          </g>
        </Card>
        <g transform={`scale(${(2 - st) * (f >= at(29) ? 1 : 0)}) rotate(-8)`} opacity={f >= at(29) ? 1 : 0}>
          <path d="M-230 -230 L230 230 M230 -230 L-230 230" stroke={RED} strokeWidth={60} strokeLinecap="round" />
        </g>
      </g>
      {f >= at(37) && (
        <g transform={`translate(540 650) ${pop(f, at(37) + 4)}`}>
          <Txt size={0}>{''}</Txt>
          <text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={92} fill={CREAM} stroke={INK} strokeWidth={10} paintOrder="stroke">
            OTRA LECCIÓN
          </text>
        </g>
      )}
    </Svg>
  );
};

export const Kinetic: React.FC<{f: number; lines: {t: string; at: number; c?: string; s?: number}[]; icon?: React.ReactNode}> = ({f, lines, icon}) => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 380}}>
    {icon}
    {lines.map((l, i) => {
      const k = sp(f, l.at, 11, 200);
      return (
        <div key={i} style={{transform: `translateY(${(1 - k) * 60}px) scale(${0.6 + 0.4 * k})`, opacity: cl(k * 1.5)}}>
          <Txt size={l.s || 120} color={l.c || CREAM}>
            {l.t}
          </Txt>
        </div>
      );
    })}
  </AbsoluteFill>
);

const Compass: React.FC<{f: number}> = ({f}) => (
  <svg width={260} height={260} viewBox="-130 -130 260 260" style={{marginBottom: 40}}>
    <circle r={110} fill={CREAM} stroke={INK} strokeWidth={10} />
    <g transform={`rotate(${Math.sin(f / 9) * 40 + f * 2})`}>
      <path d="M0 -90 L22 0 L-22 0Z" fill={CORAL} stroke={INK} strokeWidth={5} />
      <path d="M0 90 L22 0 L-22 0Z" fill="#9aa" stroke={INK} strokeWidth={5} />
    </g>
    <circle r={12} fill={INK} />
  </svg>
);

const Confess: React.FC<SP> = ({f}) => {
  const k = sp(f, 2, 8, 240);
  return (
    <Svg>
      <path d={`M540 -120 L${220 - 30 * Math.sin(f / 10)} 1100 L${860 + 30 * Math.sin(f / 10)} 1100Z`} fill="rgba(255,240,200,0.14)" />
      <g transform={`translate(540 640) rotate(-7) scale(${0.3 + 0.7 * k})`} opacity={cl(k * 2)}>
        <rect x={-420} y={-110} width={840} height={220} rx={26} fill="none" stroke={CORAL} strokeWidth={16} />
        <text textAnchor="middle" y={40} fontFamily={FONT} fontWeight={700} fontSize={120} fill={CORAL}>
          CONFESIÓN
        </text>
      </g>
    </Svg>
  );
};

const Uni: React.FC<SP> = ({f, at}) => {
  const sign = sp(f, at(62));
  return (
    <Svg>
      <g transform={`translate(540 760) ${pop(f, 0)}`}>
        <rect x={-380} y={60} width={760} height={60} fill="#C9B79C" stroke={INK} strokeWidth={8} />
        {[-300, -150, 0, 150, 300].map((x) => (
          <rect key={x} x={x - 30} y={-160} width={60} height={220} fill={CREAM} stroke={INK} strokeWidth={7} />
        ))}
        <rect x={-360} y={-200} width={720} height={44} fill="#C9B79C" stroke={INK} strokeWidth={8} />
        <path d="M-400 -200 L0 -390 L400 -200Z" fill={CORAL} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        <circle cx={0} cy={-270} r={40} fill={CREAM} stroke={INK} strokeWidth={6} />
      </g>
      <g transform={`translate(${540 + 300 * (1 - sign)} ${300 + 30 * Math.sin(f / 8)}) rotate(${-12 + 8 * Math.sin(f / 7)})`}>
        <path d="M-130 0 L0 -60 L130 0 L0 60Z" fill={INK} />
        <rect x={-70} y={10} width={140} height={60} rx={10} fill={INK} />
        <path d="M100 10 L100 100" stroke={YEL} strokeWidth={8} />
        <circle cx={100} cy={110} r={14} fill={YEL} />
      </g>
      <g transform={`translate(540 1050) scale(${sign})`}>
        <rect x={-240} y={-55} width={480} height={110} rx={20} fill={TEAL} stroke={INK} strokeWidth={8} />
        <text textAnchor="middle" y={22} fontFamily={FONT} fontWeight={700} fontSize={64} fill={INK}>FINANZAS</text>
      </g>
    </Svg>
  );
};

const Idea: React.FC<SP> = ({f, at}) => {
  const pos = [[540, 600, 2.6], [230, 330, 1.1], [850, 360, 1.3], [250, 1000, 1.0], [860, 980, 1.2], [540, 200, 0.8]];
  return (
    <Svg>
      {pos.map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${Math.sin(f / 6 + i) * 10}) ${pop(f, at(67) + i * 3 - (i === 0 ? at(67) : 0), s as number)}`}>
          <Qmark c={i % 2 ? CORAL : YEL} />
        </g>
      ))}
      {f > at(68) && (
        <g transform={`translate(540 980) ${pop(f, at(68))}`}>
          <rect x={-250} y={-70} width={500} height={120} rx={60} fill={CREAM} stroke={INK} strokeWidth={8} />
          <text textAnchor="middle" y={18} fontFamily={FONT} fontWeight={700} fontSize={66} fill={INK}>NI IDEA</text>
        </g>
      )}
    </Svg>
  );
};

const Grade: React.FC<SP> = ({f, at}) => {
  const fill = ease((f - at(80)) / 26);
  return (
    <Svg>
      <g transform={`translate(540 640) rotate(-3) ${pop(f, 0)}`}>
        <rect x={-330} y={-420} width={660} height={840} rx={30} fill={CREAM} stroke={INK} strokeWidth={10} />
        <text textAnchor="middle" y={-320} fontFamily={FONT} fontWeight={700} fontSize={64} fill={INK}>BOLETA</text>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={-260} y={-250 + i * 70} width={i % 2 ? 360 : 440} height={22} rx={11} fill="#d8cbb4" />
        ))}
        <text x={-260} y={110} fontFamily={FONT} fontWeight={700} fontSize={44} fill={INK}>PROMEDIO</text>
        <rect x={-260} y={150} width={520} height={70} rx={35} fill="#e6dccb" stroke={INK} strokeWidth={6} />
        <rect x={-254} y={156} width={508 * 0.95 * fill} height={58} rx={29} fill={TEAL} />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${-120 + i * 120} 320) ${pop(f, at(81) + 6 + i * 4, 1)}`}>
            <path d="M0 -50 L14 -16 L50 -14 L22 8 L32 44 L0 24 L-32 44 L-22 8 L-50 -14 L-14 -16Z" fill={YEL} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          </g>
        ))}
      </g>
    </Svg>
  );
};

const Think: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(540 560) ${pop(f, 0)}`}>
      <ellipse rx={400} ry={290} fill={CREAM} stroke={INK} strokeWidth={10} />
      <circle cx={-250} cy={360} r={50} fill={CREAM} stroke={INK} strokeWidth={8} />
      <circle cx={-320} cy={460} r={28} fill={CREAM} stroke={INK} strokeWidth={7} />
      <text textAnchor="middle" y={-60} fontFamily={FONT} fontWeight={700} fontSize={80} fill={INK}>¿Y AHORA</text>
      <text textAnchor="middle" y={50} fontFamily={FONT} fontWeight={700} fontSize={80} fill={INK}>QUÉ HAGO?</text>
      <g transform={`translate(0 150) ${pop(f, at(96))}`}>
        <rect x={-210} y={-40} width={420} height={80} rx={40} fill={YEL} stroke={INK} strokeWidth={6} />
        <text textAnchor="middle" y={18} fontFamily={FONT} fontWeight={700} fontSize={44} fill={INK}>PROMEDIO ALTO</text>
      </g>
    </g>
  </Svg>
);

const OPTS = [
  {k: 'med', label: 'MEDICINA', c: '#FFE1DC', x: 300, y: 430, w: 105},
  {k: 'neg', label: 'NEGOCIOS INTERNACIONALES', c: '#D6F5F1', x: 780, y: 430, w: 107},
  {k: 'fin', label: 'FINANZAS', c: '#FFF1BF', x: 300, y: 940, w: 109},
  {k: 'odo', label: 'ODONTOLOGÍA', c: '#E7E0FF', x: 780, y: 940, w: 110},
];
const OptIcon: React.FC<{k: string; f: number}> = ({k, f}) =>
  k === 'med' ? <Cross /> : k === 'neg' ? <Globe f={f} /> : k === 'fin' ? <Chart /> : <Tooth />;

const Options: React.FC<SP & {mode: 'show' | 'nope' | 'unknown' | 'aside'}> = ({f, at, mode}) => (
  <Svg>
    {OPTS.map((o, i) => {
      let tf = mode === 'show' ? pop(f, at(o.w) - 4, 0.92) : 'scale(0.92)';
      let op = 1;
      let tx = 0;
      let ty = 0;
      let rot = 0;
      let tint = 0;
      const bad = o.k === 'med' || o.k === 'odo';
      if (mode === 'nope' && bad) {
        const on = f >= at(o.k === 'odo' ? 116 : 118) - 2;
        tint = on ? 1 : 0;
        rot = on ? Math.sin(f * 1.4) * 5 : 0;
      }
      if (mode === 'nope' && !bad) op = 0.45;
      if (mode === 'unknown') {
        if (o.k !== 'fin') op = 0;
        else {
          const k = ease(f / 12);
          tx = (540 - o.x) * k;
          ty = (650 - o.y) * k;
          tf = `scale(${0.92 + 0.5 * k})`;
        }
      }
      return (
        <g key={o.k} transform={`translate(${o.x + tx} ${o.y + ty}) rotate(${rot}) ${tf}`} opacity={op}>
          <Card label={o.label} c={tint ? '#FFB3AA' : o.c} w={420} h={460}>
            <OptIcon k={o.k} f={f} />
          </Card>
          {tint > 0 && (
            <path d="M-150 -150 L150 150 M150 -150 L-150 150" stroke={RED} strokeWidth={34} strokeLinecap="round" opacity={0.85} transform={`scale(${sp(f, at(o.k === 'odo' ? 116 : 118))})`} />
          )}
        </g>
      );
    })}
    {mode === 'unknown' && (
      <>
        <g transform={`translate(540 220) rotate(${Math.sin(f / 5) * 10}) ${pop(f, at(140))}`}>
          <Qmark />
        </g>
        <g transform={`translate(540 1060) ${pop(f, at(142))}`}>
          <rect x={-290} y={-62} width={580} height={110} rx={55} fill={CORAL} stroke={INK} strokeWidth={8} />
          <text textAnchor="middle" y={16} fontFamily={FONT} fontWeight={700} fontSize={58} fill={CREAM}>NO SÉ NADA</text>
        </g>
      </>
    )}
  </Svg>
);

const Blood: React.FC<SP> = ({f, at}) => {
  const fall = ease(f / 14);
  const panic = f >= at(131);
  const sh = panic ? Math.sin(f * 2.2) * 10 : 0;
  return (
    <Svg>
      <g transform={`translate(${540 + sh} ${lerp(-200, 560, fall)}) scale(${panic ? 1.25 : 1})`}>
        <path d="M0 -230 C60 -120 170 0 170 90 C170 190 90 250 0 250 C-90 250 -170 190 -170 90 C-170 0 -60 -120 0 -230Z" fill={RED} stroke={INK} strokeWidth={10} />
        <path d="M-110 60 C-110 10 -80 -30 -60 -50" stroke="#fff" strokeWidth={14} strokeLinecap="round" fill="none" opacity={0.5} />
        <circle cx={-55} cy={90} r={26} fill="#fff" />
        <circle cx={55} cy={90} r={26} fill="#fff" />
        <circle cx={-55} cy={94} r={11} fill={INK} />
        <circle cx={55} cy={94} r={11} fill={INK} />
        <ellipse cx={0} cy={170} rx={30} ry={panic ? 34 : 14} fill={INK} />
      </g>
      {panic && (
        <g transform={`translate(540 1080) rotate(${-5 + sh / 3}) ${pop(f, at(131), 1)}`}>
          <text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={170} fill={YEL} stroke={INK} strokeWidth={14} paintOrder="stroke">
            ¡PAVOR!
          </text>
        </g>
      )}
    </Svg>
  );
};

const Paren: React.FC<SP & {fade?: boolean}> = ({f, at, fade}) => {
  const o = ease(f / 12);
  const gray = fade ? cl((f - at(171)) / 18) : 0;
  const crack = fade ? cl((f - at(171)) / 14) : 0;
  return (
    <Svg>
      {!fade && (
        <>
          <text x={540 - 420 * o} y={900} textAnchor="middle" fontFamily={FONT} fontWeight={300} fontSize={900} fill={VIO} opacity={0.8}>(</text>
          <text x={540 + 420 * o} y={900} textAnchor="middle" fontFamily={FONT} fontWeight={300} fontSize={900} fill={VIO} opacity={0.8}>)</text>
        </>
      )}
      <g style={{filter: `grayscale(${gray})`}}>
        <g transform={`translate(${fade ? 330 : 400} ${560 + Math.sin(f / 7) * 14}) rotate(${Math.sin(f / 9) * 8}) ${pop(f, fade ? 0 : at(147), fade ? 1.2 : 1.6)}`}>
          <Note />
        </g>
        <g transform={`translate(${fade ? 750 : 690} ${780 + Math.cos(f / 8) * 14}) rotate(${Math.cos(f / 10) * 8}) ${pop(f, fade ? 0 : at(152), fade ? 1.2 : 1.6)}`}>
          <Palette />
        </g>
        {fade && (
          <g transform={`translate(540 ${330}) scale(${1.3 * (1 - 0.25 * crack)}) ${pop(f, at(166))}`}>
            <Heart crack={crack} c={crack > 0 ? '#9a8f8f' : CORAL} />
          </g>
        )}
      </g>
      {fade && f >= at(173) && (
        <g transform={`translate(540 1080) ${pop(f, at(173))}`}>
          <text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={80} fill={CREAM} stroke={INK} strokeWidth={10} paintOrder="stroke">
            ¿Y SI DEJA DE GUSTARME?
          </text>
        </g>
      )}
    </Svg>
  );
};

const Aside: React.FC<SP> = ({f, at}) => {
  const out = ease((f - at(182)) / 14);
  const pick = sp(f, at(189));
  const cur = ease((f - at(188)) / 14);
  return (
    <Svg>
      <g transform={`translate(${330 - 700 * out} 520) rotate(${-out * 30}) scale(1.2)`}>
        <Note />
      </g>
      <g transform={`translate(${750 - 1100 * out} 560) rotate(${-out * 40}) scale(1.2)`}>
        <Palette />
      </g>
      {f >= at(186) && (
        <g transform={`translate(540 700) scale(${0.3 + 0.9 * pick}) rotate(${(1 - pick) * 20})`} opacity={cl(pick * 2)}>
          <Card label="FINANZAS" c="#FFF1BF" w={460} h={500}>
            <g transform="scale(1.3)">
              <Chart />
            </g>
          </Card>
          <g transform={`translate(${230 - 30 * cur} ${260 - 60 * cur})`}>
            <path d="M0 0 L0 110 L28 84 L50 130 L68 122 L46 78 L84 78Z" fill="#fff" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
          </g>
        </g>
      )}
      {f >= at(194) && (
        <g transform={`translate(860 300) rotate(${Math.sin(f / 5) * 10}) ${pop(f, at(194), 0.9)}`}>
          <Qmark />
        </g>
      )}
    </Svg>
  );
};

const World: React.FC<SP> = ({f, at}) => {
  const open = ease((f - at(201)) / 14);
  return (
    <Svg>
      <g transform="translate(540 680)">
        <rect x={-260} y={-420} width={520} height={840} rx={20} fill="#FFF7D6" />
        {open > 0 &&
          Array.from({length: 16}, (_, i) => {
            const a = (i / 16) * Math.PI * 2 + f * 0.01;
            return <path key={i} d={`M0 0 L${Math.cos(a) * 900} ${Math.sin(a) * 900} L${Math.cos(a + 0.12) * 900} ${Math.sin(a + 0.12) * 900}Z`} fill={YEL} opacity={0.18 * open} />;
          })}
        <g opacity={open}>
          <g transform={`translate(0 -40) scale(${1.4 * open})`}>
            <Globe f={f} />
          </g>
          {[0, 1, 2, 3, 4].map((i) => {
            const a = f * 0.05 + (i * Math.PI * 2) / 5;
            return (
              <g key={i} transform={`translate(${Math.cos(a) * 250} ${-40 + Math.sin(a) * 120})`}>
                {i % 2 ? <Coin r={36} /> : <g transform="scale(0.45)"><Chart /></g>}
              </g>
            );
          })}
        </g>
        <g transform={`translate(-260 0) scale(${1 - open * 0.92} 1)`}>
          <rect x={0} y={-420} width={520} height={840} rx={20} fill="#8B5A2B" stroke={INK} strokeWidth={10} />
          <circle cx={440} cy={20} r={22} fill={YEL} stroke={INK} strokeWidth={6} />
        </g>
        <rect x={-280} y={-440} width={560} height={880} rx={26} fill="none" stroke={INK} strokeWidth={22} />
      </g>
      {f >= at(207) && (
        <g transform={`translate(540 1230) ${pop(f, at(207))}`}>
          <text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={84} fill={YEL} stroke={INK} strokeWidth={10} paintOrder="stroke">FASCINANTE</text>
        </g>
      )}
    </Svg>
  );
};

const Magnet: React.FC<SP> = ({f, at}) => {
  const pull = ease((f - at(213)) / 22);
  const items = [[-380, -420], [380, -380], [-420, 300], [400, 340], [0, -560], [-200, 520], [230, 560]];
  return (
    <Svg>
      <g transform={`translate(540 700) ${pop(f, 0)}`}>
        <g transform={`rotate(${Math.sin(f / 6) * 6})`}>
          <path d="M-150 -40 L-150 60 A150 150 0 0 0 150 60 L150 -40 L70 -40 L70 60 A70 70 0 0 1 -70 60 L-70 -40Z" fill={RED} stroke={INK} strokeWidth={10} strokeLinejoin="round" />
          <rect x={-150} y={-110} width={80} height={70} fill="#ddd" stroke={INK} strokeWidth={10} />
          <rect x={70} y={-110} width={80} height={70} fill="#ddd" stroke={INK} strokeWidth={10} />
        </g>
        {items.map(([x, y], i) => {
          const p = cl(pull * 1.2 - i * 0.04);
          const ix = lerp(x, x * 0.38, p);
          const iy = lerp(y, y * 0.38 - 90, p);
          return (
            <g key={i} transform={`translate(${ix + Math.sin(f / 4 + i) * 6 * p} ${iy})`}>
              {i % 3 === 0 ? <Coin r={44} /> : i % 3 === 1 ? <g transform="scale(0.5)"><Chart /></g> : <g transform="scale(0.45)"><Globe f={f} /></g>}
            </g>
          );
        })}
      </g>
    </Svg>
  );
};

const Years: React.FC<SP> = ({f, at}) => {
  const n = Math.min(9, Math.floor(ease((f - at(224)) / 26) * 9));
  const heart = f >= at(234);
  return (
    <Svg>
      <g transform={`translate(540 560) ${pop(f, 0)}`}>
        <rect x={-260} y={-260} width={520} height={520} rx={40} fill={CREAM} stroke={INK} strokeWidth={10} />
        <rect x={-260} y={-260} width={520} height={130} rx={40} fill={CORAL} stroke={INK} strokeWidth={10} />
        <rect x={-150} y={-300} width={30} height={90} rx={15} fill={INK} />
        <rect x={120} y={-300} width={30} height={90} rx={15} fill={INK} />
        <text textAnchor="middle" y={160} fontFamily={FONT} fontWeight={700} fontSize={300} fill={INK}>{n}</text>
      </g>
      <g transform={`translate(540 1000) ${pop(f, at(226))}`}>
        <text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={110} fill={YEL} stroke={INK} strokeWidth={10} paintOrder="stroke">AÑOS</text>
      </g>
      {heart && (
        <g transform={`translate(840 300) scale(${1.1 * sp(f, at(234))}) rotate(12)`}>
          <Heart c={PINK} />
        </g>
      )}
    </Svg>
  );
};

const CrossRoad: React.FC<SP> = ({f, at}) => (
  <Svg>
    <g transform={`translate(540 760) ${pop(f, 0)}`}>
      <rect x={-20} y={-300} width={40} height={620} fill="#8B5A2B" stroke={INK} strokeWidth={8} />
      <g transform={`rotate(${-6 + Math.sin(f / 8) * 3})`}>
        <path d="M-20 -260 L330 -260 L390 -200 L330 -140 L-20 -140Z" fill={TEAL} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        <text x={170} y={-180} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill={INK}>INDECISO</text>
      </g>
      <g transform={`rotate(${5 + Math.cos(f / 8) * 3}) ${pop(f, at(254) - 2)}`}>
        <path d="M20 -90 L-330 -90 L-390 -30 L-330 30 L20 30Z" fill={PINK} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        <text x={-170} y={-12} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill={INK}>INDECISA</text>
      </g>
    </g>
  </Svg>
);

const Box: React.FC<SP> = ({f, at}) => {
  const open = ease((f - at(270)) / 14);
  return (
    <Svg>
      <g transform={`translate(540 760) ${pop(f, 0)} rotate(${open < 0.01 ? Math.sin(f * 0.9) * (f > at(267) ? 4 : 1.5) : 0})`}>
        {open > 0 &&
          Array.from({length: 12}, (_, i) => {
            const a = -Math.PI / 2 + (i - 5.5) * 0.22;
            const r = 200 + 360 * open;
            return (
              <g key={i} transform={`translate(${Math.cos(a) * r} ${-120 + Math.sin(a) * r}) scale(${open})`}>
                <path d="M0 -30 L9 -9 L30 0 L9 9 L0 30 L-9 9 L-30 0 L-9 -9Z" fill={i % 2 ? YEL : CREAM} />
              </g>
            );
          })}
        <rect x={-260} y={-120} width={520} height={360} rx={20} fill={VIO} stroke={INK} strokeWidth={10} />
        <rect x={-30} y={-120} width={60} height={360} fill={YEL} stroke={INK} strokeWidth={6} />
        <g transform={`translate(-280 -120) rotate(${-open * 35})`}>
          <rect x={0} y={-80} width={560} height={90} rx={14} fill="#9B85FF" stroke={INK} strokeWidth={10} />
        </g>
        {open < 0.3 && (
          <g transform="translate(0 70)">
            <Qmark c={CREAM} />
          </g>
        )}
        {open > 0 && (
          <g transform={`translate(0 ${-200 - 160 * open}) scale(${1.3 * open})`}>
            <Heart c={YEL} />
          </g>
        )}
      </g>
      {f >= at(272) && (
        <g transform={`translate(540 1230) ${pop(f, at(272))}`}>
          <text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={84} fill={YEL} stroke={INK} strokeWidth={10} paintOrder="stroke">NUEVO GUSTO</text>
        </g>
      )}
    </Svg>
  );
};

const Plus: React.FC<SP> = ({f, at}) => {
  const m = ease((f - at(280)) / 16);
  const plus = sp(f, at(290), 8, 220);
  return (
    <Svg>
      <g transform={`translate(${lerp(260, 380, m)} 640) scale(1.5)`}>
        <Note />
      </g>
      <g transform={`translate(${lerp(820, 700, m)} 640) scale(1.4)`}>
        <Chart />
      </g>
      <g transform={`translate(540 640) scale(${0.4 + 0.8 * m})`} opacity={m}>
        <rect x={-22} y={-80} width={44} height={160} rx={12} fill={YEL} stroke={INK} strokeWidth={6} />
        <rect x={-80} y={-22} width={160} height={44} rx={12} fill={YEL} stroke={INK} strokeWidth={6} />
      </g>
      {f >= at(290) && (
        <g transform={`translate(540 1060) rotate(-4) scale(${plus})`}>
          <rect x={-300} y={-80} width={600} height={140} rx={30} fill={CORAL} stroke={INK} strokeWidth={10} />
          <text textAnchor="middle" y={30} fontFamily={FONT} fontWeight={700} fontSize={90} fill={CREAM}>¡ES UN PLUS!</text>
        </g>
      )}
    </Svg>
  );
};

const Comments: React.FC<SP> = ({f, at}) => {
  const bubbles = [
    {x: 300, y: 380, c: TEAL, d: at(298)},
    {x: 760, y: 520, c: PINK, d: at(298) + 8},
    {x: 340, y: 700, c: YEL, d: at(298) + 16},
    {x: 740, y: 860, c: VIO, d: at(298) + 24},
  ];
  const endK = sp(f, at(302), 10, 180);
  return (
    <Svg>
      {f < at(298) && (
        <g transform={`translate(540 640) ${pop(f, 0)}`}>
          <text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={96} fill={CREAM} stroke={INK} strokeWidth={10} paintOrder="stroke">MI EXPERIENCIA</text>
        </g>
      )}
      {bubbles.map((b, i) =>
        f >= b.d ? (
          <g key={i} transform={`translate(${b.x} ${b.y + Math.sin(f / 9 + i) * 8}) ${pop(f, b.d, 1)}`}>
            <rect x={-200} y={-70} width={400} height={140} rx={40} fill={b.c} stroke={INK} strokeWidth={8} />
            <path d="M-120 66 L-150 120 L-70 66Z" fill={b.c} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
            <rect x={-150} y={-30} width={260 - i * 30} height={22} rx={11} fill="rgba(14,16,32,0.55)" />
            <rect x={-150} y={10} width={180 + i * 20} height={22} rx={11} fill="rgba(14,16,32,0.35)" />
          </g>
        ) : null,
      )}
      {f >= at(302) && (
        <g transform={`translate(540 1110) scale(${endK})`}>
          <rect x={-460} y={-110} width={920} height={200} rx={36} fill={CREAM} stroke={INK} strokeWidth={10} />
          <text textAnchor="middle" y={-20} fontFamily={FONT} fontWeight={700} fontSize={60} fill={INK}>¿CÓMO ESCOGISTE</text>
          <text textAnchor="middle" y={55} fontFamily={FONT} fontWeight={700} fontSize={60} fill={CORAL}>TU CARRERA?</text>
        </g>
      )}
    </Svg>
  );
};

/* ---------------- subtítulos karaoke ---------------- */
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

const KEYS = new Set([23, 25, 36, 43, 47, 53, 59, 64, 69, 81, 96, 105, 108, 109, 110, 127, 130, 131, 134, 139, 143, 150, 154, 173, 186, 189, 197, 205, 207, 213, 226, 227, 236, 250, 255, 253, 273, 276, 280, 290, 297, 301, 307]);

const Captions: React.FC<{t: number; f: number}> = ({t, f}) => {
  const g = groups.find((x) => t >= x.a && t < x.b);
  if (!g) return null;
  const k = sp(f, F(g.a), 12, 260);
  return (
    <div style={{position: 'absolute', left: 50, right: 50, top: 1460, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 22px', transform: `scale(${0.85 + 0.15 * k})`, opacity: cl(k * 2)}}>
      {g.ws.map((w) => {
        const on = t >= w.s - 0.03 && t < w.e + 0.08;
        const key = KEYS.has(w.i);
        return (
          <span
            key={w.i}
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 84,
              lineHeight: 1.15,
              color: on ? INK : key ? YEL : '#fff',
              background: on ? YEL : 'transparent',
              borderRadius: 18,
              padding: '0 12px',
              textShadow: on ? 'none' : '0 5px 0 rgba(0,0,0,0.6), 0 0 18px rgba(0,0,0,0.5)',
              transform: on ? 'scale(1.06)' : 'none',
              display: 'inline-block',
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

/* ---------------- fondo ---------------- */
const BG: Record<string, [string, string]> = {
  feed: ['#22264A', '#0E1020'], heart: ['#4A1E3A', '#140A16'], notfin: ['#1E3A4A', '#0B1620'], title1: ['#3A2A6A', '#120E26'],
  confess: ['#1A1A1F', '#050507'], uni: ['#1F3D5C', '#0C1726'], idea: ['#3A2A6A', '#120E26'], grade: ['#1E4A44', '#0A1A18'],
  think: ['#4A3A1E', '#16100A'], options: ['#22264A', '#0E1020'], nope: ['#4A1E1E', '#160A0A'], blood: ['#2A0E14', '#0A0306'],
  unknown: ['#1A1A1F', '#050507'], paren: ['#2A1E4A', '#0E0A1A'], fade: ['#2A2A33', '#0E0E12'], aside: ['#22264A', '#0E1020'],
  world: ['#5A3A0E', '#1A0E04'], magnet: ['#1E3A4A', '#0B1620'], years: ['#4A1E3A', '#140A16'], title2: ['#1E4A44', '#0A1A18'],
  cross: ['#1F3D5C', '#0C1726'], box: ['#2A1E4A', '#0E0A1A'], plus: ['#4A3A1E', '#16100A'], comments: ['#22264A', '#0E1020'],
};

const Background: React.FC<{k: string; f: number}> = ({k, f}) => {
  const [c1, c2] = BG[k] || BG.feed;
  const dots = React.useMemo(() => Array.from({length: 18}, (_, i) => ({x: random('nx' + i) * W, y: random('ny' + i) * H, r: 3 + random('nr' + i) * 5, s: 0.3 + random('ns' + i)})), []);
  return (
    <AbsoluteFill style={{background: `radial-gradient(1100px 1100px at ${540 + Math.sin(f / 60) * 120}px ${700 + Math.cos(f / 70) * 100}px, ${c1}, ${c2} 70%)`}}>
      {dots.map((d, i) => (
        <div key={i} style={{position: 'absolute', left: d.x, top: (((d.y - f * d.s) % H) + H) % H, width: d.r, height: d.r, borderRadius: '50%', background: '#fff', opacity: 0.12}} />
      ))}
    </AbsoluteFill>
  );
};

/* ---------------- composición ---------------- */
export const Narrador: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const shot = shots.find((s) => t >= s.a && t < s.b) || shots[shots.length - 1];
  const sf = F(shot.a);
  const lf = f - sf;
  const at = (i: number) => F(T(i)) - sf;
  const sd = F(shot.b - shot.a);
  const p: SP = {f: lf, at, d: sd};

  // encuadre: cambia en cada palabra de CUTZ dentro del plano
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

  let body: React.ReactNode = null;
  switch (shot.k) {
    case 'feed': body = <Feed {...p} />; break;
    case 'heart': body = <HeartS {...p} />; break;
    case 'notfin': body = <NotFin {...p} />; break;
    case 'title1':
      body = <Kinetic f={lf} icon={<Compass f={lf} />} lines={[{t: 'ENCONTRAR', at: at(43) - 3, s: 120}, {t: 'LO QUE TE GUSTA', at: at(44) - 3, c: YEL, s: 104}, {t: 'HACER', at: at(48) - 3, s: 120}]} />;
      break;
    case 'confess': body = <Confess {...p} />; break;
    case 'uni': body = <Uni {...p} />; break;
    case 'idea': body = <Idea {...p} />; break;
    case 'grade': body = <Grade {...p} />; break;
    case 'think': body = <Think {...p} />; break;
    case 'options': body = <Options {...p} mode="show" />; break;
    case 'nope': body = <Options {...p} mode="nope" />; break;
    case 'blood': body = <Blood {...p} />; break;
    case 'unknown': body = <Options {...p} mode="unknown" />; break;
    case 'paren': body = <Paren {...p} />; break;
    case 'fade': body = <Paren {...p} fade />; break;
    case 'aside': body = <Aside {...p} />; break;
    case 'world': body = <World {...p} />; break;
    case 'magnet': body = <Magnet {...p} />; break;
    case 'years': body = <Years {...p} />; break;
    case 'title2':
      body = <Kinetic f={lf} lines={[{t: '¿Y SI NO', at: 0, s: 110}, {t: 'ESTUDIAS', at: at(243) - 3, s: 110}, {t: 'LO QUE YA', at: at(246) - 3, s: 110}, {t: 'TE GUSTA?', at: at(249) - 3, c: YEL, s: 120}]} />;
      break;
    case 'cross': body = <CrossRoad {...p} />; break;
    case 'box': body = <Box {...p} />; break;
    case 'plus': body = <Plus {...p} />; break;
    case 'comments': body = <Comments {...p} />; break;
  }
  const flash = lf < 3 && shot.w !== 0 ? 0.35 * (1 - lf / 3) : 0;
  const prog = cl(t / data.total);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Background k={shot.k} f={f} />
      <AbsoluteFill style={{transform: camera, transformOrigin: '540px 760px'}}>{body}</AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 42%, transparent 58%, rgba(0,0,0,0.45))'}} />
      <Captions t={t} f={f} />
      <div style={{position: 'absolute', left: 0, top: 0, height: 10, width: W * prog, background: YEL}} />
      {flash > 0 && <AbsoluteFill style={{background: '#fff', opacity: flash}} />}
      <Audio src={staticFile('narrador/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

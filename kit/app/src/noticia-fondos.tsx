import React from 'react';
import {AbsoluteFill} from 'remotion';

/* Fondos de NOTICIA (protocolo §0): imagen del tema dibujada en código, grande y tenue, bajo una capa oscura.
   Un motivo por bloque; cambia con el bloque. Uso: <TopicBg kind="inbox" f={frame} c1="#2A0F18" /> */
export type Motif = 'inbox' | 'servers' | 'phone' | 'alert' | 'search' | 'chart' | 'plain';
const BLU = '#4DA3FF', RED = '#FF4D4F', GRN = '#38D39F', AMB = '#FFB020';

const Inbox: React.FC<{f: number}> = ({f}) => (
  <g>
    {Array.from({length: 24}, (_, i) => {
      const c = i % 4, r = Math.floor(i / 4);
      const bad = (i * 7) % 5 === 0;
      return (
        <g key={i} transform={`translate(${130 + c * 270} ${230 + r * 300 + ((f * 0.4 + c * 20) % 24) - 12})`}>
          <rect x={-100} y={-66} width={200} height={132} rx={16} fill="none" stroke={bad ? RED : BLU} strokeWidth={7} />
          <path d="M-96 -60 L0 8 L96 -60" fill="none" stroke={bad ? RED : BLU} strokeWidth={7} strokeLinejoin="round" />
          {bad && <path d="M-26 -26 L26 26 M26 -26 L-26 26" stroke={RED} strokeWidth={12} strokeLinecap="round" />}
        </g>
      );
    })}
  </g>
);
const Servers: React.FC<{f: number}> = ({f}) => (
  <g>
    {Array.from({length: 7}, (_, r) => (
      <g key={r} transform={`translate(110 ${200 + r * 250})`}>
        <rect width={860} height={190} rx={22} fill="none" stroke={(r * 3) % 4 === 0 ? RED : BLU} strokeWidth={8} />
        {[0, 1, 2].map((i) => <rect key={i} x={40} y={34 + i * 50} width={520} height={20} rx={10} fill={(r * 3) % 4 === 0 ? RED : BLU} opacity={(r * 3) % 4 === 0 ? 0.35 : 0.4 + 0.6 * Math.abs(Math.sin((f + r * 11 + i * 7) / 9))} />)}
        <circle cx={770} cy={95} r={24} fill={(r * 3) % 4 === 0 ? RED : GRN} opacity={(r * 3) % 4 === 0 ? 0.9 : 0.4 + 0.6 * Math.abs(Math.sin((f + r * 5) / 6))} />
      </g>
    ))}
  </g>
);
const Phone: React.FC<{f: number}> = ({f}) => (
  <g transform="translate(540 960)">
    <rect x={-300} y={-720} width={600} height={1240} rx={80} fill="none" stroke={GRN} strokeWidth={12} />
    <rect x={-240} y={-620} width={480} height={70} rx={20} fill={GRN} opacity={0.5} />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={-240} y={-480 + i * 120} width={i % 2 ? 340 : 480} height={36} rx={18} fill={BLU} opacity={0.5} />)}
    <circle cy={140} r={170 + 6 * Math.sin(f / 12)} fill="none" stroke={GRN} strokeWidth={14} />
    <path d="M-80 140 L-20 205 L100 80" stroke={GRN} strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);
const Alert: React.FC<{f: number}> = ({f}) => (
  <g transform="translate(540 940)">
    <path d="M0 -560 L560 400 L-560 400Z" fill="none" stroke={AMB} strokeWidth={14} strokeLinejoin="round" opacity={0.9} />
    <rect x={-22} y={-300} width={44} height={380} rx={22} fill={AMB} />
    <circle cy={190} r={32 + 3 * Math.sin(f / 8)} fill={AMB} />
    <g transform="translate(-460 560)" opacity={0.8}><rect x={-120} y={-80} width={240} height={160} rx={18} fill="none" stroke={AMB} strokeWidth={8} /><path d="M-114 -72 L0 12 L114 -72" fill="none" stroke={AMB} strokeWidth={8} /></g>
    <g transform="translate(470 620)" opacity={0.8}><rect x={-120} y={-80} width={240} height={160} rx={18} fill="none" stroke={AMB} strokeWidth={8} /><path d="M-114 -72 L0 12 L114 -72" fill="none" stroke={AMB} strokeWidth={8} /></g>
  </g>
);
const Search: React.FC<{f: number}> = ({f}) => (
  <g transform={`translate(${520 + 14 * Math.sin(f / 30)} 860)`}>
    <circle r={330} fill="none" stroke={BLU} strokeWidth={22} />
    <path d="M235 235 L560 560" stroke={BLU} strokeWidth={46} strokeLinecap="round" />
    <path d="M-150 20 L-40 -90 L40 -10 L170 -140" stroke={AMB} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);
const Chart: React.FC<{f: number}> = ({f}) => (
  <g transform="translate(110 1560)">
    {[0.35, 0.55, 0.42, 0.7, 0.5, 0.85, 0.65].map((h, i) => <rect key={i} x={i * 128} y={-1100 * h} width={92} height={1100 * h} rx={14} fill={i % 3 === 2 ? RED : BLU} opacity={0.7} />)}
    <path d="M0 -600 L220 -760 L400 -480 L640 -920 L860 -700" stroke={AMB} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);
export const TopicBg: React.FC<{kind: Motif; f: number; c1: string; c2?: string; dim?: number}> = ({kind, f, c1, c2 = '#0B1020', dim = 0.5}) => (
  <AbsoluteFill style={{background: `radial-gradient(1300px 1300px at 50% 30%, ${c1}, ${c2} 70%)`}}>
    {kind !== 'plain' && (
      <svg width={1080} height={1920} style={{position: 'absolute', opacity: 0.28}}>
        {kind === 'inbox' && <Inbox f={f} />}
        {kind === 'servers' && <Servers f={f} />}
        {kind === 'phone' && <Phone f={f} />}
        {kind === 'alert' && <Alert f={f} />}
        {kind === 'search' && <Search f={f} />}
        {kind === 'chart' && <Chart f={f} />}
      </svg>
    )}
    <AbsoluteFill style={{background: `rgba(5,8,18,${dim})`}} />
  </AbsoluteFill>
);

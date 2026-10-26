import React from 'react';
import {AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';

const NAVY = '#041E42', NAVY2 = '#0A2D5E', OCRE = '#B3A369', WARM = '#F5F3EE';
export const COVER_FRAMES = 45;

export type CoverProps = {
  tag: string; light: string; bold: string; sub: string; logo?: boolean; icon: 'chart' | 'phone' | 'coins' | 'path' | 'shield' | 'basket';
  pal?: {bg1: string; bg2: string; acc: string; tagText: string};
};

const Icon: React.FC<{k: CoverProps['icon']; t: number; acc?: string}> = ({k, t, acc = OCRE}) => {
  const s = {stroke: acc, strokeWidth: 10, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  const dash = (len: number) => ({strokeDasharray: len, strokeDashoffset: len * (1 - t)});
  return (
    <svg width={420} height={420} viewBox="0 0 200 200">
      <circle cx={100} cy={100} r={92} {...s} strokeWidth={3} opacity={0.35} />
      {k === 'chart' && <><path d="M30 150 L70 105 L100 125 L165 50" {...s} {...dash(260)} /><path d="M140 50 H165 V75" {...s} /></>}
      {k === 'phone' && <><rect x={65} y={30} width={70} height={140} rx={14} {...s} {...dash(420)} /><circle cx={100} cy={150} r={5} fill={OCRE} /><path d="M82 82 l14 14 l24 -28" {...s} /></>}
      {k === 'coins' && <><ellipse cx={100} cy={70} rx={48} ry={16} {...s} /><path d="M52 70 V105 C52 114 74 121 100 121 C126 121 148 114 148 105 V70" {...s} {...dash(260)} /><path d="M52 105 V140 C52 149 74 156 100 156 C126 156 148 149 148 140 V105" {...s} {...dash(260)} /></>}
      {k === 'shield' && <><path d="M100 30 L160 52 V100 C160 140 132 162 100 175 C68 162 40 140 40 100 V52 Z" {...s} {...dash(420)} /><path d="M75 102 l18 18 l34 -38" {...s} /></>}
      {k === 'basket' && <><path d="M55 95 C55 45 145 45 145 95" {...s} {...dash(200)} /><path d="M40 95 H160 L148 160 H52 Z" {...s} /><circle cx={80} cy={80} r={9} fill={acc} /><circle cx={115} cy={76} r={9} fill={acc} /></>}
      {k === 'path' && <><path d="M40 160 C60 100 90 150 110 100 S150 60 165 40" {...s} {...dash(300)} /><circle cx={165} cy={40} r={9} fill={OCRE} /></>}
    </svg>
  );
};

export const Cover: React.FC<CoverProps> = (p) => {
  const f = useCurrentFrame();
  const t = Math.min(1, f / 18);
  const out = interpolate(f, [COVER_FRAMES - 8, COVER_FRAMES], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const zoom = 1 + f * 0.0009;
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 38%, ${p.pal?.bg2 ?? NAVY2} 0%, ${p.pal?.bg1 ?? NAVY} 70%)`, fontFamily: 'Poppins', transform: `translateY(${-out * 1920}px)`}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{position: 'absolute', left: 90 + i * 300, top: 0, width: 2, height: 1920, background: 'rgba(255,255,255,0.05)'}} />
        ))}
        <div style={{position: 'absolute', top: 150, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <div style={{background: p.pal?.acc ?? OCRE, color: p.pal?.tagText ?? NAVY, fontWeight: 700, fontSize: 40, letterSpacing: 8, padding: '18px 44px', borderRadius: 60}}>{p.tag}</div>
        </div>
        <div style={{position: 'absolute', top: 360, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}><Icon k={p.icon} t={t} acc={p.pal?.acc} /></div>
        <div style={{position: 'absolute', top: 850, left: 110, right: 90, display: 'flex', gap: 36}}>
          <div style={{width: 8, background: p.pal?.acc ?? OCRE, height: 120 + t * 330, borderRadius: 4}} />
          <div style={{color: WARM, textTransform: 'uppercase', lineHeight: 1.08}}>
            <div style={{fontWeight: 300, fontSize: 96}}>{p.light}</div>
            <div style={{fontWeight: 700, fontSize: 126, color: '#fff'}}>{p.bold}</div>
            <div style={{fontWeight: 400, fontSize: 44, color: p.pal?.acc ?? OCRE, marginTop: 30, textTransform: 'none', letterSpacing: 1}}>{p.sub}</div>
          </div>
        </div>
        {p.logo !== false && <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', bottom: 150, left: 0, right: 0, margin: '0 auto', width: 360}} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const WithCover: React.FC<{cover: CoverProps; children: React.ReactNode}> = ({cover, children}) => (
  <AbsoluteFill style={{background: NAVY}}>
    <Sequence from={COVER_FRAMES}>{children}</Sequence>
    <Sequence durationInFrames={COVER_FRAMES}><Cover {...cover} /></Sequence>
  </AbsoluteFill>
);

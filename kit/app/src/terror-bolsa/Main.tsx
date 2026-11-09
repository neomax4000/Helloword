import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, continueRender, delayRender, interpolate, random} from 'remotion';
import {C, F} from './ui';
import * as X from './scenes';
import wordsRaw from './words.json';

const FPS = 30;
export const COVER = 45;
export const AUDIO_DUR = 161.6;

const fontFaces = `
@font-face{font-family:Oswald;font-weight:400;src:url(${staticFile('oswald-latin-400-normal.woff2')})}
@font-face{font-family:Oswald;font-weight:700;src:url(${staticFile('oswald-latin-700-normal.woff2')})}
@font-face{font-family:"Special Elite";font-weight:400;src:url(${staticFile('special-elite-latin-400-normal.woff2')})}
@font-face{font-family:Poppins;font-weight:400;src:url(${staticFile('poppins-latin-400-normal.woff2')})}
@font-face{font-family:Poppins;font-weight:600;src:url(${staticFile('poppins-latin-600-normal.woff2')})}`;

const useFonts = () => {
  const [h] = React.useState(() => delayRender('fonts'));
  React.useEffect(() => {
    Promise.all(['700 40px Oswald', '400 40px Oswald', '400 40px "Special Elite"', '400 40px Poppins', '600 40px Poppins'].map((x) => document.fonts.load(x))).then(() => continueRender(h));
  }, [h]);
};

// [start s, componente, tema de fondo]
export const SCENES: [number, React.FC<{dur: number}>, number][] = [
  [0, X.A, 0], [5.85, X.B, 0], [14.76, X.Cc, 4], [18.28, X.D, 4], [21.31, X.D2, 3], [25.89, X.E1, 3],
  [32.52, X.E2, 1], [37.93, X.Fp, 1], [45.29, X.G, 3], [55.03, X.H, 3], [58.53, X.I, 0], [64.83, X.J, 0],
  [76.51, X.K, 3], [85.9, X.L, 3], [93.48, X.M, 3], [101.54, X.N, 4], [112.27, X.O, 4], [122.7, X.Pp, 2],
  [130.97, X.Q, 2], [139.16, X.R, 0], [149.1, X.Sx, 0],
];

const THEMES = [
  'radial-gradient(circle at 50% 38%, #2a0606 0%, #0d0303 58%, #040101 100%)',
  'radial-gradient(circle at 50% 30%, #06301a 0%, #03140a 58%, #010603 100%)',
  'radial-gradient(circle at 40% 30%, #0c1834 0%, #060a17 58%, #02040a 100%)',
  'radial-gradient(circle at 50% 35%, #2e2417 0%, #130f0a 58%, #060504 100%)',
  'radial-gradient(circle at 50% 50%, #3d0a13 0%, #170308 58%, #070103 100%)',
];

const Backgrounds: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  let idx = 0;
  for (let i = 0; i < SCENES.length; i++) if (t >= SCENES[i][0]) idx = i;
  const theme = SCENES[idx][2];
  let rs = idx;
  while (rs > 0 && SCENES[rs - 1][2] === theme) rs--;
  const prev = rs > 0 ? SCENES[rs - 1][2] : theme;
  const local = f - SCENES[rs][0] * FPS;
  const r = interpolate(local, [0, 16], [0, 160], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: THEMES[prev]}} />
      <AbsoluteFill style={{background: THEMES[theme], clipPath: `circle(${rs === 0 ? 160 : r}% at 50% 50%)`}} />
      {(theme === 1 || theme === 2) && <AbsoluteFill style={{opacity: 0.18, backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.9) 0px, rgba(0,0,0,0.9) 2px, transparent 2px, transparent 5px)'}} />}
    </AbsoluteFill>
  );
};

// grano de película + viñeta + parpadeo + latido en la apertura
const FilmLook: React.FC = () => {
  const f = useCurrentFrame();
  const flick = 0.92 + random(`fl${f}`) * 0.08;
  const t = f / FPS;
  const beat = t < 26 ? Math.max(0, Math.sin(((t % 1.15) / 1.15) * Math.PI * 2)) ** 6 : 0;
  return (
    <>
      <AbsoluteFill style={{opacity: 0.13, mixBlendMode: 'overlay'}}>
        <svg width="100%" height="100%">
          <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 12} /><feColorMatrix type="saturate" values="0" /></filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,${0.75 + beat * 0.15}) 100%)`}} />
      <AbsoluteFill style={{boxShadow: `inset 0 0 ${120 + beat * 160}px rgba(227,18,43,${0.08 + beat * 0.3})`}} />
      <AbsoluteFill style={{background: '#000', opacity: 1 - flick}} />
    </>
  );
};

const SceneWrap: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  const inS = interpolate(f, [0, 10], [1.08, 1], {extrapolateRight: 'clamp'});
  const drift = interpolate(f, [0, dur], [1, 1.03]);
  const outO = interpolate(f, [dur - 6, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const inO = interpolate(f, [0, 4], [0, 1], {extrapolateRight: 'clamp'});
  const jolt = f < 3 ? (random(`j${f}`) - 0.5) * 30 : 0;
  return <AbsoluteFill style={{transform: `translateX(${jolt}px) scale(${inS * drift})`, opacity: Math.min(outO, inO)}}>{children}</AbsoluteFill>;
};

/* subtítulos */
type W = {t: string; s: number; e: number};
const words = wordsRaw as W[];
const KEY = /(%|\$|\d|ia\b|inteligencia|artificial|wall|street|rojo|sangrar|pánico|huyó|burbuja|desploman|atrapado|tercio|scroll|sígueme|salud|energía|méxico|cetes|dólar|peso|tambalea|corazón|terror|cáncer|pastilla)/i;
const groups: W[][] = [];
{
  let g: W[] = [];
  words.forEach((w, i) => {
    g.push(w);
    const nx = words[i + 1];
    if (/[.,?!:…]$/.test(w.t) || g.length >= 3 || !nx || nx.s - w.e > 0.4) { groups.push(g); g = []; }
  });
}
const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  let gi = -1;
  for (let i = 0; i < groups.length; i++) {
    const end = Math.min(groups[i + 1] ? groups[i + 1][0].s : 999, groups[i][groups[i].length - 1].e + 0.45);
    if (t >= groups[i][0].s - 0.04 && t < end) gi = i;
  }
  if (gi < 0) return null;
  const g = groups[gi];
  const local = (t - g[0].s) * FPS;
  const pop = interpolate(local, [0, 4], [0.8, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 50, right: 50, top: 1480, display: 'flex', justifyContent: 'center'}}>
      <div style={{transform: `scale(${pop})`, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 960}}>
        {g.map((w, i) => {
          const active = t >= w.s - 0.03 && (i === g.length - 1 || t < g[i + 1].s);
          const key = KEY.test(w.t);
          return (
            <span key={i} style={{fontFamily: F.title, fontWeight: 700, fontSize: 84, lineHeight: 1.1, textTransform: 'uppercase', margin: '0 14px', color: active ? C.red : key ? C.amber : C.bone, display: 'inline-block', transform: active ? 'translateY(-4px)' : 'none', textShadow: '0 0 6px #000, 0 6px 20px rgba(0,0,0,0.95), 0 0 2px #000'}}>
              {w.t.replace(/[.,:]$|\.\.\.$/g, '')}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const Progress: React.FC = () => {
  const f = useCurrentFrame();
  return <div style={{position: 'absolute', top: 0, left: 0, height: 7, width: `${(f / (AUDIO_DUR * FPS)) * 100}%`, background: C.red, boxShadow: '0 0 12px #E3122B'}} />;
};

export const Main: React.FC = () => {
  useFonts();
  const total = Math.ceil(AUDIO_DUR * FPS) + 20;
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <style>{fontFaces}</style>
      <Backgrounds />
      {SCENES.map(([s, Comp], i) => {
        const from = Math.round(s * FPS);
        const to = i + 1 < SCENES.length ? Math.round(SCENES[i + 1][0] * FPS) : total;
        return (
          <Sequence key={i} from={from} durationInFrames={to - from} layout="none">
            <SceneWrap dur={to - from}><Comp dur={to - from} /></SceneWrap>
          </Sequence>
        );
      })}
      <FilmLook />
      <Captions />
      <Progress />
      <Audio src={staticFile('mix.wav')} />
    </AbsoluteFill>
  );
};

/* portada */
export const Cover: React.FC = () => {
  useFonts();
  const f = useCurrentFrame();
  const out = interpolate(f, [37, 45], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pts = '0,60 90,80 170,50 250,140 330,120 420,250 520,230 600,330';
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #3a0710 0%, #120205 60%, #050102 100%)'}}>
      <style>{fontFaces}</style>
      <AbsoluteFill style={{opacity: 1 - out, transform: `translateY(${-out * 80}px)`, padding: '0 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 40}}>
        <div style={{fontFamily: F.type, fontSize: 36, color: C.red, letterSpacing: 4}}>● FINANZAS · CASO REAL</div>
        <svg width={640} height={360} viewBox="0 0 620 360">
          <polyline points={pts} fill="none" stroke={C.red} strokeWidth={16} strokeLinejoin="round" strokeLinecap="round" style={{filter: 'drop-shadow(0 0 18px #E3122B)'}} />
        </svg>
        <div style={{fontFamily: F.title, fontWeight: 400, fontSize: 92, color: C.dim, lineHeight: 1}}>LA SEMANA QUE</div>
        <div style={{fontFamily: F.title, fontWeight: 700, fontSize: 168, color: C.bone, lineHeight: 0.95}}>WALL STREET<br /><span style={{color: C.red}}>SANGRÓ</span></div>
        <div style={{fontFamily: F.type, fontSize: 40, color: C.amber}}>IA · elecciones · Banxico · el peso</div>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.8) 100%)'}} />
    </AbsoluteFill>
  );
};

export const WithCover: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={COVER}><Cover /></Sequence>
    <Sequence from={COVER}><Main /></Sequence>
  </AbsoluteFill>
);

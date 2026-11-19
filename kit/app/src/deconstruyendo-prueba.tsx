// DECONSTRUYENDO LAS FINANZAS — fragmento de prueba (guion 1, primeros ~5.9 s) · Estándar Pro
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/deconstruyendo-prueba/words.json';
import {Backdrop, Captions, Chip, FONT, FPS, Frame, Grain, P, Pop, Rise, Scene, Wd, buildGroups, cl, easeOut, lerp, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const DECO_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1));
const groups = buildGroups(words, blocks);
const KEYS = ['DINERO', 'CREZCA', 'INVERSIONISTA'];

const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
const txt = (size: number, weight = 800, color = P.white, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});

/* ---------------- ilustraciones ---------------- */
const Coins: React.FC<{n: number}> = ({n}) => (
  <svg width={360} height={580} viewBox="0 0 360 580" style={{filter: 'drop-shadow(0 34px 40px rgba(0,0,0,0.45))'}}>
    <ellipse cx={180} cy={556} rx={170} ry={20} fill="rgba(0,0,0,0.35)" />
    {Array.from({length: n}, (_, k) => {
      const y = 500 - k * 44;
      return (
        <g key={k}>
          <rect x={40} y={y} width={280} height={38} fill={P.amberDeep} />
          <ellipse cx={180} cy={y + 38} rx={140} ry={26} fill={P.amberDeep} />
          <ellipse cx={180} cy={y} rx={140} ry={26} fill={P.amber} />
          <ellipse cx={180} cy={y} rx={98} ry={16} fill="none" stroke={P.amberDeep} strokeWidth={5} />
        </g>
      );
    })}
  </svg>
);
const Arrow: React.FC<{p: number}> = ({p}) => (
  <svg width={190} height={520} viewBox="0 0 190 520" style={{filter: 'drop-shadow(0 20px 26px rgba(0,0,0,0.4))', overflow: 'visible'}}>
    <g style={{transformOrigin: '95px 520px', transform: `scaleY(${p})`}}>
      <rect x={66} y={150} width={58} height={370} rx={22} fill={P.mint} />
      <path d="M95 0 L190 170 L0 170Z" fill={P.mint} />
    </g>
  </svg>
);
const Person: React.FC<{glow: number}> = ({glow}) => (
  <svg width={460} height={600} viewBox="-230 -300 460 600" style={{filter: 'drop-shadow(0 34px 44px rgba(0,0,0,0.45))', overflow: 'visible'}}>
    <ellipse cx={0} cy={282} rx={190} ry={18} fill="rgba(0,0,0,0.35)" />
    <circle cx={0} cy={-40} r={250 * glow} fill="none" stroke={P.amber} strokeWidth={10} opacity={(1 - glow) * 0.9 * (glow > 0.01 ? 1 : 0)} />
    <path d="M-170 270 C-170 130 -110 60 0 60 C110 60 170 130 170 270Z" fill={P.paper} />
    <path d="M-170 270 C-170 130 -110 60 0 60 C110 60 170 130 170 270Z" fill="url(#psh)" />
    <circle cx={0} cy={-70} r={112} fill={P.paper} />
    <circle cx={0} cy={-70} r={112} fill="url(#psh)" />
    <circle cx={96} cy={140} r={58} fill={P.amber} />
    <circle cx={96} cy={140} r={40} fill="none" stroke={P.amberDeep} strokeWidth={6} />
    <text x={96} y={160} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={54} fill={P.amberDeep}>$</text>
    <defs>
      <linearGradient id="psh" x1="0" x2="1">
        <stop offset="0" stopColor="rgba(10,15,31,0)" />
        <stop offset="1" stopColor="rgba(10,15,31,0.18)" />
      </linearGradient>
    </defs>
  </svg>
);

/* ---------------- escenas ---------------- */
const S1: React.FC = () => (
  <Scene a={A[0]} b={A[1]} kind="none" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const n = 2 + Math.round(7 * easeOut(prog(t, T(3), T(7) + 0.25)));
      const ar = spr(f, T(7) - 0.05, 12, 150, 0.8);
      const bob = Math.sin(f / 10) * 6;
      return (
        <AbsoluteFill style={{transform: `scale(${lerp(1.07, 1, easeOut(lt / 0.5))})`}}>
          <div style={{...center(250), ...txt(74, 600, P.mute, 0.3)}}>TU</div>
          <div style={{...center(318), ...txt(190)}}>DINERO</div>
          <div style={{position: 'absolute', left: 250, top: 560 + bob}}>
            <Coins n={n} />
          </div>
          <div style={{position: 'absolute', left: 660, top: 640, opacity: cl(ar * 3)}}>
            <Arrow p={ar} />
          </div>
        </AbsoluteFill>
      );
    }}
  </Scene>
);

const S2: React.FC = () => (
  <Scene a={A[1]} b={DECO_TOTAL + 1} kind="left" out="none">
    {(lt, f) => {
      const t = f / FPS;
      const glow = prog(t, T(12), T(12) + 0.7);
      const bob = Math.sin(f / 11) * 7;
      const tu = spr(f, T(10), 12, 200, 0.6);
      const st = spr(f, T(15) - 0.04, 8, 240, 0.6);
      const shake = st > 0.05 && st < 0.95 ? Math.sin(f * 2.4) * 9 * (1 - st) : 0;
      return (
        <AbsoluteFill style={{transform: `translate(${shake}px, 0)`}}>
          <Rise at={A[1] + 0.05} style={{...center(210), ...txt(60, 600, P.mute, 0.3)}}>EN ESE MOMENTO</Rise>
          <div style={{...center(300), transform: `translateY(${bob}px)`}}>
            <Person glow={glow} />
          </div>
          <Pop at={T(10)} from={0.5} style={center(900)}>
            <Chip size={34} style={{opacity: cl(tu * 2)}}>TÚ</Chip>
          </Pop>
          <div style={{...center(1000), opacity: cl(st * 3), transform: `scale(${lerp(2.4, 1, st)}) rotate(-5deg)`}}>
            <div style={{...txt(86, 800, P.ink, -0.01), background: P.amber, padding: '14px 40px 6px', borderRadius: 26, boxShadow: '0 30px 60px rgba(0,0,0,0.5)', border: `8px solid ${P.ink}`, outline: `8px solid ${P.amber}`}}>INVERSIONISTA</div>
          </div>
        </AbsoluteFill>
      );
    }}
  </Scene>
);

const MOOD_AT = [
  {at: 0, mood: 'navy'},
  {at: A[1], mood: 'forest'},
];
const PASOS = [{at: A[1], label: 'PIEZA 1'}];

export const DeconstruyendoPruebaMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={MOOD_AT} />
    <S1 />
    <S2 />
    <Grain />
    <Frame serie="DECONSTRUYENDO LAS FINANZAS" total={DECO_TOTAL} pasos={PASOS} nota="Contenido educativo, no es recomendación de inversión." />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('deconstruyendo-prueba/voz_mix.wav')} />}
  </AbsoluteFill>
);

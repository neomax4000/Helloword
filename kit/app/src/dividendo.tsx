// DIVIDENDO — T04 de la semana de pruebas (26 nov 2026)
// Variables a probar: apertura = silencio + texto grande + golpe de sonido · texto = cero extra (solo subtítulos grandes) ·
// estructura = lista corta de 3 · fondo = un solo color plano, minimalista · ~15-18 s · voz 3.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/dividendo/words.json';
import {FONT, FPS, Wd, buildGroups, cl, lerp, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const DIV_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const groups = buildGroups(words, blocks, 24, 4);
const BLUE = '#1F3BFF';
const WHITE = '#FFFFFF';
const txt = (size: number, weight = 800, color = WHITE, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.04, whiteSpace: 'nowrap'});

const Hook: React.FC<{settled?: boolean}> = ({settled}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const p = settled ? 1 : spr(f, 0.03, 9, 260, 0.7);
  const out = settled ? 0 : cl((t - (T(1) - 0.12)) / 0.14);
  if (!settled && t >= T(1) + 0.05) return null;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: 1 - out, transform: `translateY(${-60 - out * 40}px)`}}>
      <div style={{...txt(168, 800, WHITE, -0.045), transform: `scale(${lerp(1.7, 1, p)})`, opacity: cl(p * 4)}}>DIVIDENDO</div>
    </AbsoluteFill>
  );
};

const Caps: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const g = groups.find((x, k) => k > 0 && t >= x.a && t < x.b);
  if (!g) return null;
  const pin = spr(f, g.a, 13, 250, 0.55);
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: 560, height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '0 34px', alignContent: 'center', opacity: cl(pin * 2), transform: `scale(${lerp(0.9, 1, pin)})`}}>
      {g.ws.map((w) => {
        const on = t >= w.s - 0.04;
        return (
          <span key={w.i} style={{...txt(128, 800, WHITE, -0.03), opacity: on ? 1 : 0.28, display: 'inline-block', transform: `translateY(${on ? 0 : 14}px)`}}>
            {w.w.replace(/[.,:;]/g, '').toUpperCase()}
          </span>
        );
      })}
    </div>
  );
};

const Written: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const a = T(40);
  const p = spr(f, a, 12, 200, 0.6);
  return (
    <>
      {t >= a && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', opacity: cl(p * 2), transform: `translateY(${(1 - p) * 40}px)`}}>
          <div style={{...txt(58, 700, WHITE, 0.02), borderBottom: '6px solid #FFFFFF', paddingBottom: 10}}>¿TU ACCIÓN PAGA DIVIDENDO?</div>
        </div>
      )}
      {t >= T(44) && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1380, display: 'flex', justifyContent: 'center', opacity: cl(spr(f, T(44), 12, 200, 0.6) * 2)}}>
          <div style={{...txt(40, 700, 'rgba(255,255,255,0.85)', 0.2)}}>＋ SÍGUEME</div>
        </div>
      )}
    </>
  );
};

const Foot: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{position: 'absolute', left: 0, top: 0, height: 10, width: `${(f / FPS / DIV_TOTAL) * 100}%`, background: WHITE}} />
      <div style={{position: 'absolute', left: 70, right: 200, top: 1532, fontFamily: FONT, fontWeight: 400, fontSize: 23, lineHeight: 1.3, color: 'rgba(255,255,255,0.7)'}}>
        Contenido educativo, no es recomendación de inversión. El dividendo lo decide cada empresa y no está garantizado.
      </div>
    </>
  );
};

export const DividendoMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <AbsoluteFill style={{background: BLUE}}>
    <Hook />
    <Caps />
    <Written />
    <Foot />
    {audio && <Audio src={staticFile('dividendo/voz_mix.wav')} />}
  </AbsoluteFill>
);

export const DividendoCover: React.FC = () => (
  <AbsoluteFill style={{background: BLUE}}>
    <Hook settled />
    <div style={{position: 'absolute', left: 0, right: 0, top: 1130, display: 'flex', justifyContent: 'center'}}>
      <div style={{...txt(46, 700, WHITE, 0.1)}}>EN 3 IDEAS</div>
    </div>
  </AbsoluteFill>
);

// RETO52 — T01 de la semana de pruebas (25 nov 2026)
// Variables a probar: apertura = resultado primero · texto = solo números · estructura = cuenta en vivo ·
// fondo/animación = mundo continuo con una cámara que viaja sin cortes · duración 35 s · voz 3.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/reto52/words.json';
import {Backdrop, Captions, Chip, FONT, FPS, Frame, Grain, P, Wd, buildGroups, cl, easeIO, easeOut, lerp, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const RETO_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const groups = buildGroups(words, blocks);
const KEYS = ['TRECE', 'MIL', 'DIEZ', 'VEINTE', 'QUINIENTOS', 'SUMA', 'REVÉS', 'ÚLTIMAS', 'PESADO', 'AÑO'];

const PITCH = 52;
const BW = 44;
const BH = 16;
const xOf = (k: number) => (k - 1) * PITCH + BW / 2;
const txt = (size: number, weight = 800, color = P.white, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
const cum = (w: number) => 10 * Math.floor(w) * (Math.floor(w) + 1) / 2;

/* ---------- cámara: palabras clave del guion ---------- */
type K = {t: number; s: number; cx: number; cy: number; wk: number};
const OV = {s: 0.34, cx: 1352, cy: -250};
const wkCam = (wk: number, t: number) => {
  const s = lerp(1.3, 0.8, (wk - 1) / 51);
  return {t, s, cx: xOf(wk) - 100 / s, cy: -(BH * wk) / 2, wk};
};
const KF: K[] = [
  {t: 0, ...OV, wk: 52},
  {t: T(5), ...OV, wk: 52},
  wkCam(1, T(14) + 0.2),
  wkCam(2, T(19)),
  wkCam(2, T(21) - 0.05),
  wkCam(10, T(24) + 0.25),
  wkCam(20, T(26)),
  wkCam(20, T(27) + 0.4),
  wkCam(52, T(33) + 0.2),
  wkCam(52, T(34)),
  {t: T(34) + 1.5, ...OV, wk: 52},
  {t: T(59) - 0.3, ...OV, wk: 52},
  {t: T(59) + 0.8, s: 0.7, cx: xOf(46), cy: -400, wk: 52},
  {t: T(68), s: 0.7, cx: xOf(46), cy: -400, wk: 52},
  {t: T(79) - 0.1, s: 0.7, cx: xOf(46), cy: -400, wk: 52},
  {t: T(79) + 1.3, ...OV, wk: 52},
];
const cam = (t: number) => {
  if (t <= KF[0].t) return KF[0];
  for (let i = 0; i < KF.length - 1; i++) {
    const a = KF[i];
    const b = KF[i + 1];
    if (t < b.t) {
      const p = easeIO((t - a.t) / Math.max(0.001, b.t - a.t));
      return {t, s: lerp(a.s, b.s, p), cx: lerp(a.cx, b.cx, p), cy: lerp(a.cy, b.cy, p), wk: lerp(a.wk, b.wk, p)};
    }
  }
  return KF[KF.length - 1];
};

/* ---------- el mundo: escalera de 52 escalones ---------- */
const World: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const c = cam(t);
  const wkNow = t < T(14) ? 1 : c.wk;
  const litAll = 1 - easeIO(prog(t, T(8), T(8) + 0.7));
  const hookGlow = t < T(5) ? 1 : 0;
  const cor = easeOut(prog(t, T(61), T(62) + 0.4)) * (1 - easeIO(prog(t, T(75), T(75) + 0.6)));
  const bars = Array.from({length: 52}, (_, i) => i + 1);
  const walker = t >= T(14) && t < T(34) + 1.2;
  const wInt = Math.max(1, Math.min(52, Math.floor(wkNow)));
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 0, height: 0, transform: `translate(${540 - c.cx * c.s}px, ${880 - c.cy * c.s}px) scale(${c.s})`, transformOrigin: '0 0'}}>
      {/* suelo */}
      <div style={{position: 'absolute', left: -1400, top: 0, width: 5400, height: 6, background: 'rgba(255,255,255,0.45)'}} />
      <div style={{position: 'absolute', left: -1400, top: 6, width: 5400, height: 600, background: 'linear-gradient(180deg, rgba(0,0,0,0.38), transparent)'}} />
      {bars.map((k) => {
        const grow = Math.max(litAll, easeOut(cl(wkNow - k + 1.2)));
        const h = BH * k * grow;
        const isCor = k >= 43 ? cor : 0;
        return (
          <React.Fragment key={k}>
            <div style={{position: 'absolute', left: (k - 1) * PITCH, top: -BH * k, width: BW, height: BH * k, borderRadius: 8, border: '3px dashed rgba(255,255,255,0.14)', boxSizing: 'border-box', opacity: 1 - grow}} />
            {h > 0.5 && (
              <div
                style={{
                  position: 'absolute',
                  left: (k - 1) * PITCH,
                  top: -h,
                  width: BW,
                  height: h,
                  borderRadius: '8px 8px 0 0',
                  background: isCor > 0.02 ? `linear-gradient(180deg, ${P.coral}, #B83A3E)` : `linear-gradient(180deg, ${P.mint}, #0E8F6C)`,
                  opacity: 0.35 + 0.65 * isCor * 0 + 0.65,
                  boxShadow: hookGlow ? '0 0 40px rgba(53,224,161,0.35)' : undefined,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
      {/* moneda y burbuja del escalón actual */}
      {walker && (
        <div style={{position: 'absolute', left: xOf(wInt), top: -BH * wInt - 40, width: 0, height: 0}}>
          <div style={{position: 'absolute', left: -26, top: -26, width: 52, height: 52, borderRadius: 99, background: P.amber, boxShadow: '0 8px 20px rgba(0,0,0,0.5)', border: `5px solid ${P.amberDeep}`, boxSizing: 'border-box'}} />
          <div style={{position: 'absolute', left: -130, top: -150, width: 260, display: 'flex', justifyContent: 'center'}}>
            <div style={{...txt(96, 800, P.ink, -0.02), background: P.white, padding: '8px 30px', borderRadius: 26, boxShadow: '0 16px 30px rgba(0,0,0,0.45)'}}>{'$' + wInt * 10}</div>
          </div>
        </div>
      )}
      {/* llave sobre las últimas diez semanas */}
      {t >= T(61) && t < T(78) && (
        <div style={{position: 'absolute', left: 42 * PITCH, top: -BH * 52 - 130, width: 10 * PITCH, opacity: cor}}>
          <div style={{height: 14, borderRadius: 7, background: P.coral}} />
          <div style={{...txt(96, 800, P.coral, 0), textAlign: 'center', marginTop: 10}}>43 → 52</div>
        </div>
      )}
    </div>
  );
};

/* ---------- contador fijo (solo números) ---------- */
const Counter: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const c = cam(t);
  let a = 0;
  let node: React.ReactNode;
  let color: string = P.amber;
  let size = 190;
  if (t < T(8)) {
    node = '$13,780';
  } else if (t < T(14)) {
    node = '$' + fmt(lerp(13780, 10, easeIO(prog(t, T(8), T(14)))));
    a = T(8);
  } else if (t < T(34) - 0.05) {
    node = '$' + fmt(cum(c.wk));
    a = T(14);
  } else if (t < T(46)) {
    node = '1,378';
    color = P.sky;
    a = T(34) - 0.05;
  } else if (t < T(49)) {
    node = '1,378 × $10';
    color = P.white;
    size = 120;
    a = T(46);
  } else if (t < T(64)) {
    node = '$13,780';
    a = T(49);
  } else if (t < T(68)) {
    node = '$4,750';
    color = P.coral;
    a = T(64);
  } else if (t < T(73)) {
    node = '$13,780';
    a = T(68);
  } else if (t < T(79)) {
    node = '$520';
    color = P.mint;
    a = T(73);
  } else {
    node = '$13,780';
    a = T(79);
  }
  const hookPulse = t < 0.6 ? lerp(1.08, 1, easeOut(t / 0.6)) : 1;
  const punch = a > 0 ? spr(f, a, 8, 240, 0.55) : 1;
  return (
    <div style={{...center(210), transform: `scale(${hookPulse * lerp(1.12, 1, punch)})`}}>
      <div style={{...txt(size, 800, color, -0.04), textShadow: '0 20px 60px rgba(0,0,0,0.55)'}}>{node}</div>
    </div>
  );
};

/* ---------- apoyos escritos: solo números ---------- */
const Extras: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const sum = t >= T(34) && t < T(46);
  const rev = t >= T(71) && t < T(79);
  const q = t >= T(79) - 0.1;
  const qp = spr(f, T(79), 12, 200, 0.6);
  return (
    <>
      {sum && (
        <div style={{...center(520), opacity: easeOut(prog(t, T(34), T(34) + 0.3))}}>
          <div style={{...txt(64, 700, P.white, 0)}}>1 + 2 + 3 + … + 52</div>
        </div>
      )}
      {rev && (
        <div style={{...center(440), opacity: easeOut(prog(t, T(71), T(71) + 0.3))}}>
          <div style={{...txt(100, 800, P.mint, 0)}}>52 → 1</div>
        </div>
      )}
      {t >= T(68) && (
        <div style={{position: 'absolute', right: 70, top: 160, opacity: cl(spr(f, T(68), 12, 200, 0.6) * 2)}}>
          <Chip bg={P.white} color={P.ink} size={26}>＋ SÍGUEME</Chip>
        </div>
      )}
      {q && (
        <div style={{...center(1420), opacity: cl(qp * 2), transform: `translateY(${(1 - qp) * 40}px)`}}>
          <Chip bg={P.amber} color={P.ink} size={34}>¿EMPIEZAS HOY?</Chip>
        </div>
      )}
    </>
  );
};

const MOOD_AT = [
  {at: 0, mood: 'forest'},
  {at: T(53) - 0.3, mood: 'ember'},
  {at: T(68) - 0.2, mood: 'forest'},
];

export const RetoMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={MOOD_AT} />
    <World />
    <Counter />
    <Grain />
    <Frame serie="AHORRO · 52 SEMANAS" total={RETO_TOTAL} nota="Contenido educativo, no es recomendación de inversión. Cuenta: 10 × (1+2+…+52) = $13,780, sin rendimientos." />
    <Extras />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('reto52/voz_mix.wav')} />}
  </AbsoluteFill>
);

export const RetoCover: React.FC = () => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={[{at: 0, mood: 'forest'}]} />
    <div style={{...center(240), ...txt(210, 800, P.amber, -0.04)}}>$13,780</div>
    <div style={{position: 'absolute', left: 120, top: 820, width: 840, height: 420}}>
      {Array.from({length: 26}, (_, i) => i + 1).map((k) => (
        <div key={k} style={{position: 'absolute', left: (k - 1) * 33, bottom: 0, width: 28, height: 14 * k + 6, borderRadius: '6px 6px 0 0', background: `linear-gradient(180deg, ${P.mint}, #0E8F6C)`}} />
      ))}
    </div>
    <div style={{...center(1330)}}>
      <Chip bg={P.white} color={P.ink} size={40}>52 SEMANAS</Chip>
    </div>
    <Grain />
  </AbsoluteFill>
);

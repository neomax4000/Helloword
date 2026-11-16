// PLAZO — glosario, ESTÁNDAR PRO (2026-11-16)
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/plazo/words.json';
import {Backdrop, Captions, Card, Chip, FONT, FPS, Frame, Grain, Mask, P, Pop, Rise, Scene, Wd, buildGroups, cl, easeIO, easeOut, lerp, money, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const PLAZO_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1));
const groups = buildGroups(words, blocks);
const KEYS = ['PLAZO', 'TRES', 'INTERESES', 'TIEMPO', 'CRÉDITO', 'CINCUENTA', 'VEINTICUATRO', 'DOCE', 'TREINTA', 'VEINTE', 'MENSUALIDAD', 'COSTO', 'TOTAL', 'SIEMPRE'];

const abs = (x: number, y: number, w?: number): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w});
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
const txt = (size: number, weight = 800, color = P.white, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});

/* ---------------- ilustraciones ---------------- */
const Tick: React.FC<{size?: number}> = ({size = 120}) => (
  <svg width={size} height={size} viewBox="-60 -60 120 120" style={{filter: 'drop-shadow(0 10px 14px rgba(0,0,0,0.4))'}}>
    <circle r={56} fill={P.mint} />
    <path d="M-26 2 L-8 22 L28 -18" stroke={P.ink} strokeWidth={15} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Calendar: React.FC<{lit?: number; cols?: number; rows?: number; cell?: number; color?: string}> = ({lit = 0, cols = 6, rows = 6, cell = 70, color = P.amber}) => (
  <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, ${cell}px)`, gap: 10}}>
    {Array.from({length: cols * rows}, (_, k) => (
      <div key={k} style={{width: cell, height: cell, borderRadius: 16, background: k < lit ? color : 'rgba(255,255,255,0.12)'}} />
    ))}
  </div>
);

/* ---------------- gancho (también último fotograma: bucle) ---------------- */
const HookBase: React.FC<{f: number}> = ({f}) => (
  <>
    <div style={{...center(210), ...txt(60, 700, P.mute, 0.16)}}>MÁS PLAZO =</div>
    <div style={{...center(300), ...txt(420, 800, P.amber, -0.05)}}>3×</div>
    <div style={{...center(760), ...txt(110, 700, P.white, -0.01)}}>más intereses</div>
    <div style={{...center(960), transform: `translateY(${Math.sin(f / 10) * 8}px)`}}>
      <Calendar lit={36} cols={12} rows={3} cell={64} />
    </div>
  </>
);

/* ---------------- escenas ---------------- */
const S1: React.FC = () => (
  <Scene a={A[0]} b={A[1]} kind="none" out="up">
    {(lt, f) => {
      const zoomIn = lerp(1.06, 1, easeOut(lt / 0.5));
      return (
        <AbsoluteFill style={{transform: `scale(${zoomIn})`}}>
          <HookBase f={f} />
        </AbsoluteFill>
      );
    }}
  </Scene>
);

const S2: React.FC = () => (
  <Scene a={A[1]} b={A[2]} kind="up" out="left">
    {(lt, f) => {
      const t = f / FPS;
      const run = easeOut(prog(t, T(9), T(16) + 0.2));
      const lit = Math.round(run * 36);
      return (
        <>
          <Mask at={A[1] + 0.05} size={210} color={P.amber} ls={-0.03} style={center(200)}>PLAZO</Mask>
          <Rise at={T(8)} dy={80} style={center(470)}>
            <Card style={{padding: '40px 44px', transform: 'rotate(-1deg)'}}>
              <div style={{...txt(34, 700, 'rgba(10,15,31,0.55)', 0.14), marginBottom: 24}}>TIEMPO PARA PAGAR</div>
              <Calendar lit={lit} cols={6} rows={6} cell={96} color={P.amber} />
            </Card>
          </Rise>
          <Pop at={T(15)} rot={-3} style={abs(110, 1220)}>
            <div style={{...txt(56, 800, P.ink, 0), background: P.mint, padding: '14px 36px', borderRadius: 22, boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}>DE UN CRÉDITO</div>
          </Pop>
        </>
      );
    }}
  </Scene>
);

const S3: React.FC = () => (
  <Scene a={A[2]} b={A[3]} kind="left" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(18) - 0.05, T(19) + 0.3));
      const punch = spr(f, T(19) + 0.3, 7, 260, 0.5);
      return (
        <>
          <Rise at={A[2] + 0.05} dy={60} style={abs(80, 220, 920)}>
            <div style={{...txt(40, 700, P.mute, 0.16)}}>PRÉSTAMO · EJEMPLO</div>
          </Rise>
          <Rise at={T(17)} dy={120} style={abs(90, 330, 900)}>
            <Card style={{padding: '46px 56px 54px', transform: 'rotate(-1.2deg)'}}>
              <div style={{...txt(40, 600, 'rgba(10,15,31,0.6)', 0)}}>Pides prestado</div>
              <div style={{position: 'relative', display: 'inline-block', marginTop: 8, transform: `scale(${lerp(1.07, 1, punch)})`, transformOrigin: '0 60%'}}>
                <div style={{position: 'absolute', left: -12, right: -18, bottom: 24, height: 76, background: P.amber, borderRadius: 14, transform: `scaleX(${c})`, transformOrigin: '0 50%'}} />
                <div style={{...txt(190, 800, P.ink, -0.04), position: 'relative'}}>{money(c * 50000)}</div>
              </div>
            </Card>
          </Rise>
          <Pop at={T(22) - 0.1} rot={-4} style={abs(110, 900)}>
            <div style={{...txt(86, 800, P.ink, -0.01), background: P.white, padding: '18px 40px', borderRadius: 26, boxShadow: '0 24px 44px rgba(0,0,0,0.4)'}}>24 % anual</div>
          </Pop>
          <Rise at={T(24)} dy={60} style={abs(110, 1110, 860)}>
            <div style={{...txt(38, 600, P.mute, 0), whiteSpace: 'normal', lineHeight: 1.25}}>Interés fijo, pagos mensuales iguales, sin comisiones</div>
          </Rise>
        </>
      );
    }}
  </Scene>
);

const S4: React.FC = () => (
  <Scene a={A[3]} b={A[4]} kind="zoom" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const g1 = easeOut(prog(t, T(29) - 0.1, T(31) + 0.3));
      const g2 = easeOut(prog(t, T(38) - 0.1, T(41) + 0.3));
      const H = 560; // altura para 20,619
      const bar = (g: number, val: number, color: string) => (
        <div style={{width: 300, height: Math.max(8, (val / 20619) * H * g), borderRadius: '22px 22px 8px 8px', background: color, boxShadow: '0 30px 50px rgba(0,0,0,0.4)'}} />
      );
      return (
        <>
          <Mask at={A[3] + 0.03} size={150} color={P.amber} style={center(200)}>INTERESES</Mask>
          <div style={{position: 'absolute', left: 130, top: 330, width: 820, height: 760, display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{...txt(80, 800, P.white, -0.02), marginBottom: 16, opacity: cl(g1 * 3)}}>{money(g1 * 6736)}</div>
              {bar(g1, 6736, P.mint)}
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{...txt(80, 800, P.white, -0.02), marginBottom: 16, opacity: cl(g2 * 3)}}>{money(g2 * 20619)}</div>
              {bar(g2, 20619, P.coral)}
            </div>
          </div>
          <Rise at={T(27) - 0.1} dy={50} style={abs(130, 1130, 360)}>
            <div style={{...txt(64, 800, P.ink, 0), background: P.mint, padding: '12px 0', borderRadius: 20, textAlign: 'center', width: 300, marginLeft: 0}}>12 MESES</div>
          </Rise>
          <Rise at={T(35) - 0.1} dy={50} style={abs(560, 1130, 360)}>
            <div style={{...txt(64, 800, P.ink, 0), background: P.coral, padding: '12px 0', borderRadius: 20, textAlign: 'center', width: 300}}>36 MESES</div>
          </Rise>
        </>
      );
    }}
  </Scene>
);

const S5: React.FC = () => (
  <Scene a={A[4]} b={A[5]} kind="up" out="zoom">
    {(lt, f) => {
      const t = f / FPS;
      const m = easeOut(prog(t, T(43), T(44) + 0.4));
      const c = easeOut(prog(t, T(47), T(49) + 0.3));
      return (
        <>
          <Rise at={A[4] + 0.05} dy={80} style={abs(90, 230, 900)}>
            <Card style={{padding: '36px 50px 44px'}}>
              <div style={{...txt(40, 700, 'rgba(10,15,31,0.55)', 0.14)}}>MENSUALIDAD</div>
              <div style={{display: 'flex', alignItems: 'baseline', gap: 26, marginTop: 8}}>
                <span style={{...txt(70, 700, 'rgba(10,15,31,0.4)', -0.02), textDecoration: 'line-through'}}>$4,728</span>
                <span style={{...txt(150, 800, '#0F8F68', -0.03)}}>{money(lerp(4728, 1962, m))}</span>
                <span style={{...txt(100, 800, '#0F8F68', 0)}}>↓</span>
              </div>
            </Card>
          </Rise>
          <Rise at={T(46) - 0.1} dy={80} style={abs(90, 660, 900)}>
            <Card style={{padding: '36px 50px 44px', background: P.ink, border: '4px solid rgba(255,255,255,0.25)'}}>
              <div style={{...txt(40, 700, P.mute, 0.14)}}>COSTO TOTAL</div>
              <div style={{display: 'flex', alignItems: 'baseline', gap: 26, marginTop: 8}}>
                <span style={{...txt(70, 700, 'rgba(255,255,255,0.4)', -0.02), textDecoration: 'line-through'}}>$56,736</span>
                <span style={{...txt(150, 800, P.coral, -0.03)}}>{money(lerp(56736, 70619, c))}</span>
                <span style={{...txt(100, 800, P.coral, 0)}}>↑</span>
              </div>
            </Card>
          </Rise>
          <Rise at={T(47)} dy={40} style={abs(90, 1090, 900)}>
            <div style={{...txt(36, 600, P.mute, 0), whiteSpace: 'normal', lineHeight: 1.25}}>Plazo de 12 → 36 meses · $50,000 al 24 % anual</div>
          </Rise>
        </>
      );
    }}
  </Scene>
);

const S6: React.FC = () => (
  <Scene a={A[5]} b={PLAZO_TOTAL + 1} kind="zoom" out="none">
    {(lt, f) => {
      const t = f / FPS;
      const back = easeIO(prog(t, T(54) - 0.1, PLAZO_TOTAL - 0.2));
      return (
        <>
          <div style={{opacity: 1 - cl(back * 2.2), transform: `translateY(${back * 260}px) scale(${1 - back * 0.3})`}}>
            <Mask at={A[5] + 0.05} size={130} color={P.amber} style={center(230)}>COMPARA</Mask>
            <Rise at={A[5] + 0.1} dy={140} style={center(470)}>
              <div style={{width: 640, height: 560, borderRadius: 60, background: P.paper, boxShadow: '0 40px 70px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, transform: 'rotate(-3deg)'}}>
                <div style={{...txt(54, 700, 'rgba(10,15,31,0.55)', 0.12)}}>NO SOLO LA MENSUALIDAD</div>
                <div style={{...txt(130, 800, P.ink, -0.03)}}>COSTO</div>
                <div style={{...txt(130, 800, P.ink, -0.03)}}>TOTAL</div>
                <Pop at={T(53)}><Tick size={130} /></Pop>
              </div>
            </Rise>
          </div>
          <div style={{opacity: cl((back - 0.45) / 0.55), transform: `scale(${lerp(0.8, 1, back)})`, transformOrigin: '50% 40%'}}>
            <HookBase f={0} />
          </div>
        </>
      );
    }}
  </Scene>
);

const MOOD_AT = [
  {at: 0, mood: 'navy'},
  {at: A[2], mood: 'plum'},
  {at: A[4], mood: 'steel'},
  {at: A[5], mood: 'navy'},
];

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const p = spr(f, A[3] + 0.5, 12, 200, 0.6);
  if (t < A[3] + 0.5 || t > A[5]) return null;
  return (
    <div style={{position: 'absolute', right: 70, top: 1415, transform: `translateX(${(1 - p) * 200}px)`, opacity: cl(p * 2)}}>
      <Chip bg={P.white} color={P.ink} size={26}>＋ SÍGUEME</Chip>
    </div>
  );
};

export const PlazoMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={MOOD_AT} />
    <S1 />
    <S2 />
    <S3 />
    <S4 />
    <S5 />
    <S6 />
    <Grain />
    <Frame serie="GLOSARIO FINANCIERO" total={PLAZO_TOTAL} nota="Contenido educativo, no es recomendación de inversión. Fuente: CONDUSEF. Ejemplo hipotético." />
    <Cta />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('plazo/voz_mix.wav')} />}
  </AbsoluteFill>
);

export const PlazoCover: React.FC = () => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={[{at: 0, mood: 'navy'}]} />
    <div style={{...center(210), ...txt(64, 700, P.mute, 0.16)}}>MÁS PLAZO =</div>
    <div style={{...center(300), ...txt(460, 800, P.amber, -0.05)}}>3×</div>
    <div style={{...center(800), ...txt(120, 700, P.white, -0.01)}}>más intereses</div>
    <div style={center(1000)}>
      <Calendar lit={36} cols={12} rows={3} cell={64} />
    </div>
    <div style={{...center(1350), ...txt(64, 700, P.white, 0)}}>Qué es el plazo</div>
    <div style={center(1450)}>
      <Chip size={30}>GLOSARIO FINANCIERO</Chip>
    </div>
    <Grain />
  </AbsoluteFill>
);

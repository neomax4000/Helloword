// Interés compuesto — glosario, ESTÁNDAR PRO (2026-11-15)
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/interes-compuesto/words.json';
import {Backdrop, Captions, Card, Chip, FONT, FPS, Frame, Grain, Mask, P, Pop, Rise, Scene, Wd, buildGroups, cl, easeIO, easeOut, lerp, money, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const IC_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1));
const groups = buildGroups(words, blocks);
const KEYS = ['INTERESES','COMPUESTO','CAPITAL','NUEVOS','DIEZ','ANUAL','AÑOS','SIMPLE','TRECE','TRESCIENTOS','DEUDAS','FAVOR'];

const abs = (x: number, y: number, w?: number): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w});
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
const txt = (size: number, weight = 800, color = P.white, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});


const Coin: React.FC<{s?: number; label?: string; color?: string}> = ({s = 1, label = '$', color = P.amber}) => (
  <svg width={300 * s} height={300 * s} viewBox="-150 -150 300 300" style={{filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.45))'}}>
    <circle r={140} fill={color} />
    <circle r={140} fill="none" stroke="rgba(10,15,31,0.25)" strokeWidth={10} />
    <circle r={104} fill="none" stroke="rgba(10,15,31,0.2)" strokeWidth={6} strokeDasharray="4 12" />
    <text x={0} y={36} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={label.length > 1 ? 96 : 130} fill={P.ink}>{label}</text>
  </svg>
);
const Tick: React.FC<{size?: number}> = ({size = 120}) => (
  <svg width={size} height={size} viewBox="-60 -60 120 120" style={{filter: 'drop-shadow(0 10px 14px rgba(0,0,0,0.4))'}}>
    <circle r={56} fill={P.mint} />
    <path d="M-26 2 L-8 22 L28 -18" stroke={P.ink} strokeWidth={15} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* gancho (también último fotograma: bucle) */
const HookBase: React.FC<{f: number}> = ({f}) => {
  const b = Math.sin(f / 12) * 8;
  return (
    <>
      <div style={{...center(240), ...txt(190, 800, P.amber, -0.04)}}>INTERESES</div>
      <div style={{...center(470), ...txt(84, 600, P.white, 0)}}>ganan intereses</div>
      <div style={{position: 'absolute', left: 250, top: 640 + b}}><Coin s={1.5} /></div>
      <div style={{position: 'absolute', left: 640, top: 760 - b}}><Coin s={0.8} label="%" color={P.mint} /></div>
      <div style={{position: 'absolute', left: 740, top: 1010 + b}}><Coin s={0.45} label="%" color={P.mint} /></div>
    </>
  );
};

const S1: React.FC = () => (
  <Scene a={A[0]} b={A[1]} kind="none" out="up">
    {(lt, f) => (
      <AbsoluteFill style={{transform: `scale(${lerp(1.06, 1, easeOut(lt / 0.5))})`}}>
        <HookBase f={f} />
      </AbsoluteFill>
    )}
  </Scene>
);

const S2: React.FC = () => (
  <Scene a={A[1]} b={A[2]} kind="up" out="left">
    {(lt, f) => {
      const t = f / FPS;
      const cap = spr(f, A[1] + 0.05, 12, 200, 0.6);
      const add = spr(f, T(13) - 0.1, 11, 200, 0.6);
      const nw = spr(f, T(18) - 0.1, 10, 200, 0.6);
      const loop = easeOut(prog(t, T(17), T(19) + 0.3));
      return (
        <>
          <Mask at={T(8) - 0.1} size={84} style={center(200)}>INTERÉS <span style={{color: P.amber}}>COMPUESTO</span></Mask>
          <div style={{position: 'absolute', left: 90, top: 450, opacity: cl(cap * 2), transform: `scale(${lerp(0.5, 1, cap)})`}}>
            <Card style={{width: 380, padding: '40px 20px', textAlign: 'center'}}>
              <div style={{...txt(40, 700, 'rgba(10,15,31,0.55)', 0.14)}}>CAPITAL</div>
              <div style={{...txt(120, 800, P.ink, -0.03), marginTop: 10}}>$</div>
            </Card>
          </div>
          <Pop at={T(13) - 0.1} style={abs(490, 540)}><div style={{...txt(110, 800, P.amber, 0)}}>+</div></Pop>
          <div style={{position: 'absolute', left: 590, top: 450, opacity: cl(add * 2), transform: `scale(${lerp(0.5, 1, add)})`}}>
            <Card style={{width: 380, padding: '40px 20px', textAlign: 'center', background: P.mint}}>
              <div style={{...txt(40, 700, 'rgba(10,15,31,0.6)', 0.14)}}>INTERESES</div>
              <div style={{...txt(120, 800, P.ink, -0.03), marginTop: 10}}>%</div>
            </Card>
          </div>
          <div style={{...center(820), opacity: cl(loop * 2)}}>
            <svg width={160} height={150} viewBox="-60 -75 120 150"><path d="M0 -60 V50 M-36 14 L0 56 L36 14" stroke={P.amber} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" transform={`translate(0 ${(1 - loop) * -30})`} /></svg>
          </div>
          <div style={{position: 'absolute', left: 130, top: 1000, width: 820, opacity: cl(nw * 2), transform: `translateY(${(1 - nw) * 80}px)`}}>
            <Card style={{padding: '34px 30px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24}}>
              <Coin s={0.5} />
              <div style={{...txt(66, 800, P.ink, -0.01)}}>NUEVOS INTERESES</div>
            </Card>
          </div>
        </>
      );
    }}
  </Scene>
);

const S3: React.FC = () => (
  <Scene a={A[2]} b={A[3]} kind="left" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(21) - 0.05, T(22) + 0.3));
      const punch = spr(f, T(22) + 0.3, 7, 260, 0.5);
      return (
        <>
          <Rise at={A[2] + 0.05} dy={60} style={abs(80, 220, 920)}><div style={{...txt(40, 700, P.mute, 0.16)}}>EJEMPLO HIPOTÉTICO</div></Rise>
          <Rise at={T(21) - 0.1} dy={120} style={abs(90, 320, 900)}>
            <Card style={{padding: '46px 56px 54px', transform: 'rotate(-1.2deg)'}}>
              <div style={{...txt(40, 600, 'rgba(10,15,31,0.6)', 0)}}>Capital inicial</div>
              <div style={{position: 'relative', display: 'inline-block', marginTop: 10, transform: `scale(${lerp(1.07, 1, punch)})`, transformOrigin: '0 60%'}}>
                <div style={{position: 'absolute', left: -12, right: -18, bottom: 24, height: 76, background: P.amber, borderRadius: 14, transform: `scaleX(${c})`, transformOrigin: '0 50%'}} />
                <div style={{...txt(200, 800, P.ink, -0.04), position: 'relative'}}>{money(c * 10000)}</div>
              </div>
            </Card>
          </Rise>
          <Pop at={T(25) - 0.05} rot={-4} style={abs(110, 800)}>
            <div style={{...txt(100, 800, P.ink, 0), background: P.amber, padding: '16px 44px', borderRadius: 28, boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}>10% ANUAL</div>
          </Pop>
          <Pop at={T(30) - 0.05} rot={3} style={abs(300, 1010)}>
            <div style={{...txt(100, 800, P.white, 0), background: 'rgba(255,255,255,0.12)', border: '3px solid rgba(255,255,255,0.3)', padding: '16px 44px', borderRadius: 28}}>3 AÑOS</div>
          </Pop>
        </>
      );
    }}
  </Scene>
);

const S4: React.FC = () => (
  <Scene a={A[3]} b={A[4]} kind="zoom" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const s1 = easeOut(prog(t, T(36), T(38) + 0.2));
      const s2 = easeOut(prog(t, T(40), T(44) + 0.2));
      const punch = spr(f, T(44) + 0.2, 7, 260, 0.5);
      const H = 560;
      const hS = (13000 - 10000) / 3310;
      return (
        <>
          <Rise at={A[3] + 0.05} dy={60} style={abs(80, 200, 920)}><div style={{...txt(40, 700, P.mute, 0.16)}}>MISMO CAPITAL, MISMA TASA, 3 AÑOS</div></Rise>
          <div style={{position: 'absolute', left: 110, top: 280, width: 860, height: 760}}>
            {/* barras */}
            <div style={{position: 'absolute', left: 40, bottom: 0, width: 330, height: H * 0.78 * s1, background: 'rgba(255,255,255,0.22)', borderRadius: '30px 30px 0 0'}} />
            <div style={{position: 'absolute', left: 470, bottom: 0, width: 330, height: H * 0.8 * s2, background: P.mint, borderRadius: '30px 30px 0 0'}} />
            <div style={{position: 'absolute', left: 40, bottom: H * 0.78 * s1 + 20, width: 330, textAlign: 'center', opacity: cl(s1 * 3), ...txt(78, 800, P.white, -0.02)}}>{money(s1 * 13000)}</div>
            <div style={{position: 'absolute', left: 440, bottom: H * 0.8 * s2 + 20, width: 390, textAlign: 'center', opacity: cl(s2 * 3), transform: `scale(${lerp(1.1, 1, punch)})`, ...txt(84, 800, P.mint, -0.02)}}>{money(s2 * 13310)}</div>
          </div>
          <Rise at={T(34) - 0.1} dy={40} style={abs(150, 1060)}><div style={{...txt(52, 800, P.white, 0.04)}}>SIMPLE</div></Rise>
          <Rise at={T(40) - 0.1} dy={40} style={abs(590, 1060)}><div style={{...txt(52, 800, P.mint, 0.04)}}>COMPUESTO</div></Rise>
          <Rise at={T(41)} dy={60} style={abs(80, 1150, 920)}>
            <div style={{...txt(34, 600, P.mute, 0)}}>Compuesto: 10,000 → 11,000 → 12,100 → 13,310</div>
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
      const g = easeOut(prog(t, T(51), T(55) + 0.2));
      const steps = [0.3, 0.45, 0.65, 1];
      return (
        <>
          <Mask at={A[4] + 0.05} size={150} color={P.coral} style={center(200)}>DEUDAS</Mask>
          <Rise at={T(49) - 0.1} dy={80} style={center(430)}>
            <Chip bg="rgba(255,255,255,0.14)" size={42}>LO QUE NO PAGAS</Chip>
          </Rise>
          <div style={{position: 'absolute', left: 150, top: 520, width: 780, height: 560, display: 'flex', alignItems: 'flex-end', gap: 36}}>
            {steps.map((h, k) => {
              const p = easeOut(prog(g, k / 4, (k + 1) / 4));
              return <div key={k} style={{flex: 1, height: 520 * h * p, background: k === 0 ? 'rgba(255,255,255,0.3)' : P.coral, borderRadius: '24px 24px 0 0', boxShadow: '0 20px 40px rgba(0,0,0,0.35)'}} />;
            })}
          </div>
          <Pop at={T(53)} rot={-3} style={abs(150, 1130)}>
            <div style={{...txt(60, 800, P.ink, 0), background: P.coral, padding: '14px 40px', borderRadius: 24}}>LA DEUDA CRECE</div>
          </Pop>
        </>
      );
    }}
  </Scene>
);

const S6: React.FC = () => (
  <Scene a={A[5]} b={IC_TOTAL + 1} kind="up" out="none">
    {(lt, f) => {
      const t = f / FPS;
      const back = easeIO(prog(t, T(60) - 0.15, IC_TOTAL - 0.2));
      return (
        <>
          <div style={{opacity: 1 - cl(back * 2.2), transform: `translateY(${back * 260}px) scale(${1 - back * 0.3})`}}>
            <Mask at={A[5] + 0.05} size={140} color={P.mint} style={center(230)}>A TU FAVOR</Mask>
            <Rise at={A[5] + 0.1} dy={140} style={center(520)}>
              <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
                <Coin s={1} />
                <Tick size={170} />
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
  {at: A[2], mood: 'forest'},
  {at: A[4], mood: 'ember'},
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

export const InteresCompuestoMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={MOOD_AT} />
    <S1 /><S2 /><S3 /><S4 /><S5 /><S6 />
    <Grain />
    <Frame serie="GLOSARIO FINANCIERO" total={IC_TOTAL} nota="Contenido educativo, no es recomendación de inversión. Fuente: CONDUSEF. Ejemplo hipotético con tasa de ejemplo." />
    <Cta />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('interes-compuesto/voz_mix.wav')} />}
  </AbsoluteFill>
);

export const InteresCompuestoCover: React.FC = () => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={[{at: 0, mood: 'navy'}]} />
    <div style={{...center(220), ...txt(200, 800, P.amber, -0.04)}}>INTERÉS</div>
    <div style={{...center(440), ...txt(150, 800, P.white, -0.03)}}>COMPUESTO</div>
    <div style={{position: 'absolute', left: 250, top: 660}}><Coin s={1.5} /></div>
    <div style={{position: 'absolute', left: 640, top: 790}}><Coin s={0.8} label="%" color={P.mint} /></div>
    <div style={{...center(1350), ...txt(64, 700, P.white, 0)}}>intereses sobre intereses</div>
    <div style={center(1450)}><Chip size={30}>GLOSARIO FINANCIERO</Chip></div>
    <Grain />
  </AbsoluteFill>
);

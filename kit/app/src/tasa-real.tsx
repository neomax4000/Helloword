// TASA REAL vs NOMINAL — educativo, Estándar Pro (2026-11-20)
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/tasa-real/words.json';
import {Backdrop, Captions, Card, Chip, FONT, FPS, Frame, Grain, Mask, P, Pop, Rise, Scene, Wd, buildGroups, cl, easeIO, easeOut, lerp, money, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const TASAR_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1));
const groups = buildGroups(words, blocks);
const KEYS = ['DOS', 'PIERDES', 'REAL', 'TRES', 'NOMINAL', 'INFLACIÓN', 'OCTUBRE', 'OLVIDA', 'RÉSTALAS', 'MENOS', 'COMPRAS', 'COMPARA'];

const abs = (x: number, y: number, w?: number): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w});
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
const txt = (size: number, weight = 800, color = P.white, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});

const Coin: React.FC<{s?: number; dim?: number}> = ({s = 1, dim = 0}) => (
  <svg width={420 * s} height={420 * s} viewBox="-210 -210 420 420" style={{filter: `drop-shadow(0 34px 44px rgba(0,0,0,0.45)) saturate(${1 - dim * 0.85}) brightness(${1 - dim * 0.35})`}}>
    <circle r={190} fill={P.amberDeep} />
    <circle r={190} cy={-8} fill={P.amber} />
    <circle r={150} cy={-8} fill="none" stroke="rgba(10,15,31,0.28)" strokeWidth={10} />
    <text x={0} y={62} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={190} fill={P.ink}>$</text>
  </svg>
);
const Cross: React.FC<{size?: number}> = ({size = 300}) => (
  <svg width={size} height={size} viewBox="-100 -100 200 200" style={{filter: 'drop-shadow(0 14px 18px rgba(0,0,0,0.45))'}}>
    <path d="M-70 -70 L70 70 M70 -70 L-70 70" stroke={P.coral} strokeWidth={30} strokeLinecap="round" />
  </svg>
);

const HookBase: React.FC<{f: number; dim?: number}> = ({f, dim = 0}) => {
  const bob = Math.sin(f / 9) * 8;
  return (
    <>
      <div style={{...center(250), ...txt(74, 600, P.mute, 0.3)}}>GANAS</div>
      <div style={{...center(318), ...txt(380, 800, P.amber, -0.05)}}>2%</div>
      <div style={{...center(760), transform: `translateY(${bob}px) rotate(${Math.sin(f / 14) * 1.6}deg)`}}>
        <Coin s={1.0} dim={dim} />
      </div>
    </>
  );
};

const S1: React.FC = () => (
  <Scene a={A[0]} b={A[1]} kind="none" out="up">
    {(lt, f) => {
      const st = spr(f, T(5) - 0.05, 9, 260, 0.7);
      const zoomIn = lerp(1.07, 1, easeOut(lt / 0.5));
      const shake = st > 0.05 && st < 0.98 ? Math.sin(f * 2.4) * 10 * (1 - st) : 0;
      return (
        <AbsoluteFill style={{transform: `scale(${zoomIn}) translate(${shake}px, 0)`}}>
          <HookBase f={f} dim={st} />
          <div style={{...center(840), opacity: cl(st * 3), transform: `scale(${lerp(2.6, 1, st)}) rotate(-7deg)`}}>
            <div style={{...txt(150, 800, P.white, -0.02), background: P.coral, padding: '6px 46px 0', borderRadius: 30, boxShadow: '0 30px 60px rgba(0,0,0,0.5)', border: `10px solid ${P.ink}`, outline: `10px solid ${P.coral}`}}>PIERDES</div>
          </div>
          <Rise at={T(6) + 0.12} style={center(1130)}>
            <Chip size={32}>TASA NOMINAL VS. TASA REAL</Chip>
          </Rise>
        </AbsoluteFill>
      );
    }}
  </Scene>
);

const S2: React.FC = () => {
  const items = [{n: '1', l: 'NOMINAL'}, {n: '2', l: 'INFLACIÓN'}, {n: '3', l: 'LA RESTA'}];
  return (
    <Scene a={A[1]} b={A[2]} kind="up" out="left">
      {(lt, f) => (
        <>
          <Mask at={A[1] + 0.02} size={150} color={P.amber} style={center(210)}>TASA REAL</Mask>
          <div style={{position: 'absolute', left: 75, top: 520, display: 'flex', flexDirection: 'column', gap: 26}}>
            {items.map((it, k) => {
              const p = spr(f, T(13) + k * 0.16, 11, 200, 0.6);
              return (
                <div key={k} style={{width: 900, height: 200, borderRadius: 40, background: 'rgba(255,255,255,0.09)', border: '3px solid rgba(255,255,255,0.28)', display: 'flex', alignItems: 'center', gap: 40, padding: '0 50px', boxSizing: 'border-box', transform: `translateX(${(1 - p) * 700}px)`, opacity: cl(p * 2)}}>
                  <div style={{...txt(150, 800, P.amber, -0.04), width: 110}}>{it.n}</div>
                  <div style={{...txt(70, 800, P.white, 0)}}>{it.l}</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Scene>
  );
};

const S3: React.FC = () => (
  <Scene a={A[2]} b={A[3]} kind="left" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(25) - 0.05, T(25) + 0.5));
      const punch = spr(f, T(25) + 0.45, 7, 260, 0.5);
      return (
        <>
          <Mask at={A[2] + 0.05} size={104} style={center(200)}>TASA NOMINAL</Mask>
          <div style={{...center(330), ...txt(520, 800, P.amber, -0.05), transform: `scale(${lerp(0.7, 1, easeOut(prog(t, A[2], A[2] + 0.3))) * lerp(1.1, 1, punch)})`, textShadow: '0 30px 80px rgba(0,0,0,0.45)'}}>{(c * 2).toFixed(0)}%</div>
          <Rise at={T(20) - 0.1} dy={80} style={abs(95, 960, 890)}>
            <Card style={{padding: '30px 40px', transform: 'rotate(-1deg)'}}>
              <div style={{...txt(34, 700, 'rgba(10,15,31,0.5)', 0.12)}}>LA QUE TE ANUNCIAN</div>
              <div style={{...txt(64, 800, P.ink, 0), marginTop: 8}}>Tu ahorro: 2% al año</div>
            </Card>
          </Rise>
        </>
      );
    }}
  </Scene>
);

const S4: React.FC = () => (
  <Scene a={A[3]} b={A[4]} kind="up" out="zoom">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(41), T(47) + 0.2));
      const punch = spr(f, T(47) + 0.15, 7, 260, 0.5);
      return (
        <>
          <Mask at={A[3] + 0.05} size={104} style={center(200)}>INFLACIÓN</Mask>
          <div style={{...center(330), ...txt(270, 800, P.coral, -0.05), transform: `scale(${lerp(1.1, 1, punch)})`, textShadow: '0 30px 80px rgba(0,0,0,0.45)'}}>{(c * 3.75).toFixed(2)}%</div>
          <div style={{position: 'absolute', left: 120, top: 880, display: 'flex', alignItems: 'flex-end', gap: 26}}>
            {[0, 1, 2, 3, 4].map((k) => {
              const p = spr(f, T(35) + k * 0.1, 12, 200, 0.6);
              return (
                <div key={k} style={{width: 140, height: (90 + k * 34) * p, borderRadius: 22, background: k === 4 ? P.coral : 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 14, boxSizing: 'border-box'}}>
                  <span style={{...txt(40, 800, P.ink, 0)}}>$</span>
                </div>
              );
            })}
          </div>
          <Pop at={T(38) - 0.05} rot={-3} style={abs(120, 1140)}>
            <Chip bg={P.ink} color={P.amber} size={30}>INEGI · OCTUBRE 2026 · ANUAL</Chip>
          </Pop>
        </>
      );
    }}
  </Scene>
);

const S5: React.FC = () => (
  <Scene a={A[4]} b={A[5]} kind="zoom" out="left">
    {(lt, f) => {
      const p = spr(f, A[4] + 0.02, 10, 200, 0.7);
      return (
        <>
          <div style={{...center(170), ...txt(680, 800, 'transparent', -0.04), WebkitTextStroke: `10px ${P.amber}`, transform: `scale(${lerp(1.6, 1, p)})`, opacity: cl(p * 2)}}>3</div>
          <div style={{...center(170), ...txt(680, 800, P.amber, -0.04), clipPath: `inset(${(1 - prog(f / FPS, T(49), T(54) + 0.3)) * 100}% 0 0 0)`, transform: `scale(${lerp(1.6, 1, p)})`}}>3</div>
          <Mask at={T(50) - 0.08} size={120} style={center(900)}>EL QUE MÁS</Mask>
          <Mask at={T(53) - 0.1} size={150} color={P.coral} style={center(1020)}>SE OLVIDA</Mask>
        </>
      );
    }}
  </Scene>
);

const S6: React.FC = () => (
  <Scene a={A[5]} b={A[6]} kind="left" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(64), T(69) + 0.1));
      const punch = spr(f, T(69) + 0.1, 7, 260, 0.5);
      return (
        <Card style={{...abs(90, 250, 900), padding: '50px 60px 56px', transform: 'rotate(-1.2deg)'}}>
          <Chip bg={P.ink} color={P.amber} size={28}>RÉSTALAS</Chip>
          <Rise at={T(56) - 0.1} dy={40} style={{marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '3px dashed rgba(10,15,31,0.16)', padding: '16px 0'}}>
            <span style={{...txt(44, 500, 'rgba(10,15,31,0.66)', 0)}}>Nominal</span>
            <span style={{...txt(80, 800, P.ink)}}>2%</span>
          </Rise>
          <Rise at={T(57) + 0.05} dy={40} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '3px dashed rgba(10,15,31,0.16)', padding: '16px 0'}}>
            <span style={{...txt(44, 500, 'rgba(10,15,31,0.66)', 0)}}>− Inflación</span>
            <span style={{...txt(80, 800, P.coral)}}>3.75%</span>
          </Rise>
          <Rise at={T(63) - 0.1} dy={40} style={{marginTop: 30}}>
            <div style={{...txt(36, 700, 'rgba(10,15,31,0.6)', 0.14)}}>TASA REAL</div>
            <div style={{...txt(230, 800, P.coral, -0.04), transform: `scale(${lerp(1.08, 1, punch)})`, transformOrigin: '0 60%'}}>−{(c * 1.75).toFixed(2)}%</div>
          </Rise>
        </Card>
      );
    }}
  </Scene>
);

const Bar: React.FC<{label: string; sub: string; w: number; color: string; val: string; y: number; at: number}> = ({label, sub, w, color, val, y, at}) => (
  <Rise at={at} dy={50} style={abs(80, y, 920)}>
    <div style={{...txt(40, 700, P.mute, 0.1), marginBottom: 6}}>{label}</div>
    <div style={{height: 130, borderRadius: 30, background: 'rgba(255,255,255,0.08)', border: '3px solid rgba(255,255,255,0.22)', position: 'relative', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${w}%`, background: color, borderRadius: 26}} />
      <div style={{...txt(64, 800, P.ink, 0), position: 'absolute', left: 34, top: 28}}>{val}</div>
    </div>
    <div style={{...txt(30, 500, P.mute, 0), marginTop: 8}}>{sub}</div>
  </Rise>
);
const S7: React.FC = () => (
  <Scene a={A[6]} b={A[7]} kind="zoom" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const g1 = easeOut(prog(t, T(75) - 0.1, T(80) + 0.2));
      const g2 = easeOut(prog(t, T(88) - 0.1, T(93) + 0.3));
      const gap = spr(f, T(93) + 0.35, 9, 230, 0.6);
      return (
        <>
          <Rise at={A[6] + 0.05} dy={30} style={{...abs(80, 200), ...txt(44, 700, P.mute, 0.14)}}>EJEMPLO · $100,000</Rise>
          <Bar at={T(70)} y={300} label="TU AHORRO CRECE" sub="100,000 × 1.02" w={lerp(0, 82, g1)} color={P.mint} val={money(lerp(100000, 102000, g1))} />
          <Bar at={T(81) - 0.1} y={620} label="LO MISMO CUESTA" sub="100,000 × 1.0375" w={lerp(0, 100, g2)} color={P.coral} val={money(lerp(100000, 103750, g2))} />
          <div style={{...center(1000), opacity: cl(gap * 3), transform: `scale(${lerp(1.8, 1, gap)}) rotate(-3deg)`}}>
            <div style={{...txt(150, 800, P.white, -0.02), background: P.coral, padding: '6px 46px 0', borderRadius: 30, boxShadow: '0 30px 60px rgba(0,0,0,0.5)'}}>−$1,750</div>
          </div>
        </>
      );
    }}
  </Scene>
);

const S8: React.FC = () => (
  <Scene a={A[7]} b={A[8]} kind="up" out="zoom">
    {(lt, f) => {
      const x = spr(f, T(98) - 0.05, 8, 240, 0.6);
      return (
        <>
          <Rise at={T(94) - 0.1} dy={60} style={center(230)}>
            <div style={{...txt(120, 800, P.mint)}}>SALDO ▲</div>
          </Rise>
          <div style={{...center(480), transform: `scale(${lerp(1, 0.72, x)})`}}>
            <Coin s={1.1} dim={x} />
          </div>
          <div style={{...center(620), opacity: cl(x * 3), transform: `scale(${lerp(2.2, 1, x)})`}}>
            <Cross size={380} />
          </div>
          <Pop at={T(98) - 0.02} rot={-4} style={center(1020)}>
            <div style={{...txt(120, 800, P.white, -0.02), background: P.coral, padding: '14px 50px', borderRadius: 30}}>COMPRAS ▼</div>
          </Pop>
        </>
      );
    }}
  </Scene>
);

const S9: React.FC = () => (
  <Scene a={A[8]} b={TASAR_TOTAL + 1} kind="up" out="none">
    {(lt, f) => {
      const t = f / FPS;
      const back = easeIO(prog(t, T(106) - 0.1, TASAR_TOTAL - 0.2));
      return (
        <>
          <div style={{opacity: 1 - cl(back * 2.2), transform: `translateY(${back * 260}px) scale(${1 - back * 0.3})`}}>
            <Mask at={A[8] + 0.05} size={104} style={abs(80, 215)}>TASA REAL =</Mask>
            <Rise at={A[8] + 0.2} dx={-160} dy={0} style={abs(80, 380, 900)}>
              <div style={{padding: '40px 50px', borderRadius: 40, background: 'rgba(255,255,255,0.09)', border: '3px solid rgba(255,255,255,0.25)'}}>
                <div style={{...txt(64, 800, P.white, 0)}}>NOMINAL</div>
                <div style={{...txt(64, 800, P.coral, 0), marginTop: 8}}>− INFLACIÓN</div>
              </div>
            </Rise>
            <Rise at={T(104)} dy={90} style={abs(80, 760, 900)}>
              <Card style={{padding: '34px 44px', transform: 'rotate(-1deg)'}}>
                <div style={{...txt(40, 700, 'rgba(10,15,31,0.5)', 0.1)}}>PREGUNTA PARA TI</div>
                <div style={{...txt(58, 800, P.ink, 0), whiteSpace: 'normal', lineHeight: 1.15, marginTop: 8}}>¿Tu ahorro le gana a la inflación?</div>
              </Card>
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
  {at: A[7], mood: 'plum'},
  {at: A[8], mood: 'navy'},
];
const PASOS = [
  {at: A[2], label: '1 DE 3'},
  {at: A[3], label: '2 DE 3'},
  {at: A[4], label: '3 DE 3'},
  {at: A[8], label: ''},
];

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const p = spr(f, A[5] + 0.6, 12, 200, 0.6);
  if (t < A[5] + 0.6 || t > A[8]) return null;
  return (
    <div style={{position: 'absolute', right: 70, top: 160, transform: `translateX(${(1 - p) * 200}px)`, opacity: cl(p * 2)}}>
      <Chip bg={P.white} color={P.ink} size={26}>＋ SÍGUEME</Chip>
    </div>
  );
};

export const TasaRealMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={MOOD_AT} />
    <S1 /><S2 /><S3 /><S4 /><S5 /><S6 /><S7 /><S8 /><S9 />
    <Grain />
    <Frame serie="FINANZAS FÁCILES" total={TASAR_TOTAL} pasos={PASOS} nota="Contenido educativo, no es recomendación de inversión. Fuente: INEGI (INPC oct-2026). Ejemplo hipotético." />
    <Cta />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('tasa-real/voz_mix.wav')} />}
  </AbsoluteFill>
);

export const TasaRealCover: React.FC = () => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={[{at: 0, mood: 'navy'}]} />
    <div style={{...center(200), ...txt(74, 600, P.mute, 0.3)}}>GANAS</div>
    <div style={{...center(268), ...txt(330, 800, P.amber, -0.05)}}>2%</div>
    <div style={{...center(620), transform: 'rotate(-6deg)'}}>
      <div style={{...txt(170, 800, P.white, -0.02), background: P.coral, padding: '6px 50px 0', borderRadius: 30, boxShadow: '0 30px 60px rgba(0,0,0,0.5)', border: `10px solid ${P.ink}`, outline: `10px solid ${P.coral}`}}>PIERDES</div>
    </div>
    <div style={center(880)}><Coin s={0.9} dim={0.5} /></div>
    <div style={{...center(1260), ...txt(60, 700, P.white, 0)}}>Tasa real vs. nominal</div>
    <div style={center(1360)}><Chip size={30}>FINANZAS FÁCILES</Chip></div>
    <Grain />
  </AbsoluteFill>
);

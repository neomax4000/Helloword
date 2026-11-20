// NOTICIA · 20 NOV — Anthropic debuta en bolsa (Estándar Pro)
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/anthropic-debut/words.json';
import {Backdrop, Captions, Card, Chip, FONT, FPS, Frame, Grain, Mask, P, Pop, Rise, Scene, Wd, buildGroups, cl, easeIO, easeOut, lerp, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const ANT_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1));
const groups = buildGroups(words, blocks);
const KEYS = ['ANTHROPIC','DEBUT','DIECISIETE','TREINTA','TRECE','TRES','OCHENTA','RÉCORD','CAYÓ','SEIS','DINERO','TECNOLOGÍA','PRONÓSTICO','BAJAR'];

const abs = (x: number, y: number, w?: number): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w});
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
const txt = (size: number, weight = 800, color = P.white, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});
const SRC = (s: string, y: number, at: number) => (
  <Rise at={at} dy={30} style={abs(80, y)}>
    <div style={{...txt(26, 600, P.mute, 0.04)}}>{`FUENTES: ${s}`}</div>
  </Rise>
);


/* precio de la acción: 83 → apertura 111.50 → cierre 97.17 */
const PTS = [0.0, 0.2, 0.62, 1.0, 0.86, 0.74, 0.66, 0.58, 0.5];
const Line: React.FC<{p: number; w?: number; h?: number; stroke?: number}> = ({p, w = 860, h = 300, stroke = 12}) => {
  const n = PTS.length;
  const xy = PTS.map((v, i) => [(i / (n - 1)) * w, h - (0.08 + v * 0.84) * h] as const);
  const upTo = Math.max(2, Math.round(p * (n - 1)) + 1);
  const shown = xy.slice(0, upTo);
  const last = shown[shown.length - 1];
  const sIdx = 3;
  const up = shown.slice(0, Math.min(shown.length, sIdx + 1));
  const down = shown.length > sIdx ? shown.slice(sIdx) : [];
  const d = (a: readonly (readonly number[])[]) => a.map((q, i) => `${i ? 'L' : 'M'}${q[0]} ${q[1]}`).join(' ');
  return (
    <svg width={w + 40} height={h + 40} viewBox={`-20 -20 ${w + 40} ${h + 40}`} style={{overflow: 'visible'}}>
      <path d={d(up)} stroke={P.mint} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {down.length > 1 && <path d={d(down)} stroke={P.coral} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
      <circle cx={last[0]} cy={last[1]} r={stroke * 1.3} fill={down.length > 1 ? P.coral : P.mint} />
    </svg>
  );
};

const HookBase: React.FC<{p: number}> = ({p}) => (
  <>
    <div style={{...center(235), ...txt(46, 600, P.mute, 0.2)}}>ANTHROPIC · SU DEBUT EN BOLSA</div>
    <div style={{...center(320), ...txt(250, 800, P.mint, -0.05)}}>+17 %</div>
    <div style={{...center(640)}}>
      <Line p={p} />
    </div>
  </>
);

const S1: React.FC = () => (
  <Scene a={A[0]} b={A[1]} kind="none" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const p = easeIO(prog(t, 0.2, 2.6));
      const punch = spr(f, T(2) + 0.05, 7, 260, 0.5);
      return (
        <AbsoluteFill style={{transform: `scale(${lerp(1.07, 1, easeOut(lt / 0.5))}) translate(${punch > 0.05 && punch < 0.98 ? Math.sin(f * 2.4) * 8 * (1 - punch) : 0}px,0)`}}>
          <HookBase p={p} />
          <Pop at={T(5)} rot={-4} style={abs(130, 930)}>
            <div style={{...txt(100, 800, P.ink, 0), background: P.mint, padding: '10px 40px', borderRadius: 26, boxShadow: '0 24px 44px rgba(0,0,0,0.4)'}}>SU DEBUT</div>
          </Pop>
          <Rise at={T(7) + 0.2} style={center(1110)}>
            <Chip size={30}>CIERRE · 19 NOV 2026</Chip>
          </Rise>
        </AbsoluteFill>
      );
    }}
  </Scene>
);

const S2: React.FC = () => (
  <Scene a={A[1]} b={A[2]} kind="left" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const o = easeOut(prog(t, T(10), T(14)));
      const c = easeOut(prog(t, T(19), T(21) + 0.3));
      return (
        <>
          <Rise at={A[1] + 0.05} dy={30} style={{...abs(80, 215), ...txt(40, 700, P.mute, 0.16)}}>PRECIO POR ACCIÓN · 19 NOV</Rise>
          <div style={{...abs(80, 300), ...txt(46, 600, P.mute, 0.1)}}>APERTURA vs. OFERTA</div>
          <div style={{...abs(80, 360), ...txt(210, 800, P.mint, -0.05)}}>{`+${(o * 34.3).toFixed(0)} %`}</div>
          <div style={{...abs(80, 640), ...txt(46, 600, P.mute, 0.1)}}>CIERRE vs. APERTURA</div>
          <div style={{...abs(80, 700), ...txt(210, 800, P.coral, -0.05)}}>{`−${(c * 12.9).toFixed(0)} %`}</div>
          <Rise at={T(21) + 0.2} dy={60} style={abs(90, 1010, 900)}>
            <Card style={{padding: '26px 40px'}}>
              <div style={{...txt(38, 700, P.ink, 0), whiteSpace: 'normal'}}>Oferta $83 · abrió $111.50 · cerró $97.17</div>
            </Card>
          </Rise>
          {SRC('EXPANSIÓN · INFOBAE · BLOOMBERG LÍNEA', 1400, T(22))}
        </>
      );
    }}
  </Scene>
);

const S3: React.FC = () => {
  const its = [
    {n: '01', l: 'Precio de salida', c: P.amber},
    {n: '02', l: 'Lo que recaudó', c: P.mint},
    {n: '03', l: 'Tu dinero', c: P.sky},
  ];
  return (
    <Scene a={A[2]} b={A[3]} kind="up" out="left">
      {(lt, f) => (
        <>
          <Mask at={A[2] + 0.02} size={380} color={P.amber} style={center(200)}>3</Mask>
          <Mask at={T(28) - 0.1} size={120} style={center(580)}>CIFRAS</Mask>
          {its.map((it, k) => {
            const p = spr(f, T(29) + k * 0.25, 11, 200, 0.6);
            return (
              <div key={k} style={{...abs(90, 740 + k * 170, 900), height: 145, borderRadius: 36, background: 'rgba(255,255,255,0.09)', border: '3px solid rgba(255,255,255,0.28)', display: 'flex', alignItems: 'center', gap: 34, padding: '0 44px', boxSizing: 'border-box', transform: `translateX(${(1 - p) * -300}px)`, opacity: cl(p * 2)}}>
                <div style={{...txt(84, 800, it.c)}}>{it.n}</div>
                <div style={{...txt(56, 700, P.white, 0)}}>{it.l}</div>
              </div>
            );
          })}
        </>
      )}
    </Scene>
  );
};

const S4: React.FC = () => (
  <Scene a={A[3]} b={A[4]} kind="zoom" out="left">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(33) - 0.1, T(36)));
      const punch = spr(f, T(36) + 0.05, 7, 260, 0.5);
      return (
        <>
          <div style={{...center(200), ...txt(60, 700, P.mute, 0.2)}}>UNO</div>
          <div style={{...center(280), ...txt(330, 800, P.amber, -0.05), transform: `scale(${lerp(1.1, 1, punch)})`}}>{`$${Math.round(c * 83)}`}</div>
          <Mask at={T(37)} size={84} style={center(660)}>PRECIO DE SALIDA</Mask>
          <Rise at={T(40)} dy={60} style={abs(90, 880, 900)}>
            <Card style={{padding: '30px 44px'}}>
              <div style={{...txt(34, 600, 'rgba(10,15,31,0.55)', 0.08)}}>POR ACCIÓN · 18 NOV</div>
              <div style={{...txt(56, 800, P.ink, -0.02), whiteSpace: 'normal', marginTop: 6}}>Quien compró a ese precio ganó 17.1 % al cierre</div>
            </Card>
          </Rise>
          {SRC('EXPANSIÓN · INFOBAE (+17.1 %)', 1400, T(41))}
        </>
      );
    }}
  </Scene>
);

const S5: React.FC = () => (
  <Scene a={A[4]} b={A[5]} kind="zoom" out="left">
    {(lt, f) => {
      const t = f / FPS;
      const b1 = easeOut(prog(t, T(47) - 0.1, T(50) + 0.2));
      const b2 = easeOut(prog(t, T(54) - 0.1, T(58) + 0.4));
      return (
        <>
          <Pop at={A[4] + 0.05} rot={-3} style={abs(90, 200)}>
            <div style={{...txt(46, 800, P.ink, 0.04), background: P.amber, padding: '10px 30px', borderRadius: 18}}>EJEMPLO HIPOTÉTICO</div>
          </Pop>
          <Mask at={T(44) - 0.1} size={110} style={abs(80, 330)}>POR ACCIÓN</Mask>
          <div style={{...abs(80, 520, 920)}}>
            <div style={{...txt(34, 600, P.mute, 0.1), marginBottom: 10}}>COMPRA A LA APERTURA</div>
            <div style={{height: 100, borderRadius: 22, width: `${b1 * 100}%`, background: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', paddingLeft: 24, boxSizing: 'border-box'}}><span style={{...txt(50, 800, P.ink, 0)}}>{b1 > 0.6 ? '$111.50' : ''}</span></div>
            <div style={{...txt(34, 600, P.coral, 0.1), margin: '40px 0 10px'}}>VENTA AL CIERRE</div>
            <div style={{height: 100, borderRadius: 22, width: `${b2 * 87.1}%`, background: P.coral, display: 'flex', alignItems: 'center', paddingLeft: 24, boxSizing: 'border-box'}}><span style={{...txt(50, 800, P.white, 0)}}>{b2 > 0.6 ? '$97.17' : ''}</span></div>
          </div>
          <Pop at={T(61)} rot={-4} style={abs(110, 1000)}>
            <div style={{...txt(120, 800, P.white, 0), background: P.coral, padding: '10px 40px', borderRadius: 26, boxShadow: '0 24px 44px rgba(0,0,0,0.4)'}}>−12.9 %</div>
          </Pop>
          <Rise at={T(62)} dy={30} style={abs(80, 1260, 920)}>
            <div style={{...txt(34, 500, P.mute, 0), whiteSpace: 'normal'}}>Base: 97.17 ÷ 111.50 − 1. Ejemplo, no recomendación.</div>
          </Rise>
        </>
      );
    }}
  </Scene>
);

const S6: React.FC = () => (
  <Scene a={A[5]} b={A[6]} kind="left" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(66), T(72)));
      const punch = spr(f, T(77) - 0.05, 7, 260, 0.5);
      return (
        <>
          <div style={{...center(200), ...txt(60, 700, P.mute, 0.2)}}>DOS</div>
          <Rise at={A[5] + 0.05} dy={30} style={{...abs(80, 290), ...txt(36, 700, P.mute, 0.1)}}>LO QUE RECAUDÓ · MILLONES DE DÓLARES</Rise>
          <div style={{...abs(80, 360), ...txt(250, 800, P.amber, -0.05)}}>{`$${Math.round(c * 81300).toLocaleString('en-US')}`}</div>
          <Mask at={T(73) - 0.1} size={84} style={abs(80, 690)}>EN SU SALIDA A BOLSA</Mask>
          <Pop at={T(77)} rot={-4} style={abs(110, 880)}>
            <div style={{...txt(110, 800, P.ink, 0), background: P.mint, padding: '10px 40px', borderRadius: 26, boxShadow: '0 24px 44px rgba(0,0,0,0.4)', transform: `scale(${lerp(1.1, 1, punch)})`}}>RÉCORD</div>
          </Pop>
          <Rise at={T(78)} dy={60} style={abs(90, 1100, 900)}>
            <Card style={{padding: '26px 40px'}}>
              <div style={{...txt(36, 700, P.ink, 0), whiteSpace: 'normal'}}>Superó la salida a bolsa de SpaceX (junio de 2026)</div>
            </Card>
          </Rise>
          {SRC('EXPANSIÓN ($81,300 MILLONES) · INFOBAE', 1400, T(78) + 0.3)}
        </>
      );
    }}
  </Scene>
);

const S7: React.FC = () => (
  <Scene a={A[6]} b={A[7]} kind="up" out="zoom">
    {(lt, f) => (
      <>
        <Mask at={A[6] + 0.02} size={420} color={P.amber} style={center(220)}>3</Mask>
        <Mask at={T(84) - 0.15} size={150} style={center(700)}>TU DINERO</Mask>
        <Pop at={T(83)} rot={-3} style={center(930)}>
          <div style={{...txt(58, 800, P.ink, 0.02), background: P.mint, padding: '12px 36px', borderRadius: 22}}>EL QUE MÁS IMPORTA</div>
        </Pop>
      </>
    )}
  </Scene>
);

const S8: React.FC = () => (
  <Scene a={A[7]} b={A[8]} kind="zoom" out="left">
    {(lt, f) => {
      const t = f / FPS;
      const n = Math.min(6, Math.floor(prog(t, T(100) - 0.1, T(102) + 0.3) * 6.99));
      return (
        <>
          <Rise at={A[7] + 0.05} dy={30} style={{...abs(80, 215), ...txt(40, 700, P.mute, 0.16)}}>S&P 500 · MISMO DÍA</Rise>
          <Mask at={T(95) - 0.1} size={250} color={P.coral} style={center(290)}>−2 %</Mask>
          <Rise at={T(97)} dy={50} style={abs(90, 640, 900)}>
            <Card style={{padding: '28px 44px'}}>
              <div style={{...txt(34, 600, 'rgba(10,15,31,0.55)', 0.08)}}>CIERRE DEL 19 NOV</div>
              <div style={{...txt(100, 800, P.ink, -0.03)}}>7,176 puntos</div>
              <div style={{...txt(36, 600, P.coral, 0)}}>8.2 % bajo su récord de octubre</div>
            </Card>
          </Rise>
          <div style={{...abs(110, 1020), width: 860, display: 'flex', gap: 18}}>
            {[0, 1, 2, 3, 4, 5].map((k) => {
              const on = n > k;
              return <div key={k} style={{flex: 1, height: 130, borderRadius: 20, background: on ? P.coral : 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...txt(60, 800, on ? P.white : P.mute, 0)}}>{k + 1}</div>;
            })}
          </div>
          <Rise at={T(100)} dy={20} style={abs(110, 1180)}>
            <div style={{...txt(40, 700, P.white, 0)}}>6 caídas seguidas: la racha más larga desde 2024</div>
          </Rise>
          {SRC('INFOBAE · EXPANSIÓN', 1400, T(102))}
        </>
      );
    }}
  </Scene>
);

const S9: React.FC = () => (
  <Scene a={A[8]} b={A[9]} kind="left" out="up">
    {(lt, f) => (
      <>
        <Rise at={A[8] + 0.05} dy={30} style={{...abs(80, 215), ...txt(40, 700, P.mute, 0.16)}}>LA ADVERTENCIA DE UN ANALISTA</Rise>
        <Mask at={T(104) - 0.1} size={104} color={P.amber} style={center(300)}>GRANDES SALIDAS</Mask>
        <Mask at={T(108) - 0.1} size={104} style={center(430)}>A BOLSA</Mask>
        <Rise at={T(112)} dy={60} style={abs(90, 660, 900)}>
          <Card style={{padding: '34px 44px'}}>
            <div style={{...txt(36, 600, 'rgba(10,15,31,0.55)', 0.08)}}>CAPITAL ECONOMICS (VÍA INFOBAE)</div>
            <div style={{...txt(58, 800, P.ink, -0.02), whiteSpace: 'normal', marginTop: 6}}>A menudo coinciden con los máximos del mercado</div>
          </Card>
        </Rise>
        <Pop at={T(118)} rot={-3} style={abs(110, 1050)}>
          <div style={{...txt(80, 800, P.ink, 0), background: P.amber, padding: '10px 36px', borderRadius: 22}}>NO ES PRONÓSTICO</div>
        </Pop>
      </>
    )}
  </Scene>
);

const S10: React.FC = () => {
  const items = [
    {l: 'FONDOS DE ACCIONES', c: P.sky, at: 126},
    {l: 'PUEDE SUBIR O BAJAR', c: P.mint, at: 131},
    {l: 'CUÁNTO EN TECNOLOGÍA', c: P.amber, at: 137},
  ];
  return (
    <Scene a={A[9]} b={ANT_TOTAL + 1} kind="up" out="none">
      {(lt, f) => {
        const t = f / FPS;
        const back = easeIO(prog(t, T(141) - 0.1, ANT_TOTAL - 0.2));
        return (
          <>
            <div style={{opacity: 1 - cl(back * 2.2), transform: `translateY(${back * 260}px) scale(${1 - back * 0.3})`}}>
              <Mask at={A[9] + 0.05} size={104} style={abs(80, 215)}>¿CUÁNTO DE TU</Mask>
              <Mask at={A[9] + 0.2} size={104} color={P.amber} style={abs(80, 330)}>AHORRO ES TECH?</Mask>
              {items.map((it, k) => {
                const p = spr(f, T(it.at) - 0.1, 11, 200, 0.6);
                return (
                  <div key={k} style={{...abs(90, 560 + k * 230, 900), height: 190, borderRadius: 40, background: it.c, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p})`, opacity: cl(p * 2), boxShadow: '0 24px 44px rgba(0,0,0,0.4)'}}>
                    <span style={{...txt(it.l.length > 16 ? 50 : 62, 800, P.ink, 0)}}>{it.l}</span>
                  </div>
                );
              })}
              <Rise at={T(139)} dy={20} style={abs(90, 1225, 900)}>
                <div style={{...txt(34, 600, P.mute, 0.02)}}>¿Comprarías en un debut? Cuéntame en comentarios.</div>
              </Rise>
            </div>
            <div style={{opacity: cl((back - 0.45) / 0.55), transform: `scale(${lerp(0.8, 1, back)})`, transformOrigin: '50% 40%'}}>
              <HookBase p={1} />
            </div>
          </>
        );
      }}
    </Scene>
  );
};

const MOOD_AT = [
  {at: 0, mood: 'forest'},
  {at: A[2], mood: 'navy'},
  {at: A[4], mood: 'plum'},
  {at: A[5], mood: 'steel'},
  {at: A[7], mood: 'ember'},
  {at: A[9], mood: 'forest'},
];
const PASOS = [
  {at: A[2], label: '1 DE 3'},
  {at: A[3], label: '1 DE 3'},
  {at: A[5], label: '2 DE 3'},
  {at: A[6], label: '3 DE 3'},
  {at: A[9], label: ''},
];

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const p = spr(f, A[5] + 0.6, 12, 200, 0.6);
  if (t < A[5] + 0.6 || t > A[9]) return null;
  return (
    <div style={{position: 'absolute', right: 70, top: 160, transform: `translateX(${(1 - p) * 200}px)`, opacity: cl(p * 2)}}>
      <Chip bg={P.white} color={P.ink} size={26}>＋ SÍGUEME</Chip>
    </div>
  );
};

export const AnthropicDebutMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={MOOD_AT} />
    <S1 /><S2 /><S3 /><S4 /><S5 /><S6 /><S7 /><S8 /><S9 /><S10 />
    <Grain />
    <Frame serie="NOTICIA · 20 NOV" total={ANT_TOTAL} pasos={PASOS} nota="Contenido educativo, no es recomendación de inversión. Fuentes: Expansión, Infobae, El Financiero, Bloomberg Línea. Ejemplo hipotético; el valor puede subir o bajar." />
    <Cta />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('anthropic-debut/voz_mix.wav')} />}
  </AbsoluteFill>
);

export const AnthropicDebutCover: React.FC = () => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={[{at: 0, mood: 'forest'}]} />
    <div style={{...center(210), ...txt(62, 600, P.mute, 0.28)}}>ANTHROPIC EN BOLSA</div>
    <div style={{...center(290), ...txt(330, 800, P.mint, -0.05)}}>+17 %</div>
    <div style={{...center(640)}}><Line p={1} /></div>
    <div style={{...center(1020), transform: 'rotate(-4deg)'}}>
      <div style={{...txt(120, 800, P.ink, -0.02), background: P.mint, padding: '6px 46px 0', borderRadius: 30, border: `10px solid ${P.ink}`, outline: `10px solid ${P.mint}`}}>SU DEBUT</div>
    </div>
    <div style={{...center(1230)}}><div style={{...txt(60, 700, P.white, 0)}}>abrió +34 %, cerró +17 %</div></div>
    <div style={{...center(1370)}}><Chip size={30}>NOTICIA · 20 NOV</Chip></div>
    <Grain />
  </AbsoluteFill>
);

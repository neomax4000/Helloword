// NOTICIA · 21 NOV — El Nasdaq se desploma 5 % (cierre del 20 nov) (Estándar Pro)
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/viernes-negro/words.json';
import {Backdrop, Captions, Card, Chip, FONT, FPS, Frame, Grain, Mask, P, Pop, Rise, Scene, Wd, buildGroups, cl, easeIO, easeOut, lerp, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const VN_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1));
const groups = buildGroups(words, blocks);
const KEYS = ['NASDAQ','CINCO','GANANCIAS','TRES','CORRECCIÓN','DINERO','DÓLAR','DIECINUEVE','AFORE','FONDOS','CUENTA','PRONÓSTICO','BAJAR','TRES','SIETE','VEINTIOCHO'];

const abs = (x: number, y: number, w?: number): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w});
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
const txt = (size: number, weight = 800, color = P.white, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});
const SRC = (s: string, y: number, at: number) => (
  <Rise at={at} dy={30} style={abs(80, y)}>
    <div style={{...txt(26, 600, P.mute, 0.04)}}>{`FUENTES: ${s}`}</div>
  </Rise>
);

/* línea del Nasdaq cayendo */
const PTS = [1.0, 0.96, 0.98, 0.9, 0.78, 0.66, 0.52, 0.34, 0.1];
const Line: React.FC<{p: number; w?: number; h?: number; stroke?: number}> = ({p, w = 860, h = 300, stroke = 12}) => {
  const n = PTS.length;
  const xy = PTS.map((v, i) => [(i / (n - 1)) * w, h - (0.08 + v * 0.84) * h] as const);
  const upTo = Math.max(2, Math.round(p * (n - 1)) + 1);
  const shown = xy.slice(0, upTo);
  const last = shown[shown.length - 1];
  const d = shown.map((q, i) => `${i ? 'L' : 'M'}${q[0]} ${q[1]}`).join(' ');
  return (
    <svg width={w + 40} height={h + 40} viewBox={`-20 -20 ${w + 40} ${h + 40}`} style={{overflow: 'visible'}}>
      <path d={d} stroke={P.coral} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r={stroke * 1.3} fill={P.coral} />
    </svg>
  );
};

const HookBase: React.FC<{p: number}> = ({p}) => (
  <>
    <div style={{...center(235), ...txt(46, 600, P.mute, 0.2)}}>NASDAQ · CIERRE 20 NOV</div>
    <div style={{...center(320), ...txt(250, 800, P.coral, -0.05)}}>−5.28 %</div>
    <div style={{...center(640)}}>
      <Line p={p} />
    </div>
  </>
);

const S1: React.FC = () => (
  <Scene a={A[0]} b={A[1]} kind="none" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const p = easeIO(prog(t, 0.2, 2.4));
      const punch = spr(f, T(5) + 0.05, 7, 260, 0.5);
      return (
        <AbsoluteFill style={{transform: `scale(${lerp(1.07, 1, easeOut(lt / 0.5))}) translate(${punch > 0.05 && punch < 0.98 ? Math.sin(f * 2.4) * 8 * (1 - punch) : 0}px,0)`}}>
          <HookBase p={p} />
          <Pop at={T(4)} rot={-4} style={abs(130, 930)}>
            <div style={{...txt(100, 800, P.white, 0), background: P.coral, padding: '10px 40px', borderRadius: 26, boxShadow: '0 24px 44px rgba(0,0,0,0.4)'}}>EN UN DÍA</div>
          </Pop>
          <Rise at={T(7) - 0.2} style={center(1110)}>
            <Chip size={30}>AYER · VIERNES 20 NOV 2026</Chip>
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
      const g = 1 - easeIO(prog(t, T(9), T(15)));
      return (
        <>
          <Rise at={A[1] + 0.05} dy={30} style={{...abs(80, 215), ...txt(40, 700, P.mute, 0.16)}}>NASDAQ · LO QUE LLEVABA EN EL AÑO</Rise>
          <Mask at={T(9) - 0.1} size={150} color={P.coral} style={center(330)}>BORRÓ</Mask>
          <Mask at={T(12) - 0.1} size={150} style={center(490)}>TODO 2026</Mask>
          <div style={{...abs(110, 780, 860)}}>
            <div style={{...txt(34, 600, P.mute, 0.1), marginBottom: 14}}>GANANCIA ACUMULADA EN 2026</div>
            <div style={{height: 110, borderRadius: 24, background: 'rgba(255,255,255,0.12)', overflow: 'hidden'}}>
              <div style={{height: '100%', width: `${g * 100}%`, background: g > 0.02 ? P.mint : P.coral, borderRadius: 24}} />
            </div>
            <div style={{...txt(54, 800, g > 0.02 ? P.mint : P.coral, 0), marginTop: 22}}>{g > 0.02 ? 'Se va achicando…' : 'Quedó en cero'}</div>
          </div>
          <Rise at={T(14)} dy={60} style={abs(90, 1130, 900)}>
            <Card style={{padding: '24px 40px'}}>
              <div style={{...txt(36, 700, P.ink, 0), whiteSpace: 'normal'}}>El Nasdaq borró sus ganancias de 2026 este viernes</div>
            </Card>
          </Rise>
          {SRC('EXPANSIÓN (AFP) · DESCIFRADO', 1440, T(15))}
        </>
      );
    }}
  </Scene>
);

const S3: React.FC = () => {
  const its = [
    {n: '01', l: 'El Nasdaq', c: P.coral},
    {n: '02', l: 'El S&P 500', c: P.amber},
    {n: '03', l: 'Tu dinero', c: P.sky},
  ];
  return (
    <Scene a={A[2]} b={A[3]} kind="up" out="left">
      {(lt, f) => (
        <>
          <Mask at={A[2] + 0.02} size={380} color={P.amber} style={center(200)}>3</Mask>
          <Mask at={T(18) - 0.1} size={120} style={center(580)}>CIFRAS</Mask>
          {its.map((it, k) => {
            const p = spr(f, T(19) + k * 0.25, 11, 200, 0.6);
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
      const c = easeOut(prog(t, T(26) - 0.1, T(29) + 0.2));
      const punch = spr(f, T(30) - 0.05, 7, 260, 0.5);
      return (
        <>
          <div style={{...center(200), ...txt(60, 700, P.mute, 0.2)}}>UNO</div>
          <div style={{...center(300), ...txt(250, 800, P.coral, -0.05), transform: `scale(${lerp(1.1, 1, punch)})`}}>{`−${(c * 5.28).toFixed(2)} %`}</div>
          <Mask at={T(24) - 0.1} size={84} style={center(640)}>NASDAQ COMPOSITE</Mask>
          <Rise at={T(30)} dy={60} style={abs(90, 860, 900)}>
            <Card style={{padding: '30px 44px'}}>
              <div style={{...txt(34, 600, 'rgba(10,15,31,0.55)', 0.08)}}>CIERRE · VIERNES 20 NOV</div>
              <div style={{...txt(56, 800, P.ink, -0.02), whiteSpace: 'normal', marginTop: 6}}>Borró todo lo ganado en 2026</div>
            </Card>
          </Rise>
          {SRC('EXPANSIÓN (AFP): −5.28 % · INFOBAE: −5.28 %', 1440, T(30) + 0.3)}
        </>
      );
    }}
  </Scene>
);

const S5: React.FC = () => (
  <Scene a={A[4]} b={A[5]} kind="left" out="zoom">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(38) - 0.1, T(40) + 0.2));
      const punch = spr(f, T(45) - 0.1, 7, 260, 0.5);
      return (
        <>
          <div style={{...center(200), ...txt(60, 700, P.mute, 0.2)}}>DOS</div>
          <div style={{...center(300), ...txt(250, 800, P.coral, -0.05)}}>{`−${(c * 3.7).toFixed(1)} %`}</div>
          <Mask at={T(33) - 0.1} size={84} style={center(640)}>S&P 500</Mask>
          <Pop at={T(44)} rot={-4} style={abs(100, 800)}>
            <div style={{...txt(96, 800, P.ink, 0), background: P.amber, padding: '10px 40px', borderRadius: 26, boxShadow: '0 24px 44px rgba(0,0,0,0.4)', transform: `scale(${lerp(1.1, 1, punch)})`}}>EN CORRECCIÓN</div>
          </Pop>
          <Rise at={T(45) + 0.2} dy={50} style={abs(90, 1010, 900)}>
            <Card style={{padding: '26px 44px'}}>
              <div style={{...txt(34, 600, 'rgba(10,15,31,0.55)', 0.08)}}>EL MISMO DÍA</div>
              <div style={{...txt(52, 800, P.ink, -0.02), whiteSpace: 'normal'}}>Dow Jones: −1.9 %</div>
            </Card>
          </Rise>
          {SRC('EXPANSIÓN (AFP) · INFOBAE', 1440, T(45) + 0.4)}
        </>
      );
    }}
  </Scene>
);

const S6: React.FC = () => (
  <Scene a={A[5]} b={A[6]} kind="up" out="left">
    {(lt, f) => {
      const t = f / FPS;
      const drop = easeIO(prog(t, T(48), T(51) + 0.2));
      const h = 330;
      const y = h * (1 - 0.8 * drop + 0);
      return (
        <>
          <Rise at={A[5] + 0.05} dy={30} style={{...abs(80, 215), ...txt(40, 700, P.mute, 0.16)}}>¿QUÉ ES UNA CORRECCIÓN?</Rise>
          <div style={{...abs(150, 330), width: 780, height: 420}}>
            <div style={{position: 'absolute', left: 0, top: 0, ...txt(34, 700, P.mint, 0.08)}}>MÁXIMO</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 70, borderTop: `4px dashed ${P.mint}`}} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 70 + h * 0.2, borderTop: `4px dashed ${P.amber}`, opacity: cl((t - T(49)) * 3)}} />
            <div style={{position: 'absolute', right: 0, top: 70 + h * 0.2 - 50, ...txt(40, 800, P.amber, 0), opacity: cl((t - T(49)) * 3)}}>−10 %</div>
            <div style={{position: 'absolute', left: 300, top: 70, width: 170, height: h * 0.8 * drop + 10, background: drop > 0.99 ? P.coral : 'rgba(255,255,255,0.4)', borderRadius: 20}} />
          </div>
          <Rise at={T(46) + 0.2} dy={60} style={abs(90, 860, 900)}>
            <Card style={{padding: '30px 44px'}}>
              <div style={{...txt(34, 600, 'rgba(10,15,31,0.55)', 0.08)}}>DEFINICIÓN</div>
              <div style={{...txt(54, 800, P.ink, -0.02), whiteSpace: 'normal', marginTop: 6}}>Caer 10 % o más desde el máximo</div>
            </Card>
          </Rise>
          {SRC('EXPANSIÓN: S&P 500 «ENTRÓ EN CORRECCIÓN»', 1440, T(53))}
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
        <Mask at={T(64) - 0.15} size={150} style={center(700)}>TU DINERO</Mask>
        <Pop at={T(61)} rot={-3} style={center(930)}>
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
      const c = easeOut(prog(t, T(69) - 0.1, T(72)));
      return (
        <>
          <Rise at={A[7] + 0.05} dy={30} style={{...abs(80, 215), ...txt(40, 700, P.mute, 0.16)}}>PESOS POR DÓLAR · 20 NOV</Rise>
          <div style={{...abs(80, 300), ...txt(300, 800, P.amber, -0.05)}}>{`$${(c * 19.17).toFixed(2)}`}</div>
          <Mask at={T(67) - 0.1} size={96} style={abs(80, 640)}>EL DÓLAR SUBE</Mask>
          <Rise at={T(71)} dy={60} style={abs(90, 860, 900)}>
            <Card style={{padding: '30px 44px'}}>
              <div style={{...txt(34, 600, 'rgba(10,15,31,0.55)', 0.08)}}>SI PAGAS EN DÓLARES</div>
              <div style={{...txt(52, 800, P.ink, -0.02), whiteSpace: 'normal', marginTop: 6}}>Cada dólar te cuesta más pesos</div>
            </Card>
          </Rise>
          {SRC('EXPANSIÓN (19.17) · BLOOMBERG LÍNEA (PESO ARRIBA DE 19)', 1440, T(72))}
        </>
      );
    }}
  </Scene>
);

const S9: React.FC = () => {
  const items = [
    {l: 'TU AFORE', c: P.sky, at: 74},
    {l: 'TUS FONDOS', c: P.mint, at: 77},
    {l: '¿BOLSA DE EE. UU.?', c: P.amber, at: 80},
  ];
  return (
    <Scene a={A[8]} b={A[9]} kind="up" out="left">
      {(lt, f) => (
        <>
          <Mask at={A[8] + 0.02} size={84} style={abs(80, 265)}>REVISA CUÁNTO</Mask>
          {items.map((it, k) => {
            const p = spr(f, T(it.at) - 0.1, 11, 200, 0.6);
            return (
              <div key={k} style={{...abs(90, 440 + k * 225, 900), height: 185, borderRadius: 40, background: it.c, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p})`, opacity: cl(p * 2), boxShadow: '0 24px 44px rgba(0,0,0,0.4)'}}>
                <span style={{...txt(it.l.length > 14 ? 54 : 70, 800, P.ink, 0)}}>{it.l}</span>
              </div>
            );
          })}
          <Rise at={T(87)} dy={60} style={abs(90, 1140, 900)}>
            <Card style={{padding: '26px 44px'}}>
              <div style={{...txt(34, 600, 'rgba(10,15,31,0.55)', 0.08)}}>DÓNDE LO VES</div>
              <div style={{...txt(50, 800, P.ink, -0.02), whiteSpace: 'normal'}}>En tu estado de cuenta</div>
            </Card>
          </Rise>
        </>
      )}
    </Scene>
  );
};

const S10: React.FC = () => (
  <Scene a={A[9]} b={A[10]} kind="left" out="up">
    {(lt, f) => (
      <>
        <Mask at={A[9] + 0.05} size={104} color={P.amber} style={center(260)}>UNA CAÍDA</Mask>
        <Mask at={T(93) - 0.1} size={104} style={center(390)}>NO ES UN</Mask>
        <Pop at={T(96)} rot={-3} style={abs(110, 560)}>
          <div style={{...txt(100, 800, P.ink, 0), background: P.amber, padding: '10px 36px', borderRadius: 22}}>PRONÓSTICO</div>
        </Pop>
        <Rise at={T(98)} dy={60} style={abs(90, 860, 900)}>
          <Card style={{padding: '34px 44px'}}>
            <div style={{...txt(58, 800, P.ink, -0.02), whiteSpace: 'normal'}}>El valor puede subir o bajar</div>
          </Card>
        </Rise>
        <Rise at={T(100)} dy={30} style={abs(90, 1130, 900)}>
          <div style={{...txt(34, 600, P.mute, 0.02), whiteSpace: 'normal'}}>No es recomendación de compra ni de venta.</div>
        </Rise>
      </>
    )}
  </Scene>
);

const S11: React.FC = () => {
  const items = [
    {l: 'AFORE', c: P.sky, at: 105},
    {l: 'FONDOS', c: P.mint, at: 106},
    {l: 'ESTADO DE CUENTA', c: P.amber, at: 108},
  ];
  return (
    <Scene a={A[10]} b={VN_TOTAL + 1} kind="up" out="none">
      {(lt, f) => {
        const t = f / FPS;
        const back = easeIO(prog(t, T(107) - 0.1, VN_TOTAL - 0.2));
        return (
          <>
            <div style={{opacity: 1 - cl(back * 2.2), transform: `translateY(${back * 260}px) scale(${1 - back * 0.3})`}}>
              <Mask at={A[10] + 0.05} size={104} style={abs(80, 215)}>ANTES DE</Mask>
              <Mask at={A[10] + 0.2} size={104} color={P.amber} style={abs(80, 330)}>ASUSTARTE</Mask>
              {items.map((it, k) => {
                const p = spr(f, T(it.at) - 0.1, 11, 200, 0.6);
                return (
                  <div key={k} style={{...abs(90, 540 + k * 220, 900), height: 180, borderRadius: 40, background: it.c, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p})`, opacity: cl(p * 2), boxShadow: '0 24px 44px rgba(0,0,0,0.4)'}}>
                    <span style={{...txt(it.l.length > 10 ? 54 : 70, 800, P.ink, 0)}}>{it.l}</span>
                  </div>
                );
              })}
              <Rise at={T(108)} dy={20} style={abs(90, 1225, 900)}>
                <div style={{...txt(34, 600, P.mute, 0.02)}}>¿Sabes cuánto de tu ahorro está en bolsa? Cuéntame en comentarios.</div>
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
  {at: 0, mood: 'ember'},
  {at: A[2], mood: 'navy'},
  {at: A[5], mood: 'plum'},
  {at: A[6], mood: 'steel'},
  {at: A[8], mood: 'forest'},
  {at: A[10], mood: 'ember'},
];
const PASOS = [
  {at: A[3], label: '1 DE 3'},
  {at: A[4], label: '2 DE 3'},
  {at: A[6], label: '3 DE 3'},
  {at: A[10], label: ''},
];

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const p = spr(f, A[4] + 0.6, 12, 200, 0.6);
  if (t < A[4] + 0.6 || t > A[10]) return null;
  return (
    <div style={{position: 'absolute', right: 70, top: 160, transform: `translateX(${(1 - p) * 200}px)`, opacity: cl(p * 2)}}>
      <Chip bg={P.white} color={P.ink} size={26}>＋ SÍGUEME</Chip>
    </div>
  );
};

export const ViernesNegroMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={MOOD_AT} />
    <S1 /><S2 /><S3 /><S4 /><S5 /><S6 /><S7 /><S8 /><S9 /><S10 /><S11 />
    <Grain />
    <Frame serie="NOTICIA · 21 NOV" total={VN_TOTAL} pasos={PASOS} nota="Contenido educativo, no es recomendación de inversión. Cierre del 20 nov 2026. Fuentes: Expansión (con información de AFP), Infobae, Descifrado, Bloomberg Línea. El valor puede subir o bajar." />
    <Cta />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('viernes-negro/voz_mix.wav')} />}
  </AbsoluteFill>
);

export const ViernesNegroCover: React.FC = () => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={[{at: 0, mood: 'ember'}]} />
    <div style={{...center(210), ...txt(62, 600, P.mute, 0.28)}}>WALL STREET · 20 NOV</div>
    <div style={{...center(300), ...txt(250, 800, P.coral, -0.05)}}>−5.28 %</div>
    <div style={{...center(620)}}><Line p={1} /></div>
    <div style={{...center(1020), transform: 'rotate(-4deg)'}}>
      <div style={{...txt(120, 800, P.white, -0.02), background: P.coral, padding: '6px 46px 0', borderRadius: 30, border: `10px solid ${P.ink}`, outline: `10px solid ${P.coral}`}}>NASDAQ</div>
    </div>
    <div style={{...center(1230)}}><div style={{...txt(60, 700, P.white, 0)}}>S&P 500 −3.7 % · en corrección</div></div>
    <div style={{...center(1370)}}><Chip size={30}>NOTICIA · 21 NOV</Chip></div>
    <Grain />
  </AbsoluteFill>
);

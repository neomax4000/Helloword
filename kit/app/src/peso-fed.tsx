// NOTICIA · 19 NOV — El peso cayó 2.4 % (Estándar Pro)
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/peso-fed/words.json';
import {Backdrop, Captions, Card, Chip, FONT, FPS, Frame, Grain, Mask, P, Pop, Rise, Scene, Wd, buildGroups, cl, easeIO, easeOut, lerp, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const PF_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1));
const groups = buildGroups(words, blocks);
const KEYS = ['PESO', 'CAYÓ', 'PEOR', 'ABRIL', 'TRES', 'FED', 'TASAS', 'DÓLAR', 'DÓLARES', 'DICIEMBRE', 'VIGILAR', 'PAGAS', 'ATRACTIVO'];

const abs = (x: number, y: number, w?: number): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w});
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
const txt = (size: number, weight = 800, color = P.white, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});
const SRC = (s: string, y: number, at: number) => (
  <Rise at={at} dy={30} style={abs(80, y)}>
    <div style={{...txt(26, 600, P.mute, 0.04)}}>{`FUENTES: ${s}`}</div>
  </Rise>
);

/* línea del peso: estable y se desploma (verde → coral) */
const PTS = [0.74, 0.76, 0.75, 0.77, 0.76, 0.78, 0.77, 0.62, 0.38, 0.2, 0.14];
const Line: React.FC<{p: number; w?: number; h?: number; stroke?: number}> = ({p, w = 860, h = 300, stroke = 12}) => {
  const n = PTS.length;
  const xy = PTS.map((v, i) => [(i / (n - 1)) * w, h - v * h] as const);
  const upTo = Math.max(2, Math.round(p * (n - 1)) + 1);
  const shown = xy.slice(0, upTo);
  const last = shown[shown.length - 1];
  const sIdx = 6;
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

const HookBase: React.FC<{p: number; n: number}> = ({p, n}) => (
  <>
    <div style={{...center(235), ...txt(46, 600, P.mute, 0.2)}}>PESO MEXICANO · 18 NOV</div>
    <div style={{...center(320), ...txt(250, 800, P.coral, -0.05)}}>{`−${n.toFixed(1)} %`}</div>
    <div style={{...center(640)}}>
      <Line p={p} />
    </div>
  </>
);

const S1: React.FC = () => (
  <Scene a={A[0]} b={A[1]} kind="none" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const p = easeIO(prog(t, 0.2, 2.5));
      const n = 2.4;
      const punch = spr(f, T(6) + 0.05, 7, 260, 0.5);
      return (
        <AbsoluteFill style={{transform: `scale(${lerp(1.07, 1, easeOut(lt / 0.5))}) translate(${punch > 0.05 && punch < 0.98 ? Math.sin(f * 2.4) * 8 * (1 - punch) : 0}px,0)`}}>
          <HookBase p={p} n={n} />
          <Pop at={T(2)} rot={-4} style={abs(110, 930)}>
            <div style={{...txt(100, 800, P.white, 0), background: P.coral, padding: '10px 40px', borderRadius: 26, boxShadow: '0 24px 44px rgba(0,0,0,0.4)'}}>CAE EL PESO</div>
          </Pop>
          <Rise at={T(6) + 0.25} style={center(1110)}>
            <Chip size={30}>CIERRE · 18 NOV 2026</Chip>
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
      const dot = spr(f, T(13), 9, 220, 0.6);
      const line = easeOut(prog(t, T(12), T(17)));
      return (
        <>
          <Rise at={A[1] + 0.05} dy={30} style={{...abs(80, 215), ...txt(40, 700, P.mute, 0.16)}}>SESIÓN DEL PESO</Rise>
          <Mask at={T(10) - 0.1} size={190} color={P.coral} style={center(300)}>PEOR DÍA</Mask>
          <Mask at={T(12)} size={100} style={center(540)}>DESDE ABRIL 2025</Mask>
          <div style={{...abs(110, 900), width: 860, height: 220}}>
            <div style={{position: 'absolute', left: 0, top: 70, width: `${line * 100}%`, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.4)'}} />
            <div style={{position: 'absolute', left: 0, top: 40, width: 70, height: 70, borderRadius: 40, background: P.amber, transform: `scale(${dot})`}} />
            <div style={{...txt(40, 700, P.amber, 0.04), position: 'absolute', left: 0, top: 130}}>ABR 2025</div>
            <div style={{position: 'absolute', left: 790, top: 40, width: 70, height: 70, borderRadius: 40, background: P.coral, transform: `scale(${spr(f, T(16), 9, 220, 0.6)})`}} />
            <div style={{...txt(40, 700, P.coral, 0.04), position: 'absolute', right: 0, top: 130}}>18 NOV 2026</div>
          </div>
          <Rise at={T(17) + 0.15} dy={60} style={abs(90, 1180, 900)}>
            <Card style={{padding: '26px 40px'}}>
              <div style={{...txt(38, 700, P.ink, 0), whiteSpace: 'normal'}}>Casi 19 meses sin un día así de malo para el peso.</div>
            </Card>
          </Rise>
          {SRC('N+ · EL HERALDO DE SALTILLO · EXPANSIÓN (−2.43 %)', 1400, T(17) + 0.3)}
        </>
      );
    }}
  </Scene>
);

const S3: React.FC = () => {
  const its = [
    {n: '01', l: 'La Fed', c: P.amber},
    {n: '02', l: 'El dólar', c: P.mint},
    {n: '03', l: 'Qué vigilar', c: P.sky},
  ];
  return (
    <Scene a={A[2]} b={A[3]} kind="up" out="left">
      {(lt, f) => (
        <>
          <Mask at={A[2] + 0.02} size={380} color={P.amber} style={center(200)}>3</Mask>
          <Mask at={T(20) - 0.1} size={120} style={center(580)}>COSAS</Mask>
          {its.map((it, k) => {
            const p = spr(f, T(22) + k * 0.25, 11, 200, 0.6);
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
      const rise = easeIO(prog(t, T(37), T(40) + 0.3));
      const ar = spr(f, T(39), 9, 220, 0.6);
      return (
        <>
          <div style={{...center(200), ...txt(60, 700, P.mute, 0.2)}}>UNO</div>
          <Mask at={A[3] + 0.05} size={330} color={P.amber} style={center(270)}>FED</Mask>
          <Rise at={T(30)} dy={50} style={abs(90, 640, 900)}>
            <Card style={{padding: '30px 44px'}}>
              <div style={{...txt(34, 600, 'rgba(10,15,31,0.55)', 0.08)}}>MINUTAS DE LA REUNIÓN</div>
              <div style={{...txt(58, 800, P.ink, -0.02), whiteSpace: 'normal', marginTop: 6}}>Algunos funcionarios ven un alza mayor a 25 puntos base en diciembre</div>
            </Card>
          </Rise>
          <div style={{...abs(150, 960), width: 780, height: 230}}>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.25)'}} />
            {[0, 1, 2, 3].map((k) => {
              const on = rise * 4 > k;
              return <div key={k} style={{position: 'absolute', left: k * 210, bottom: 0, width: 150, height: 60 + k * 50, borderRadius: 18, background: on ? P.coral : 'rgba(255,255,255,0.12)', transform: `scaleY(${on ? 1 : 0.7})`, transformOrigin: '50% 100%'}} />;
            })}
            <div style={{...txt(52, 800, P.coral, 0.06), position: 'absolute', right: 0, top: -20, opacity: cl(ar * 2)}}>TASAS ↑</div>
          </div>
          {SRC('INVESTING.COM · EXPANSIÓN (18 NOV)', 1400, T(40))}
        </>
      );
    }}
  </Scene>
);

const S5: React.FC = () => {
  const chain = [
    {l: 'TASAS ALTAS EN EE. UU.', c: P.amber, at: 44},
    {l: 'DÓLAR MÁS ATRACTIVO', c: P.mint, at: 49},
    {l: 'PESO CAE', c: P.coral, at: 52},
  ];
  return (
    <Scene a={A[4]} b={A[5]} kind="up" out="zoom">
      {(lt, f) => (
        <>
          <Rise at={A[4] + 0.05} dy={30} style={{...abs(80, 215), ...txt(40, 700, P.mute, 0.16)}}>CÓMO SE CONECTA</Rise>
          {chain.map((it, k) => {
            const p = spr(f, T(it.at) - 0.05, 11, 200, 0.6);
            return (
              <React.Fragment key={k}>
                <div style={{...abs(90, 330 + k * 330, 900), height: 230, borderRadius: 40, background: it.c, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p})`, opacity: cl(p * 2), boxShadow: '0 24px 44px rgba(0,0,0,0.4)'}}>
                  <span style={{...txt(62, 800, P.ink, -0.01)}}>{it.l}</span>
                </div>
                {k < 2 && <div style={{...center(330 + k * 330 + 235), ...txt(80, 800, P.white, 0), opacity: cl(p * 2)}}>↓</div>}
              </React.Fragment>
            );
          })}
          {SRC('BLOOMBERG LÍNEA · GBM · EXPANSIÓN', 1400, T(52))}
        </>
      )}
    </Scene>
  );
};

const S6: React.FC = () => (
  <Scene a={A[5]} b={A[6]} kind="left" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(58), T(64) + 0.3));
      const punch = spr(f, T(64) + 0.1, 7, 260, 0.5);
      return (
        <>
          <div style={{...center(200), ...txt(60, 700, P.mute, 0.2)}}>DOS</div>
          <Rise at={A[5] + 0.05} dy={30} style={{...abs(80, 290), ...txt(36, 700, P.mute, 0.1)}}>USD/MXN · PESOS POR DÓLAR</Rise>
          <div style={{...abs(80, 360), ...txt(280, 800, P.amber, -0.05), transform: `scale(${lerp(1.1, 1, punch)})`, transformOrigin: '0 50%'}}>{`$${(18 + c * 0.88).toFixed(2)}`}</div>
          <Mask at={T(58) - 0.1} size={84} style={abs(80, 720)}>HASTA ESE NIVEL</Mask>
          <Rise at={T(62)} dy={60} style={abs(90, 920, 900)}>
            <Card style={{padding: '30px 44px'}}>
              <div style={{...txt(34, 600, 'rgba(10,15,31,0.55)', 0.08)}}>PESO · CAÍDA DEL DÍA</div>
              <div style={{...txt(130, 800, P.coral, -0.03)}}>−2.43 %</div>
            </Card>
          </Rise>
          {SRC('BLOOMBERG LÍNEA (MÁX. $18.88) · EXPANSIÓN', 1400, T(63))}
        </>
      );
    }}
  </Scene>
);

const S7: React.FC = () => (
  <Scene a={A[6]} b={A[7]} kind="zoom" out="left">
    {(lt, f) => {
      const t = f / FPS;
      const b1 = easeOut(prog(t, T(71) - 0.1, T(74) + 0.2));
      const b2 = easeOut(prog(t, T(76) - 0.1, T(79) + 0.4));
      return (
        <>
          <Pop at={A[6] + 0.05} rot={-3} style={abs(90, 200)}>
            <div style={{...txt(46, 800, P.ink, 0.04), background: P.amber, padding: '10px 30px', borderRadius: 18}}>EJEMPLO HIPOTÉTICO</div>
          </Pop>
          <Mask at={T(67) - 0.1} size={130} style={abs(80, 330)}>1,000 DÓLARES</Mask>
          <div style={{...abs(80, 560, 920)}}>
            <div style={{...txt(34, 600, P.mute, 0.1), marginBottom: 10}}>ANTES</div>
            <div style={{height: 100, borderRadius: 22, width: `${b1 * 97.6}%`, background: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', paddingLeft: 24, boxSizing: 'border-box'}}><span style={{...txt(50, 800, P.ink, 0)}}>{b1 > 0.6 ? '$18,430' : ''}</span></div>
            <div style={{...txt(34, 600, P.coral, 0.1), margin: '40px 0 10px'}}>DESPUÉS</div>
            <div style={{height: 100, borderRadius: 22, width: `${b2 * 100}%`, background: P.coral, display: 'flex', alignItems: 'center', paddingLeft: 24, boxSizing: 'border-box'}}><span style={{...txt(50, 800, P.white, 0)}}>{b2 > 0.6 ? '$18,880' : ''}</span></div>
          </div>
          <Pop at={T(79)} rot={-4} style={abs(110, 1040)}>
            <div style={{...txt(110, 800, P.white, 0), background: P.coral, padding: '10px 40px', borderRadius: 26, boxShadow: '0 24px 44px rgba(0,0,0,0.4)'}}>+$450</div>
          </Pop>
          <Rise at={T(80)} dy={30} style={abs(80, 1260, 920)}>
            <div style={{...txt(34, 500, P.mute, 0), whiteSpace: 'normal'}}>Base: dólar +2.4 % (18,430 × 1.024). Cifras de ejemplo.</div>
          </Rise>
        </>
      );
    }}
  </Scene>
);

const S8: React.FC = () => (
  <Scene a={A[7]} b={A[8]} kind="up" out="zoom">
    {(lt, f) => (
      <>
        <Mask at={A[7] + 0.02} size={420} color={P.amber} style={center(220)}>3</Mask>
        <Mask at={T(88) - 0.15} size={150} style={center(700)}>QUÉ VIGILAR</Mask>
        <Pop at={T(85)} rot={-3} style={center(930)}>
          <div style={{...txt(58, 800, P.ink, 0.02), background: P.mint, padding: '12px 36px', borderRadius: 22}}>EL QUE MÁS TE SIRVE</div>
        </Pop>
      </>
    )}
  </Scene>
);

const S9: React.FC = () => (
  <Scene a={A[8]} b={A[9]} kind="left" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const bar = easeOut(prog(t, T(97), T(101) + 0.2));
      return (
        <>
          <Rise at={A[8] + 0.05} dy={30} style={{...abs(80, 215), ...txt(40, 700, P.mute, 0.16)}}>REUNIÓN DE LA FED</Rise>
          <Mask at={T(95) - 0.1} size={150} color={P.amber} style={center(300)}>DICIEMBRE</Mask>
          <Rise at={T(97)} dy={60} style={abs(90, 640, 900)}>
            <Card style={{padding: '34px 44px'}}>
              <div style={{...txt(36, 600, 'rgba(10,15,31,0.55)', 0.08)}}>AHÍ SE DECIDE</div>
              <div style={{...txt(78, 800, P.ink, -0.02)}}>La tasa de EE. UU.</div>
            </Card>
          </Rise>
          <div style={{...abs(110, 1000), width: 860}}>
            <div style={{...txt(34, 600, P.mute, 0.1), marginBottom: 12}}>SI SUBE MÁS DE LO ESPERADO</div>
            <div style={{height: 24, borderRadius: 12, background: 'rgba(255,255,255,0.2)'}}>
              <div style={{height: 24, borderRadius: 12, width: `${bar * 100}%`, background: P.coral}} />
            </div>
            <div style={{...txt(44, 700, P.white, 0), marginTop: 24, opacity: cl(bar * 2)}}>Puede volver a mover al dólar y al peso.</div>
          </div>
        </>
      );
    }}
  </Scene>
);

const S10: React.FC = () => {
  const items = [
    {l: 'VIAJES', c: P.sky, at: 108},
    {l: 'APPS', c: P.amber, at: 109},
    {l: 'COMPRAS EN LÍNEA', c: P.mint, at: 111},
  ];
  return (
    <Scene a={A[9]} b={PF_TOTAL + 1} kind="up" out="none">
      {(lt, f) => {
        const t = f / FPS;
        const back = easeIO(prog(t, T(114) - 0.1, PF_TOTAL - 0.2));
        return (
          <>
            <div style={{opacity: 1 - cl(back * 2.2), transform: `translateY(${back * 260}px) scale(${1 - back * 0.3})`}}>
              <Mask at={A[9] + 0.05} size={104} style={abs(80, 215)}>¿QUÉ PAGAS</Mask>
              <Mask at={A[9] + 0.2} size={104} color={P.amber} style={abs(80, 330)}>EN DÓLARES?</Mask>
              {items.map((it, k) => {
                const p = spr(f, T(it.at) - 0.1, 11, 200, 0.6);
                return (
                  <div key={k} style={{...abs(90, 560 + k * 230, 900), height: 190, borderRadius: 40, background: it.c, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p})`, opacity: cl(p * 2), boxShadow: '0 24px 44px rgba(0,0,0,0.4)'}}>
                    <span style={{...txt(it.l.length > 8 ? 58 : 76, 800, P.ink, 0)}}>{it.l}</span>
                  </div>
                );
              })}
              <Rise at={T(113)} dy={20} style={abs(90, 1225, 900)}>
                <div style={{...txt(34, 600, P.mute, 0.02)}}>Cuéntame en comentarios.</div>
              </Rise>
            </div>
            <div style={{opacity: cl((back - 0.45) / 0.55), transform: `scale(${lerp(0.8, 1, back)})`, transformOrigin: '50% 40%'}}>
              <HookBase p={1} n={2.4} />
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
  {at: A[4], mood: 'plum'},
  {at: A[6], mood: 'steel'},
  {at: A[7], mood: 'forest'},
  {at: A[9], mood: 'ember'},
];
const PASOS = [
  {at: A[2], label: '1 DE 3'},
  {at: A[5], label: '2 DE 3'},
  {at: A[7], label: '3 DE 3'},
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

export const PesoFedMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={MOOD_AT} />
    <S1 /><S2 /><S3 /><S4 /><S5 /><S6 /><S7 /><S8 /><S9 /><S10 />
    <Grain />
    <Frame serie="NOTICIA · 19 NOV" total={PF_TOTAL} pasos={PASOS} nota="Contenido educativo, no es recomendación de inversión. Fuentes: Expansión, Bloomberg Línea, Investing.com, N+, El Heraldo de Saltillo, GBM. Ejemplo hipotético; el valor puede subir o bajar." />
    <Cta />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('peso-fed/voz_mix.wav')} />}
  </AbsoluteFill>
);

export const PesoFedCover: React.FC = () => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={[{at: 0, mood: 'ember'}]} />
    <div style={{...center(210), ...txt(62, 600, P.mute, 0.28)}}>EL PESO MEXICANO</div>
    <div style={{...center(290), ...txt(330, 800, P.coral, -0.05)}}>−2.4 %</div>
    <div style={{...center(640)}}><Line p={1} /></div>
    <div style={{...center(1020), transform: 'rotate(-4deg)'}}>
      <div style={{...txt(120, 800, P.white, -0.02), background: P.coral, padding: '6px 46px 0', borderRadius: 30, border: `10px solid ${P.ink}`, outline: `10px solid ${P.coral}`}}>PEOR DÍA</div>
    </div>
    <div style={{...center(1230)}}><div style={{...txt(60, 700, P.white, 0)}}>desde abril de 2025</div></div>
    <div style={{...center(1370)}}><Chip size={30}>NOTICIA · 19 NOV</Chip></div>
    <Grain />
  </AbsoluteFill>
);

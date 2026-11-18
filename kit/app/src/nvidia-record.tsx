// NOTICIA · 18 NOV — Nvidia reportó récord y cerró en rojo (Estándar Pro)
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/nvidia-record/words.json';
import {Backdrop, Captions, Card, Chip, FONT, FPS, Frame, Grain, Mask, P, Pop, Rise, Scene, Wd, buildGroups, cl, easeIO, easeOut, lerp, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const NVR_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1));
const groups = buildGroups(words, blocks);
const KEYS = ['RÉCORD', 'ROJO', 'TRES', 'DINERO', 'DÓLARES', 'DOBLE', 'TREINTA', 'NUEVE', 'FED', 'TASAS', 'DOW', 'ORO', 'AFORE', 'FONDOS', 'RIESGO', 'DIRECTOR'];

const abs = (x: number, y: number, w?: number): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w});
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
const txt = (size: number, weight = 800, color = P.white, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});
const SRC = (s: string, y: number, at: number) => (
  <Rise at={at} dy={30} style={abs(80, 1455)}>
    <div style={{...txt(26, 600, P.mute, 0.04)}}>{`FUENTES: ${s}`}</div>
  </Rise>
);

/* línea de precio: sube a un pico y cae */
const Line: React.FC<{p: number; w?: number; h?: number; pts: number[]; split?: number; stroke?: number; dim?: boolean}> = ({p, w = 860, h = 300, pts, split = 0.5, stroke = 12, dim}) => {
  const n = pts.length;
  const xy = pts.map((v, i) => [(i / (n - 1)) * w, h - v * h] as const);
  const upTo = Math.max(2, Math.round(p * (n - 1)) + 1);
  const shown = xy.slice(0, upTo);
  const last = shown[shown.length - 1];
  const sIdx = Math.round(split * (n - 1));
  const up = shown.slice(0, Math.min(shown.length, sIdx + 1));
  const down = shown.length > sIdx ? shown.slice(sIdx) : [];
  const d = (a: readonly (readonly number[])[]) => a.map((q, i) => `${i ? 'L' : 'M'}${q[0]} ${q[1]}`).join(' ');
  return (
    <svg width={w + 40} height={h + 40} viewBox={`-20 -20 ${w + 40} ${h + 40}`} style={{opacity: dim ? 0.35 : 1, overflow: 'visible'}}>
      <path d={d(up)} stroke={P.mint} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {down.length > 1 && <path d={d(down)} stroke={P.coral} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
      <circle cx={last[0]} cy={last[1]} r={stroke * 1.3} fill={down.length > 1 ? P.coral : P.mint} />
    </svg>
  );
};
const PTS = [0.15, 0.22, 0.2, 0.34, 0.3, 0.5, 0.62, 0.78, 0.9, 0.82, 0.7, 0.55, 0.42, 0.3, 0.2, 0.12];

const HookBase: React.FC<{p: number; dim?: number}> = ({p, dim = 0}) => (
  <>
    <div style={{...center(240), ...txt(70, 600, P.mute, 0.3)}}>REPORTÓ</div>
    <div style={{...center(306), ...txt(170)}}>NVIDIA</div>
    <div style={{...center(560), opacity: 1 - dim * 0.1}}>
      <Line p={p} pts={PTS} />
    </div>
  </>
);

const S1: React.FC = () => (
  <Scene a={A[0]} b={A[1]} kind="none" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const p = easeIO(prog(t, 0.25, 2.35));
      const rec = spr(f, T(2) - 0.06, 9, 260, 0.7);
      const red = spr(f, T(6) - 0.06, 9, 260, 0.7);
      const shake = red > 0.05 && red < 0.98 ? Math.sin(f * 2.4) * 10 * (1 - red) : 0;
      return (
        <AbsoluteFill style={{transform: `scale(${lerp(1.07, 1, easeOut(lt / 0.5))}) translate(${shake}px,0)`}}>
          <HookBase p={p} />
          <div style={{...center(850), opacity: cl(rec * 3), transform: `scale(${lerp(2.4, 1, rec)}) rotate(-5deg)`}}>
            <div style={{...txt(130, 800, P.ink, -0.02), background: P.mint, padding: '6px 44px 0', borderRadius: 28, border: `10px solid ${P.ink}`, outline: `10px solid ${P.mint}`, boxShadow: '0 30px 60px rgba(0,0,0,0.5)'}}>RÉCORD</div>
          </div>
          <div style={{...center(1040), opacity: cl(red * 3), transform: `scale(${lerp(2.6, 1, red)}) rotate(6deg)`}}>
            <div style={{...txt(130, 800, P.white, -0.02), background: P.coral, padding: '6px 44px 0', borderRadius: 28, border: `10px solid ${P.ink}`, outline: `10px solid ${P.coral}`, boxShadow: '0 30px 60px rgba(0,0,0,0.5)'}}>EN ROJO</div>
          </div>
          <Rise at={T(6) + 0.2} style={center(1215)}>
            <Chip size={30}>CIERRE · 18 NOV 2026</Chip>
          </Rise>
        </AbsoluteFill>
      );
    }}
  </Scene>
);

const S2: React.FC = () => {
  const its = [
    {n: '01', l: 'Los resultados', c: P.mint},
    {n: '02', l: 'La Fed', c: P.amber},
    {n: '03', l: 'Tu Afore y fondos', c: P.sky},
  ];
  return (
    <Scene a={A[1]} b={A[2]} kind="up" out="left">
      {(lt, f) => (
        <>
          <Mask at={A[1] + 0.02} size={380} color={P.amber} style={center(200)}>3</Mask>
          <Mask at={T(9) - 0.1} size={120} style={center(580)}>SEÑALES</Mask>
          {its.map((it, k) => {
            const p = spr(f, T(12) + k * 0.2, 11, 200, 0.6);
            return (
              <div key={k} style={{...abs(90, 790 + k * 190, 900), height: 160, borderRadius: 36, background: 'rgba(255,255,255,0.09)', border: '3px solid rgba(255,255,255,0.28)', display: 'flex', alignItems: 'center', gap: 34, padding: '0 44px', boxSizing: 'border-box', transform: `translateX(${(1 - p) * -300}px)`, opacity: cl(p * 2)}}>
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

const S3: React.FC = () => (
  <Scene a={A[2]} b={A[3]} kind="left" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(17), T(21) + 0.4));
      const bar = easeOut(prog(t, T(24), T(29)));
      const punch = spr(f, T(21) + 0.4, 7, 260, 0.5);
      return (
        <>
          <Rise at={A[2] + 0.05} dy={30} style={{...abs(80, 215), ...txt(40, 700, P.mute, 0.16)}}>VENTAS · 3.ER TRIMESTRE</Rise>
          <div style={{...abs(80, 290), ...txt(280, 800, P.amber, -0.05), transform: `scale(${lerp(1.1, 1, punch)})`, transformOrigin: '0 50%'}}>{`$${(c * 115.8).toFixed(1)}`}</div>
          <Mask at={T(20) - 0.1} size={80} style={abs(80, 590)}>MIL MILLONES DE USD</Mask>
          <div style={{...abs(80, 780, 920)}}>
            <div style={{...txt(34, 600, P.mute, 0.1), marginBottom: 10}}>HACE UN AÑO</div>
            <div style={{height: 84, borderRadius: 20, width: `${bar * 49.2}%`, background: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', paddingLeft: 24, boxSizing: 'border-box'}}><span style={{...txt(44, 800, P.ink, 0)}}>{bar > 0.5 ? '$57.0' : ''}</span></div>
            <div style={{...txt(34, 600, P.amber, 0.1), margin: '34px 0 10px'}}>HOY</div>
            <div style={{height: 84, borderRadius: 20, width: `${bar * 100}%`, background: `linear-gradient(90deg, ${P.amberDeep}, ${P.amber})`, display: 'flex', alignItems: 'center', paddingLeft: 24, boxSizing: 'border-box'}}><span style={{...txt(44, 800, P.ink, 0)}}>{bar > 0.5 ? '$115.8' : ''}</span></div>
          </div>
          <Pop at={T(25) - 0.05} rot={-4} style={abs(100, 1130)}>
            <div style={{...txt(110, 800, P.ink, 0), background: P.mint, padding: '10px 40px', borderRadius: 26, boxShadow: '0 24px 44px rgba(0,0,0,0.4)'}}>+103 %</div>
          </Pop>
          {SRC('NVIDIA (17 NOV) · INFOBAE · EFE', 1290, T(26))}
        </>
      );
    }}
  </Scene>
);

const S4: React.FC = () => (
  <Scene a={A[3]} b={A[4]} kind="zoom" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(36), T(38) + 0.5));
      const punch = spr(f, T(39), 7, 260, 0.5);
      return (
        <>
          <Rise at={A[3] + 0.05} dy={30} style={{...abs(80, 215), ...txt(40, 700, P.mute, 0.16)}}>SU PRONÓSTICO · PRÓXIMO TRIMESTRE</Rise>
          <div style={{...abs(80, 330), ...txt(300, 800, P.white, -0.05), transform: `scale(${lerp(1.1, 1, punch)})`, transformOrigin: '0 50%'}}>{`$${Math.round(c * 130)}`}</div>
          <Mask at={T(38) - 0.1} size={80} style={abs(80, 650)}>MIL MILLONES DE USD</Mask>
          <Rise at={T(39)} dy={60} style={abs(90, 860, 900)}>
            <Card style={{padding: '34px 44px'}}>
              <div style={{...txt(40, 600, 'rgba(10,15,31,0.6)', 0.06)}}>GUÍA DE NVIDIA</div>
              <div style={{...txt(78, 800, P.ink, -0.02), marginTop: 6}}>$130 mil millones ± 3 %</div>
              <div style={{...txt(34, 500, 'rgba(10,15,31,0.6)', 0), whiteSpace: 'normal', marginTop: 10}}>No incluye ventas de centros de datos a China</div>
            </Card>
          </Rise>
          {SRC('NVIDIA (17 NOV) · TRADINGKEY', 1290, T(39) + 0.1)}
        </>
      );
    }}
  </Scene>
);

const S5: React.FC = () => (
  <Scene a={A[4]} b={A[5]} kind="up" out="zoom">
    {(lt, f) => {
      const t = f / FPS;
      const p = easeIO(prog(t, T(40) - 0.1, T(52) + 0.2));
      const up = spr(f, T(44), 9, 220, 0.6);
      const dn = easeOut(prog(t, T(48), T(52)));
      const n = (dn * 2.9).toFixed(1);
      return (
        <>
          <Rise at={A[4] + 0.05} dy={30} style={{...abs(80, 215), ...txt(40, 700, P.mute, 0.16)}}>LA ACCIÓN · MIÉ 18 NOV</Rise>
          <div style={{...center(300)}}>
            <Line p={p} pts={PTS} stroke={14} />
          </div>
          <Pop at={T(44) - 0.05} rot={-4} style={abs(110, 700)}>
            <div style={{...txt(70, 800, P.ink, 0), background: P.mint, padding: '10px 32px', borderRadius: 22}}>SUBE HASTA +2.7 %</div>
          </Pop>
          <div style={{...center(860), ...txt(330, 800, P.coral, -0.05), opacity: cl(dn * 3), transform: `scale(${lerp(1.3, 1, dn)})`}}>{`−${n}%`}</div>
          <Mask at={T(48) - 0.1} size={84} style={center(1190)}>AL CIERRE</Mask>
          {SRC('INFOBAE · EFE (INFORMADOR)', 1330, T(50))}
        </>
      );
    }}
  </Scene>
);

const Chair: React.FC<{x: number}> = ({x}) => (
  <svg width={300} height={340} viewBox="-150 -170 300 340" style={{filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.45))', transform: `translateX(${x}px)`}}>
    <rect x={-84} y={-150} width={168} height={170} rx={30} fill={P.paper} />
    <rect x={-100} y={10} width={200} height={50} rx={18} fill={P.paper2} />
    <rect x={-84} y={60} width={26} height={96} rx={8} fill={P.paper2} />
    <rect x={58} y={60} width={26} height={96} rx={8} fill={P.paper2} />
    <text x={0} y={-40} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={86} fill={P.ink}>CEO</text>
  </svg>
);
const S6: React.FC = () => (
  <Scene a={A[5]} b={A[6]} kind="left" out="up">
    {(lt, f) => (
      <>
        <Rise at={A[5] + 0.05} dy={30} style={{...abs(80, 215), ...txt(40, 700, P.mute, 0.16)}}>PRIMER REPORTE SIN SU DIRECTOR</Rise>
        <div style={{...center(300)}}><Chair x={0} /></div>
        <Mask at={T(59) - 0.1} size={104} style={center(700)}>JENSEN HUANG</Mask>
        <Pop at={T(61) - 0.05} rot={-3} style={center(880)}>
          <div style={{...txt(64, 800, P.white, 0.04), background: P.coral, padding: '12px 36px', borderRadius: 22}}>YA NO ES CEO</div>
        </Pop>
        <Rise at={T(63)} dy={80} style={abs(90, 1040, 900)}>
          <Card style={{padding: '30px 40px'}}>
            <div style={{...txt(34, 600, 'rgba(10,15,31,0.55)', 0.08)}}>DIRECTORA GENERAL INTERINA</div>
            <div style={{...txt(66, 800, P.ink, 0)}}>Colette Kress</div>
          </Card>
        </Rise>
        {SRC('NVIDIA (17 NOV) · TRADINGKEY · INFOBAE', 1330, T(63))}
      </>
    )}
  </Scene>
);

const S7: React.FC = () => (
  <Scene a={A[6]} b={A[7]} kind="zoom" out="left">
    {(lt, f) => {
      const t = f / FPS;
      const rise = easeIO(prog(t, T(71), T(76) + 0.3));
      const ar = spr(f, T(71), 9, 220, 0.6);
      return (
        <>
          <div style={{...center(200), ...txt(60, 700, P.mute, 0.2)}}>DOS</div>
          <Mask at={A[6] + 0.05} size={330} color={P.amber} style={center(270)}>FED</Mask>
          <Rise at={T(69)} dy={50} style={abs(90, 640, 900)}>
            <Card style={{padding: '30px 44px'}}>
              <div style={{...txt(34, 600, 'rgba(10,15,31,0.55)', 0.08)}}>MINUTAS DE LA REUNIÓN</div>
              <div style={{...txt(60, 800, P.ink, -0.02), whiteSpace: 'normal', marginTop: 6}}>Consideran incrementos adicionales en las tasas</div>
            </Card>
          </Rise>
          <div style={{...abs(150, 1000), width: 780, height: 260}}>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.25)'}} />
            {[0, 1, 2, 3].map((k) => {
              const on = rise * 4 > k;
              return <div key={k} style={{position: 'absolute', left: k * 210, bottom: 0, width: 150, height: 70 + k * 55, borderRadius: 18, background: on ? P.coral : 'rgba(255,255,255,0.12)', transform: `scaleY(${on ? 1 : 0.7})`, transformOrigin: '50% 100%'}} />;
            })}
            <div style={{...txt(52, 800, P.coral, 0.06), position: 'absolute', right: 0, top: -20, opacity: cl(ar * 2)}}>TASAS ↑</div>
          </div>
          {SRC('INFOBAE · EFE (INFORMADOR) · EURONEWS', 1330, T(74))}
        </>
      );
    }}
  </Scene>
);

const S8: React.FC = () => (
  <Scene a={A[7]} b={A[8]} kind="up" out="zoom">
    {(lt, f) => {
      const t = f / FPS;
      const dow = easeOut(prog(t, T(82), T(85)));
      const gold = spr(f, T(89) - 0.05, 9, 220, 0.6);
      const gl = easeIO(prog(t, T(89), T(99)));
      return (
        <>
          <Rise at={A[7] + 0.05} dy={60} style={abs(90, 215, 900)}>
            <Card style={{padding: '30px 44px', transform: 'rotate(-1deg)'}}>
              <div style={{...txt(36, 700, 'rgba(10,15,31,0.55)', 0.12)}}>DOW JONES · CIERRE</div>
              <div style={{...txt(200, 800, P.coral, -0.05)}}>{`−${(dow * 1.1).toFixed(1)} %`}</div>
              <div style={{...txt(34, 500, 'rgba(10,15,31,0.6)', 0)}}>50,198 puntos · S&P 500 −0.2 % · Nasdaq +0.4 %</div>
            </Card>
          </Rise>
          <Rise at={T(87)} dy={80} style={abs(90, 740, 900)}>
            <div style={{borderRadius: 40, background: 'rgba(255,255,255,0.09)', border: '3px solid rgba(255,255,255,0.28)', padding: '30px 44px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{...txt(110, 800, P.amber, -0.03)}}>ORO</div>
                <div style={{opacity: cl(gold * 2), transform: `scale(${lerp(1.5, 1, gold)})`}}>
                  <div style={{...txt(46, 800, P.white, 0.02), background: P.coral, padding: '10px 26px', borderRadius: 18}}>MÍNIMO EN +1 AÑO</div>
                </div>
              </div>
              <svg width={820} height={260} viewBox="0 0 820 260" style={{marginTop: 16}}>
                {(() => {
                  const g = [0.9, 0.84, 0.86, 0.72, 0.66, 0.6, 0.5, 0.42, 0.3, 0.2];
                  const pts = g.map((v, i) => [(i / 9) * 800 + 10, 240 - v * 220] as const);
                  const upTo = Math.max(2, Math.round(gl * 9) + 1);
                  const d = pts.slice(0, upTo).map((q, i) => `${i ? 'L' : 'M'}${q[0]} ${q[1]}`).join(' ');
                  return <path d={d} stroke={P.amber} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
                })()}
              </svg>
              <div style={{...txt(28, 500, P.mute, 0)}}>Onza ~$3,832 (lun 16 nov): mínimo desde oct 2025</div>
            </div>
          </Rise>
          {SRC('INFOBAE · EFE · EURONEWS · QUARTZ', 1330, T(92))}
        </>
      );
    }}
  </Scene>
);

const S9: React.FC = () => {
  const tiles = [
    {l: 'AFORE', c: P.mint},
    {l: 'FONDOS', c: P.amber},
    {l: 'TU AHORRO', c: P.sky},
  ];
  return (
    <Scene a={A[8]} b={A[9]} kind="zoom" out="up">
      {(lt, f) => {
        const t = f / FPS;
        const ring = spr(f, T(116) - 0.2, 9, 200, 0.6);
        return (
          <>
            <div style={{...center(190), ...txt(60, 700, P.mute, 0.2)}}>TRES</div>
            <Mask at={A[8] + 0.05} size={220} color={P.amber} style={center(270)}>TE TOCA</Mask>
            <div style={{...abs(90, 640), width: 900, height: 700, position: 'absolute'}}>
              <div style={{position: 'absolute', left: 50, top: 40, width: 800, height: 600, borderRadius: 400, border: `6px dashed rgba(255,255,255,0.4)`, transform: `scale(${ring})`, opacity: cl(ring * 2)}} />
              <div style={{...txt(56, 800, P.white, 0.14), position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', opacity: cl(ring * 2)}}>MERCADO</div>
              {tiles.map((it, k) => {
                const p = spr(f, T(107 + (k === 0 ? 0 : k === 1 ? 2 : 4)) - 0.1, 11, 200, 0.6);
                const pos = [[330, 0], [20, 400], [640, 400]][k];
                return (
                  <div key={k} style={{position: 'absolute', left: pos[0], top: pos[1], width: 270, height: 170, borderRadius: 34, background: it.c, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p}) rotate(${(k - 1) * 4}deg)`, boxShadow: '0 24px 44px rgba(0,0,0,0.4)'}}>
                    <span style={{...txt(it.l.length > 6 ? 38 : 54, 800, P.ink, 0)}}>{it.l}</span>
                  </div>
                );
              })}
            </div>
            <Rise at={T(114)} dy={30} style={abs(80, 1400)}>
              <div style={{...txt(32, 500, P.mute, 0)}}>Depende de cómo esté invertido el tuyo.</div>
            </Rise>
          </>
        );
      }}
    </Scene>
  );
};

const S10: React.FC = () => {
  const items = [
    {n: '1', l: 'Un día no es tu plan'},
    {n: '2', l: 'Mira tu horizonte'},
    {n: '3', l: 'Revisa tu riesgo'},
  ];
  return (
    <Scene a={A[9]} b={NVR_TOTAL + 1} kind="up" out="none">
      {(lt, f) => {
        const t = f / FPS;
        const back = easeIO(prog(t, T(128) - 0.1, NVR_TOTAL - 0.2));
        return (
          <>
            <div style={{opacity: 1 - cl(back * 2.2), transform: `translateY(${back * 260}px) scale(${1 - back * 0.3})`}}>
              <Mask at={A[9] + 0.05} size={104} style={abs(80, 215)}>REVISA TU RIESGO</Mask>
              {items.map((it, k) => (
                <Rise key={k} at={T(119) + k * 0.4} dx={-160} dy={0} style={abs(80, 400 + k * 250, 900)}>
                  <div style={{height: 216, borderRadius: 40, background: 'rgba(255,255,255,0.09)', border: '3px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: 36, padding: '0 46px', boxSizing: 'border-box'}}>
                    <div style={{...txt(150, 800, P.amber, -0.04), width: 120}}>{it.n}</div>
                    <div style={{...txt(56, 700, P.white, 0)}}>{it.l}</div>
                  </div>
                </Rise>
              ))}
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
  {at: 0, mood: 'navy'},
  {at: A[2], mood: 'forest'},
  {at: A[4], mood: 'plum'},
  {at: A[6], mood: 'ember'},
  {at: A[7], mood: 'steel'},
  {at: A[8], mood: 'navy'},
  {at: A[9], mood: 'navy'},
];
const PASOS = [
  {at: A[2], label: '1 DE 3'},
  {at: A[6], label: '2 DE 3'},
  {at: A[8], label: '3 DE 3'},
  {at: A[9], label: ''},
];

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const p = spr(f, A[6] + 0.6, 12, 200, 0.6);
  if (t < A[6] + 0.6 || t > A[9]) return null;
  return (
    <div style={{position: 'absolute', right: 70, top: 160, transform: `translateX(${(1 - p) * 200}px)`, opacity: cl(p * 2)}}>
      <Chip bg={P.white} color={P.ink} size={26}>＋ SÍGUEME</Chip>
    </div>
  );
};

export const NvidiaRecordMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={MOOD_AT} />
    <S1 /><S2 /><S3 /><S4 /><S5 /><S6 /><S7 /><S8 /><S9 /><S10 />
    <Grain />
    <Frame serie="NOTICIA · 18 NOV" total={NVR_TOTAL} pasos={PASOS} nota="Contenido educativo, no es recomendación de inversión. Fuentes: Nvidia (17 nov), Infobae, EFE, Euronews, TradingKey. Ejemplo informativo; el valor puede subir o bajar." />
    <Cta />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('nvidia-record/voz_mix.wav')} />}
  </AbsoluteFill>
);

export const NvidiaRecordCover: React.FC = () => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={[{at: 0, mood: 'navy'}]} />
    <div style={{...center(210), ...txt(70, 600, P.mute, 0.3)}}>REPORTÓ</div>
    <div style={{...center(276), ...txt(170)}}>NVIDIA</div>
    <div style={{...center(520)}}><Line p={1} pts={PTS} /></div>
    <div style={{...center(900), transform: 'rotate(-5deg)'}}>
      <div style={{...txt(170, 800, P.ink, -0.02), background: P.mint, padding: '6px 50px 0', borderRadius: 30, border: `10px solid ${P.ink}`, outline: `10px solid ${P.mint}`}}>RÉCORD</div>
    </div>
    <div style={{...center(1130), transform: 'rotate(5deg)'}}>
      <div style={{...txt(170, 800, P.white, -0.02), background: P.coral, padding: '6px 50px 0', borderRadius: 30, border: `10px solid ${P.ink}`, outline: `10px solid ${P.coral}`}}>EN ROJO</div>
    </div>
    <div style={{...center(1350)}}><Chip size={30}>NOTICIA · 18 NOV</Chip></div>
    <Grain />
  </AbsoluteFill>
);

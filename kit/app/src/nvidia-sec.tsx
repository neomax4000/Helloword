// NOTICIA · 23 NOV — Nvidia −14 % y revisión contable de la SEC (cierre del 20 nov) (Estándar Pro)
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/nvidia-sec/words.json';
import {Backdrop, Captions, Card, Chip, FONT, FPS, Frame, Grain, Mask, P, Pop, Rise, Scene, Wd, buildGroups, cl, easeIO, easeOut, lerp, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const NS_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1));
const groups = buildGroups(words, blocks);
const KEYS = ['NVIDIA','CATORCE','PEOR','TERCER','REUTERS','CONTABILIDAD','REGULADOR','REVISIÓN','CONCLUSIÓN','NASDAQ','CINCO','GANANCIAS','TRES','CORRECCIÓN','DINERO','DÓLAR','DIECINUEVE','AFORE','FONDOS','CUENTA','PRONÓSTICO','BAJAR','TRES','SIETE','VEINTIOCHO'];

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
    <div style={{...center(235), ...txt(46, 600, P.mute, 0.2)}}>NVIDIA · CIERRE 20 NOV</div>
    <div style={{...center(320), ...txt(250, 800, P.coral, -0.05)}}>−14 %</div>
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
      const punch = spr(f, T(4) + 0.05, 7, 260, 0.5);
      return (
        <AbsoluteFill style={{transform: `scale(${lerp(1.07, 1, easeOut(lt / 0.5))}) translate(${punch > 0.05 && punch < 0.98 ? Math.sin(f * 2.4) * 8 * (1 - punch) : 0}px,0)`}}>
          <HookBase p={p} />
          <Pop at={T(5)} rot={-4} style={abs(130, 930)}>
            <div style={{...txt(100, 800, P.white, 0), background: P.coral, padding: '10px 40px', borderRadius: 26, boxShadow: '0 24px 44px rgba(0,0,0,0.4)'}}>EN UN DÍA</div>
          </Pop>
          <Rise at={T(7) - 0.2} style={center(1110)}>
            <Chip size={30}>VIERNES 20 NOV 2026</Chip>
          </Rise>
        </AbsoluteFill>
      );
    }}
  </Scene>
);

const S2: React.FC = () => {
  const its = [
    {n: '01', l: 'Su peor día', c: P.coral},
    {n: '02', l: 'Revisión contable', c: P.amber},
    {n: '03', l: 'Tu dinero', c: P.sky},
  ];
  return (
    <Scene a={A[1]} b={A[2]} kind="left" out="up">
      {(lt, f) => (
        <>
          <Mask at={A[1] + 0.02} size={380} color={P.amber} style={center(200)}>3</Mask>
          <Mask at={T(11) - 0.1} size={120} style={center(580)}>DATOS</Mask>
          {its.map((it, k) => {
            const p = spr(f, T(11) + k * 0.25, 11, 200, 0.6);
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

const S3: React.FC = () => (
  <Scene a={A[2]} b={A[3]} kind="zoom" out="left">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(21) - 0.1, T(25)));
      const punch = spr(f, T(25) - 0.05, 7, 260, 0.5);
      return (
        <>
          <div style={{...center(200), ...txt(60, 700, P.mute, 0.2)}}>UNO</div>
          <Mask at={T(18) - 0.1} size={150} color={P.coral} style={center(300)}>PEOR DÍA</Mask>
          <div style={{...center(500), ...txt(210, 800, P.white, -0.04), transform: `scale(${lerp(1.1, 1, punch)})`}}>{`ENE ${Math.round(2024 + c)}`}</div>
          <Rise at={T(25)} dy={60} style={abs(90, 860, 900)}>
            <Card style={{padding: '30px 44px'}}>
              <div style={{...txt(34, 600, 'rgba(10,15,31,0.55)', 0.08)}}>CAÍDA DE UN DÍA</div>
              <div style={{...txt(54, 800, P.ink, -0.02), whiteSpace: 'normal', marginTop: 6}}>La mayor desde enero de 2025</div>
            </Card>
          </Rise>
          {SRC('YAHOO FINANCE · ESPRESSO MATUTINO', 1440, T(25) + 0.3)}
        </>
      );
    }}
  </Scene>
);

const S4: React.FC = () => {
  const top = ['APPLE', 'MICROSOFT', 'ALPHABET'];
  return (
    <Scene a={A[3]} b={A[4]} kind="up" out="left">
      {(lt, f) => {
        const t = f / FPS;
        const slide = easeIO(prog(t, T(27), T(30)));
        return (
          <>
            <Rise at={A[3] + 0.05} dy={30} style={{...abs(80, 215), ...txt(40, 700, P.mute, 0.16)}}>LAS MÁS VALIOSAS DE EE. UU.</Rise>
            {top.map((n, k) => (
              <div key={k} style={{...abs(110, 330 + k * 150, 860), height: 124, borderRadius: 30, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', padding: '0 44px', boxSizing: 'border-box'}}>
                <span style={{...txt(56, 700, P.white, 0)}}>{n}</span>
              </div>
            ))}
            <div style={{...abs(110, 330 + 2 * 150 - 150 * (1 - slide) + 0, 860), height: 124, borderRadius: 30, background: slide > 0.98 ? P.coral : P.amber, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 44px', boxSizing: 'border-box', transform: `translateY(${(1 - slide) * 0}px)`, top: 330 + 3 * 150 - slide * 0, boxShadow: '0 24px 44px rgba(0,0,0,0.4)'}}>
              <span style={{...txt(56, 800, P.ink, 0)}}>NVIDIA</span>
              <span style={{...txt(48, 800, P.ink, 0)}}>{slide > 0.5 ? '4.º' : '3.º'}</span>
            </div>
            <Rise at={T(31)} dy={60} style={abs(90, 960, 900)}>
              <Card style={{padding: '30px 44px'}}>
              <div style={{...txt(34, 600, 'rgba(10,15,31,0.55)', 0.08)}}>PERDIÓ SU LUGAR</div>
              <div style={{...txt(54, 800, P.ink, -0.02), whiteSpace: 'normal', marginTop: 6}}>Alphabet le quitó el tercero</div>
              </Card>
            </Rise>
            {SRC('YAHOO FINANCE · ESPRESSO MATUTINO', 1440, T(33))}
          </>
        );
      }}
    </Scene>
  );
};

const S5: React.FC = () => (
  <Scene a={A[4]} b={A[5]} kind="left" out="zoom">
    {(lt, f) => {
      const punch = spr(f, T(40) - 0.05, 7, 260, 0.5);
      return (
        <>
          <div style={{...center(200), ...txt(60, 700, P.mute, 0.2)}}>DOS</div>
          <div style={{...center(290), ...txt(300, 800, P.coral, -0.05), transform: `scale(${lerp(1.1, 1, punch)})`}}>SEC</div>
          <Mask at={T(40) - 0.1} size={52} style={center(650)}>REGULADOR BURSÁTIL DE EE. UU.</Mask>
          <Pop at={T(37)} rot={-3} style={abs(120, 790)}>
            <div style={{...txt(70, 800, P.ink, 0), background: P.amber, padding: '10px 40px', borderRadius: 22}}>SEGÚN REUTERS</div>
          </Pop>
          <Rise at={T(47)} dy={60} style={abs(90, 960, 900)}>
            <Card style={{padding: '30px 44px'}}>
              <div style={{...txt(34, 600, 'rgba(10,15,31,0.55)', 0.08)}}>EXAMINA</div>
              <div style={{...txt(54, 800, P.ink, -0.02), whiteSpace: 'normal', marginTop: 6}}>Posibles problemas en su contabilidad</div>
            </Card>
          </Rise>
          {SRC('REUTERS (VÍA YAHOO FINANCE) · ESPRESSO MATUTINO', 1440, T(49))}
        </>
      );
    }}
  </Scene>
);

const S6: React.FC = () => (
  <Scene a={A[5]} b={A[6]} kind="up" out="left">
    {(lt, f) => {
      const p1 = spr(f, T(50), 11, 200, 0.6);
      const p2 = spr(f, T(58), 11, 200, 0.6);
      return (
        <>
          <Rise at={A[5] + 0.05} dy={30} style={{...abs(80, 215), ...txt(40, 700, P.mute, 0.16)}}>SÍ Y NO SABEMOS</Rise>
          <div style={{...abs(90, 340, 900), height: 230, borderRadius: 40, background: P.amber, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${p1})`, opacity: cl(p1 * 2), boxShadow: '0 24px 44px rgba(0,0,0,0.4)'}}>
            <span style={{...txt(34, 700, P.ink, 0.08)}}>SÍ HAY</span>
            <span style={{...txt(84, 800, P.ink, 0)}}>UNA REVISIÓN</span>
          </div>
          <div style={{...abs(90, 620, 900), height: 230, borderRadius: 40, background: 'rgba(255,255,255,0.1)', border: '3px dashed rgba(255,255,255,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${p2})`, opacity: cl(p2 * 2)}}>
            <span style={{...txt(34, 700, P.mute, 0.08)}}>TODAVÍA NO HAY</span>
            <span style={{...txt(84, 800, P.white, 0)}}>CONCLUSIÓN</span>
          </div>
          <Rise at={T(53)} dy={60} style={abs(90, 920, 900)}>
            <Card style={{padding: '30px 44px'}}>
              <div style={{...txt(34, 600, 'rgba(10,15,31,0.55)', 0.08)}}>REGULADOR</div>
              <div style={{...txt(54, 800, P.ink, -0.02), whiteSpace: 'normal', marginTop: 6}}>No ha hecho comentarios</div>
            </Card>
          </Rise>
          {SRC('YAHOO FINANCE (CITA REUTERS Y WSJ)', 1440, T(55))}
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
        <Mask at={T(66) - 0.15} size={150} style={center(700)}>TE TOCA</Mask>
        <Pop at={T(63)} rot={-3} style={center(930)}>
          <div style={{...txt(58, 800, P.ink, 0.02), background: P.mint, padding: '12px 36px', borderRadius: 22}}>EL QUE MÁS IMPORTA</div>
        </Pop>
      </>
    )}
  </Scene>
);

const S8: React.FC = () => {
  const n = 9;
  return (
    <Scene a={A[7]} b={A[8]} kind="zoom" out="left">
      {(lt, f) => (
        <>
          <Rise at={A[7] + 0.05} dy={30} style={{...abs(80, 215), ...txt(40, 700, P.mute, 0.16)}}>UN FONDO DE EE. UU.</Rise>
          {Array.from({length: n}).map((_, k) => {
            const p = spr(f, A[7] + 0.2 + k * 0.08, 11, 200, 0.6);
            const hit = k === 4;
            return (
              <div key={k} style={{...abs(110 + (k % 3) * 290, 330 + Math.floor(k / 3) * 230, 270), height: 200, borderRadius: 30, background: hit ? P.coral : 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p * (hit ? 1 + 0.08 * Math.sin(f / 5) : 1)})`, opacity: cl(p * 2), boxShadow: hit ? '0 24px 44px rgba(0,0,0,0.4)' : undefined}}>
                <span style={{...txt(hit ? 46 : 32, 800, hit ? P.white : P.mute, 0)}}>{hit ? 'NVIDIA' : 'OTRAS'}</span>
              </div>
            );
          })}
          <Rise at={T(72)} dy={60} style={abs(90, 1060, 900)}>
            <Card style={{padding: '30px 44px'}}>
              <div style={{...txt(34, 600, 'rgba(10,15,31,0.55)', 0.08)}}>EJEMPLO ILUSTRATIVO</div>
              <div style={{...txt(50, 800, P.ink, -0.02), whiteSpace: 'normal', marginTop: 6}}>Una sola empresa grande pesa en muchos fondos</div>
            </Card>
          </Rise>
        </>
      )}
    </Scene>
  );
};

const S9: React.FC = () => {
  const items = [
    {l: 'TU AFORE', c: P.sky, at: 84},
    {l: 'TUS FONDOS', c: P.mint, at: 87},
    {l: '¿BOLSA DE EE. UU.?', c: P.amber, at: 90},
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
          <Rise at={T(97)} dy={60} style={abs(90, 1140, 900)}>
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
        <Mask at={T(103) - 0.1} size={104} style={center(390)}>NO ES UN</Mask>
        <Pop at={T(106)} rot={-3} style={abs(110, 560)}>
          <div style={{...txt(100, 800, P.ink, 0), background: P.amber, padding: '10px 36px', borderRadius: 22}}>PRONÓSTICO</div>
        </Pop>
        <Rise at={T(108)} dy={60} style={abs(90, 860, 900)}>
          <Card style={{padding: '34px 44px'}}>
            <div style={{...txt(58, 800, P.ink, -0.02), whiteSpace: 'normal'}}>El valor puede subir o bajar</div>
          </Card>
        </Rise>
        <Rise at={T(110)} dy={30} style={abs(90, 1130, 900)}>
          <div style={{...txt(34, 600, P.mute, 0.02), whiteSpace: 'normal'}}>No es recomendación de compra ni de venta.</div>
        </Rise>
      </>
    )}
  </Scene>
);

const S11: React.FC = () => {
  const items = [
    {l: 'AFORE', c: P.sky, at: 113},
    {l: 'FONDOS', c: P.mint, at: 115},
    {l: 'ESTADO DE CUENTA', c: P.amber, at: 117},
  ];
  return (
    <Scene a={A[10]} b={NS_TOTAL + 1} kind="up" out="none">
      {(lt, f) => {
        const t = f / FPS;
        const back = easeIO(prog(t, T(118) - 0.1, NS_TOTAL - 0.2));
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
              <Rise at={T(117)} dy={20} style={abs(90, 1225, 900)}>
                <div style={{...txt(34, 600, P.mute, 0.02)}}>¿Cuánto de tu ahorro está en bolsa? Cuéntame.</div>
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
  {at: A[4], mood: 'plum'},
  {at: A[6], mood: 'steel'},
  {at: A[8], mood: 'forest'},
  {at: A[10], mood: 'ember'},
];
const PASOS = [
  {at: A[2], label: '1 DE 3'},
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

export const NvidiaSecMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={MOOD_AT} />
    <S1 /><S2 /><S3 /><S4 /><S5 /><S6 /><S7 /><S8 /><S9 /><S10 /><S11 />
    <Grain />
    <Frame serie="NOTICIA · 23 NOV" total={NS_TOTAL} pasos={PASOS} nota="Contenido educativo, no es recomendación de inversión. Cierre del 20 nov 2026. Fuentes: Reuters (vía Yahoo Finance), Yahoo Finance, Espresso Matutino. El valor puede subir o bajar." />
    <Cta />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('nvidia-sec/voz_mix.wav')} />}
  </AbsoluteFill>
);

export const NvidiaSecCover: React.FC = () => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={[{at: 0, mood: 'ember'}]} />
    <div style={{...center(210), ...txt(62, 600, P.mute, 0.28)}}>NVIDIA · 20 NOV</div>
    <div style={{...center(300), ...txt(250, 800, P.coral, -0.05)}}>−14 %</div>
    <div style={{...center(620)}}><Line p={1} /></div>
    <div style={{...center(1020), transform: 'rotate(-4deg)'}}>
      <div style={{...txt(120, 800, P.white, -0.02), background: P.coral, padding: '6px 46px 0', borderRadius: 30, border: `10px solid ${P.ink}`, outline: `10px solid ${P.coral}`}}>SEC REVISA</div>
    </div>
    <div style={{...center(1230)}}><div style={{...txt(60, 700, P.white, 0)}}>su contabilidad · según Reuters</div></div>
    <div style={{...center(1370)}}><Chip size={30}>NOTICIA · 23 NOV</Chip></div>
    <Grain />
  </AbsoluteFill>
);

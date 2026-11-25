// PREVIA · EFECTO DOMINÓ — noticia N1 de la semana de pruebas (2026-11-25)
// Previa del dato de desempleo (ENOE octubre) que INEGI publica el jueves 26 nov.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/previa-enoe/words.json';
import {Backdrop, Captions, Card, Chip, FONT, FPS, Frame, Grain, Mask, P, Pop, Rise, Scene, Wd, buildGroups, cl, easeIO, easeOut, lerp, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const ENOE_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1));
const groups = buildGroups(words, blocks);
const KEYS = ['NÚMERO', 'BOLSILLO', 'DESEMPLEO', 'FICHAS', 'FICHA', 'EMPLEO', 'INGRESO', 'TASA', 'TASAS', 'DEUDAS', 'AHORRO', 'ALTO', 'BAJO', 'MÁS', 'MENOS', 'PUNTO'];

const abs = (x: number, y: number, w?: number): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w});
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
const txt = (size: number, weight = 800, color = P.white, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});

/* ---------------- fichas de dominó ---------------- */
const Tile: React.FC<{n: number; fall?: number; hot?: boolean; s?: number}> = ({n, fall = 0, hot = false, s = 1}) => {
  const pips = Array.from({length: n}, (_, k) => k);
  return (
    <div style={{width: 150 * s, height: 300 * s, position: 'relative', transformOrigin: '100% 100%', transform: `rotate(${fall * 64}deg)`}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 26 * s, background: hot ? P.amber : P.paper, boxShadow: `0 ${26 * s}px ${44 * s}px rgba(0,0,0,0.45), inset 0 -${12 * s}px 0 rgba(10,15,31,0.13)`}} />
      <div style={{position: 'absolute', left: 16 * s, right: 16 * s, top: '50%', height: 7 * s, borderRadius: 4, background: 'rgba(10,15,31,0.35)'}} />
      <div style={{...txt(110 * s, 800, P.ink, 0), position: 'absolute', left: 0, right: 0, top: 18 * s, textAlign: 'center'}}>{n}</div>
      <div style={{position: 'absolute', left: 28 * s, right: 28 * s, top: 190 * s, display: 'flex', flexWrap: 'wrap', gap: 14 * s, justifyContent: 'center'}}>
        {pips.map((k) => (
          <div key={k} style={{width: 24 * s, height: 24 * s, borderRadius: 99, background: P.ink}} />
        ))}
      </div>
    </div>
  );
};

/** 4 fichas en fila. falls[k] = 0..1 (parada → caída), hot = índice resaltado */
const Chain: React.FC<{x0: number; y: number; s?: number; falls: number[]; hot?: number | null; n?: number; gap?: number}> = ({x0, y, s = 1, falls, hot = null, n = 4, gap = 225}) => (
  <>
    {Array.from({length: n}, (_, k) => (
      <div key={k} style={{position: 'absolute', left: x0 + k * gap * s, top: y}}>
        <Tile n={k + 1} fall={falls[k] ?? 0} hot={hot === k} s={s} />
      </div>
    ))}
  </>
);
const fallAt = (f: number, at: number) => cl(spr(f, at, 20, 110, 1.05), 0, 1.06);

/* ---------------- gancho (también es el último fotograma: bucle) ---------------- */
const HookBase: React.FC<{f: number}> = ({f}) => {
  const wob = Math.sin(f / 7) * 2.2;
  return (
    <>
      <div style={{...center(240), ...txt(76, 600, P.mute, 0.3)}}>MAÑANA</div>
      <div style={{...center(330), ...txt(330, 800, P.amber, -0.04), textShadow: '0 30px 80px rgba(0,0,0,0.45)'}}>?.?%</div>
      <div style={{...center(700), ...txt(64, 700, P.white, 0.04)}}>DESEMPLEO · OCTUBRE</div>
      <div style={{transform: `rotate(${wob}deg)`, transformOrigin: '50% 100%'}}>
        <Chain x0={265} y={880} s={0.6} falls={[0, 0, 0, 0]} gap={225} />
      </div>
    </>
  );
};

/* ---------------- escenas ---------------- */
const S1: React.FC = () => (
  <Scene a={A[0]} b={A[1]} kind="none" out="up">
    {(lt, f) => {
      const z = lerp(1.07, 1, easeOut(lt / 0.5));
      return (
        <AbsoluteFill style={{transform: `scale(${z})`}}>
          <HookBase f={f} />
          <Rise at={T(5)} style={center(1110)}>
            <Chip size={32}>INEGI · JUEVES 26 NOV</Chip>
          </Rise>
        </AbsoluteFill>
      );
    }}
  </Scene>
);

const LABELS = ['EMPLEO', 'INGRESO', 'TASAS', 'BOLSILLO'];
const S2: React.FC = () => (
  <Scene a={A[1]} b={A[2]} kind="up" out="left">
    {(lt, f) => {
      const falls = [0, 1, 2, 3].map((k) => (k < 3 ? fallAt(f, T(14) + 0.1 + k * 0.2) : 0));
      return (
        <>
          <Mask at={A[1] + 0.02} size={150} style={center(200)}>DESEMPLEO</Mask>
          <Mask at={T(12) - 0.1} size={104} color={P.amber} style={center(370)}>DE OCTUBRE</Mask>
          <Chain x0={100} y={640} s={1} falls={falls} hot={null} />
          <div style={{position: 'absolute', left: 100, top: 970, display: 'flex', gap: 0}}>
            {LABELS.map((l, k) => (
              <Rise key={k} at={T(15) + 0.1 + k * 0.1} dy={30} style={{width: 225, ...txt(34, 700, P.mute, 0.1)}}>
                {l}
              </Rise>
            ))}
          </div>
          <Pop at={T(15) - 0.05} rot={-4} style={center(1090)}>
            <div style={{...txt(52, 800, P.ink, 0), background: P.amber, padding: '14px 40px', borderRadius: 22, boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}>4 FICHAS</div>
          </Pop>
        </>
      );
    }}
  </Scene>
);

const S3: React.FC = () => (
  <Scene a={A[2]} b={A[3]} kind="zoom" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(20) - 0.05, T(22) + 0.5));
      const val = (c * 2.8).toFixed(1);
      const punch = spr(f, T(22) + 0.5, 7, 260, 0.5);
      const b1 = easeOut(prog(t, T(25) - 0.05, T(25) + 0.5));
      const b2 = easeOut(prog(t, T(28) - 0.3, T(28) + 0.4));
      return (
        <>
          <div style={{...center(190), ...txt(330, 800, P.amber, -0.05), transform: `scale(${lerp(1.1, 1, punch)})`, textShadow: '0 30px 80px rgba(0,0,0,0.45)'}}>{val}%</div>
          <Mask at={A[2] + 0.15} size={64} weight={700} color={P.mute} ls={0.12} style={center(660)}>DESEMPLEO · SEP 2026</Mask>
          <Rise at={T(25) - 0.1} dy={90} style={abs(90, 790, 900)}>
            <Card style={{padding: '44px 54px 50px', transform: 'rotate(-1deg)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 24, marginBottom: 30}}>
                <span style={{...txt(38, 700, 'rgba(10,15,31,0.6)', 0), width: 150}}>SEP 2026</span>
                <div style={{height: 54, borderRadius: 14, background: P.amber, width: 520 * (2.8 / 3.0) * b1}} />
                <span style={{...txt(54, 800, P.ink)}}>2.8%</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
                <span style={{...txt(38, 700, 'rgba(10,15,31,0.6)', 0), width: 150}}>SEP 2025</span>
                <div style={{height: 54, borderRadius: 14, background: 'rgba(10,15,31,0.28)', width: 520 * b2}} />
                <span style={{...txt(54, 800, 'rgba(10,15,31,0.55)'), opacity: cl(b2 * 2)}}>3.0%</span>
              </div>
            </Card>
          </Rise>
          <Rise at={T(27)} dy={40} style={center(1180)}>
            <Chip size={28}>INEGI · ENOE · BOLETÍN 22 OCT</Chip>
          </Rise>
        </>
      );
    }}
  </Scene>
);

const ChainBar: React.FC<{f: number; k: number; at: number}> = ({f, k, at}) => {
  // minicadena de progreso arriba: fichas anteriores caídas, la actual resaltada
  const falls = [0, 1, 2, 3].map((j) => (j < k ? 1 : j === k ? fallAt(f, at) * 0 : 0));
  return <Chain x0={300} y={190} s={0.4} falls={falls} hot={k} gap={225} />;
};

const S4: React.FC = () => (
  <Scene a={A[3]} b={A[4]} kind="left" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(33) - 0.05, T(33) + 0.75));
      const punch = spr(f, T(38) - 0.05, 8, 260, 0.5);
      return (
        <>
          <ChainBar f={f} k={0} at={A[3]} />
          <div style={{...abs(60, 360), display: 'flex', alignItems: 'flex-end', gap: 20}}>
            <div style={{...txt(380, 800, P.amber, -0.05), transform: `scale(${lerp(0.8, 1, c)})`, transformOrigin: '0 100%'}}>{(c * 60).toFixed(1)}</div>
            <div style={{...txt(120, 800, P.white), paddingBottom: 56}}>M</div>
          </div>
          <Mask at={T(36) - 0.1} size={78} style={abs(70, 780)}>PERSONAS CON TRABAJO</Mask>
          <Rise at={T(38) - 0.1} dy={110} style={abs(90, 920, 900)}>
            <Card style={{padding: '34px 48px 40px', transform: 'rotate(1deg)', display: 'flex', alignItems: 'center', gap: 34}}>
              <div style={{...txt(150, 800, P.coral, -0.04), transform: `scale(${lerp(1.12, 1, punch)})`, transformOrigin: '0 60%'}}>−267</div>
              <div>
                <div style={{...txt(78, 800, P.ink, 0)}}>MIL</div>
                <div style={{...txt(34, 500, 'rgba(10,15,31,0.66)', 0), whiteSpace: 'normal', lineHeight: 1.25, width: 360}}>personas ocupadas vs. septiembre 2025</div>
              </div>
            </Card>
          </Rise>
        </>
      );
    }}
  </Scene>
);

const Coin: React.FC<{s?: number}> = ({s = 1}) => (
  <svg width={150 * s} height={150 * s} viewBox="-75 -75 150 150" style={{filter: 'drop-shadow(0 12px 14px rgba(0,0,0,0.45))'}}>
    <circle r={68} fill={P.amberDeep} />
    <circle r={58} fill={P.amber} />
    <text x={0} y={22} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={72} fill={P.ink}>$</text>
  </svg>
);

const S5: React.FC = () => {
  const steps = [
    {l: 'PERSONA CON SUELDO', c: P.mint},
    {l: 'COMPRA Y CONSUME', c: P.amber},
    {l: 'OTRO NEGOCIO COBRA', c: P.sky},
  ];
  return (
    <Scene a={A[4]} b={A[5]} kind="zoom" out="left">
      {(lt, f) => (
        <>
          <ChainBar f={f} k={1} at={A[4]} />
          <Mask at={T(51) - 0.12} size={160} color={P.amber} style={abs(70, 370)}>INGRESO</Mask>
          <div style={{position: 'absolute', right: 90, top: 380}}>
            {[0, 1, 2].map((k) => (
              <Pop key={k} at={T(55) + k * 0.2} from={0.2} style={{position: 'absolute', right: k * 28, top: -k * 20}}>
                <Coin s={0.62} />
              </Pop>
            ))}
          </div>
          <div style={abs(90, 640, 900)}>
            {steps.map((s, k) => (
              <Rise key={k} at={T(53 + k * 2) - 0.1} dy={70} style={{marginBottom: 26}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
                  <div style={{width: 600, padding: '24px 36px', borderRadius: 30, background: 'rgba(255,255,255,0.09)', border: `3px solid ${s.c}`, ...txt(46, 800, P.white, 0)}}>{s.l}</div>
                  {k < 2 && <span style={{...txt(90, 800, s.c, 0)}}>↓</span>}
                </div>
              </Rise>
            ))}
          </div>
          <Pop at={T(57)} rot={-4} style={abs(110, 1140)}>
            <div style={{...txt(44, 800, P.ink, 0.02), background: P.mint, padding: '12px 32px', borderRadius: 18, boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}>EL DINERO DA LA VUELTA</div>
          </Pop>
        </>
      )}
    </Scene>
  );
};

const S6: React.FC = () => (
  <Scene a={A[5]} b={A[6]} kind="up" out="zoom">
    {(lt, f) => {
      const t = f / FPS;
      const sw = Math.sin(t * 2.1) * 26 + Math.sin(t * 0.9) * 10;
      const cx = 540;
      const cy = 880;
      const R = 330;
      return (
        <>
          <ChainBar f={f} k={2} at={A[5]} />
          <Mask at={T(61) - 0.1} size={100} style={center(330)}>PRECIOS <span style={{color: P.amber}}>Y</span> TASAS</Mask>
          <svg style={{position: 'absolute', left: 0, top: 0}} width={1080} height={1920} viewBox="0 0 1080 1920">
            <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={54} strokeLinecap="round" />
            <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`} fill="none" stroke={P.amber} strokeWidth={54} strokeLinecap="round" strokeDasharray={`${Math.PI * R * prog(t, T(64) - 0.1, T(64) + 0.8)} 9999`} />
            <g transform={`rotate(${sw} ${cx} ${cy})`}>
              <line x1={cx} y1={cy} x2={cx} y2={cy - R + 30} stroke={P.white} strokeWidth={14} strokeLinecap="round" />
              <circle cx={cx} cy={cy} r={34} fill={P.white} />
              <circle cx={cx} cy={cy} r={14} fill={P.ink} />
            </g>
          </svg>
          <div style={{...center(940), ...txt(58, 700, P.mute, 0.16)}}>TASA DE INTERÉS</div>
          <Pop at={T(66) - 0.1} rot={-3} style={center(1060)}>
            <div style={{...txt(46, 800, P.ink, 0), background: P.white, padding: '14px 36px', borderRadius: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}>BANXICO MIRA EL EMPLEO</div>
          </Pop>
        </>
      );
    }}
  </Scene>
);

const S7: React.FC = () => (
  <Scene a={A[6]} b={A[7]} kind="left" out="up">
    {(lt, f) => (
      <>
        <ChainBar f={f} k={3} at={A[6]} />
        <Mask at={T(75) - 0.1} size={120} color={P.amber} style={center(340)}>TU BOLSILLO</Mask>
        {[
          {x: 70, t: 'DEUDAS', s: 'lo que pagas', c: P.coral, at: T(81) - 0.1, i: '−$'},
          {x: 560, t: 'AHORRO', s: 'lo que te dan', c: P.mint, at: T(86) - 0.1, i: '+$'},
        ].map((it, k) => (
          <Rise key={k} at={it.at} dy={130} style={abs(it.x, 560, 450)}>
            <Card style={{padding: '36px 30px 44px', transform: `rotate(${k ? 2 : -2}deg)`, textAlign: 'center'}}>
              <div style={{width: 120, height: 120, borderRadius: 99, background: it.c, margin: '0 auto 22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, fontWeight: 800, fontFamily: FONT, color: P.ink}}>{it.i}</div>
              <div style={{...txt(60, 800, P.ink, 0)}}>{it.t}</div>
              <div style={{...txt(36, 500, 'rgba(10,15,31,0.66)', 0), marginTop: 10}}>{it.s}</div>
            </Card>
          </Rise>
        ))}
      </>
    )}
  </Scene>
);

const Branch: React.FC<{x: number; title: string; sub: string; res: string; color: string; up: boolean; f: number; at: number}> = ({x, title, sub, res, color, up, f, at}) => {
  const falls = [0, 1, 2, 3].map((k) => fallAt(f, at + 0.35 + k * 0.16));
  return (
    <>
      <Rise at={at - 0.1} dy={60} style={abs(x, 520, 440)}>
        <div style={{padding: '18px 0', borderRadius: 26, background: 'rgba(255,255,255,0.1)', border: `3px solid ${color}`, textAlign: 'center'}}>
          <div style={{...txt(40, 800, color, 0.02)}}>{title}</div>
          <div style={{...txt(30, 600, P.mute, 0)}}>{sub}</div>
        </div>
      </Rise>
      <Chain x0={x + 20} y={700} s={0.42} falls={falls} gap={225} />
      <Rise at={at + 1.0} dy={60} style={abs(x, 900, 440)}>
        <Card style={{padding: '26px 20px 30px', textAlign: 'center', transform: `rotate(${up ? -1.5 : 1.5}deg)`}}>
          <div style={{...txt(86, 800, color === P.coral ? P.coral : '#0F8F68', 0)}}>{up ? '▼' : '▲'}</div>
          <div style={{...txt(38, 800, P.ink, 0), whiteSpace: 'normal', lineHeight: 1.1}}>{res}</div>
          <div style={{...txt(30, 500, 'rgba(10,15,31,0.62)', 0), marginTop: 6}}>en la cadena</div>
        </Card>
      </Rise>
    </>
  );
};
const S8: React.FC = () => (
  <Scene a={A[7]} b={A[8]} kind="zoom" out="up">
    {(lt, f) => (
      <>
        <Mask at={A[7] + 0.05} size={40} weight={700} color={P.mute} ls={0.1} style={center(250)}>REFERENCIA · SEP 2026</Mask>
        <Mask at={A[7] + 0.12} size={150} color={P.amber} style={center(300)}>2.8%</Mask>
        <Branch x={70} title="MÁS ALTO" sub="que 2.8%" res="MENOS INGRESO NUEVO" color={P.coral} up f={f} at={T(94)} />
        <Branch x={570} title="MÁS BAJO" sub="que 2.8%" res="MÁS INGRESO NUEVO" color={P.mint} up={false} f={f} at={T(109)} />
        <Pop at={T(110)} rot={-3} style={center(1180)}>
          <Chip size={28} bg="rgba(255,255,255,0.14)">EFECTO POSIBLE · NO ES PRONÓSTICO</Chip>
        </Pop>
      </>
    )}
  </Scene>
);

const S9: React.FC = () => (
  <Scene a={A[8]} b={ENOE_TOTAL + 1} kind="up" out="none">
    {(lt, f) => {
      const t = f / FPS;
      const back = easeIO(prog(t, T(118) - 0.1, ENOE_TOTAL - 0.2));
      return (
        <>
          <div style={{opacity: 1 - cl(back * 2.2), transform: `translateY(${back * 240}px) scale(${1 - back * 0.3})`}}>
            <Mask at={A[8] + 0.05} size={104} style={abs(80, 215)}>MAÑANA · INEGI</Mask>
            <Rise at={T(113) + 0.2} dy={110} style={abs(80, 380, 920)}>
              <Card style={{padding: '40px 44px 46px', transform: 'rotate(-1deg)'}}>
                <Chip bg={P.ink} color={P.amber} size={26}>FUENTE OFICIAL</Chip>
                <div style={{...txt(62, 800, P.ink, 0), whiteSpace: 'normal', lineHeight: 1.12, marginTop: 20}}>Indicadores de Ocupación y Empleo</div>
                <div style={{...txt(44, 600, 'rgba(10,15,31,0.66)', 0), marginTop: 14}}>octubre 2026 · jueves 26 nov</div>
              </Card>
            </Rise>
            <Rise at={T(120) - 0.1} dy={90} style={abs(80, 810, 920)}>
              <div style={{padding: '34px 40px', borderRadius: 36, border: `4px solid ${P.amber}`, background: 'rgba(255,196,71,0.1)'}}>
                <div style={{...txt(56, 800, P.white, 0), whiteSpace: 'normal', lineHeight: 1.15}}>¿Cuál ficha sientes tú primero?</div>
                <div style={{...txt(34, 600, P.mute, 0.04), marginTop: 12}}>Cuéntame en comentarios</div>
              </div>
            </Rise>
          </div>
          <div style={{opacity: cl((back - 0.45) / 0.55), transform: `scale(${lerp(0.85, 1, back)})`, transformOrigin: '50% 40%'}}>
            <HookBase f={0} />
          </div>
        </>
      );
    }}
  </Scene>
);

const MOOD_AT = [
  {at: 0, mood: 'steel'},
  {at: A[1], mood: 'navy'},
  {at: A[3], mood: 'plum'},
  {at: A[5], mood: 'ember'},
  {at: A[7], mood: 'forest'},
  {at: A[8], mood: 'steel'},
];
const PASOS = [
  {at: A[3], label: 'FICHA 1 DE 4'},
  {at: A[4], label: 'FICHA 2 DE 4'},
  {at: A[5], label: 'FICHA 3 DE 4'},
  {at: A[6], label: 'FICHA 4 DE 4'},
  {at: A[7], label: ''},
];

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const p = spr(f, A[4] + 0.2, 12, 200, 0.6);
  if (t < A[4] + 0.2 || t > A[7]) return null;
  return (
    <div style={{position: 'absolute', right: 70, top: 160, transform: `translateX(${(1 - p) * 200}px)`, opacity: cl(p * 2)}}>
      <Chip bg={P.white} color={P.ink} size={26}>＋ SÍGUEME</Chip>
    </div>
  );
};

export const PreviaEnoeMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={MOOD_AT} />
    <S1 />
    <S2 />
    <S3 />
    <S4 />
    <S5 />
    <S6 />
    <S7 />
    <S8 />
    <S9 />
    <Grain />
    <Frame serie="PREVIA · 25 NOV" total={ENOE_TOTAL} pasos={PASOS} nota="Contenido educativo, no es recomendación de inversión. Efectos posibles, no pronóstico. Fuente: INEGI, ENOE septiembre 2026 (boletín del 22 oct) y calendario de difusión 2026." />
    <Cta />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('previa-enoe/voz_mix.wav')} />}
  </AbsoluteFill>
);

export const PreviaEnoeCover: React.FC = () => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={[{at: 0, mood: 'steel'}]} />
    <div style={{...center(210), ...txt(74, 600, P.mute, 0.3)}}>MAÑANA</div>
    <div style={{...center(300), ...txt(360, 800, P.amber, -0.04), textShadow: '0 30px 80px rgba(0,0,0,0.45)'}}>?.?%</div>
    <div style={{...center(700), ...txt(70, 700, P.white, 0.04)}}>DESEMPLEO · OCTUBRE</div>
    <Chain x0={150} y={860} s={0.8} falls={[0.95, 0.9, 0.6, 0]} hot={3} gap={225} />
    <div style={{...center(1240), ...txt(56, 700, P.white, 0)}}>4 fichas que caen hasta tu bolsillo</div>
    <div style={center(1350)}>
      <Chip size={30}>PREVIA · INEGI</Chip>
    </div>
    <Grain />
  </AbsoluteFill>
);

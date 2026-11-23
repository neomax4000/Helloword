// Horizonte de inversión — glosario, ESTÁNDAR PRO (2026-11-23)
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/horizonte/words.json';
import {Backdrop, Captions, Card, Chip, FONT, FPS, Frame, Grain, Mask, P, Pop, Rise, Scene, Wd, buildGroups, cl, easeIO, easeOut, lerp, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const HORIZONTE_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1));
const groups = buildGroups(words, blocks);
const KEYS = ['FECHA', 'SALIDA', 'HORIZONTE', 'TIEMPO', 'CORTO', 'LARGO', 'SEIS', 'DIEZ', 'BAJA', 'DINERO', 'MENOS', 'MARGEN'];

const abs = (x: number, y: number, w?: number): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w});
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
const txt = (size: number, weight = 800, color = P.white, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});
const path = (pts: number[][]) => pts.map((p, i) => (i === 0 ? `M${p[0]} ${p[1]}` : `L${p[0]} ${p[1]}`)).join(' ');

/** calendario pequeño con un día marcado; mark 0..1 */
const Calendar: React.FC<{mark?: number; w?: number}> = ({mark = 1, w = 640}) => {
  const cell = w / 7;
  const DAY = 18; // día marcado (índice)
  return (
    <div style={{width: w, position: 'relative'}}>
      <div style={{display: 'grid', gridTemplateColumns: `repeat(7, ${cell}px)`, gridAutoRows: `${cell * 0.8}px`}}>
        {Array.from({length: 28}).map((_, i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', ...txt(cell * 0.34, 600, 'rgba(10,15,31,0.45)', 0), fontFamily: FONT}}>{i + 1}</div>
        ))}
      </div>
      <div style={{position: 'absolute', left: (DAY % 7) * cell + cell * 0.06, top: Math.floor(DAY / 7) * cell * 0.8 - cell * 0.04, width: cell * 0.88, height: cell * 0.88, borderRadius: '50%', background: P.amber, opacity: cl(mark * 2), transform: `scale(${lerp(0.2, 1, mark)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...txt(cell * 0.4, 800, P.ink, 0)}}>{DAY + 1}</div>
    </div>
  );
};

/* ---------------- gancho (también último fotograma: bucle) ---------------- */
const HookBase: React.FC<{f: number; mark?: number}> = ({f, mark = 1}) => (
  <>
    <div style={{...center(215), ...txt(84, 600, P.white, 0)}}>Cada inversión tiene</div>
    <div style={{...center(325), ...txt(185, 800, P.amber, -0.04)}}>FECHA</div>
    <div style={{...center(500), ...txt(135, 800, P.amber, -0.04)}}>DE SALIDA</div>
    <div style={{...center(700), transform: `translateY(${Math.sin(f / 10) * 8}px)`}}>
      <Card style={{padding: '40px 40px 36px'}}>
        <div style={{...txt(34, 700, 'rgba(10,15,31,0.5)', 0.16), marginBottom: 14}}>NOVIEMBRE · TU FECHA</div>
        <Calendar mark={mark} w={640} />
      </Card>
    </div>
  </>
);

/* ---------------- escenas ---------------- */
const S1: React.FC = () => (
  <Scene a={A[0]} b={A[1]} kind="none" out="up">
    {(lt, f) => (
      <AbsoluteFill style={{transform: `scale(${lerp(1.06, 1, easeOut(lt / 0.5))})`}}>
        <HookBase f={f} mark={1} />
      </AbsoluteFill>
    )}
  </Scene>
);

const S2: React.FC = () => (
  <Scene a={A[1]} b={A[2]} kind="up" out="left">
    {(lt, f) => {
      const t = f / FPS;
      const go = easeIO(prog(t, T(11), T(19)));
      const flag = spr(f, T(19) - 0.1, 10, 200, 0.6);
      const X0 = 150;
      const X1 = 880;
      return (
        <>
          <Mask at={A[1] + 0.05} size={118} color={P.amber} ls={-0.03} style={center(200)}>HORIZONTE</Mask>
          <Rise at={A[1] + 0.25} dy={110} style={abs(80, 410, 920)}>
            <Card style={{padding: '60px 40px 70px'}}>
              <div style={{...txt(34, 700, 'rgba(10,15,31,0.5)', 0.16), marginBottom: 40}}>TIEMPO QUE LO DEJAS INVERTIDO</div>
              <svg width={840} height={330} viewBox="0 0 840 330" style={{overflow: 'visible'}}>
                <line x1={20} y1={200} x2={820} y2={200} stroke={P.ink} strokeWidth={10} strokeLinecap="round" opacity={0.18} />
                <line x1={20} y1={200} x2={20 + go * 800} y2={200} stroke={P.ink} strokeWidth={16} strokeLinecap="round" />
                <circle cx={20} cy={200} r={26} fill={P.mint} />
                <text x={20} y={278} textAnchor="start" style={{fontFamily: FONT, fontWeight: 800, fontSize: 40}} fill={P.ink}>HOY</text>
                <circle cx={20 + go * 800} cy={200} r={20} fill={P.white} stroke={P.ink} strokeWidth={10} />
                <g transform={`translate(800 ${200 - 20}) scale(${flag})`} opacity={cl(flag * 2)}>
                  <line x1={0} y1={0} x2={0} y2={-140} stroke={P.ink} strokeWidth={10} strokeLinecap="round" />
                  <path d="M0 -140 L100 -112 L0 -84 Z" fill={P.coral} />
                </g>
                <text x={820} y={278} textAnchor="end" style={{fontFamily: FONT, fontWeight: 800, fontSize: 40}} fill={P.ink}>SALIDA</text>
              </svg>
            </Card>
          </Rise>
          <Rise at={T(13) - 0.1} dy={80} style={center(1010)}>
            <Chip bg={P.white} color={P.ink} size={46}>TIEMPO ⏱</Chip>
          </Rise>
        </>
      );
    }}
  </Scene>
);

const Seg: React.FC<{n: number; fill: number; color: string; w: number}> = ({n, fill, color, w}) => (
  <div style={{display: 'flex', gap: 8}}>
    {Array.from({length: n}).map((_, i) => {
      const on = fill * n > i;
      return <div key={i} style={{width: w, height: 70, borderRadius: 14, background: on ? color : 'rgba(10,15,31,0.12)'}} />;
    })}
  </div>
);

const S3: React.FC = () => (
  <Scene a={A[2]} b={A[3]} kind="zoom" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const f1 = easeOut(prog(t, T(22), T(24) + 0.2));
      const f2 = easeOut(prog(t, T(29), T(31) + 0.3));
      return (
        <>
          <Rise at={A[2] + 0.05} dy={60} style={abs(80, 200, 920)}>
            <div style={{...txt(38, 700, P.mute, 0.16)}}>EJEMPLO HIPOTÉTICO</div>
          </Rise>
          <Rise at={A[2] + 0.15} dy={110} style={abs(90, 290, 900)}>
            <Card style={{padding: '44px 50px 50px'}}>
              <div style={{...txt(100, 800, P.ink, -0.03)}}>6 <span style={{fontSize: 56}}>MESES</span></div>
              <div style={{marginTop: 18}}><Seg n={6} fill={f1} color="#E8892B" w={112} /></div>
              <div style={{marginTop: 22, ...txt(52, 800, '#C23B40', 0.08)}}>HORIZONTE CORTO</div>
            </Card>
          </Rise>
          <Rise at={T(27) - 0.15} dy={110} style={abs(90, 740, 900)}>
            <Card style={{padding: '44px 50px 50px'}}>
              <div style={{...txt(100, 800, P.ink, -0.03)}}>10 <span style={{fontSize: 56}}>AÑOS</span></div>
              <div style={{marginTop: 18}}><Seg n={10} fill={f2} color="#0F8F68" w={64} /></div>
              <div style={{marginTop: 22, ...txt(52, 800, '#0F8F68', 0.08)}}>HORIZONTE LARGO</div>
            </Card>
          </Rise>
        </>
      );
    }}
  </Scene>
);

const DIP = [[0, 40], [80, 110], [160, 70], [250, 200], [340, 130], [440, 70], [540, 20]];
const S4: React.FC = () => (
  <Scene a={A[3]} b={A[4]} kind="left" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const w = 760;
      const h = 420;
      const sp = DIP.map((p) => [20 + p[0] * ((w - 40) / 540), 30 + p[1] * ((h - 80) / 200)]);
      const draw = easeIO(prog(t, A[3] + 0.2, T(40) - 0.1));
      const cut = sp[3];
      const flag = spr(f, T(40) - 0.1, 10, 200, 0.6);
      const rest = easeOut(prog(t, T(43), T(46) + 0.3));
      return (
        <>
          <Mask at={A[3] + 0.04} size={96} style={center(205)}>MENOS <span style={{color: P.amber}}>TIEMPO</span></Mask>
          <Rise at={A[3] + 0.15} dy={110} style={abs(110, 400, 860)}>
            <Card style={{padding: '50px 50px 60px'}}>
              <div style={{...txt(32, 700, 'rgba(10,15,31,0.5)', 0.14), marginBottom: 20}}>PRECIO EN EL TIEMPO</div>
              <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{overflow: 'visible'}}>
                <path d={path(sp.slice(0, 4))} pathLength={1} fill="none" stroke={P.ink} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${Math.min(1, draw * 1.0)} 1`} />
                <path d={path(sp.slice(3))} fill="none" stroke={P.ink} strokeWidth={12} strokeLinecap="round" strokeDasharray="4 22" opacity={cl(rest * 2) * 0.7} />
                <g transform={`translate(${cut[0]} ${cut[1]}) scale(${flag})`} opacity={cl(flag * 2)}>
                  <line x1={0} y1={0} x2={0} y2={-120} stroke="#C23B40" strokeWidth={10} strokeLinecap="round" />
                  <path d="M0 -120 L90 -94 L0 -68 Z" fill="#C23B40" />
                  <circle r={22} fill="#C23B40" stroke={P.white} strokeWidth={8} />
                </g>
                <text x={cut[0] + 96} y={cut[1] + 70} style={{fontFamily: FONT, fontWeight: 800, fontSize: 90}} fill={P.ink} opacity={cl(rest * 2)}>?</text>
              </svg>
            </Card>
          </Rise>
          <Pop at={T(40) + 0.05} rot={-3} style={abs(110, 1090)}>
            <div style={{...txt(58, 800, P.white, 0.04), background: '#C23B40', padding: '14px 36px', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}>AQUÍ NECESITAS EL DINERO</div>
          </Pop>
        </>
      );
    }}
  </Scene>
);

const S5: React.FC = () => (
  <Scene a={A[4]} b={HORIZONTE_TOTAL + 1} kind="zoom" out="none">
    {(lt, f) => {
      const t = f / FPS;
      const back = easeIO(prog(t, T(52) - 0.15, HORIZONTE_TOTAL - 0.2));
      const p = spr(f, A[4] + 0.15, 11, 190, 0.6);
      return (
        <>
          <div style={{opacity: 1 - cl(back * 2.2), transform: `translateY(${back * 260}px) scale(${1 - back * 0.3})`}}>
            <Mask at={A[4] + 0.03} size={100} style={center(200)}>PON <span style={{color: P.amber}}>FECHA</span></Mask>
            <Mask at={A[4] + 0.1} size={100} style={center(325)}>A TU DINERO</Mask>
            <div style={{...center(520), transform: `scale(${lerp(0.5, 1, p)}) rotate(${lerp(-8, 0, p)}deg)`, opacity: cl(p * 2)}}>
              <Card style={{padding: '40px 40px 36px'}}>
                <Calendar mark={easeOut(prog(t, T(49), T(51)))} w={640} />
              </Card>
            </div>
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
  {at: A[3], mood: 'plum'},
  {at: A[4], mood: 'steel'},
  {at: A[4] + 2.0, mood: 'navy'},
];

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const p = spr(f, A[3] + 0.5, 12, 200, 0.6);
  if (t < A[3] + 0.5 || t > A[4]) return null;
  return (
    <div style={{position: 'absolute', right: 70, top: 1415, transform: `translateX(${(1 - p) * 200}px)`, opacity: cl(p * 2)}}>
      <Chip bg={P.white} color={P.ink} size={26}>＋ SÍGUEME</Chip>
    </div>
  );
};

const Pregunta: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const p = spr(f, A[4] + 0.2, 12, 190, 0.6);
  if (t < A[4] + 0.2 || t > HORIZONTE_TOTAL - 0.6) return null;
  return (
    <div style={{...center(1130), opacity: cl(p * 2) * (1 - cl((t - (HORIZONTE_TOTAL - 1.1)) / 0.4)), transform: `translateY(${(1 - p) * 60}px)`}}>
      <div style={{...txt(40, 700, P.white, 0), background: 'rgba(255,255,255,0.12)', border: '3px solid rgba(255,255,255,0.3)', padding: '12px 30px', borderRadius: 22}}>¿Para cuándo es tu próxima meta? 👇</div>
    </div>
  );
};

export const HorizonteMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={MOOD_AT} />
    <S1 />
    <S2 />
    <S3 />
    <S4 />
    <S5 />
    <Grain />
    <Frame serie="GLOSARIO FINANCIERO" total={HORIZONTE_TOTAL} nota="Contenido educativo, no es recomendación de inversión. Fuente: CONDUSEF. Ejemplo hipotético; el valor puede subir o bajar." />
    <Cta />
    <Pregunta />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('horizonte/voz_mix.wav')} />}
  </AbsoluteFill>
);

export const HorizonteCover: React.FC = () => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={[{at: 0, mood: 'navy'}]} />
    <div style={{...center(215), ...txt(96, 800, P.white, -0.02)}}>HORIZONTE DE</div>
    <div style={{...center(335), ...txt(150, 800, P.amber, -0.04)}}>INVERSIÓN</div>
    <div style={{...center(580), ...txt(70, 600, P.white, 0)}}>¿para cuándo es tu dinero?</div>
    <div style={{...center(740)}}>
      <Card style={{padding: '50px 50px 60px'}}>
        <Calendar mark={1} w={680} />
      </Card>
    </div>
    <div style={{...center(1350), ...txt(60, 700, P.white, 0)}}>qué significa</div>
    <div style={center(1450)}>
      <Chip size={30}>GLOSARIO FINANCIERO</Chip>
    </div>
    <Grain />
  </AbsoluteFill>
);

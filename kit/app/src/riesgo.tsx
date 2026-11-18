// Riesgo y volatilidad — glosario, ESTÁNDAR PRO (2026-11-18)
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/riesgo-volatilidad/words.json';
import {Backdrop, Captions, Card, Chip, FONT, FPS, Frame, Grain, Mask, P, Pop, Rise, Scene, Wd, buildGroups, cl, easeIO, easeOut, lerp, money, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const RIESGO_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1));
const groups = buildGroups(words, blocks);
const KEYS = ['BAJAR', 'SUBIR', 'RIESGO', 'INCERTIDUMBRE', 'VOLATILIDAD', 'PRECIO', 'DINERO', 'AGUANTAR', 'BAJA', 'SUBE', 'NUEVE', 'DIEZ'];

const abs = (x: number, y: number, w?: number): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w});
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
const txt = (size: number, weight = 800, color = P.white, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});

/* ---------------- ilustraciones ---------------- */
const path = (pts: number[][]) => pts.map((p, i) => (i === 0 ? `M${p[0]} ${p[1]}` : `L${p[0]} ${p[1]}`)).join(' ');
const DIP = [[0, 40], [80, 110], [160, 70], [250, 190], [340, 120], [440, 60], [540, 10]];

/** gráfica que baja y luego sube; draw 0..1 */
const Line: React.FC<{w?: number; h?: number; draw?: number; color?: string; pts?: number[][]; sw?: number; dot?: boolean}> = ({w = 760, h = 420, draw = 1, color = P.amber, pts = DIP, sw = 16, dot = true}) => {
  const maxX = Math.max(...pts.map((p) => p[0]));
  const maxY = Math.max(...pts.map((p) => p[1]));
  const sx = (w - 40) / maxX;
  const sy = (h - 60) / maxY;
  const sp = pts.map((p) => [20 + p[0] * sx, 30 + p[1] * sy]);
  // posición del punto en el avance
  const total = sp.length - 1;
  const seg = Math.min(total - 1, Math.floor(draw * total));
  const lt = draw * total - seg;
  const a = sp[seg];
  const b = sp[seg + 1];
  const px = lerp(a[0], b[0], lt);
  const py = lerp(a[1], b[1], lt);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{overflow: 'visible'}}>
      <line x1={0} y1={h - 8} x2={w} y2={h - 8} stroke="rgba(255,255,255,0.25)" strokeWidth={4} strokeLinecap="round" />
      <path d={path(sp)} pathLength={1} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${draw} 1`} />
      {dot && draw > 0.01 && <circle cx={px} cy={py} r={sw * 1.1} fill={P.white} stroke={color} strokeWidth={sw * 0.5} />}
    </svg>
  );
};

const Arrow: React.FC<{up?: boolean; size?: number; color?: string}> = ({up = true, size = 120, color = P.mint}) => (
  <svg width={size} height={size} viewBox="-60 -60 120 120" style={{filter: 'drop-shadow(0 10px 14px rgba(0,0,0,0.4))'}}>
    <g transform={up ? '' : 'scale(1,-1)'}>
      <path d="M0 -44 V40 M-34 -10 L0 -46 L34 -10" stroke={color} strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

/* ---------------- gancho (también último fotograma: bucle) ---------------- */
const HookBase: React.FC<{f: number}> = ({f}) => (
  <>
    <div style={{...center(215), ...txt(84, 600, P.white, 0)}}>Tu inversión</div>
    <div style={{...center(325), ...txt(215, 800, P.amber, -0.04)}}>PUEDE</div>
    <div style={{...center(520), ...txt(215, 800, P.amber, -0.04)}}>BAJAR</div>
    <div style={{...center(770), ...txt(84, 600, P.white, 0)}}>antes de subir</div>
    <div style={{...center(900), transform: `translateY(${Math.sin(f / 10) * 8}px)`}}>
      <Line draw={1} h={330} />
    </div>
  </>
);

/* ---------------- escenas ---------------- */
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
      const fork = easeOut(prog(t, T(11) - 0.2, T(11) + 0.5));
      const q = spr(f, T(8) - 0.05, 10, 190, 0.7);
      return (
        <>
          <Mask at={A[1] + 0.05} size={170} color={P.amber} ls={-0.03} style={center(200)}>RIESGO</Mask>
          <div style={{...center(440), transform: `scale(${lerp(0.5, 1, q)}) rotate(${lerp(-10, 0, q)}deg)`, opacity: cl(q * 2)}}>
            <div style={{width: 380, height: 380, borderRadius: 64, background: P.paper, boxShadow: '0 40px 70px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <span style={{...txt(300, 800, P.ink, 0)}}>?</span>
            </div>
          </div>
          <div style={{position: 'absolute', left: 120, top: 860, opacity: cl(fork * 2), transform: `translateX(${(1 - fork) * -80}px)`}}>
            <Arrow up size={200} color={P.mint} />
          </div>
          <div style={{position: 'absolute', left: 760, top: 860, opacity: cl(fork * 2), transform: `translateX(${(1 - fork) * 80}px)`}}>
            <Arrow up={false} size={200} color={P.coral} />
          </div>
          <Rise at={T(11) - 0.1} dy={80} style={center(1090)}>
            <Chip bg={P.white} color={P.ink} size={46}>INCERTIDUMBRE</Chip>
          </Rise>
          <Rise at={T(16) - 0.1} dy={60} style={center(1190)}>
            <div style={{...txt(52, 700, P.mute, 0.1)}}>DE TU DINERO</div>
          </Rise>
        </>
      );
    }}
  </Scene>
);

const WAVE = [[0, 120], [60, 30], [120, 150], [190, 20], [260, 170], [330, 50], [400, 140], [470, 30], [540, 100]];
const S3: React.FC = () => (
  <Scene a={A[2]} b={A[3]} kind="zoom" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const draw = easeIO(prog(t, T(19) + 0.1, T(26) + 0.1));
      const up = spr(f, T(22) - 0.05, 10, 220, 0.6);
      const dn = spr(f, T(24) - 0.05, 10, 220, 0.6);
      return (
        <>
          <Mask at={A[2] + 0.04} size={125} color={P.amber} ls={-0.03} style={center(200)}>VOLATILIDAD</Mask>
          <Rise at={A[2] + 0.2} dy={120} style={abs(110, 400, 860)}>
            <Card style={{padding: '60px 50px 70px'}}>
              <div style={{...txt(32, 700, 'rgba(10,15,31,0.5)', 0.14), marginBottom: 24}}>PRECIO EN EL TIEMPO</div>
              <svg width={760} height={430} viewBox="0 0 760 430" style={{overflow: 'visible'}}>
                <path d={path(WAVE.map((p) => [20 + p[0] * 1.35, 40 + p[1] * 2]))} pathLength={1} fill="none" stroke={P.ink} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${draw} 1`} />
              </svg>
            </Card>
          </Rise>
          <div style={{position: 'absolute', left: 160, top: 1010, opacity: cl(up * 2), transform: `translateY(${(1 - up) * 60}px)`}}>
            <Chip bg={P.mint} color={P.ink} size={44}>SUBE ▲</Chip>
          </div>
          <div style={{position: 'absolute', left: 560, top: 1010, opacity: cl(dn * 2), transform: `translateY(${(1 - dn) * 60}px)`}}>
            <Chip bg={P.coral} color={P.ink} size={44}>BAJA ▼</Chip>
          </div>
        </>
      );
    }}
  </Scene>
);

const S4: React.FC = () => (
  <Scene a={A[3]} b={A[4]} kind="left" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const dnT = easeIO(prog(t, T(32) - 0.15, T(32) + 0.35));
      const upT = easeIO(prog(t, T(41) - 0.15, T(41) + 0.35));
      const val = 10000 - 1000 * dnT + 1000 * upT;
      const low = dnT * (1 - upT);
      const mes = t < T(36) ? '' : '';
      const barH = (v: number) => (v / 10000) * 380;
      return (
        <>
          <Rise at={A[3] + 0.05} dy={60} style={abs(80, 200, 920)}>
            <div style={{...txt(38, 700, P.mute, 0.16)}}>EJEMPLO HIPOTÉTICO</div>
          </Rise>
          <Rise at={T(27) - 0.05} dy={120} style={abs(90, 290, 900)}>
            <Card style={{padding: '40px 56px 50px', transform: 'rotate(-1deg)'}}>
              <div style={{...txt(40, 600, 'rgba(10,15,31,0.6)', 0)}}>Valor de tu inversión</div>
              <div style={{position: 'relative', display: 'inline-block', marginTop: 6}}>
                <div style={{position: 'absolute', left: -12, right: -18, bottom: 24, height: 70, background: low > 0.5 ? P.coral : P.mint, borderRadius: 14, opacity: 0.9}} />
                <div style={{...txt(190, 800, P.ink, -0.04), position: 'relative'}}>{money(val)}</div>
              </div>
              <div style={{...txt(30, 500, 'rgba(10,15,31,0.55)', 0), marginTop: 6}}>Base: inviertes $10,000 · baja 10% · regresa a $10,000</div>
            </Card>
          </Rise>
          <div style={{position: 'absolute', left: 150, top: 720, display: 'flex', alignItems: 'flex-end', gap: 46, height: 400}}>
            {[{v: 10000, at: T(27)}, {v: 9000, at: T(32) - 0.1}, {v: 10000, at: T(41) - 0.1}].map((b, k) => {
              const p = spr(f, b.at, 14, 200, 0.6);
              return (
                <div key={k} style={{width: 220, height: barH(b.v) * p, borderRadius: '26px 26px 8px 8px', background: k === 1 ? P.coral : P.mint, boxShadow: '0 24px 40px rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}}>
                  <span style={{...txt(46, 800, P.ink, 0), marginTop: 18, opacity: cl(p * 2)}}>{k === 1 ? '$9,000' : '$10,000'}</span>
                </div>
              );
            })}
          </div>
          <Pop at={T(36) - 0.05} rot={-3} style={abs(110, 1160)}>
            <div style={{...txt(46, 800, P.white, 0.04), background: 'rgba(255,255,255,0.12)', border: '3px solid rgba(255,255,255,0.3)', padding: '12px 32px', borderRadius: 20}}>INICIO · MES 1 · DESPUÉS</div>
          </Pop>
        </>
      );
    }}
  </Scene>
);

const JAG = [[0, 100], [50, 20], [100, 160], [150, 10], [200, 170], [250, 30], [300, 150]];
const CALM = [[0, 100], [50, 80], [100, 110], [150, 70], [200, 100], [250, 85], [300, 95]];
const S5: React.FC = () => (
  <Scene a={A[4]} b={A[5]} kind="up" out="zoom">
    {(lt, f) => {
      const t = f / FPS;
      const d1 = easeOut(prog(t, A[4] + 0.2, T(45) + 0.2));
      const d2 = easeOut(prog(t, T(46) - 0.05, T(47) + 0.4));
      return (
        <>
          <Mask at={A[4] + 0.04} size={88} style={center(220)}>A MÁS <span style={{color: P.amber}}>VOLATILIDAD</span></Mask>
          <Rise at={A[4] + 0.15} dy={90} style={abs(110, 400, 860)}>
            <Card style={{padding: '30px 44px 40px'}}>
              <div style={{...txt(34, 700, '#0F8F68', 0.12)}}>MENOS SUBE Y BAJA</div>
              <svg width={760} height={150} viewBox="0 0 760 150" style={{overflow: 'visible'}}>
                <path d={path(CALM.map((p) => [10 + p[0] * 2.4, 20 + p[1] * 0.7]))} pathLength={1} fill="none" stroke="#0F8F68" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${d1} 1`} />
              </svg>
            </Card>
          </Rise>
          <Rise at={T(45)} dy={90} style={abs(110, 750, 860)}>
            <Card style={{padding: '30px 44px 40px'}}>
              <div style={{...txt(34, 700, '#C23B40', 0.12)}}>MÁS SUBE Y BAJA</div>
              <svg width={760} height={190} viewBox="0 0 760 190" style={{overflow: 'visible'}}>
                <path d={path(JAG.map((p) => [10 + p[0] * 2.4, 10 + p[1]]))} pathLength={1} fill="none" stroke="#C23B40" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${d2} 1`} />
              </svg>
            </Card>
          </Rise>
          <Pop at={T(46) + 0.05} rot={-3} style={abs(110, 1090)}>
            <div style={{...txt(64, 800, P.ink, 0), background: P.amber, padding: '14px 40px', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}>MÁS INCERTIDUMBRE</div>
          </Pop>
        </>
      );
    }}
  </Scene>
);

const S6: React.FC = () => (
  <Scene a={A[5]} b={RIESGO_TOTAL + 1} kind="zoom" out="none">
    {(lt, f) => {
      const t = f / FPS;
      const back = easeIO(prog(t, T(53) - 0.15, RIESGO_TOTAL - 0.2));
      const needle = easeOut(prog(t, A[5] + 0.3, T(51) + 0.3));
      const ang = lerp(-80, 25, needle) + Math.sin(f / 7) * 3 * needle;
      return (
        <>
          <div style={{opacity: 1 - cl(back * 2.2), transform: `translateY(${back * 260}px) scale(${1 - back * 0.3})`}}>
            <Mask at={A[5] + 0.03} size={96} style={center(200)}>CUÁNTA <span style={{color: P.amber}}>BAJA</span></Mask>
            <Mask at={A[5] + 0.1} size={96} style={center(320)}>AGUANTAS</Mask>
            <Rise at={A[5] + 0.1} dy={140} style={center(500)}>
              <Card style={{width: 700, height: 520, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg width={560} height={380} viewBox="-280 -250 560 380">
                  <path d="M-220 0 A220 220 0 0 1 -73 -207" fill="none" stroke={P.mint} strokeWidth={46} strokeLinecap="butt" />
                  <path d="M-73 -207 A220 220 0 0 1 73 -207" fill="none" stroke={P.amber} strokeWidth={46} />
                  <path d="M73 -207 A220 220 0 0 1 220 0" fill="none" stroke={P.coral} strokeWidth={46} />
                  <line x1={0} y1={0} x2={0} y2={-170} stroke={P.ink} strokeWidth={16} strokeLinecap="round" transform={`rotate(${ang})`} />
                  <circle r={24} fill={P.ink} />
                </svg>
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
  {at: A[2], mood: 'plum'},
  {at: A[3], mood: 'forest'},
  {at: A[5], mood: 'steel'},
  {at: A[5] + 2.2, mood: 'navy'},
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

export const RiesgoMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={MOOD_AT} />
    <S1 />
    <S2 />
    <S3 />
    <S4 />
    <S5 />
    <S6 />
    <Grain />
    <Frame serie="GLOSARIO FINANCIERO" total={RIESGO_TOTAL} nota="Contenido educativo, no es recomendación de inversión. Fuente: CONDUSEF. Ejemplo hipotético; el valor puede subir o bajar." />
    <Cta />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('riesgo-volatilidad/voz_mix.wav')} />}
  </AbsoluteFill>
);

export const RiesgoCover: React.FC = () => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={[{at: 0, mood: 'navy'}]} />
    <div style={{...center(215), ...txt(96, 800, P.white, -0.02)}}>RIESGO Y</div>
    <div style={{...center(335), ...txt(150, 800, P.amber, -0.04)}}>VOLATILIDAD</div>
    <div style={{...center(580), ...txt(70, 600, P.white, 0)}}>sube y baja</div>
    <div style={{...center(740)}}>
      <Card style={{padding: '50px 50px 60px'}}>
        <Line draw={1} w={760} h={420} color={P.ink} />
      </Card>
    </div>
    <div style={{...center(1350), ...txt(60, 700, P.white, 0)}}>qué significan</div>
    <div style={center(1450)}>
      <Chip size={30}>GLOSARIO FINANCIERO</Chip>
    </div>
    <Grain />
  </AbsoluteFill>
);

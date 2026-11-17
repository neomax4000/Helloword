// Comisión — glosario, ESTÁNDAR PRO (2026-11-17)
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/comision/words.json';
import {Backdrop, Captions, Card, Chip, FONT, FPS, Frame, Grain, Mask, P, Pop, Rise, Scene, Wd, buildGroups, cl, easeIO, easeOut, lerp, money, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const COMISION_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1));
const groups = buildGroups(words, blocks);
const KEYS = ['CIEN','MIL','DOSCIENTOS','AÑO','COMISIÓN','BANCO','MENSUALES','MESES','BANXICO','PROHIBIDOS','CAJEROS','LISTA','COMISIONES','ESTADO','CUENTA'];

const abs = (x: number, y: number, w?: number): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w});
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
const txt = (size: number, weight = 800, color = P.white, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});

/* ---------------- ilustraciones ---------------- */
const Coin: React.FC<{size?: number; label?: string}> = ({size = 120, label = '$'}) => (
  <svg width={size} height={size} viewBox="-60 -60 120 120" style={{filter: 'drop-shadow(0 12px 16px rgba(0,0,0,0.45))'}}>
    <circle r={56} fill={P.amber} />
    <circle r={44} fill="none" stroke="rgba(10,15,31,0.35)" strokeWidth={5} />
    <text x={0} y={16} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={label.length > 1 ? 34 : 52} fill={P.ink}>{label}</text>
  </svg>
);
const Bank: React.FC<{size?: number; color?: string}> = ({size = 150, color = P.paper}) => (
  <svg width={size} height={size * 0.95} viewBox="-100 -95 200 190">
    <path d="M-92 -20 L0 -88 L92 -20Z" fill={color} />
    {[-60, -20, 20, 60].map((x) => (
      <rect key={x} x={x - 11} y={-12} width={22} height={70} rx={4} fill={color} />
    ))}
    <rect x={-92} y={66} width={184} height={20} rx={6} fill={color} />
  </svg>
);
const Cross: React.FC<{size?: number}> = ({size = 150}) => (
  <svg width={size} height={size} viewBox="-100 -100 200 200" style={{filter: 'drop-shadow(0 14px 18px rgba(0,0,0,0.45))'}}>
    <path d="M-70 -70 L70 70 M70 -70 L-70 70" stroke={P.coral} strokeWidth={30} strokeLinecap="round" />
  </svg>
);
const Tick: React.FC<{size?: number}> = ({size = 120}) => (
  <svg width={size} height={size} viewBox="-60 -60 120 120" style={{filter: 'drop-shadow(0 10px 14px rgba(0,0,0,0.4))'}}>
    <circle r={56} fill={P.mint} />
    <path d="M-26 2 L-8 22 L28 -18" stroke={P.ink} strokeWidth={15} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Atm: React.FC = () => (
  <svg width={470} height={640} viewBox="-235 -320 470 640" style={{filter: 'drop-shadow(0 40px 50px rgba(0,0,0,0.5))'}}>
    <rect x={-210} y={-300} width={420} height={600} rx={46} fill={P.paper} />
    <rect x={-160} y={-250} width={320} height={190} rx={22} fill={P.ink} />
    <text x={0} y={-150} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={64} fill={P.amber}>CAJERO</text>
    <text x={0} y={-96} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={34} fill="rgba(255,255,255,0.7)">del mismo banco</text>
    {[0, 1, 2].map((k) => (
      <rect key={k} x={-160 + k * 112} y={-20} width={96} height={52} rx={14} fill="rgba(10,15,31,0.12)" />
    ))}
    {[0, 1, 2].map((k) => (
      <rect key={k} x={-160 + k * 112} y={52} width={96} height={52} rx={14} fill="rgba(10,15,31,0.12)" />
    ))}
    <rect x={-150} y={170} width={300} height={34} rx={17} fill={P.ink} />
    <rect x={-120} y={150} width={240} height={14} rx={7} fill="rgba(10,15,31,0.25)" />
  </svg>
);

/* ---------------- gancho (también último fotograma: bucle) ---------------- */
const HookBase: React.FC<{f: number}> = ({f}) => (
  <>
    <div style={{...center(215), ...txt(330, 800, P.amber, -0.04)}}>$100</div>
    <div style={{...center(545), ...txt(96, 600, P.white, 0)}}>al mes</div>
    <div style={{...center(700), transform: `translateY(${Math.sin(f / 10) * 8}px)`}}>
      <div style={{...txt(170, 800, P.ink, -0.03), background: P.paper, padding: '26px 56px 14px', borderRadius: 44, boxShadow: '0 40px 70px rgba(0,0,0,0.5)', transform: 'rotate(-2deg)'}}>$1,200</div>
    </div>
    <div style={{...center(960), ...txt(84, 700, P.white, 0)}}>al año</div>
  </>
);

/* ---------------- escenas ---------------- */
const S1: React.FC = () => (
  <Scene a={A[0]} b={A[1]} kind="none" out="up">
    {(lt, f) => {
      const zoomIn = lerp(1.06, 1, easeOut(lt / 0.5));
      return (
        <AbsoluteFill style={{transform: `scale(${zoomIn})`}}>
          <HookBase f={f} />
        </AbsoluteFill>
      );
    }}
  </Scene>
);

const S2: React.FC = () => (
  <Scene a={A[1]} b={A[2]} kind="up" out="left">
    {(lt, f) => {
      const t = f / FPS;
      const hub = spr(f, T(12) - 0.1, 12, 200, 0.6);
      const flow = easeOut(prog(t, T(17) - 0.1, T(18) + 0.4));
      return (
        <>
          <Mask at={A[1] + 0.05} size={150} color={P.amber} ls={-0.03} style={center(190)}>COMISIÓN</Mask>
          <Rise at={T(14)} dy={80} style={abs(70, 470)}>
            <div style={{width: 300, height: 300, borderRadius: 50, background: 'rgba(255,255,255,0.1)', border: '3px solid rgba(255,255,255,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Bank size={200} />
            </div>
          </Rise>
          <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
            <line x1={400} y1={620} x2={lerp(400, 690, flow)} y2={620} stroke="rgba(255,255,255,0.5)" strokeWidth={8} strokeDasharray="4 18" strokeLinecap="round" />
          </svg>
          <Pop at={T(17)} from={0.3} style={abs(700, 470)}>
            <div style={{width: 300, height: 300, borderRadius: 50, background: P.amber, boxShadow: '0 40px 70px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${lerp(0.6, 1, hub)})`}}>
              <Coin size={200} />
            </div>
          </Pop>
          <Rise at={T(18)} dy={60} style={center(880)}>
            <Chip bg="rgba(255,255,255,0.14)" size={44}>TU BANCO TE COBRA</Chip>
          </Rise>
          <Rise at={T(19)} dy={120} style={center(1020)}>
            <Card style={{padding: '30px 60px'}}>
              <div style={{...txt(78, 800, P.ink, 0)}}>POR UN SERVICIO</div>
            </Card>
          </Rise>
        </>
      );
    }}
  </Scene>
);

const S3: React.FC = () => {
  const meses = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  return (
    <Scene a={A[2]} b={A[3]} kind="left" out="up">
      {(lt, f) => {
        const t = f / FPS;
        const t0 = T(25) - 0.1;
        const t1 = T(31);
        const c = easeOut(prog(t, T(31) - 0.1, T(33) + 0.2));
        const punch = spr(f, T(33) + 0.2, 7, 260, 0.5);
        return (
          <>
            <Rise at={A[2] + 0.05} dy={60} style={center(190)}>
              <div style={{...txt(40, 700, P.mute, 0.16)}}>$100 × 12 MESES</div>
            </Rise>
            <div style={{position: 'absolute', left: 90, top: 280, width: 900, display: 'flex', flexWrap: 'wrap', gap: 20}}>
              {meses.map((m, k) => {
                const on = t >= lerp(t0, t1, k / 11);
                const p = spr(f, lerp(t0, t1, k / 11), 12, 240, 0.5);
                return (
                  <div key={k} style={{width: 200, height: 150, borderRadius: 28, background: on ? P.paper : 'rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${on ? lerp(1.12, 1, p) : 1})`}}>
                    <span style={{...txt(34, 700, on ? 'rgba(10,15,31,0.55)' : P.mute, 0.1)}}>{m}</span>
                    <span style={{...txt(56, 800, on ? P.ink : 'rgba(255,255,255,0.25)', 0)}}>$100</span>
                  </div>
                );
              })}
            </div>
            <div style={{...center(920), transform: `scale(${lerp(1.07, 1, punch)})`}}>
              <div style={{position: 'relative'}}>
                <div style={{position: 'absolute', left: -20, right: -20, bottom: 30, height: 100, background: P.amber, borderRadius: 18, transform: `scaleX(${c})`, transformOrigin: '0 50%'}} />
                <div style={{...txt(260, 800, P.white, -0.04), position: 'relative', color: c > 0.9 ? P.ink : P.white}}>{money(c * 1200)}</div>
              </div>
            </div>
            <Pop at={T(31)} rot={-3} style={abs(110, 1210)}>
              <div style={{...txt(46, 800, P.ink, 0.04), background: P.mint, padding: '12px 32px', borderRadius: 20}}>EN UN AÑO</div>
            </Pop>
          </>
        );
      }}
    </Scene>
  );
};

const S4: React.FC = () => (
  <Scene a={A[3]} b={A[4]} kind="zoom" out="up">
    {(lt, f) => {
      const x = spr(f, T(40) - 0.1, 8, 240, 0.6);
      return (
        <>
          <Mask at={A[3] + 0.05} size={150} color={P.coral} ls={-0.03} style={center(190)}>PROHIBIDO</Mask>
          <div style={{position: 'absolute', left: 90, top: 380}}>
            <Rise at={A[3] + 0.1} dy={120}>
              <Atm />
            </Rise>
          </div>
          <Pop at={T(41) - 0.1} rot={4} style={abs(560, 470)}>
            <div style={{position: 'relative'}}>
              <Card style={{padding: '22px 38px', display: 'flex', alignItems: 'center', gap: 20}}>
                <Coin size={80} />
                <div style={{...txt(52, 800, P.ink, 0)}}>RETIRO</div>
              </Card>
              <div style={{position: 'absolute', left: 330, top: -30, opacity: cl(x * 3), transform: `scale(${lerp(2.2, 1, x)})`}}>
                <Cross size={140} />
              </div>
            </div>
          </Pop>
          <Pop at={T(43) - 0.1} rot={-4} style={abs(560, 680)}>
            <div style={{position: 'relative'}}>
              <Card style={{padding: '22px 38px'}}>
                <div style={{...txt(52, 800, P.ink, 0)}}>SALDO</div>
              </Card>
              <div style={{position: 'absolute', left: 270, top: -30, opacity: cl(spr(f, T(43) + 0.1, 8, 240, 0.6) * 3), transform: `scale(${lerp(2.2, 1, spr(f, T(43) + 0.1, 8, 240, 0.6))})`}}>
                <Cross size={140} />
              </div>
            </div>
          </Pop>
          <Rise at={T(37) - 0.05} dy={60} style={abs(560, 920)}>
            <Chip bg={P.ink} color={P.amber} size={34}>SEGÚN BANXICO</Chip>
          </Rise>
        </>
      );
    }}
  </Scene>
);

const S5: React.FC = () => {
  const rows = ['Manejo de cuenta', 'Anualidad', 'Retiro en cajero ajeno'];
  return (
    <Scene a={A[4]} b={A[5]} kind="up" out="zoom">
      {(lt, f) => (
        <>
          <Mask at={A[4] + 0.05} size={110} style={center(195)}>PIDE LA <span style={{color: P.amber}}>LISTA</span></Mask>
          <Rise at={T(57) - 0.2} dy={150} style={abs(110, 430, 860)}>
            <Card style={{padding: '40px 50px 50px', transform: 'rotate(-1.2deg)'}}>
              <div style={{...txt(34, 700, 'rgba(10,15,31,0.55)', 0.12)}}>COMISIONES DE LA CUENTA</div>
              {rows.map((r, k) => (
                <Rise key={k} at={T(58) + k * 0.28} dy={30} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 0', borderBottom: k < 2 ? '3px dashed rgba(10,15,31,0.16)' : 'none'}}>
                  <span style={{...txt(44, 600, P.ink, 0)}}>{r}</span>
                  <span style={{...txt(44, 800, 'rgba(10,15,31,0.35)', 0)}}>$ ___</span>
                </Rise>
              ))}
            </Card>
          </Rise>
          <Pop at={T(60) - 0.05} style={abs(70, 1110)}>
            <Tick size={150} />
          </Pop>
        </>
      )}
    </Scene>
  );
};

const S6: React.FC = () => (
  <Scene a={A[5]} b={COMISION_TOTAL + 1} kind="zoom" out="none">
    {(lt, f) => {
      const t = f / FPS;
      const back = easeIO(prog(t, T(66) - 0.15, COMISION_TOTAL - 0.2));
      const lens = spr(f, T(63) - 0.1, 11, 190, 0.6);
      return (
        <>
          <div style={{opacity: 1 - cl(back * 2.2), transform: `translateY(${back * 260}px) scale(${1 - back * 0.3})`}}>
            <Mask at={A[5] + 0.05} size={96} style={center(205)}>ESTADO DE <span style={{color: P.amber}}>CUENTA</span></Mask>
            <Rise at={A[5] + 0.1} dy={140} style={abs(110, 420, 860)}>
              <Card style={{padding: '36px 50px 44px', transform: 'rotate(1.2deg)', position: 'relative'}}>
                {[['Súper', '−$ 640'], ['Gasolina', '−$ 500'], ['Comisión', '−$ 100'], ['Nómina', '+$ 12,000']].map(([a, b], k) => (
                  <div key={k} style={{display: 'flex', justifyContent: 'space-between', padding: '24px 14px', borderRadius: 16, background: k === 2 ? 'rgba(255,184,64,0.5)' : 'transparent', borderBottom: k === 2 || k === 3 ? 'none' : '3px dashed rgba(10,15,31,0.16)'}}>
                    <span style={{...txt(44, k === 2 ? 800 : 500, P.ink, 0)}}>{a}</span>
                    <span style={{...txt(44, 800, b.startsWith('+') ? '#0F8F68' : P.ink, 0)}}>{b}</span>
                  </div>
                ))}
                <div style={{position: 'absolute', left: 330, top: 150, opacity: cl(lens * 2), transform: `scale(${lerp(0.4, 1, lens)})`}}>
                  <svg width={230} height={230} viewBox="-115 -115 230 230" style={{filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.45))'}}>
                    <circle cx={-14} cy={-14} r={74} fill="rgba(255,255,255,0.1)" stroke={P.ink} strokeWidth={16} />
                    <path d="M40 40 L96 96" stroke={P.ink} strokeWidth={22} strokeLinecap="round" />
                  </svg>
                </div>
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
  {at: A[3], mood: 'plum'},
  {at: A[5], mood: 'steel'},
];

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const p = spr(f, A[3] + 0.5, 12, 200, 0.6);
  if (t < A[3] + 0.5 || t > A[5] + 0.5) return null;
  return (
    <div style={{position: 'absolute', right: 70, top: 1455, transform: `translateX(${(1 - p) * 200}px)`, opacity: cl(p * 2)}}>
      <Chip bg={P.white} color={P.ink} size={26}>＋ SÍGUEME</Chip>
    </div>
  );
};

export const ComisionMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={MOOD_AT} />
    <S1 />
    <S2 />
    <S3 />
    <S4 />
    <S5 />
    <S6 />
    <Grain />
    <Frame serie="GLOSARIO FINANCIERO" total={COMISION_TOTAL} nota="Contenido educativo, no es recomendación de inversión. Fuente: Banxico. Ejemplo hipotético." />
    <Cta />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('comision/voz_mix.wav')} />}
  </AbsoluteFill>
);

export const ComisionCover: React.FC = () => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={[{at: 0, mood: 'navy'}]} />
    <div style={{...center(230), ...txt(250, 800, P.amber, -0.04)}}>COMISIÓN</div>
    <div style={{...center(520), ...txt(90, 600, P.white, 0)}}>$100 al mes</div>
    <div style={{...center(680), transform: 'rotate(-2deg)'}}>
      <div style={{...txt(190, 800, P.ink, -0.03), background: P.paper, padding: '26px 56px 14px', borderRadius: 44, boxShadow: '0 40px 70px rgba(0,0,0,0.5)'}}>$1,200</div>
    </div>
    <div style={{...center(1000), ...txt(84, 700, P.white, 0)}}>al año</div>
    <div style={{...center(1450)}}>
      <Chip size={30}>GLOSARIO FINANCIERO</Chip>
    </div>
    <Grain />
  </AbsoluteFill>
);

// DEUDA BUENA vs MALA — educativo, Estándar Pro (2026-11-14)
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/deuda/words.json';
import {Backdrop, Captions, Card, Chip, FONT, FPS, Frame, Grain, Mask, P, Pop, Rise, Scene, Wd, buildGroups, cl, easeIO, easeOut, lerp, money, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const DEUDA_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1));
const groups = buildGroups(words, blocks);
const KEYS = ['TARJETA', 'TREINTA', 'SEIS', 'CIENTO', 'MALA', 'BUENA', 'TRES', 'SEÑALES', 'INTERESES', 'OLVIDA', 'SUELDO', 'INGRESO', 'QUINCE', 'QUINIENTOS', 'CUENTA', 'FINANCIAS', 'CUESTA'];

const abs = (x: number, y: number, w?: number): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w});
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
const txt = (size: number, weight = 800, color = P.white, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});

/* ---------------- ilustraciones ---------------- */
const CardArt: React.FC<{s?: number}> = ({s = 1}) => (
  <svg width={600 * s} height={380 * s} viewBox="0 0 600 380" style={{filter: 'drop-shadow(0 36px 44px rgba(0,0,0,0.5))'}}>
    <defs>
      <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3A4E9A" />
        <stop offset="1" stopColor="#141C42" />
      </linearGradient>
    </defs>
    <rect x={10} y={10} width={580} height={360} rx={34} fill="url(#cg)" />
    <rect x={10} y={80} width={580} height={64} fill="rgba(0,0,0,0.55)" />
    <rect x={56} y={186} width={92} height={68} rx={14} fill={P.amber} />
    <path d="M56 220 H148 M102 186 V254" stroke={P.amberDeep} strokeWidth={4} />
    <rect x={56} y={290} width={300} height={22} rx={11} fill="rgba(255,255,255,0.35)" />
    <circle cx={470} cy={300} r={36} fill={P.coral} opacity={0.95} />
    <circle cx={510} cy={300} r={36} fill={P.amber} opacity={0.95} />
  </svg>
);
const Cross: React.FC<{size?: number; w?: number}> = ({size = 300, w = 46}) => (
  <svg width={size} height={size} viewBox="-100 -100 200 200" style={{filter: 'drop-shadow(0 14px 18px rgba(0,0,0,0.45))'}}>
    <path d="M-70 -70 L70 70 M70 -70 L-70 70" stroke={P.coral} strokeWidth={(w / size) * 200} strokeLinecap="round" />
  </svg>
);
const Tick: React.FC<{size?: number; bg?: string}> = ({size = 120, bg = P.mint}) => (
  <svg width={size} height={size} viewBox="-60 -60 120 120" style={{filter: 'drop-shadow(0 10px 14px rgba(0,0,0,0.4))'}}>
    <circle r={56} fill={bg} />
    <path d="M-26 2 L-8 22 L28 -18" stroke={P.ink} strokeWidth={15} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Ico: React.FC<{k: 'cap' | 'job' | 'home' | 'plane' | 'bag'; c: string; size?: number}> = ({k, c, size = 110}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100">
    {k === 'cap' && (
      <>
        <path d="M-46 -8 L0 -32 L46 -8 L0 16Z" fill={c} />
        <path d="M-26 6 V26 C-10 38 10 38 26 26 V6 L0 20Z" fill={c} opacity={0.75} />
        <path d="M40 -4 V28" stroke={c} strokeWidth={6} strokeLinecap="round" />
      </>
    )}
    {k === 'job' && (
      <>
        <rect x={-42} y={-18} width={84} height={58} rx={10} fill={c} />
        <path d="M-16 -18 V-28 H16 V-18" stroke={c} strokeWidth={8} fill="none" />
        <rect x={-42} y={4} width={84} height={8} fill="rgba(10,15,31,0.35)" />
      </>
    )}
    {k === 'home' && (
      <>
        <path d="M-46 -4 L0 -42 L46 -4Z" fill={c} />
        <rect x={-32} y={-6} width={64} height={46} fill={c} opacity={0.8} />
        <rect x={-9} y={14} width={18} height={26} rx={4} fill="rgba(10,15,31,0.5)" />
      </>
    )}
    {k === 'plane' && <path d="M-44 6 L-6 -2 L-28 -38 L-16 -40 L16 -6 L42 -12 C50 -12 52 0 42 4 L16 10 L-10 42 L-22 40 L-8 8Z" fill={c} />}
    {k === 'bag' && (
      <>
        <path d="M-34 -14 H34 L40 40 H-40Z" fill={c} />
        <path d="M-16 -14 V-26 C-16 -42 16 -42 16 -26 V-14" stroke={c} strokeWidth={8} fill="none" />
      </>
    )}
  </svg>
);

/* ---------------- gancho (también es el último fotograma: bucle) ---------------- */
const HookBase: React.FC<{f: number; punch?: number}> = ({f, punch = 0}) => {
  const bob = Math.sin(f / 9) * 8;
  return (
    <>
      <div style={{...center(215), ...txt(54, 600, P.mute, 0.26)}}>TU TARJETA COBRA</div>
      <div style={{...center(290), ...txt(390, 800, P.amber, -0.05), transform: `scale(${lerp(1, 1.06, punch)})`, textShadow: '0 30px 80px rgba(0,0,0,0.45)'}}>36%</div>
      <div style={{...center(760), transform: `translateY(${bob}px) rotate(${-8 + Math.sin(f / 14) * 1.6}deg)`}}>
        <CardArt s={0.95} />
      </div>
      <div style={center(1135)}>
        <Chip size={28} bg="rgba(255,255,255,0.14)">AL AÑO · PROMEDIO SI NO LA LIQUIDAS</Chip>
      </div>
    </>
  );
};

/* ---------------- escenas ---------------- */
const S1: React.FC = () => (
  <Scene a={A[0]} b={A[1]} kind="none" out="up">
    {(lt, f) => {
      const punch = spr(f, T(7) - 0.02, 8, 260, 0.6);
      return (
        <AbsoluteFill style={{transform: `scale(1)`}}>
          <HookBase f={f} punch={punch * (1 - cl((lt - T(7)) / 0.9))} />
        </AbsoluteFill>
      );
    }}
  </Scene>
);

const S2: React.FC = () => (
  <Scene a={A[1]} b={A[2]} kind="up" out="left">
    {(lt, f) => (
      <>
        <Mask at={A[1] + 0.02} size={380} color={P.amber} style={center(205)}>3</Mask>
        <Mask at={T(19) - 0.12} size={118} style={center(580)}>SEÑALES</Mask>
        <Pop at={T(12) + 0.1} rot={-4} style={abs(90, 800)}>
          <div style={{...txt(84, 800, P.white, 0), background: P.coral, padding: '22px 40px', borderRadius: 28, boxShadow: '0 26px 50px rgba(0,0,0,0.4)'}}>DEUDA MALA</div>
        </Pop>
        <Pop at={T(15) + 0.05} rot={3} style={abs(300, 1000)}>
          <div style={{...txt(84, 800, P.ink, 0), background: P.mint, padding: '22px 40px', borderRadius: 28, boxShadow: '0 26px 50px rgba(0,0,0,0.4)'}}>DEUDA BUENA</div>
        </Pop>
      </>
    )}
  </Scene>
);

const Col: React.FC<{x: number; head: string; bg: string; fg: string; rows: {k: any; l: string; at: number}[]; mark: React.ReactNode; markAt: number; tilt: number}> = ({x, head, bg, fg, rows, mark, markAt, tilt}) => {
  const f = useCurrentFrame();
  const p = spr(f, markAt, 9, 240, 0.6);
  return (
    <Rise at={Math.min(markAt - 0.5, A[2] + 0.05) + (x > 300 ? 0.2 : 0)} dy={150} style={{...abs(x, 215, 430), transform: `rotate(${tilt}deg)`}}>
      <div style={{height: 800, borderRadius: 44, background: 'rgba(255,255,255,0.08)', border: `4px solid ${bg}`, boxSizing: 'border-box', padding: '34px 28px', position: 'relative', boxShadow: '0 30px 60px rgba(0,0,0,0.35)'}}>
        <div style={{...txt(58, 800, fg, 0.02), background: bg, borderRadius: 20, textAlign: 'center', padding: '14px 0 10px'}}>{head}</div>
        {rows.map((r, k) => (
          <Rise key={k} at={r.at} dy={50} style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 30, height: 150}}>
            <div style={{width: 120, height: 120, borderRadius: 30, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 120px'}}>
              <Ico k={r.k} c={bg} size={92} />
            </div>
            <div style={txt(38, 700, P.white, 0.02)}>{r.l}</div>
          </Rise>
        ))}
        <div style={{position: 'absolute', right: 20, bottom: 18, opacity: cl(p * 3), transform: `scale(${lerp(2, 1, p)})`}}>{mark}</div>
      </div>
    </Rise>
  );
};
const S3: React.FC = () => (
  <Scene a={A[2]} b={A[3]} kind="left" out="up">
    {() => (
      <>
        <Col x={80} head="BUENA" bg={P.mint} fg={P.ink} tilt={-1.5} markAt={T(29)} mark={<Tick size={130} />}
          rows={[{k: 'cap', l: 'ESTUDIOS', at: T(23) - 0.05}, {k: 'job', l: 'NEGOCIO', at: T(24) - 0.05}, {k: 'home', l: 'CASA', at: T(26) - 0.05}]} />
        <Col x={540} head="MALA" bg={P.coral} fg={P.white} tilt={1.5} markAt={T(35)} mark={<Cross size={150} w={40} />}
          rows={[{k: 'plane', l: 'VIAJES', at: T(30) - 0.05}, {k: 'bag', l: 'DESPENSA', at: T(32) - 0.05}]} />
      </>
    )}
  </Scene>
);

const Row: React.FC<{at: number; label: string; val: string}> = ({at, label, val}) => (
  <Rise at={at} dy={40} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '20px 0', borderBottom: '3px dashed rgba(10,15,31,0.16)'}}>
    <span style={{...txt(44, 500, 'rgba(10,15,31,0.66)', 0)}}>{label}</span>
    <span style={{...txt(64, 800, P.ink)}}>{val}</span>
  </Rise>
);
const S4: React.FC = () => (
  <Scene a={A[3]} b={A[4]} kind="up" out="zoom">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(48), T(50) + 0.5));
      const punch = spr(f, T(50) + 0.55, 7, 260, 0.5);
      return (
        <Card style={{...abs(90, 220, 900), padding: '50px 60px 54px', transform: 'rotate(-1.2deg)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14}}>
            <Chip bg={P.ink} color={P.amber} size={28}>EJEMPLO</Chip>
            <span style={{...txt(28, 500, 'rgba(10,15,31,0.5)', 0)}}>hipotético, sin abonos</span>
          </div>
          <Row at={T(39) - 0.1} label="Pides" val="$10,000" />
          <Row at={T(41)} label="Tasa anual" val="≈ 36%" />
          <Row at={T(43) - 0.1} label="Sin pagar" val="1 año" />
          <Rise at={T(47) - 0.1} dy={40} style={{marginTop: 34}}>
            <div style={{...txt(36, 700, 'rgba(10,15,31,0.6)', 0.14)}}>INTERESES</div>
            <div style={{position: 'relative', display: 'inline-block', marginTop: 6, transform: `scale(${lerp(1.08, 1, punch)})`, transformOrigin: '0 60%'}}>
              <div style={{position: 'absolute', left: -12, right: -18, bottom: 22, height: 70, background: P.coral, opacity: 0.85, borderRadius: 14, transform: `scaleX(${c})`, transformOrigin: '0 50%'}} />
              <div style={{...txt(200, 800, P.ink, -0.04), position: 'relative'}}>{money(c * 3600)}</div>
            </div>
          </Rise>
        </Card>
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
          <div style={{...center(170), ...txt(680, 800, P.amber, -0.04), clipPath: `inset(${(1 - prog(f / FPS, T(55), T(59) + 0.3)) * 100}% 0 0 0)`, transform: `scale(${lerp(1.6, 1, p)})`}}>3</div>
          <Mask at={T(56) - 0.08} size={120} style={center(880)}>EL QUE MÁS</Mask>
          <Mask at={T(58) - 0.1} size={150} color={P.coral} style={center(1000)}>SE OLVIDA</Mask>
        </>
      );
    }}
  </Scene>
);

const Donut: React.FC<{frac: number; size: number; col: string}> = ({frac, size, col}) => {
  const r = 220;
  const C = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="-280 -280 560 560" style={{transform: 'rotate(-90deg)', filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.4))'}}>
      <circle r={r} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth={96} />
      <circle r={r} fill="none" stroke={col} strokeWidth={96} strokeDasharray={`${C * frac} ${C}`} strokeLinecap="butt" />
    </svg>
  );
};
const S6: React.FC = () => (
  <Scene a={A[5]} b={A[6]} kind="zoom" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const fr = easeIO(prog(t, T(73) - 0.05, T(75) + 0.3)) * 0.3;
      const n = Math.round((fr / 0.3) * 30);
      return (
        <>
          <Rise at={T(66) - 0.1} dy={40} style={center(200)}>
            <Chip bg={P.amber} color={P.ink} size={34}>TUS PAGOS DE DEUDA</Chip>
          </Rise>
          <Pop at={A[5] + 0.05} from={0.7} style={{...center(300)}}>
            <div style={{position: 'relative', width: 620, height: 620}}>
              <Donut frac={fr} size={620} col={P.amber} />
              <div style={{...txt(210, 800, P.white, -0.04), position: 'absolute', left: 0, right: 0, top: 205, textAlign: 'center'}}>{n}%</div>
            </div>
          </Pop>
          <Mask at={T(76) - 0.1} size={92} style={center(960)}>DE TU INGRESO</Mask>
          <Pop at={T(77)} rot={-3} style={center(1090)}>
            <div style={{...txt(40, 800, P.ink, 0.06), background: P.mint, padding: '12px 30px', borderRadius: 18}}>MÁXIMO · SEGÚN CONDUSEF</div>
          </Pop>
        </>
      );
    }}
  </Scene>
);

const S7: React.FC = () => (
  <Scene a={A[6]} b={A[7]} kind="left" out="zoom">
    {(lt, f) => {
      const t = f / FPS;
      const seg = easeIO(prog(t, T(83) - 0.2, T(83) + 0.5));
      const c = easeOut(prog(t, T(84), T(86) + 0.5));
      const punch = spr(f, T(86) + 0.55, 7, 260, 0.5);
      return (
        <>
          <Rise at={A[6] + 0.05} dy={30} style={{...abs(80, 205), ...txt(40, 700, P.mute, 0.16)}}>SI GANAS AL MES</Rise>
          <Mask at={T(81) - 0.1} size={190} style={abs(78, 265)}>$15,000</Mask>
          <Rise at={T(82)} dy={60} style={abs(80, 520, 920)}>
            <div style={{height: 130, borderRadius: 30, border: '4px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${30 * seg}%`, background: `linear-gradient(90deg, ${P.amberDeep}, ${P.amber})`}} />
              <div style={{...txt(56, 800, P.ink, 0), position: 'absolute', left: 28, top: 30, opacity: cl(seg * 2 - 0.6)}}>30%</div>
            </div>
          </Rise>
          <Rise at={T(83)} dy={30} style={{...abs(80, 700), ...txt(46, 600, P.mute, 0)}}>$15,000 × 30%</Rise>
          <div style={{...abs(80, 780), ...txt(236, 800, P.amber, -0.04), transform: `scale(${lerp(1.06, 1, punch)})`, transformOrigin: '0 60%', opacity: cl(c * 3)}}>{money(c * 4500)}</div>
          <Mask at={T(87) - 0.1} size={92} style={abs(86, 1100)}>AL MES</Mask>
        </>
      );
    }}
  </Scene>
);

const S8: React.FC = () => (
  <Scene a={A[7]} b={A[8]} kind="zoom" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const ph = prog(t, T(95) - 0.2, T(95) + 0.15);
      const sx = Math.max(0.03, Math.abs(1 - 2 * ph));
      const bad = ph >= 0.5;
      const fill = lerp(18, 56, easeIO(prog(t, T(96) - 0.1, T(99) + 0.1)));
      const over = fill > 30;
      return (
        <>
          <Card style={{...abs(140, 220, 800), padding: '44px 50px', display: 'flex', alignItems: 'center', gap: 36, transform: `scaleX(${sx})`, border: `10px solid ${bad ? P.coral : P.mint}`, boxSizing: 'border-box'}}>
            {bad ? <Cross size={150} w={34} /> : <Tick size={150} />}
            <div>
              <div style={{...txt(36, 700, 'rgba(10,15,31,0.55)', 0.14)}}>DEUDA</div>
              <div style={{...txt(120, 800, bad ? P.coral : '#0F8F68', -0.02)}}>{bad ? 'MALA' : 'BUENA'}</div>
            </div>
          </Card>
          <Rise at={T(96) - 0.3} dy={70} style={abs(90, 640, 900)}>
            <div style={{...txt(38, 700, P.mute, 0.14), marginBottom: 20}}>TUS PAGOS / TU INGRESO</div>
            <div style={{height: 120, borderRadius: 30, border: '4px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fill}%`, background: over ? `linear-gradient(90deg, ${P.amber} 53%, ${P.coral} 54%)` : `linear-gradient(90deg, ${P.mint}, ${P.amber})`, backgroundSize: `${(100 / fill) * 100}% 100%`}} />
              <div style={{position: 'absolute', left: '30%', top: 0, bottom: 0, borderLeft: '6px dashed #fff'}} />
            </div>
            <div style={{position: 'relative', height: 60}}>
              <div style={{...txt(34, 700, P.white, 0.06), position: 'absolute', left: '30%', top: 14, transform: 'translateX(-50%)'}}>30%</div>
            </div>
          </Rise>
          <Pop at={T(98) - 0.05} rot={-4} style={abs(110, 1030)}>
            <div style={{...txt(80, 800, P.white, 0), background: P.coral, padding: '16px 44px', borderRadius: 24, boxShadow: '0 24px 44px rgba(0,0,0,0.4)'}}>NO CABE</div>
          </Pop>
        </>
      );
    }}
  </Scene>
);

const S9: React.FC = () => {
  const items = [
    {n: '1', l: 'qué financias'},
    {n: '2', l: 'cuánto cuesta'},
    {n: '3', l: 'cuánto pesa'},
  ];
  return (
    <Scene a={A[8]} b={DEUDA_TOTAL + 1} kind="up" out="none">
      {(lt, f) => {
        const t = f / FPS;
        const back = easeIO(prog(t, T(105) - 0.1, DEUDA_TOTAL - 0.2));
        return (
          <>
            <div style={{opacity: 1 - cl(back * 2.2), transform: `translateY(${back * 260}px) scale(${1 - back * 0.3})`}}>
              <Mask at={A[8] + 0.05} size={104} style={abs(80, 215)}>HAZ ESTA CUENTA</Mask>
              {items.map((it, k) => (
                <Rise key={k} at={T(100) + 0.12 + k * 0.17} dx={-160} dy={0} style={abs(80, 370 + k * 250, 900)}>
                  <div style={{height: 216, borderRadius: 40, background: 'rgba(255,255,255,0.09)', border: '3px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: 36, padding: '0 46px', boxSizing: 'border-box'}}>
                    <div style={{...txt(150, 800, P.amber, -0.04), width: 120}}>{it.n}</div>
                    <div style={{...txt(58, 700, P.white, 0)}}>{it.l}</div>
                  </div>
                </Rise>
              ))}
            </div>
            <div style={{opacity: cl((back - 0.45) / 0.55), transform: `scale(${lerp(0.8, 1, back)})`, transformOrigin: '50% 40%'}}>
              <HookBase f={0} />
            </div>
          </>
        );
      }}
    </Scene>
  );
};

const MOOD_AT = [
  {at: 0, mood: 'navy'},
  {at: A[1], mood: 'steel'},
  {at: A[2], mood: 'forest'},
  {at: A[3], mood: 'plum'},
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
  const p = spr(f, A[6] + 0.3, 12, 200, 0.6);
  if (t < A[6] + 0.3 || t > A[8]) return null;
  return (
    <div style={{position: 'absolute', right: 70, top: 160, transform: `translateX(${(1 - p) * 200}px)`, opacity: cl(p * 2)}}>
      <Chip bg={P.white} color={P.ink} size={26}>＋ SÍGUEME</Chip>
    </div>
  );
};

export const DeudaMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
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
    <Frame serie="FINANZAS FÁCILES" total={DEUDA_TOTAL} pasos={PASOS} nota="Contenido educativo, no es recomendación de inversión. Fuentes: Banxico (tasa efectiva promedio de tarjetas, ene–feb 2026; clientes que no liquidan); CONDUSEF. Ejemplos hipotéticos." />
    <Cta />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('deuda/voz_mix.wav')} />}
  </AbsoluteFill>
);

export const DeudaCover: React.FC = () => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={[{at: 0, mood: 'navy'}]} />
    <div style={{...center(210), ...txt(190, 800)}}>DEUDA</div>
    <div style={{...center(440), transform: 'rotate(-5deg)'}}>
      <div style={{...txt(210, 800, P.ink, -0.02), background: P.mint, padding: '6px 56px 0', borderRadius: 30, boxShadow: '0 30px 60px rgba(0,0,0,0.5)'}}>BUENA</div>
    </div>
    <div style={{...center(700), ...txt(80, 600, P.mute, 0.2)}}>vs</div>
    <div style={{...center(810), transform: 'rotate(4deg)'}}>
      <div style={{...txt(210, 800, P.white, -0.02), background: P.coral, padding: '6px 56px 0', borderRadius: 30, boxShadow: '0 30px 60px rgba(0,0,0,0.5)'}}>MALA</div>
    </div>
    <div style={center(1080)}>
      <CardArt s={0.6} />
    </div>
    <div style={{...center(1330), ...txt(60, 700, P.white, 0)}}>3 señales para distinguirla</div>
    <div style={center(1440)}>
      <Chip size={30}>FINANZAS FÁCILES</Chip>
    </div>
    <Grain />
  </AbsoluteFill>
);

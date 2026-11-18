// TARJETA DE CRÉDITO — educativo, Estándar Pro (2026-11-18)
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/tarjeta-credito/words.json';
import {Backdrop, Captions, Card, Chip, FONT, FPS, Frame, Grain, Mask, P, Pop, Rise, Scene, Wd, buildGroups, cl, easeIO, easeOut, lerp, money, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const TARJ_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1)); // inicio de cada escena
const groups = buildGroups(words, blocks);
const KEYS = ['TARJETA', 'DINERO', 'BANCO', 'TRES', 'PRÉSTAMO', 'MÍNIMO', 'DOS', 'CINCO', 'INTERESES', 'GRATIS', 'TOTAL', 'LÍMITE', 'CUESTA'];

const abs = (x: number, y: number, w?: number): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w});
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
const txt = (size: number, weight = 800, color = P.white, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});


/* ---------------- ilustraciones ---------------- */
const CardIll: React.FC<{s?: number; dim?: number}> = ({s = 1, dim = 0}) => (
  <svg width={640 * s} height={400 * s} viewBox="0 0 640 400" style={{filter: `drop-shadow(0 40px 50px rgba(0,0,0,0.45)) saturate(${1 - dim * 0.8}) brightness(${1 - dim * 0.3})`}}>
    <defs>
      <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3D6BFF" /><stop offset="1" stopColor="#12307A" /></linearGradient>
    </defs>
    <rect x={10} y={10} width={620} height={380} rx={40} fill="url(#cg)" />
    <rect x={10} y={10} width={620} height={380} rx={40} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={4} />
    <rect x={56} y={110} width={96} height={72} rx={14} fill={P.amber} />
    <path d="M56 146 H152 M104 110 V182" stroke="rgba(10,15,31,0.35)" strokeWidth={4} />
    <text x={56} y={262} fontFamily={FONT} fontWeight={700} fontSize={46} fill="rgba(255,255,255,0.9)" letterSpacing={6}>•••• •••• •••• 4321</text>
    <text x={56} y={340} fontFamily={FONT} fontWeight={600} fontSize={30} fill="rgba(255,255,255,0.7)" letterSpacing={4}>CRÉDITO</text>
    <rect x={500} y={304} width={84} height={52} rx={12} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={5} />
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
const Bank: React.FC = () => (
  <svg width={300} height={280} viewBox="0 0 300 280" style={{filter: 'drop-shadow(0 24px 30px rgba(0,0,0,0.45))'}}>
    <path d="M150 20 L280 90 H20Z" fill={P.paper} />
    <rect x={30} y={96} width={240} height={18} rx={4} fill={P.paper2} />
    {[48, 100, 152, 204].map((x) => <rect key={x} x={x} y={122} width={34} height={100} rx={6} fill={P.paper} />)}
    <rect x={20} y={230} width={260} height={26} rx={8} fill={P.paper2} />
    <circle cx={150} cy={62} r={14} fill={P.ink} />
  </svg>
);

/* ---------------- gancho (también es el último fotograma: bucle) ---------------- */
const HookBase: React.FC<{f: number; dim?: number}> = ({f, dim = 0}) => {
  const bob = Math.sin(f / 9) * 8;
  return (
    <>
      <div style={{...center(240), ...txt(70, 600, P.mute, 0.3)}}>TU LÍMITE DE</div>
      <div style={{...center(318), ...txt(150)}}>TARJETA</div>
      <div style={{...center(560), transform: `translateY(${bob}px) rotate(${-4 + Math.sin(f / 14) * 1.6}deg)`}}>
        <CardIll s={1.4} dim={dim} />
      </div>
    </>
  );
};

/* ---------------- escenas ---------------- */
const S1: React.FC = () => (
  <Scene a={A[0]} b={A[1]} kind="none" out="up">
    {(lt, f) => {
      const x = spr(f, T(4) - 0.05, 8, 240, 0.6);
      const st = spr(f, T(6) - 0.06, 9, 260, 0.7);
      const zoomIn = lerp(1.07, 1, easeOut(lt / 0.5));
      const shake = st > 0.05 && st < 0.98 ? Math.sin(f * 2.4) * 10 * (1 - st) : 0;
      return (
        <AbsoluteFill style={{transform: `scale(${zoomIn}) translate(${shake}px, 0)`}}>
          <HookBase f={f} dim={x} />
          <div style={{...center(760), opacity: cl(x * 3) * (1 - cl(st * 2) * 0.7), transform: `scale(${lerp(2.2, 1, x)}) rotate(${lerp(-18, 0, x)}deg)`}}>
            <Cross size={380} />
          </div>
          <div style={{...center(1000), opacity: cl(st * 3), transform: `scale(${lerp(2.6, 1, st)}) rotate(-6deg)`}}>
            <div style={{...txt(120, 800, P.white, -0.01), background: P.coral, padding: '10px 50px 0', borderRadius: 30, boxShadow: '0 30px 60px rgba(0,0,0,0.5)', border: `10px solid ${P.ink}`, outline: `10px solid ${P.coral}`}}>NO ES TUYO</div>
          </div>
        </AbsoluteFill>
      );
    }}
  </Scene>
);

const S2: React.FC = () => {
  const items = [{n: '1', l: 'es un préstamo'}, {n: '2', l: 'el mínimo engaña'}, {n: '3', l: 'el pago total'}];
  return (
    <Scene a={A[1]} b={A[2]} kind="up" out="left">
      {(lt, f) => (
        <>
          <Mask at={A[1] + 0.02} size={360} color={P.amber} style={center(205)}>3</Mask>
          <Mask at={T(14) - 0.1} size={120} style={center(545)}>REGLAS</Mask>
          <div style={{position: 'absolute', left: 75, top: 715, width: 930}}>
            {items.map((it, k) => {
              const p = spr(f, T(13) + 0.1 + k * 0.2, 11, 200, 0.6);
              return (
                <div key={k} style={{height: 140, marginBottom: 20, borderRadius: 40, background: 'rgba(255,255,255,0.09)', border: '3px solid rgba(255,255,255,0.28)', display: 'flex', alignItems: 'center', gap: 36, padding: '0 46px', boxSizing: 'border-box', transform: `translateX(${(1 - p) * -420}px)`, opacity: cl(p * 2), boxShadow: '0 30px 60px rgba(0,0,0,0.3)'}}>
                  <div style={{...txt(100, 800, P.amber, -0.04), width: 90}}>{it.n}</div>
                  <div style={{...txt(56, 700, P.white, 0)}}>{it.l}</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Scene>
  );
};

const S3: React.FC = () => (
  <Scene a={A[2]} b={A[3]} kind="left" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(27) - 0.05, T(29) + 0.25));
      const debt = spr(f, T(31) - 0.05, 9, 220, 0.6);
      const punch = spr(f, T(29) + 0.2, 7, 260, 0.5);
      return (
        <>
          <Rise at={A[2] + 0.05} dy={30} style={{...abs(80, 205), ...txt(44, 700, P.mute, 0.16)}}>CADA COMPRA = PRÉSTAMO</Rise>
          <div style={{...center(300), ...txt(250, 800, debt > 0.5 ? P.coral : P.amber, -0.04), transform: `scale(${lerp(1.1, 1, punch)})`, textShadow: '0 30px 80px rgba(0,0,0,0.45)'}}>{money(c * 10000)}</div>
          <Mask at={T(26) - 0.05} size={80} color={P.mute} weight={700} style={center(580)}>{debt > 0.5 ? 'LE DEBES AL BANCO' : 'COMPRAS'}</Mask>
          <Pop at={A[2] + 0.2} rot={-4} style={center(760)}>
            <Bank />
          </Pop>
          <Rise at={T(31)} dy={60} style={{...abs(100, 1110, 880)}}>
            <Card style={{padding: '24px 40px', transform: 'rotate(-1deg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{...txt(40, 600, 'rgba(10,15,31,0.65)', 0)}}>Tú tienes</span>
              <span style={{...txt(52, 800, P.coral, 0)}}>$0 · le debes $10,000</span>
            </Card>
          </Rise>
        </>
      );
    }}
  </Scene>
);

const S4: React.FC = () => (
  <Scene a={A[3]} b={A[4]} kind="up" out="zoom">
    {(lt, f) => {
      const t = f / FPS;
      const lo = Math.round(2 * easeOut(prog(t, T(43) - 0.05, T(43) + 0.45)));
      const hi = Math.round(5 * easeOut(prog(t, T(45) - 0.05, T(45) + 0.5)));
      const bar = easeIO(prog(t, T(47), T(49) + 0.3));
      return (
        <>
          <Mask at={A[3] + 0.02} size={100} color={P.mute} weight={700} style={center(215)}>PAGO MÍNIMO</Mask>
          <div style={{...center(350), ...txt(300, 800, P.amber, -0.05), textShadow: '0 30px 80px rgba(0,0,0,0.45)'}}>{`${lo}–${hi}%`}</div>
          <Mask at={T(48) - 0.1} size={96} style={center(690)}>DEL SALDO</Mask>
          <Rise at={T(41)} dy={80} style={abs(90, 900, 900)}>
            <div style={{...txt(34, 700, P.mute, 0.14), marginBottom: 16}}>TU SALDO (100%)</div>
            <div style={{height: 120, borderRadius: 30, border: '4px solid rgba(255,255,255,0.4)', position: 'relative', overflow: 'hidden', background: 'rgba(255,255,255,0.06)'}}>
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${lerp(0, 5, bar)}%`, background: P.mint}} />
              <div style={{position: 'absolute', left: `${lerp(5, 5, bar)}%`, right: 0, top: 0, bottom: 0, background: 'repeating-linear-gradient(45deg, rgba(255,90,95,0.55), rgba(255,90,95,0.55) 18px, rgba(255,90,95,0.3) 18px, rgba(255,90,95,0.3) 36px)', opacity: bar}} />
            </div>
            <div style={{...txt(34, 700, P.mint, 0.06), marginTop: 14, opacity: cl(bar * 2)}}>▲ lo que pagas</div>
          </Rise>
        </>
      );
    }}
  </Scene>
);

const S5: React.FC = () => (
  <Scene a={A[4]} b={A[5]} kind="zoom" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const pay = prog(t, T(55) - 0.1, T(57) + 0.5);
      const rest = spr(f, T(59) - 0.05, 12, 200, 0.6);
      return (
        <>
          <Rise at={A[4] + 0.05} dy={30} style={{...abs(80, 205), ...txt(40, 700, P.mute, 0.16)}}>EJEMPLO · SALDO $10,000</Rise>
          <div style={{position: 'absolute', left: 90, top: 290, width: 900, display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 10}}>
            {Array.from({length: 100}, (_, k) => {
              const paid = k < 5 && pay * 5.2 > k + 0.3;
              const lit = k < 2 ? paid : paid;
              const p = spr(f, A[4] + 0.05 + (k % 10) * 0.012 + Math.floor(k / 10) * 0.02, 14, 200, 0.5);
              const bg = paid ? P.mint : rest > 0.3 ? `rgba(255,90,95,${0.5 + 0.25 * Math.sin(f / 6 + k)})` : 'rgba(255,255,255,0.16)';
              return <div key={k} style={{height: 74, borderRadius: 14, background: bg, transform: `scale(${lerp(0.4, 1, p)})`, opacity: cl(p * 2)}} />;
            })}
          </div>
          <Pop at={T(55) - 0.05} rot={-3} style={abs(90, 1165)}>
            <div style={{...txt(50, 800, P.ink, 0), background: P.mint, padding: '14px 30px', borderRadius: 20}}>PAGAS $200–$500</div>
          </Pop>
          <Pop at={T(61) - 0.05} rot={3} style={abs(520, 1172)}>
            <div style={{...txt(42, 800, P.white, 0.02), background: P.coral, padding: '14px 26px', borderRadius: 20}}>EL RESTO: INTERESES</div>
          </Pop>
        </>
      );
    }}
  </Scene>
);

const S6: React.FC = () => (
  <Scene a={A[5]} b={A[6]} kind="zoom" out="left">
    {(lt, f) => {
      const p = spr(f, A[5] + 0.02, 10, 200, 0.7);
      return (
        <>
          <div style={{...center(170), ...txt(680, 800, 'transparent', -0.04), WebkitTextStroke: `10px ${P.amber}`, transform: `scale(${lerp(1.6, 1, p)})`, opacity: cl(p * 2)}}>3</div>
          <div style={{...center(170), ...txt(680, 800, P.amber, -0.04), clipPath: `inset(${(1 - prog(f / FPS, T(66), T(69) + 0.3)) * 100}% 0 0 0)`, transform: `scale(${lerp(1.6, 1, p)})`}}>3</div>
          <Mask at={T(67) - 0.08} size={120} style={center(900)}>EL QUE MÁS</Mask>
          <Mask at={T(69) - 0.1} size={150} color={P.coral} style={center(1020)}>CUESTA</Mask>
        </>
      );
    }}
  </Scene>
);

const S7: React.FC = () => (
  <Scene a={A[6]} b={A[7]} kind="left" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const z = easeOut(prog(t, T(75), T(76) + 0.4));
      const stamp = spr(f, T(78) - 0.06, 9, 260, 0.7);
      const shake = stamp > 0.05 && stamp < 0.98 ? Math.sin(f * 2.4) * 8 * (1 - stamp) : 0;
      const rows = [{t: 'EL TOTAL DEL SALDO', at: T(81)}, {t: 'ANTES DE LA FECHA LÍMITE', at: T(84)}];
      return (
        <AbsoluteFill style={{transform: `translate(${shake}px, 0)`}}>
          <Mask at={A[6] + 0.02} size={66} color={P.mute} weight={700} style={center(205)}>PAGO PARA NO GENERAR</Mask>
          <div style={{...center(300), ...txt(380, 800, P.mint, -0.05), transform: `scale(${lerp(0.7, 1, z)})`, textShadow: '0 30px 80px rgba(0,0,0,0.45)'}}>{money((1 - z) * 500)}</div>
          <Mask at={T(76) - 0.1} size={96} style={center(720)}>EN INTERESES</Mask>
          <Pop at={T(78) - 0.06} rot={-6} style={center(860)}>
            <div style={{...txt(110, 800, P.ink, 0.02), background: P.mint, padding: '8px 60px 0', borderRadius: 26, boxShadow: '0 30px 60px rgba(0,0,0,0.5)', border: `8px solid ${P.ink}`, outline: `8px solid ${P.mint}`}}>GRATIS</div>
          </Pop>
          <div style={{position: 'absolute', left: 90, top: 1050, width: 900}}>
            {rows.map((r, k) => (
              <Rise key={k} at={r.at} dy={50} style={{marginBottom: 20}}>
                <Card style={{padding: '20px 36px', display: 'flex', alignItems: 'center', gap: 26, transform: `rotate(${k ? 1 : -1}deg)`}}>
                  <Tick size={64} />
                  <span style={{...txt(42, 800, P.ink, 0)}}>{r.t}</span>
                </Card>
              </Rise>
            ))}
          </div>
        </AbsoluteFill>
      );
    }}
  </Scene>
);

const S8: React.FC = () => {
  const items = [
    {n: '1', l: 'cada compra: deuda'},
    {n: '2', l: 'mínimo: 2% a 5%'},
    {n: '3', l: 'total: sin intereses'},
  ];
  return (
    <Scene a={A[7]} b={TARJ_TOTAL + 1} kind="up" out="none">
      {(lt, f) => {
        const t = f / FPS;
        const back = easeIO(prog(t, T(92) - 0.1, TARJ_TOTAL - 0.2));
        return (
          <>
            <div style={{opacity: 1 - cl(back * 2.2), transform: `translateY(${back * 260}px) scale(${1 - back * 0.3})`}}>
              <Mask at={A[7] + 0.05} size={96} style={abs(80, 215)}>SOLO SI YA LO TIENES</Mask>
              {items.map((it, k) => (
                <Rise key={k} at={T(89) + 0.12 + k * 0.17} dx={-160} dy={0} style={abs(80, 370 + k * 250, 900)}>
                  <div style={{height: 216, borderRadius: 40, background: 'rgba(255,255,255,0.09)', border: '3px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: 36, padding: '0 46px', boxSizing: 'border-box'}}>
                    <div style={{...txt(150, 800, P.amber, -0.04), width: 130}}>{it.n}</div>
                    <div style={{...txt(52, 700, P.white, 0)}}>{it.l}</div>
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
  {at: A[2], mood: 'forest'},
  {at: A[3], mood: 'plum'},
  {at: A[5], mood: 'ember'},
  {at: A[6], mood: 'forest'},
  {at: A[7], mood: 'navy'},
];
const PASOS = [
  {at: A[2], label: '1 DE 3'},
  {at: A[3], label: '2 DE 3'},
  {at: A[5], label: '3 DE 3'},
  {at: A[7], label: ''},
];

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const p = spr(f, A[6] + 0.6, 12, 200, 0.6);
  if (t < A[6] + 0.6 || t > A[7]) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 1425, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - p) * 80}px)`, opacity: cl(p * 2)}}>
      <Chip bg={P.white} color={P.ink} size={26}>＋ SÍGUEME</Chip>
    </div>
  );
};

export const TarjetaMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
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
    <Grain />
    <Frame serie="FINANZAS FÁCILES" total={TARJ_TOTAL} pasos={PASOS} nota="Contenido educativo, no es recomendación de inversión. Fuente: CONDUSEF. Ejemplo hipotético; el pago mínimo varía según el banco." />
    <Cta />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('tarjeta-credito/voz_mix.wav')} />}
  </AbsoluteFill>
);

export const TarjetaCover: React.FC = () => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={[{at: 0, mood: 'navy'}]} />
    <div style={{...center(200), ...txt(70, 600, P.mute, 0.3)}}>TU LÍMITE DE</div>
    <div style={{...center(268), ...txt(150)}}>TARJETA</div>
    <div style={{...center(450), ...txt(96, 600, P.white, 0)}}>no es tu dinero</div>
    <div style={{...center(600), transform: 'rotate(-4deg)'}}>
      <CardIll s={1.4} dim={0.4} />
    </div>
    <div style={{...center(1180), transform: 'rotate(-6deg)'}}>
      <div style={{...txt(130, 800, P.white, -0.01), background: P.coral, padding: '10px 50px 0', borderRadius: 30, boxShadow: '0 30px 60px rgba(0,0,0,0.5)', border: `10px solid ${P.ink}`, outline: `10px solid ${P.coral}`}}>NO ES TUYO</div>
    </div>
    <div style={center(1400)}>
      <Chip size={30}>FINANZAS FÁCILES</Chip>
    </div>
    <Grain />
  </AbsoluteFill>
);

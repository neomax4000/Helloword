// UDIS — educativo, Estándar Pro (2026-11-24)
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/udis/words.json';
import {Backdrop, Captions, Card, Chip, FONT, FPS, Frame, Grain, Mask, P, Pop, Rise, Scene, Wd, buildGroups, cl, easeIO, easeOut, lerp, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const UDIS_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1));
const groups = buildGroups(words, blocks);
const KEYS = ['UDI', 'UDIS', 'NUEVE', 'PESOS', 'PESO', 'TRES', 'INFLACIÓN', 'SUBE', 'DEUDA', 'IGNORA', 'CUATROCIENTAS', 'MILLONES', 'HIPOTECAS', 'DÍAS'];

const abs = (x: number, y: number, w?: number): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w});
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
const txt = (size: number, weight = 800, color = P.white, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});

const Coin: React.FC<{s?: number; label?: string}> = ({s = 1, label = 'UDI'}) => (
  <svg width={470 * s} height={470 * s} viewBox="-235 -235 470 470" style={{filter: 'drop-shadow(0 36px 46px rgba(0,0,0,0.5))'}}>
    <circle r={220} fill={P.amberDeep} />
    <circle r={206} fill={P.amber} />
    <circle r={168} fill="none" stroke={P.amberDeep} strokeWidth={8} strokeDasharray="3 16" strokeLinecap="round" />
    <text x={0} y={36} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={label.length > 3 ? 100 : 130} fill={P.ink}>{label}</text>
    <path d="M-150 -90 A180 180 0 0 1 20 -176" stroke="rgba(255,255,255,0.55)" strokeWidth={14} fill="none" strokeLinecap="round" />
  </svg>
);
const House: React.FC = () => (
  <svg width={380} height={330} viewBox="-190 -170 380 330" style={{filter: 'drop-shadow(0 24px 30px rgba(0,0,0,0.45))'}}>
    <path d="M-150 -10 L0 -140 L150 -10Z" fill={P.coral} />
    <rect x={-120} y={-10} width={240} height={160} rx={10} fill={P.paper} />
    <rect x={-30} y={50} width={60} height={100} rx={8} fill={P.amberDeep} />
    <rect x={-96} y={20} width={44} height={44} rx={6} fill="#9CC4FF" />
    <rect x={52} y={20} width={44} height={44} rx={6} fill="#9CC4FF" />
  </svg>
);
const Shield: React.FC<{s?: number}> = ({s = 1}) => (
  <svg width={300 * s} height={340 * s} viewBox="-75 -85 150 170" style={{filter: 'drop-shadow(0 28px 36px rgba(0,0,0,0.5))'}}>
    <path d="M0 -80 L64 -56 V0 C64 44 34 70 0 82 C-34 70 -64 44 -64 0 V-56Z" fill={P.paper} />
    <path d="M0 -66 L52 -47 V0 C52 36 28 58 0 69 C-28 58 -52 36 -52 0 V-47Z" fill={P.mint} />
    <path d="M-24 0 L-8 18 L26 -18" stroke={P.ink} strokeWidth={13} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const UpArrow: React.FC<{size?: number}> = ({size = 200}) => (
  <svg width={size} height={size} viewBox="-100 -100 200 200" style={{filter: 'drop-shadow(0 12px 18px rgba(0,0,0,0.45))'}}>
    <path d="M0 80 V-60 M-50 -12 L0 -62 L50 -12" stroke={P.coral} strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HookBase: React.FC<{f: number; s?: number}> = ({f, s = 1}) => {
  const bob = Math.sin(f / 9) * 8;
  return (
    <>
      <div style={{...center(250), ...txt(74, 600, P.mute, 0.3)}}>UNA UDI HOY</div>
      <div style={{...center(330), ...txt(240, 800, P.amber, -0.04)}}>$8.93</div>
      <div style={{...center(640), transform: `translateY(${bob}px) rotate(${Math.sin(f / 14) * 2}deg)`}}>
        <Coin s={1.1 * s} />
      </div>
    </>
  );
};

/* B0 */
const S1: React.FC = () => (
  <Scene a={A[0]} b={A[1]} kind="none" out="up">
    {(lt, f) => {
      const zoomIn = lerp(1.07, 1, easeOut(lt / 0.5));
      const p = spr(f, T(5) - 0.05, 9, 240, 0.6);
      return (
        <AbsoluteFill style={{transform: `scale(${zoomIn})`}}>
          <HookBase f={f} />
          <Pop at={T(5)} rot={-5} style={center(1170)}>
            <div style={{...txt(46, 800, P.ink, 0.02), background: P.mint, padding: '12px 34px', borderRadius: 20, transform: `scale(${lerp(1.1, 1, p)})`}}>VALOR AL 24 NOV 2026 · BANXICO</div>
          </Pop>
        </AbsoluteFill>
      );
    }}
  </Scene>
);

/* B1: 1995 -> hoy */
const S2: React.FC = () => (
  <Scene a={A[1]} b={A[2]} kind="left" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const shrink = easeIO(prog(t, T(13) - 0.1, T(15) + 0.2));
      const sc = lerp(0.62, 0.62 * (1 / 1.4), 0) ;
      return (
        <>
          <div style={{position: 'absolute', left: 80, top: 200, display: 'flex', alignItems: 'flex-end', gap: 26}}>
            <Mask at={T(8) - 0.15} size={260} color={P.amber} ls={-0.05}>1995</Mask>
          </div>
          <Rise at={T(8)} dy={40} style={abs(86, 470)}>
            <Chip size={32}>ABRIL · SE CREA LA UDI</Chip>
          </Rise>
          <div style={center(600)}>
            <div style={{transform: `scale(${lerp(1.0, 0.55, shrink)})`, transformOrigin: '50% 30%'}}>
              <Coin s={0.8} />
            </div>
          </div>
          <Rise at={T(13) - 0.05} dy={60} style={{...center(1000)}}>
            <div style={{...txt(210, 800, P.white, -0.04)}}>$1<span style={{fontSize: 110, color: P.amber}}>.00</span></div>
          </Rise>
          <Rise at={T(14)} dy={40} style={{...center(1230)}}>
            <Chip size={32} bg="rgba(255,255,255,0.12)">DE UN PESO A CASI NUEVE EN 31 AÑOS</Chip>
          </Rise>
        </>
      );
    }}
  </Scene>
);

/* B2: tres cosas */
const S3: React.FC = () => (
  <Scene a={A[2]} b={A[3]} kind="zoom" out="left">
    {(lt, f) => {
      const p = spr(f, A[2] + 0.02, 10, 200, 0.7);
      const items = ['SUBE SOLA', 'TU DEUDA', 'TUS AHORROS'];
      return (
        <>
          <div style={{...center(190), ...txt(620, 800, P.amber, -0.05), transform: `scale(${lerp(1.5, 1, p)})`, opacity: cl(p * 2)}}>3</div>
          <Mask at={T(19) - 0.1} size={120} style={center(850)}>COSAS</Mask>
          <div style={{position: 'absolute', left: 90, top: 1010, display: 'flex', gap: 18}}>
            {items.map((it, k) => (
              <Pop key={k} at={T(21) + k * 0.14} rot={k % 2 ? 3 : -3}>
                <div style={{...txt(34, 800, P.ink, 0.04), background: k === 2 ? P.mint : P.white, padding: '14px 24px', borderRadius: 18}}>{it}</div>
              </Pop>
            ))}
          </div>
        </>
      );
    }}
  </Scene>
);

/* B3: sube todos los dias */
const DIAS = [
  {d: '22 NOV', v: '8.925504'},
  {d: '23 NOV', v: '8.927827'},
  {d: '24 NOV', v: '8.930151'},
];
const S4: React.FC = () => (
  <Scene a={A[3]} b={A[4]} kind="up" out="zoom">
    {(lt, f) => {
      const t = f / FPS;
      return (
        <>
          <Mask at={A[3] + 0.02} size={300} color={P.amber} ls={-0.05} style={abs(80, 190)}>1</Mask>
          <Mask at={T(26) - 0.1} size={84} style={abs(80, 550)}>SUBE TODOS LOS DÍAS</Mask>
          <Card style={{...abs(90, 700, 900), padding: '36px 50px 40px', transform: 'rotate(-1deg)'}}>
            <div style={{...txt(30, 700, 'rgba(10,15,31,0.5)', 0.14), marginBottom: 6}}>VALOR DE LA UDI · DOF</div>
            {DIAS.map((r, k) => (
              <Rise key={k} at={T(26) + k * 0.45} dy={40} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '18px 0', borderBottom: k < 2 ? '3px dashed rgba(10,15,31,0.16)' : 'none'}}>
                <span style={{...txt(44, 500, 'rgba(10,15,31,0.66)', 0)}}>{r.d}</span>
                <span style={{...txt(78, 800, k === 2 ? P.ink : 'rgba(10,15,31,0.75)')}}>${r.v}</span>
              </Rise>
            ))}
          </Card>
          <Pop at={T(30) - 0.05} rot={-4} style={abs(120, 1180)}>
            <div style={{...txt(52, 800, P.ink, 0.01), background: P.amber, padding: '14px 36px', borderRadius: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}>LA MUEVE LA INFLACIÓN</div>
          </Pop>
        </>
      );
    }}
  </Scene>
);

/* B4: ejemplo 4% */
const S5: React.FC = () => (
  <Scene a={A[4]} b={A[5]} kind="left" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(47), T(49) + 0.2));
      const punch = spr(f, T(49) + 0.2, 7, 260, 0.5);
      const v = lerp(8.93, 9.29, c);
      return (
        <Card style={{...abs(90, 240, 900), padding: '50px 60px 54px', transform: 'rotate(1.2deg)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14}}>
            <Chip bg={P.ink} color={P.amber} size={28}>EJEMPLO</Chip>
            <span style={{...txt(30, 500, 'rgba(10,15,31,0.5)', 0)}}>un año</span>
          </div>
          <Rise at={T(34) - 0.1} dy={40} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '20px 0', borderBottom: '3px dashed rgba(10,15,31,0.16)'}}>
            <span style={{...txt(44, 500, 'rgba(10,15,31,0.66)', 0)}}>Inflación</span>
            <span style={{...txt(70, 800, P.coral)}}>4 %</span>
          </Rise>
          <Rise at={T(42) - 0.1} dy={40} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '20px 0', borderBottom: '3px dashed rgba(10,15,31,0.16)'}}>
            <span style={{...txt(44, 500, 'rgba(10,15,31,0.66)', 0)}}>UDI hoy</span>
            <span style={{...txt(70, 800, P.ink)}}>$8.93</span>
          </Rise>
          <Rise at={T(46) - 0.1} dy={40} style={{marginTop: 34}}>
            <div style={{...txt(36, 700, 'rgba(10,15,31,0.6)', 0.14)}}>UDI EN UN AÑO</div>
            <div style={{position: 'relative', display: 'inline-block', marginTop: 6, transform: `scale(${lerp(1.08, 1, punch)})`, transformOrigin: '0 60%'}}>
              <div style={{position: 'absolute', left: -12, right: -18, bottom: 22, height: 70, background: P.amber, borderRadius: 14, transform: `scaleX(${c})`, transformOrigin: '0 50%'}} />
              <div style={{...txt(230, 800, P.ink, -0.04), position: 'relative'}}>${v.toFixed(2)}</div>
            </div>
            <div style={{...txt(30, 500, 'rgba(10,15,31,0.5)', 0), marginTop: 8}}>8.93 × 1.04 = 9.29 · cálculo hipotético</div>
          </Rise>
        </Card>
      );
    }}
  </Scene>
);

/* B5: dos, creditos */
const S6: React.FC = () => (
  <Scene a={A[5]} b={A[6]} kind="zoom" out="left">
    {(lt, f) => {
      const p = spr(f, A[5] + 0.02, 10, 200, 0.7);
      return (
        <>
          <div style={{...center(170), ...txt(520, 800, P.amber, -0.05), transform: `scale(${lerp(1.5, 1, p)})`, opacity: cl(p * 2)}}>2</div>
          <div style={center(730)}>
            <Rise at={T(52) - 0.1} dy={120}>
              <House />
            </Rise>
          </div>
          <Mask at={T(52) - 0.05} size={104} style={center(1110)}>CRÉDITOS EN <span style={{color: P.amber}}>UDIS</span></Mask>
          <Pop at={T(57) - 0.1} rot={-4} style={center(1260)}>
            <Chip bg={P.white} color={P.ink} size={36}>ALGUNAS HIPOTECAS</Chip>
          </Pop>
        </>
      );
    }}
  </Scene>
);

/* B6: 100 mil UDIS */
const S7: React.FC = () => (
  <Scene a={A[6]} b={A[7]} kind="up" out="zoom">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(66) - 0.1, T(70) + 0.2));
      const up = spr(f, T(74) - 0.05, 9, 220, 0.6);
      const sube = prog(t, T(75), T(78) + 0.2);
      return (
        <>
          <Card style={{...abs(90, 270, 900), padding: '44px 56px 48px', transform: 'rotate(-1.2deg)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
              <Chip bg={P.ink} color={P.amber} size={28}>EJEMPLO</Chip>
              <span style={{...txt(30, 500, 'rgba(10,15,31,0.5)', 0)}}>deuda hipotética</span>
            </div>
            <Rise at={T(61) - 0.1} dy={40} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '18px 0', borderBottom: '3px dashed rgba(10,15,31,0.16)'}}>
              <span style={{...txt(44, 500, 'rgba(10,15,31,0.66)', 0)}}>Debes</span>
              <span style={{...txt(64, 800, P.ink)}}>100,000 UDIS</span>
            </Rise>
            <Rise at={T(65) - 0.1} dy={40} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '18px 0', borderBottom: '3px dashed rgba(10,15,31,0.16)'}}>
              <span style={{...txt(44, 500, 'rgba(10,15,31,0.66)', 0)}}>Cada UDI hoy</span>
              <span style={{...txt(64, 800, P.ink)}}>× $8.93</span>
            </Rise>
            <Rise at={T(66) - 0.2} dy={40} style={{marginTop: 26}}>
              <div style={{...txt(34, 700, 'rgba(10,15,31,0.6)', 0.14)}}>EN PESOS, HOY</div>
              <div style={{position: 'relative', display: 'inline-block', marginTop: 4}}>
                <div style={{position: 'absolute', left: -12, right: -18, bottom: 18, height: 64, background: P.amber, borderRadius: 14, transform: `scaleX(${c})`, transformOrigin: '0 50%'}} />
                <div style={{...txt(150, 800, P.ink, -0.04), position: 'relative'}}>${Math.round(c * 893015).toLocaleString('en-US')}</div>
              </div>
            </Rise>
          </Card>
          <div style={{position: 'absolute', left: 110, top: 1010, display: 'flex', alignItems: 'center', gap: 28, opacity: cl(up * 2)}}>
            <div style={{transform: `translateY(${lerp(40, -10, sube)}px) scale(${lerp(0.6, 1, up)})`}}><UpArrow size={170} /></div>
            <div>
              <div style={{...txt(60, 800, P.white, 0)}}>LA UDI SUBE</div>
              <div style={{...txt(60, 800, P.coral, 0), opacity: cl(sube * 2)}}>TU DEUDA SUBE</div>
            </div>
          </div>
        </>
      );
    }}
  </Scene>
);

/* B7: tres, el que mas se ignora */
const S8: React.FC = () => (
  <Scene a={A[7]} b={A[8]} kind="zoom" out="left">
    {(lt, f) => {
      const p = spr(f, A[7] + 0.02, 10, 200, 0.7);
      return (
        <>
          <div style={{...center(170), ...txt(680, 800, 'transparent', -0.04), WebkitTextStroke: `10px ${P.amber}`, transform: `scale(${lerp(1.6, 1, p)})`, opacity: cl(p * 2)}}>3</div>
          <div style={{...center(170), ...txt(680, 800, P.amber, -0.04), clipPath: `inset(${(1 - prog(f / FPS, T(80), T(85) + 0.3)) * 100}% 0 0 0)`, transform: `scale(${lerp(1.6, 1, p)})`}}>3</div>
          <Mask at={T(81) - 0.08} size={120} style={center(900)}>EL QUE MÁS</Mask>
          <Mask at={T(84) - 0.1} size={150} color={P.coral} style={center(1020)}>SE IGNORA</Mask>
        </>
      );
    }}
  </Scene>
);

/* B8: seguro 400 mil UDIS */
const S9: React.FC = () => (
  <Scene a={A[8]} b={A[9]} kind="up" out="zoom">
    {(lt, f) => {
      return (
        <>
          <div style={{position: 'absolute', left: 80, top: 200}}>
            <Pop at={T(87) - 0.1}>
              <Shield s={0.95} />
            </Pop>
          </div>
          <Mask at={T(87) - 0.05} size={74} weight={600} color={P.mute} ls={0.1} style={abs(430, 250)}>SEGURO DE</Mask>
          <Mask at={T(90) - 0.05} size={74} style={abs(430, 335)}>TUS AHORROS</Mask>
          <Rise at={T(94) - 0.1} dy={60} style={abs(430, 480)}>
            <Chip size={34}>EN EL BANCO · IPAB</Chip>
          </Rise>
          <div style={center(620)}>
            <Mask at={T(98) - 0.15} size={230} color={P.amber} ls={-0.05}>400 MIL</Mask>
          </div>
          <div style={center(900)}>
            <Mask at={T(98)} size={170}>UDIS</Mask>
          </div>
          <Rise at={T(100) - 0.1} dy={80} style={abs(80, 1100)}>
            <Chip bg={P.white} color={P.ink} size={38}>POR PERSONA</Chip>
          </Rise>
          <Rise at={T(103) - 0.1} dy={80} style={abs(480, 1100)}>
            <Chip bg={P.mint} color={P.ink} size={38}>POR INSTITUCIÓN</Chip>
          </Rise>
        </>
      );
    }}
  </Scene>
);

/* B9: tres millones y medio + pregunta escrita */
const S10: React.FC = () => (
  <Scene a={A[9]} b={A[10]} kind="zoom" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(108) - 0.1, T(111) + 0.2));
      const punch = spr(f, T(111) + 0.2, 7, 260, 0.5);
      return (
        <>
          <Mask at={A[9] + 0.05} size={64} weight={600} color={P.mute} ls={0.2} style={center(210)}>HOY, EN PESOS</Mask>
          <div style={{...center(300), ...txt(104, 800, P.mute, 0)}}>400,000 × $8.93</div>
          <div style={{...center(480), ...txt(270, 800, P.amber, -0.05), transform: `scale(${lerp(1.1, 1, punch)})`}}>
            ${(c * 3.57).toFixed(2)}
          </div>
          <Mask at={T(109) - 0.1} size={150} style={center(780)}>MILLONES</Mask>
          <Rise at={T(111)} dy={50} style={center(955)}>
            <Chip size={34}>≈ $3,572,060 AL 24 NOV 2026</Chip>
          </Rise>
          <Rise at={T(112)} dy={90} style={abs(90, 1060, 900)}>
            <Card style={{padding: '24px 40px', transform: 'rotate(-1deg)'}}>
              <div style={{...txt(46, 800, P.ink, 0), whiteSpace: 'normal', lineHeight: 1.15}}>¿Tu crédito está en pesos o en UDIS?</div>
            </Card>
          </Rise>
        </>
      );
    }}
  </Scene>
);

/* B10: bucle al gancho */
const S11: React.FC = () => (
  <Scene a={A[10]} b={UDIS_TOTAL + 1} kind="up" out="none">
    {(lt, f) => {
      const t = f / FPS;
      const back = easeIO(prog(t, T(114) - 0.1, UDIS_TOTAL - 0.2));
      return (
        <>
          <div style={{opacity: 1 - cl(back * 2.2), transform: `translateY(${back * 260}px) scale(${1 - back * 0.3})`}}>
            <Mask at={A[10] + 0.05} size={110} style={center(240)}>POR ESO</Mask>
            <div style={center(430)}>
              <div style={{transform: `rotate(${Math.sin(f / 10) * 4}deg)`}}><Coin s={0.8} /></div>
            </div>
            <Rise at={T(115)} dy={50} style={center(900)}>
              <div style={{...txt(100, 800, P.amber)}}>1 → 8.93</div>
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
  {at: A[4], mood: 'plum'},
  {at: A[5], mood: 'ember'},
  {at: A[7], mood: 'steel'},
  {at: A[9], mood: 'forest'},
  {at: A[10], mood: 'navy'},
];
const PASOS = [
  {at: A[3], label: '1 DE 3'},
  {at: A[5], label: '2 DE 3'},
  {at: A[7], label: '3 DE 3'},
  {at: A[10], label: ''},
];

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const p = spr(f, A[6] + 0.6, 12, 200, 0.6);
  if (t < A[6] + 0.6 || t > A[10]) return null;
  return (
    <div style={{position: 'absolute', right: 70, top: 160, transform: `translateX(${(1 - p) * 200}px)`, opacity: cl(p * 2)}}>
      <Chip bg={P.white} color={P.ink} size={26}>＋ SÍGUEME</Chip>
    </div>
  );
};

export const UdisMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={MOOD_AT} />
    <S1 /><S2 /><S3 /><S4 /><S5 /><S6 /><S7 /><S8 /><S9 /><S10 /><S11 />
    <Grain />
    <Frame serie="FINANZAS FÁCILES" total={UDIS_TOTAL} pasos={PASOS} nota="Contenido educativo, no es recomendación de inversión. Fuentes: Banxico y DOF (valor al 24-nov-2026); IPAB. Ejemplos hipotéticos." />
    <Cta />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('udis/voz_mix.wav')} />}
  </AbsoluteFill>
);

export const UdisCover: React.FC = () => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={[{at: 0, mood: 'navy'}]} />
    <div style={{...center(200), ...txt(74, 600, P.mute, 0.3)}}>¿QUÉ SON LAS</div>
    <div style={{...center(290), ...txt(230, 800, P.amber, -0.04)}}>UDIS?</div>
    <div style={center(560)}><Coin s={1.1} /></div>
    <div style={{...center(1090), ...txt(120, 800, P.white, -0.03)}}>$1 → $8.93</div>
    <div style={{...center(1250), ...txt(58, 700, P.white, 0)}}>3 cosas que tocan tu bolsillo</div>
    <div style={center(1350)}><Chip size={30}>FINANZAS FÁCILES</Chip></div>
    <Grain />
  </AbsoluteFill>
);

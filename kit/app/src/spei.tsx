// SPEI — glosario, ESTÁNDAR PRO (2026-11-14)
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/spei/words.json';
import {Backdrop, Captions, Card, Chip, FONT, FPS, Frame, Grain, Mask, P, Pop, Rise, Scene, Wd, buildGroups, cl, easeIO, easeOut, lerp, money, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const SPEI_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1));
const groups = buildGroups(words, blocks);
const KEYS = ['SPEI', 'HORA', 'BANXICO', 'BANCOS', 'DOMINGO', 'SEGUNDOS', 'LUNES', 'COMISIÓN', 'BANCO', 'CEP', 'COMPROBANTE', 'SIEMPRE'];

const abs = (x: number, y: number, w?: number): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w});
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
const txt = (size: number, weight = 800, color = P.white, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});

/* ---------------- ilustraciones ---------------- */
const Clock: React.FC<{s?: number; spin?: number; hand?: number}> = ({s = 1, spin = 0, hand = 0}) => (
  <svg width={520 * s} height={520 * s} viewBox="-260 -260 520 520" style={{filter: 'drop-shadow(0 40px 50px rgba(0,0,0,0.45))'}}>
    <circle r={240} fill={P.paper} />
    <circle r={240} fill="none" stroke={P.amber} strokeWidth={14} />
    {Array.from({length: 24}, (_, k) => (
      <line key={k} x1={0} y1={-200} x2={0} y2={k % 6 === 0 ? -166 : -184} stroke={k % 6 === 0 ? P.ink : 'rgba(10,15,31,0.4)'} strokeWidth={k % 6 === 0 ? 10 : 6} strokeLinecap="round" transform={`rotate(${k * 15})`} />
    ))}
    <text x={0} y={-118} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={P.ink}>24</text>
    <text x={0} y={30} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={86} fill={P.ink}>24/7</text>
    <line x1={0} y1={0} x2={0} y2={-150} stroke={P.coral} strokeWidth={12} strokeLinecap="round" transform={`rotate(${spin + hand})`} />
    <circle r={16} fill={P.coral} />
  </svg>
);
const Bank: React.FC<{size?: number; color?: string; label?: string}> = ({size = 150, color = P.paper, label}) => (
  <svg width={size} height={size * 0.95} viewBox="-100 -95 200 190">
    <path d="M-92 -20 L0 -88 L92 -20Z" fill={color} />
    {[-60, -20, 20, 60].map((x) => (
      <rect key={x} x={x - 11} y={-12} width={22} height={70} rx={4} fill={color} />
    ))}
    <rect x={-92} y={66} width={184} height={20} rx={6} fill={color} />
    {label && (
      <text x={0} y={-30} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={P.ink}>{label}</text>
    )}
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
const Phone: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <div style={{width: 420, height: 780, borderRadius: 64, background: '#05070F', border: '10px solid #2A3350', boxShadow: '0 50px 80px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 150, top: 18, width: 120, height: 26, borderRadius: 20, background: '#1A2038'}} />
    {children}
  </div>
);

/* ---------------- gancho (también último fotograma: bucle) ---------------- */
const HookBase: React.FC<{f: number}> = ({f}) => (
  <>
    <div style={{...center(235), ...txt(250, 800, P.amber, -0.04)}}>SPEI</div>
    <div style={{...center(520), ...txt(84, 600, P.white, 0)}}>mueve tu dinero</div>
    <div style={{...center(640), transform: `translateY(${Math.sin(f / 10) * 8}px)`}}>
      <Clock s={1.3} spin={f * 1.2} />
    </div>
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
      const hub = spr(f, A[1] + 0.05, 12, 200, 0.6);
      const pts = [
        {x: 200, y: 390, at: T(15)},
        {x: 880, y: 390, at: T(17)},
        {x: 200, y: 1010, at: T(18) - 0.05},
        {x: 880, y: 1010, at: T(19) - 0.1},
      ];
      const cx = 540;
      const cy = 700;
      return (
        <>
          <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
            {pts.map((p, k) => {
              const l = easeOut(prog(t, p.at - 0.1, p.at + 0.35));
              const pulse = (t * 0.9 + k * 0.25) % 1;
              return (
                <g key={k}>
                  <line x1={cx} y1={cy} x2={lerp(cx, p.x, l)} y2={lerp(cy, p.y, l)} stroke="rgba(255,255,255,0.4)" strokeWidth={6} strokeDasharray="4 16" strokeLinecap="round" />
                  {l > 0.98 && <circle cx={lerp(cx, p.x, pulse)} cy={lerp(cy, p.y, pulse)} r={11} fill={P.amber} />}
                </g>
              );
            })}
          </svg>
          {pts.map((p, k) => (
            <Pop key={k} at={p.at - 0.1} from={0.3} style={{position: 'absolute', left: p.x - 100, top: p.y - 95}}>
              <div style={{width: 200, height: 190, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 40, background: 'rgba(255,255,255,0.1)', border: '3px solid rgba(255,255,255,0.28)'}}>
                <Bank size={130} />
              </div>
            </Pop>
          ))}
          <div style={{position: 'absolute', left: cx - 190, top: cy - 150, width: 380, height: 300, borderRadius: 60, background: P.amber, boxShadow: '0 40px 70px rgba(0,0,0,0.5)', transform: `scale(${lerp(0.5, 1, hub)})`, opacity: cl(hub * 2), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{...txt(120, 800, P.ink, -0.03)}}>SPEI</div>
            <div style={{...txt(40, 700, 'rgba(10,15,31,0.7)', 0.12)}}>BANXICO</div>
          </div>
          <Mask at={T(10) - 0.1} size={92} style={center(1180)}>ENTRE <span style={{color: P.amber}}>BANCOS</span></Mask>
        </>
      );
    }}
  </Scene>
);

const S3: React.FC = () => {
  const dias = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  return (
    <Scene a={A[2]} b={A[3]} kind="left" out="up">
      {(lt, f) => {
        const t = f / FPS;
        const c = easeOut(prog(t, T(27) - 0.05, T(29) + 0.2));
        const punch = spr(f, T(29) + 0.2, 7, 260, 0.5);
        return (
          <>
            <div style={{position: 'absolute', left: 80, top: 200, display: 'flex', alignItems: 'center', gap: 28}}>
              {dias.map((d, k) => {
                const on = k === 6;
                const p = spr(f, A[2] + 0.04 + k * 0.03, 13, 220, 0.5);
                return (
                  <div key={k} style={{width: 98, height: 118, borderRadius: 26, background: on ? P.amber : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `translateY(${(1 - p) * 50}px) scale(${on ? 1.08 : 1})`, opacity: cl(p * 2)}}>
                    <span style={{...txt(52, 800, on ? P.ink : P.mute, 0)}}>{d}</span>
                  </div>
                );
              })}
            </div>
            <Rise at={T(21)} dy={60} style={abs(80, 380, 920)}>
              <div style={{...txt(40, 700, P.mute, 0.16)}}>DOMINGO · 11:00 PM</div>
            </Rise>
            <Rise at={T(24)} dy={120} style={abs(90, 470, 900)}>
              <Card style={{padding: '46px 56px 54px', transform: 'rotate(-1.2deg)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Chip bg={P.ink} color={P.amber} size={28}>TRANSFERENCIA SPEI</Chip>
                  <span style={{...txt(30, 500, 'rgba(10,15,31,0.5)', 0)}}>ejemplo</span>
                </div>
                <div style={{...txt(40, 600, 'rgba(10,15,31,0.6)', 0), marginTop: 36}}>Pago de renta</div>
                <div style={{position: 'relative', display: 'inline-block', marginTop: 8, transform: `scale(${lerp(1.07, 1, punch)})`, transformOrigin: '0 60%'}}>
                  <div style={{position: 'absolute', left: -12, right: -18, bottom: 24, height: 76, background: P.amber, borderRadius: 14, transform: `scaleX(${c})`, transformOrigin: '0 50%'}} />
                  <div style={{...txt(210, 800, P.ink, -0.04), position: 'relative'}}>{money(c * 1500)}</div>
                </div>
              </Card>
            </Rise>
            <Pop at={T(26) - 0.05} rot={-4} style={abs(110, 1050)}>
              <div style={{...txt(52, 800, P.white, 0.04), background: 'rgba(255,255,255,0.12)', border: '3px solid rgba(255,255,255,0.3)', padding: '14px 34px', borderRadius: 20}}>11:00 PM · DOMINGO</div>
            </Pop>
          </>
        );
      }}
    </Scene>
  );
};

const S4: React.FC = () => {
  const dias = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  return (
    <Scene a={A[3]} b={A[4]} kind="zoom" out="up">
      {(lt, f) => {
        const t = f / FPS;
        const sweep = easeOut(prog(t, T(32) - 0.05, T(32) + 0.55));
        const x = spr(f, T(37) - 0.05, 8, 240, 0.6);
        return (
          <>
            <Mask at={A[3] + 0.05} size={170} color={P.amber} ls={-0.03} style={center(190)}>SEGUNDOS</Mask>
            <div style={{...center(430)}}>
              <svg width={440} height={440} viewBox="-220 -220 440 440" style={{filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.45))'}}>
                <rect x={-26} y={-212} width={52} height={30} rx={10} fill={P.paper2} />
                <circle r={190} fill={P.paper} />
                <circle r={190} fill="none" stroke="rgba(10,15,31,0.12)" strokeWidth={14} />
                <circle r={190} fill="none" stroke={P.mint} strokeWidth={14} strokeLinecap="round" strokeDasharray={`${sweep * 1194} 1194`} transform="rotate(-90)" />
                <line x1={0} y1={0} x2={0} y2={-150} stroke={P.ink} strokeWidth={12} strokeLinecap="round" transform={`rotate(${sweep * 300})`} />
                <circle r={18} fill={P.ink} />
              </svg>
            </div>
            <Rise at={T(35) - 0.1} dy={80} style={abs(80, 960, 920)}>
              <div style={{...txt(38, 700, P.mute, 0.16), marginBottom: 14}}>NO ESPERAS AL LUNES</div>
              <div style={{display: 'flex', gap: 14}}>
                {dias.map((d, k) => (
                  <div key={k} style={{width: 112, height: 124, borderRadius: 26, position: 'relative', background: k === 6 ? P.mint : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <span style={{...txt(54, 800, k === 6 ? P.ink : P.mute, 0), opacity: k === 0 ? 1 - x * 0.6 : 1}}>{d}</span>
                    {k === 0 && (
                      <div style={{position: 'absolute', opacity: cl(x * 3), transform: `scale(${lerp(2.2, 1, x)})`}}>
                        <Cross size={110} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Rise>
            <Pop at={T(34) - 0.05} rot={-3} style={abs(110, 1230)}>
              <div style={{...txt(56, 800, P.ink, 0), background: P.mint, padding: '14px 36px', borderRadius: 22, boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}>LLEGA EN SEGUNDOS</div>
            </Pop>
          </>
        );
      }}
    </Scene>
  );
};

const S5: React.FC = () => (
  <Scene a={A[4]} b={A[5]} kind="up" out="zoom">
    {(lt, f) => {
      const t = f / FPS;
      const tag = spr(f, T(40) - 0.05, 10, 190, 0.7);
      const arrow = easeOut(prog(t, T(44), T(45) + 0.3));
      return (
        <>
          <Mask at={A[4] + 0.05} size={150} style={center(200)}>COMISIÓN</Mask>
          <div style={{...center(420), transform: `rotate(${lerp(-12, -5, tag)}deg) scale(${lerp(0.5, 1, tag)})`, opacity: cl(tag * 2)}}>
            <div style={{position: 'relative', width: 560, height: 300, background: P.paper, borderRadius: '40px 120px 120px 40px', boxShadow: '0 40px 70px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{position: 'absolute', left: 54, top: 126, width: 48, height: 48, borderRadius: 99, background: P.ink}} />
              <div style={{...txt(150, 800, P.ink, -0.03), marginLeft: 70}}>$ ?</div>
            </div>
          </div>
          <Rise at={T(42)} dy={50} style={center(780)}>
            <Chip bg="rgba(255,255,255,0.14)" size={42}>SI LA HAY</Chip>
          </Rise>
          <div style={{...center(900), opacity: cl(arrow * 2)}}>
            <svg width={120} height={150} viewBox="-60 -75 120 150"><path d="M0 -60 V50 M-36 14 L0 56 L36 14" stroke={P.amber} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" transform={`translate(0 ${(1 - arrow) * -30})`} /></svg>
          </div>
          <Rise at={T(44) - 0.05} dy={120} style={center(1050)}>
            <Card style={{padding: '24px 50px', display: 'flex', alignItems: 'center', gap: 28}}>
              <Bank size={130} color={P.ink} />
              <div style={{...txt(70, 800, P.ink, 0)}}>LA FIJA TU BANCO</div>
            </Card>
          </Rise>
        </>
      );
    }}
  </Scene>
);

const S6: React.FC = () => (
  <Scene a={A[5]} b={A[6]} kind="zoom" out="left">
    {(lt, f) => {
      const t = f / FPS;
      const stamp = spr(f, T(51) - 0.05, 9, 240, 0.6);
      const rows = [
        {l: 'Monto', v: '$1,500', at: T(53)},
        {l: 'Clave de rastreo', v: 'ABC123…', at: T(54) - 0.1},
        {l: 'Estatus', v: 'Liquidado', at: T(55) - 0.1, ok: true},
      ];
      return (
        <>
          <Mask at={A[5] + 0.03} size={130} style={center(195)}>PIDE TU <span style={{color: P.amber}}>CEP</span></Mask>
          <Rise at={T(52) - 0.1} dy={150} style={abs(110, 400, 860)}>
            <Card style={{padding: '36px 50px 110px', transform: 'rotate(1.2deg)', position: 'relative'}}>
              <div style={{...txt(34, 700, 'rgba(10,15,31,0.55)', 0.12), whiteSpace: 'normal', lineHeight: 1.2}}>COMPROBANTE ELECTRÓNICO DE PAGO</div>
              {rows.map((r, k) => (
                <Rise key={k} at={r.at} dy={30} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '22px 0', borderBottom: '3px dashed rgba(10,15,31,0.16)'}}>
                  <span style={{...txt(40, 500, 'rgba(10,15,31,0.66)', 0)}}>{r.l}</span>
                  <span style={{...txt(r.ok ? 56 : 52, 800, r.ok ? '#0F8F68' : P.ink)}}>{r.v}</span>
                </Rise>
              ))}
              <div style={{position: 'absolute', right: -20, bottom: -50, transform: `scale(${lerp(2.4, 1, stamp)}) rotate(10deg)`, opacity: cl(stamp * 3)}}>
                <div style={{...txt(110, 800, P.ink, 0), background: P.amber, padding: '4px 36px 0', borderRadius: 26, border: `8px solid ${P.ink}`, boxShadow: '0 24px 44px rgba(0,0,0,0.45)'}}>CEP</div>
              </div>
            </Card>
          </Rise>
          <Pop at={T(55) + 0.1} style={abs(70, 1020)}>
            <Tick size={150} />
          </Pop>
        </>
      );
    }}
  </Scene>
);

const S7: React.FC = () => (
  <Scene a={A[6]} b={SPEI_TOTAL + 1} kind="up" out="none">
    {(lt, f) => {
      const t = f / FPS;
      const back = easeIO(prog(t, T(59) - 0.15, SPEI_TOTAL - 0.2));
      return (
        <>
          <div style={{opacity: 1 - cl(back * 2.2), transform: `translateY(${back * 260}px) scale(${1 - back * 0.3})`}}>
            <Mask at={A[6] + 0.05} size={150} color={P.amber} style={center(230)}>GUÁRDALO</Mask>
            <Rise at={A[6] + 0.1} dy={140} style={center(480)}>
              <div style={{width: 520, height: 520, borderRadius: 60, background: P.paper, boxShadow: '0 40px 70px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, transform: 'rotate(-3deg)'}}>
                <div style={{...txt(170, 800, P.ink, -0.03)}}>CEP</div>
                <Tick size={150} />
              </div>
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
  {at: A[5], mood: 'steel'},
  {at: A[6], mood: 'navy'},
];

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const p = spr(f, A[3] + 0.5, 12, 200, 0.6);
  if (t < A[3] + 0.5 || t > A[6]) return null;
  return (
    <div style={{position: 'absolute', right: 70, top: 1415, transform: `translateX(${(1 - p) * 200}px)`, opacity: cl(p * 2)}}>
      <Chip bg={P.white} color={P.ink} size={26}>＋ SÍGUEME</Chip>
    </div>
  );
};

export const SpeiMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={MOOD_AT} />
    <S1 />
    <S2 />
    <S3 />
    <S4 />
    <S5 />
    <S6 />
    <S7 />
    <Grain />
    <Frame serie="GLOSARIO FINANCIERO" total={SPEI_TOTAL} nota="Contenido educativo, no es recomendación de inversión. Fuente: Banxico. Ejemplo hipotético." />
    <Cta />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('spei/voz_mix.wav')} />}
  </AbsoluteFill>
);

export const SpeiCover: React.FC = () => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={[{at: 0, mood: 'navy'}]} />
    <div style={{...center(230), ...txt(280, 800, P.amber, -0.04)}}>SPEI</div>
    <div style={{...center(550), ...txt(90, 600, P.white, 0)}}>mueve tu dinero</div>
    <div style={center(690)}>
      <Clock s={1.15} hand={40} />
    </div>
    <div style={{...center(1350), ...txt(64, 700, P.white, 0)}}>a cualquier hora</div>
    <div style={center(1450)}>
      <Chip size={30}>GLOSARIO FINANCIERO</Chip>
    </div>
    <Grain />
  </AbsoluteFill>
);

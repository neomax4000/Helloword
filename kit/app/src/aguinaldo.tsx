// AGUINALDO — video piloto del ESTÁNDAR PRO v1 (2026-11-13)
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/aguinaldo/words.json';
import {Backdrop, Captions, Card, Chip, FONT, FPS, Frame, Grain, Mask, P, Pop, Rise, Scene, Wd, buildGroups, cl, easeIO, easeOut, lerp, money, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const AGUI_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1)); // inicio de cada escena
const groups = buildGroups(words, blocks);
const KEYS = ['LEY', 'TRES', 'QUINCE', 'MÍNIMO', 'SEIS', 'VEINTE', 'DICIEMBRE', 'ANTES', 'PROPORCIONAL', 'MITAD', 'DINERO', 'AÑO', 'GRATIS', 'CUENTA'];

const abs = (x: number, y: number, w?: number): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w});
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
const txt = (size: number, weight = 800, color = P.white, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});

/* ---------------- ilustraciones ---------------- */
const Gift: React.FC<{s?: number; dim?: number}> = ({s = 1, dim = 0}) => (
  <svg width={520 * s} height={520 * s} viewBox="-260 -270 520 520" style={{filter: `drop-shadow(0 40px 50px rgba(0,0,0,0.45)) saturate(${1 - dim * 0.85}) brightness(${1 - dim * 0.35})`}}>
    <ellipse cx={0} cy={228} rx={210} ry={18} fill="rgba(0,0,0,0.35)" />
    <rect x={-180} y={-60} width={360} height={280} rx={26} fill={P.paper} />
    <rect x={-180} y={-60} width={360} height={280} rx={26} fill="url(#gsh)" />
    <rect x={-46} y={-60} width={92} height={280} fill={P.amber} />
    <rect x={-210} y={-130} width={420} height={96} rx={24} fill="#FFFDF7" />
    <rect x={-210} y={-58} width={420} height={24} rx={0} fill="rgba(10,15,31,0.12)" />
    <rect x={-46} y={-130} width={92} height={96} fill={P.amberDeep} />
    <path d="M0 -130 C-40 -230 -170 -240 -150 -160 C-140 -120 -60 -120 0 -130Z" fill={P.amber} />
    <path d="M0 -130 C40 -230 170 -240 150 -160 C140 -120 60 -120 0 -130Z" fill={P.amber} />
    <path d="M0 -130 C-30 -190 -110 -200 -104 -160 C-100 -138 -50 -130 0 -130Z" fill={P.amberDeep} />
    <path d="M0 -130 C30 -190 110 -200 104 -160 C100 -138 50 -130 0 -130Z" fill={P.amberDeep} />
    <circle cx={0} cy={-132} r={26} fill="#FFD77A" />
    <defs>
      <linearGradient id="gsh" x1="0" x2="1">
        <stop offset="0" stopColor="rgba(10,15,31,0)" />
        <stop offset="1" stopColor="rgba(10,15,31,0.16)" />
      </linearGradient>
    </defs>
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
const Bill: React.FC = () => (
  <svg width={640} height={330} viewBox="0 0 640 330" style={{filter: 'drop-shadow(0 34px 40px rgba(0,0,0,0.45))'}}>
    <rect x={30} y={36} width={600} height={280} rx={30} fill="#0F8F68" transform="rotate(4 320 170)" />
    <rect x={8} y={14} width={610} height={290} rx={30} fill={P.mint} />
    <rect x={30} y={36} width={566} height={246} rx={20} fill="none" stroke="rgba(10,15,31,0.35)" strokeWidth={5} />
    <circle cx={313} cy={159} r={84} fill="rgba(10,15,31,0.14)" />
    <text x={313} y={200} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={120} fill={P.ink}>$</text>
    <circle cx={86} cy={159} r={22} fill="rgba(10,15,31,0.2)" />
    <circle cx={540} cy={159} r={22} fill="rgba(10,15,31,0.2)" />
  </svg>
);
const Voucher: React.FC = () => (
  <svg width={330} height={220} viewBox="0 0 330 220">
    <path d="M24 10 H306 A14 14 0 0 1 320 24 V84 A26 26 0 0 0 320 136 V196 A14 14 0 0 1 306 210 H24 A14 14 0 0 1 10 196 V136 A26 26 0 0 0 10 84 V24 A14 14 0 0 1 24 10Z" fill={P.paper} />
    <path d="M110 22 V198" stroke="rgba(10,15,31,0.3)" strokeWidth={5} strokeDasharray="12 12" />
    <text x={212} y={128} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={62} fill={P.ink}>VALE</text>
    <text x={60} y={128} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={54} fill={P.amberDeep}>%</text>
  </svg>
);
const Crate: React.FC = () => (
  <svg width={300} height={240} viewBox="0 0 300 240">
    <path d="M20 80 L150 30 L280 80 L150 130Z" fill="#E7C08A" />
    <path d="M20 80 L150 130 V230 L20 180Z" fill="#C99A5B" />
    <path d="M280 80 L150 130 V230 L280 180Z" fill="#B08146" />
    <path d="M85 55 L215 105 V140 L215 105" stroke={P.paper} strokeWidth={22} fill="none" />
    <path d="M215 105 V160" stroke="rgba(255,255,255,0.7)" strokeWidth={22} />
  </svg>
);
const Shield: React.FC = () => (
  <svg width={150} height={170} viewBox="-75 -85 150 170">
    <path d="M0 -80 L64 -56 V0 C64 44 34 70 0 82 C-34 70 -64 44 -64 0 V-56Z" fill={P.ink} />
    <path d="M-26 0 L-8 20 L28 -20" stroke={P.mint} strokeWidth={15} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------------- gancho (también es el último fotograma: bucle) ---------------- */
const HookBase: React.FC<{f: number; dim?: number}> = ({f, dim = 0}) => {
  const bob = Math.sin(f / 9) * 8;
  return (
    <>
      <div style={{...center(250), ...txt(74, 600, P.mute, 0.3)}}>TU</div>
      <div style={{...center(318), ...txt(150)}}>AGUINALDO</div>
      <div style={{...center(520), transform: `translateY(${bob}px) rotate(${Math.sin(f / 14) * 1.6}deg)`}}>
        <Gift s={1.12} dim={dim} />
      </div>
    </>
  );
};

/* ---------------- escenas ---------------- */
const S1: React.FC = () => (
  <Scene a={A[0]} b={A[1]} kind="none" out="up">
    {(lt, f) => {
      const x = spr(f, T(2) - 0.05, 8, 240, 0.6); // «no es un regalo»
      const st = spr(f, T(6) - 0.06, 9, 260, 0.7); // «es ley»
      const zoomIn = lerp(1.07, 1, easeOut(lt / 0.5));
      const shake = st > 0.05 && st < 0.98 ? Math.sin(f * 2.4) * 10 * (1 - st) : 0;
      return (
        <AbsoluteFill style={{transform: `scale(${zoomIn}) translate(${shake}px, 0)`}}>
          <HookBase f={f} dim={x} />
          <div style={{...center(640), opacity: cl(x * 3) * (1 - cl(st * 2) * 0.75), transform: `scale(${lerp(2.2, 1, x)}) rotate(${lerp(-18, 0, x)}deg)`}}>
            <Cross size={380} />
          </div>
          <div style={{...center(720), opacity: cl(st * 3), transform: `scale(${lerp(2.6, 1, st)}) rotate(-7deg)`}}>
            <div style={{...txt(210, 800, P.ink, -0.02), background: P.amber, padding: '6px 56px 0', borderRadius: 30, boxShadow: '0 30px 60px rgba(0,0,0,0.5)', border: `10px solid ${P.ink}`, outline: `10px solid ${P.amber}`}}>ES LEY</div>
          </div>
          <Rise at={T(6) + 0.16} style={center(1090)}>
            <Chip size={32}>LEY FEDERAL DEL TRABAJO · ART. 87</Chip>
          </Rise>
        </AbsoluteFill>
      );
    }}
  </Scene>
);

const S2: React.FC = () => {
  const nums = ['15', '20', '½'];
  return (
    <Scene a={A[1]} b={A[2]} kind="up" out="left">
      {(lt, f) => {
        const t = f / FPS;
        return (
          <>
            <Mask at={A[1] + 0.02} size={360} color={P.amber} style={center(210)}>3</Mask>
            <Mask at={T(11) - 0.1} size={120} style={center(560)}>NÚMEROS</Mask>
            <div style={{position: 'absolute', left: 75, top: 760, display: 'flex', gap: 30}}>
              {nums.map((n, k) => {
                const p = spr(f, T(10) + 0.1 + k * 0.16, 11, 200, 0.6);
                const sweep = prog(t, T(14) - 0.1, T(14) + 0.7);
                return (
                  <div key={k} style={{width: 290, height: 400, borderRadius: 40, background: 'rgba(255,255,255,0.09)', border: '3px solid rgba(255,255,255,0.28)', backdropFilter: 'none', transform: `translateY(${(1 - p) * 220}px) rotate(${(k - 1) * 3 * (1 - p * 0.4)}deg)`, opacity: cl(p * 2), position: 'relative', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.35)'}}>
                    <div style={{...txt(34, 700, P.mute, 0.16), position: 'absolute', left: 30, top: 26}}>{`0${k + 1}`}</div>
                    <div style={{...txt(170, 800, P.amber), position: 'absolute', left: 0, right: 0, top: 86, textAlign: 'center'}}>{n}</div>
                    <div style={{position: 'absolute', left: 34, right: 34, top: 298, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.32)'}} />
                    <div style={{position: 'absolute', left: 34, right: 110, top: 338, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.2)'}} />
                    <div style={{position: 'absolute', top: 0, bottom: 0, width: 150, left: lerp(-200, 340, cl(sweep * 1.5 - k * 0.22)), background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)', transform: 'skewX(-18deg)'}} />
                  </div>
                );
              })}
            </div>
          </>
        );
      }}
    </Scene>
  );
};

const S3: React.FC = () => (
  <Scene a={A[2]} b={A[3]} kind="left" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(17) - 0.05, T(17) + 0.55));
      const n = Math.max(1, Math.round(c * 15));
      const punch = spr(f, T(17) + 0.5, 7, 260, 0.5);
      return (
        <>
          <div style={{...center(190), ...txt(600, 800, P.amber, -0.05), transform: `scale(${lerp(0.7, 1, easeOut(prog(t, A[2], A[2] + 0.3))) * lerp(1.1, 1, punch)})`, textShadow: '0 30px 80px rgba(0,0,0,0.45)'}}>{n}</div>
          <Mask at={T(18) - 0.08} size={104} style={center(800)}>DÍAS DE SALARIO</Mask>
          <div style={{position: 'absolute', left: 105, top: 950, display: 'flex', gap: 14}}>
            {Array.from({length: 15}, (_, k) => {
              const on = k < n && t > T(17) - 0.05;
              return <div key={k} style={{width: 46, height: 46, borderRadius: 12, background: on ? P.amber : 'rgba(255,255,255,0.16)', transform: `scale(${on ? 1 : 0.8})`}} />;
            })}
          </div>
          <Pop at={T(21) - 0.05} rot={-4} style={center(1060)}>
            <div style={{...txt(64, 800, P.ink, 0), background: P.mint, padding: '18px 44px', borderRadius: 22, boxShadow: '0 24px 44px rgba(0,0,0,0.4)'}}>MÍNIMO POR LEY</div>
          </Pop>
        </>
      );
    }}
  </Scene>
);

const Row: React.FC<{at: number; label: string; val: string; big?: boolean}> = ({at, label, val}) => (
  <Rise at={at} dy={40} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '20px 0', borderBottom: '3px dashed rgba(10,15,31,0.16)'}}>
    <span style={{...txt(44, 500, 'rgba(10,15,31,0.66)', 0)}}>{label}</span>
    <span style={{...txt(64, 800, P.ink)}}>{val}</span>
  </Rise>
);
const S4: React.FC = () => (
  <Scene a={A[3]} b={A[4]} kind="up" out="zoom">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(30), T(30) + 0.75));
      const punch = spr(f, T(30) + 0.7, 7, 260, 0.5);
      return (
        <Card style={{...abs(90, 230, 900), padding: '50px 60px 54px', transform: 'rotate(-1.2deg)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14}}>
            <Chip bg={P.ink} color={P.amber} size={28}>EJEMPLO</Chip>
            <span style={{...txt(30, 500, 'rgba(10,15,31,0.5)', 0)}}>salario base</span>
          </div>
          <Row at={T(25) - 0.1} label="Ganas al mes" val="$12,000" />
          <Row at={T(28) - 0.05} label="Entre 30 días" val="$400 al día" />
          <Row at={T(30) - 0.3} label="Por 15 días" val="× 15" />
          <Rise at={T(30) - 0.1} dy={40} style={{marginTop: 34}}>
            <div style={{...txt(36, 700, 'rgba(10,15,31,0.6)', 0.14)}}>TU AGUINALDO MÍNIMO</div>
            <div style={{position: 'relative', display: 'inline-block', marginTop: 6, transform: `scale(${lerp(1.08, 1, punch)})`, transformOrigin: '0 60%'}}>
              <div style={{position: 'absolute', left: -12, right: -18, bottom: 22, height: 70, background: P.amber, borderRadius: 14, transform: `scaleX(${c})`, transformOrigin: '0 50%'}} />
              <div style={{...txt(220, 800, P.ink, -0.04), position: 'relative'}}>{money(c * 6000)}</div>
            </div>
          </Rise>
        </Card>
      );
    }}
  </Scene>
);

const S5: React.FC = () => {
  const off = 1; // 1 dic 2026 = martes (semana inicia en lunes)
  return (
    <Scene a={A[4]} b={A[5]} kind="zoom" out="up">
      {(lt, f) => {
        const t = f / FPS;
        const ring = spr(f, T(37) - 0.05, 9, 220, 0.6);
        const sweep = prog(t, T(42) - 0.1, T(42) + 0.75);
        return (
          <>
            <div style={{position: 'absolute', left: 80, top: 200, display: 'flex', alignItems: 'flex-end', gap: 28}}>
              <Mask at={T(35) - 0.1} size={330} color={P.amber} ls={-0.05}>20</Mask>
              <div style={{paddingBottom: 54}}>
                <Mask at={T(36) - 0.05} size={64} weight={600} color={P.mute} ls={0.1}>DE</Mask>
                <Mask at={T(37) - 0.08} size={98}>DICIEMBRE</Mask>
              </div>
            </div>
            <Rise at={A[4] + 0.15} dy={120} style={abs(90, 580, 900)}>
              <Card style={{padding: '30px 40px 36px'}}>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10, marginBottom: 10}}>
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, k) => (
                    <div key={k} style={{...txt(30, 700, 'rgba(10,15,31,0.45)', 0), textAlign: 'center'}}>{d}</div>
                  ))}
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10}}>
                  {Array.from({length: off + 31}, (_, k) => {
                    const d = k - off + 1;
                    if (d < 1) return <div key={k} />;
                    const before = d < 20;
                    const lit = before && sweep * 22 > d;
                    const is20 = d === 20;
                    return (
                      <div key={k} style={{height: 84, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: is20 ? 'transparent' : lit ? P.mint : 'rgba(10,15,31,0.06)', opacity: d > 20 ? 0.35 : 1, transform: `scale(${lit ? 1 : 0.94})`}}>
                        {is20 && <div style={{position: 'absolute', inset: -10, borderRadius: 99, background: P.coral, transform: `scale(${ring})`, boxShadow: '0 10px 24px rgba(255,90,95,0.5)'}} />}
                        <span style={{...txt(is20 ? 50 : 38, is20 ? 800 : 600, is20 ? P.white : P.ink, 0), position: 'relative'}}>{d}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </Rise>
            <Pop at={T(42) - 0.1} rot={-3} style={abs(110, 1150)}>
              <div style={{...txt(52, 800, P.ink, 0), background: P.mint, padding: '14px 34px', borderRadius: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}>ANTES DE ESE DÍA</div>
            </Pop>
            <Pop at={T(37) + 0.25} rot={4} style={abs(640, 1158)}>
              <div style={{...txt(40, 800, P.white, 0.06), background: P.coral, padding: '12px 28px', borderRadius: 18}}>FECHA LÍMITE</div>
            </Pop>
          </>
        );
      }}
    </Scene>
  );
};

const S6: React.FC = () => (
  <Scene a={A[5]} b={A[6]} kind="zoom" out="left">
    {(lt, f) => {
      const p = spr(f, A[5] + 0.02, 10, 200, 0.7);
      return (
        <>
          <div style={{...center(170), ...txt(680, 800, 'transparent', -0.04), WebkitTextStroke: `10px ${P.amber}`, transform: `scale(${lerp(1.6, 1, p)})`, opacity: cl(p * 2)}}>3</div>
          <div style={{...center(170), ...txt(680, 800, P.amber, -0.04), clipPath: `inset(${(1 - prog(f / FPS, T(47), T(52) + 0.3)) * 100}% 0 0 0)`, transform: `scale(${lerp(1.6, 1, p)})`}}>3</div>
          <Mask at={T(48) - 0.08} size={120} style={center(900)}>EL QUE MÁS</Mask>
          <Mask at={T(51) - 0.1} size={150} color={P.coral} style={center(1020)}>SE PIERDE</Mask>
        </>
      );
    }}
  </Scene>
);

const MES = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const S7: React.FC = () => (
  <Scene a={A[6]} b={A[7]} kind="left" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const fill = prog(t, T(55) - 0.1, T(58) + 0.1);
      const half = easeIO(prog(t, T(60) - 0.1, T(63) + 0.5));
      const cut = easeIO(prog(t, T(66) - 0.15, T(67) + 0.3));
      const punch = spr(f, T(67) + 0.15, 7, 260, 0.5);
      return (
        <>
          <Rise at={A[6] + 0.05} dy={30} style={{...abs(80, 215), ...txt(40, 700, P.mute, 0.16)}}>MESES TRABAJADOS</Rise>
          <div style={{position: 'absolute', left: 80, top: 290, display: 'flex', gap: 9}}>
            {MES.map((m, k) => {
              const p = spr(f, A[6] + 0.08 + k * 0.025, 13, 220, 0.5);
              const on = k >= 6 && fill * 6.5 > k - 6 + 0.5;
              return (
                <div key={k} style={{width: 68, height: 150, borderRadius: 18, background: on ? P.mint : 'rgba(255,255,255,0.1)', border: on ? 'none' : '3px dashed rgba(255,255,255,0.3)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 12, boxSizing: 'border-box', transform: `translateY(${(1 - p) * 60}px) scale(${on ? 1 : 0.94})`, opacity: cl(p * 2)}}>
                  <span style={{...txt(34, 800, on ? P.ink : P.mute, 0)}}>{m}</span>
                </div>
              );
            })}
          </div>
          <Rise at={T(56)} dy={30} style={{...abs(80, 465), ...txt(64, 800)}}>
            <span style={{color: P.mint}}>6</span> de 12 meses
          </Rise>
          <Rise at={A[6] + 0.3} dy={80} style={abs(80, 610, 920)}>
            <div style={{...txt(40, 700, P.mute, 0.16), marginBottom: 16}}>TU AGUINALDO</div>
            <div style={{height: 170, borderRadius: 36, border: '4px solid rgba(255,255,255,0.4)', position: 'relative', overflow: 'hidden', background: 'rgba(255,255,255,0.06)'}}>
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${lerp(100, 50, half)}%`, background: `linear-gradient(90deg, ${P.amberDeep}, ${P.amber})`}} />
              <div style={{position: 'absolute', left: '50%', top: 0, bottom: 0, borderLeft: '5px dashed rgba(255,255,255,0.55)'}} />
              <div style={{...txt(84, 800, P.ink, 0), position: 'absolute', left: 36, top: 36}}>{Math.round(lerp(100, 50, half))}%</div>
            </div>
          </Rise>
          <Mask at={T(62) - 0.1} size={92} color={P.amber} style={abs(80, 880)}>PROPORCIONAL</Mask>
          <div style={{position: 'absolute', left: 80, top: 1010, display: 'flex', alignItems: 'center', gap: 34, opacity: cl(prog(t, T(64) - 0.1, T(64) + 0.15))}}>
            <div style={{...txt(86, 700, P.mute), position: 'relative'}}>
              $6,000
              <div style={{position: 'absolute', left: -8, right: -8, top: '48%', height: 10, borderRadius: 5, background: P.coral, transform: `scaleX(${cut})`, transformOrigin: '0 50%'}} />
            </div>
            <div style={{...txt(70, 800, P.mute)}}>→</div>
            <div style={{...txt(150, 800, P.amber, -0.03), transform: `scale(${lerp(0.5, 1, cut) * lerp(1.12, 1, punch)})`, transformOrigin: '0 60%', opacity: cut}}>{money(lerp(6000, 3000, cut))}</div>
          </div>
        </>
      );
    }}
  </Scene>
);

const S8: React.FC = () => (
  <Scene a={A[7]} b={A[8]} kind="up" out="zoom">
    {(lt, f) => {
      const x1 = spr(f, T(73) - 0.02, 8, 240, 0.6);
      const x2 = spr(f, T(75) - 0.02, 8, 240, 0.6);
      return (
        <>
          <Pop at={A[7] + 0.05} from={0.6} rot={-3} style={center(215)}>
            <Bill />
          </Pop>
          <Pop at={T(71) - 0.02} style={abs(770, 190)}>
            <Tick size={150} />
          </Pop>
          <Mask at={T(70) - 0.1} size={150} style={center(590)}>
            EN <span style={{color: P.mint}}>DINERO</span>
          </Mask>
          <Rise at={T(72) - 0.1} dy={120} style={abs(95, 830, 420)}>
            <div style={{height: 330, borderRadius: 40, background: 'rgba(255,255,255,0.08)', border: '3px solid rgba(255,255,255,0.22)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, position: 'relative', transform: 'rotate(-3deg)'}}>
              <div style={{filter: `saturate(${1 - x1 * 0.8}) brightness(${1 - x1 * 0.4})`, transform: 'scale(0.86)'}}><Voucher /></div>
              <div style={{...txt(40, 800, P.white, 0.1)}}>VALES</div>
              <div style={{position: 'absolute', opacity: cl(x1 * 3), transform: `scale(${lerp(2.4, 1, x1)})`}}><Cross size={250} w={44} /></div>
            </div>
          </Rise>
          <Rise at={T(74) - 0.1} dy={120} style={abs(545, 830, 420)}>
            <div style={{height: 330, borderRadius: 40, background: 'rgba(255,255,255,0.08)', border: '3px solid rgba(255,255,255,0.22)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, position: 'relative', transform: 'rotate(3deg)'}}>
              <div style={{filter: `saturate(${1 - x2 * 0.8}) brightness(${1 - x2 * 0.4})`, transform: 'scale(0.86)'}}><Crate /></div>
              <div style={{...txt(40, 800, P.white, 0.1)}}>MERCANCÍA</div>
              <div style={{position: 'absolute', opacity: cl(x2 * 3), transform: `scale(${lerp(2.4, 1, x2)})`}}><Cross size={250} w={44} /></div>
            </div>
          </Rise>
        </>
      );
    }}
  </Scene>
);

const S9: React.FC = () => (
  <Scene a={A[8]} b={A[9]} kind="zoom" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const line = easeIO(prog(t, T(80), T(84) + 0.2));
      const end = spr(f, T(84) + 0.1, 9, 220, 0.6);
      return (
        <>
          <div style={{position: 'absolute', left: 80, top: 190, display: 'flex', alignItems: 'flex-end', gap: 30}}>
            <Mask at={T(81) - 0.12} size={400} color={P.amber} ls={-0.05}>1</Mask>
            <div style={{paddingBottom: 66}}>
              <Mask at={T(82) - 0.1} size={190}>AÑO</Mask>
            </div>
          </div>
          <Mask at={T(83) - 0.08} size={84} style={abs(84, 640)}>PARA RECLAMARLO</Mask>
          <div style={{position: 'absolute', left: 110, top: 800, width: 860, height: 150}}>
            <div style={{position: 'absolute', left: 0, right: 0, top: 26, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.2)'}} />
            <div style={{position: 'absolute', left: 0, top: 26, height: 10, borderRadius: 5, width: `${line * 100}%`, background: `linear-gradient(90deg, ${P.coral}, ${P.amber}, ${P.mint})`}} />
            <div style={{position: 'absolute', left: -22, top: 4, width: 54, height: 54, borderRadius: 99, background: P.coral, border: `8px solid ${P.white}`, boxSizing: 'border-box'}} />
            <div style={{position: 'absolute', right: -22, top: 4, width: 54, height: 54, borderRadius: 99, background: P.mint, border: `8px solid ${P.white}`, boxSizing: 'border-box', transform: `scale(${end})`}} />
            <div style={{...txt(40, 700, P.white, 0.04), position: 'absolute', left: -20, top: 80}}>20 DIC</div>
            <div style={{...txt(40, 700, P.mint, 0.04), position: 'absolute', right: -20, top: 80, opacity: cl(end * 2)}}>+ 12 MESES</div>
          </div>
          <Rise at={T(85) - 0.12} dy={160} style={abs(90, 1010, 900)}>
            <Card style={{padding: '30px 40px', display: 'flex', alignItems: 'center', gap: 34, transform: 'rotate(-1deg)'}}>
              <Shield />
              <div>
                <div style={{...txt(86, 800, P.ink)}}>PROFEDET</div>
                <div style={{...txt(32, 500, 'rgba(10,15,31,0.66)', 0), whiteSpace: 'normal', lineHeight: 1.25, width: 520}}>Procuraduría Federal de la Defensa del Trabajo</div>
              </div>
              <Pop at={T(89) - 0.05} rot={8} style={{position: 'absolute', right: -14, top: -40}}>
                <div style={{...txt(52, 800, P.ink, 0.04), background: P.mint, padding: '12px 30px', borderRadius: 18, boxShadow: '0 16px 30px rgba(0,0,0,0.4)'}}>GRATIS</div>
              </Pop>
            </Card>
          </Rise>
        </>
      );
    }}
  </Scene>
);

const S10: React.FC = () => {
  const items = [
    {n: '15', l: 'días, mínimo'},
    {n: '20', l: 'dic, fecha límite'},
    {n: '½', l: 'si fue medio año'},
  ];
  return (
    <Scene a={A[9]} b={AGUI_TOTAL + 1} kind="up" out="none">
      {(lt, f) => {
        const t = f / FPS;
        const back = easeIO(prog(t, T(95) - 0.1, AGUI_TOTAL - 0.2));
        return (
          <>
            <div style={{opacity: 1 - back, transform: `translateY(${back * 260}px) scale(${1 - back * 0.3})`}}>
              <Mask at={A[9] + 0.05} size={104} style={abs(80, 215)}>HAZ TU CUENTA</Mask>
              {items.map((it, k) => (
                <Rise key={k} at={T(90) + 0.12 + k * 0.17} dx={-160} dy={0} style={abs(80, 370 + k * 250, 900)}>
                  <div style={{height: 216, borderRadius: 40, background: 'rgba(255,255,255,0.09)', border: '3px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: 36, padding: '0 46px', boxSizing: 'border-box'}}>
                    <div style={{...txt(150, 800, P.amber, -0.04), width: 190}}>{it.n}</div>
                    <div style={{...txt(58, 700, P.white, 0)}}>{it.l}</div>
                  </div>
                </Rise>
              ))}
            </div>
            <div style={{opacity: back, transform: `scale(${lerp(0.8, 1, back)})`, transformOrigin: '50% 40%'}}>
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
  {at: A[4], mood: 'plum'},
  {at: A[5], mood: 'ember'},
  {at: A[6], mood: 'navy'},
  {at: A[7], mood: 'forest'},
  {at: A[8], mood: 'plum'},
  {at: A[9], mood: 'navy'},
];
const PASOS = [
  {at: A[2], label: '1 DE 3'},
  {at: A[4], label: '2 DE 3'},
  {at: A[5], label: '3 DE 3'},
  {at: A[9], label: ''},
];

/** Llamadas a la acción solo escritas (no roban tiempo a la voz) */
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

export const AguinaldoMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
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
    <S10 />
    <Grain />
    <Frame serie="FINANZAS FÁCILES" total={AGUI_TOTAL} pasos={PASOS} nota="Contenido educativo, no es asesoría legal. Fuente: Ley Federal del Trabajo, art. 87; Profedet. Ejemplo con salario base." />
    <Cta />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('aguinaldo/voz_mix.wav')} />}
  </AbsoluteFill>
);

/** Portada PNG (aparte del video) */
export const AguinaldoCover: React.FC = () => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={[{at: 0, mood: 'navy'}]} />
    <div style={{...center(200), ...txt(74, 600, P.mute, 0.3)}}>TU</div>
    <div style={{...center(268), ...txt(150)}}>AGUINALDO</div>
    <div style={{...center(450), ...txt(96, 600, P.white, 0)}}>no es un regalo</div>
    <div style={center(590)}>
      <Gift s={1.05} dim={0.5} />
    </div>
    <div style={{...center(830), transform: 'rotate(-7deg)'}}>
      <div style={{...txt(230, 800, P.ink, -0.02), background: P.amber, padding: '6px 60px 0', borderRadius: 30, boxShadow: '0 30px 60px rgba(0,0,0,0.5)', border: `10px solid ${P.ink}`, outline: `10px solid ${P.amber}`}}>ES LEY</div>
    </div>
    <div style={{...center(1240), ...txt(60, 700, P.white, 0)}}>3 números que debes revisar</div>
    <div style={center(1350)}>
      <Chip size={30}>FINANZAS FÁCILES</Chip>
    </div>
    <Grain />
  </AbsoluteFill>
);

// SPEI (educativo) — Estándar Pro, 2026-11-15
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/spei-edu/words.json';
import {Backdrop, Captions, Card, Chip, FONT, FPS, Frame, Grain, Mask, P, Pop, Rise, Scene, Wd, buildGroups, cl, easeIO, easeOut, lerp, money, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const SPEIE_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1));
const groups = buildGroups(words, blocks);
const KEYS = ['BANCO', 'CIERRA', 'SPEI', 'TRES', '24', 'DÍAS', 'HORA', 'LUNES', 'CLAVE', 'RASTREO', 'LIQUIDADO', 'CEP', 'COMPROBANTE', 'OJO', 'CUENTA', 'DEVOLVERLO', 'CLABE', '18', 'DÍGITOS', 'TODOS'];

const abs = (x: number, y: number, w?: number): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w});
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
const txt = (size: number, weight = 800, color = P.white, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});

/* ---------------- ilustraciones ---------------- */
const Bank: React.FC<{s?: number; dim?: number; shadow?: boolean}> = ({s = 1, dim = 0, shadow = true}) => (
  <svg width={460 * s} height={400 * s} viewBox="-230 -200 460 400" style={{filter: `${shadow ? 'drop-shadow(0 34px 44px rgba(0,0,0,0.45)) ' : ''}saturate(${1 - dim * 0.8}) brightness(${1 - dim * 0.4})`}}>
    <path d="M-215 -70 L0 -190 L215 -70Z" fill={P.paper} />
    <circle cx={0} cy={-110} r={20} fill={P.amberDeep} />
    <rect x={-215} y={-70} width={430} height={26} rx={6} fill="#FFFDF7" />
    {[-150, -50, 50, 150].map((x) => (
      <g key={x}>
        <rect x={x - 26} y={-38} width={52} height={170} rx={8} fill={P.paper} />
        <rect x={x - 26} y={-38} width={14} height={170} rx={6} fill="rgba(10,15,31,0.1)" />
      </g>
    ))}
    <rect x={-225} y={136} width={450} height={26} rx={8} fill="#FFFDF7" />
    <rect x={-240} y={164} width={480} height={26} rx={8} fill={P.paper2} />
  </svg>
);
const Moon: React.FC<{size?: number}> = ({size = 120}) => (
  <svg width={size} height={size} viewBox="-60 -60 120 120" style={{filter: 'drop-shadow(0 0 24px rgba(255,236,170,0.55))'}}>
    <path d="M18 -50 A52 52 0 1 0 50 20 A42 42 0 0 1 18 -50Z" fill="#FFEFB8" />
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
const Coin: React.FC<{size?: number}> = ({size = 90}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{filter: 'drop-shadow(0 10px 14px rgba(0,0,0,0.45))'}}>
    <circle r={46} fill={P.amber} />
    <circle r={34} fill="none" stroke={P.amberDeep} strokeWidth={5} />
    <text y={17} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={48} fill={P.amberDeep}>$</text>
  </svg>
);
const Lock: React.FC<{size?: number}> = ({size = 130}) => (
  <svg width={size} height={size} viewBox="-60 -70 120 130" style={{filter: 'drop-shadow(0 10px 14px rgba(0,0,0,0.4))'}}>
    <path d="M-28 -12 V-32 A28 28 0 0 1 28 -32 V-12" stroke={P.paper} strokeWidth={12} fill="none" />
    <rect x={-44} y={-14} width={88} height={70} rx={16} fill={P.amber} />
    <circle cy={20} r={9} fill={P.ink} />
  </svg>
);

/* ---------------- gancho (también es el último fotograma: bucle) ---------------- */
const HookBase: React.FC<{f: number; dim?: number}> = ({f, dim = 0}) => {
  const bob = Math.sin(f / 11) * 5;
  return (
    <>
      <div style={{...center(240), ...txt(74, 600, P.mute, 0.3)}}>TU BANCO</div>
      <div style={{...center(318), ...txt(190, 800, P.white)}}>CIERRA</div>
      <div style={{position: 'absolute', left: 700, top: 530 + bob}}><Moon size={150} /></div>
      <div style={{...center(540)}}>
        <Bank s={1.15} dim={Math.max(0.35, dim)} />
      </div>
      <div style={{...center(872), transform: 'rotate(-3deg)'}}>
        <div style={{...txt(58, 800, P.white, 0.14), background: P.coral, padding: '12px 40px', borderRadius: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.45)'}}>CERRADO</div>
      </div>
    </>
  );
};

/* ---------------- escenas ---------------- */
const S1: React.FC = () => (
  <Scene a={A[0]} b={A[1]} kind="none" out="up">
    {(lt, f) => {
      const sp = spr(f, T(4) - 0.08, 9, 240, 0.6); // «SPEI»
      const glow = 0.5 + 0.5 * Math.sin(f / 5);
      return (
        <AbsoluteFill>
          <HookBase f={f} dim={sp} />
          <div style={{...center(1020), opacity: cl(sp * 3), transform: `scale(${lerp(2.4, 1, sp)}) rotate(${lerp(-12, -3, sp)}deg)`}}>
            <div style={{...txt(200, 800, P.ink, -0.02), background: P.amber, padding: '6px 56px 0', borderRadius: 30, border: `10px solid ${P.ink}`, outline: `10px solid ${P.amber}`, boxShadow: `0 0 ${50 + glow * 40}px rgba(255,194,71,0.65), 0 30px 60px rgba(0,0,0,0.5)`}}>SPEI</div>
          </div>
          <Pop at={T(5) + 0.1} rot={5} style={abs(700, 960)}>
            <div style={{...txt(60, 800, P.ink, 0.04), background: P.mint, padding: '10px 30px', borderRadius: 18}}>24/7</div>
          </Pop>
        </AbsoluteFill>
      );
    }}
  </Scene>
);

const Node: React.FC<{x: number; label: string; hi?: boolean; at: number}> = ({x, label, hi, at}) => (
  <Rise at={at} dy={90} style={abs(x, 230, 220)}>
    <div style={{height: 300, borderRadius: 40, background: hi ? 'rgba(255,194,71,0.14)' : 'rgba(255,255,255,0.09)', border: `4px solid ${hi ? P.amber : 'rgba(255,255,255,0.28)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, boxShadow: '0 30px 60px rgba(0,0,0,0.35)'}}>
      <Bank s={0.4} shadow={false} />
      <div style={{...txt(34, 800, hi ? P.amber : P.white, 0.04)}}>{label}</div>
    </div>
  </Rise>
);

const S2: React.FC = () => {
  const tiles = [{n: '24/7', l: 'HORARIO'}, {n: 'CLAVE', l: 'RASTREO'}, {n: 'CEP', l: 'COMPROBANTE'}];
  return (
    <Scene a={A[1]} b={A[2]} kind="up" out="left">
      {(lt, f) => {
        const t = f / FPS;
        const go = easeIO(prog(t, T(12) - 0.1, T(14) + 0.5));
        return (
          <>
            <Node x={70} label="TU BANCO" at={T(7) - 0.1} />
            <Node x={400} label="BANXICO" hi at={T(9) - 0.05} />
            <Node x={730} label="OTRO BANCO" at={T(15) - 0.3} />
            <div style={{position: 'absolute', left: 290, top: 372, width: 110, borderTop: '6px dashed rgba(255,255,255,0.35)'}} />
            <div style={{position: 'absolute', left: 620, top: 372, width: 110, borderTop: '6px dashed rgba(255,255,255,0.35)'}} />
            <div style={{position: 'absolute', left: lerp(130, 790, go), top: 330, opacity: cl(go * 6) * (1 - cl((go - 0.97) * 30) * 0.0)}}><Coin size={90} /></div>
            <Mask at={T(17) - 0.1} size={330} color={P.amber} style={center(600)}>3</Mask>
            <div style={{position: 'absolute', left: 70, top: 960, display: 'flex', gap: 24}}>
              {tiles.map((c, k) => {
                const p = spr(f, T(18) + 0.15 + k * 0.16, 11, 200, 0.6);
                return (
                  <div key={k} style={{width: 276, height: 250, borderRadius: 36, background: 'rgba(255,255,255,0.09)', border: '3px solid rgba(255,255,255,0.28)', transform: `translateY(${(1 - p) * 200}px) rotate(${(k - 1) * 3 * (1 - p * 0.4)}deg)`, opacity: cl(p * 2), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 24px 50px rgba(0,0,0,0.35)'}}>
                    <div style={{...txt(c.n.length > 4 ? 56 : 90, 800, P.amber, -0.02)}}>{c.n}</div>
                    <div style={{...txt(26, 600, P.mute, 0.12)}}>{c.l}</div>
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

const DIAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const S3: React.FC = () => (
  <Scene a={A[2]} b={A[3]} kind="left" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(25) - 0.05, T(25) + 0.6));
      const n = Math.max(1, Math.round(c * 24));
      const punch = spr(f, T(26) - 0.05, 7, 260, 0.5);
      const week = prog(t, T(27) - 0.05, T(29) + 0.25);
      const hrs = prog(t, T(31) - 0.1, T(32) + 0.4);
      return (
        <>
          <div style={{...center(190), ...txt(430, 800, P.amber, -0.05), transform: `scale(${lerp(1.1, 1, punch)})`, textShadow: '0 30px 80px rgba(0,0,0,0.45)'}}>
            {n}
            <span style={{color: P.white, opacity: cl((c - 0.7) * 4)}}>/7</span>
          </div>
          <div style={{position: 'absolute', left: 80, top: 690, display: 'flex', gap: 12}}>
            {DIAS.map((d, k) => {
              const on = week * 7.5 > k + 0.4;
              return (
                <div key={k} style={{width: 116, height: 130, borderRadius: 26, background: on ? P.mint : 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${on ? 1 : 0.92})`}}>
                  <span style={{...txt(56, 800, on ? P.ink : P.mute, 0)}}>{d}</span>
                </div>
              );
            })}
          </div>
          <Mask at={T(28) - 0.1} size={84} style={abs(80, 860)}>TODOS LOS DÍAS</Mask>
          <div style={{position: 'absolute', left: 80, top: 990, width: 920}}>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)', gap: 5}}>
              {Array.from({length: 24}, (_, k) => (
                <div key={k} style={{height: 74, borderRadius: 8, background: hrs * 25 > k ? P.amber : 'rgba(255,255,255,0.16)'}} />
              ))}
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 12, ...txt(30, 600, P.mute, 0.06)}}>
              <span>0 H</span>
              <span>24 H · CUALQUIER HORA</span>
            </div>
          </div>
        </>
      );
    }}
  </Scene>
);

const Line: React.FC<{at: number; label: string; val: string; color?: string}> = ({at, label, val, color = P.ink}) => (
  <Rise at={at} dy={40} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '18px 0', borderBottom: '3px dashed rgba(10,15,31,0.16)'}}>
    <span style={{...txt(40, 500, 'rgba(10,15,31,0.66)', 0)}}>{label}</span>
    <span style={{...txt(56, 800, color)}}>{val}</span>
  </Rise>
);
const S4: React.FC = () => (
  <Scene a={A[3]} b={A[4]} kind="up" out="zoom">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(39), T(41) + 0.5));
      const punch = spr(f, T(41) + 0.5, 7, 260, 0.5);
      const ok = spr(f, T(44) - 0.05, 9, 240, 0.6);
      const cut = easeIO(prog(t, T(47) - 0.1, T(48) + 0.1));
      return (
        <>
          <div style={{position: 'absolute', left: 80, top: 200}}>
            <Mask at={A[3] + 0.04} size={104} color={P.amber}>DOMINGO</Mask>
          </div>
          <div style={{position: 'absolute', left: 700, top: 190, opacity: cl(prog(t, T(35) - 0.1, T(35) + 0.2))}}><Moon size={170} /></div>
          <Rise at={T(35) - 0.1} dy={30} style={{...abs(80, 340), ...txt(120, 800, P.white, -0.03)}}>11:00 PM</Rise>
          <Card style={{...abs(90, 560, 900), padding: '40px 56px 46px', transform: 'rotate(-1.2deg)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6}}>
              <Chip bg={P.ink} color={P.amber} size={28}>EJEMPLO</Chip>
              <span style={{...txt(30, 500, 'rgba(10,15,31,0.5)', 0)}}>pago de renta</span>
            </div>
            <Line at={T(39) - 0.1} label="Tú envías" val="" />
            <div style={{position: 'relative', display: 'inline-block', marginTop: 8, transformOrigin: '0 60%', transform: `scale(${lerp(1.06, 1, punch)})`}}>
              <div style={{position: 'absolute', left: -12, right: -18, bottom: 22, height: 64, background: P.amber, borderRadius: 14, transform: `scaleX(${c})`, transformOrigin: '0 50%'}} />
              <div style={{...txt(190, 800, P.ink, -0.04), position: 'relative'}}>{money(c * 1500)}</div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 24, opacity: cl(ok * 2), transform: `translateY(${(1 - ok) * 30}px)`}}>
              <Tick size={84} />
              <span style={{...txt(52, 800, P.ink, 0)}}>Acreditado</span>
            </div>
          </Card>
          <Pop at={T(46) - 0.1} rot={-2} style={abs(100, 1080)}>
            <div style={{position: 'relative', ...txt(70, 800, P.white, 0), background: 'rgba(255,255,255,0.12)', padding: '14px 40px', borderRadius: 22, border: '3px solid rgba(255,255,255,0.3)'}}>
              ESPERAR AL LUNES
              <div style={{position: 'absolute', left: 16, right: 16, top: '50%', height: 12, borderRadius: 6, background: P.coral, transform: `scaleX(${cut})`, transformOrigin: '0 50%'}} />
            </div>
          </Pop>
        </>
      );
    }}
  </Scene>
);

const S5: React.FC = () => {
  const clave = 'SPEI2026110BX7K4';
  return (
    <Scene a={A[4]} b={A[5]} kind="zoom" out="up">
      {(lt, f) => {
        const t = f / FPS;
        const typed = Math.round(cl(prog(t, T(54), T(56) + 0.3)) * clave.length);
        const stamp = spr(f, T(65) - 0.05, 8, 260, 0.6);
        const hl = prog(t, T(57), T(59));
        return (
          <>
            <div style={{position: 'absolute', left: 80, top: 190, display: 'flex', alignItems: 'flex-end', gap: 26}}>
              <Mask at={A[4] + 0.03} size={300} color={P.amber} ls={-0.05}>2</Mask>
              <div style={{paddingBottom: 40}}>
                <Mask at={T(54) - 0.1} size={92}>CLAVE DE</Mask>
                <Mask at={T(56) - 0.12} size={92} color={P.amber}>RASTREO</Mask>
              </div>
            </div>
            <Rise at={A[4] + 0.2} dy={120} style={abs(90, 590, 900)}>
              <Card style={{padding: '34px 50px 40px', transform: 'rotate(1deg)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Chip bg={P.ink} color={P.amber} size={26}>EJEMPLO</Chip>
                  <span style={{...txt(28, 500, 'rgba(10,15,31,0.5)', 0)}}>consulta de estado</span>
                </div>
                <Line at={A[4] + 0.3} label="Fecha" val="15 NOV" />
                <Line at={A[4] + 0.4} label="Emisor → Receptor" val="Banco A → B" />
                <div style={{padding: '20px 0'}}>
                  <div style={{...txt(32, 600, 'rgba(10,15,31,0.55)', 0.1)}}>CLAVE DE RASTREO</div>
                  <div style={{position: 'relative', display: 'inline-block', marginTop: 8}}>
                    <div style={{position: 'absolute', left: -10, right: -10, top: 4, bottom: 0, background: P.amber, borderRadius: 12, transform: `scaleX(${hl})`, transformOrigin: '0 50%'}} />
                    <div style={{...txt(68, 800, P.ink, 0.02), position: 'relative', fontVariantNumeric: 'tabular-nums'}}>{clave.slice(0, typed)}<span style={{opacity: typed < clave.length ? 0.4 : 0}}>|</span></div>
                  </div>
                </div>
              </Card>
            </Rise>
            <div style={{...center(1060), opacity: cl(stamp * 3), transform: `scale(${lerp(2.5, 1, stamp)}) rotate(-6deg)`}}>
              <div style={{...txt(100, 800, P.ink, 0.01), background: P.mint, padding: '8px 54px 0', borderRadius: 26, border: `10px solid ${P.ink}`, outline: `10px solid ${P.mint}`, boxShadow: '0 30px 60px rgba(0,0,0,0.5)'}}>LIQUIDADO</div>
            </div>
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
          <div style={{...center(170), ...txt(680, 800, P.amber, -0.04), clipPath: `inset(${(1 - prog(f / FPS, T(69), T(72) + 0.3)) * 100}% 0 0 0)`, transform: `scale(${lerp(1.6, 1, p)})`}}>3</div>
          <Mask at={T(69) - 0.08} size={120} style={center(900)}>EL QUE MÁS</Mask>
          <Mask at={T(71) - 0.1} size={150} color={P.coral} style={center(1020)}>SE OLVIDA</Mask>
        </>
      );
    }}
  </Scene>
);

const S7: React.FC = () => (
  <Scene a={A[6]} b={A[7]} kind="left" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const seal = spr(f, T(77) - 0.1, 8, 260, 0.6);
      const ok = spr(f, T(80) - 0.05, 9, 240, 0.6);
      const rows: [string, string][] = [['Fecha', '15 NOV'], ['Clave de rastreo', 'SPEI…K4'], ['Emisor', 'Banco A'], ['Receptor', 'Banco B'], ['Monto', '$1,500']];
      return (
        <>
          <div style={{position: 'absolute', left: 80, top: 190, display: 'flex', alignItems: 'flex-end', gap: 26}}>
            <Mask at={T(74) - 0.1} size={250} color={P.amber} ls={-0.04}>CEP</Mask>
          </div>
          <div style={abs(84, 452)}>
            <Mask at={T(76) - 0.1} size={46} weight={600} color={P.mute} ls={0.06}>COMPROBANTE</Mask>
            <Mask at={T(77) - 0.08} size={46} weight={600} color={P.mute} ls={0.06}>ELECTRÓNICO DE PAGO</Mask>
          </div>
          <Rise at={A[6] + 0.15} dy={140} style={abs(120, 590, 760)}>
            <Card style={{padding: '22px 44px 26px', transform: 'rotate(-1.5deg)', position: 'relative'}}>
              {rows.map(([l, v], k) => (
                <Line key={k} at={T(75) + k * 0.08} label={l} val={v} />
              ))}
              <div style={{position: 'absolute', right: -24, top: -44, opacity: cl(seal * 3), transform: `scale(${lerp(2.2, 1, seal)}) rotate(-12deg)`}}>
                <div style={{...txt(34, 800, P.ink, 0.1), background: P.amber, padding: '14px 24px', borderRadius: 99, border: `6px solid ${P.ink}`}}>SELLO OFICIAL</div>
              </div>
            </Card>
          </Rise>
          <div style={{position: 'absolute', left: 80, top: 1140, display: 'flex', alignItems: 'center', gap: 26}}>
            <div style={{opacity: cl(ok * 2), transform: `scale(${lerp(0.5, 1, ok)})`, ...txt(54, 800, P.ink, 0.02), background: P.mint, padding: '12px 30px', borderRadius: 18}}>LIQUIDADO</div>
            <Pop at={T(86) - 0.1} rot={-3}>
              <div style={{...txt(54, 800, P.white, 0), background: 'rgba(255,255,255,0.14)', border: '3px solid rgba(255,255,255,0.4)', padding: '12px 30px', borderRadius: 18}}>→ TU BANCO</div>
            </Pop>
          </div>
        </>
      );
    }}
  </Scene>
);

const S8: React.FC = () => (
  <Scene a={A[7]} b={A[8]} kind="up" out="zoom">
    {(lt, f) => {
      const t = f / FPS;
      const go = easeIO(prog(t, T(93), T(96)));
      const x1 = spr(f, T(99) - 0.04, 8, 240, 0.6);
      const ac = spr(f, T(109) - 0.05, 9, 240, 0.6);
      return (
        <>
          <Mask at={A[7] + 0.03} size={150} color={P.coral} style={center(200)}>¡OJO!</Mask>
          <Pop at={T(92) - 0.1} style={abs(80, 430)}>
            <div style={{width: 220, height: 220, borderRadius: 999, background: 'rgba(255,255,255,0.12)', border: '4px solid rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...txt(46, 800, P.white, 0.04)}}>TÚ</div>
          </Pop>
          <Pop at={T(94) - 0.1} style={abs(730, 430)}>
            <div style={{width: 220, height: 220, borderRadius: 999, background: 'rgba(255,90,95,0.18)', border: `4px solid ${P.coral}`, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', ...txt(36, 800, P.white, 0.02)}}>OTRA<br />CUENTA</div>
          </Pop>
          <div style={{position: 'absolute', left: 300, top: 538, width: 430, borderTop: '6px dashed rgba(255,255,255,0.35)'}} />
          <div style={{position: 'absolute', left: lerp(300, 650, go), top: 495, opacity: cl(go * 6)}}><Coin size={90} /></div>
          <Rise at={T(97) - 0.1} dy={100} style={abs(90, 760, 900)}>
            <Card style={{padding: '32px 44px', display: 'flex', alignItems: 'center', gap: 34, transform: 'rotate(-1deg)', position: 'relative'}}>
              <Lock size={120} />
              <div>
                <div style={{...txt(64, 800, P.ink)}}>TU BANCO</div>
                <div style={{...txt(34, 600, 'rgba(10,15,31,0.66)', 0)}}>no puede quitárselo a nadie</div>
              </div>
              <div style={{position: 'absolute', right: 30, top: 26, opacity: cl(x1 * 3), transform: `scale(${lerp(2.4, 1, x1)})`}}><Cross size={130} w={30} /></div>
            </Card>
          </Rise>
          <Rise at={T(104) - 0.1} dy={100} style={abs(90, 1050, 900)}>
            <div style={{display: 'flex', alignItems: 'center', gap: 26, background: 'rgba(255,255,255,0.1)', border: '3px solid rgba(255,255,255,0.3)', borderRadius: 34, padding: '26px 38px'}}>
              <div style={{transform: `scale(${lerp(0.5, 1, ac)})`, opacity: cl(ac * 3)}}><Tick size={96} /></div>
              <div style={{...txt(46, 800, P.white, 0, ), whiteSpace: 'normal', lineHeight: 1.1}}>SOLO SI QUIEN LO RECIBIÓ <span style={{color: P.mint}}>ACEPTA DEVOLVERLO</span></div>
            </div>
          </Rise>
        </>
      );
    }}
  </Scene>
);

const DIG = '012345678901234567';
const S9: React.FC = () => (
  <Scene a={A[8]} b={SPEIE_TOTAL + 1} kind="up" out="none">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(114) - 0.1, T(114) + 0.45));
      const n = Math.max(1, Math.round(c * 18));
      const check = prog(t, T(116), T(118) + 0.2);
      const back = easeIO(prog(t, T(120) - 0.1, SPEIE_TOTAL - 0.2));
      return (
        <>
          <div style={{opacity: 1 - cl(back * 2.2), transform: `translateY(${back * 260}px) scale(${1 - back * 0.3})`}}>
            <Mask at={A[8] + 0.05} size={104} style={abs(80, 215)}>LA CLABE</Mask>
            <div style={{...center(330), ...txt(440, 800, P.amber, -0.05)}}>{n}</div>
            <Mask at={T(115) - 0.1} size={110} style={center(790)}>DÍGITOS</Mask>
            <div style={{position: 'absolute', left: 80, top: 960, width: 920, display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: 10}}>
              {DIG.split('').map((d, k) => {
                const on = check * 19 > k;
                return (
                  <div key={k} style={{height: 96, borderRadius: 18, background: on ? P.mint : 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${on ? 1 : 0.94})`}}>
                    <span style={{...txt(50, 800, on ? P.ink : P.mute, 0)}}>{d}</span>
                  </div>
                );
              })}
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
  {at: A[4], mood: 'plum'},
  {at: A[5], mood: 'ember'},
  {at: A[6], mood: 'navy'},
  {at: A[7], mood: 'ember'},
  {at: A[8], mood: 'navy'},
];
const PASOS = [
  {at: A[2], label: '1 DE 3'},
  {at: A[4], label: '2 DE 3'},
  {at: A[5], label: '3 DE 3'},
  {at: A[8], label: ''},
];

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const p = spr(f, A[6] + 0.6, 12, 200, 0.6);
  if (t < A[6] + 0.6 || t > A[8]) return null;
  return (
    <div style={{position: 'absolute', right: 70, top: 160, transform: `translateX(${(1 - p) * 200}px)`, opacity: cl(p * 2)}}>
      <Chip bg={P.white} color={P.ink} size={26}>＋ SÍGUEME</Chip>
    </div>
  );
};

export const SpeiEduMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
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
    <Frame serie="FINANZAS FÁCILES" total={SPEIE_TOTAL} pasos={PASOS} nota="Contenido educativo, no es recomendación de inversión. Fuente: Banxico (SPEI, CEP). Ejemplos hipotéticos." />
    <Cta />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('spei-edu/voz_mix.wav')} />}
  </AbsoluteFill>
);

export const SpeiEduCover: React.FC = () => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={[{at: 0, mood: 'navy'}]} />
    <div style={{...center(200), ...txt(74, 600, P.mute, 0.3)}}>TU BANCO</div>
    <div style={{...center(268), ...txt(190)}}>CIERRA</div>
    <div style={{...center(520)}}><Bank s={1.05} dim={0.45} /></div>
    <div style={{...center(960), transform: 'rotate(-5deg)'}}>
      <div style={{...txt(250, 800, P.ink, -0.02), background: P.amber, padding: '6px 64px 0', borderRadius: 30, boxShadow: '0 30px 60px rgba(0,0,0,0.5)', border: `10px solid ${P.ink}`, outline: `10px solid ${P.amber}`}}>SPEI NO</div>
    </div>
    <div style={{...center(1240), ...txt(60, 700, P.white, 0)}}>3 cosas que debes revisar</div>
    <div style={center(1350)}>
      <Chip size={30}>FINANZAS FÁCILES</Chip>
    </div>
    <Grain />
  </AbsoluteFill>
);

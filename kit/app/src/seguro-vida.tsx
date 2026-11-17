// SEGURO DE VIDA — educativo, Estándar Pro (2026-11-17)
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/seguro-vida/words.json';
import {Backdrop, Captions, Card, Chip, FONT, FPS, Frame, Grain, Mask, P, Pop, Rise, Scene, Wd, buildGroups, cl, easeIO, easeOut, lerp, money, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const SEG_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1));
const groups = buildGroups(words, blocks);
const KEYS = ['COBRA', 'PERSONA', 'TRES', 'SEÑALES', 'INGRESO', 'DEUDAS', 'COMPLETA', 'OLVIDA', 'AÑOS', 'BÁSICOS', 'SUMA', 'ASEGURADA', 'MES', 'PROTEGE', 'CONDUSEF'];

const abs = (x: number, y: number, w?: number): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w});
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
const txt = (size: number, weight = 800, color = P.white, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});

/* ---------- ilustraciones ---------- */
const Policy: React.FC<{s?: number}> = ({s = 1}) => (
  <svg width={380 * s} height={470 * s} viewBox="0 0 380 470" style={{filter: 'drop-shadow(0 34px 40px rgba(0,0,0,0.45))'}}>
    <rect x={10} y={10} width={360} height={450} rx={30} fill={P.paper} />
    <rect x={44} y={46} width={150} height={26} rx={13} fill={P.ink} />
    <rect x={44} y={96} width={292} height={16} rx={8} fill="rgba(10,15,31,0.22)" />
    <rect x={44} y={128} width={240} height={16} rx={8} fill="rgba(10,15,31,0.16)" />
    <path d="M190 170 L270 200 V262 C270 312 235 340 190 356 C145 340 110 312 110 262 V200Z" fill={P.ink} />
    <path d="M190 232 C190 232 165 214 154 234 C146 252 170 272 190 288 C210 272 234 252 226 234 C215 214 190 232 190 232Z" fill={P.coral} />
    <rect x={44} y={386} width={200} height={16} rx={8} fill="rgba(10,15,31,0.2)" />
    <rect x={44} y={416} width={120} height={16} rx={8} fill="rgba(10,15,31,0.14)" />
  </svg>
);
const Person: React.FC<{size?: number; color?: string; glow?: number}> = ({size = 200, color = P.mint, glow = 0}) => (
  <svg width={size} height={size * 1.15} viewBox="-100 -110 200 230" style={{filter: `drop-shadow(0 16px 22px rgba(0,0,0,0.4)) drop-shadow(0 0 ${glow * 30}px ${color})`}}>
    <circle cx={0} cy={-52} r={44} fill={color} />
    <path d="M-80 108 C-80 40 -48 8 0 8 C48 8 80 40 80 108Z" fill={color} />
  </svg>
);
const Coin: React.FC<{size?: number}> = ({size = 220}) => (
  <svg width={size} height={size} viewBox="-110 -110 220 220" style={{filter: 'drop-shadow(0 20px 26px rgba(0,0,0,0.45))'}}>
    <circle r={104} fill={P.amberDeep} />
    <circle r={90} fill={P.amber} />
    <circle r={70} fill="none" stroke="rgba(10,15,31,0.3)" strokeWidth={6} />
    <text y={36} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={108} fill={P.ink}>$</text>
  </svg>
);
const Cross: React.FC<{size?: number}> = ({size = 200}) => (
  <svg width={size} height={size} viewBox="-100 -100 200 200">
    <path d="M-70 -70 L70 70 M70 -70 L-70 70" stroke={P.coral} strokeWidth={34} strokeLinecap="round" />
  </svg>
);

/* ---------- gancho (también último fotograma) ---------- */
const HookBase: React.FC<{f: number; arrow?: number; who?: number}> = ({f, arrow = 1, who = 1}) => {
  const bob = Math.sin(f / 9) * 6;
  return (
    <>
      <div style={{...center(215), ...txt(70, 600, P.mute, 0.3)}}>TU SEGURO DE</div>
      <div style={{...center(285), ...txt(230)}}>VIDA</div>
      <div style={{...abs(80, 640), transform: `translateY(${bob}px) rotate(-3deg)`}}>
        <Policy s={1.1} />
      </div>
      <svg style={{position: 'absolute', left: 0, top: 0}} width={1080} height={1920}>
        <path d="M500 880 C580 800 620 800 680 880" stroke={P.amber} strokeWidth={12} strokeLinecap="round" fill="none" strokeDasharray="22 20" pathLength={1} style={{strokeDasharray: `${arrow} 1`}} opacity={arrow > 0 ? 1 : 0} />
      </svg>
      <div style={{...abs(680, 760), opacity: cl(who * 2), transform: `scale(${lerp(0.6, 1, who)}) translateY(${bob}px)`}}>
        <Person size={250} glow={who} />
      </div>
      <div style={{...abs(660, 1080), width: 290, textAlign: 'center', ...txt(38, 800, P.mint, 0.02), opacity: cl(who * 2)}}>OTRA PERSONA</div>
    </>
  );
};

/* ---------- escenas ---------- */
const S1: React.FC = () => (
  <Scene a={A[0]} b={A[1]} kind="none" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const arrow = easeOut(prog(t, T(5) - 0.05, T(5) + 0.5));
      const who = spr(f, T(6) - 0.05, 9, 220, 0.6);
      return (
        <AbsoluteFill style={{transform: `scale(${lerp(1.06, 1, easeOut(lt / 0.5))})`}}>
          <HookBase f={f} arrow={arrow} who={who} />
        </AbsoluteFill>
      );
    }}
  </Scene>
);

const S2: React.FC = () => {
  const sig = ['INGRESO', 'DEUDAS', 'SUMA'];
  return (
    <Scene a={A[1]} b={A[2]} kind="up" out="left">
      {(lt, f) => (
        <>
          <Mask at={A[1] + 0.02} size={380} color={P.amber} style={center(200)}>3</Mask>
          <Mask at={T(11) - 0.1} size={140} style={center(580)}>SEÑALES</Mask>
          <div style={{position: 'absolute', left: 75, top: 800, display: 'flex', gap: 28}}>
            {sig.map((n, k) => {
              const p = spr(f, T(10) + 0.12 + k * 0.17, 11, 200, 0.6);
              return (
                <div key={k} style={{width: 290, height: 330, borderRadius: 40, background: 'rgba(255,255,255,0.09)', border: '3px solid rgba(255,255,255,0.28)', transform: `translateY(${(1 - p) * 200}px) rotate(${(k - 1) * 3}deg)`, opacity: cl(p * 2), position: 'relative', boxShadow: '0 30px 60px rgba(0,0,0,0.35)'}}>
                  <div style={{...txt(120, 800, P.amber), position: 'absolute', left: 0, right: 0, top: 40, textAlign: 'center'}}>{k + 1}</div>
                  <div style={{position: 'absolute', left: 34, right: 34, top: 220, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.32)'}} />
                  <div style={{position: 'absolute', left: 34, right: 110, top: 262, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.2)'}} />
                </div>
              );
            })}
          </div>
        </>
      )}
    </Scene>
  );
};

const S3: React.FC = () => {
  const fam = [{l: 'HIJOS', w: 24, c: P.amber}, {l: 'PAREJA', w: 26, c: P.mint}, {l: 'PAPÁS', w: 28, c: '#8FB8FF'}];
  return (
    <Scene a={A[2]} b={A[3]} kind="left" out="up">
      {(lt, f) => {
        const t = f / FPS;
        const pulse = 1 + Math.sin(f / 6) * 0.03;
        return (
          <>
            <Mask at={A[2] + 0.03} size={400} color={P.amber} style={abs(80, 190)}>1</Mask>
            <div style={{position: 'absolute', right: 120, top: 220, transform: `scale(${pulse})`}}>
              <Pop at={T(21) - 0.1}><Coin size={300} /></Pop>
            </div>
            <Mask at={T(21) - 0.1} size={92} style={abs(80, 650)}>TU INGRESO</Mask>
            <svg style={{position: 'absolute', left: 0, top: 0}} width={1080} height={1920}>
              {fam.map((x, k) => {
                const o = cl(prog(t, T(x.w) - 0.1, T(x.w) + 0.3));
                const px = 190 + k * 330;
                return <path key={k} d={`M${px + 120} 960 C ${px + 120} 840 700 800 ${900} 560`} stroke={x.c} strokeWidth={6} fill="none" strokeDasharray="14 14" opacity={o * 0.8} />;
              })}
            </svg>
            {fam.map((x, k) => (
              <Pop key={k} at={T(x.w) - 0.05} rot={(k - 1) * 4} style={abs(70 + k * 320, 880)}>
                <div style={{width: 280, textAlign: 'center'}}>
                  <Person size={210} color={x.c} />
                  <div style={{...txt(52, 800, P.white, 0.04), marginTop: 10}}>{x.l}</div>
                </div>
              </Pop>
            ))}
          </>
        );
      }}
    </Scene>
  );
};

const S4: React.FC = () => (
  <Scene a={A[3]} b={A[4]} kind="up" out="zoom">
    {(lt, f) => {
      const t = f / FPS;
      const fill = easeOut(prog(t, T(39) - 0.1, T(40) + 0.4));
      const x = spr(f, T(41) - 0.05, 8, 240, 0.6);
      return (
        <>
          <Mask at={A[3] + 0.03} size={140} color={P.coral} style={abs(80, 200)}>DEUDAS</Mask>
          <Rise at={T(32) - 0.2} dy={80} style={abs(90, 400, 900)}>
            <Card style={{padding: '34px 50px', transform: 'rotate(-1.2deg)'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <span style={txt(44, 500, 'rgba(10,15,31,0.66)', 0)}>Hipoteca, tarjeta…</span>
                <span style={txt(78, 800, P.coral)}>− $</span>
              </div>
              <div style={{position: 'relative', height: 26, marginTop: 20, borderRadius: 13, background: 'rgba(10,15,31,0.1)'}}>
                <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: '78%', borderRadius: 13, background: P.coral}} />
              </div>
            </Card>
          </Rise>
          <Rise at={T(36) - 0.1} dy={100} style={abs(90, 760, 900)}>
            <div style={{...txt(40, 700, P.mute, 0.16), marginBottom: 16}}>SUMA ASEGURADA</div>
            <div style={{height: 190, borderRadius: 40, border: '4px solid rgba(255,255,255,0.4)', position: 'relative', overflow: 'hidden', background: 'rgba(255,255,255,0.06)'}}>
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: `linear-gradient(90deg, ${P.amberDeep}, ${P.amber})`}} />
              <div style={{...txt(84, 800, P.ink, 0), position: 'absolute', left: 40, top: 54}}>{Math.round(fill * 100)}%</div>
            </div>
          </Rise>
          <Pop at={T(40) - 0.05} rot={-3} style={abs(90, 1030)}>
            <div style={{...txt(60, 800, P.ink, 0), background: P.mint, padding: '16px 38px', borderRadius: 22, boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}>SUMA COMPLETA</div>
          </Pop>
          <Pop at={T(34) - 0.05} rot={4} style={abs(560, 1170)}>
            <Chip size={34}>SEGÚN CONDUSEF</Chip>
          </Pop>
        </>
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
          <div style={{...center(170), ...txt(680, 800, P.amber, -0.04), clipPath: `inset(${(1 - prog(f / FPS, T(46), T(49) + 0.3)) * 100}% 0 0 0)`, transform: `scale(${lerp(1.6, 1, p)})`}}>3</div>
          <Mask at={T(46) - 0.08} size={120} style={center(900)}>EL QUE MÁS</Mask>
          <Mask at={T(48) - 0.1} size={150} color={P.coral} style={center(1020)}>SE OLVIDA</Mask>
        </>
      );
    }}
  </Scene>
);

const S6: React.FC = () => (
  <Scene a={A[5]} b={A[6]} kind="left" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const n = Math.max(1, Math.round(easeOut(prog(t, T(55) - 0.05, T(55) + 0.5)) * 3));
      return (
        <>
          <Mask at={A[5] + 0.03} size={110} style={abs(80, 200)}>¿CUÁNTO?</Mask>
          <div style={{...abs(80, 330), ...txt(520, 800, P.amber, -0.05)}}>{n}</div>
          <div style={{...abs(480, 520), ...txt(170, 800, P.white, -0.02)}}>AÑOS</div>
          <div style={{position: 'absolute', left: 80, top: 880, display: 'flex', gap: 24}}>
            {[0, 1, 2].map(k => {
              const on = n > k;
              return (
                <div key={k} style={{width: 280, height: 190, borderRadius: 32, background: on ? P.mint : 'rgba(255,255,255,0.1)', border: on ? 'none' : '3px dashed rgba(255,255,255,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${on ? 1 : 0.94})`}}>
                  <span style={txt(40, 700, on ? 'rgba(10,15,31,0.6)' : P.mute, 0.12)}>AÑO</span>
                  <span style={txt(90, 800, on ? P.ink : P.mute, 0)}>{k + 1}</span>
                </div>
              );
            })}
          </div>
          <Pop at={T(58) - 0.05} rot={-3} style={abs(80, 1130)}>
            <div style={{...txt(56, 800, P.ink, 0), background: P.amber, padding: '14px 34px', borderRadius: 22, boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}>GASTOS BÁSICOS</div>
          </Pop>
        </>
      );
    }}
  </Scene>
);

const Row: React.FC<{at: number; label: string; val: string}> = ({at, label, val}) => (
  <Rise at={at} dy={40} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '20px 0', borderBottom: '3px dashed rgba(10,15,31,0.16)'}}>
    <span style={txt(44, 500, 'rgba(10,15,31,0.66)', 0)}>{label}</span>
    <span style={txt(64, 800, P.ink)}>{val}</span>
  </Rise>
);
const S7: React.FC = () => (
  <Scene a={A[6]} b={A[7]} kind="up" out="zoom">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(70), T(72) + 0.5));
      const punch = spr(f, T(72) + 0.5, 7, 260, 0.5);
      return (
        <Card style={{...abs(90, 230, 900), padding: '50px 60px 54px', transform: 'rotate(-1.2deg)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14}}>
            <Chip bg={P.ink} color={P.amber} size={28}>EJEMPLO</Chip>
            <span style={txt(30, 500, 'rgba(10,15,31,0.5)', 0)}>hipotético</span>
          </div>
          <Row at={T(65) - 0.1} label="Gastan al mes" val="$15,000" />
          <Row at={T(69) - 0.1} label="Por 3 años" val="× 36 meses" />
          <Rise at={T(70) - 0.3} dy={40} style={{marginTop: 34}}>
            <div style={txt(36, 700, 'rgba(10,15,31,0.6)', 0.14)}>SUMA A CONSIDERAR</div>
            <div style={{position: 'relative', display: 'inline-block', marginTop: 6, transform: `scale(${lerp(1.06, 1, punch)})`, transformOrigin: '0 60%'}}>
              <div style={{position: 'absolute', left: -12, right: -18, bottom: 20, height: 62, background: P.amber, borderRadius: 14, transform: `scaleX(${c})`, transformOrigin: '0 50%'}} />
              <div style={{...txt(170, 800, P.ink, -0.04), position: 'relative'}}>{money(c * 540000)}</div>
            </div>
          </Rise>
        </Card>
      );
    }}
  </Scene>
);

const S8: React.FC = () => (
  <Scene a={A[7]} b={A[8]} kind="zoom" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const grow = easeOut(prog(t, T(76) - 0.1, T(77) + 0.4));
      const ring = spr(f, T(77), 9, 220, 0.6);
      return (
        <>
          <Mask at={T(74) - 0.1} size={150} color={P.amber} style={center(210)}>REVISA</Mask>
          <Rise at={A[7] + 0.2} dy={80} style={abs(90, 470, 900)}>
            <div style={{...txt(38, 700, P.mute, 0.16), marginBottom: 14}}>LO QUE PAGAS (PRIMA)</div>
            <div style={{height: 90, borderRadius: 30, background: 'rgba(255,255,255,0.08)', border: '3px solid rgba(255,255,255,0.3)', position: 'relative', overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: '14%', background: P.mute}} />
            </div>
          </Rise>
          <Rise at={T(76) - 0.2} dy={80} style={abs(90, 740, 900)}>
            <div style={{...txt(38, 700, P.amber, 0.16), marginBottom: 14}}>SUMA ASEGURADA</div>
            <div style={{height: 260, borderRadius: 40, background: 'rgba(255,255,255,0.08)', border: `4px solid ${P.amber}`, position: 'relative', overflow: 'hidden', boxShadow: `0 0 ${ring * 50}px rgba(255,194,71,0.5)`}}>
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${grow * 100}%`, background: `linear-gradient(90deg, ${P.amberDeep}, ${P.amber})`}} />
            </div>
          </Rise>
          <Pop at={T(78) - 0.05} rot={-4} style={abs(90, 1100)}>
            <div style={{...txt(52, 800, P.ink, 0), background: P.mint, padding: '14px 34px', borderRadius: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}>NO SOLO LO QUE PAGAS</div>
          </Pop>
        </>
      );
    }}
  </Scene>
);

const S9: React.FC = () => {
  const items = [
    {n: '1', l: 'alguien depende de ti'},
    {n: '2', l: 'tienes deudas'},
    {n: '3', l: 'sabes cuánto cubrir'},
  ];
  return (
    <Scene a={A[8]} b={SEG_TOTAL + 1} kind="up" out="none">
      {(lt, f) => {
        const t = f / FPS;
        const back = easeIO(prog(t, T(85) - 0.1, SEG_TOTAL - 0.2));
        return (
          <>
            <div style={{opacity: 1 - cl(back * 2.2), transform: `translateY(${back * 260}px) scale(${1 - back * 0.3})`}}>
              <Mask at={A[8] + 0.05} size={104} style={abs(80, 215)}>TU CHECKLIST</Mask>
              {items.map((it, k) => (
                <Rise key={k} at={A[8] + 0.12 + k * 0.17} dx={-160} dy={0} style={abs(80, 370 + k * 250, 900)}>
                  <div style={{height: 216, borderRadius: 40, background: 'rgba(255,255,255,0.09)', border: '3px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: 36, padding: '0 46px', boxSizing: 'border-box'}}>
                    <div style={{...txt(150, 800, P.amber, -0.04), width: 120}}>{it.n}</div>
                    <div style={txt(54, 700, P.white, 0)}>{it.l}</div>
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
  {at: A[4], mood: 'ember'},
  {at: A[5], mood: 'navy'},
  {at: A[7], mood: 'forest'},
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
  const p = spr(f, A[6] + 0.6, 12, 200, 0.6);
  if (t < A[6] + 0.6 || t > A[8]) return null;
  return (
    <div style={{position: 'absolute', right: 70, top: 160, transform: `translateX(${(1 - p) * 200}px)`, opacity: cl(p * 2)}}>
      <Chip bg={P.white} color={P.ink} size={26}>＋ SÍGUEME</Chip>
    </div>
  );
};

export const SeguroVidaMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={MOOD_AT} />
    <S1 /><S2 /><S3 /><S4 /><S5 /><S6 /><S7 /><S8 /><S9 />
    <Grain />
    <Frame serie="FINANZAS FÁCILES" total={SEG_TOTAL} pasos={PASOS} nota="Contenido educativo, no es recomendación de inversión. Fuente: Condusef. Ejemplo hipotético." />
    <Cta />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('seguro-vida/voz_mix.wav')} />}
  </AbsoluteFill>
);

export const SeguroVidaCover: React.FC = () => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={[{at: 0, mood: 'navy'}]} />
    <div style={{...center(190), ...txt(70, 600, P.mute, 0.3)}}>TU SEGURO DE</div>
    <div style={{...center(260), ...txt(230)}}>VIDA</div>
    <div style={{...center(520), ...txt(92, 600, P.white, 0)}}>lo cobra otra persona</div>
    <div style={{...abs(80, 680), transform: 'rotate(-3deg)'}}><Policy s={1.1} /></div>
    <div style={abs(680, 800)}><Person size={250} glow={0.8} /></div>
    <div style={{...center(1240), ...txt(60, 700, P.white, 0)}}>3 señales de que sí lo necesitas</div>
    <div style={center(1350)}><Chip size={30}>FINANZAS FÁCILES</Chip></div>
    <Grain />
  </AbsoluteFill>
);

// ROBOTIK — producto Actinver con el Estándar Pro (2026-11-16)
import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/robotik/words.json';
import {ACTINVER, Backdrop, Brand, Captions, Card, Chip, FONT, FPS, Frame, Grain, Mask, P, Pop, Rise, Scene, Wd, buildGroups, cl, easeIO, easeOut, lerp, prog, spr, useBrand} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const ROBO_VOZ = blocks[blocks.length - 1].e + 0.28;
const LEGAL_S = 5.5; // pantalla legal al final
export const ROBO_TOTAL = ROBO_VOZ + LEGAL_S;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1));
const groups = buildGroups(words, blocks);
const KEYS = ['600', 'MIL', 'ROBOTS', 'ROBOTIK', 'TRES', 'AUTOMATIZACIÓN', 'AUTÓNOMOS', 'MÉDICOS', 'IMPORTANTE:', 'GARANTÍA', 'BAJAR', 'LARGO', '24', 'ESCRÍBEME'];

const abs = (x: number, y: number, w?: number): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w});
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
const txt = (size: number, weight = 800, color = P.white, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});

/* ---------------- ilustraciones ---------------- */
/** brazo robótico industrial; a = ángulo base, b = ángulo codo */
const Arm: React.FC<{a: number; b: number; s?: number; color?: string}> = ({a, b, s = 1, color = '#C9B97A'}) => (
  <svg width={620 * s} height={760 * s} viewBox="-310 -660 620 760" style={{filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.45))'}}>
    <ellipse cx={0} cy={86} rx={200} ry={16} fill="rgba(0,0,0,0.35)" />
    <rect x={-150} y={30} width={300} height={56} rx={18} fill="#1D2A3E" />
    <rect x={-90} y={-20} width={180} height={60} rx={14} fill="#2C3F5E" />
    <g transform={`rotate(${a} 0 -10)`}>
      <rect x={-30} y={-250} width={60} height={250} rx={26} fill={color} />
      <circle cx={0} cy={-250} r={44} fill="#1D2A3E" />
      <circle cx={0} cy={-250} r={20} fill={color} />
      <g transform={`translate(0 -250) rotate(${b})`}>
        <rect x={-24} y={-230} width={48} height={230} rx={22} fill="#E9E1D0" />
        <circle cx={0} cy={-230} r={34} fill="#1D2A3E" />
        <g transform="translate(0 -230)">
          <rect x={-20} y={-60} width={40} height={50} rx={10} fill={color} />
          <path d="M-34 -58 L-34 -92 M34 -58 L34 -92" stroke="#E9E1D0" strokeWidth={14} strokeLinecap="round" />
        </g>
      </g>
    </g>
    <circle cx={0} cy={-10} r={26} fill="#1D2A3E" />
  </svg>
);
const Car: React.FC<{s?: number; scan?: number}> = ({s = 1, scan = 0}) => (
  <svg width={420 * s} height={260 * s} viewBox="0 0 420 260">
    <ellipse cx={210} cy={226} rx={170} ry={12} fill="rgba(0,0,0,0.35)" />
    <path d="M30 170 C30 140 50 128 90 122 L130 80 C140 68 150 64 168 64 H252 C270 64 282 70 294 82 L330 122 C372 128 392 140 392 170 V196 H30Z" fill="#E9E1D0" />
    <path d="M142 92 H208 V122 H112Z M222 92 H260 C268 92 274 96 280 102 L300 122 H222Z" fill="#2C3F5E" />
    <circle cx={110} cy={196} r={34} fill="#0A0F1F" /><circle cx={110} cy={196} r={14} fill="#9FB3CF" />
    <circle cx={310} cy={196} r={34} fill="#0A0F1F" /><circle cx={310} cy={196} r={14} fill="#9FB3CF" />
    <circle cx={210} cy={54} r={12} fill="#C9B97A" />
    {[0, 1, 2].map((k) => (
      <path key={k} d={`M210 54 m${-40 - k * 34} ${-20 - k * 14} a${58 + k * 36} ${58 + k * 36} 0 0 1 ${80 + k * 68} 0`} stroke="#C9B97A" strokeWidth={7} fill="none" strokeLinecap="round" opacity={cl(1 - Math.abs(scan - k) * 0.7) * 0.9} />
    ))}
  </svg>
);
const Med: React.FC<{s?: number}> = ({s = 1}) => (
  <svg width={300 * s} height={300 * s} viewBox="-150 -150 300 300" style={{filter: 'drop-shadow(0 20px 26px rgba(0,0,0,0.4))'}}>
    <circle r={130} fill="#E9E1D0" />
    <rect x={-26} y={-84} width={52} height={168} rx={14} fill="#FF5A5F" />
    <rect x={-84} y={-26} width={168} height={52} rx={14} fill="#FF5A5F" />
  </svg>
);
const Globe: React.FC<{s?: number; rot?: number}> = ({s = 1, rot = 0}) => (
  <svg width={380 * s} height={380 * s} viewBox="-190 -190 380 380" style={{filter: 'drop-shadow(0 26px 34px rgba(0,0,0,0.45))'}}>
    <defs><clipPath id="gc"><circle r={170} /></clipPath></defs>
    <circle r={170} fill="#1D3F7A" />
    <g clipPath="url(#gc)" stroke="rgba(255,255,255,0.45)" strokeWidth={4} fill="none">
      {[-120, -60, 0, 60, 120].map((y) => <ellipse key={y} cx={0} cy={y} rx={Math.sqrt(Math.max(0, 170 * 170 - y * y))} ry={14} />)}
      {[0, 1, 2, 3].map((k) => <ellipse key={k} cx={0} cy={0} rx={Math.abs(Math.cos(((k * 45 + rot) * Math.PI) / 180)) * 170} ry={170} />)}
    </g>
    <circle r={170} fill="none" stroke="#C9B97A" strokeWidth={8} />
  </svg>
);
const Cross: React.FC<{size?: number}> = ({size = 220}) => (
  <svg width={size} height={size} viewBox="-100 -100 200 200" style={{filter: 'drop-shadow(0 14px 18px rgba(0,0,0,0.45))'}}>
    <path d="M-70 -70 L70 70 M70 -70 L-70 70" stroke={P.coral} strokeWidth={26} strokeLinecap="round" />
  </svg>
);
const Tick: React.FC<{size?: number}> = ({size = 120}) => (
  <svg width={size} height={size} viewBox="-60 -60 120 120" style={{filter: 'drop-shadow(0 10px 14px rgba(0,0,0,0.4))'}}>
    <circle r={56} fill={P.mint} />
    <path d="M-26 2 L-8 22 L28 -18" stroke={P.ink} strokeWidth={15} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------------- escenas ---------------- */
const S1: React.FC = () => (
  <Scene a={A[0]} b={A[1]} kind="none" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const c = spr(f, 0, 9, 200, 0.7);
      const n = 600;
      const sw = Math.sin(f / 16);
      return (
        <AbsoluteFill style={{transform: `scale(${lerp(1.07, 1, easeOut(lt / 0.5))})`}}>
          <div style={{...center(235), ...txt(70, 600, P.mute, 0.3)}}>MÁS DE</div>
          <div style={{...center(300), ...txt(330, 800, '#C9B97A', -0.05), transform: `scale(${lerp(1.0, 1, c)}) translateY(${(1 - c) * 0}px)`}}>{n}</div>
          <Mask at={T(3) - 0.05} size={150} style={center(640)}>MIL ROBOTS</Mask>
          <div style={{...center(735), transform: `translateX(${sw * 10}px)`}}>
            <Arm a={-24 + sw * 12} b={34 - sw * 16} s={0.72} />
          </div>
          <Rise at={T(6) - 0.05} style={center(1210)}>
            <Chip size={30}>NUEVOS EN FÁBRICAS · 2025</Chip>
          </Rise>
        </AbsoluteFill>
      );
    }}
  </Scene>
);

const Tile: React.FC<{k: number; at: number; merge: number}> = ({k, at, merge}) => {
  const f = useCurrentFrame();
  const p = spr(f, at + k * 0.07, 11, 210, 0.6);
  const col = k % 4;
  const row = Math.floor(k / 4);
  const x = 100 + col * 215;
  const y = 330 + row * 205;
  const tx = 540 - 100 - 90 - x + 0;
  const ty = 600 - y;
  const mp = easeIO(merge);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 190, height: 170, borderRadius: 30, background: 'rgba(255,255,255,0.1)', border: '3px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: cl(p * 2) * (1 - mp), transform: `translate(${tx * mp * 0.9}px, ${ty * mp * 0.5}px) scale(${lerp(0.4, 1, p) * (1 - mp * 0.5)})`}}>
      <div style={{...txt(84, 800, P.mute, 0)}}>?</div>
    </div>
  );
};
const S2: React.FC = () => (
  <Scene a={A[1]} b={A[2]} kind="up" out="left">
    {(lt, f) => {
      const t = f / FPS;
      const merge = prog(t, T(18) + 0.2, T(21) + 0.5);
      const x = spr(f, T(14) - 0.05, 9, 220, 0.6);
      return (
        <>
          <Mask at={A[1] + 0.05} size={104} style={center(205)}>UNA POR UNA</Mask>
          {Array.from({length: 12}, (_, k) => <Tile key={k} k={k} at={A[1] + 0.2} merge={merge} />)}
          <div style={{...center(520), opacity: cl(x * 2) * (1 - cl(merge * 1.5)), transform: `scale(${lerp(2.4, 1, x)}) rotate(${lerp(-14, 0, x)}deg)`}}>
            <Cross size={420} />
          </div>
          <Pop at={T(19) - 0.1} rot={-3} style={center(1010)}>
            <div style={{...txt(66, 800, P.ink, 0), background: P.mint, padding: '18px 48px', borderRadius: 24, boxShadow: '0 24px 44px rgba(0,0,0,0.4)'}}>TÚ NO TIENES QUE ELEGIR</div>
          </Pop>
        </>
      );
    }}
  </Scene>
);

const S3: React.FC = () => (
  <Scene a={A[2]} b={A[3]} kind="zoom" out="left">
    {(lt, f) => {
      const br = useBrand();
      const sweep = prog(f / FPS, T(22), T(22) + 0.9);
      return (
        <>
          <Mask at={T(22) - 0.1} size={196} color={br.accent} ls={-0.04} style={center(235)}>ROBOTIK</Mask>
          <Rise at={T(23)} dy={60} style={center(520)}>
            <Chip size={34} bg="rgba(255,255,255,0.12)">FONDO DE ACTINVER</Chip>
          </Rise>
          <Rise at={T(24)} dy={140} style={abs(90, 690, 900)}>
            <Card style={{padding: '46px 54px 50px', transform: 'rotate(-1.2deg)', position: 'relative', overflow: 'hidden'}}>
              <div style={{...txt(34, 700, 'rgba(10,15,31,0.5)', 0.16)}}>ASESORADO POR</div>
              <div style={{...txt(86, 800, P.ink, -0.02), marginTop: 10}}>AXA Investment</div>
              <div style={{...txt(86, 800, P.ink, -0.02)}}>Managers</div>
              <div style={{position: 'absolute', top: 0, bottom: 0, width: 160, left: lerp(-220, 1100, sweep), background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)', transform: 'skewX(-18deg)'}} />
            </Card>
          </Rise>
          <Rise at={T(28) + 0.3} dy={40} style={center(1010)}>
            <Chip size={30}>RENTA VARIABLE GLOBAL</Chip>
          </Rise>
        </>
      );
    }}
  </Scene>
);

const S4: React.FC = () => (
  <Scene a={A[3]} b={A[4]} kind="zoom" out="up">
    {(lt, f) => {
      const p = spr(f, A[3] + 0.02, 10, 200, 0.7);
      return (
        <>
          <div style={{...center(190), ...txt(620, 800, '#C9B97A', -0.04), transform: `scale(${lerp(1.5, 1, p)})`, opacity: cl(p * 2)}}>3</div>
          <Mask at={T(36) - 0.12} size={150} style={center(880)}>TEMAS</Mask>
          <div style={{position: 'absolute', left: 110, top: 1060, display: 'flex', gap: 40}}>
            {['AUTOMAT.', 'VEHÍCULOS', 'MÉDICOS'].map((e, k) => (
              <Pop key={k} at={T(36) + 0.1 + k * 0.12} style={{width: 250, height: 150, borderRadius: 32, background: 'rgba(255,255,255,0.1)', border: '3px solid rgba(255,255,255,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{...txt(30, 800, P.white, 0.06)}}>{e}</div>
              </Pop>
            ))}
          </div>
        </>
      );
    }}
  </Scene>
);

const S5: React.FC = () => (
  <Scene a={A[4]} b={A[5]} kind="left" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const sw = Math.sin((t - A[4]) * 2.6);
      return (
        <>
          <Mask at={A[4] + 0.05} size={330} color="#C9B97A" ls={-0.05} style={abs(80, 190)}>1</Mask>
          <Mask at={T(38) - 0.1} size={92} style={abs(80, 500)}>AUTOMATIZACIÓN</Mask>
          <Mask at={T(39) - 0.1} size={92} color={P.mute} style={abs(80, 600)}>INDUSTRIAL</Mask>
          <Pop at={A[4] + 0.15} from={0.6} style={{...center(610), left: 160}}>
            <Arm a={-34 + sw * 30} b={50 - sw * 36} s={0.8} />
          </Pop>
          <Rise at={T(46) - 0.1} dy={50} style={center(1200)}>
            <Chip size={32}>FÁBRICAS</Chip>
          </Rise>
        </>
      );
    }}
  </Scene>
);

const S6: React.FC = () => (
  <Scene a={A[5]} b={A[6]} kind="up" out="left">
    {(lt, f) => {
      const t = f / FPS;
      const scan = ((t - A[5]) * 1.8) % 3;
      return (
        <>
          <Mask at={A[5] + 0.05} size={330} color="#C9B97A" ls={-0.05} style={abs(80, 190)}>2</Mask>
          <Rise at={T(50) - 0.1} dy={120} style={abs(80, 560, 420)}>
            <div style={{height: 520, borderRadius: 44, background: 'rgba(255,255,255,0.09)', border: '3px solid rgba(255,255,255,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20}}>
              <Car s={0.9} scan={scan} />
              <div style={{...txt(40, 800, P.white, 0.04)}}>VEHÍCULOS</div>
              <div style={{...txt(40, 800, '#C9B97A', 0.04)}}>AUTÓNOMOS</div>
            </div>
          </Rise>
          <Rise at={T(53) - 0.1} dy={120} style={abs(560, 560, 420)}>
            <div style={{height: 520, borderRadius: 44, background: 'rgba(255,255,255,0.09)', border: '3px solid rgba(255,255,255,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20}}>
              <Med s={0.9} />
              <div style={{...txt(40, 800, P.white, 0.04)}}>IMPLEMENTOS</div>
              <div style={{...txt(40, 800, '#C9B97A', 0.04)}}>MÉDICOS</div>
            </div>
          </Rise>
        </>
      );
    }}
  </Scene>
);

const S7: React.FC = () => {
  const pts = [0, 0.35, 0.2, 0.55, 0.38, 0.7, 0.5, 0.82, 0.62, 0.9];
  return (
    <Scene a={A[6]} b={A[7]} kind="zoom" out="up">
      {(lt, f) => {
        const t = f / FPS;
        const draw = prog(t, T(64), T(69) + 0.3);
        const stamp = spr(f, T(71) - 0.05, 9, 250, 0.7);
        const W2 = 820;
        const H2 = 300;
        const path = pts.map((v, k) => `${k ? 'L' : 'M'}${(k / (pts.length - 1)) * W2} ${H2 - v * H2 + Math.sin(k * 2.1) * 34}`).join(' ');
        return (
          <>
            <Mask at={A[6] + 0.05} size={330} color="#C9B97A" ls={-0.05} style={abs(80, 185)}>3</Mask>
            <div style={{position: 'absolute', right: 90, top: 250, transform: `scale(${lerp(0.5, 1, spr(f, T(60), 12, 190, 0.6))})`, opacity: cl(spr(f, T(60), 12, 190, 0.6) * 2)}}>
              <Globe s={0.62} rot={(t - A[6]) * 40} />
            </div>
            <Mask at={T(61) - 0.1} size={84} style={abs(80, 540)}>RENTA VARIABLE</Mask>
            <Mask at={T(63) - 0.1} size={84} color={P.mute} style={abs(80, 632)}>GLOBAL</Mask>
            <Card style={{...abs(90, 790, 900), padding: '34px 40px'}}>
              <svg width={W2} height={H2 + 30} viewBox={`0 -10 ${W2} ${H2 + 30}`}>
                <path d={path} fill="none" stroke="rgba(10,15,31,0.12)" strokeWidth={10} />
                <path d={path} fill="none" stroke="#B3A369" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
              </svg>
              <div style={{...txt(36, 700, 'rgba(10,15,31,0.6)', 0.06), marginTop: 6}}>EL VALOR PUEDE SUBIR O BAJAR</div>
            </Card>
            <div style={{...center(1230), opacity: cl(stamp * 3), transform: `scale(${lerp(2.4, 1, stamp)}) rotate(-6deg)`}}>
              <div style={{...txt(80, 800, P.white, 0.02), background: P.coral, padding: '14px 44px', borderRadius: 22, boxShadow: '0 24px 50px rgba(0,0,0,0.5)'}}>NO ES GARANTÍA</div>
            </div>
          </>
        );
      }}
    </Scene>
  );
};

const S8: React.FC = () => {
  const dias = ['L', 'M', 'M', 'J', 'V'];
  return (
    <Scene a={A[7]} b={A[8]} kind="left" out="up">
      {(lt, f) => {
        const t = f / FPS;
        const hz = easeIO(prog(t, T(74), T(77) + 0.2));
        const sweep = prog(t, T(78) - 0.05, T(83) + 0.1);
        const h24 = spr(f, T(88) - 0.05, 8, 230, 0.6);
        return (
          <>
            <Mask at={T(76) - 0.1} size={140} color="#C9B97A" style={center(290)}>LARGO PLAZO</Mask>
            <div style={{position: 'absolute', left: 110, top: 500, width: 860, height: 40}}>
              <div style={{position: 'absolute', left: 0, right: 0, top: 14, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.2)'}} />
              <div style={{position: 'absolute', left: 0, top: 14, height: 10, borderRadius: 5, width: `${hz * 100}%`, background: 'linear-gradient(90deg, #B3A369, #C9B97A)'}} />
              <div style={{position: 'absolute', left: `calc(${hz * 100}% - 20px)`, top: -2, width: 40, height: 40, borderRadius: 99, background: '#C9B97A', border: '7px solid #fff', boxSizing: 'border-box'}} />
            </div>
            <div style={{position: 'absolute', left: 80, top: 640, display: 'flex', gap: 22}}>
              {dias.map((d, k) => {
                const p = spr(f, T(78) + k * 0.08, 12, 220, 0.6);
                const on = sweep * 6 > k + 0.4;
                return (
                  <div key={k} style={{width: 160, height: 230, borderRadius: 34, background: on ? P.mint : 'rgba(255,255,255,0.1)', border: on ? 'none' : '3px dashed rgba(255,255,255,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, transform: `translateY(${(1 - p) * 80}px) scale(${on ? 1 : 0.95})`, opacity: cl(p * 2)}}>
                    <div style={{...txt(78, 800, on ? P.ink : P.mute, 0)}}>{d}</div>
                    {on && <div style={{...txt(34, 800, P.ink, 0)}}>✓</div>}
                  </div>
                );
              })}
            </div>
            <Mask at={T(81) - 0.1} size={64} color={P.mute} ls={0.1} style={abs(80, 900)}>CUALQUIER DÍA HÁBIL</Mask>
            <div style={{...center(960), top: 970, transform: `scale(${lerp(0.5, 1, h24)})`, opacity: cl(h24 * 2)}}>
              <div style={{...txt(330, 800, '#C9B97A', -0.04)}}>24<span style={{fontSize: 120, color: P.white, marginLeft: 20}}>H</span></div>
            </div>
            <Rise at={T(86) - 0.1} style={center(1190)}>
              <Chip size={32}>LIQUIDACIÓN</Chip>
            </Rise>
          </>
        );
      }}
    </Scene>
  );
};

const S9: React.FC = () => (
  <Scene a={A[8]} b={ROBO_VOZ + 0.2} kind="up" out="none">
    {(lt, f) => {
      const send = spr(f, T(90) + 0.5, 10, 220, 0.6);
      const dots = Math.floor(f / 6) % 4;
      return (
        <>
          <Rise at={A[8] + 0.05} dy={140} style={abs(90, 300, 900)}>
            <Card style={{padding: '44px 54px', borderRadius: 54}}>
              <div style={{...txt(34, 700, 'rgba(10,15,31,0.5)', 0.14)}}>MENSAJE A TU BANQUERO</div>
              <div style={{...txt(88, 800, P.ink, -0.02), marginTop: 18}}>Escríbeme</div>
              <div style={{...txt(52, 500, 'rgba(10,15,31,0.66)', 0), marginTop: 10, whiteSpace: 'normal'}}>y lo revisamos juntos</div>
            </Card>
          </Rise>
          <div style={{position: 'absolute', right: 90, top: 760, opacity: cl(send * 2), transform: `scale(${lerp(0.6, 1, send)})`}}>
            <div style={{background: '#C9B97A', color: P.ink, borderRadius: '44px 44px 8px 44px', padding: '26px 44px', ...txt(54, 700, P.ink, 0)}}>Quiero ver ROBOTIK</div>
          </div>
          <div style={{...abs(90, 960), opacity: cl(send * 2)}}>
            <div style={{background: 'rgba(255,255,255,0.14)', borderRadius: '44px 44px 44px 8px', padding: '22px 40px', ...txt(54, 800, P.white, 0.2)}}>{'●'.repeat(dots + 1)}</div>
          </div>
        </>
      );
    }}
  </Scene>
);

const LEGAL =
  'El contenido es únicamente informativo, no constituye recomendación, consejo o sugerencia personalizada de algún producto y/o servicio que le sugieran la toma de decisiones de inversión, para lo que se necesita previamente verificar la congruencia entre el perfil del cliente y el perfil del producto financiero. Rendimientos pasados no garantizan rendimientos futuros. El valor de las acciones de Fondos de Inversión conlleva un riesgo de mercado incluyendo una posible minusvalía del capital invertido. Los fondos de inversión no están garantizados por Grupo Financiero Actinver S.A. de C.V, o por alguna entidad integrante del Grupo Financiero Actinver, ni por ninguna entidad gubernamental, ni por el IPAB y pueden tener minusvalías del capital invertido. Todos los Fondos de Actinver cuentan con Prospecto de Información al Público Inversionista y Documentos con Información Clave, los cuales se encuentran a su disposición en www.actinver.com/fondos.';
const End: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const a = ROBO_VOZ + 0.05;
  if (t < a) return null;
  const p = easeIO((t - a) / 0.35);
  return (
    <AbsoluteFill style={{opacity: p, background: 'linear-gradient(170deg,#041E42,#020A1A)'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 230, display: 'flex', justifyContent: 'center'}}>
        <Img src={staticFile('logo_blanco.png')} style={{height: 96}} />
      </div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 400, ...txt(50, 600, '#C9B97A', 0), whiteSpace: 'normal', textAlign: 'center', lineHeight: 1.25}}>
        Consulta términos y condiciones de los productos en actinver.com
      </div>
      <div style={{position: 'absolute', left: 80, right: 80, top: 640, fontFamily: FONT, fontWeight: 400, fontSize: 31, lineHeight: 1.38, color: 'rgba(255,255,255,0.86)', textAlign: 'justify'}}>{LEGAL}</div>
    </AbsoluteFill>
  );
};

const MOOD_AT = [
  {at: 0, mood: 'actinver'},
  {at: A[1], mood: 'steel'},
  {at: A[2], mood: 'actinver'},
  {at: A[4], mood: 'steel'},
  {at: A[6], mood: 'actinver'},
  {at: A[7], mood: 'steel'},
  {at: A[8], mood: 'actinver'},
];
const PASOS = [
  {at: A[4], label: '1 DE 3'},
  {at: A[5], label: '2 DE 3'},
  {at: A[6], label: '3 DE 3'},
  {at: A[7], label: ''},
];

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const p = spr(f, A[7] + 0.6, 12, 200, 0.6);
  if (t < A[7] + 0.6 || t > ROBO_VOZ) return null;
  return (
    <div style={{position: 'absolute', right: 70, top: 166, transform: `translateX(${(1 - p) * 200}px)`, opacity: cl(p * 2)}}>
      <Chip bg={P.white} color={P.ink} size={26}>＋ SÍGUEME</Chip>
    </div>
  );
};

export const RobotikMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <Brand value={ACTINVER}>
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
      <Frame serie="DATO ACTINVER" total={ROBO_TOTAL} pasos={PASOS} nota="Contenido informativo, no es recomendación de inversión. Fuente: IFR, World Robotics 2026; Actinver. El valor puede subir o bajar; no es garantía." />
      <Cta />
      <Captions groups={groups} keys={KEYS} />
      <End />
      {audio && <Audio src={staticFile('robotik/voz_mix.wav')} />}
    </AbsoluteFill>
  </Brand>
);

export const RobotikCover: React.FC = () => (
  <Brand value={ACTINVER}>
    <AbsoluteFill style={{background: P.ink}}>
      <Backdrop moods={[{at: 0, mood: 'actinver'}]} />
      <div style={{...center(220), ...txt(70, 600, P.mute, 0.3)}}>MÁS DE</div>
      <div style={{...center(285), ...txt(330, 800, '#C9B97A', -0.05)}}>600</div>
      <div style={{...center(620), ...txt(150)}}>MIL ROBOTS</div>
      <div style={center(705)}><Arm a={-24} b={34} s={0.68} /></div>
      <div style={{...center(1250), ...txt(130, 800, '#C9B97A', -0.02)}}>ROBOTIK</div>
      <Frame serie="DATO ACTINVER" total={1} nota="" />
      <Grain />
    </AbsoluteFill>
  </Brand>
);

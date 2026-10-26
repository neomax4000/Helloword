import React from 'react';
import {AbsoluteFill, Audio, Img, random, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/banca/words.json';
import shotsRaw from '../public/banca/shots.json';
import {FONT, FPS, W} from './theme';
import {F, cl, ease, lerp, sp} from './narrador';

/* Paleta de marca Actinver */
export const NAVY = '#041E42';
export const NAVY2 = '#0A2D5E';
export const OCRE = '#B3A369';
export const WARM = '#F5F3EE';
export const GRAY = '#555759';
export const RED = '#D9534F';
export const OK = '#4CB38A';

type Word = {i: number; w: string; s: number; e: number};
const words = data.words as Word[];
const TS: Record<number, number> = {};
words.forEach((x) => (TS[x.i] = x.s));
const T = (i: number) => {
  for (let k = i; k < i + 5; k++) if (TS[k] !== undefined) return TS[k];
  return 0;
};
type Shot = {w: number; k: string; bg: number; a: number; b: number};
const shots: Shot[] = (shotsRaw as {w: number; k: string; bg: number}[]).map((s, i, arr) => ({
  ...s,
  a: i === 0 ? 0 : T(s.w) - 0.08,
  b: i < arr.length - 1 ? T(arr[i + 1].w) - 0.08 : data.total + 1,
}));
const CUTZ = [5, 12, 16, 26, 28, 38, 45, 49, 58, 66, 72, 75, 82, 87, 92, 96, 98, 103, 113, 116];
const FRAMES = [
  {z: 1, x: 0, y: 0, r: 0},
  {z: 1.08, x: 20, y: -30, r: -0.6},
  {z: 1.04, x: 10, y: 15, r: 0.5},
  {z: 1.11, x: 30, y: -10, r: 0},
];
const pop = (f: number, d: number, s = 1) => `scale(${sp(f, d) * s})`;

/* ---------------- fondos de marca, cambian cada 2–3 escenas ---------------- */
export const THEMES = [
  {bg: `radial-gradient(1100px 1100px at 50% 35%, ${NAVY2}, #020B1A 75%)`, pat: 'grid', light: false},
  {bg: `linear-gradient(160deg, #0E3A78, ${NAVY} 70%)`, pat: 'lines', light: false},
  {bg: `radial-gradient(1100px 1100px at 50% 35%, #FFFFFF, #E9E6DD 80%)`, pat: 'dots', light: true},
  {bg: `radial-gradient(1100px 1100px at 50% 35%, #2B3F5C, #0D1A2E 75%)`, pat: 'grid', light: false},
  {bg: `linear-gradient(160deg, ${GRAY}, #23262A 80%)`, pat: 'lines', light: false},
  {bg: `radial-gradient(1100px 1100px at 50% 40%, #12407F, ${NAVY} 70%)`, pat: 'spot', light: false},
];
export const ThemeBg: React.FC<{n: number; f: number}> = ({n, f}) => {
  const t = THEMES[n];
  const ink = t.light ? 'rgba(4,30,66,0.07)' : 'rgba(255,255,255,0.06)';
  let img = '';
  let size: string | undefined;
  if (t.pat === 'grid') {
    img = `linear-gradient(${ink} 2px, transparent 2px), linear-gradient(90deg, ${ink} 2px, transparent 2px)`;
    size = '90px 90px';
  } else if (t.pat === 'lines') {
    img = `repeating-linear-gradient(135deg, ${ink} 0 2px, transparent 2px 46px)`;
  } else if (t.pat === 'dots') {
    img = `radial-gradient(${ink} 6px, transparent 7px)`;
    size = '64px 64px';
  }
  const off = (f * 1.1) % 90;
  return (
    <AbsoluteFill style={{background: t.bg}}>
      {img && <AbsoluteFill style={{backgroundImage: img, backgroundSize: size, backgroundPosition: `${off}px ${off}px`}} />}
      {/* círculos grandes como en el estilo original */}
      <div style={{position: 'absolute', width: 900, height: 900, borderRadius: '50%', right: -420 + Math.sin(f / 80) * 30, top: -260, background: t.light ? 'rgba(4,30,66,0.05)' : 'rgba(255,255,255,0.05)'}} />
      <div style={{position: 'absolute', width: 700, height: 700, borderRadius: '50%', left: -380, bottom: 120 + Math.cos(f / 90) * 30, background: t.light ? 'rgba(179,163,105,0.10)' : 'rgba(179,163,105,0.07)'}} />
      {t.pat === 'spot' && <AbsoluteFill style={{background: 'radial-gradient(700px 700px at 50% 40%, rgba(179,163,105,0.22), transparent 70%)'}} />}
      {/* línea vertical delgada, acento del folleto 2025 */}
      <div style={{position: 'absolute', left: 64, top: 300, width: 3, height: 260, background: t.light ? NAVY : WARM, opacity: 0.5}} />
    </AbsoluteFill>
  );
};
const Background: React.FC<{f: number; t: number}> = ({f, t}) => {
  const idx = Math.max(0, shots.findIndex((s) => t >= s.a && t < s.b));
  const cur = shots[idx];
  let start = cur.a;
  for (let i = idx; i >= 0 && shots[i].bg === cur.bg; i--) start = shots[i].a;
  const prev = idx > 0 ? shots.slice(0, idx).reverse().find((s) => s.bg !== cur.bg)?.bg : undefined;
  const p = ease(((t - start) * FPS) / 12);
  return (
    <AbsoluteFill>
      {prev !== undefined && p < 1 && <ThemeBg n={prev} f={f} />}
      <AbsoluteFill style={{clipPath: `circle(${p * 160}% at 50% 40%)`}}>
        <ThemeBg n={cur.bg} f={f} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const isLight = (k: string) => THEMES[shots.find((s) => s.k === k)?.bg ?? 0].light;

/* ---------------- piezas ---------------- */
export const Title: React.FC<{light: string; bold: string; f: number; d?: number; dark?: boolean; size?: number}> = ({light, bold, f, d = 0, dark, size = 88}) => {
  const k = sp(f, d, 12, 180);
  const c = dark ? NAVY : WARM;
  return (
    <div style={{position: 'absolute', left: 96, right: 60, top: 300, fontFamily: FONT, fontSize: size, lineHeight: 1.05, color: c, transform: `translateY(${(1 - k) * 40}px)`, opacity: cl(k * 1.6)}}>
      <span style={{fontWeight: 300}}>{light} </span>
      <span style={{fontWeight: 700}}>{bold}</span>
    </div>
  );
};

const Phone: React.FC<{children: React.ReactNode; x?: number; y?: number; s?: number; rot?: number}> = ({children, x = 540, y = 880, s = 1, rot = 0}) => (
  <div style={{position: 'absolute', left: x - 230 * s, top: y - 430 * s, width: 460, height: 860, transform: `scale(${s}) rotate(${rot}deg)`, transformOrigin: '0 0', borderRadius: 58, background: '#111722', padding: 12, boxSizing: 'border-box', boxShadow: '0 40px 80px rgba(0,0,0,0.45), inset 0 0 0 2px rgba(255,255,255,0.12)'}}>
    <div style={{position: 'relative', width: 436, height: 836, borderRadius: 48, overflow: 'hidden', background: '#0A1018'}}>
      {children}
      <div style={{position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 110, height: 28, borderRadius: 16, background: '#000'}} />
    </div>
  </div>
);
const Login: React.FC<{dim?: number}> = ({dim = 0}) => (
  <>
    <Img src={staticFile('login.jpg')} style={{width: 436, height: 782, objectFit: 'cover', position: 'absolute', top: 0}} />
    <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${dim})`}} />
  </>
);

export const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={W} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    {children}
  </svg>
);
const Lock: React.FC<{close: number; c?: string}> = ({close, c = OCRE}) => (
  <g>
    <path d={`M-90 ${-30 - (1 - close) * 70} L-90 -110 A90 90 0 0 1 90 -110 L90 ${-30 - (1 - close) * 0}`} stroke={WARM} strokeWidth={34} fill="none" strokeLinecap="round" transform={`translate(${(1 - close) * 60} ${-(1 - close) * 50})`} />
    <rect x={-150} y={-40} width={300} height={240} rx={40} fill={c} stroke={NAVY} strokeWidth={8} />
    <circle cy={60} r={26} fill={NAVY} />
    <rect x={-10} y={60} width={20} height={60} rx={8} fill={NAVY} />
  </g>
);
const Agent: React.FC = () => (
  <g>
    <circle r={110} fill={OCRE} stroke={WARM} strokeWidth={8} />
    <circle cy={-28} r={34} fill={NAVY} />
    <path d="M-62 62 C-62 18 -30 6 0 6 C30 6 62 18 62 62Z" fill={NAVY} />
    <path d="M-50 -30 A50 50 0 0 1 50 -30" stroke={NAVY} strokeWidth={10} fill="none" />
    <rect x={-60} y={-38} width={18} height={34} rx={8} fill={NAVY} />
    <rect x={42} y={-38} width={18} height={34} rx={8} fill={NAVY} />
  </g>
);
const PhoneIcon: React.FC<{c?: string}> = ({c = NAVY}) => (
  <path d="M-30 -45 C-45 -45 -52 -30 -48 -12 C-38 25 -10 50 22 58 C38 62 52 54 50 40 L46 24 C44 16 36 14 30 18 L18 26 C2 18 -12 4 -20 -12 L-12 -24 C-8 -30 -10 -38 -18 -40Z" fill={c} />
);
export const Pill: React.FC<{text: string; c?: string; tc?: string; size?: number}> = ({text, c = OCRE, tc = NAVY, size = 48}) => {
  const w = text.length * size * 0.64 + 70;
  return (
    <g>
      <rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.7} rx={size * 0.85} fill={c} />
      <text textAnchor="middle" y={size * 0.33} fontFamily={FONT} fontWeight={700} fontSize={size} fill={tc} letterSpacing={2}>
        {text}
      </text>
    </g>
  );
};

/* ---------------- escenas ---------------- */
type SP = {f: number; at: (i: number) => number; d: number};

const Hook: React.FC<SP> = ({f, at}) => {
  const k = sp(f, 2, 11, 170);
  return (
    <AbsoluteFill>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 96, top: 150, width: 300, opacity: ease(f / 10)}} />
      <div style={{position: 'absolute', left: 96, top: 520, fontFamily: FONT, fontWeight: 600, fontSize: 36, letterSpacing: 10, color: OCRE, opacity: ease(f / 10)}}>DATO ACTINVER</div>
      <div style={{position: 'absolute', left: 96, top: 580, fontFamily: FONT, fontSize: 150, lineHeight: 1, color: WARM, transform: `translateX(${(1 - k) * -80}px)`, opacity: cl(k * 1.5)}}>
        <div style={{fontWeight: 300}}>¿SABÍAS</div>
        <div style={{fontWeight: 700}}>
          QUE<span style={{color: OCRE}}>…?</span>
        </div>
      </div>
      <svg width={W} height={1920} style={{position: 'absolute'}}>
        <g transform={`translate(860 1100) rotate(${Math.sin(f / 7) * 8}) ${pop(f, at(5), 1)}`}>
          <circle r={120} fill="none" stroke={OCRE} strokeWidth={10} />
          <text textAnchor="middle" y={58} fontFamily={FONT} fontWeight={700} fontSize={170} fill={OCRE}>?</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const PhoneErr: React.FC<SP> = ({f, at}) => {
  const err = f >= at(15);
  const sh = err ? Math.sin(f * 1.8) * 10 * Math.exp(-(f - at(15)) / 14) : 0;
  return (
    <AbsoluteFill>
      <Title light="TU BANCA" bold="ELECTRÓNICA" f={f} size={72} />
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${sh}px)`}}>
        <Phone y={1050} s={0.95}>
          <Login dim={err ? 0.45 : 0} />
        </Phone>
      </div>
      {err && (
        <div style={{position: 'absolute', left: 140, right: 140, top: 1020, transform: pop(f, at(15)), background: WARM, borderRadius: 26, padding: '26px 30px', display: 'flex', alignItems: 'center', gap: 22, boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}>
          <div style={{width: 64, height: 64, borderRadius: 32, background: RED, color: '#fff', fontFamily: FONT, fontWeight: 700, fontSize: 46, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>!</div>
          <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 46, color: NAVY}}>No funciona</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const LockS: React.FC<SP> = ({f, at}) => {
  const close = ease((f - at(21) + 4) / 8);
  const tries = [25, 26, 28];
  return (
    <AbsoluteFill>
      <Title light="SE" bold="BLOQUEÓ" f={f} size={96} />
      <Svg>
        <g transform={`translate(540 860) scale(${1.4 * sp(f, 0)}) rotate(${close > 0.95 ? Math.sin(f * 1.5) * 3 * Math.exp(-(f - at(21) - 4) / 10) : 0})`}>
          <Lock close={close} />
        </g>
        {tries.map((id, i) => (
          <g key={id} transform={`translate(${300 + i * 240} 1240) ${pop(f, at(id), 1)}`}>
            <circle r={70} fill={WARM} stroke={RED} strokeWidth={10} />
            <path d="M-28 -28 L28 28 M28 -28 L-28 28" stroke={RED} strokeWidth={14} strokeLinecap="round" />
          </g>
        ))}
      </Svg>
      {f >= at(23) && (
        <div style={{position: 'absolute', top: 1340, width: W, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 40, letterSpacing: 6, color: OCRE, opacity: ease((f - at(23)) / 8)}}>INTENTOS ERRÓNEOS</div>
      )}
    </AbsoluteFill>
  );
};

const REASONS = [
  {id: 22, t: 'Exceso de intentos erróneos', icon: 'lock'},
  {id: 33, t: 'Olvidaste tu NIP', icon: 'dots'},
  {id: 38, t: 'Olvidaste tu contraseña', icon: 'key'},
  {id: 45, t: 'No te deja vender fondos ni transferir', icon: 'swap'},
];
const ReasonIcon: React.FC<{k: string}> = ({k}) => (
  <svg width={70} height={70} viewBox="-35 -35 70 70">
    {k === 'lock' && (<><rect x={-16} y={-4} width={32} height={26} rx={6} fill={WARM} /><path d="M-10 -4 L-10 -12 A10 10 0 0 1 10 -12 L10 -4" stroke={WARM} strokeWidth={5} fill="none" /></>)}
    {k === 'dots' && [-14, -5, 4, 13].map((x) => <circle key={x} cx={x} cy={0} r={4} fill={WARM} />)}
    {k === 'key' && (<><circle cx={-10} cy={0} r={10} fill="none" stroke={WARM} strokeWidth={5} /><path d="M0 0 L20 0 M14 0 L14 8" stroke={WARM} strokeWidth={5} /></>)}
    {k === 'swap' && <path d="M-18 -8 L14 -8 M8 -15 L15 -8 L8 -1 M18 8 L-14 8 M-8 1 L-15 8 L-8 15" stroke={WARM} strokeWidth={4} fill="none" strokeLinecap="round" />}
  </svg>
);
const Reasons: React.FC<SP & {upto: number}> = ({f, at, upto}) => (
  <AbsoluteFill>
    <div style={{position: 'absolute', left: 96, top: 300, fontFamily: FONT, fontWeight: 600, fontSize: 36, letterSpacing: 8, color: OCRE}}>PUEDE SER PORQUE</div>
    <div style={{position: 'absolute', left: 80, right: 80, top: 400, display: 'flex', flexDirection: 'column', gap: 30}}>
      {REASONS.slice(0, upto).map((r, i) => {
        const appear = r.id <= 22 ? 0 : at(r.id) - 6;
        const k = sp(f, appear, 12, 170);
        const blocked = r.icon === 'swap' && f >= at(47);
        return (
          <div key={r.id} style={{display: 'flex', alignItems: 'center', gap: 28, padding: '30px 34px', borderRadius: 28, background: 'rgba(4,30,66,0.72)', border: `2px solid ${i === upto - 1 ? OCRE : 'rgba(245,243,238,0.18)'}`, transform: `translateX(${(1 - k) * 300}px)`, opacity: cl(k * 1.5) * (i === upto - 1 ? 1 : 0.55)}}>
            <div style={{width: 90, height: 90, borderRadius: 24, background: blocked ? RED : NAVY2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
              <ReasonIcon k={r.icon} />
            </div>
            <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 46, lineHeight: 1.2, color: WARM}}>{r.t}</div>
          </div>
        );
      })}
    </div>
  </AbsoluteFill>
);

const DIGITS = '8007055555';
const Call: React.FC<SP> = ({f, at}) => {
  const a = at(52);
  const b = at(54) + F(1.6);
  const n = f < a ? 0 : Math.min(10, 1 + Math.floor(((f - a) / Math.max(1, b - a)) * 10));
  const shown = DIGITS.slice(0, n);
  const fmt = shown.replace(/^(\d{1,3})(\d{0,3})(\d{0,4}).*/, (_, x, y, z) => [x, y, z].filter(Boolean).join(' '));
  const pressed = n > 0 ? DIGITS[n - 1] : '';
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
  const lastPress = a + ((n - 1) * (b - a)) / 10;
  return (
    <AbsoluteFill>
      <Title light="LLAMA" bold="AL" f={f} dark size={96} />
      <div style={{position: 'absolute', left: 96, top: 420, fontFamily: FONT, fontWeight: 700, fontSize: 110, color: NAVY, letterSpacing: 2}}>
        {fmt || ' '}
        <span style={{opacity: Math.floor(f / 12) % 2 ? 1 : 0, color: OCRE}}>|</span>
      </div>
      <div style={{position: 'absolute', left: 190, top: 640, display: 'grid', gridTemplateColumns: 'repeat(3, 200px)', gap: 30}}>
        {keys.map((k) => {
          const on = k === pressed && f - lastPress < 6;
          return (
            <div key={k} style={{width: 200, height: 150, borderRadius: 40, background: on ? NAVY : 'rgba(4,30,66,0.07)', color: on ? WARM : NAVY, fontFamily: FONT, fontWeight: 600, fontSize: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: on ? 'scale(0.94)' : 'none'}}>
              {k}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Option: React.FC<SP> = ({f, at}) => {
  const sel = f >= at(59) - 2;
  const opts = ['Información general', 'Soy cliente', 'Otros servicios'];
  return (
    <AbsoluteFill>
      <Title light="ELIGE LA" bold="OPCIÓN" f={f} dark size={96} />
      <div style={{position: 'absolute', left: 80, right: 80, top: 520, display: 'flex', flexDirection: 'column', gap: 30}}>
        {opts.map((o, i) => {
          const k = sp(f, 4 + i * 4);
          const on = sel && i === 1;
          return (
            <div key={o} style={{display: 'flex', alignItems: 'center', gap: 30, padding: '34px 36px', borderRadius: 30, background: on ? NAVY : 'rgba(4,30,66,0.06)', border: `3px solid ${on ? OCRE : 'rgba(4,30,66,0.12)'}`, transform: `translateY(${(1 - k) * 40}px) scale(${on ? 1.05 : 1})`, opacity: cl(k * 1.5) * (sel && !on ? 0.4 : 1)}}>
              <div style={{width: 80, height: 80, borderRadius: 40, background: on ? OCRE : NAVY, color: on ? NAVY : WARM, fontFamily: FONT, fontWeight: 700, fontSize: 44, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
              <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 52, color: on ? WARM : NAVY}}>{o}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 96, right: 96, top: 1150, fontFamily: FONT, fontWeight: 400, fontSize: 30, color: GRAY, opacity: 0.8}}>Ilustrativo: el orden del menú puede variar.</div>
    </AbsoluteFill>
  );
};

const Boxes: React.FC<{n: number; filled: number; label: string; k: number}> = ({n, filled, label, k}) => (
  <div style={{padding: '30px 34px', borderRadius: 30, background: 'rgba(4,30,66,0.75)', border: '2px solid rgba(245,243,238,0.2)', transform: `translateY(${(1 - k) * 40}px)`, opacity: cl(k * 1.5)}}>
    <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 40, color: WARM, marginBottom: 24}}>{label}</div>
    <div style={{display: 'flex', gap: 18}}>
      {Array.from({length: n}, (_, i) => (
        <div key={i} style={{width: 92, height: 92, borderRadius: 20, background: i < filled ? WARM : 'transparent', border: `3px solid ${i < filled ? OCRE : 'rgba(245,243,238,0.35)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          {i < filled && <div style={{width: 22, height: 22, borderRadius: 11, background: NAVY}} />}
        </div>
      ))}
    </div>
  </div>
);
const Conmutador: React.FC<SP> = ({f, at}) => {
  const c1 = Math.min(7, Math.max(0, Math.floor((f - at(66)) / 4)));
  const c2 = Math.min(4, Math.max(0, Math.floor((f - at(72)) / 5)));
  return (
    <AbsoluteFill>
      <Title light="EL CONMUTADOR" bold="TE PIDE" f={f} size={70} />
      <div style={{position: 'absolute', left: 80, right: 80, top: 520, display: 'flex', flexDirection: 'column', gap: 40}}>
        <Boxes n={7} filled={c1} label="Tu número de cliente" k={sp(f, at(66) - 6)} />
        <Boxes n={4} filled={c2} label="Últimos 4 dígitos de tu celular registrado" k={sp(f, at(70) - 6)} />
      </div>
    </AbsoluteFill>
  );
};

const Sms: React.FC<SP> = ({f, at}) => {
  const drop = sp(f, at(80) - 4, 13, 150);
  const typed = Math.min(6, Math.max(0, Math.floor((f - at(84)) / 5)));
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  return (
    <AbsoluteFill>
      <Title light="TE LLEGA UN" bold="CÓDIGO POR SMS" f={f} size={76} />
      <div style={{position: 'absolute', left: 100, right: 100, top: 480, transform: `translateY(${(1 - drop) * -300}px)`, opacity: cl(drop * 2), background: WARM, borderRadius: 30, padding: '28px 32px', boxShadow: '0 20px 50px rgba(0,0,0,0.4)'}}>
        <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 30, color: GRAY}}>MENSAJES · ahora</div>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 44, color: NAVY, marginTop: 8}}>Tu código de verificación</div>
        <div style={{display: 'flex', gap: 16, marginTop: 18}}>
          {Array.from({length: 6}, (_, i) => (
            <div key={i} style={{width: 34, height: 34, borderRadius: 17, background: i < typed ? NAVY : 'rgba(4,30,66,0.2)'}} />
          ))}
        </div>
      </div>
      {f >= at(84) - 4 && (
        <div style={{position: 'absolute', left: 230, top: 840, display: 'grid', gridTemplateColumns: 'repeat(3, 180px)', gap: 26, transform: pop(f, at(84) - 4), transformOrigin: '310px 200px'}}>
          {keys.map((k, i) => {
            const on = typed > 0 && (typed * 4) % 9 === i && (f - at(84)) % 5 < 3;
            return (
              <div key={k} style={{width: 180, height: 130, borderRadius: 34, background: on ? OCRE : 'rgba(245,243,238,0.1)', color: on ? NAVY : WARM, fontFamily: FONT, fontWeight: 600, fontSize: 60, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{k}</div>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};

const Connect: React.FC<SP> = ({f, at}) => {
  const ok = sp(f, at(92) - 2, 9, 220);
  const line = ease((f - at(94)) / 18);
  return (
    <AbsoluteFill>
      <Title light="SI TODO ESTÁ" bold="CORRECTO" f={f} size={84} />
      <Svg>
        <g transform={`translate(270 980) scale(${sp(f, 0)})`}>
          <circle r={110} fill={WARM} />
          <g transform="scale(1.6)"><PhoneIcon /></g>
        </g>
        <line x1={390} x2={lerp(390, 690, line)} y1={980} y2={980} stroke={OCRE} strokeWidth={10} strokeDasharray="26 18" strokeDashoffset={-f * 3} />
        <g transform={`translate(810 980) scale(${sp(f, at(96) - 4)})`}>
          <Agent />
        </g>
        {f >= at(92) - 2 && (
          <g transform={`translate(890 880) scale(${ok})`}>
            <circle r={44} fill={OK} stroke={WARM} strokeWidth={6} />
            <path d="M-18 2 L-5 15 L20 -12" stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
      </Svg>
      {f >= at(98) - 4 && (
        <div style={{position: 'absolute', left: 96, right: 96, top: 1180, fontFamily: FONT, fontSize: 52, lineHeight: 1.2, color: WARM, opacity: ease((f - at(98) + 4) / 10)}}>
          Con <span style={{color: OCRE, fontWeight: 700}}>personal Actinver especializado</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

const Help: React.FC<SP> = ({f, at}) => {
  const open = ease((f - at(103)) / 12);
  return (
    <AbsoluteFill>
      <Title light="RESUELVE" bold="TU PROBLEMA" f={f} size={84} />
      <Svg>
        <g transform={`translate(400 900) scale(1.2) rotate(${-open * 8})`}>
          <Lock close={1 - open} c={open > 0.5 ? OK : OCRE} />
        </g>
        <g transform={`translate(800 760) scale(${0.8 * sp(f, 2)})`}>
          <Agent />
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

const Listo: React.FC<SP> = ({f, at}) => {
  const k = sp(f, 0, 9, 200);
  const conf = React.useMemo(() => Array.from({length: 40}, (_, i) => ({x: random('cx' + i) * W, v: 6 + random('cv' + i) * 10, r: random('cr' + i) * 360, c: random('cc' + i) > 0.5 ? OCRE : WARM, d: random('cd' + i) * 20})), []);
  return (
    <AbsoluteFill>
      {conf.map((c, i) => {
        const y = -60 + (f - c.d) * c.v;
        return f > c.d ? <div key={i} style={{position: 'absolute', left: c.x, top: y, width: 22, height: 12, borderRadius: 3, background: c.c, transform: `rotate(${c.r + f * 8}deg)`, opacity: 0.85}} /> : null;
      })}
      <div style={{position: 'absolute', left: 96, top: 300, fontFamily: FONT, fontWeight: 700, fontSize: 150, color: WARM, transform: `scale(${0.6 + 0.4 * k})`, transformOrigin: 'left center', opacity: cl(k * 2)}}>
        ¡Y LISTO!
      </div>
      <Phone x={540} y={1000} s={0.72} rot={-4}>
        <Login />
      </Phone>
      {f >= at(108) - 4 && (
        <div style={{position: 'absolute', left: 96, right: 96, top: 520, fontFamily: FONT, fontSize: 50, lineHeight: 1.25, color: WARM, opacity: ease((f - at(108) + 4) / 10)}}>
          Ya sabes un dato que <span style={{color: OCRE, fontWeight: 700}}>no conocías</span> de tu cuenta Actinver.
        </div>
      )}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 150, textAlign: 'center', opacity: ease((f - 20) / 12)}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 56, color: WARM, letterSpacing: 2}}>800 705 5555</div>
        <div style={{fontFamily: FONT, fontWeight: 500, fontSize: 32, color: OCRE, marginTop: 6}}>opción «Soy cliente»</div>
        <Img src={staticFile('logo_blanco.png')} style={{width: 260, marginTop: 40}} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- subtítulos ---------------- */
type G = {ws: Word[]; a: number; b: number};
const groups: G[] = (() => {
  const gs: G[] = [];
  let cur: Word[] = [];
  let len = 0;
  words.forEach((w, idx) => {
    cur.push(w);
    len += w.w.length + 1;
    const next = words[idx + 1];
    const brk = /[,.?!:»]$/.test(w.w) || cur.length >= 4 || len > 18 || !next || next.s - w.e > 0.6;
    if (brk) {
      gs.push({ws: cur, a: cur[0].s - 0.06, b: 0});
      cur = [];
      len = 0;
    }
  });
  gs.forEach((g, i) => {
    const last = g.ws[g.ws.length - 1];
    g.b = gs[i + 1] ? Math.min(gs[i + 1].a, last.e + 0.5) : last.e + 0.8;
  });
  return gs;
})();
const KEYS = new Set([5, 8, 11, 12, 16, 21, 26, 28, 33, 38, 46, 49, 52, 53, 54, 59, 60, 62, 66, 68, 72, 75, 80, 82, 87, 92, 97, 98, 103, 105, 107, 110, 113]);

const Captions: React.FC<{t: number; f: number}> = ({t, f}) => {
  const g = groups.find((x) => t >= x.a && t < x.b);
  if (!g) return null;
  const k = sp(f, F(g.a), 12, 260);
  let active = -1;
  g.ws.forEach((w) => {
    if (t >= w.s - 0.03) active = w.i;
  });
  if (t > g.ws[g.ws.length - 1].e + 0.1) active = -1;
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: 1480, display: 'flex', justifyContent: 'center', transform: `scale(${0.85 + 0.15 * k})`, opacity: cl(k * 2)}}>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 16px', background: 'rgba(4,30,66,0.9)', borderRadius: 30, padding: '16px 28px', border: '1.5px solid rgba(179,163,105,0.35)'}}>
        {g.ws.map((w) => {
          const on = w.i === active;
          const key = KEYS.has(w.i);
          return (
            <span key={w.i} style={{fontFamily: FONT, fontWeight: 700, fontSize: 74, lineHeight: 1.15, color: on ? NAVY : key ? OCRE : WARM, background: on ? OCRE : 'transparent', borderRadius: 14, padding: '0 10px', display: 'inline-block', transform: on ? 'scale(1.05)' : 'none'}}>
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------- composición ---------------- */
export const Banca: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const shot = shots.find((s) => t >= s.a && t < s.b) || shots[shots.length - 1];
  const sf = F(shot.a);
  const lf = f - sf;
  const at = (i: number) => F(T(i)) - sf;
  const sd = F(shot.b - shot.a);
  const p: SP = {f: lf, at, d: sd};

  let fi = 0;
  let lastCut = sf;
  CUTZ.forEach((ci, n) => {
    const cf = F(T(ci)) - 2;
    if (cf > sf && cf <= f) {
      fi = (n % 3) + 1;
      lastCut = cf;
    }
  });
  const fr = FRAMES[fi];
  const punch = 0.08 * Math.exp(-(f - Math.max(sf, lastCut)) / 4);
  const drift = 1 + 0.025 * cl(lf / Math.max(1, sd));
  const camera = `translate(${fr.x}px, ${fr.y}px) rotate(${fr.r}deg) scale(${(fr.z + punch) * drift})`;

  let body: React.ReactNode = null;
  switch (shot.k) {
    case 'hook': body = <Hook {...p} />; break;
    case 'phoneerr': body = <PhoneErr {...p} />; break;
    case 'lock': body = <LockS {...p} />; break;
    case 'nip': body = <Reasons {...p} upto={f >= sf + at(36) - 6 ? 3 : 2} />; break;
    case 'transfer': body = <Reasons {...p} upto={4} />; break;
    case 'call': body = <Call {...p} />; break;
    case 'option': body = <Option {...p} />; break;
    case 'conmutador': body = <Conmutador {...p} />; break;
    case 'sms': body = <Sms {...p} />; break;
    case 'connect': body = <Connect {...p} />; break;
    case 'help': body = <Help {...p} />; break;
    case 'listo': body = <Listo {...p} />; break;
  }
  const flash = lf < 3 && shot.w !== 0 ? 0.3 * (1 - lf / 3) : 0;
  const light = isLight(shot.k);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Background f={f} t={t} />
      <AbsoluteFill style={{transform: camera, transformOrigin: '380px 860px'}}>{body}</AbsoluteFill>
      {shot.k !== 'hook' && shot.k !== 'listo' && <Img src={staticFile(light ? 'logo_azul.png' : 'logo_blanco.png')} style={{position: 'absolute', right: 60, top: 70, width: 210}} />}
      {shot.k !== 'listo' && <Captions t={t} f={f} />}
      <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: W * cl(t / data.total), background: OCRE}} />
      {flash > 0 && <AbsoluteFill style={{background: '#fff', opacity: flash}} />}
      <Audio src={staticFile('banca/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

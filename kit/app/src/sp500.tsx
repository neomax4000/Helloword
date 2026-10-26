import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/sp500/words.json';
import shotsRaw from '../public/sp500/shots.json';
import {FONT, FPS, W} from './theme';
import {F, cl, ease, lerp, sp} from './narrador';
import {GRAY, NAVY, NAVY2, OCRE, OK, RED, THEMES, ThemeBg, Title, WARM} from './banca';

type Word = {i: number; w: string; s: number; e: number};
const words = data.words as Word[];
const TS: Record<number, number> = {};
words.forEach((x) => (TS[x.i] = x.s));
const T = (i: number) => {
  for (let k = i; k < i + 5; k++) if (TS[k] !== undefined) return TS[k];
  return 0;
};
export const SP_TOTAL = data.total + 3.5;
type Shot = {w: number; k: string; bg: number; a: number; b: number};
const shots: Shot[] = (shotsRaw as {w: number; k: string; bg: number}[]).map((s, i, arr) => ({
  ...s,
  a: i === 0 ? 0 : T(s.w) - 0.08,
  b: i < arr.length - 1 ? T(arr[i + 1].w) - 0.08 : SP_TOTAL + 1,
}));
const CUTZ = [12, 17, 25, 31, 40, 49, 59, 61, 64, 67, 81, 86, 91, 97, 109, 111, 118, 130, 135, 139, 154, 163, 176, 186, 193, 199, 202, 210, 216, 218];
const FRAMES = [
  {z: 1, x: 0, y: 0, r: 0},
  {z: 1.08, x: 20, y: -30, r: -0.6},
  {z: 1.04, x: 10, y: 15, r: 0.5},
  {z: 1.11, x: 30, y: -10, r: 0},
];
const pop = (f: number, d: number, s = 1) => `scale(${sp(f, d) * s})`;

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

/* ---------------- piezas ---------------- */
const Big: React.FC<{children: React.ReactNode; f: number; d: number; c?: string; size?: number; top: number; left?: number}> = ({children, f, d, c = OCRE, size = 200, top, left = 96}) => {
  const k = sp(f, d, 9, 200);
  return f < d - 2 ? null : (
    <div style={{position: 'absolute', left, top, fontFamily: FONT, fontWeight: 700, fontSize: size, lineHeight: 1, color: c, transform: `scale(${0.5 + 0.5 * k})`, transformOrigin: 'left center', opacity: cl(k * 1.6)}}>{children}</div>
  );
};
const Note: React.FC<{text: string; f: number; d?: number; top?: number; dark?: boolean}> = ({text, f, d = 0, top = 1330, dark}) => (
  <div style={{position: 'absolute', left: 96, right: 96, top, fontFamily: FONT, fontWeight: 600, fontSize: 38, letterSpacing: 2, color: dark ? GRAY : OCRE, opacity: ease((f - d) / 10)}}>{text}</div>
);
const Counter: React.FC<{f: number; from: number; to: number; d: number; dur?: number; dec?: number; pre?: string; suf?: string}> = ({f, from, to, d, dur = 24, dec = 0, pre = '', suf = '%'}) => {
  const v = lerp(from, to, ease((f - d) / dur));
  return (
    <>
      {pre}
      {v.toFixed(dec)}
      {suf}
    </>
  );
};

/* línea de precio animada (path con progreso) */
const LineChart: React.FC<{pts: number[]; p: number; color: string; w?: number; h?: number; x?: number; y?: number; fill?: boolean}> = ({pts, p, color, w = 880, h = 560, x = 100, y = 520, fill = true}) => {
  const n = pts.length;
  const mx = Math.max(...pts);
  const mn = Math.min(...pts);
  const P = pts.map((v, i) => [x + (i / (n - 1)) * w, y + h - ((v - mn) / (mx - mn || 1)) * h]);
  const upto = Math.max(1, Math.floor(p * (n - 1)));
  const frac = p * (n - 1) - upto + 1;
  const vis = P.slice(0, upto + 1).map((q, i) => (i === upto && upto < n - 1 ? [lerp(P[upto - 1 + 0][0], q[0], cl(frac)), lerp(P[upto - 1 + 0][1], q[1], cl(frac))] : q));
  const d = vis.map((q, i) => `${i ? 'L' : 'M'}${q[0]} ${q[1]}`).join(' ');
  const last = vis[vis.length - 1];
  return (
    <svg width={W} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
      {fill && <path d={`${d} L${last[0]} ${y + h} L${x} ${y + h}Z`} fill={color} opacity={0.15} />}
      <path d={d} stroke={color} strokeWidth={10} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r={16} fill={color} stroke={WARM} strokeWidth={5} />
    </svg>
  );
};

/* ---------------- escenas ---------------- */
type SP = {f: number; at: (i: number) => number; d: number};

const Hook: React.FC<SP> = ({f, at}) => {
  const k = sp(f, 2, 11, 170);
  return (
    <AbsoluteFill>
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 96, top: 150, width: 300, opacity: ease(f / 10)}} />
      <div style={{position: 'absolute', left: 96, top: 420, fontFamily: FONT, fontWeight: 600, fontSize: 36, letterSpacing: 10, color: OCRE}}>DATO ACTINVER</div>
      <div style={{position: 'absolute', left: 96, top: 480, fontFamily: FONT, fontSize: 130, lineHeight: 1, color: WARM, opacity: cl(k * 1.5), transform: `translateX(${(1 - k) * -80}px)`}}>
        <div style={{fontWeight: 300}}>¿SABÍAS</div>
        <div style={{fontWeight: 700}}>QUE…?</div>
      </div>
      <Big f={f} d={at(5) - 2} top={860} size={230}>
        S&amp;P 500
      </Big>
    </AbsoluteFill>
  );
};

const Grid500: React.FC<SP & {mode: 'equal' | 'unequal'}> = ({f, at, mode}) => {
  const cols = 20;
  const cell = 34;
  const ox = 200;
  const oy = 540;
  const fillN = mode === 'equal' ? Math.min(500, Math.floor(ease((f - at(12) + 4) / 30) * 500)) : 500;
  const morph = mode === 'unequal' ? ease((f - at(23)) / 24) : 0;
  return (
    <AbsoluteFill>
      {mode === 'equal' ? <Title light="LAS 500 EMPRESAS" bold="MÁS GRANDES" f={f} size={72} /> : <Title light="NO ES" bold="EQUITATIVO" f={f} size={84} />}
      <svg width={W} height={1920} style={{position: 'absolute'}}>
        {Array.from({length: 500}, (_, i) => {
          const cx = ox + (i % cols) * cell + cell / 2;
          const cy = oy + Math.floor(i / cols) * cell + cell / 2;
          const big = i < 5;
          const r = lerp(14, big ? 70 - i * 8 : 4 + (i < 40 ? 6 : 0), morph);
          return i < fillN ? <circle key={i} cx={big ? lerp(cx, 260 + i * 140, morph) : cx} cy={big ? lerp(cy, 640, morph) : cy} r={r} fill={big && morph > 0.3 ? OCRE : WARM} opacity={big ? 1 : 0.75} /> : null;
        })}
      </svg>
      {mode === 'equal' && <Note text="ESTADOS UNIDOS" f={f} d={at(17)} top={1410} />}
      {mode === 'unequal' && f >= at(31) && <Note text="NO TODAS VALEN LO MISMO" f={f} d={at(31)} top={1410} />}
    </AbsoluteFill>
  );
};

const Pie: React.FC<SP> = ({f, at}) => {
  const p = ease((f - at(47)) / 22) * 0.3;
  const a = p * Math.PI * 2;
  const R = 330;
  const cx = 540;
  const cy = 860;
  const x = cx + Math.sin(a) * R;
  const y = cy - Math.cos(a) * R;
  return (
    <AbsoluteFill>
      <Title light="EL TOP 5 DEL" bold="S&P 500" f={f} size={84} />
      <svg width={W} height={1920} style={{position: 'absolute'}}>
        <circle cx={cx} cy={cy} r={R} fill="rgba(245,243,238,0.12)" stroke="rgba(245,243,238,0.25)" strokeWidth={4} />
        {p > 0.001 && <path d={`M${cx} ${cy} L${cx} ${cy - R} A${R} ${R} 0 ${a > Math.PI ? 1 : 0} 1 ${x} ${y}Z`} fill={OCRE} transform={`translate(${Math.sin(a / 2) * 24} ${-Math.cos(a / 2) * 24})`} />}
      </svg>
      <Big f={f} d={at(49)} top={1230} size={110} c={WARM}>
        ≈ <Counter f={f} from={0} to={30} d={at(49)} /> <span style={{fontWeight: 300, fontSize: 56}}>del índice</span>
      </Big>
    </AbsoluteFill>
  );
};

const NAMES = [
  {id: 59, n: 'NVIDIA', w: 7.5},
  {id: 60, n: 'APPLE', w: 6.6},
  {id: 61, n: 'MICROSOFT', w: 4.3},
  {id: 62, n: 'ALPHABET (GOOGLE)', w: 5.8},
  {id: 64, n: 'AMAZON', w: 3.6},
];
const Top5: React.FC<SP> = ({f, at}) => (
  <AbsoluteFill>
    <Title light="CINCO EMPRESAS," bold="CASI 30%" f={f} size={62} />
    <div style={{position: 'absolute', left: 80, right: 80, top: 470, display: 'flex', flexDirection: 'column', gap: 22}}>
      {NAMES.map((c) => {
        const k = sp(f, at(c.id) - 4, 12, 170);
        return (
          <div key={c.n} style={{display: 'flex', alignItems: 'center', gap: 24, transform: `translateX(${(1 - k) * 400}px)`, opacity: cl(k * 1.5)}}>
            <div style={{width: 340, fontFamily: FONT, fontWeight: 700, fontSize: 40, color: WARM}}>{c.n}</div>
            <div style={{flex: 1, height: 70, borderRadius: 16, background: 'rgba(245,243,238,0.1)', overflow: 'hidden'}}>
              <div style={{width: `${(c.w / 8) * 100 * k}%`, height: '100%', borderRadius: 16, background: `linear-gradient(90deg, ${OCRE}, #D8C88F)`}} />
            </div>
          </div>
        );
      })}
    </div>
    <Note text="Peso aproximado en el índice, junio 2026" f={f} d={at(64)} top={1170} />
  </AbsoluteFill>
);

const Hist: React.FC<SP> = ({f, at}) => {
  const pts = Array.from({length: 40}, (_, i) => Math.exp(i * 0.1) * (1 + 0.08 * Math.sin(i * 1.7)) - (i === 13 || i === 29 ? 3 : 0));
  return (
    <AbsoluteFill>
      <Title light="RENDIMIENTO" bold="HISTÓRICO" f={f} dark size={84} />
      <LineChart pts={pts} p={ease(f / 50)} color={NAVY} y={560} h={520} />
      <Big f={f} d={at(81)} top={1150} size={150} c={NAVY}>
        ≈<Counter f={f} from={0} to={10.2} d={at(81)} dec={1} /> <span style={{fontWeight: 300, fontSize: 60}}>anual</span>
      </Big>
      <Note text="CON DIVIDENDOS REINVERTIDOS" f={f} d={at(84)} top={1330} dark />
    </AbsoluteFill>
  );
};

const Share80: React.FC<SP> = ({f, at}) => {
  const p = ease((f - at(91) + 4) / 26) * 0.8;
  return (
    <AbsoluteFill>
      <Title light="DEL MERCADO" bold="DE EE. UU." f={f} dark size={70} />
      <div style={{position: 'absolute', left: 96, right: 96, top: 560, height: 520, borderRadius: 40, background: 'rgba(4,30,66,0.08)', overflow: 'hidden', border: `3px solid ${NAVY}`}}>
        <div style={{position: 'absolute', left: 0, bottom: 0, width: '100%', height: `${p * 100}%`, background: `linear-gradient(180deg, ${NAVY2}, ${NAVY})`}} />
        <div style={{position: 'absolute', left: 40, bottom: 30, fontFamily: FONT, fontWeight: 700, fontSize: 44, color: WARM, opacity: p > 0.3 ? 1 : 0}}>S&amp;P 500</div>
        <div style={{position: 'absolute', right: 40, top: 26, fontFamily: FONT, fontWeight: 500, fontSize: 36, color: NAVY}}>Resto del mercado</div>
      </div>
      <Big f={f} d={at(91)} top={1150} size={160} c={NAVY}>
        ≈<Counter f={f} from={0} to={80} d={at(91)} />
      </Big>
    </AbsoluteFill>
  );
};

const Crash: React.FC<SP> = ({f, at}) => {
  const pts = [100, 92, 70, 78, 55, 48, 52, 38, 30, 26, 20, 14];
  const p = ease((f - at(108)) / 50);
  return (
    <AbsoluteFill>
      <Title light="LA CAÍDA" bold="MÁS GRANDE" f={f} size={70} />
      <Big f={f} d={at(109) - 2} top={420} size={80} c={WARM}>
        1929 <span style={{fontWeight: 300}}>→</span> 1932
      </Big>
      <LineChart pts={pts} p={p} color={RED} y={600} h={480} />
      <Big f={f} d={at(118) - 4} top={1150} size={190} c={RED}>
        −<Counter f={f} from={0} to={86} d={at(118) - 4} suf="%" />
      </Big>
      <Note text="CAÍDA ACUMULADA APROXIMADA" f={f} d={at(118)} top={1345} />
    </AbsoluteFill>
  );
};

const CalDay: React.FC<{f: number; d: number; day: string; mon: string; yr: string; c: string}> = ({f, d, day, mon, yr, c}) => {
  const k = sp(f, d, 10, 170);
  return (
    <div style={{position: 'absolute', left: 96, top: 480, width: 400, borderRadius: 34, overflow: 'hidden', background: WARM, transform: `rotate(${-4 * k}deg) scale(${0.6 + 0.4 * k})`, opacity: cl(k * 1.5), boxShadow: '0 30px 60px rgba(0,0,0,0.4)'}}>
      <div style={{background: c, color: WARM, fontFamily: FONT, fontWeight: 700, fontSize: 52, textAlign: 'center', padding: '16px 0'}}>{mon}</div>
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 200, lineHeight: 1.1, textAlign: 'center', color: NAVY}}>{day}</div>
      <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 52, textAlign: 'center', color: GRAY, paddingBottom: 18}}>{yr}</div>
    </div>
  );
};
const Monday: React.FC<SP> = ({f, at}) => {
  const drop = ease((f - at(137)) / 10);
  return (
    <AbsoluteFill>
      <Title light="LUNES" bold="NEGRO" f={f} size={96} />
      <CalDay f={f} d={at(131) - 4} day="19" mon="OCT" yr="1987" c={RED} />
      <svg width={W} height={1920} style={{position: 'absolute'}}>
        <g transform={`translate(780 ${650 + drop * 300})`} opacity={drop}>
          <path d="M0 -150 L0 120 M-70 50 L0 120 L70 50" stroke={RED} strokeWidth={30} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
      <Big f={f} d={at(139) - 3} top={1130} size={180} c={RED}>
        −<Counter f={f} from={0} to={20.47} d={at(139) - 3} dec={2} />
      </Big>
      <Note text="EN UN SOLO DÍA" f={f} d={at(142)} top={1330} />
    </AbsoluteFill>
  );
};
const BestDay: React.FC<SP> = ({f, at}) => {
  const up = ease((f - at(158)) / 12);
  return (
    <AbsoluteFill>
      <Title light="EL DÍA CON" bold="MAYOR ALZA" f={f} size={70} />
      <CalDay f={f} d={at(154) - 4} day="13" mon="OCT" yr="2008" c={OK} />
      <svg width={W} height={1920} style={{position: 'absolute'}}>
        <g transform={`translate(780 ${950 - up * 300})`} opacity={up}>
          <path d="M0 150 L0 -120 M-70 -50 L0 -120 L70 -50" stroke={OK} strokeWidth={30} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
      <Big f={f} d={at(163) - 3} top={1130} size={180} c={OK}>
        +<Counter f={f} from={0} to={11.58} d={at(163) - 3} dec={2} />
      </Big>
      <Note text="EN UN SOLO DÍA" f={f} d={at(165)} top={1330} />
    </AbsoluteFill>
  );
};

const Since2009: React.FC<SP> = ({f, at}) => {
  const vals = [100, 126, 145, 148, 172, 227, 258, 261, 292, 356, 339, 446, 527, 679, 556, 701, 876, 1031, 1167];
  const p = ease((f - at(172)) / 70);
  return (
    <AbsoluteFill>
      <Title light="SI HUBIERAS INVERTIDO" bold="EN 2009" f={f} size={58} />
      <LineChart pts={vals} p={p} color={OCRE} y={520} h={560} />
      <div style={{position: 'absolute', left: 100, top: 1100, fontFamily: FONT, fontSize: 34, color: WARM, opacity: 0.7}}>2009</div>
      <div style={{position: 'absolute', right: 100, top: 1100, fontFamily: FONT, fontSize: 34, color: WARM, opacity: 0.7}}>HOY</div>
      <Big f={f} d={at(186) - 3} top={1170} size={150} c={OCRE}>
        +<Counter f={f} from={0} to={700} d={at(186) - 3} />
      </Big>
      {f >= at(193) - 3 && (
        <div style={{position: 'absolute', right: 96, top: 1195, textAlign: 'right', fontFamily: FONT, color: WARM, transform: pop(f, at(193) - 3), transformOrigin: 'right center'}}>
          <div style={{fontWeight: 700, fontSize: 84}}>≈13%</div>
          <div style={{fontWeight: 300, fontSize: 44}}>anual</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const Fund: React.FC<SP> = ({f, at}) => {
  const k = sp(f, 2, 12, 160);
  return (
    <AbsoluteFill>
      <Title light="FONDO" bold="ACTI500" f={f} size={96} />
      <div style={{position: 'absolute', left: 80, right: 80, top: 480, borderRadius: 36, padding: '50px 50px', background: 'rgba(4,30,66,0.82)', border: `2px solid ${OCRE}`, transform: `translateY(${(1 - k) * 60}px)`, opacity: cl(k * 1.5)}}>
        <Img src={staticFile('logo_blanco.png')} style={{width: 260}} />
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 92, color: WARM, marginTop: 40}}>ACTI500</div>
        <div style={{fontFamily: FONT, fontWeight: 400, fontSize: 40, color: WARM, opacity: 0.85, marginTop: 6}}>Renta variable especializada global · USD</div>
        <div style={{height: 3, background: 'rgba(245,243,238,0.2)', margin: '36px 0'}} />
        <div style={{display: 'flex', alignItems: 'center', gap: 26, opacity: ease((f - at(203)) / 10)}}>
          <div style={{width: 84, height: 84, borderRadius: 42, background: OCRE, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width={50} height={50} viewBox="-25 -25 50 50"><path d="M-15 0 L15 0 M8 -8 L15 0 L8 8" stroke={NAVY} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 48, color: WARM}}>
            Replica el <span style={{color: OCRE}}>S&amp;P 500</span>
          </div>
        </div>
      </div>
      <Note text="Consulta términos y condiciones de los productos en actinver.com" f={f} d={20} top={1220} />
    </AbsoluteFill>
  );
};

const LEGAL =
  'El contenido es únicamente informativo, no constituye recomendación, consejo o sugerencia personalizada de algún producto y/o servicio que le sugieran la toma de decisiones de inversión, para lo que se necesita previamente verificar la congruencia entre el perfil del cliente y el perfil del producto financiero. Rendimientos pasados no garantizan rendimientos futuros. El valor de las acciones de Fondos de Inversión conlleva un riesgo de mercado incluyendo una posible minusvalía del capital invertido. Los fondos de inversión no están garantizados por Grupo Financiero Actinver S.A. de C.V, o por alguna entidad integrante del Grupo Financiero Actinver, ni por ninguna entidad gubernamental, ni por el IPAB y pueden tener minusvalías del capital invertido. Todos los Fondos de Actinver cuentan con Prospecto de Información al Público Inversionista y Documentos con Información Clave, los cuales se encuentran a su disposición en www.actinver.com/fondos.';

const End: React.FC<SP> = ({f, at}) => {
  const k = sp(f, 0, 10, 180);
  const legalAt = F(words[words.length - 1].e + 0.3) - (F(T(214)) - at(214));
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 96, top: 300, fontFamily: FONT, fontSize: 110, lineHeight: 1.02, color: WARM, transform: `scale(${0.7 + 0.3 * k})`, transformOrigin: 'left top', opacity: cl(k * 2)}}>
        <div style={{fontWeight: 300}}>¿YA CONOCÍAS</div>
        <div style={{fontWeight: 700}}>
          ESTE <span style={{color: OCRE}}>ÍNDICE?</span>
        </div>
      </div>
      {[0, 1, 2].map((i) => {
        const kk = sp(f, at(218) + i * 6);
        return (
          <div key={i} style={{position: 'absolute', left: 96 + (i % 2) * 260, top: 640 + i * 130, width: 520, height: 100, borderRadius: 30, background: i === 1 ? OCRE : 'rgba(245,243,238,0.14)', transform: `scale(${kk})`, transformOrigin: 'left center', display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px', boxSizing: 'border-box'}}>
            <div style={{width: 50, height: 50, borderRadius: 25, background: i === 1 ? NAVY : OCRE}} />
            <div style={{flex: 1, height: 16, borderRadius: 8, background: i === 1 ? 'rgba(4,30,66,0.5)' : 'rgba(245,243,238,0.4)'}} />
          </div>
        );
      })}
      <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', left: 96, top: 1080, width: 260, opacity: ease((f - 10) / 10)}} />
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 90, fontFamily: FONT, fontWeight: 400, fontSize: 19, lineHeight: 1.35, color: 'rgba(245,243,238,0.78)', opacity: ease((f - legalAt) / 12)}}>
        <div style={{fontWeight: 600, fontSize: 22, color: WARM, marginBottom: 8}}>Rendimientos pasados no garantizan rendimientos futuros. Cifras históricas aproximadas del índice S&amp;P 500 en dólares. Consulta términos y condiciones de los productos en actinver.com</div>
        {LEGAL}
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
const KEYS = new Set([5, 8, 12, 15, 18, 25, 32, 40, 43, 46, 49, 59, 60, 61, 62, 64, 67, 81, 86, 91, 97, 100, 109, 111, 118, 129, 130, 135, 139, 150, 158, 163, 176, 186, 193, 199, 202, 210, 213, 217, 221]);

const Captions: React.FC<{t: number; f: number; dark: boolean}> = ({t, f}) => {
  const g = groups.find((x) => t >= x.a && t < x.b);
  if (!g) return null;
  const k = sp(f, F(g.a), 12, 260);
  let active = -1;
  g.ws.forEach((w) => {
    if (t >= w.s - 0.03) active = w.i;
  });
  if (t > g.ws[g.ws.length - 1].e + 0.1) active = -1;
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: 1500, display: 'flex', justifyContent: 'center', transform: `scale(${0.85 + 0.15 * k})`, opacity: cl(k * 2)}}>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 16px', background: 'rgba(4,30,66,0.9)', borderRadius: 30, padding: '16px 28px', border: '1.5px solid rgba(179,163,105,0.35)'}}>
        {g.ws.map((w) => {
          const on = w.i === active;
          const key = KEYS.has(w.i);
          return (
            <span key={w.i} style={{fontFamily: FONT, fontWeight: 700, fontSize: 72, lineHeight: 1.15, color: on ? NAVY : key ? OCRE : WARM, background: on ? OCRE : 'transparent', borderRadius: 14, padding: '0 10px', display: 'inline-block', transform: on ? 'scale(1.05)' : 'none'}}>
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------- composición ---------------- */
export const Sp500: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const shot = shots.find((s) => t >= s.a && t < s.b) || shots[shots.length - 1];
  const sf = F(shot.a);
  const lf = f - sf;
  const at = (i: number) => (i >= 220 && TS[i] === undefined ? F(T(221)) - sf : F(T(i)) - sf);
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
  const fr = shot.k === 'end' ? FRAMES[0] : FRAMES[fi];
  const punch = shot.k === 'end' ? 0 : 0.08 * Math.exp(-(f - Math.max(sf, lastCut)) / 4);
  const drift = shot.k === 'end' ? 1 : 1 + 0.025 * cl(lf / Math.max(1, sd));
  const camera = `translate(${fr.x}px, ${fr.y}px) rotate(${fr.r}deg) scale(${(fr.z + punch) * drift})`;

  const MAP: Record<string, React.ReactNode> = {
    hook: <Hook {...p} />,
    grid: <Grid500 {...p} mode="equal" />,
    unequal: <Grid500 {...p} mode="unequal" />,
    pie: <Pie {...p} />,
    top5: <Top5 {...p} />,
    hist: <Hist {...p} />,
    share80: <Share80 {...p} />,
    crash: <Crash {...p} />,
    monday: <Monday {...p} />,
    best: <BestDay {...p} />,
    since: <Since2009 {...p} />,
    fund: <Fund {...p} />,
    end: <End {...p} />,
  };
  const flash = lf < 3 && shot.w !== 0 ? 0.3 * (1 - lf / 3) : 0;
  const light = THEMES[shot.bg].light;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Background f={f} t={t} />
      <AbsoluteFill style={{transform: camera, transformOrigin: '380px 860px'}}>{MAP[shot.k]}</AbsoluteFill>
      {shot.k !== 'hook' && shot.k !== 'end' && shot.k !== 'fund' && <Img src={staticFile(light ? 'logo_azul.png' : 'logo_blanco.png')} style={{position: 'absolute', right: 60, top: 70, width: 210}} />}
      {t < words[words.length - 1].e + 0.3 && <Captions t={t} f={f} dark={light} />}
      <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: W * cl(t / SP_TOTAL), background: OCRE}} />
      {flash > 0 && <AbsoluteFill style={{background: '#fff', opacity: flash}} />}
      <Audio src={staticFile('sp500/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

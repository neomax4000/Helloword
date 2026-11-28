// ETF — T08 de la semana de pruebas (28 nov 2026)
// Variables a probar: apertura = pregunta ESCRITA (barra de búsqueda), la voz afirma · texto = medio (tarjetas de la app) ·
// estructura = mito vs realidad · fondo = pantalla de celular (app de mercado) con scroll · ~20 s · voz D.
// Todo es interfaz propia dibujada en Remotion: sin marcas reales, sin fotos.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/etf-celular/words.json';
import {Brand, Captions, FONT, FPS, Wd, buildGroups, cl, easeIO, easeOut, lerp, prog, spr} from './pro';

// «e te efe» se escribe ETF en los subtítulos (se fusionan las tres palabras)
const raw = data.words as Wd[];
const words: Wd[] = [];
for (let k = 0; k < raw.length; k++) {
  const a = raw[k];
  if (a.w.toLowerCase() === 'e' && raw[k + 1]?.w.toLowerCase() === 'te' && raw[k + 2]?.w.toLowerCase().startsWith('efe')) {
    words.push({...a, w: 'ETF', e: raw[k + 2].e});
    k += 2;
  } else words.push(a);
}
words.forEach((w, i) => (w.i = i));
const blocks = data.blocks as {s: number; e: number}[];
export const ETF_TOTAL = blocks[blocks.length - 1].e + 0.3;
const T = (i: number) => words[i].s;
const B = (k: number) => blocks[k];
const groups = buildGroups(words, blocks, 22, 4);
const KEYS = ['ETF', 'CANASTA', 'ACCIÓN', 'BOLSA', 'SUBIR', 'BAJAR', 'PIEZA', 'ACTIVOS'];

const BG = '#EDF0F8';
const INK = '#0E1530';
const BLUE = '#3D5AFE';
const RED = '#E5484D';
const GREEN = '#1FAD6B';
const MUTE = 'rgba(14,21,48,0.55)';
const APP = {accent: '#FFC247', accentDeep: '#E59A12', logo: false};
const SLOT = 880;
const FEED_Y = 420;
const CARD_H = 790;
const txt = (size: number, weight = 700, color = INK): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, lineHeight: 1.12});

/* ---------- gráfica ---------- */
const series = (n: number, seed: number, trend: number) => {
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(0.5 + trend * (i / n - 0.5) + 0.16 * Math.sin(i * 0.9 + seed) + 0.09 * Math.sin(i * 2.3 + seed * 2));
  return out;
};
const Chart: React.FC<{w: number; h: number; vals: number[]; p: number; color: string}> = ({w, h, vals, p, color}) => {
  const n = vals.length;
  const pts = vals.map((v, i) => [(i / (n - 1)) * w, h - cl(v) * h] as [number, number]);
  const upto = Math.max(1, Math.floor(p * (n - 1)));
  const part = pts.slice(0, upto + 1);
  const frac = p * (n - 1) - upto;
  if (upto < n - 1) part.push([lerp(pts[upto][0], pts[upto + 1][0], frac), lerp(pts[upto][1], pts[upto + 1][1], frac)]);
  const d = part.map((q, i) => `${i ? 'L' : 'M'}${q[0]},${q[1]}`).join(' ');
  const last = part[part.length - 1];
  return (
    <svg width={w} height={h + 20} style={{overflow: 'visible'}}>
      <path d={`${d} L${last[0]},${h} L0,${h} Z`} fill={color} opacity={0.12} />
      <path d={d} stroke={color} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r={11} fill={color} />
    </svg>
  );
};

/* ---------- tarjetas ---------- */
const Tag: React.FC<{c: string; children: React.ReactNode}> = ({c, children}) => (
  <div style={{display: 'inline-block', background: c, color: '#fff', fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: '0.12em', padding: '8px 22px', borderRadius: 999}}>{children}</div>
);
const CardBox: React.FC<{k: number; scroll: number; children: React.ReactNode}> = ({k, scroll, children}) => (
  <div style={{position: 'absolute', left: 60, right: 60, top: FEED_Y + k * SLOT - scroll, height: CARD_H, background: '#fff', borderRadius: 48, boxShadow: '0 24px 60px rgba(30,40,90,0.16)', padding: '44px 48px', boxSizing: 'border-box', overflow: 'hidden'}}>{children}</div>
);

const CardA: React.FC<{f: number; scroll: number; end: boolean}> = ({f, scroll, end}) => {
  const t = f / FPS;
  const p = lerp(0.55, 1, easeOut(prog(t, 0.1, 2.4)));
  const st = end ? 0 : spr(f, T(7) - 0.05, 9, 230, 0.6);
  return (
    <CardBox k={0} scroll={scroll}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={txt(76, 800)}>ETF</div>
        <Tag c={BLUE}>COTIZA EN BOLSA</Tag>
      </div>
      <div style={{...txt(34, 500, MUTE), marginTop: 8}}>precio en vivo · se mueve durante el día</div>
      <div style={{marginTop: 40}}>
        <Chart w={820} h={300} vals={series(40, 1.2, 0.5)} p={p} color={GREEN} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', transform: `rotate(-5deg) scale(${lerp(1.8, 1, st)})`, opacity: cl(st * 2)}}>
        <div style={{display: 'inline-block', border: `10px solid ${RED}`, color: RED, borderRadius: 24, padding: '10px 36px', ...txt(80, 800, RED), background: 'rgba(255,255,255,0.92)'}}>NO ES UNA ACCIÓN</div>
      </div>
    </CardBox>
  );
};

const TILES = [
  {l: 'A', c: '#3D5AFE'},
  {l: 'B', c: '#FF6B5E'},
  {l: 'C', c: '#1FAD6B'},
  {l: 'D', c: '#FFC247'},
  {l: 'E', c: '#B455FF'},
  {l: 'F', c: '#28AFCB'},
];
const CardB: React.FC<{f: number; scroll: number}> = ({f, scroll}) => (
  <CardBox k={1} scroll={scroll}>
    <Tag c={GREEN}>REALIDAD</Tag>
    <div style={{...txt(72, 800), marginTop: 22}}>Es una canasta</div>
    <div style={{...txt(36, 500, MUTE), marginTop: 6}}>y dentro lleva muchos activos</div>
    <div style={{position: 'relative', height: 430, marginTop: 24}}>
      {TILES.map((tl, i) => {
        const k = spr(f, T(16) - 0.15 + i * 0.16, 11, 190, 0.6);
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <div key={i} style={{position: 'absolute', left: 150 + col * 190, top: 118 + row * 74 - (1 - k) * 300, width: 150, height: 110, borderRadius: 26, background: tl.c, ...txt(64, 800, '#fff'), display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: cl(k * 3), boxShadow: '0 10px 0 rgba(0,0,0,0.12)'}}>{tl.l}</div>
        );
      })}
      {/* canasta */}
      <svg width={820} height={430} style={{position: 'absolute', left: 0, top: 0}}>
        <path d="M120,250 L700,250 L650,410 L170,410 Z" fill="#C98A4B" />
        <path d="M120,250 L700,250 L690,290 L130,290 Z" fill="#E0A465" />
        <path d="M230,250 C230,90 590,90 590,250" stroke="#8C5B2B" strokeWidth={16} fill="none" strokeLinecap="round" />
      </svg>
    </div>
  </CardBox>
);

const CardC: React.FC<{f: number; scroll: number}> = ({f, scroll}) => {
  const t = f / FPS;
  const pop = easeOut(prog(t, T(26) - 0.1, T(26) + 0.9));
  const cx = 410;
  const cy = 285;
  const slices = TILES.map((tl, i) => {
    const a0 = (i / 6) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / 6) * Math.PI * 2 - Math.PI / 2;
    const mid = (a0 + a1) / 2;
    const ox = Math.cos(mid) * 26 * pop;
    const oy = Math.sin(mid) * 26 * pop;
    const r = 175;
    const p0 = [cx + ox + Math.cos(a0) * r, cy + oy + Math.sin(a0) * r];
    const p1 = [cx + ox + Math.cos(a1) * r, cy + oy + Math.sin(a1) * r];
    return <path key={i} d={`M${cx + ox},${cy + oy} L${p0[0]},${p0[1]} A${r},${r} 0 0 1 ${p1[0]},${p1[1]} Z`} fill={tl.c} stroke="#fff" strokeWidth={6} />;
  });
  return (
    <CardBox k={2} scroll={scroll}>
      <Tag c={GREEN}>REALIDAD</Tag>
      <div style={{...txt(72, 800), marginTop: 22}}>1 pieza</div>
      <div style={{...txt(36, 500, MUTE), marginTop: 6}}>un pedacito de todos los activos</div>
      <svg width={820} height={520} style={{marginTop: 10}}>
        {slices}
        <circle cx={cx} cy={cy} r={72} fill="#fff" />
        <text x={cx} y={cy + 20} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={50} fill={INK}>ETF</text>
      </svg>
    </CardBox>
  );
};

const CardD: React.FC<{f: number; scroll: number}> = ({f, scroll}) => {
  const t = f / FPS;
  const p = easeOut(prog(t, T(31), T(40)));
  const press = (at: number) => spr(f, at, 10, 260, 0.5);
  const buy = press(T(32));
  const sell = press(T(35));
  return (
    <CardBox k={3} scroll={scroll}>
      <Tag c={BLUE}>EN BOLSA</Tag>
      <div style={{...txt(72, 800), marginTop: 22}}>Durante el día</div>
      <div style={{...txt(36, 500, MUTE), marginTop: 6}}>se compra y se vende, como una acción</div>
      <div style={{marginTop: 30}}>
        <Chart w={820} h={250} vals={series(40, 4.1, 0.3)} p={p} color={BLUE} />
      </div>
      <div style={{display: 'flex', gap: 30, marginTop: 40}}>
        <div style={{flex: 1, textAlign: 'center', padding: '26px 0', borderRadius: 28, background: GREEN, ...txt(52, 800, '#fff'), transform: `scale(${lerp(1, 0.92, cl(buy)) })`, boxShadow: buy > 0.4 ? `0 0 0 10px rgba(31,173,107,0.28)` : 'none'}}>COMPRAR</div>
        <div style={{flex: 1, textAlign: 'center', padding: '26px 0', borderRadius: 28, background: RED, ...txt(52, 800, '#fff'), transform: `scale(${lerp(1, 0.92, cl(sell))})`, boxShadow: sell > 0.4 ? `0 0 0 10px rgba(229,72,77,0.28)` : 'none'}}>VENDER</div>
      </div>
    </CardBox>
  );
};

const CardE: React.FC<{f: number; scroll: number}> = ({f, scroll}) => {
  const t = f / FPS;
  const p = easeOut(prog(t, T(44), T(54)));
  const up = spr(f, T(52), 10, 240, 0.5);
  const dn = spr(f, T(54) - 0.05, 10, 240, 0.5);
  return (
    <CardBox k={4} scroll={scroll}>
      <Tag c={RED}>OJO</Tag>
      <div style={{...txt(72, 800), marginTop: 22}}>Su valor puede</div>
      <div style={{...txt(72, 800)}}>subir o bajar</div>
      <div style={{marginTop: 20}}>
        <Chart w={820} h={290} vals={series(40, 7.5, -0.15)} p={p} color={RED} />
      </div>
      <div style={{position: 'absolute', right: 70, top: 170, ...txt(120, 800, GREEN), opacity: cl(up * 2) * (1 - cl(dn * 2)), transform: `scale(${lerp(0.5, 1, up)})`}}>▲</div>
      <div style={{position: 'absolute', right: 70, top: 170, ...txt(120, 800, RED), opacity: cl(dn * 2), transform: `scale(${lerp(0.5, 1, dn)})`}}>▼</div>
    </CardBox>
  );
};

/* ---------- barra de búsqueda y marco del celular ---------- */
const Top: React.FC<{f: number}> = ({f}) => {
  const t = f / FPS;
  const caret = Math.floor(t * 2.2) % 2 === 0;
  const follow = spr(f, B(5).s + 0.3, 12, 200, 0.7);
  return (
    <>
      <div style={{position: 'absolute', left: 60, right: 60, top: 176, height: 108, borderRadius: 54, background: '#fff', boxShadow: '0 16px 40px rgba(30,40,90,0.14)', display: 'flex', alignItems: 'center', padding: '0 38px', gap: 22}}>
        <svg width={46} height={46} viewBox="0 0 46 46">
          <circle cx={20} cy={20} r={13} stroke={INK} strokeWidth={5} fill="none" />
          <line x1={30} y1={30} x2={42} y2={42} stroke={INK} strokeWidth={5} strokeLinecap="round" />
        </svg>
        <div style={{...txt(46, 600), flex: 1, whiteSpace: 'nowrap'}}>
          ¿Un ETF es una acción?
          <span style={{display: 'inline-block', width: 4, height: 50, background: BLUE, marginLeft: 6, verticalAlign: 'middle', opacity: caret ? 1 : 0}} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 316, display: 'flex', gap: 16}}>
        {['Todo', 'Mitos', 'Acciones', 'ETF'].map((l, i) => (
          <div key={l} style={{...txt(32, 700, i === 1 ? '#fff' : MUTE), background: i === 1 ? INK : 'rgba(14,21,48,0.07)', padding: '10px 28px', borderRadius: 999}}>{l}</div>
        ))}
      </div>
      <div style={{position: 'absolute', right: 60, top: 316, transform: `scale(${lerp(0.6, 1, follow)})`, opacity: cl(follow * 2), transformOrigin: '100% 50%'}}>
        <div style={{...txt(32, 800, INK), background: '#FFC247', padding: '10px 28px', borderRadius: 999}}>＋ SÍGUEME</div>
      </div>
    </>
  );
};

const Toast: React.FC<{f: number}> = ({f}) => {
  const a = B(5).s + 0.9;
  const k = spr(f, a, 13, 190, 0.7);
  if (f / FPS < a) return null;
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 1175, transform: `translateY(${(1 - k) * -50}px)`, opacity: cl(k * 2)}}>
      <div style={{background: '#FFE27A', color: INK, borderRadius: 30, padding: '18px 30px', ...txt(38, 800), boxShadow: '0 12px 0 rgba(0,0,0,0.18)', textAlign: 'center'}}>¿QUÉ OTRO MITO QUIERES? ESCRÍBELO</div>
    </div>
  );
};

const Dock: React.FC = () => (
  <>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1255, bottom: 0, background: 'linear-gradient(180deg, #131B3A 0%, #070B1C 100%)', borderRadius: '64px 64px 0 0', boxShadow: '0 -20px 60px rgba(14,21,48,0.35)'}} />
    <div style={{position: 'absolute', left: 70, right: 200, top: 1532, ...txt(23, 400, 'rgba(255,255,255,0.55)'), lineHeight: 1.3}}>
      Contenido educativo, no es recomendación de inversión. El valor de un ETF puede subir o bajar; no es garantía de rendimiento. Fuente: BMV y CNBV.
    </div>
  </>
);

const Foot: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <>
      <div style={{position: 'absolute', left: 0, top: 0, height: 10, width: `${(t / ETF_TOTAL) * 100}%`, background: BLUE}} />
      <div style={{position: 'absolute', top: 96, left: 70, ...txt(30, 700, MUTE), letterSpacing: '0.2em'}}>● GLOSARIO FINANCIERO · ETF</div>
    </>
  );
};

/** posición del scroll: cada bloque lleva su tarjeta al lugar; el último regresa al inicio (bucle) */
const scrollAt = (t: number) => {
  const targets = [0, 1, 2, 3, 4, 0];
  let cur = 0;
  let prev = 0;
  let tt = 0;
  for (let k = 1; k < targets.length; k++) {
    const st = B(k).s - 0.1;
    if (t >= st) {
      prev = targets[k - 1];
      cur = targets[k];
      tt = st;
    }
  }
  if (tt === 0 && t < B(1).s - 0.1) return 0;
  const p = easeOut(prog(t, tt, tt + (cur === 0 ? 0.9 : 0.7)));
  return lerp(prev, cur, p) * SLOT;
};

const Screen: React.FC<{f: number; end?: boolean}> = ({f, end}) => {
  const t = f / FPS;
  const sc = end ? 0 : scrollAt(t);
  const atEnd = !end && t >= B(5).s - 0.1;
  return (
    <AbsoluteFill style={{background: BG}}>
      <AbsoluteFill style={{background: 'radial-gradient(1200px 900px at 20% 10%, #fff, transparent 70%)'}} />
      <CardA f={f} scroll={sc} end={atEnd || !!end} />
      <CardB f={f} scroll={sc} />
      <CardC f={f} scroll={sc} />
      <CardD f={f} scroll={sc} />
      <CardE f={f} scroll={sc} />
      {/* barra superior opaca para que las tarjetas se deslicen por debajo */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 392, background: `linear-gradient(180deg, ${BG} 0%, ${BG} 88%, rgba(237,240,248,0))`}} />
      <Top f={f} />
    </AbsoluteFill>
  );
};

const Live: React.FC = () => {
  const f = useCurrentFrame();
  return <Screen f={f} />;
};
const LiveToast: React.FC = () => {
  const f = useCurrentFrame();
  return <Toast f={f} />;
};

export const EtfCelularMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <Brand value={APP}>
    <AbsoluteFill style={{background: BG}}>
      <Live />
      <Dock />
      <LiveToast />
      <Captions groups={groups} keys={KEYS} y={1300} />
      <Foot />
      {audio && <Audio src={staticFile('etf-celular/voz_mix.wav')} />}
    </AbsoluteFill>
  </Brand>
);

export const EtfCelularCover: React.FC = () => (
  <Brand value={APP}>
    <AbsoluteFill style={{background: BG}}>
      <Screen f={75} end />
      <Dock />
      <div style={{position: 'absolute', left: 60, right: 60, top: 1290, textAlign: 'center', ...txt(86, 800, '#fff')}}>¿ETF = acción?</div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 1405, textAlign: 'center', ...txt(46, 600, '#FFC247')}}>MITO vs REALIDAD</div>
    </AbsoluteFill>
  </Brand>
);

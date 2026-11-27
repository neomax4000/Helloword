// PAGAR SOLO EL MÍNIMO — T05 de la semana de pruebas (27 nov 2026)
// Variables a probar: apertura = predicción «adivina, la respuesta al final» · texto = medio ·
// estructura = error común · fondo = thriller (grano, viñeta, escaneo, expediente) · ~40 s · voz 3.
import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/minimo-tarjeta/words.json';
import {Brand, Captions, Frame, FONT, FPS, Wd, buildGroups, cl, easeIO, lerp, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const MIN_TOTAL = blocks[blocks.length - 1].e + 0.3;
const B = (k: number) => blocks[k];
const groups = buildGroups(words, blocks, 15, 3);
const KEYS = ['MÍNIMO', 'INTERESES', 'ADIVINA', 'CARA', 'TRES', 'AÑOS', 'TOTAL', 'CUENTA'];
const THRILLER = {accent: '#FF4B4B', accentDeep: '#B31217', logo: false};
const RED = '#FF4B4B';
const GREEN = '#6DFF9A';
const PAPER = '#E8E2CF';
const MONO = '"Courier New", ui-monospace, monospace';

// Cuenta hipotética: 10,000 de deuda, interés de ejemplo 28 % anual, pago fijo de 415, sin compras nuevas
const RATE = 0.28 / 12;
const PAY = 415;
const bal: number[] = [10000];
const intCum: number[] = [0];
for (let m = 1; m <= 40 && bal[bal.length - 1] > 0; m++) {
  const prev = bal[m - 1];
  const interest = prev * RATE;
  const pay = Math.min(PAY, prev + interest);
  bal.push(Math.max(0, prev + interest - pay));
  intCum.push(intCum[m - 1] + interest);
}
const MONTHS = bal.length - 1; // 36
const mny = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

const mono = (size: number, color = PAPER, weight = 700, ls = 0.04): React.CSSProperties => ({fontFamily: MONO, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, whiteSpace: 'nowrap'});
const hv = (size: number, color = '#fff', weight = 800, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.04, whiteSpace: 'nowrap'});

/* ---------- fondo thriller ---------- */
const Noir: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const flick = 0.96 + 0.04 * Math.sin(f * 1.9) * Math.sin(f * 0.37);
  const scan = ((t * 260) % 2300) - 200;
  const j = (f % 3) * 120;
  return (
    <AbsoluteFill style={{background: '#04070A'}}>
      <AbsoluteFill style={{background: 'radial-gradient(900px 900px at 50% 38%, #0F2A22 0%, #060C0C 60%, #020405 100%)', opacity: flick}} />
      <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.0) 0px, rgba(0,0,0,0.0) 3px, rgba(0,0,0,0.28) 4px)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: scan, height: 220, background: 'linear-gradient(180deg, transparent, rgba(109,255,154,0.07) 60%, rgba(109,255,154,0.13) 90%, transparent)'}} />
      <AbsoluteFill style={{opacity: 0.2, mixBlendMode: 'overlay'}}>
        <Img src={staticFile('grain.png')} style={{position: 'absolute', width: 0, height: 0}} />
        <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '300px 300px', backgroundPosition: `${j}px ${j * 0.6}px`}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(1200px 1700px at 50% 45%, transparent 38%, rgba(0,0,0,0.88) 100%)'}} />
    </AbsoluteFill>
  );
};

const Fade: React.FC<{a: number; b: number; children: React.ReactNode}> = ({a, b, children}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  if (t < a - 0.01 || t > b + 0.2) return null;
  const pin = cl((t - a) / 0.14);
  const pout = cl((t - b) / 0.16);
  return <AbsoluteFill style={{opacity: pin * (1 - pout), transform: `scale(${lerp(1.04, 1, easeIO(pin))})`}}>{children}</AbsoluteFill>;
};

const Tag: React.FC<{children: React.ReactNode; color?: string; top?: number; at?: number}> = ({children, color = RED, top = 250, at = 0}) => {
  const f = useCurrentFrame();
  const p = spr(f, at, 14, 220, 0.6);
  return (
    <div style={{position: 'absolute', left: 70, top, opacity: cl(p * 2)}}>
      <div style={{...mono(34, color, 700, 0.18), border: `3px solid ${color}`, padding: '8px 22px', display: 'inline-block'}}>{children}</div>
    </div>
  );
};

/* ---------- escenas ---------- */
const Hook: React.FC<{final?: boolean; cover?: boolean}> = ({final, cover}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const blink = Math.floor(t * 2.6) % 2 === 0;
  const p = final ? 1 : spr(f, 0.05, 12, 200, 0.7);
  return (
    <AbsoluteFill>
      <Tag at={0.05}>EXPEDIENTE · TARJETA DE CRÉDITO</Tag>
      <div style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center', opacity: cl(p * 3), transform: `scale(${lerp(1.3, 1, p)})`}}>
        <div style={mono(44, 'rgba(232,226,207,0.7)', 700, 0.2)}>DEUDA</div>
        <div style={{...hv(210, '#fff', 800, -0.04), marginTop: 6}}>$10,000</div>
        <div style={{...mono(44, 'rgba(232,226,207,0.7)', 700, 0.2), marginTop: 40}}>PAGANDO SOLO EL MÍNIMO</div>
        <div style={{display: 'inline-flex', alignItems: 'baseline', gap: 26, marginTop: 40}}>
          <div style={{background: PAPER, color: '#04070A', ...hv(150, '#04070A', 800, 0.02), padding: '10px 36px', letterSpacing: '0.08em', fontFamily: MONO}}>██</div>
          <div style={hv(120, RED, 800, -0.01)}>MESES</div>
        </div>
        {(!final || cover) && <div style={{...hv(220, RED, 800), marginTop: -4, opacity: blink ? 1 : 0.15}}>?</div>}
      </div>
    </AbsoluteFill>
  );
};

const Stamp: React.FC = () => {
  const f = useCurrentFrame();
  const a = B(1).s;
  const p = spr(f, a + 0.1, 8, 260, 0.6);
  const t = f / FPS;
  const shake = t < a + 0.5 ? Math.sin(f * 3) * (1 - cl((t - a - 0.1) / 0.4)) * 8 : 0;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{transform: `translateY(${-90 + shake}px) rotate(-7deg) scale(${lerp(2.6, 1, p)})`, opacity: cl(p * 3), border: `12px solid ${RED}`, padding: '26px 56px', borderRadius: 14}}>
        <div style={hv(118, RED, 800, 0.02)}>ERROR</div>
        <div style={hv(118, RED, 800, 0.02)}>COMÚN</div>
      </div>
      <div style={{position: 'absolute', top: 1120, ...mono(40, PAPER, 700, 0.12), opacity: cl(spr(f, a + 0.5, 14, 200, 0.6) * 2)}}>«voy bien: ya pagué algo»</div>
    </AbsoluteFill>
  );
};

const Anatomy: React.FC = () => {
  const f = useCurrentFrame();
  const a = B(2).s;
  const items = [
    {l: 'INTERESES', c: RED, w: 0.52, at: a + 0.55},
    {l: 'COMISIONES', c: '#FFB347', w: 0.27, at: a + 1.2},
    {l: 'CAPITAL (lo que sí baja tu deuda)', c: GREEN, w: 0.08, at: a + 2.3},
  ];
  return (
    <AbsoluteFill>
      <Tag color={PAPER} at={a}>¿QUÉ HAY EN TU PAGO MÍNIMO?</Tag>
      <div style={{position: 'absolute', left: 90, right: 90, top: 520}}>
        {items.map((it, i) => {
          const p = spr(f, it.at, 16, 150, 0.8);
          return (
            <div key={i} style={{marginBottom: 74, opacity: cl(p * 2)}}>
              <div style={mono(36, it.c, 700, 0.06)}>{it.l}</div>
              <div style={{height: 56, marginTop: 14, background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.18)'}}>
                <div style={{height: '100%', width: `${it.w * 100 * p / 0.52 * 0.52 * 1.7}%`, background: it.c}} />
              </div>
            </div>
          );
        })}
        <div style={{...mono(28, 'rgba(232,226,207,0.6)', 400, 0.04), marginTop: -10}}>(esquema ilustrativo, no son cifras reales: cada banco calcula distinto)</div>
      </div>
    </AbsoluteFill>
  );
};

const Calc: React.FC = () => {
  const f = useCurrentFrame();
  const a = B(3).s;
  const rows: [string, string, number][] = [
    ['DEUDA', '$10,000', a + 0.3],
    ['PAGO MÍNIMO', '$415', a + 1.9],
    ['INTERÉS (EJEMPLO)', '28 % anual', a + 2.7],
    ['COMPRAS NUEVAS', 'ninguna', a + 3.2],
  ];
  return (
    <AbsoluteFill>
      <Tag color={PAPER} at={a}>EL CASO · HIPOTÉTICO</Tag>
      <div style={{position: 'absolute', left: 80, right: 80, top: 480, background: PAPER, padding: '36px 44px', boxShadow: '0 30px 70px rgba(0,0,0,0.7)', transform: 'rotate(-1.2deg)'}}>
        {rows.map(([k, v, at], i) => {
          const p = spr(f, at, 14, 220, 0.6);
          return (
            <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '22px 0', borderBottom: i < 3 ? '3px dashed rgba(4,7,10,0.3)' : 'none', opacity: cl(p * 2), transform: `translateX(${(1 - p) * 60}px)`}}>
              <span style={mono(34, '#04070A', 700, 0.08)}>{k}</span>
              <span style={hv(i === 3 ? 56 : 76, i === 1 ? '#B31217' : '#04070A', 800, -0.02)}>{v}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* curva de saldo mes a mes */
const CX0 = 110, CX1 = 960, CY0 = 500, CY1 = 1150;
const px = (m: number) => lerp(CX0, CX1, m / MONTHS);
const py = (v: number) => lerp(CY1, CY0, v / 10000);
const Curve: React.FC<{upTo: number}> = ({upTo}) => {
  const pts = bal.map((v, m) => ({m, v}));
  const shown = pts.filter((p) => p.m <= Math.floor(upTo));
  const frac = upTo - Math.floor(upTo);
  const last = shown[shown.length - 1];
  const nxt = pts[last.m + 1];
  const cur = nxt ? {m: last.m + frac, v: lerp(last.v, nxt.v, frac)} : last;
  const path = shown.map((p, i) => `${i ? 'L' : 'M'}${px(p.m)},${py(p.v)}`).join(' ') + (nxt ? ` L${px(cur.m)},${py(cur.v)}` : '');
  return (
    <svg width={1080} height={1300} style={{position: 'absolute', left: 0, top: 0}}>
      {[0, 0.5, 1].map((g) => (
        <line key={g} x1={CX0} x2={CX1} y1={lerp(CY1, CY0, g)} y2={lerp(CY1, CY0, g)} stroke="rgba(232,226,207,0.2)" strokeDasharray="8 10" strokeWidth={2} />
      ))}
      <text x={CX0} y={CY0 - 20} fill="rgba(232,226,207,0.7)" fontFamily={MONO} fontSize={28}>LO QUE DEBES</text>
      <text x={CX0} y={CY1 + 46} fill="rgba(232,226,207,0.7)" fontFamily={MONO} fontSize={28}>MES 0</text>
      <text x={CX1} y={CY1 + 46} fill="rgba(232,226,207,0.7)" fontFamily={MONO} fontSize={28} textAnchor="end">MES {MONTHS}</text>
      <path d={path} stroke={RED} strokeWidth={9} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={px(cur.m)} cy={py(cur.v)} r={16} fill={RED} />
    </svg>
  );
};

const Drain: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const a = B(4).s;
  const m = lerp(0, 12, easeIO(cl((t - a) / (B(4).e - a))));
  const v = lerp(bal[Math.floor(m)], bal[Math.min(MONTHS, Math.floor(m) + 1)], m - Math.floor(m));
  return (
    <AbsoluteFill>
      <Tag color={PAPER} at={a}>EL BANCO COBRA PRIMERO</Tag>
      <Curve upTo={m} />
      <div style={{position: 'absolute', right: 90, top: 330, textAlign: 'right'}}>
        <div style={mono(34, PAPER, 700, 0.1)}>MES {Math.floor(m)}</div>
        <div style={hv(96, '#fff', 800)}>{mny(v)}</div>
      </div>
    </AbsoluteFill>
  );
};

const Quote: React.FC = () => {
  const f = useCurrentFrame();
  const a = B(5).s;
  const p = spr(f, a + 0.05, 14, 160, 0.8);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 880, transform: `translateY(-110px) scale(${lerp(0.92, 1, p)})`, opacity: cl(p * 2)}}>
        <div style={{...hv(240, RED, 800), lineHeight: 0.6, height: 120}}>“</div>
        <div style={{...hv(86, '#fff', 800, -0.02), whiteSpace: 'normal', lineHeight: 1.1}}>El pago mínimo es la opción <span style={{color: RED}}>más cara</span> para tu bolsillo</div>
        <div style={{...mono(36, PAPER, 700, 0.14), marginTop: 36}}>— CONDUSEF</div>
      </div>
    </AbsoluteFill>
  );
};

const Reveal: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const a = B(6).s;
  const m = lerp(12, MONTHS, easeIO(cl((t - a) / 2.4)));
  const years = spr(f, a + 2.0, 10, 200, 0.7);
  const intr = spr(f, words[83]?.s ?? a + 3.5, 12, 200, 0.7);
  const iv = intCum[Math.min(MONTHS, Math.floor(m))];
  return (
    <AbsoluteFill>
      <Tag at={a}>RESPUESTA</Tag>
      <Curve upTo={m} />
      <div style={{position: 'absolute', left: 90, right: 90, top: 330, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', opacity: cl(years * 2), transform: `scale(${lerp(0.7, 1, years)})`, transformOrigin: '0 0'}}>
        <div>
          <div style={hv(104, RED, 800)}>{MONTHS} MESES</div>
        </div>
      </div>
      {t >= (words[83]?.s ?? a + 3.5) && (
        <div style={{position: 'absolute', right: 90, top: 330, textAlign: 'right', opacity: cl(intr * 2), transform: `scale(${lerp(0.8, 1, intr)})`, transformOrigin: '100% 0'}}>
          <div style={mono(32, PAPER, 700, 0.1)}>SOLO DE INTERESES</div>
          <div style={hv(96, '#fff', 800)}>{mny(iv)}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const Fix: React.FC = () => {
  const f = useCurrentFrame();
  const a = B(7).s;
  const Row: React.FC<{at: number; top: number; big: string; small: string; c: string}> = ({at, top, big, small, c}) => {
    const p = spr(f, at, 13, 200, 0.7);
    return (
      <div style={{position: 'absolute', left: 80, right: 80, top, display: 'flex', alignItems: 'center', gap: 36, opacity: cl(p * 2), transform: `translateX(${(1 - p) * -120}px)`}}>
        <div style={{width: 120, height: 120, border: `8px solid ${c}`, borderRadius: 16, color: c, ...hv(96, c, 800), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>✓</div>
        <div>
          <div style={hv(70, '#fff', 800)}>{big}</div>
          <div style={mono(32, PAPER, 700, 0.06)}>{small}</div>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Tag color={GREEN} at={a}>CÓMO SE HACE BIEN</Tag>
      <Row at={a + 0.5} top={480} big="PAGO TOTAL" small="para no generar intereses" c={GREEN} />
      <Row at={a + 3.6} top={760} big="SIEMPRE > MÍNIMO" small="si no te alcanza el total" c="#FFB347" />
    </AbsoluteFill>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  const a = B(8).s;
  const p = spr(f, a + 0.2, 14, 200, 0.7);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 70, right: 70, top: 1135, opacity: cl(p * 2), transform: `translateY(${(1 - p) * 40}px)`}}>
        <div style={{...mono(36, GREEN, 700, 0.08), whiteSpace: 'normal', lineHeight: 1.3}}>¿CUÁNTOS MESES TARDARÍAS CON TU TARJETA? CUÉNTAME EN COMENTARIOS</div>
      </div>
    </AbsoluteFill>
  );
};

const Follow: React.FC = () => {
  const f = useCurrentFrame();
  const a = B(8).s + 1.2;
  const p = spr(f, a, 14, 200, 0.7);
  if (f / FPS < a) return null;
  return <div style={{position: 'absolute', left: 0, right: 0, top: 1420, textAlign: 'center', opacity: cl(p * 2), ...mono(38, 'rgba(232,226,207,0.9)', 700, 0.2)}}>＋ SÍGUEME</div>;
};

export const MinimoMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <Brand value={THRILLER}>
    <AbsoluteFill style={{background: '#000'}}>
      <Noir />
      <Fade a={0} b={B(0).e}><Hook /></Fade>
      <Fade a={B(1).s} b={B(1).e}><Stamp /></Fade>
      <Fade a={B(2).s} b={B(2).e}><Anatomy /></Fade>
      <Fade a={B(3).s} b={B(3).e}><Calc /></Fade>
      <Fade a={B(4).s} b={B(4).e}><Drain /></Fade>
      <Fade a={B(5).s} b={B(5).e}><Quote /></Fade>
      <Fade a={B(6).s} b={B(6).e}><Reveal /></Fade>
      <Fade a={B(7).s} b={B(7).e}><Fix /></Fade>
      <Fade a={B(8).s - 0.05} b={MIN_TOTAL}><Hook final /></Fade>
      <Fade a={B(8).s} b={MIN_TOTAL}><End /></Fade>
      <Follow />
      <Captions groups={groups} keys={KEYS} y={1290} />
      <Frame serie="EXPEDIENTE · FINANZAS" total={MIN_TOTAL} nota="Contenido educativo, no es recomendación de inversión. Ejemplo hipotético con interés de 28 % anual; cada banco calcula distinto." />
      {audio && <Audio src={staticFile('minimo-tarjeta/voz_mix.wav')} />}
    </AbsoluteFill>
  </Brand>
);

export const MinimoCover: React.FC = () => (
  <Brand value={THRILLER}>
    <AbsoluteFill>
      <Noir />
      <Hook final cover />
    </AbsoluteFill>
  </Brand>
);

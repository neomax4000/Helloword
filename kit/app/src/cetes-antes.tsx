// CETES: ¿SIGUEN PAGANDO LO DE ANTES? — T06 de la semana de pruebas (27 nov 2026)
// Variables a probar: apertura = pantalla dividida A vs B desde el cuadro 1 · texto = mucho, comparativo ·
// estructura = duelo A vs B · fondo = pizarra dibujada a mano · ~30 s · voz 5.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/cetes-antes/words.json';
import {Brand, Captions, FONT, FPS, Wd, buildGroups, cl, easeIO, lerp, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const CET_TOTAL = blocks[blocks.length - 1].e + 0.3;
const B = (k: number) => blocks[k];
const T = (i: number) => words[i].s;
const groups = buildGroups(words, blocks, 15, 3);
const KEYS = ['TASA', 'SEMANA', 'PLAZO', 'DEPENDE', 'DIFERENCIA', 'VENCE'];
const BOARD = {accent: '#1F4FD8', accentDeep: '#17399C', logo: false};
const INK = '#1A1D2B';
const BLUE = '#1F4FD8';
const RED = '#D9342B';
const GREEN = '#1B9A5B';
const PAPER = '#F6F2E7';
const HAND = '"Comic Relief", "Poppins", sans-serif';
const hand = (size: number, color = INK, weight = 700): React.CSSProperties => ({fontFamily: HAND, fontWeight: weight, fontSize: size, color, lineHeight: 1.08, whiteSpace: 'nowrap'});

// Cifras: CETES 28 días 11-nov-2025 = 7.05 % ; subasta 24-nov-2026 = 6.20 % (semana anterior 6.19 %)
const A = 7.05;
const Bv = 6.2;
const gain = (r: number) => (10000 * (r / 100) * 28) / 360; // tasa anual simple, base 360
const gA = gain(A); // 54.83
const gB = gain(Bv); // 48.22

/* ---------- pizarra ---------- */
const Board: React.FC = () => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 5) % 6;
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="wob" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves={2} seed={seed + 2} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={7} />
        </filter>
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(1300px 1700px at 50% 40%, rgba(255,255,255,0.8), rgba(222,214,192,0.9) 100%)'}} />
      <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(40,50,90,0.06) 2px, transparent 2px), linear-gradient(90deg, rgba(40,50,90,0.06) 2px, transparent 2px)', backgroundSize: '90px 90px'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 150, background: '#B9B3A2', borderBottom: '6px solid #8E8878'}} />
    </AbsoluteFill>
  );
};
const Hand: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill style={{filter: 'url(#wob)'}}>{children}</AbsoluteFill>;

/** trazo que se dibuja */
const Ink: React.FC<{d: string; at: number; dur?: number; color?: string; w?: number; fill?: string}> = ({d, at, dur = 0.5, color = INK, w = 10, fill = 'none'}) => {
  const f = useCurrentFrame();
  const p = cl((f / FPS - at) / dur);
  return <path d={d} pathLength={1} stroke={color} strokeWidth={w} fill={fill} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - easeIO(p)} opacity={p > 0 ? 1 : 0} />;
};
const Wr: React.FC<{at: number; style: React.CSSProperties; children: React.ReactNode}> = ({at, style, children}) => {
  const f = useCurrentFrame();
  const p = spr(f, at, 14, 200, 0.6);
  return <div style={{position: 'absolute', ...style, opacity: cl(p * 2.2), transform: `${style.transform ?? ''} scale(${lerp(0.85, 1, p)})`}}>{children}</div>;
};

/* ---------- pantalla dividida (cuadro 1 y cierre) ---------- */
const Split: React.FC<{end?: boolean}> = ({end}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const ring = (at: number) => cl((t - at) / 0.4);
  return (
    <AbsoluteFill>
      <Hand>
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
          <Ink d="M60,772 C200,760 330,782 440,770" at={0} dur={0.25} w={12} />
          <Ink d="M640,770 C750,780 900,758 1020,772" at={0} dur={0.25} w={12} />
          <circle cx={540} cy={770} r={64} stroke={INK} strokeWidth={9} fill={PAPER} />
          <ellipse cx={540} cy={470} rx={ring(T(9) - 0.1) * 380} ry={ring(T(9) - 0.1) * 130} stroke={BLUE} strokeWidth={9} fill="none" opacity={end ? 0 : 1} />
          <ellipse cx={540} cy={1000} rx={ring(T(16) - 0.1) * 380} ry={ring(T(16) - 0.1) * 130} stroke={RED} strokeWidth={9} fill="none" opacity={end ? 0 : 1} />
        </svg>
        <div style={{position: 'absolute', left: 0, right: 0, top: 275, textAlign: 'center'}}>
          <div style={hand(50, BLUE)}>HACE UN AÑO · NOV 2025</div>
          <div style={{...hand(220, BLUE, 700), marginTop: 14}}>{A.toFixed(2)} %</div>
          <div style={hand(38, 'rgba(26,29,43,0.7)', 400)}>CETES a 28 días</div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 744, textAlign: 'center', ...hand(54, INK, 700)}}>VS</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 845, textAlign: 'center'}}>
          <div style={hand(50, RED)}>HOY · SUBASTA 24 NOV 2026</div>
          <div style={{...hand(220, RED, 700), marginTop: 14}}>{Bv.toFixed(2)} %</div>
          <div style={hand(38, 'rgba(26,29,43,0.7)', 400)}>CETES a 28 días</div>
        </div>
      </Hand>
    </AbsoluteFill>
  );
};

const Fade: React.FC<{a: number; b: number; children: React.ReactNode}> = ({a, b, children}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  if (t < a - 0.01 || t > b + 0.2) return null;
  const pin = a <= 0 ? 1 : cl((t - a) / 0.12);
  const pout = cl((t - b) / 0.16);
  return <AbsoluteFill style={{opacity: pin * (1 - pout)}}>{children}</AbsoluteFill>;
};

/* ---------- escenas ---------- */
const Money: React.FC = () => {
  const f = useCurrentFrame();
  const a = B(1).s;
  const bar = (at: number, v: number, color: string) => cl(spr(f, at, 18, 120, 0.9)) * (v / 55) * 760;
  return (
    <AbsoluteFill>
      <Hand>
        <Wr at={a} style={{left: 80, top: 250}}>
          <div style={hand(56, INK)}>CON $10,000 EN 28 DÍAS</div>
        </Wr>
        <Wr at={a + 0.2} style={{left: 80, top: 400}}>
          <div style={hand(46, BLUE)}>NOV 2025 · {A.toFixed(2)} %</div>
          <div style={{height: 90, width: bar(T(25) - 0.3, gA, BLUE), background: BLUE, borderRadius: 12, marginTop: 14}} />
          <div style={{...hand(110, BLUE), marginTop: 10}}>+${Math.round(gA)}</div>
        </Wr>
        <Wr at={a + 0.3} style={{left: 80, top: 860}}>
          <div style={hand(46, RED)}>HOY · {Bv.toFixed(2)} %</div>
          <div style={{height: 90, width: bar(T(31) - 0.3, gB, RED), background: RED, borderRadius: 12, marginTop: 14}} />
          <div style={{...hand(110, RED), marginTop: 10}}>+${Math.round(gB)}</div>
        </Wr>
      </Hand>
    </AbsoluteFill>
  );
};

const Diff: React.FC = () => {
  const f = useCurrentFrame();
  const a = B(2).s;
  const p = spr(f, a + 0.55, 9, 220, 0.7);
  return (
    <AbsoluteFill>
      <Hand>
        <Wr at={a} style={{left: 0, right: 0, top: 360, textAlign: 'center'}}>
          <div style={hand(66, INK)}>LA DIFERENCIA</div>
        </Wr>
        <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', opacity: cl(p * 2), transform: `scale(${lerp(1.6, 1, p)}) rotate(-3deg)`}}>
          <div style={hand(290, RED, 700)}>≈ ${Math.round(gA - gB)}</div>
          <div style={hand(50, INK, 400)}>pesos en 28 días</div>
        </div>
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
          <Ink d="M170,930 C400,1010 700,1005 915,930" at={a + 1.0} dur={0.5} color={RED} w={12} />
        </svg>
      </Hand>
    </AbsoluteFill>
  );
};

const Weeks: React.FC = () => {
  const f = useCurrentFrame();
  const a = B(3).s;
  const box = (x: number, label: string, val: string, at: number, color: string) => (
    <Wr at={at} style={{left: x, top: 520}}>
      <div style={{width: 420, height: 330, border: `9px solid ${color}`, borderRadius: 22, textAlign: 'center', paddingTop: 36, background: 'rgba(255,255,255,0.55)'}}>
        <div style={hand(38, INK, 400)}>{label}</div>
        <div style={{...hand(92, color), marginTop: 30}}>{val}</div>
      </div>
    </Wr>
  );
  return (
    <AbsoluteFill>
      <Hand>
        <Wr at={a} style={{left: 80, top: 260}}>
          <div style={hand(60, INK)}>CADA SEMANA, NUEVA TASA</div>
        </Wr>
        {box(60, '17–23 NOV', '6.19 %', a + 0.5, BLUE)}
        {box(600, '24–30 NOV', '6.20 %', a + 1.2, RED)}
        <Wr at={a + 2.0} style={{left: 0, right: 0, top: 950, textAlign: 'center'}}>
          <div style={hand(130, INK)}>1 DIC → ¿?</div>
        </Wr>
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
          <Ink d="M495,690 L585,690 M560,664 L588,690 L560,716" at={a + 1.0} dur={0.3} w={9} />
        </svg>
      </Hand>
    </AbsoluteFill>
  );
};

const Lock: React.FC = () => {
  const f = useCurrentFrame();
  const a = B(4).s;
  return (
    <AbsoluteFill>
      <Hand>
        <Wr at={a} style={{left: 80, top: 260}}>
          <div style={hand(60, INK)}>LO QUE YA COMPRASTE</div>
        </Wr>
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
          <Ink d="M400,640 L400,540 C400,420 680,420 680,540 L680,640" at={a + 0.5} dur={0.5} color={INK} w={18} />
          <Ink d="M340,640 L740,640 L740,900 L340,900 Z" at={a + 0.9} dur={0.6} color={RED} w={14} fill="rgba(217,52,43,0.12)" />
          <Ink d="M540,730 a34,34 0 1,0 0.1,0 M540,764 L540,830" at={a + 1.6} dur={0.4} color={RED} w={14} />
        </svg>
        <Wr at={a + 2.0} style={{left: 0, right: 0, top: 960, textAlign: 'center'}}>
          <div style={hand(70, RED)}>TU TASA QUEDA FIJA</div>
          <div style={hand(44, INK, 400)}>hasta que vence</div>
        </Wr>
      </Hand>
    </AbsoluteFill>
  );
};

const Verdict: React.FC = () => {
  const f = useCurrentFrame();
  const a = B(5).s;
  return (
    <AbsoluteFill>
      <Hand>
        <Wr at={a} style={{left: 0, right: 0, top: 270, textAlign: 'center'}}>
          <div style={hand(70, INK)}>¿ES MEJOR O PEOR?</div>
        </Wr>
        <Wr at={a + 0.9} style={{left: 0, right: 0, top: 430, textAlign: 'center'}}>
          <div style={{...hand(190, RED), transform: 'rotate(-3deg)'}}>DEPENDE</div>
        </Wr>
        <Wr at={a + 2.0} style={{left: 90, top: 760}}>
          <div style={hand(58, BLUE)}>① DE TU PLAZO</div>
        </Wr>
        <Wr at={a + 3.4} style={{left: 90, top: 900}}>
          <div style={hand(58, GREEN)}>② DE CUÁNTO TIEMPO</div>
          <div style={{...hand(58, GREEN), marginLeft: 56}}>PUEDES DEJARLO QUIETO</div>
        </Wr>
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
          <Ink d="M300,660 C500,690 750,670 800,640" at={a + 1.5} dur={0.4} color={RED} w={12} />
        </svg>
      </Hand>
    </AbsoluteFill>
  );
};

const EndQ: React.FC = () => {
  const f = useCurrentFrame();
  const a = B(6).s + 0.2;
  const p = spr(f, a, 14, 200, 0.7);
  return (
    <>
      <Wr at={a} style={{left: 70, right: 70, top: 172, textAlign: 'center'}}>
        <div style={{...hand(36, INK), whiteSpace: 'nowrap', background: '#FFF3A8', display: 'inline-block', padding: '14px 28px', transform: 'rotate(-1.5deg)', boxShadow: '0 8px 0 rgba(0,0,0,0.12)'}}>¿A QUÉ PLAZO LO PONDRÍAS? ESCRÍBELO</div>
      </Wr>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1450, textAlign: 'center', ...hand(38, INK, 700), opacity: cl(p * 2)}}>＋ SÍGUEME</div>
    </>
  );
};

const Foot: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <>
      <div style={{position: 'absolute', left: 0, top: 0, height: 10, width: `${(t / CET_TOTAL) * 100}%`, background: BLUE}} />
      <div style={{position: 'absolute', top: 70, left: 70, right: 70, fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: '0.2em', color: INK}}>● FINANZAS FÁCILES · CETES</div>
      <div style={{position: 'absolute', left: 70, right: 200, top: 1532, fontFamily: FONT, fontWeight: 400, fontSize: 23, lineHeight: 1.3, color: 'rgba(26,29,43,0.75)'}}>
        Contenido educativo, no es recomendación de inversión. Rendimientos pasados no garantizan rendimientos futuros. Tasa anual simple, base 360 días, sin ISR ni comisiones. Fuentes: Banxico/Hacienda, subastas de CETES.
      </div>
    </>
  );
};

const Strip: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const on = groups.some((g) => t >= g.a && t < g.b);
  if (!on) return null;
  return <div style={{position: 'absolute', left: 50, right: 50, top: 1268, height: 165, background: 'rgba(26,29,43,0.92)', borderRadius: 30, transform: 'rotate(-0.6deg)'}} />;
};

export const CetesAntesMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <Brand value={BOARD}>
    <AbsoluteFill>
      <Board />
      <Fade a={0} b={B(0).e}><Split /></Fade>
      <Fade a={B(1).s} b={B(1).e}><Money /></Fade>
      <Fade a={B(2).s} b={B(2).e}><Diff /></Fade>
      <Fade a={B(3).s} b={B(3).e}><Weeks /></Fade>
      <Fade a={B(4).s} b={B(4).e}><Lock /></Fade>
      <Fade a={B(5).s} b={B(5).e}><Verdict /></Fade>
      <Fade a={B(6).s - 0.05} b={CET_TOTAL}><Split end /></Fade>
      <EndQ />
      <Strip />
      <Captions groups={groups} keys={KEYS} y={1292} />
      <Foot />
      {audio && <Audio src={staticFile('cetes-antes/voz_mix.wav')} />}
    </AbsoluteFill>
  </Brand>
);

export const CetesAntesCover: React.FC = () => (
  <Brand value={BOARD}>
    <AbsoluteFill>
      <Board />
      <Split end />
    </AbsoluteFill>
  </Brand>
);

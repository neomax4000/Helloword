import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/msftcred/words.json';
import {FONT, FPS, W} from './theme';
import {F, cl, ease, sp} from './narrador';
import {TopicBg, Motif} from './noticia-fondos';

/* Noticia R · SEGUIMIENTO de la caída de Outlook / Microsoft 365 (13 nov 2026). Estilo noticia: fondo oscuro, píldora de etiqueta, 3–5 piezas por bloque. */
type Word = {i: number; w: string; s: number; e: number; k?: boolean; p: number};
const words = data.words as Word[];
const lines = data.lines as {p: number; s: number; e: number}[];
const INK = '#0B1020', TXT = '#F5F3EE', RED = '#FF4D4F', AMB = '#FFB020', GRN = '#38D39F', BLU = '#4DA3FF', MUT = '#9FB0C9';

/* Noticia R · Microsoft: créditos del SLA por la caída del 12 nov (14 nov 2026). */
const SCENES: {art: Motif; k: string; lines: number[]; bg: number; tag: string}[] = [
  {art: 'coins' as Motif, k: 'hook', lines: [0], bg: 0, tag: 'CAÍDA DE MICROSOFT · 12 NOV'},
  {art: 'coins' as Motif, k: 'noauto', lines: [1], bg: 0, tag: 'CAÍDA DE MICROSOFT · 12 NOV'},
  {art: 'servers' as Motif, k: 'sla', lines: [2, 3], bg: 1, tag: 'LO QUE DICE EL CONTRATO'},
  {art: 'chart' as Motif, k: 'dur', lines: [4], bg: 1, tag: 'CUÁNTO DURÓ'},
  {art: 'phone' as Motif, k: 'mx', lines: [5], bg: 2, tag: 'PARA TU DINERO EN MÉXICO'},
  {art: 'inbox' as Motif, k: 'how', lines: [6, 7], bg: 2, tag: 'CÓMO PEDIRLO'},
  {art: 'alert' as Motif, k: 'fine', lines: [8], bg: 3, tag: 'LA LETRA CHICA'},
  {art: 'servers' as Motif, k: 'cause', lines: [9], bg: 3, tag: 'LA LETRA CHICA'},
  {art: 'plain' as Motif, k: 'final', lines: [10, 11], bg: 4, tag: ''},
];
const shots = SCENES.map((s, i) => {
  const a = i === 0 ? 0 : lines[s.lines[0]].s - 0.08;
  const nx = SCENES[i + 1];
  const b = nx ? lines[nx.lines[0]].s - 0.08 : data.total + 1;
  return {...s, a, b};
});
const lineStart = (p: number) => lines[p].s;
const wordStart = (p: number, n: number) => words.filter((w) => w.p === p)[n]?.s ?? lines[p].s;

const BGS = [
  ['#2A0F18', '#0B1020'], ['#0F2547', '#0B1020'], ['#0B2F3A', '#0B1020'], ['#2A1B4A', '#0B1020'], ['#0F2547', '#05070F'],
];
const Bg: React.FC<{f: number; n: number}> = ({f, n}) => {
  const [c1, c2] = BGS[n % BGS.length];
  const off = (f * 0.6) % 120;
  return (
    <AbsoluteFill style={{background: `radial-gradient(1300px 1300px at 50% 30%, ${c1}, ${c2} 70%)`}}>
      <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.045) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.045) 2px, transparent 2px)', backgroundSize: '120px 120px', backgroundPosition: `0 ${off}px`}} />
    </AbsoluteFill>
  );
};

type SP = {f: number; t0: number; t: number};
const Rise: React.FC<{f: number; at: number; y?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({f, at, y = 40, children, style}) => {
  const k = sp(f, at, 14, 150);
  return <div style={{opacity: cl(k * 1.6), transform: `translateY(${(1 - k) * y}px)`, ...style}}>{children}</div>;
};
const Big: React.FC<{children: React.ReactNode; size?: number; color?: string; w?: number}> = ({children, size = 110, color = TXT, w = 700}) => (
  <div style={{fontFamily: FONT, fontWeight: w, fontSize: size, color, lineHeight: 1.05, textAlign: 'center'}}>{children}</div>
);

/* ---- piezas ---- */
const Envelope: React.FC<{x?: boolean; p?: number}> = ({x = false, p = 1}) => (
  <svg width={520} height={420} viewBox="-260 -210 520 420" style={{overflow: 'visible'}}>
    <rect x={-230} y={-150} width={460} height={300} rx={34} fill="#12254A" stroke={BLU} strokeWidth={10} />
    <path d="M-225 -140 L0 30 L225 -140" fill="none" stroke={BLU} strokeWidth={10} strokeLinejoin="round" />
    {x && (
      <g transform={`translate(150 110) scale(${p})`}>
        <circle r={86} fill={RED} stroke={INK} strokeWidth={10} />
        <path d="M-38 -38 L38 38 M38 -38 L-38 38" stroke="#fff" strokeWidth={22} strokeLinecap="round" />
      </g>
    )}
  </svg>
);
const Chip: React.FC<{f: number; at: number; label: string; c: string; bad?: boolean}> = ({f, at, label, c, bad = true}) => {
  const k = sp(f, at, 11, 190);
  return (
    <div style={{opacity: cl(k * 2), transform: `scale(${0.7 + 0.3 * k})`, display: 'flex', alignItems: 'center', gap: 28, background: 'rgba(255,255,255,0.07)', border: `5px solid ${c}`, borderRadius: 40, padding: '20px 44px', width: 700}}>
      <div style={{width: 60, height: 60, borderRadius: 30, background: bad ? RED : GRN, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 40, color: '#fff'}}>{bad ? '!' : '✓'}</div>
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 64, color: TXT}}>{label}</div>
    </div>
  );
};
const Server: React.FC<{off: boolean; f: number; at: number}> = ({off, f, at}) => {
  const k = off ? cl((f - at) / 8) : 0;
  return (
    <div style={{width: 190, height: 150, borderRadius: 20, background: off ? `rgb(${Math.round(40 + 215 * (1 - k) * 0)}, ${Math.round(60 - 30 * k)}, ${Math.round(90 - 40 * k)})` : '#1A3566', border: `6px solid ${off ? RED : BLU}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14, padding: '0 24px', opacity: off ? 1 - 0.35 * k : 1}}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{height: 14, borderRadius: 7, background: off ? '#6B2B33' : '#6FB2FF', opacity: off ? 1 : 0.5 + 0.5 * Math.abs(Math.sin((f + i * 9) / 7))}} />
      ))}
    </div>
  );
};
const Card: React.FC<{children: React.ReactNode; c?: string; w?: number}> = ({children, c = BLU, w = 880}) => (
  <div style={{width: w, background: 'rgba(255,255,255,0.07)', border: `5px solid ${c}`, borderRadius: 44, padding: '34px 44px', fontFamily: FONT, color: TXT}}>{children}</div>
);


const Src: React.FC<{children: React.ReactNode}> = ({children}) => <div style={{fontFamily: FONT, fontWeight: 400, fontSize: 32, color: MUT, marginTop: 6}}>{children}</div>;
const Num: React.FC<{n: string; c: string}> = ({n, c}) => (
  <div style={{width: 80, height: 80, borderRadius: 40, background: c, color: INK, fontFamily: FONT, fontWeight: 700, fontSize: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{n}</div>
);
const Hook: React.FC<SP> = ({f}) => (
  <AbsoluteFill style={{alignItems: 'center', paddingTop: 330}}>
    <Rise f={f} at={4}><Big size={64} color={MUT} w={600}>MICROSOFT</Big></Rise>
    <Rise f={f} at={8} style={{marginTop: 20}}><Big size={150} color={AMB}>TE PUEDE</Big></Rise>
    <Rise f={f} at={13}><Big size={150}>DEVOLVER</Big></Rise>
    <Rise f={f} at={18}><Big size={190} color={GRN}>DINERO</Big></Rise>
    <Rise f={f} at={26} style={{marginTop: 30}}><Big size={46} color={MUT} w={400}>por la caída del jueves 12 de noviembre</Big></Rise>
  </AbsoluteFill>
);
const NoAuto: React.FC<SP> = ({f}) => (
  <AbsoluteFill style={{alignItems: 'center', paddingTop: 330, gap: 28}}>
    <Rise f={f} at={0}><Card c={RED} w={900}><div style={{fontSize: 62, fontWeight: 700}}><span style={{color: RED}}>✕</span> No es automático</div></Card></Rise>
    <Rise f={f} at={14}><Card c={RED} w={900}><div style={{fontSize: 62, fontWeight: 700}}><span style={{color: RED}}>✕</span> No es en efectivo</div></Card></Rise>
    <Rise f={f} at={26}><Card c={GRN} w={900}><div style={{fontSize: 62, fontWeight: 700}}><span style={{color: GRN}}>✓</span> Se pide y es crédito</div></Card></Rise>
    <Rise f={f} at={34}><Src>Men's Journal · Open · LazyAdmin</Src></Rise>
  </AbsoluteFill>
);
const Sla: React.FC<SP> = ({f, t0}) => {
  const a = F(lineStart(3)) - F(t0);
  const rows: [string, string, string][] = [['Menos de 99.9 %', '25 %', AMB], ['Menos de 99 %', '50 %', AMB], ['Menos de 95 %', '100 %', GRN]];
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 280, gap: 18}}>
      <Rise f={f} at={0}><Big size={46} color={MUT} w={600}>DISPONIBILIDAD PROMETIDA</Big></Rise>
      <Rise f={f} at={3}><Big size={170} color={BLU}>99.9 %</Big></Rise>
      <Rise f={f} at={10}><Card c={BLU} w={880}><div style={{fontSize: 46, fontWeight: 700, textAlign: 'center'}}>≈ <span style={{color: AMB}}>43 min</span> de falla al mes</div></Card></Rise>
      {rows.map(([u, c, col], i) => (
        <Rise key={u} f={f} at={a + i * 14}>
          <div style={{width: 880, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.07)', border: `5px solid ${col}`, borderRadius: 30, padding: '12px 34px'}}>
            <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 42, color: TXT}}>{u}</div>
            <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 64, color: col}}>{c}</div>
          </div>
        </Rise>
      ))}
      <Rise f={f} at={a + 46}><Src>SLA Exchange Online · versión oct 2026</Src></Rise>
    </AbsoluteFill>
  );
};
const Dur: React.FC<SP> = ({f}) => {
  const v = Math.round(27 * ease(cl(f / 30)));
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 340, gap: 20}}>
      <Rise f={f} at={0}><Big size={46} color={MUT} w={600}>DURÓ MÁS DE</Big></Rise>
      <Rise f={f} at={2}><Big size={230} color={RED}>{v >= 27 ? '+27 h' : v + ' h'}</Big></Rise>
      <Rise f={f} at={14}><Card c={AMB} w={880}><div style={{fontSize: 42, fontWeight: 700, lineHeight: 1.25}}>Inicio: <span style={{color: AMB}}>jueves 12, ~18:00 UTC</span></div></Card></Rise>
      <Rise f={f} at={22}><Card c={RED} w={880}><div style={{fontSize: 40, fontWeight: 700, lineHeight: 1.25}}>Viernes 21:44 UTC: <span style={{color: RED}}>sin hora de recuperación total</span></div></Card></Rise>
      <Rise f={f} at={30}><Src>The Register · 13 nov</Src></Rise>
    </AbsoluteFill>
  );
};
const Mx: React.FC<SP> = ({f}) => {
  const k = sp(f, 2, 11, 160);
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 400}}>
      <div style={{transform: `scale(${0.8 + 0.2 * k})`, opacity: cl(k * 2)}}>
        <svg width={360} height={360} viewBox="-180 -180 360 360"><circle r={160} fill="#12254A" stroke={GRN} strokeWidth={12} /><text textAnchor="middle" y={44} fontFamily={FONT} fontWeight={700} fontSize={140} fill={GRN}>$</text></svg>
      </div>
      <Rise f={f} at={10} style={{marginTop: 36}}><Big size={120}>Tu dinero</Big></Rise>
      <Rise f={f} at={16}><Big size={120} color={GRN}>en México</Big></Rise>
    </AbsoluteFill>
  );
};
const How: React.FC<SP> = ({f, t0}) => {
  const a = F(lineStart(7)) - F(t0);
  const steps: [string, string][] = [['Entra al centro de administración de Microsoft 365', BLU], ['Crea una solicitud de servicio: «SLA credit»', BLU], ['Cita los incidentes EX1550543 y MO1550821', AMB], ['Anota horas y usuarios afectados', AMB]];
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 270, gap: 20}}>
      <Rise f={f} at={0}><Big size={64} color={GRN}>Se pide así</Big></Rise>
      {steps.map(([t, c], i) => (
        <Rise key={t} f={f} at={i < 2 ? 4 + i * 10 : a + (i - 2) * 12}>
          <div style={{width: 900, display: 'flex', alignItems: 'center', gap: 24, background: 'rgba(255,255,255,0.07)', border: `5px solid ${c}`, borderRadius: 36, padding: '16px 28px'}}>
            <Num n={String(i + 1)} c={c} /><div style={{fontFamily: FONT, fontWeight: 700, fontSize: 40, color: TXT, lineHeight: 1.15}}>{t}</div>
          </div>
        </Rise>
      ))}
      <Rise f={f} at={a + 30}><Card c={GRN} w={900}><div style={{fontSize: 42, fontWeight: 700, textAlign: 'center'}}>Plazo: <span style={{color: GRN}}>31 dic 2026</span></div><Src>Según medios · revisa tu contrato</Src></Card></Rise>
      <Rise f={f} at={a + 40}><Src>¿Compraste con revendedor? Pídelo a él</Src></Rise>
    </AbsoluteFill>
  );
};
const Fine: React.FC<SP> = ({f}) => (
  <AbsoluteFill style={{alignItems: 'center', paddingTop: 320, gap: 26}}>
    <Rise f={f} at={0}><Big size={64} color={AMB}>Ojo</Big></Rise>
    <Rise f={f} at={5}><Card c={AMB} w={900}><div style={{fontSize: 50, fontWeight: 700}}>Es <span style={{color: AMB}}>crédito en tu factura</span></div></Card></Rise>
    <Rise f={f} at={15}><Card c={AMB} w={900}><div style={{fontSize: 50, fontWeight: 700}}>Solo del <span style={{color: AMB}}>servicio afectado</span></div></Card></Rise>
    <Rise f={f} at={25}><Card c={RED} w={900}><div style={{fontSize: 50, fontWeight: 700}}>No cubre <span style={{color: RED}}>ventas perdidas</span></div></Card></Rise>
    <Rise f={f} at={34}><Src>Men's Journal · LazyAdmin</Src></Rise>
  </AbsoluteFill>
);
const Cause: React.FC<SP> = ({f}) => (
  <AbsoluteFill style={{alignItems: 'center', paddingTop: 330, gap: 26}}>
    <Rise f={f} at={0}><Card c={GRN} w={900}><div style={{fontSize: 56, fontWeight: 700}}><span style={{color: GRN}}>No fue</span> ciberataque</div></Card></Rise>
    <Rise f={f} at={12}><Card c={BLU} w={900}><div style={{fontSize: 46, fontWeight: 700, lineHeight: 1.2}}>Un problema durante una <span style={{color: BLU}}>mejora de capacidad de red</span></div></Card></Rise>
    <Rise f={f} at={24}><Src>Microsoft, citado por ABC News · 13 nov</Src></Rise>
  </AbsoluteFill>
);
const Final: React.FC<SP> = ({f, t0}) => {
  const k = sp(f, F(lineStart(11)) - F(t0) + 4, 9, 200);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 300}}>
      <div style={{transform: `scale(${0.7 + 0.3 * sp(f, 0)})`, textAlign: 'center'}}><Big size={100}>SI TE</Big><Big size={100} color={AMB}>SIRVIÓ</Big></div>
      <div style={{marginTop: 40, transform: `scale(${k})`, opacity: cl(k * 2)}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 84, color: INK, background: AMB, padding: '6px 44px 14px', borderRadius: 30, border: `10px solid ${TXT}`}}>♥ + SÍGUEME</div>
      </div>
      <div style={{position: 'absolute', bottom: 105, left: 70, right: 70, textAlign: 'center', fontFamily: FONT, fontWeight: 400, fontSize: 26, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4}}>
        Contenido educativo, no es recomendación de inversión. Cifras del SLA según captura del contrato y medios (Men's Journal, Open, LazyAdmin); caída: The Register, ABC News.
      </div>
    </AbsoluteFill>
  );
};

/* ---- subtítulos ---- */
type G = {ws: Word[]; a: number; b: number};
const groups: G[] = (() => {
  const gs: G[] = [];
  let cur: Word[] = [];
  let len = 0;
  words.forEach((w, idx) => {
    cur.push(w);
    len += w.w.length + 1;
    const next = words[idx + 1];
    const brk = /[,.?!:]$/.test(w.w) || cur.length >= 4 || len > 18 || !next || next.s - w.e > 0.6;
    if (brk) { gs.push({ws: cur, a: cur[0].s - 0.06, b: 0}); cur = []; len = 0; }
  });
  gs.forEach((g, i) => { const last = g.ws[g.ws.length - 1]; g.b = gs[i + 1] ? Math.min(gs[i + 1].a, last.e + 0.5) : last.e + 0.8; });
  return gs;
})();
const Captions: React.FC<{t: number; f: number}> = ({t, f}) => {
  const g = groups.find((x) => t >= x.a && t < x.b);
  if (!g) return null;
  const k = sp(f, F(g.a), 12, 260);
  let active = -1;
  g.ws.forEach((w) => { if (t >= w.s - 0.03) active = w.i; });
  const lastW = g.ws[g.ws.length - 1];
  if (t > lastW.e + 0.1) active = -1;
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: 1450, display: 'flex', justifyContent: 'center', transform: `scale(${0.88 + 0.12 * k})`, opacity: cl(k * 2)}}>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 18px', background: 'rgba(5,8,18,0.82)', borderRadius: 34, padding: '18px 30px'}}>
        {g.ws.map((w) => {
          const on = w.i === active;
          return (
            <span key={w.i} style={{fontFamily: FONT, fontWeight: 700, fontSize: 78, lineHeight: 1.15, color: on ? INK : w.k ? AMB : '#fff', background: on ? AMB : 'transparent', borderRadius: 16, padding: '0 12px', display: 'inline-block'}}>{w.w}</span>
          );
        })}
      </div>
    </div>
  );
};

export const MsftCred: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const si = Math.max(0, shots.findIndex((s) => t >= s.a && t < s.b));
  const shot = shots[si];
  const lf = f - F(shot.a) + (si === 0 ? 10 : 0);
  const MAP: Record<string, React.FC<SP>> = {hook: Hook, noauto: NoAuto, sla: Sla, dur: Dur, mx: Mx, how: How, fine: Fine, cause: Cause, final: Final};
  const Comp = MAP[shot.k];
  const drift = 1 + 0.02 * cl(lf / Math.max(1, F(shot.b - shot.a)));
  const flash = lf < 3 && si !== 0 ? 0.25 * (1 - lf / 3) : 0;
  const urgent = si < 3;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <TopicBg kind={shot.art} f={f} c1={BGS[shot.bg % BGS.length][0]} />
      <AbsoluteFill style={{transform: `translateY(110px) scale(${drift})`, transformOrigin: '540px 760px'}}>
        <Comp f={lf} t0={shot.a} t={t} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 42%, transparent 60%, rgba(0,0,0,0.4))'}} />
      {shot.tag && (
        <div style={{position: 'absolute', top: 70, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18, fontFamily: FONT, fontWeight: 700, fontSize: 40, letterSpacing: 2, color: '#fff', background: urgent ? RED : '#1B3A6B', borderRadius: 50, padding: '8px 40px 12px'}}>
            {urgent && <div style={{width: 18, height: 18, borderRadius: 9, background: '#fff', opacity: 0.5 + 0.5 * Math.abs(Math.sin(f / 8))}} />}
            {shot.tag}
          </div>
        </div>
      )}
      {shot.k !== 'final' && <Captions t={t} f={f} />}
      <div style={{position: 'absolute', left: 0, top: 0, height: 10, width: W * cl(t / data.total), background: AMB}} />
      {flash > 0 && <AbsoluteFill style={{background: '#fff', opacity: flash}} />}
      <Audio src={staticFile('msftcred/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

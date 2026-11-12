import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/outlook/words.json';
import {FONT, FPS, W} from './theme';
import {F, cl, ease, sp} from './narrador';

/* Noticia R · caída de Outlook / Microsoft 365 (12 nov 2026). Estilo noticia: fondo oscuro, píldora de etiqueta, 3–5 piezas por bloque. */
type Word = {i: number; w: string; s: number; e: number; k?: boolean; p: number};
const words = data.words as Word[];
const lines = data.lines as {p: number; s: number; e: number}[];
const INK = '#0B1020', TXT = '#F5F3EE', RED = '#FF4D4F', AMB = '#FFB020', GRN = '#38D39F', BLU = '#4DA3FF', MUT = '#9FB0C9';

/* escenas = grupos de líneas del guion */
const SCENES: {k: string; lines: number[]; bg: number; tag: string}[] = [
  {k: 'hook', lines: [0], bg: 0, tag: 'ÚLTIMA HORA · 12 NOV'},
  {k: 'count', lines: [1], bg: 0, tag: 'ÚLTIMA HORA · 12 NOV'},
  {k: 'apps', lines: [2], bg: 1, tag: 'ÚLTIMA HORA · 12 NOV'},
  {k: 'servers', lines: [3, 4], bg: 1, tag: 'LO QUE DICE MICROSOFT'},
  {k: 'mx', lines: [5], bg: 2, tag: 'PARA TU DINERO EN MÉXICO'},
  {k: 'bank', lines: [6], bg: 2, tag: 'PARA TU DINERO EN MÉXICO'},
  {k: 'phish', lines: [7], bg: 3, tag: 'PARA TU DINERO EN MÉXICO'},
  {k: 'backup', lines: [8], bg: 3, tag: 'PARA TU DINERO EN MÉXICO'},
  {k: 'final', lines: [9, 10], bg: 4, tag: ''},
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

/* ---- escenas ---- */
const Hook: React.FC<SP> = ({f}) => {
  const k = sp(f, 4, 10, 170);
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 300}}>
      <div style={{transform: `scale(${0.6 + 0.4 * k}) rotate(${Math.sin(f / 5) * (f < 40 ? 1.2 : 0)}deg)`, opacity: cl(k * 2)}}><Envelope x p={sp(f, 12, 9, 200)} /></div>
      <Rise f={f} at={8} style={{marginTop: 30}}><Big size={150} color={RED}>OUTLOOK</Big></Rise>
      <Rise f={f} at={14}><Big size={150}>CAÍDO</Big></Rise>
      <Rise f={f} at={22} style={{marginTop: 24}}><Big size={50} color={MUT} w={400}>Jueves 12 de noviembre de 2026</Big></Rise>
    </AbsoluteFill>
  );
};
const Count: React.FC<SP> = ({f, t0}) => {
  const v = Math.round(130000 * ease(cl(f / 42)));
  const bars = [0.1, 0.18, 0.3, 0.45, 0.62, 0.78, 0.9, 1];
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 380}}>
      <Rise f={f} at={0}><Big size={46} color={MUT} w={600}>REPORTES DE FALLA</Big></Rise>
      <Rise f={f} at={3}><Big size={210} color={RED}>{v >= 129000 ? '≈130,000' : v.toLocaleString('en-US')}</Big></Rise>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 22, height: 260, marginTop: 50}}>
        {bars.map((b, i) => (
          <div key={i} style={{width: 66, height: 260 * b * ease(cl((f - 6 - i * 3) / 14)), background: i > 5 ? RED : AMB, borderRadius: 14}} />
        ))}
      </div>
      <Rise f={f} at={30} style={{marginTop: 34}}><Big size={52} color={MUT} w={500}>según Downdetector</Big></Rise>
    </AbsoluteFill>
  );
};
const Apps: React.FC<SP> = ({f, t0}) => {
  const at = (n: number) => F(wordStart(2, n)) - F(t0);
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 330, gap: 30}}>
      <Chip f={f} at={0} label="Outlook" c={RED} />
      <Chip f={f} at={at(1)} label="Teams" c={AMB} />
      <Chip f={f} at={at(2)} label="Copilot" c={AMB} />
      <Chip f={f} at={at(4)} label="Microsoft 365" c={AMB} />
    </AbsoluteFill>
  );
};
const Servers: React.FC<SP> = ({f, t0}) => {
  const off = F(wordStart(3, 6)) - F(t0);
  const sat = F(wordStart(3, 11)) - F(t0);
  const offs = [true, false, true, false, false, true];
  const overload = f >= sat;
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 310}}>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 190px)', gap: 26}}>
        {offs.map((o, i) => <Server key={i} off={o && f > off + i * 3} f={f} at={off + i * 3} />)}
      </div>
      <Rise f={f} at={off} style={{marginTop: 40}}>
        <Card c={RED}><div style={{fontSize: 54, fontWeight: 700}}>Servidores <span style={{color: RED}}>fuera de línea</span></div></Card>
      </Rise>
      <Rise f={f} at={sat} style={{marginTop: 24}}>
        <Card c={AMB}><div style={{fontSize: 54, fontWeight: 700}}>Los demás: <span style={{color: AMB}}>saturados</span></div></Card>
      </Rise>
      {overload && <Rise f={f} at={sat + 14} style={{marginTop: 22}}><Big size={46} color={MUT} w={500}>Origen: en investigación</Big></Rise>}
    </AbsoluteFill>
  );
};
const Mx: React.FC<SP> = ({f}) => {
  const k = sp(f, 2, 11, 160);
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 400}}>
      <div style={{transform: `scale(${0.8 + 0.2 * k})`, opacity: cl(k * 2)}}>
        <svg width={360} height={360} viewBox="-180 -180 360 360">
          <circle r={160} fill="#12254A" stroke={GRN} strokeWidth={12} />
          <text textAnchor="middle" y={44} fontFamily={FONT} fontWeight={700} fontSize={140} fill={GRN}>$</text>
        </svg>
      </div>
      <Rise f={f} at={10} style={{marginTop: 36}}><Big size={120}>Tu dinero</Big></Rise>
      <Rise f={f} at={16}><Big size={120} color={GRN}>en México</Big></Rise>
    </AbsoluteFill>
  );
};
const Num: React.FC<{n: string; c: string}> = ({n, c}) => (
  <div style={{width: 96, height: 96, borderRadius: 48, background: c, color: INK, fontFamily: FONT, fontWeight: 700, fontSize: 64, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{n}</div>
);
const Bank: React.FC<SP> = ({f}) => (
  <AbsoluteFill style={{alignItems: 'center', paddingTop: 300, gap: 34}}>
    <Rise f={f} at={0}><div style={{display: 'flex', alignItems: 'center', gap: 28}}><Num n="1" c={GRN} /><Big size={70} color={GRN}>Entra directo</Big></div></Rise>
    <Rise f={f} at={8}>
      <Card c={GRN}>
        <div style={{display: 'flex', alignItems: 'center', gap: 36}}>
          <svg width={150} height={230} viewBox="-75 -115 150 230"><rect x={-65} y={-105} width={130} height={210} rx={26} fill="#12254A" stroke={GRN} strokeWidth={9} /><rect x={-48} y={-80} width={96} height={20} rx={8} fill={GRN} /><rect x={-48} y={-40} width={96} height={14} rx={7} fill="#6FB2FF" opacity={0.6} /><rect x={-48} y={-14} width={70} height={14} rx={7} fill="#6FB2FF" opacity={0.6} /><path d="M-26 50 L-6 70 L28 30" stroke={GRN} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <div style={{fontSize: 56, fontWeight: 700, lineHeight: 1.15}}>App oficial<br /><span style={{color: GRN}}>de tu banco</span></div>
        </div>
      </Card>
    </Rise>
    <Rise f={f} at={20}>
      <Card c={RED} w={780}><div style={{display: 'flex', alignItems: 'center', gap: 30, fontSize: 52, fontWeight: 700}}><span style={{color: RED, fontSize: 80}}>✕</span> No desde un correo</div></Card>
    </Rise>
  </AbsoluteFill>
);
const Phish: React.FC<SP> = ({f}) => {
  const k = sp(f, 4, 12, 150);
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 300, gap: 30}}>
      <Rise f={f} at={0}><div style={{display: 'flex', alignItems: 'center', gap: 28}}><Num n="2" c={AMB} /><Big size={70} color={AMB}>Desconfía</Big></div></Rise>
      <div style={{opacity: cl(k * 2), transform: `translateY(${(1 - k) * 50}px)`}}>
        <Card c={AMB}>
          <div style={{fontSize: 40, color: MUT, fontWeight: 400}}>De: soporte@…</div>
          <div style={{fontSize: 48, fontWeight: 700, marginTop: 8}}>Tu cuenta fue afectada</div>
          <div style={{marginTop: 24, display: 'inline-block', background: AMB, color: INK, fontSize: 52, fontWeight: 700, padding: '10px 36px', borderRadius: 24}}>Restablece tu cuenta</div>
        </Card>
      </div>
      <Rise f={f} at={26}><div style={{display: 'flex', alignItems: 'center', gap: 20, fontFamily: FONT, fontWeight: 700, fontSize: 58, color: AMB}}><span style={{fontSize: 84}}>⚠</span> Puede ser fraude</div></Rise>
    </AbsoluteFill>
  );
};
const Backup: React.FC<SP> = ({f}) => (
  <AbsoluteFill style={{alignItems: 'center', paddingTop: 300, gap: 34}}>
    <Rise f={f} at={0}><div style={{display: 'flex', alignItems: 'center', gap: 28}}><Num n="3" c={BLU} /><Big size={70} color={BLU}>Ten respaldo</Big></div></Rise>
    <Rise f={f} at={8}><Card c={BLU}><div style={{fontSize: 56, fontWeight: 700}}>✉ Correo <span style={{color: RED}}>caído</span></div></Card></Rise>
    <Rise f={f} at={18}><Big size={90} color={MUT}>↓</Big></Rise>
    <Rise f={f} at={24}><Card c={GRN}><div style={{fontSize: 56, fontWeight: 700}}>☎ Otro canal para <span style={{color: GRN}}>avisos y pagos</span></div></Card></Rise>
  </AbsoluteFill>
);
const Final: React.FC<SP> = ({f, t0}) => {
  const k = sp(f, F(wordStart(10, 5)) - F(t0), 9, 200);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 300}}>
      <div style={{transform: `scale(${0.7 + 0.3 * sp(f, 0)})`, textAlign: 'center'}}>
        <Big size={100}>SI TE</Big>
        <Big size={100} color={AMB}>SIRVIÓ</Big>
      </div>
      <div style={{marginTop: 40, transform: `scale(${k})`, opacity: cl(k * 2)}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 90, color: INK, background: AMB, padding: '6px 44px 14px', borderRadius: 30, border: `10px solid ${TXT}`}}>LIKE + SÍGUEME</div>
      </div>
      <div style={{position: 'absolute', bottom: 300, left: 70, right: 70, textAlign: 'center', fontFamily: FONT, fontWeight: 400, fontSize: 28, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4}}>
        Contenido educativo. No constituye una recomendación de inversión. Fuentes: Microsoft 365 Status, AP, Al Jazeera, Downdetector.
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

export const Outlook: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const si = Math.max(0, shots.findIndex((s) => t >= s.a && t < s.b));
  const shot = shots[si];
  const lf = f - F(shot.a) + (si === 0 ? 10 : 0);
  const MAP: Record<string, React.FC<SP>> = {hook: Hook, count: Count, apps: Apps, servers: Servers, mx: Mx, bank: Bank, phish: Phish, backup: Backup, final: Final};
  const Comp = MAP[shot.k];
  const drift = 1 + 0.02 * cl(lf / Math.max(1, F(shot.b - shot.a)));
  const flash = lf < 3 && si !== 0 ? 0.25 * (1 - lf / 3) : 0;
  const urgent = si < 4;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Bg f={f} n={shot.bg} />
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
      <Audio src={staticFile('outlook/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/brian/words.json';
import {FONT, FPS, W} from './theme';
import {F, cl, ease, sp} from './narrador';
import {TopicBg, Motif} from './noticia-fondos';

/* Noticia R · SEGUIMIENTO de la caída de Outlook / Microsoft 365 (13 nov 2026). Estilo noticia: fondo oscuro, píldora de etiqueta, 3–5 piezas por bloque. */
type Word = {i: number; w: string; s: number; e: number; k?: boolean; p: number};
const words = data.words as Word[];
const lines = data.lines as {p: number; s: number; e: number}[];
const INK = '#0B1020', TXT = '#F5F3EE', RED = '#FF4D4F', AMB = '#FFB020', GRN = '#38D39F', BLU = '#4DA3FF', MUT = '#9FB0C9';

/* Noticia · Brian Tracy: lo que sí sabemos / lo que no (14 nov 2026). Homenaje sobrio: sin urgencia, sin llamados a seguir. */
const SCENES: {art: Motif; k: string; lines: number[]; bg: number; tag: string}[] = [
  {art: 'spot' as Motif, k: 'hook', lines: [0], bg: 0, tag: 'LO QUE SÍ SABEMOS · 14 NOV'},
  {art: 'books' as Motif, k: 'rep', lines: [1], bg: 0, tag: 'LO QUE SE HA PUBLICADO'},
  {art: 'inbox' as Motif, k: 'claims', lines: [2, 3, 4], bg: 1, tag: 'LO QUE SE HA PUBLICADO'},
  {art: 'search' as Motif, k: 'miss', lines: [5, 6], bg: 2, tag: 'LO QUE FALTA CONFIRMAR'},
  {art: 'books' as Motif, k: 'works', lines: [7], bg: 3, tag: 'LO QUE SÍ ESTÁ DOCUMENTADO'},
  {art: 'candle' as Motif, k: 'rest', lines: [8, 9], bg: 4, tag: 'HOMENAJE'},
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
  ['#1B2742', '#0B1020'], ['#16294A', '#0B1020'], ['#1E2A3A', '#0B1020'], ['#2A2438', '#0B1020'], ['#2A2030', '#05070F'],
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


const Pill: React.FC<{f: number; at: number; label: string; c: string}> = ({f, at, label, c}) => {
  const k = sp(f, at, 12, 160);
  return <div style={{opacity: cl(k * 2), transform: `translateY(${(1 - k) * 24}px)`, display: 'inline-block', fontFamily: FONT, fontWeight: 700, fontSize: 40, letterSpacing: 2, color: c, border: `4px solid ${c}`, borderRadius: 50, padding: '6px 30px 10px', background: 'rgba(255,255,255,0.05)'}}>{label}</div>;
};
const Src: React.FC<{children: React.ReactNode}> = ({children}) => <div style={{fontFamily: FONT, fontWeight: 400, fontSize: 32, color: MUT, marginTop: 6}}>{children}</div>;
const Hook: React.FC<SP> = ({f}) => (
  <AbsoluteFill style={{alignItems: 'center', paddingTop: 300}}>
    <Rise f={f} at={4}><Pill f={f} at={4} label="SIN CONFIRMACIÓN OFICIAL" c={AMB} /></Rise>
    <Rise f={f} at={10} style={{marginTop: 70}}><Big size={160}>BRIAN</Big></Rise>
    <Rise f={f} at={14}><Big size={160} color={AMB}>TRACY</Big></Rise>
    <Rise f={f} at={22} style={{marginTop: 30}}><Big size={46} color={MUT} w={400}>Autor y conferencista de desarrollo personal</Big></Rise>
    <Rise f={f} at={28} style={{marginTop: 16}}><Big size={40} color={MUT} w={400}>Publicaciones del 13 de noviembre de 2026</Big></Rise>
  </AbsoluteFill>
);
const Rep: React.FC<SP> = ({f}) => (
  <AbsoluteFill style={{alignItems: 'center', paddingTop: 320, gap: 26}}>
    <Rise f={f} at={0}><Big size={46} color={MUT} w={600}>VARIOS MEDIOS REPORTAN</Big></Rise>
    <Rise f={f} at={4}><Big size={130} color={AMB}>12 NOV 2026</Big></Rise>
    <Rise f={f} at={14}><Card c={BLU} w={760}><div style={{fontSize: 80, fontWeight: 700, textAlign: 'center'}}>82 <span style={{fontSize: 52, fontWeight: 400, color: MUT}}>años</span></div></Card></Rise>
    <Rise f={f} at={24}><Pill f={f} at={24} label="REPORTADO · NO CONFIRMADO" c={AMB} /></Rise>
    <Rise f={f} at={32}><Src>La Prensa · Diario del Yaqui · TuNota</Src></Rise>
  </AbsoluteFill>
);
const Claims: React.FC<SP> = ({f, t0}) => {
  const a2 = F(lineStart(3)) - F(t0), a3 = F(lineStart(4)) - F(t0);
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 290, gap: 26}}>
      <Rise f={f} at={0}><Card c={BLU} w={900}><div style={{fontSize: 48, fontWeight: 700}}>Su <span style={{color: AMB}}>nieto</span> compartió una carta en redes</div><Src>Según La Prensa · 13 nov, 12:25</Src></Card></Rise>
      <Rise f={f} at={a2}><Card c={MUT} w={900}><div style={{fontSize: 48, fontWeight: 700}}>La publicación <span style={{color: MUT}}>no está enlazada</span></div><Src>No se pudo verificar</Src></Card></Rise>
      <Rise f={f} at={a3}><Card c={AMB} w={900}><div style={{fontSize: 46, fontWeight: 700}}>«Aún no hay comunicado de la familia»</div><Src>TuNota · 13 nov, 9:26</Src></Card></Rise>
    </AbsoluteFill>
  );
};
const Miss: React.FC<SP> = ({f, t0}) => {
  const rows = ['Comunicado de la familia', 'Comunicado de su empresa', 'Causa', 'Lugar', 'Aviso en briantracy.com'];
  const last = F(lineStart(6)) - F(t0);
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 270, gap: 16}}>
      <Rise f={f} at={0}><Big size={50} color={MUT} w={600}>TODAVÍA SIN CONFIRMAR</Big></Rise>
      {rows.map((r, i) => (
        <Rise key={r} f={f} at={4 + i * 7}>
          <div style={{width: 880, display: 'flex', alignItems: 'center', gap: 24, background: 'rgba(255,255,255,0.07)', border: `4px solid ${MUT}`, borderRadius: 30, padding: '14px 30px'}}>
            <div style={{width: 44, height: 44, borderRadius: 22, border: `5px solid ${MUT}`}} />
            <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 44, color: TXT}}>{r}</div>
          </div>
        </Rise>
      ))}
      <Rise f={f} at={last} style={{marginTop: 20}}><Card c={AMB} w={880}><div style={{fontSize: 38, fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap'}}><span style={{color: AMB}}>Publicaciones:</span> sí · <span style={{color: AMB}}>Confirmación:</span> no</div></Card></Rise>
    </AbsoluteFill>
  );
};
const Works: React.FC<SP> = ({f}) => (
  <AbsoluteFill style={{alignItems: 'center', paddingTop: 340, gap: 12}}>
    <Rise f={f} at={0}><Big size={46} color={MUT} w={600}>SU OBRA</Big></Rise>
    <Rise f={f} at={4}><Big size={230} color={AMB}>+70</Big></Rise>
    <Rise f={f} at={10}><Big size={74}>libros publicados</Big></Rise>
    <Rise f={f} at={24} style={{marginTop: 40}}><Card c={BLU} w={860}><div style={{fontSize: 46, fontWeight: 700, textAlign: 'center'}}>Millones de personas aprendieron de él</div></Card></Rise>
    <Rise f={f} at={32}><Src>Diario del Yaqui · La Prensa</Src></Rise>
  </AbsoluteFill>
);
const Rest: React.FC<SP> = ({f, t0}) => {
  const a = F(lineStart(9)) - F(t0);
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 300, gap: 30}}>
      <Rise f={f} at={2}><Big size={96}>RECUÉRDALO</Big></Rise>
      <Rise f={f} at={8}><Big size={96} color={AMB}>CON RESPETO</Big></Rise>
      <Rise f={f} at={a} style={{marginTop: 50}}><Card c={AMB} w={880}><div style={{fontSize: 40, color: MUT, fontWeight: 400}}>Antes de compartir:</div><div style={{fontSize: 54, fontWeight: 700, marginTop: 6}}>espera la confirmación de <span style={{color: AMB}}>su familia</span></div></Card></Rise>
      <div style={{position: 'absolute', bottom: 150, left: 70, right: 70, textAlign: 'center', fontFamily: FONT, fontWeight: 400, fontSize: 24, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4}}>
        Información publicada por medios al 14 nov 2026 (La Prensa, TuNota, Diario del Yaqui) y revisión de briantracy.com. Sin confirmación oficial. Sin fines comerciales.
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

export const BrianTracy: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const si = Math.max(0, shots.findIndex((s) => t >= s.a && t < s.b));
  const shot = shots[si];
  const lf = f - F(shot.a) + (si === 0 ? 10 : 0);
  const MAP: Record<string, React.FC<SP>> = {hook: Hook, rep: Rep, claims: Claims, miss: Miss, works: Works, rest: Rest};
  const Comp = MAP[shot.k];
  const drift = 1 + 0.02 * cl(lf / Math.max(1, F(shot.b - shot.a)));
  const flash = 0;
  const urgent = false;
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
      <Audio src={staticFile('brian/voz_mix.wav')} />
    </AbsoluteFill>
  );
};

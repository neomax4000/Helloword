import React from 'react';
import {useCurrentFrame, random} from 'remotion';
import {C, F, Pop, Type, Glitch, Kicker, Stamp, Card, Evidence, Source, Counter, Stage, Big, P, lerp, useSp} from './ui';

type S = {dur: number};

/* A · cámara de seguridad, cierre de urnas */
export const A: React.FC<S> = () => {
  const f = useCurrentFrame();
  const sec = 17 + Math.floor(f / 30);
  return (
    <>
      <div style={{position: 'absolute', top: 110, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', fontFamily: F.type, fontSize: 34, color: C.bone}}>
        <span><span style={{color: C.red, opacity: Math.floor(f / 15) % 2 ? 1 : 0.2}}>●</span> REC</span>
        <span>03.11.2026 · 23:04:{String(sec).padStart(2, '0')}</span>
      </div>
      {[[70, 170], [1010, 170], [70, 1360], [1010, 1360]].map(([x, y], i) => (
        <div key={i} style={{position: 'absolute', left: x - (i % 2 ? 60 : 0), top: y - (i > 1 ? 60 : 0), width: 60, height: 60, borderColor: C.bone, borderStyle: 'solid', borderWidth: `${i < 2 ? 4 : 0}px ${i % 2 ? 4 : 0}px ${i > 1 ? 4 : 0}px ${i % 2 ? 0 : 4}px`, opacity: 0.7}} />
      ))}
      <Stage>
        <Kicker text="Estados Unidos · cierre de urnas" />
        <Glitch text="Martes" size={190} />
        <Glitch text="3 de noviembre" size={120} d={6} color={C.red} />
        <Pop d={30}><P size={34}><Type text="Elecciones intermedias. Nadie en Wall Street duerme esta noche." d={30} cps={45} /></P></Pop>
      </Stage>
    </>
  );
};

/* B · muro de pantallas en rojo */
const TK = ['NVDA', 'AMD', 'AVGO', 'MSFT', 'GOOGL', 'META', 'AMZN', 'ORCL', 'TSM', 'MU', 'SMCI', 'ARM'];
export const B: React.FC<S> = () => {
  const f = useCurrentFrame();
  return (
    <Stage gap={30}>
      <Glitch text="Las pantallas" size={110} />
      <Glitch text="se pintan de rojo" size={110} color={C.red} d={5} />
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14}}>
        {TK.map((t, i) => {
          const on = f > 8 + i * 3;
          const fl = random(`b${i}${Math.floor(f / 4)}`) > 0.93;
          const pts = Array.from({length: 12}, (_, k) => `${k * 25},${20 + k * (3 + random(`p${i}${k}`) * 6) + random(`q${i}${k}`) * 10}`).join(' ');
          return (
            <div key={t} style={{background: on ? 'rgba(120,8,18,0.35)' : 'rgba(255,255,255,0.04)', border: `2px solid ${on ? C.red : C.line}`, padding: '14px 16px', opacity: fl ? 0.4 : 1}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: F.title, fontSize: 34, color: C.bone}}><span>{t}</span><span style={{color: C.red}}>{on ? '▼' : ''}</span></div>
              <svg width="100%" height={80} viewBox="0 0 280 110" preserveAspectRatio="none">
                {on && <polyline points={pts} fill="none" stroke={C.red} strokeWidth={4} strokeDasharray={600} strokeDashoffset={lerp(f, 8 + i * 3, 30 + i * 3, 600, 0)} />}
              </svg>
            </div>
          );
        })}
      </div>
      <Pop d={40}><P size={30} color={C.faint}>Acciones ligadas a la IA · ilustrativo</P></Pop>
    </Stage>
  );
};

/* C · monitor cardiaco -24% */
export const Cc: React.FC<S> = () => {
  const f = useCurrentFrame();
  const W = 920;
  const pts: string[] = [];
  for (let x = 0; x <= W; x += 6) {
    const k = x % 180;
    const spike = k > 70 && k < 100 ? (k < 80 ? -(k - 70) * 9 : k < 90 ? -90 + (k - 80) * 16 : 70 - (k - 90) * 7) : 0;
    const drift = (x / W) * 170;
    pts.push(`${x},${140 + spike * (1 - x / W * 0.7) + drift}`);
  }
  const shown = lerp(f, 0, 45, 0, W, false);
  return (
    <Stage>
      <Kicker text="Canasta de acciones de IA" />
      <Card style={{padding: 20, background: 'rgba(0,0,0,0.6)', borderColor: 'rgba(227,18,43,0.5)'}}>
        <svg width={W} height={360} viewBox={`0 0 ${W} 360`}>
          {Array.from({length: 8}, (_, i) => <line key={i} x1={0} x2={W} y1={i * 50} y2={i * 50} stroke="rgba(227,18,43,0.12)" />)}
          <clipPath id="cl"><rect x={0} y={0} width={shown} height={360} /></clipPath>
          <polyline points={pts.join(' ')} fill="none" stroke={C.red} strokeWidth={6} clipPath="url(#cl)" style={{filter: 'drop-shadow(0 0 10px #E3122B)'}} />
        </svg>
      </Card>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 24}}>
        <Big size={260} color={C.red} style={{textShadow: '0 0 40px rgba(227,18,43,0.6)'}}><Counter to={-24} d={10} dur={24} suf="%" /></Big>
        <P size={34}>desde su máximo</P>
      </div>
      <P size={30}>Solo en octubre: <span style={{color: C.bone}}>−15%</span></P>
      <Source text="Goldman Sachs Broad AI basket, al 4 nov 2026 (vía prensa)" d={20} />
    </Stage>
  );
};

/* D · ¿explotó la burbuja? vidrio roto */
export const D: React.FC<S> = () => {
  const f = useCurrentFrame();
  const crack = lerp(f, 20, 30, 0, 1);
  return (
    <Stage>
      <Glitch text="¿Explotó" size={170} />
      <Glitch text="la burbuja" size={170} d={4} />
      <Glitch text="de la IA?" size={170} color={C.red} d={8} />
      <svg width={920} height={300} viewBox="0 0 920 300" style={{position: 'absolute', top: 120, left: 0, opacity: crack}}>
        <g stroke={C.bone} strokeWidth={3} fill="none" opacity={0.8}>
          <path d="M460 150 L300 40 L180 10 M460 150 L620 30 L760 0 M460 150 L800 170 L920 150 M460 150 L640 300 M460 150 L280 290 M460 150 L90 190 L0 230 M300 40 L340 120 M620 30 L580 110 M800 170 L720 240" strokeDasharray={1200} strokeDashoffset={1200 * (1 - crack)} />
        </g>
      </svg>
    </Stage>
  );
};

/* D2 · cartel de "se busca": el dinero huyó */
export const D2: React.FC<S> = () => {
  const f = useCurrentFrame();
  return (
    <Stage>
      <Pop d={0} style={{alignSelf: 'center'}}>
        <div style={{width: 680, background: '#E7DFC9', padding: '36px 40px', transform: 'rotate(-2deg)', boxShadow: '0 30px 80px rgba(0,0,0,0.8)', textAlign: 'center', filter: 'sepia(0.3)'}}>
          <div style={{fontFamily: F.title, fontWeight: 700, fontSize: 110, color: '#1b1612', letterSpacing: 6}}>SE BUSCA</div>
          <div style={{height: 300, margin: '20px 0', background: '#1b1612', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <span style={{fontFamily: F.title, fontSize: 220, color: '#E7DFC9', opacity: 0.9}}>$</span>
          </div>
          <div style={{fontFamily: F.type, fontSize: 34, color: '#1b1612', lineHeight: 1.3}}>El dinero de la IA.<br />Visto por última vez:<br />Wall Street, 3 nov 2026</div>
        </div>
      </Pop>
      <div style={{alignSelf: 'center', marginTop: -40}}><Stamp text="No se evaporó · huyó" d={50} size={58} /></div>
    </Stage>
  );
};

/* E1 · expediente: elecciones */
export const E1: React.FC<S> = () => (
  <Stage gap={34}>
    <Kicker text="Expediente 01 · el detonante" color={C.amber} />
    <Card style={{background: '#E7DFC9', border: 'none', padding: '40px 44px', transform: 'rotate(1deg)'}}>
      <div style={{fontFamily: F.type, fontSize: 34, color: '#1b1612', lineHeight: 1.55}}>
        <Type text={'FECHA: 03/11/2026\nEVENTO: Elecciones intermedias, EE.UU.\nRESULTADO: cambia la mayoría en Senado y Cámara.\nTEMA DE CAMPAÑA: frenar los data centers.'} d={4} cps={55} style={{whiteSpace: 'pre-line', color: '#1b1612'}} />
      </div>
    </Card>
    <div style={{alignSelf: 'flex-end'}}><Stamp text="Confidencial" d={110} rot={-6} /></div>
    <Source text="Reuters, 4 nov 2026" d={40} />
  </Stage>
);

/* E2 · visión nocturna sobre un data center */
export const E2: React.FC<S> = () => {
  const f = useCurrentFrame();
  return (
    <Stage gap={30}>
      <Kicker text="Vigilancia · data center" color={C.green} />
      <div style={{position: 'relative', border: `3px solid ${C.green}`, padding: 20, background: 'rgba(0,30,10,0.5)'}}>
        <svg width={880} height={420} viewBox="0 0 880 420">
          <rect x={60} y={150} width={760} height={230} fill="rgba(76,255,138,0.1)" stroke={C.green} strokeWidth={3} />
          {Array.from({length: 9}, (_, i) => <rect key={i} x={90 + i * 82} y={185} width={56} height={150} fill="rgba(76,255,138,0.07)" stroke={C.green} strokeWidth={2} />)}
          {Array.from({length: 9}, (_, i) => <circle key={i} cx={118 + i * 82} cy={205} r={6} fill={(Math.floor(f / 5) + i) % 3 ? C.green : 'transparent'} />)}
          {[200, 440, 680].map((x, i) => <rect key={i} x={x} y={95} width={60} height={55} fill="none" stroke={C.green} strokeWidth={3} />)}
          {[230, 470, 710].map((x, i) => <path key={i} d={`M${x} 90 q 20 ${-30 - 10 * Math.sin(f / 6 + i)} 0 -70`} stroke={C.green} strokeWidth={3} fill="none" opacity={0.5} />)}
          <line x1={0} x2={880} y1={(f * 7) % 420} y2={(f * 7) % 420} stroke="rgba(76,255,138,0.35)" strokeWidth={4} />
        </svg>
        <div style={{position: 'absolute', top: 30, right: 36, fontFamily: F.type, fontSize: 26, color: C.green}}>CAM 04 · NV</div>
      </div>
      <div style={{display: 'flex', gap: 20}}>
        <Card d={14} style={{flex: 1, borderColor: 'rgba(76,255,138,0.5)'}}><Big size={60} color={C.green}>800–1,000</Big><P size={24}>data centers planeados en EE.UU.</P></Card>
        <Card d={22} style={{flex: 1, borderColor: 'rgba(76,255,138,0.5)'}}><Big size={60} color={C.green}>1 AÑO</Big><P size={24}>de moratoria en Nueva York (jul 2026)</P></Card>
      </div>
      <Source text="Dan Ives vía Reuters; AP, ago 2026" d={30} />
    </Stage>
  );
};

/* F · pánico: futuros -2% */
export const Fp: React.FC<S> = () => {
  const f = useCurrentFrame();
  const flash = Math.floor(f / 8) % 2 === 0 && f < 70;
  return (
    <>
      <div style={{position: 'absolute', inset: 0, background: 'rgba(227,18,43,0.16)', opacity: flash ? 1 : 0}} />
      <Stage>
        <Stamp text="Pánico" size={130} rot={-4} d={0} />
        <Card d={10} style={{textAlign: 'center', borderColor: C.red}}>
          <P size={32}>Futuros del Nasdaq 100 · noche del 3 nov</P>
          <Big size={230} color={C.red}><Counter to={-2} d={14} dur={18} suf="%" /></Big>
        </Card>
        <Pop d={34}><P size={36}>Los más golpeados: <span style={{color: C.red}}>chips, data centers y nube.</span></P></Pop>
        <Source text="TheStreet / Reuters, 4 nov 2026" d={30} />
      </Stage>
    </>
  );
};

/* G · tablero de detective: sospechosos que gastan */
const SUS = [
  {t: 'AMZN', n: 'Amazon', v: '≈ $220'}, {t: 'GOOGL', n: 'Alphabet', v: '$195–205'},
  {t: 'MSFT', n: 'Microsoft', v: '$175–190'}, {t: 'META', n: 'Meta', v: '$135–145'},
];
export const G: React.FC<S> = () => {
  const f = useCurrentFrame();
  const pos = [[0, 0], [470, 30], [10, 360], [480, 390]];
  const s = useSp(150, 9, 220);
  return (
    <Stage gap={20}>
      <Kicker text="Los que más gastan en IA · 2026" color={C.amber} />
      <div style={{position: 'relative', height: 730}}>
        <svg width={920} height={730} style={{position: 'absolute', inset: 0}}>
          {pos.map(([x, y], i) => (
            <line key={i} x1={x + 210} y1={y + 40} x2={460} y2={365} stroke={C.red} strokeWidth={4} strokeDasharray={600} strokeDashoffset={lerp(f, 60 + i * 8, 90 + i * 8, 600, 0)} />
          ))}
        </svg>
        {SUS.map((x, i) => (
          <div key={x.t} style={{position: 'absolute', left: pos[i][0], top: pos[i][1]}}>
            <Evidence d={4 + i * 10} rot={[-4, 3, 2, -3][i]} w={420} label={`${x.n}`}>
              <Big size={64}>{x.t}</Big>
              <P size={30} color={C.amber}>{x.v} mil M USD</P>
            </Evidence>
          </div>
        ))}
        <div style={{position: 'absolute', left: 230, top: 300, width: 460, textAlign: 'center', transform: `scale(${2 - s})`, opacity: s, background: 'rgba(0,0,0,0.85)', border: `4px solid ${C.red}`, padding: '20px 10px'}}>
          <Big size={84} color={C.red}>$750 MIL M</Big>
          <P size={24}>juntas en 2026 · +77% vs 2025</P>
        </div>
      </div>
      <Source text="Guías de las empresas (jul–oct 2026); Bloomberg; Goldman Sachs" d={40} />
    </Stage>
  );
};

/* H · dinero atrapado tras las rejas */
export const H: React.FC<S> = () => {
  const f = useCurrentFrame();
  const drop = lerp(f, 0, 14, -400, 0);
  return (
    <Stage>
      <Glitch text="Dinero atrapado" size={120} />
      <div style={{position: 'relative', height: 330, alignSelf: 'center', width: 620}}>
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.title, fontSize: 240, color: C.amber, opacity: 0.9}}>$</div>
        <div style={{position: 'absolute', inset: 0, display: 'flex', justifyContent: 'space-around', transform: `translateY(${drop}px)`}}>
          {Array.from({length: 8}, (_, i) => <div key={i} style={{width: 18, height: '100%', background: 'linear-gradient(90deg,#555,#bbb,#444)'}} />)}
        </div>
      </div>
      <div style={{display: 'flex', gap: 20}}>
        <Card d={10} style={{flex: 1}}><P size={24}>Flujo libre Q3 · Alphabet</P><Big size={64} color={C.red}>≈ −$9 MIL M</Big></Card>
        <Card d={16} style={{flex: 1}}><P size={24}>Flujo libre Q3 · Meta</P><Big size={64} color={C.red}>≈ −$2 MIL M</Big></Card>
      </div>
      <Source text="Análisis Reuters/LSEG vía 24/7 Wall St., 31 oct 2026" d={20} />
    </Stage>
  );
};

/* I · cadena: 1/3 del S&P 500 */
const MAG = ['NVDA', 'MSFT', 'AAPL', 'AMZN', 'GOOGL', 'META', 'TSLA'];
export const I: React.FC<S> = () => {
  const f = useCurrentFrame();
  const p = lerp(f, 4, 36, 0, 0.34);
  const R = 190, L = 2 * Math.PI * R;
  const pull = lerp(f, 110, 170, 0, 50);
  return (
    <Stage>
      <Glitch text="Un tercio" size={140} />
      <Glitch text="de la bolsa" size={110} color={C.red} d={4} />
      <div style={{position: 'relative', alignSelf: 'center', transform: `translateY(${pull}px)`}}>
        <svg width={500} height={500} viewBox="0 0 500 500">
          <circle cx={250} cy={250} r={R} fill="none" stroke="rgba(237,230,214,0.1)" strokeWidth={60} />
          <circle cx={250} cy={250} r={R} fill="none" stroke={C.red} strokeWidth={60} strokeDasharray={`${L * p} ${L}`} transform="rotate(-90 250 250)" />
        </svg>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <Big size={130}><Counter to={34} d={4} dur={32} suf="%" /></Big><P size={26}>del S&amp;P 500</P>
        </div>
      </div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center'}}>
        {MAG.map((t, i) => <Pop key={t} d={24 + i * 4}><div style={{fontFamily: F.title, fontSize: 34, color: C.bone, border: `2px solid ${C.red}`, padding: '6px 16px'}}>⛓ {t}</div></Pop>)}
      </div>
      <Source text="Charles Schwab, ago 2026 · las 7 magníficas" d={30} />
    </Stage>
  );
};

/* J · CTA: si haces scroll, te lo pierdes */
export const J: React.FC<S> = ({dur}) => {
  const f = useCurrentFrame();
  const sc = (f * 9) % 260;
  const glow = 0.5 + 0.5 * Math.sin(f / 4);
  return (
    <Stage gap={36}>
      <Glitch text="Si haces scroll…" size={110} />
      <div style={{alignSelf: 'center', width: 380, height: 640, borderRadius: 50, border: `6px solid ${C.bone}`, overflow: 'hidden', position: 'relative', background: '#050506'}}>
        {[0, 1, 2].map((k) => (
          <div key={k} style={{position: 'absolute', left: 20, right: 20, top: 30 + k * 260 - sc, height: 230, borderRadius: 16, background: k === 1 ? 'rgba(227,18,43,0.25)' : 'rgba(255,255,255,0.06)', opacity: k === 1 ? 1 - lerp(f, 60, 100, 0, 1) : 1}} />
        ))}
        <div style={{position: 'absolute', bottom: 40, left: 0, right: 0, textAlign: 'center', fontSize: 70, color: C.bone, transform: `translateY(${-(f % 30)}px)`, opacity: 0.8}}>☝</div>
      </div>
      <Pop d={40}><P size={38} color={C.bone} style={{textAlign: 'center'}}>…esta cuenta <span style={{color: C.red}}>desaparece</span> de tu vida.</P></Pop>
      <Pop d={200}>
        <div style={{alignSelf: 'center', margin: '0 auto', background: C.red, color: C.bone, fontFamily: F.title, fontWeight: 700, fontSize: 60, padding: '16px 60px', borderRadius: 12, boxShadow: `0 0 ${30 + 30 * glow}px rgba(227,18,43,0.8)`, width: 'fit-content'}}>+ SEGUIR</div>
      </Pop>
    </Stage>
  );
};

/* K · pista 1: salud */
export const K: React.FC<S> = () => {
  const f = useCurrentFrame();
  const a = lerp(f, 90, 120, 0, 1), bb = lerp(f, 96, 126, 0, 20.1 / 22.965);
  return (
    <Stage gap={30}>
      <Kicker text="Pista #1 · salud" color={C.amber} />
      <div style={{display: 'flex', gap: 30, justifyContent: 'center'}}>
        <Evidence d={6} rot={-4} w={420} label="Eli Lilly · LLY">
          <svg width={370} height={110} viewBox="0 0 370 110"><rect x={20} y={35} width={260} height={44} rx={22} fill="#cfd6de" /><rect x={60} y={42} width={110} height={30} rx={6} fill="#E3122B" opacity={0.8} /><rect x={280} y={45} width={50} height={24} rx={5} fill="#8a96a3" /><path d="M330 57 H360" stroke="#ccc" strokeWidth={4} /></svg>
          <P size={24} color={C.bone}>Mounjaro / Zepbound</P>
        </Evidence>
        <Evidence d={14} rot={3} w={420} label="Novo Nordisk · NVO">
          <svg width={370} height={110} viewBox="0 0 370 110"><g transform="rotate(-18 185 55)"><rect x={90} y={30} width={190} height={56} rx={28} fill="#eee" /><path d="M185 30 H252 A28 28 0 0 1 252 86 H185 Z" fill="#E3122B" /></g></svg>
          <P size={24} color={C.bone}>Ozempic / Wegovy</P>
        </Evidence>
      </div>
      <Card d={80}>
        <P size={26}>Ventas 2025 (USD)</P>
        {[['Mounjaro', a, '$22,965 M'], ['Ozempic', bb, '$20,100 M']].map(([n, w, v]) => (
          <div key={n as string} style={{marginTop: 14}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: F.title, fontSize: 38, color: C.bone}}><span>{n}</span><span style={{color: C.amber}}>{v}</span></div>
            <div style={{height: 22, background: 'rgba(255,255,255,0.08)', marginTop: 6}}><div style={{height: 22, width: `${(w as number) * 100}%`, background: C.red}} /></div>
          </div>
        ))}
      </Card>
      <Source text="BioSpace, abr 2026" d={80} />
    </Stage>
  );
};

/* L · línea de tiempo: de la inyección a la pastilla + cáncer */
export const L: React.FC<S> = () => {
  const f = useCurrentFrame();
  return (
    <Stage gap={34}>
      <Glitch text="De la inyección" size={100} />
      <Glitch text="a la pastilla" size={100} color={C.red} d={4} />
      {[['ENE 2026', 'Novo Nordisk lanza Wegovy en pastilla', 8], ['ABR 2026', 'Lilly logra la aprobación de Foundayo', 40]].map(([d, t, dl]) => (
        <Card key={d as string} d={dl as number} style={{display: 'flex', gap: 26, alignItems: 'center', padding: '22px 30px'}}>
          <Big size={52} color={C.amber}>{d}</Big><P size={30} color={C.bone}>{t}</P>
        </Card>
      ))}
      <Card d={150} style={{borderColor: C.red}}>
        <P size={28} color={C.red} style={{fontFamily: F.title, fontSize: 40}}>+ ONCOLOGÍA</P>
        <P size={28}>Tratamientos contra el cáncer: largos y difíciles de sustituir.</P>
      </Card>
      <Source text="FDA vía Reuters y AP, 2026" d={40} />
    </Stage>
  );
};

/* M · pista 2: energía, torres en la noche */
export const M: React.FC<S> = () => {
  const f = useCurrentFrame();
  const fl = random(`m${Math.floor(f / 3)}`) > 0.85 ? 0.35 : 1;
  return (
    <Stage gap={30}>
      <Kicker text="Pista #2 · energía" color={C.amber} />
      <Glitch text="La IA tiene hambre" size={100} />
      <Glitch text="de electricidad" size={100} color={C.amber} d={4} />
      <svg width={920} height={360} viewBox="0 0 920 360" style={{opacity: fl}}>
        {[0, 1, 2].map((i) => <path key={i} transform={`translate(${70 + i * 300},20)`} d="M60 320 L100 20 L140 320 M75 210 H125 M85 120 H115 M30 60 H170" stroke={C.bone} strokeWidth={5} fill="none" />)}
        <path d="M100 80 Q250 140 400 80 Q550 20 700 80" stroke={C.amber} strokeWidth={4} fill="none" strokeDasharray="16 10" strokeDashoffset={-f * 3} style={{filter: 'drop-shadow(0 0 8px #FFB020)'}} />
      </svg>
      <Card d={40} style={{display: 'flex', alignItems: 'center', gap: 26}}>
        <Big size={96} color={C.green}>+8%</Big><P size={28}>ETF solar TAN el 4 nov, la mañana después de la elección</P>
      </Card>
      <Source text="TheStreet, 4 nov 2026" d={40} />
    </Stage>
  );
};

/* N · México: Banxico */
export const N: React.FC<S> = () => {
  const f = useCurrentFrame();
  const v = lerp(f, 110, 140, 6.5, 6.25);
  const shake = f > 90 && f < 104 ? Math.sin(f * 3) * 10 : 0;
  return (
    <Stage gap={30}>
      <Kicker text="Jueves 5 nov · México" />
      <Glitch text="El golpe llega a México" size={96} />
      <div style={{textAlign: 'center', transform: `translateX(${shake}px)`}}>
        <P size={30}>Tasa de Banxico</P>
        <Big size={250} color={C.red} style={{textShadow: '0 0 40px rgba(227,18,43,0.5)'}}>{v.toFixed(2)}%</Big>
        <P size={30}>antes 6.50% · <span style={{color: C.bone}}>los Cetes pagarán menos</span></P>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 30, justifyContent: 'center'}}>
        <Stamp text="Sorpresa" d={150} rot={-5} size={56} />
        <Pop d={160}><P size={28}><span style={{fontFamily: F.title, fontSize: 56, color: C.bone}}>30/36</span> analistas esperaban<br />que no la movieran</P></Pop>
      </div>
      <Source text="Banxico; Encuesta Citi; El Informador, 6 nov 2026" d={150} />
    </Stage>
  );
};

/* O · diferencial MX vs EE.UU. y el dinero que se va */
export const O: React.FC<S> = () => {
  const f = useCurrentFrame();
  const mx = lerp(f, 4, 30, 0, 6.25 / 7), us = lerp(f, 10, 36, 0, 4 / 7);
  return (
    <Stage gap={28}>
      <Glitch text="Cada vez más cerca" size={104} />
      <div style={{display: 'flex', justifyContent: 'center', gap: 90, alignItems: 'flex-end', height: 460}}>
        {[['MÉXICO', mx, '6.25%', C.red], ['EE.UU.', us, '3.75–4.00%', C.bone]].map(([n, h, v, c]) => (
          <div key={n as string} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
            <Big size={50} color={c as string}>{v}</Big>
            <div style={{width: 200, height: 380 * (h as number), background: c as string, opacity: 0.85}} />
            <Big size={36}>{n}</Big>
          </div>
        ))}
      </div>
      <Card d={40} style={{textAlign: 'center', borderColor: C.red}}><Big size={72} color={C.red}>225 PB</Big><P size={26}>de diferencia · la más chica de la historia</P></Card>
      <Pop d={170}>
        <div style={{display: 'flex', justifyContent: 'center', gap: 18, fontFamily: F.title, fontSize: 46, color: C.amber}}>
          {[0, 1, 2, 3].map((i) => <span key={i} style={{transform: `translateY(${-((f * 4 + i * 20) % 60)}px)`, opacity: 0.9}}>$↑</span>)}
          <span style={{color: C.dim, fontSize: 34, alignSelf: 'center'}}>capital que se va</span>
        </div>
      </Pop>
      <Source text="Banco Base; Reserva Federal, 28 oct 2026" d={40} />
    </Stage>
  );
};

/* P · el dólar en 18.74, el peso tiembla */
export const Pp: React.FC<S> = () => {
  const f = useCurrentFrame();
  const tremble = f > 160 ? Math.sin(f * 2.5) * 6 : 0;
  return (
    <Stage gap={30}>
      <Kicker text="Cierre del jueves 5 nov" />
      <Card style={{textAlign: 'center', background: 'rgba(0,0,0,0.8)'}}>
        <P size={32}>1 dólar =</P>
        <Big size={220} style={{fontVariantNumeric: 'tabular-nums'}}>$<Counter from={18.56} to={18.74} dec={2} d={40} dur={40} /></Big>
        <P size={32}>pesos</P>
      </Card>
      <div style={{display: 'flex', gap: 20}}>
        <Card d={140} style={{flex: 1, textAlign: 'center'}}><Big size={60} color={C.green}>▲ DÓLAR</Big></Card>
        <Card d={160} style={{flex: 1, textAlign: 'center', transform: `translateX(${tremble}px)`}}><Big size={60} color={C.red}>▼ PESO</Big><P size={24}>−0.99% en un día</P></Card>
      </div>
      <Source text="Banxico vía El Financiero, 5 nov 2026" d={40} />
    </Stage>
  );
};

/* Q · ejemplo: el dólar amortigua pero no salva */
export const Q: React.FC<S> = () => {
  const f = useCurrentFrame();
  return (
    <Stage gap={30}>
      <Glitch text="Tu bolsillo" size={130} />
      <P size={32}>Si inviertes desde México en acciones de EE.UU.:</P>
      <Card d={6}>
        <P size={24} color={C.amber} style={{fontFamily: F.type}}>EJEMPLO ILUSTRATIVO</P>
        {[['La acción cae (USD)', '−10%', C.red, 20], ['El dólar sube', '+1%', C.green, 70], ['Tú, en pesos', '≈ −9.1%', C.bone, 150]].map(([a, v, c, d]) => (
          <div key={a as string} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, opacity: lerp(f, d as number, (d as number) + 10, 0, 1)}}>
            <P size={34} color={C.bone}>{a}</P><Big size={76} color={c as string}>{v}</Big>
          </div>
        ))}
      </Card>
      <div style={{alignSelf: 'center'}}><Stamp text="Amortigua · no te salva" d={195} size={54} rot={-4} /></div>
    </Stage>
  );
};

/* R · dos puertas */
export const R: React.FC<S> = () => {
  const f = useCurrentFrame();
  const door = (label: string, sub: string, c: string, d: number, open: number) => (
    <Pop d={d} style={{flex: 1}}>
      <div style={{height: 560, border: `4px solid ${c}`, position: 'relative', overflow: 'hidden', background: 'rgba(0,0,0,0.6)', perspective: 800}}>
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${c}55, transparent)`, opacity: open}} />
        <div style={{position: 'absolute', inset: 0, background: '#0d0c0b', border: `2px solid ${C.line}`, transformOrigin: 'left', transform: `rotateY(${-70 * open}deg)`}}>
          <div style={{position: 'absolute', right: 26, top: 280, width: 18, height: 18, borderRadius: 9, background: c}} />
        </div>
        <div style={{position: 'absolute', bottom: 30, left: 0, right: 0, textAlign: 'center'}}>
          <Big size={52} color={c}>{label}</Big><P size={24}>{sub}</P>
        </div>
      </div>
    </Pop>
  );
  return (
    <Stage gap={30}>
      <Glitch text="¿Qué harías tú?" size={120} />
      <div style={{display: 'flex', gap: 30}}>
        {door('COMPRAR BARATO', 'aprovechar la caída', C.green, 20, lerp(f, 40, 70, 0, 1))}
        {door('SALIR CORRIENDO', 'antes de que caiga más', C.red, 90, lerp(f, 110, 140, 0, 1))}
      </div>
      <Pop d={230}><P size={36} color={C.bone} style={{textAlign: 'center'}}>💬 Te leo en los comentarios</P></Pop>
    </Stage>
  );
};

/* S · cierre: pulsa el corazón */
export const Sx: React.FC<S> = () => {
  const f = useCurrentFrame();
  const beat = (t: number) => Math.max(0, Math.sin(Math.min(Math.PI, t * 0.5)));
  const k = f % 28;
  const sc = 1 + 0.14 * beat(k) + 0.08 * beat(k - 8);
  const filled = f > 60;
  return (
    <Stage gap={34}>
      <div style={{alignSelf: 'center', transform: `scale(${sc})`}}>
        <svg width={300} height={270} viewBox="0 0 24 22">
          <path d="M12 21 C 5 15, 1 11.5, 1 7 A 5.5 5.5 0 0 1 12 4.5 A 5.5 5.5 0 0 1 23 7 C 23 11.5, 19 15, 12 21 Z" fill={filled ? C.red : 'none'} stroke={C.red} strokeWidth={1.4} style={{filter: 'drop-shadow(0 0 1px #E3122B)'}} />
        </svg>
      </div>
      <Glitch text="Pulsa el corazón" size={110} d={10} />
      <Pop d={30}><P size={34}>Para ti es un segundo. A mí me ayuda a seguir haciendo estos videos.</P></Pop>
      <Pop d={190}>
        <div style={{background: C.red, color: C.bone, fontFamily: F.title, fontWeight: 700, fontSize: 54, padding: '14px 50px', borderRadius: 12, width: 'fit-content', margin: '0 auto'}}>+ SÍGUEME</div>
      </Pop>
      <Pop d={230}><P size={22} color={C.faint} style={{textAlign: 'center', fontFamily: F.type}}>Contenido educativo. No es recomendación de inversión.</P></Pop>
    </Stage>
  );
};

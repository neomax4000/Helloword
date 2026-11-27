// NOTICIA N3 · GANADORES Y PERDEDORES — semana de pruebas (2026-11-27)
// P (previa de la semana): empleo de EE.UU. (BLS, vie 4 dic 08:30) y reunión de la Fed (8-9 dic).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/marcador-dolar/words.json';
import {Captions, Chip, FONT, FPS, Frame, Grain, Mask, P, Pop, Rise, Scene, Wd, buildGroups, cl, easeOut, lerp, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const MARCADOR_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1));
const groups = buildGroups(words, blocks);
const KEYS = ['DÓLAR', 'VIERNES', 'FUERTE', 'DÉBIL', 'GANA', 'PIERDE', 'MARCADOR', 'REMESAS', 'FED', 'LADO'];

const NAVY = '#070D24';
const LED = '#FFC247';
const GRID = 'rgba(255,255,255,0.07)';
const abs = (x: number, y: number, w?: number): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w});
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
const txt = (size: number, weight = 800, color: string = P.white, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});
const led = (size: number, color = LED): React.CSSProperties => ({...txt(size, 800, color, 0.02), textShadow: `0 0 28px ${color}99, 0 0 6px ${color}`});

/** tablero deportivo */
const Board: React.FC<{y: number; h: number; children: React.ReactNode; glow?: string}> = ({y, h, children, glow = LED}) => (
  <div style={{position: 'absolute', left: 90, top: y, width: 900, height: h, borderRadius: 36, background: 'linear-gradient(180deg,#141C44 0%,#0B1130 100%)', border: `6px solid ${glow}55`, boxShadow: `0 0 80px ${glow}33, 0 40px 80px rgba(0,0,0,0.6)`, overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${GRID} 3px, transparent 3.5px)`, backgroundSize: '22px 22px'}} />
    {children}
  </div>
);

const Hook: React.FC<{scale?: number}> = ({scale = 1}) => (
  <div style={{position: 'absolute', inset: 0, transform: `scale(${scale})`, transformOrigin: '50% 40%'}}>
    <div style={{...center(215), ...txt(44, 700, P.mute, 0.3)}}>EL MARCADOR DE LA SEMANA</div>
    <Board y={310} h={780}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', ...txt(60, 700, P.mute, 0.25)}}>VIERNES</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 130, textAlign: 'center', ...led(380)}}>4</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center', ...led(110, P.mint)}}>DIC · TU DÓLAR</div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 680, height: 6, background: 'rgba(255,255,255,0.18)'}} />
    </Board>
  </div>
);

const S1: React.FC = () => (
  <Scene a={A[0]} b={A[1]} kind="none" out="up">
    {(lt) => (
      <AbsoluteFill style={{transform: `scale(${lerp(1.06, 1, easeOut(lt / 0.5))})`}}>
        <Hook />
        <Rise at={T(3)} style={center(1150)}>
          <Chip size={30}>PREVIA · EMPLEO DE EE.UU.</Chip>
        </Rise>
      </AbsoluteFill>
    )}
  </Scene>
);

/** reloj 08:30 */
const S2: React.FC = () => (
  <Scene a={A[1]} b={A[2]} kind="left" out="left">
    {(lt, f) => {
      const t = f / FPS;
      const blink = Math.floor(t * 2) % 2 === 0 ? 1 : 0.35;
      const pop = spr(f, T(17), 9, 220, 0.6);
      return (
        <>
          <div style={{...center(215), ...txt(44, 700, P.mute, 0.3)}}>HORA DE LA PUBLICACIÓN</div>
          <Board y={310} h={560}>
            <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', ...led(300)}}>
              08<span style={{opacity: blink}}>:</span>30
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 440, textAlign: 'center', ...txt(46, 700, P.mute, 0.18)}}>HORA DE NUEVA YORK</div>
          </Board>
          <Rise at={T(10)} style={center(920)}>
            <Chip size={34} bg="rgba(255,255,255,0.12)">≈ 7:30 EN CDMX</Chip>
          </Rise>
          <div style={{position: 'absolute', left: 90, top: 1030, width: 900, opacity: cl(pop * 2), transform: `translateY(${(1 - pop) * 40}px)`}}>
            <div style={{...txt(72, 800, P.white, -0.02), whiteSpace: 'normal'}}>Empleos creados en EE.UU. en noviembre</div>
          </div>
          <Rise at={T(19)} style={center(1250)}>
            <Chip size={28}>FUENTE · BLS · EMPLOYMENT SITUATION</Chip>
          </Rise>
        </>
      );
    }}
  </Scene>
);

/** dato previo: octubre */
const S3: React.FC = () => (
  <Scene a={A[2]} b={A[3]} kind="zoom" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(26) - 0.05, T(30) + 0.3));
      const u = easeOut(prog(t, T(34) - 0.05, T(36) + 0.4));
      return (
        <>
          <div style={{...center(215), ...txt(44, 700, P.mute, 0.3)}}>EL DATO ANTERIOR · OCTUBRE</div>
          <Board y={310} h={430}>
            <div style={{position: 'absolute', left: 0, right: 0, top: 50, textAlign: 'center', ...txt(40, 700, P.mute, 0.2)}}>EMPLEOS NUEVOS (PRELIMINAR)</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 140, textAlign: 'center', ...led(180, P.mint)}}>+{Math.round(c * 165000).toLocaleString('en-US')}</div>
          </Board>
          <Board y={790} h={300} glow={P.coral}>
            <div style={{position: 'absolute', left: 0, right: 0, top: 36, textAlign: 'center', ...txt(40, 700, P.mute, 0.2)}}>DESEMPLEO</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center', ...led(170, P.coral)}}>{(u * 4.1).toFixed(1)}%</div>
          </Board>
          <Rise at={T(37)} style={center(1160)}>
            <Chip size={28}>BLS · INDICADORES · PUBLICADO 20 NOV 2026</Chip>
          </Rise>
        </>
      );
    }}
  </Scene>
);

/** marcador 0-0 */
const S4: React.FC = () => (
  <Scene a={A[3]} b={A[4]} kind="up" out="left">
    {(lt, f) => {
      const s = spr(f, T(43), 9, 220, 0.6);
      return (
        <>
          <div style={{...center(215), ...txt(44, 700, P.mute, 0.3)}}>MARCADOR</div>
          <Board y={310} h={640}>
            <div style={{position: 'absolute', left: 50, top: 70, width: 380, textAlign: 'center', ...txt(50, 800, P.mint, 0.06)}}>DATO FUERTE</div>
            <div style={{position: 'absolute', left: 470, top: 70, width: 380, textAlign: 'center', ...txt(50, 800, P.coral, 0.06)}}>DATO DÉBIL</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 200, textAlign: 'center', ...led(300), transform: `scale(${lerp(0.4, 1, s)})`, opacity: cl(s * 2)}}>? : ?</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', ...txt(40, 700, P.mute, 0.2)}}>GANAN · PIERDEN</div>
          </Board>
        </>
      );
    }}
  </Scene>
);

/** columnas ganan/pierden */
const Duel: React.FC<{head: string; hc: string; arrow: string; win: string[]; lose: string[]; tw: number; tl: number; tb: number}> = ({head, hc, arrow, win, lose, tw, tl, tb}) => (
  <>
    <div style={{...center(200), ...txt(44, 700, P.mute, 0.3)}}>{head}</div>
    <Rise at={tb} style={center(270)}>
      <div style={{...led(120, hc)}}>{arrow}</div>
    </Rise>
    <Pop at={tw} from={0.7} style={abs(90, 470, 900)}>
      <div style={{background: 'rgba(25,214,150,0.16)', border: `6px solid ${P.mint}`, borderRadius: 32, padding: '28px 36px'}}>
        <div style={txt(46, 800, P.mint, 0.08)}>✔ GANA</div>
        {win.map((x, i) => <div key={i} style={{...txt(58, 800, P.white, -0.01), marginTop: 14}}>{x}</div>)}
      </div>
    </Pop>
    <Pop at={tl} from={0.7} style={abs(90, 850, 900)}>
      <div style={{background: 'rgba(255,90,95,0.16)', border: `6px solid ${P.coral}`, borderRadius: 32, padding: '28px 36px'}}>
        <div style={txt(46, 800, P.coral, 0.08)}>✘ PIERDE</div>
        {lose.map((x, i) => <div key={i} style={{...txt(58, 800, P.white, -0.01), marginTop: 14}}>{x}</div>)}
      </div>
    </Pop>
  </>
);

const S5: React.FC = () => (
  <Scene a={A[4]} b={A[5]} kind="left" out="up">
    {() => <Duel head="SI SALE FUERTE" hc={P.mint} arrow="DÓLAR SUELE ↑" win={['quien cobra en dólares']} lose={['viajes en dólares', 'compras en línea', 'tarjeta en dólares']} tw={T(53) - 0.05} tl={T(58) - 0.05} tb={T(49)} />}
  </Scene>
);

const S6: React.FC = () => (
  <Scene a={A[5]} b={A[6]} kind="zoom" out="left">
    {(lt, f) => {
      const t = f / FPS;
      const k = easeOut(prog(t, T(84), T(88)));
      return (
        <>
          <Duel head="SI SALE DÉBIL" hc={P.coral} arrow="DÓLAR SUELE ↓" win={['quien paga en dólares']} lose={['quien recibe remesas']} tw={T(74) - 0.05} tl={T(79) - 0.05} tb={T(69)} />
          <Rise at={T(83)} style={abs(90, 1075, 900)}>
            <div style={{background: '#F5F3EE', borderRadius: 28, padding: '26px 36px', boxShadow: '0 30px 60px rgba(0,0,0,0.5)'}}>
              <div style={{...txt(26, 700, 'rgba(7,13,36,0.6)', 0.06)}}>EJEMPLO HIPOTÉTICO · REMESA DE 500 DÓLARES</div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10}}>
                <div style={txt(40, 800, NAVY, -0.02)}>a $18.00 → ${(lerp(9000, 9000, k)).toLocaleString('en-US')}</div>
                <div style={{...txt(40, 800, '#C2272D', -0.02), opacity: k}}>a $17.00 → $8,500</div>
              </div>
            </div>
          </Rise>
        </>
      );
    }}
  </Scene>
);

/** Fed 8-9 dic */
const S7: React.FC = () => (
  <Scene a={A[6]} b={A[7]} kind="up" out="zoom">
    {(lt, f) => {
      const t = f / FPS;
      const lit = easeOut(prog(t, T(91) - 0.1, T(94) + 0.3));
      const q = easeOut(prog(t, T(104), T(106) + 0.4));
      return (
        <>
          <div style={{...center(200), ...txt(44, 700, P.mute, 0.3)}}>OTRA JUGADA</div>
          <Board y={290} h={520} glow={P.mint}>
            <div style={{position: 'absolute', left: 0, right: 0, top: 50, textAlign: 'center', ...txt(46, 700, P.mute, 0.2)}}>DICIEMBRE</div>
            <div style={{display: 'flex', justifyContent: 'center', gap: 60, position: 'absolute', left: 0, right: 0, top: 130}}>
              {['8', '9'].map((d, i) => (
                <div key={d} style={{...led(280, P.mint), opacity: i === 0 ? 1 : cl(lit * 2 - (i === 1 ? 0.5 : 0)), transform: `scale(${lerp(0.7, 1, i === 0 ? 1 : lit)})`}}>{d}</div>
              ))}
            </div>
          </Board>
          <Rise at={T(97)} style={abs(110, 860, 860)}>
            <div style={{...txt(84, 800, P.white, -0.02)}}>Reunión de la Fed</div>
          </Rise>
          <Rise at={T(99)} style={center(1010)}>
            <Chip size={28}>FED · CALENDARIO FOMC 2026</Chip>
          </Rise>
          <div style={{...center(1110), opacity: q, transform: `translateY(${(1 - q) * 30}px)`}}>
            <div style={{...txt(48, 800, NAVY, 0), background: LED, padding: '16px 36px', borderRadius: 22}}>¿De qué lado juegas tú?</div>
          </div>
        </>
      );
    }}
  </Scene>
);

const S8: React.FC = () => (
  <Scene a={A[7]} b={MARCADOR_TOTAL} kind="zoom" out="none">
    {(lt) => <Hook scale={lerp(0.9, 1, easeOut(lt / 0.5))} />}
  </Scene>
);

const PASOS = [
  {at: 0, label: 'EL MARCADOR'},
  {at: A[1], label: 'EL DATO'},
  {at: A[4], label: 'GANAN Y PIERDEN'},
  {at: A[6], label: 'LA FED'},
  {at: A[7], label: 'EL MARCADOR'},
];

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const p = spr(f, A[6] + 0.3, 12, 200, 0.6);
  if (t < A[6] + 0.3 || t > A[7]) return null;
  return (
    <div style={{position: 'absolute', right: 70, top: 160, transform: `translateX(${(1 - p) * 200}px)`, opacity: cl(p * 2)}}>
      <Chip bg={P.white} color={P.ink} size={26}>＋ SÍGUEME</Chip>
    </div>
  );
};

const Bg: React.FC = () => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 90) * 60;
  return (
    <AbsoluteFill style={{background: `radial-gradient(90% 55% at ${50 + sw / 10}% 0%, #26357A 0%, ${NAVY} 70%)`}}>
      <div style={{position: 'absolute', left: -100 + sw, top: -80, width: 500, height: 1100, background: 'linear-gradient(180deg, rgba(255,194,71,0.20), transparent)', transform: 'rotate(-18deg)', filter: 'blur(30px)'}} />
      <div style={{position: 'absolute', right: -100 - sw, top: -80, width: 500, height: 1100, background: 'linear-gradient(180deg, rgba(255,255,255,0.14), transparent)', transform: 'rotate(18deg)', filter: 'blur(30px)'}} />
    </AbsoluteFill>
  );
};

export const MarcadorDolarMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <AbsoluteFill style={{background: NAVY}}>
    <Bg />
    <S1 /><S2 /><S3 /><S4 /><S5 /><S6 /><S7 /><S8 />
    <Grain />
    <Frame serie="PREVIA · 27 NOV" total={MARCADOR_TOTAL} pasos={PASOS} nota="Contenido educativo, no es recomendación de inversión. Fuentes: BLS, calendario Employment Situation (nov 2026: 4 dic, 08:30) e indicadores del 20 nov 2026; Fed, calendario FOMC 2026 (8-9 dic). Ejemplo de remesa hipotético; no es pronóstico." />
    <Cta />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('marcador-dolar/voz_mix.wav')} />}
  </AbsoluteFill>
);

export const MarcadorDolarCover: React.FC = () => (
  <AbsoluteFill style={{background: NAVY}}>
    <Bg />
    <Hook />
    <div style={{...center(1150), ...txt(66, 800, P.white, -0.01)}}>¿quién gana y quién pierde?</div>
    <div style={center(1290)}><Chip size={30}>PREVIA · EMPLEO EE.UU. Y FED</Chip></div>
    <Grain />
  </AbsoluteFill>
);

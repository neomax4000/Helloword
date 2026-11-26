// NOTICIA N2 · EL TITULAR vs LO QUE IMPORTA — semana de pruebas (2026-11-26)
// R: ENOE 3T 2026 (INEGI, boletín 703/26, 25 nov 2026): el titular «desempleo 2.9 %» y la letra chica.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/titular-enoe/words.json';
import {Captions, Chip, FONT, FPS, Frame, Grain, Mask, P, Pop, Rise, Scene, Wd, buildGroups, cl, easeOut, lerp, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const TITULAR_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1));
const groups = buildGroups(words, blocks);
const KEYS = ['DESEMPLEO', 'LETRA', 'CHICA', 'INFORMALIDAD', 'CRÍTICAS', 'RESPALDA', 'CHAMBA', 'SEPARA', 'CIEN', 'CIERTO', 'RETIRO'];

const SERIF = 'Georgia, "DejaVu Serif", "Times New Roman", serif';
const INK = '#16140F';
const NEWS = '#EDE6D3';
const RED = '#E5383B';
const abs = (x: number, y: number, w?: number): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w});
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
const txt = (size: number, weight = 800, color: string = P.white, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});
const ser = (size: number, color = INK, weight = 900): React.CSSProperties => ({fontFamily: SERIF, fontWeight: weight, fontSize: size, color, lineHeight: 1.02, letterSpacing: '-0.015em'});

/** recorte de periódico */
const Clip: React.FC<{x?: number; y: number; w?: number; h: number; rot?: number; children: React.ReactNode}> = ({x = 90, y, w = 900, h, rot = 0, children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: `linear-gradient(180deg, ${NEWS} 0%, #DDD4BC 100%)`, transform: `rotate(${rot}deg)`, boxShadow: '0 40px 70px rgba(0,0,0,0.55)', overflow: 'hidden'}}>
    {children}
  </div>
);
const Rules: React.FC<{y: number; x?: number; w: number; n: number}> = ({y, x = 0, w, n}) => (
  <>
    {Array.from({length: n}, (_, k) => (
      <div key={k} style={{position: 'absolute', left: x, top: y + k * 26, width: k === n - 1 ? w * 0.6 : w, height: 8, borderRadius: 4, background: 'rgba(22,20,15,0.22)'}} />
    ))}
  </>
);
const Masthead: React.FC = () => (
  <>
    <div style={{position: 'absolute', left: 0, right: 0, top: 28, textAlign: 'center', ...ser(34, INK, 700), letterSpacing: '0.18em'}}>EL DIARIO DEL BOLSILLO</div>
    <div style={{position: 'absolute', left: 40, right: 40, top: 86, height: 4, background: INK}} />
    <div style={{position: 'absolute', left: 40, right: 40, top: 96, height: 2, background: INK}} />
    <div style={{position: 'absolute', left: 40, top: 112, ...ser(24, 'rgba(22,20,15,0.65)', 600), letterSpacing: '0.08em'}}>ECONOMÍA · MÉXICO · 25 NOV 2026</div>
  </>
);

/** gancho (primero = último fotograma) */
const Hook: React.FC<{scale?: number}> = ({scale = 1}) => (
  <div style={{transform: `scale(${scale})`, transformOrigin: '50% 40%', position: 'absolute', inset: 0}}>
    <div style={{...center(215), ...txt(44, 700, P.mute, 0.3)}}>EL TITULAR</div>
    <Clip y={300} h={760} rot={-1.5}>
      <Masthead />
      <div style={{position: 'absolute', left: 40, top: 170, whiteSpace: 'nowrap', ...ser(112)}}>DESEMPLEO</div>
      <div style={{position: 'absolute', left: 40, top: 290, whiteSpace: 'nowrap', ...ser(320, RED, 900), letterSpacing: '-0.05em'}}>2.9%</div>
      <Rules y={690} x={40} w={820} n={2} />
    </Clip>
  </div>
);

const S1: React.FC = () => (
  <Scene a={A[0]} b={A[1]} kind="none" out="up">
    {(lt, f) => (
      <AbsoluteFill style={{transform: `scale(${lerp(1.06, 1, easeOut(lt / 0.5))})`}}>
        <Hook />
        <Rise at={T(5)} style={center(1110)}>
          <Chip size={30}>INEGI · ENOE 3T 2026</Chip>
        </Rise>
      </AbsoluteFill>
    )}
  </Scene>
);

/** lupa sobre letra chica */
const S2: React.FC = () => (
  <Scene a={A[1]} b={A[2]} kind="left" out="left">
    {(lt, f) => {
      const t = f / FPS;
      const zoom = easeOut(prog(t, T(16) - 0.1, T(18) + 0.3));
      const stamp = spr(f, T(12), 9, 220, 0.6);
      return (
        <>
          <div style={{...center(215), ...txt(44, 700, P.mute, 0.3)}}>LA LETRA CHICA</div>
          <Clip y={300} h={760} rot={1.2}>
            <Masthead />
            <div style={{position: 'absolute', left: 40, top: 175, whiteSpace: 'nowrap', ...ser(92)}}>DESEMPLEO <span style={{color: RED}}>2.9%</span></div>
            <Rules y={320} x={40} w={820} n={4} />
            <div style={{position: 'absolute', left: 40, top: 480, whiteSpace: 'nowrap', ...ser(30, INK, 700)}}>* Cifra del 3.er trimestre 2026. Ver cuadros 3 y 4.</div>
            <Rules y={530} x={40} w={820} n={3} />
          </Clip>
          <div style={{position: 'absolute', left: 640, top: 760, opacity: cl(stamp * 2), transform: `scale(${lerp(1.6, 1, stamp)}) rotate(-8deg)`}}>
            <div style={{...txt(46, 800, RED, 0.06), border: `6px solid ${RED}`, padding: '8px 26px', borderRadius: 12, background: 'rgba(237,230,211,0.9)'}}>INEGI</div>
          </div>
          <div style={{position: 'absolute', left: 130 + zoom * 40, top: 640 - zoom * 20, width: 520, height: 150, borderRadius: 999, border: `10px solid ${P.amber}`, background: 'rgba(255,194,71,0.18)', opacity: zoom, transform: `scale(${lerp(0.5, 1, zoom)})`, boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}} />
        </>
      );
    }}
  </Scene>
);

const S3: React.FC = () => (
  <Scene a={A[2]} b={A[3]} kind="zoom" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const c = easeOut(prog(t, T(21) - 0.05, T(22) + 0.4));
      const sello = spr(f, T(29) - 0.15, 8, 240, 0.55);
      return (
        <>
          <div style={{...center(215), ...txt(44, 700, P.mute, 0.3)}}>PERSONAS OCUPADAS</div>
          <div style={{...center(320), ...txt(400, 800, P.mint, -0.05), textShadow: '0 30px 80px rgba(0,0,0,0.5)'}}>{(c * 60.2).toFixed(1)}</div>
          <Mask at={A[2] + 0.1} size={96} weight={700} color={P.white} style={center(740)}>millones trabajan</Mask>
          <Rise at={T(24)} style={center(900)}>
            <Chip size={30}>INEGI · 3T 2026 · 60,162,442</Chip>
          </Rise>
          <div style={{position: 'absolute', left: 0, right: 0, top: 1030, display: 'flex', justifyContent: 'center', opacity: cl(sello * 2), transform: `scale(${lerp(1.8, 1, sello)}) rotate(-6deg)`}}>
            <div style={{...txt(110, 800, P.mint, 0.05), border: `10px solid ${P.mint}`, padding: '6px 40px', borderRadius: 18}}>✔ CIERTO</div>
          </div>
        </>
      );
    }}
  </Scene>
);

/** cuadrícula de 100 personas */
const Dots: React.FC<{n: number; color: string; start: number; label: string; big: string; sub: string; src: string}> = ({n, color, start, label, big, sub, src}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const lit = Math.floor(easeOut(prog(t, start, start + 1.2)) * n);
  return (
    <>
      <div style={{...center(200), ...txt(44, 700, P.mute, 0.3)}}>{label}</div>
      <div style={{...center(255), ...txt(200, 800, color, -0.04), textShadow: '0 20px 60px rgba(0,0,0,0.5)'}}>{big}</div>
      <div style={{position: 'absolute', left: 190, top: 500, width: 700, display: 'flex', flexWrap: 'wrap', gap: 14}}>
        {Array.from({length: 100}, (_, k) => {
          const row = Math.floor(k / 10);
          const idx = (9 - row) * 10 + (k % 10);
          const on = idx < lit;
          return <div key={k} style={{width: 56, height: 56, borderRadius: 99, background: on ? color : 'rgba(255,255,255,0.14)', boxShadow: on ? `0 0 18px ${color}88` : 'none'}} />;
        })}
      </div>
      <div style={{...center(1255), ...txt(34, 600, P.mute, 0.04)}}>{sub}</div>
      <div style={{...center(1205), ...txt(30, 700, P.white, 0.08)}}>{src}</div>
    </>
  );
};

const S4: React.FC = () => (
  <Scene a={A[3]} b={A[4]} kind="up" out="left">
    {() => <Dots n={55} color={P.coral} start={T(33)} label="SIN EMPLEO FORMAL" big="55 de 100" sub="" src="TASA DE INFORMALIDAD LABORAL · 55.0 % · INEGI" />}
  </Scene>
);

const S5: React.FC = () => (
  <Scene a={A[4]} b={A[5]} kind="left" out="up">
    {(lt, f) => (
      <>
        <Dots n={38} color={P.amber} start={T(44)} label="CONDICIONES CRÍTICAS" big="38 de 100" sub="" src="TCCO · 38.0 % · INEGI 3T 2026" />
        <Pop at={T(54)} rot={-3} style={abs(110, 1090)}>
          <div style={{...txt(34, 800, INK, 0.02), background: P.amber, padding: '10px 24px', borderRadius: 16}}>POCAS HORAS, SIN QUERER</div>
        </Pop>
        <Pop at={T(59)} rot={3} style={abs(560, 1090)}>
          <div style={{...txt(34, 800, INK, 0.02), background: P.white, padding: '10px 24px', borderRadius: 16}}>MUCHAS, INGRESO BAJO</div>
        </Pop>
      </>
    )}
  </Scene>
);

/** tachar el titular y subrayar la pregunta */
const S6: React.FC = () => (
  <Scene a={A[5]} b={A[6]} kind="zoom" out="left">
    {(lt, f) => {
      const t = f / FPS;
      const strike = easeOut(prog(t, T(72) - 0.1, T(72) + 0.35));
      const under = easeOut(prog(t, T(77), T(79) + 0.2));
      return (
        <>
          <div style={{...center(215), ...txt(44, 700, P.mute, 0.3)}}>LO QUE IMPORTA</div>
          <Clip y={320} h={420} rot={-1}>
            <div style={{position: 'absolute', left: 40, top: 90, whiteSpace: 'nowrap', ...ser(92, 'rgba(22,20,15,0.8)')}}>¿HAY CHAMBA?</div>
            <div style={{position: 'absolute', left: 30, top: 128, width: 800 * strike, height: 16, borderRadius: 8, background: RED, transform: 'rotate(-2deg)'}} />
            <Rules y={270} x={40} w={820} n={3} />
          </Clip>
          <Rise at={T(75)} dy={80} style={abs(110, 800)}>
            <div style={{...ser(100, P.white), whiteSpace: 'nowrap', position: 'relative'}}>
              ¿TE RESPALDA?
              <div style={{position: 'absolute', left: 0, bottom: -14, width: `${under * 100}%`, height: 20, borderRadius: 10, background: P.amber}} />
            </div>
          </Rise>
          <Rise at={T(66)} style={center(1110)}>
            <Chip size={30}>PARA TU DINERO EN MÉXICO</Chip>
          </Rise>
        </>
      );
    }}
  </Scene>
);

/** ejemplo: de cada $1,000, separa $100 */
const S7: React.FC = () => (
  <Scene a={A[6]} b={A[7]} kind="up" out="zoom">
    {(lt, f) => {
      const t = f / FPS;
      const fill = easeOut(prog(t, T(99), T(100) + 0.4));
      const q = easeOut(prog(t, T(100) + 0.3, T(100) + 0.9));
      return (
        <>
          <div style={{...center(200), ...txt(44, 700, P.mute, 0.3)}}>POR TU CUENTA</div>
          <Rise at={T(91)} style={abs(110, 290, 860)}>
            <div style={{background: NEWS, borderRadius: 24, padding: '36px 44px', boxShadow: '0 40px 70px rgba(0,0,0,0.5)'}}>
              <div style={{...ser(30, 'rgba(22,20,15,0.6)', 700), letterSpacing: '0.06em'}}>BASE: UN COBRO DE $1,000</div>
              <div style={{display: 'flex', height: 120, marginTop: 28, borderRadius: 18, overflow: 'hidden', background: '#CFC6AD'}}>
                <div style={{width: `${fill * 10}%`, background: P.mint}} />
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 22}}>
                <div style={ser(70, P.ink)}>$1,000</div>
                <div style={ser(70, '#0A8F63')}>→ $100</div>
              </div>
              <div style={{...ser(30, 'rgba(22,20,15,0.6)', 600), marginTop: 10}}>separas el 10 % de cada cobro (hipotético)</div>
            </div>
          </Rise>
          <Rise at={T(85) - 0.2} dy={50} style={abs(110, 830, 860)}>
            <div style={{...ser(74, P.white, 800)}}>Ningún patrón aporta a tu retiro.</div>
          </Rise>
          <div style={{...center(1090), opacity: q, transform: `translateY(${(1 - q) * 30}px)`}}>
            <div style={{...txt(50, 800, INK, 0), background: P.amber, padding: '16px 36px', borderRadius: 22}}>¿Tu chamba te respalda o solo te paga?</div>
          </div>
        </>
      );
    }}
  </Scene>
);

const S8: React.FC = () => (
  <Scene a={A[7]} b={TITULAR_TOTAL} kind="zoom" out="none">
    {(lt) => <Hook scale={lerp(0.9, 1, easeOut(lt / 0.5))} />}
  </Scene>
);

const PASOS = [
  {at: 0, label: 'EL TITULAR'},
  {at: A[1], label: 'LETRA CHICA'},
  {at: A[3], label: 'LO QUE NO DICE'},
  {at: A[5], label: 'LO QUE IMPORTA'},
  {at: A[7], label: 'EL TITULAR'},
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

const Bg: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(120% 80% at 50% 25%, #2B2620 0%, #14110D 70%)'}} />
);

export const TitularEnoeMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <AbsoluteFill style={{background: INK}}>
    <Bg />
    <S1 />
    <S2 />
    <S3 />
    <S4 />
    <S5 />
    <S6 />
    <S7 />
    <S8 />
    <Grain />
    <Frame serie="NOTICIA · 26 NOV" total={TITULAR_TOTAL} pasos={PASOS} nota="Contenido educativo, no es recomendación de inversión. Fuente: INEGI, ENOE 3.er trimestre 2026, Boletín de Indicador 703/26 (25 nov 2026). Cifras de ejemplo hipotéticas." />
    <Cta />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('titular-enoe/voz_mix.wav')} />}
  </AbsoluteFill>
);

export const TitularEnoeCover: React.FC = () => (
  <AbsoluteFill style={{background: INK}}>
    <Bg />
    <Hook />
    <div style={{...center(1130), ...txt(60, 800, P.white, -0.01)}}>y la letra chica que no sale</div>
    <div style={center(1260)}>
      <Chip size={30}>NOTICIA · INEGI</Chip>
    </div>
    <Grain />
  </AbsoluteFill>
);

// NOTICIA N4 · EXPLICADO CON TU QUINCENA — semana de pruebas (2026-11-28)
// R: Conasami en sesión permanente para fijar el salario mínimo 2027 (boletín 08/2026, 26 nov 2026).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/quincena-minimo/words.json';
import {Captions, Chip, FONT, FPS, Frame, Grain, Mask, P, Pop, Rise, Scene, Wd, buildGroups, cl, easeOut, lerp, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const QUINCENA_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1));
const groups = buildGroups(words, blocks);
const KEYS = ['QUINCENA', 'MÍNIMO', 'CONASAMI', 'SINDICATOS', 'EMPRESARIOS', 'EJEMPLOS', 'OFICIAL', 'DICIEMBRE', 'ENERO', 'CUENTA', 'DECIDIR'];

const MONO = '"DejaVu Sans Mono", "Courier New", monospace';
const PAPER = '#F7F4EC';
const INK = '#17201F';
const GREEN = '#0A8F63';
const RED = '#D6453D';
const abs = (x: number, y: number, w?: number): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w});
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
const txt = (size: number, weight = 800, color: string = P.white, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});
const mono = (size: number, color = INK, weight = 700): React.CSSProperties => ({fontFamily: MONO, fontWeight: weight, fontSize: size, color, lineHeight: 1.1, whiteSpace: 'nowrap'});

/** hoja de recibo con borde dentado abajo; las líneas se imprimen una a una */
const Paper: React.FC<{y: number; h: number; rot?: number; children: React.ReactNode}> = ({y, h, rot = 0, children}) => (
  <div style={{position: 'absolute', left: 110, top: y, width: 860, height: h, transform: `rotate(${rot}deg)`, filter: 'drop-shadow(0 40px 50px rgba(0,0,0,0.5))'}}>
    <div style={{position: 'absolute', inset: 0, background: PAPER, clipPath: `polygon(0 0, 100% 0, 100% calc(100% - 22px), ${Array.from({length: 21}, (_, k) => `${100 - k * 5}% ${k % 2 === 0 ? '100%' : 'calc(100% - 22px)'}`).join(', ')}, 0 calc(100% - 22px))`}} />
    <div style={{position: 'absolute', inset: 0}}>{children}</div>
  </div>
);
const Line: React.FC<{at: number; y: number; children: React.ReactNode}> = ({at, y, children}) => {
  const f = useCurrentFrame();
  const p = easeOut(prog(f / FPS, at, at + 0.28));
  return <div style={{position: 'absolute', left: 44, right: 44, top: y, opacity: p, transform: `translateY(${(1 - p) * 26}px)`}}>{children}</div>;
};
const Dash: React.FC<{y: number}> = ({y}) => <div style={{position: 'absolute', left: 44, right: 44, top: y, borderTop: `4px dashed rgba(23,32,31,0.35)`}} />;
const Head: React.FC<{sub: string}> = ({sub}) => (
  <>
    <div style={{position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center', ...mono(34, INK, 700), letterSpacing: '0.16em'}}>RECIBO DE QUINCENA</div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 78, textAlign: 'center', ...mono(24, 'rgba(23,32,31,0.6)', 600)}}>{sub}</div>
    <Dash y={124} />
  </>
);

/** gancho: primero = último fotograma */
const Hook: React.FC<{scale?: number}> = ({scale = 1}) => (
  <div style={{position: 'absolute', inset: 0, transform: `scale(${scale})`, transformOrigin: '50% 40%'}}>
    <div style={{...center(215), ...txt(44, 700, P.mute, 0.3)}}>UNA QUINCENA MÍNIMA</div>
    <Paper y={310} h={640} rot={-1.2}>
      <Head sub="HOY · 15 DÍAS" />
      <div style={{position: 'absolute', left: 44, top: 190, ...mono(40, 'rgba(23,32,31,0.65)', 600)}}>TOTAL</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 245, textAlign: 'center', ...mono(210, INK, 800), letterSpacing: '-0.06em'}}>$4,725</div>
      <Dash y={520} />
      <div style={{position: 'absolute', left: 44, top: 545, ...mono(30, 'rgba(23,32,31,0.6)', 600)}}>$315.04 × 15 DÍAS = $4,725.60</div>
    </Paper>
  </div>
);

const S1: React.FC = () => (
  <Scene a={A[0]} b={A[1]} kind="none" out="up">
    {() => (
      <AbsoluteFill>
        <Hook />
        <Rise at={T(5)} style={center(1060)}>
          <Chip size={30}>BASE: SALARIO MÍNIMO 2026</Chip>
        </Rise>
      </AbsoluteFill>
    )}
  </Scene>
);

/** Conasami decide */
const S2: React.FC = () => (
  <Scene a={A[1]} b={A[2]} kind="left" out="left">
    {(lt, f) => {
      const t = f / FPS;
      const pulse = 0.5 + 0.5 * Math.sin(t * 7);
      const q = spr(f, T(20), 9, 220, 0.6);
      return (
        <>
          <div style={{...center(215), ...txt(44, 700, P.mute, 0.3)}}>SALARIO MÍNIMO 2027</div>
          <Rise at={A[1] + 0.1} style={abs(110, 330, 860)}>
            <div style={{background: PAPER, borderRadius: 30, padding: '44px 48px', boxShadow: '0 40px 70px rgba(0,0,0,0.5)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
                <div style={{width: 34, height: 34, borderRadius: 99, background: RED, opacity: 0.4 + 0.6 * pulse, boxShadow: `0 0 ${10 + 22 * pulse}px ${RED}`}} />
                <div style={{...mono(34, RED, 800), letterSpacing: '0.1em'}}>SESIÓN PERMANENTE</div>
              </div>
              <div style={{...txt(100, 800, INK, -0.03), marginTop: 28}}>CONASAMI</div>
              <div style={{...txt(34, 600, 'rgba(23,32,31,0.65)', 0), marginTop: 14}}>Boletín 08/2026 · sesión del Consejo</div>
            </div>
          </Rise>
          <div style={{position: 'absolute', left: 0, right: 0, top: 800, display: 'flex', justifyContent: 'center', opacity: cl(q * 2), transform: `scale(${lerp(0.4, 1, q)})`}}>
            <div style={{...txt(260, 800, P.amber, -0.04), textShadow: '0 30px 80px rgba(0,0,0,0.5)'}}>+ ?</div>
          </div>
          <Rise at={T(15)} style={center(1100)}>
            <Chip size={28}>CONASAMI · 26 NOV 2026</Chip>
          </Rise>
        </>
      );
    }}
  </Scene>
);

/** la cuenta */
const S3: React.FC = () => (
  <Scene a={A[2]} b={A[3]} kind="zoom" out="up">
    {() => (
      <>
        <div style={{...center(215), ...txt(44, 700, P.mute, 0.3)}}>LA CUENTA DE UNA QUINCENA</div>
        <Paper y={310} h={700}>
          <Head sub="SI GANAS EL MÍNIMO" />
          <Line at={T(23)} y={160}>
            <div style={mono(34, 'rgba(23,32,31,0.6)', 600)}>SALARIO MÍNIMO DIARIO</div>
            <div style={{...mono(96, INK, 800), marginTop: 6}}>$315.04</div>
          </Line>
          <Line at={T(35)} y={360}>
            <div style={mono(34, 'rgba(23,32,31,0.6)', 600)}>× DÍAS DE LA QUINCENA</div>
            <div style={{...mono(96, INK, 800), marginTop: 6}}>× 15</div>
          </Line>
          <Dash y={560} />
          <Line at={T(39)} y={585}>
            <div style={{...mono(70, GREEN, 800)}}>= $4,725.60</div>
          </Line>
        </Paper>
        <Rise at={T(29)} style={center(1085)}>
          <Chip size={26}>VIGENTE 2026 · 315.04 · UNOTV, N+, PUBLIMETRO</Chip>
        </Rise>
      </>
    )}
  </Scene>
);

/** sindicatos vs empresarios */
const Range: React.FC<{y: number; label: string; from: number; to: number; at: number; color: string; open?: boolean; tag: string}> = ({y, label, from, to, at, color, open, tag}) => {
  const f = useCurrentFrame();
  const p = easeOut(prog(f / FPS, at, at + 0.7));
  const X0 = 110, W = 860, max = 20;
  const x = (v: number) => X0 + (v / max) * W;
  const l = x(from), r = x(to);
  return (
    <div>
      <div style={{position: 'absolute', left: 110, top: y - 70, ...txt(44, 800, color, 0)}}>{label}</div>
      <div style={{position: 'absolute', left: X0, top: y, width: W, height: 56, borderRadius: 28, background: 'rgba(255,255,255,0.12)'}} />
      <div style={{position: 'absolute', left: l, top: y, width: (r - l) * p, height: 56, borderRadius: 28, background: color, borderTopRightRadius: open ? 8 : 28, borderBottomRightRadius: open ? 8 : 28}} />
      <div style={{position: 'absolute', left: 110, top: y + 70, opacity: p, ...txt(60, 800, P.white, -0.02)}}>{tag}</div>
    </div>
  );
};
const S4: React.FC = () => (
  <Scene a={A[3]} b={A[4]} kind="up" out="left">
    {() => (
      <>
        <div style={{...center(215), ...txt(44, 700, P.mute, 0.3)}}>LO QUE PIDEN PARA 2027</div>
        <Range y={420} label="SINDICATOS" from={12} to={18} at={T(42)} color={P.mint} tag="12 % a 18 %" />
        <Range y={760} label="EMPRESARIOS" from={0} to={10} at={T(51)} color={P.coral} open tag="menos de 10 %" />
        {[0, 5, 10, 15, 20].map((v) => (
          <div key={v} style={{position: 'absolute', left: 110 + (v / 20) * 860 - 40, top: 1000, width: 80, textAlign: 'center', ...txt(28, 600, P.mute, 0)}}>{v} %</div>
        ))}
        <Rise at={T(47)} style={center(1085)}>
          <Chip size={26}>UNOTV · EL CHAMUCO · 17–27 NOV 2026</Chip>
        </Rise>
      </>
    )}
  </Scene>
);

/** tres ejemplos en el recibo */
const Row: React.FC<{y: number; pct: string; daily: string; total: string; plus: string; at: number; plusAt: number}> = ({y, pct, daily, total, plus, at, plusAt}) => {
  const f = useCurrentFrame();
  const g = spr(f, plusAt, 9, 230, 0.55);
  return (
    <>
      <Line at={at} y={y}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
          <div style={mono(70, INK, 800)}>{pct}</div>
          <div style={mono(34, 'rgba(23,32,31,0.6)', 600)}>${daily} × 15</div>
        </div>
        <div style={{...mono(46, 'rgba(23,32,31,0.75)', 700), marginTop: 6}}>= {total}</div>
      </Line>
      <div style={{position: 'absolute', right: 40, top: y + 8, opacity: cl(g * 2), transform: `scale(${lerp(0.5, 1, g)})`, transformOrigin: 'right center'}}>
        <div style={{...mono(54, '#fff', 800), background: GREEN, padding: '8px 22px', borderRadius: 16}}>{plus}</div>
      </div>
    </>
  );
};
const S5: React.FC = () => (
  <Scene a={A[4]} b={A[5]} kind="left" out="up">
    {() => (
      <>
        <div style={{...center(215), ...txt(44, 700, P.mute, 0.3)}}>SI EL AUMENTO FUERA…</div>
        <Paper y={300} h={800}>
          <Head sub="HOY $4,725.60 · EJEMPLOS" />
          <Row y={160} pct="+9 %" daily="343.39" total="$5,151" plus="+$425" at={T(55)} plusAt={T(62)} />
          <Dash y={340} />
          <Row y={365} pct="+12 %" daily="352.84" total="$5,293" plus="+$567" at={T(65)} plusAt={T(67)} />
          <Dash y={545} />
          <Row y={570} pct="+15 %" daily="362.30" total="$5,435" plus="+$709" at={T(71)} plusAt={T(73)} />
          <div style={{position: 'absolute', left: 44, bottom: 52, ...mono(24, 'rgba(23,32,31,0.55)', 600)}}>Redondeado al peso. Base: $315.04 × (1 + %) × 15 días.</div>
        </Paper>
      </>
    )}
  </Scene>
);

/** sello: ejemplo, no pronóstico */
const S6: React.FC = () => (
  <Scene a={A[5]} b={A[6]} kind="zoom" out="left">
    {(lt, f) => {
      const stamp = spr(f, T(75), 9, 230, 0.6);
      const no = spr(f, T(78), 9, 230, 0.6);
      return (
        <>
          <div style={{...center(215), ...txt(44, 700, P.mute, 0.3)}}>OJO</div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center', opacity: cl(stamp * 2), transform: `scale(${lerp(1.8, 1, stamp)}) rotate(-6deg)`}}>
            <div style={{...txt(120, 800, P.amber, 0.04), border: `12px solid ${P.amber}`, padding: '10px 40px', borderRadius: 22}}>EJEMPLOS</div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 700, display: 'flex', justifyContent: 'center', opacity: cl(no * 2), transform: `scale(${lerp(1.6, 1, no)}) rotate(4deg)`}}>
            <div style={{...txt(78, 800, P.coral, 0.03), border: `10px solid ${P.coral}`, padding: '10px 36px', borderRadius: 20}}>SIN % OFICIAL TODAVÍA</div>
          </div>
          <Rise at={T(80)} style={center(1000)}>
            <Chip size={28}>NO ES PRONÓSTICO</Chip>
          </Rise>
        </>
      );
    }}
  </Scene>
);

/** fechas */
const S7: React.FC = () => (
  <Scene a={A[6]} b={A[7]} kind="up" out="zoom">
    {(lt, f) => {
      const t = f / FPS;
      const fill = easeOut(prog(t, T(83), T(85) + 0.3));
      const q = easeOut(prog(t, T(91), T(93) + 0.4));
      return (
        <>
          <div style={{...center(200), ...txt(44, 700, P.mute, 0.3)}}>QUÉ VIGILAR</div>
          <Rise at={T(82)} style={abs(110, 290, 860)}>
            <div style={{background: PAPER, borderRadius: 28, padding: '34px 44px', boxShadow: '0 40px 70px rgba(0,0,0,0.5)'}}>
              <div style={{...mono(30, 'rgba(23,32,31,0.6)', 600), letterSpacing: '0.06em'}}>RESOLUCIÓN ESPERADA</div>
              <div style={{...txt(110, 800, INK, -0.03), marginTop: 8}}>DICIEMBRE</div>
              <div style={{display: 'flex', gap: 10, marginTop: 20}}>
                {Array.from({length: 31}, (_, k) => (
                  <div key={k} style={{flex: 1, height: 44, borderRadius: 8, background: k < 14 * fill ? P.amber : 'rgba(23,32,31,0.14)'}} />
                ))}
              </div>
              <div style={{...mono(26, 'rgba(23,32,31,0.55)', 600), marginTop: 12}}>según la prensa; la Conasami no ha dado fecha</div>
            </div>
          </Rise>
          <Rise at={T(88)} dy={60} style={abs(110, 740, 860)}>
            <div style={{background: GREEN, borderRadius: 28, padding: '30px 44px', boxShadow: '0 40px 70px rgba(0,0,0,0.5)'}}>
              <div style={{...mono(30, 'rgba(255,255,255,0.8)', 600), letterSpacing: '0.06em'}}>ENTRARÍA EN VIGOR</div>
              <div style={{...txt(100, 800, '#fff', -0.03), marginTop: 6}}>1 ENE 2027</div>
            </div>
          </Rise>
          <div style={{...center(1085), opacity: q, transform: `translateY(${(1 - q) * 30}px)`}}>
            <div style={{...txt(46, 800, INK, 0), background: P.amber, padding: '16px 34px', borderRadius: 22}}>¿Cuánto quisieras que subiera?</div>
          </div>
        </>
      );
    }}
  </Scene>
);

const S8: React.FC = () => (
  <Scene a={A[7]} b={QUINCENA_TOTAL} kind="zoom" out="none">
    {(lt) => <Hook scale={lerp(0.9, 1, easeOut(lt / 0.5))} />}
  </Scene>
);

const PASOS = [
  {at: 0, label: 'TU QUINCENA'},
  {at: A[1], label: 'CONASAMI'},
  {at: A[3], label: 'LO QUE PIDEN'},
  {at: A[4], label: 'EJEMPLOS'},
  {at: A[6], label: 'QUÉ VIGILAR'},
  {at: A[7], label: 'TU QUINCENA'},
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

const Bg: React.FC = () => <AbsoluteFill style={{background: 'radial-gradient(120% 80% at 50% 25%, #14463F 0%, #07201D 70%)'}} />;

export const QuincenaMinimoMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <AbsoluteFill style={{background: '#07201D'}}>
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
    <Frame serie="NOTICIA · 28 NOV" total={QUINCENA_TOTAL} pasos={PASOS} nota="Contenido educativo, no es recomendación de inversión. Fuentes: Conasami (boletín 08/2026, 26 nov 2026, vía Por Esto); UnoTV, N+ y Publimetro (17–18 nov 2026); El Chamuco y Cúspide (27 nov 2026). Cifras de ejemplo hipotéticas, no pronóstico." />
    <Cta />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('quincena-minimo/voz_mix.wav')} />}
  </AbsoluteFill>
);

export const QuincenaMinimoCover: React.FC = () => (
  <AbsoluteFill style={{background: '#07201D'}}>
    <Bg />
    <Hook />
    <div style={{...center(1090), ...txt(60, 800, P.white, -0.01)}}>¿y cuánto sube en 2027?</div>
    <div style={center(1230)}>
      <Chip size={30}>NOTICIA · SALARIO MÍNIMO</Chip>
    </div>
    <Grain />
  </AbsoluteFill>
);

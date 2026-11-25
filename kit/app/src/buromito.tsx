// BUROMITO — T02 de la semana de pruebas (25 nov 2026)
// Variables a probar: apertura = mito en voz sin pregunta · texto = mucho, cinético · estructura = mito vs realidad ·
// fondo = claro pastel (estilo glosario) · duración ~20 s · voz D.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/buromito/words.json';
import {Captions, Chip, FONT, FPS, Grain, Mask, Pop, Rise, Scene, Wd, buildGroups, cl, easeIO, easeOut, lerp, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const BURO_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1));
const groups = buildGroups(words, blocks);
const KEYS = ['MITO', 'FALSO', 'HISTORIAL', 'BUENO', 'BORRA', 'SEIS', 'GRATIS', 'CRÉDITO'];

const NAVY = '#041E42';
const STRONG = '#1B4FC4';
const RED = '#E5484D';
const GREEN = '#1F9D6B';
const WASH = ['#E3EDFA', '#F7D8D4', '#E1F3EA', '#FAF1D6'];
const txt = (size: number, weight = 800, color = NAVY, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});

const WashBg: React.FC<{n: number; f: number}> = ({n, f}) => (
  <AbsoluteFill style={{background: `radial-gradient(1300px 1300px at 50% 36%, #FFFFFF 0%, #FFFFFF 38%, ${WASH[n]} 100%)`}}>
    {[0, 1, 2].map((k) => (
      <div key={k} style={{position: 'absolute', left: [160, 940, 260][k] - 300 + Math.sin(f / 140 + k * 2) * 20, top: [380, 980, 1560][k] - 300 + Math.cos(f / 170 + k) * 20, width: 600, height: 600, borderRadius: '50%', background: WASH[n], opacity: 0.55}} />
    ))}
  </AbsoluteFill>
);
const LightBg: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const marks = [0, A[1], A[2], A[4]];
  const wash = [0, 1, 2, 3];
  let i = 0;
  marks.forEach((m, k) => {
    if (t >= m) i = k;
  });
  const p = i === 0 ? 1 : easeIO((t - marks[i]) / 0.4);
  return (
    <AbsoluteFill>
      {i > 0 && p < 1 && <WashBg n={wash[i - 1]} f={f} />}
      <AbsoluteFill style={{opacity: p}}>
        <WashBg n={wash[i]} f={f} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

type MP = React.ComponentProps<typeof Mask>;
const M: React.FC<MP> = (props) => <Mask color={NAVY} {...props} />;

/* ---------- escenas ---------- */
// Gancho (también es el último fotograma: bucle visual)
const Hook: React.FC<{f: number; settled?: boolean}> = ({f, settled}) => {
  const at = (i: number) => (settled ? -9 : T(i) - 0.06);
  const st = spr(f, at(0), 8, 230, 0.6);
  const neg = spr(f, at(6), 9, 240, 0.6);
  return (
    <>
      <div style={{...center(215), transform: `scale(${lerp(2, 1, st)}) rotate(-5deg)`, opacity: cl(st * 3)}}>
        <div style={{...txt(120, 800, RED, 0.04), border: `10px solid ${RED}`, padding: '8px 46px 0', borderRadius: 24, background: 'rgba(255,255,255,0.8)'}}>MITO</div>
      </div>
      <M at={at(1)} size={190} style={center(470)}>EL BURÓ</M>
      <M at={at(3)} size={110} weight={600} color={STRONG} style={center(690)}>ES UNA</M>
      <M at={at(5)} size={170} style={center(810)}>LISTA</M>
      <div style={{...center(985), transform: `scale(${lerp(1.5, 1, neg)}) rotate(${lerp(-4, -1.5, neg)}deg)`, opacity: cl(neg * 3)}}>
        <div style={{...txt(210, 800, '#FFFFFF', -0.02), background: NAVY, padding: '10px 54px 0', borderRadius: 24, boxShadow: '0 30px 50px rgba(4,30,66,0.35)'}}>NEGRA</div>
      </div>
    </>
  );
};
const S1: React.FC = () => (
  <Scene a={A[0]} b={A[1]} kind="none" out="up">
    {(lt, f) => <Hook f={f} />}
  </Scene>
);

const S2: React.FC = () => (
  <Scene a={A[1]} b={A[2]} kind="up" out="left">
    {(lt, f) => {
      const fa = spr(f, T(7) - 0.05, 8, 240, 0.6);
      const strike = easeOut(prog(f / FPS, T(7) + 0.05, T(7) + 0.35));
      return (
        <>
          <div style={{...center(215), transform: `scale(${lerp(2.2, 1, fa)}) rotate(-6deg)`, opacity: cl(fa * 3)}}>
            <div style={{...txt(250, 800, RED, 0.01), border: `12px solid ${RED}`, padding: '8px 54px 0', borderRadius: 30, background: 'rgba(255,255,255,0.85)'}}>FALSO</div>
          </div>
          <M at={T(8)} size={112} style={center(610)}>TU HISTORIAL</M>
          <M at={T(11)} size={112} color={STRONG} style={center(740)}>DE PAGOS</M>
          <Pop at={T(13)} rot={-3} style={{position: 'absolute', left: 90, top: 950}}>
            <div style={{...txt(66, 800, NAVY, 0), background: '#D2EEE0', padding: '16px 40px', borderRadius: 26, border: `5px solid ${GREEN}`}}>✔ LO BUENO</div>
          </Pop>
          <Pop at={T(15)} rot={2} style={{position: 'absolute', left: 150, top: 1100}}>
            <div style={{...txt(66, 800, NAVY, 0), background: '#D2EEE0', padding: '16px 40px', borderRadius: 26, border: `5px solid ${GREEN}`}}>✔ TAMBIÉN CUENTA</div>
          </Pop>
          <div style={{position: 'absolute', left: 200, right: 200, top: 160, height: 0, opacity: 0}}>{strike}</div>
        </>
      );
    }}
  </Scene>
);

const S3: React.FC = () => (
  <Scene a={A[2]} b={A[3]} kind="zoom" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const strike = easeOut(prog(t, T(22) + 0.05, T(22) + 0.45));
      const ne = spr(f, T(20) - 0.05, 9, 240, 0.6);
      return (
        <>
          <M at={T(17)} size={230} style={center(270)}>PAGAR</M>
          <div style={{...center(520), opacity: cl(ne * 2), transform: `scale(${lerp(2.4, 1, ne)})`}}>
            <div style={{...txt(260, 800, RED, 0)}}>≠</div>
          </div>
          <div style={{...center(840), position: 'absolute'}}>
            <div style={{position: 'relative'}}>
              <M at={T(22) - 0.05} size={230}>BORRAR</M>
              <div style={{position: 'absolute', left: -20, right: -20, top: 118, height: 22, background: RED, borderRadius: 11, transform: `scaleX(${strike}) rotate(-3deg)`, transformOrigin: '0 50%'}} />
            </div>
          </div>
          <Pop at={T(23) - 0.05} rot={-3} style={center(1130)}>
            <div style={{...txt(70, 800, '#FFFFFF', 0.04), background: NAVY, padding: '16px 44px', borderRadius: 26, boxShadow: '0 20px 40px rgba(4,30,66,0.3)'}}>AL INSTANTE</div>
          </Pop>
        </>
      );
    }}
  </Scene>
);

const S4: React.FC = () => (
  <Scene a={A[3]} b={A[4]} kind="left" out="left">
    {(lt, f) => {
      const t = f / FPS;
      const s0 = T(29);
      const s1 = T(32) + 0.1;
      const n = prog(t, s0, s1) * 6;
      return (
        <>
          <M at={T(25)} size={72} weight={700} color={STRONG} style={center(240)}>EL REGISTRO NEGATIVO</M>
          <M at={T(30) - 0.05} size={100} weight={600} style={center(400)}>HASTA</M>
          <div style={{...center(480), transform: `scale(${lerp(0.7, 1, spr(f, T(31) - 0.05, 8, 240, 0.6))})`, opacity: cl(spr(f, T(31) - 0.05, 8, 240, 0.6) * 3)}}>
            <div style={{...txt(430, 800, NAVY, -0.05)}}>6</div>
          </div>
          <M at={T(32) - 0.1} size={150} color={RED} style={center(930)}>AÑOS</M>
          <div style={{position: 'absolute', left: 90, top: 1150, display: 'flex', gap: 14}}>
            {[0, 1, 2, 3, 4, 5].map((k) => {
              const on = n > k;
              return (
                <div key={k} style={{width: 135, height: 70, borderRadius: 18, background: on ? RED : 'rgba(4,30,66,0.1)', transform: `scale(${on ? 1 : 0.92})`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...txt(34, 800, on ? '#FFFFFF' : 'rgba(4,30,66,0.4)', 0)}}>{k + 1}</div>
              );
            })}
          </div>
        </>
      );
    }}
  </Scene>
);

const Report: React.FC<{p: number}> = ({p}) => (
  <div style={{width: 560, height: 700, borderRadius: 40, background: '#FFFFFF', border: `6px solid ${NAVY}`, boxShadow: '0 40px 70px rgba(4,30,66,0.25)', padding: '48px 46px', boxSizing: 'border-box', transform: 'rotate(-3deg)'}}>
    <div style={{...txt(40, 800, STRONG, 0.08)}}>MI REPORTE</div>
    {[0.9, 0.7, 0.8, 0.55, 0.75].map((w, k) => (
      <div key={k} style={{marginTop: 34, height: 26, width: `${w * 100 * cl(p * 2 - k * 0.18)}%`, borderRadius: 13, background: k % 2 ? 'rgba(4,30,66,0.12)' : 'rgba(31,157,107,0.35)'}} />
    ))}
    <div style={{position: 'absolute', right: -24, bottom: 70, transform: `rotate(8deg) scale(${lerp(0.6, 1, p)})`, opacity: cl(p * 2)}}>
      <div style={{...txt(78, 800, '#FFFFFF', 0.04), background: GREEN, padding: '14px 38px', borderRadius: 24, boxShadow: '0 20px 30px rgba(0,0,0,0.25)'}}>GRATIS</div>
    </div>
  </div>
);
const S5: React.FC = () => (
  <Scene a={A[4]} b={A[5]} kind="up" out="zoom">
    {(lt, f) => {
      const p = spr(f, T(39) - 0.1, 11, 190, 0.7);
      return (
        <>
          <M at={T(33)} size={96} weight={700} color={STRONG} style={center(225)}>LO MEJOR</M>
          <div style={{...center(380), transform: `translateY(${(1 - p) * 160}px)`, opacity: cl(p * 2)}}>
            <Report p={p} />
          </div>
          <Pop at={T(40) - 0.05} rot={-2} style={center(1120)}>
            <div style={{...txt(78, 800, NAVY, 0), background: '#FAF1D6', padding: '14px 44px', borderRadius: 26, border: `5px solid ${NAVY}`}}>1 VEZ AL AÑO</div>
          </Pop>
        </>
      );
    }}
  </Scene>
);

const S6: React.FC = () => (
  <Scene a={A[5]} b={BURO_TOTAL + 1} kind="up" out="none">
    {(lt, f) => {
      const t = f / FPS;
      const back = easeIO(prog(t, BURO_TOTAL - 1.0, BURO_TOTAL - 0.15));
      return (
        <>
          <div style={{opacity: 1 - cl(back * 2), transform: `translateY(${back * 120}px)`}}>
            <M at={T(44)} size={170} style={center(290)}>REVÍSALO</M>
            <M at={T(45)} size={96} weight={600} color={STRONG} style={center(520)}>ANTES DE PEDIR</M>
            <M at={T(47) - 0.05} size={170} color={RED} style={center(660)}>UN CRÉDITO</M>
          </div>
          <div style={{opacity: cl((back - 0.4) / 0.6)}}>
            <Hook f={0} settled />
          </div>
        </>
      );
    }}
  </Scene>
);

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const p = spr(f, T(44), 12, 200, 0.6);
  return (
    <>
      {t >= T(44) && (
        <div style={{position: 'absolute', right: 70, top: 160, opacity: cl(p * 2), transform: `translateX(${(1 - p) * 200}px)`}}>
          <Chip bg={NAVY} color="#FFFFFF" size={26}>＋ SÍGUEME</Chip>
        </div>
      )}
      {t >= T(47) && (
        <div style={{...center(1420), opacity: cl(spr(f, T(47), 12, 200, 0.6) * 2)}}>
          <Chip bg={STRONG} color="#FFFFFF" size={34}>¿YA REVISASTE TU BURÓ?</Chip>
        </div>
      )}
    </>
  );
};

const LightFrame: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <>
      <div style={{position: 'absolute', left: 0, top: 0, height: 10, width: `${(t / BURO_TOTAL) * 100}%`, background: STRONG, borderRadius: '0 8px 8px 0'}} />
      <div style={{position: 'absolute', top: 96, left: 70, display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: '0.2em', color: 'rgba(4,30,66,0.6)'}}>
        <span style={{width: 16, height: 16, borderRadius: 99, background: STRONG, display: 'inline-block'}} />
        GLOSARIO · BURÓ DE CRÉDITO
      </div>
      <div style={{position: 'absolute', left: 70, right: 200, top: 1532, fontFamily: FONT, fontWeight: 400, fontSize: 23, lineHeight: 1.3, color: 'rgba(4,30,66,0.6)'}}>
        Contenido educativo, no es recomendación de inversión. Fuentes: Ley para Regular las Sociedades de Información Crediticia, art. 23; CONDUSEF; CNBV.
      </div>
    </>
  );
};

export const BuroMitoMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <AbsoluteFill style={{background: '#FFFFFF'}}>
    <LightBg />
    <S1 />
    <S2 />
    <S3 />
    <S4 />
    <S5 />
    <S6 />
    <Grain />
    <LightFrame />
    <Cta />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('buromito/voz_mix.wav')} />}
  </AbsoluteFill>
);

export const BuroMitoCover: React.FC = () => (
  <AbsoluteFill style={{background: '#FFFFFF'}}>
    <WashBg n={1} f={0} />
    <Hook f={0} settled />
    <div style={center(1250)}>
      <Chip bg={NAVY} color="#FFFFFF" size={38}>GLOSARIO · BURÓ DE CRÉDITO</Chip>
    </div>
  </AbsoluteFill>
);

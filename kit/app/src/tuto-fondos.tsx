// TUTORIAL · APP ACTINVER — Comprar o vender fondos en tres toques (Estándar Pro, marca Actinver)
import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/tuto-fondos/words.json';
import {ACTINVER, Backdrop, Brand, Captions, Card, Chip, FONT, FPS, Frame, Grain, Mask, P, Pop, Rise, Scene, Wd, buildGroups, cl, easeOut, lerp, prog, spr, useBrand} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const TF_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const A = blocks.map((b, i) => (i === 0 ? 0 : b.s - 0.1));
const groups = buildGroups(words, blocks);
const KEYS = ['TRES', 'TOQUES', 'COMPRAR', 'VENDER', 'FONDOS', 'INVERSIONES', 'CONTRATO', 'HORARIO', 'HÁBIL', 'PLAZO', 'RIESGO', 'ESCRÍBEME'];
const LEGAL = 'El contenido es únicamente informativo, no constituye recomendación, consejo o sugerencia personalizada de algún producto y/o servicio que le sugieran la toma de decisiones de inversión, para lo que se necesita previamente verificar la congruencia entre el perfil del cliente y el perfil del producto financiero. Rendimientos pasados no garantizan rendimientos futuros. El valor de las acciones de Fondos de Inversión conlleva un riesgo de mercado incluyendo una posible minusvalía del capital invertido. Los fondos de inversión no están garantizados por Grupo Financiero Actinver S.A. de C.V, o por alguna entidad integrante del Grupo Financiero Actinver, ni por ninguna entidad gubernamental, ni por el IPAB y pueden tener minusvalías del capital invertido. Todos los Fondos de Actinver cuentan con Prospecto de Información al Público Inversionista y Documentos con Información Clave, los cuales se encuentran a su disposición en www.actinver.com/fondos.';

const abs = (x: number, y: number, w?: number): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w});
const center = (y: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'});
const txt = (size: number, weight = 800, color = P.white, ls = -0.02): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.05, whiteSpace: 'nowrap'});

type R = {x: number; y: number; w: number; h: number; r?: number};
/* Teléfono con captura real; el resaltado (spot) oscurece solo dentro de la pantalla. rects en px de la captura (1206 de ancho). */
const Phone: React.FC<{src: string; nh: number; dw: number; x?: number; y: number; spot?: R; a?: number; tapAt?: number; crop?: number; dim?: boolean}> = ({src, nh, dw, x, y, spot, a = 1, tapAt, crop, dim = true}) => {
  const f = useCurrentFrame();
  const br = useBrand();
  const k = dw / 1206;
  const h = Math.min(nh * k, crop ?? 99999);
  const left = x ?? (1080 - dw) / 2;
  const pulse = 0.5 + 0.5 * Math.sin(f / 6);
  const tp = tapAt === undefined ? -1 : (f / FPS - tapAt) / 0.55;
  return (
    <div style={{position: 'absolute', left: left - 12, top: y - 12, width: dw + 24, height: h + 24, borderRadius: 54, background: 'rgba(255,255,255,0.92)', boxShadow: '0 40px 80px rgba(0,0,0,0.55)'}}>
      <div style={{position: 'absolute', left: 12, top: 12, width: dw, height: h, borderRadius: 44, overflow: 'hidden', background: '#fff'}}>
        <Img src={staticFile(src)} style={{width: dw, height: nh * k, display: 'block'}} />
        {spot && (
          <>
            <div style={{position: 'absolute', left: spot.x * k, top: spot.y * k, width: spot.w * k, height: spot.h * k, borderRadius: (spot.r ?? 28) * k, boxShadow: dim ? `0 0 0 4000px rgba(4,30,66,${0.5 * a})` : 'none'}} />
            <div style={{position: 'absolute', left: spot.x * k - 6, top: spot.y * k - 6, width: spot.w * k + 12, height: spot.h * k + 12, borderRadius: (spot.r ?? 28) * k + 6, border: `6px solid ${br.accent}`, opacity: a * (0.7 + 0.3 * pulse), boxShadow: `0 0 ${18 + 14 * pulse}px ${br.accent}`}} />
            {tp > 0 && tp < 1 && (
              <div style={{position: 'absolute', left: (spot.x + spot.w / 2) * k - 60, top: (spot.y + spot.h / 2) * k - 60, width: 120, height: 120, borderRadius: 60, border: `8px solid ${P.white}`, transform: `scale(${0.3 + tp * 1.3})`, opacity: 1 - tp}} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

/* ---- rects en px de cada captura ---- */
const INV_TAB: R = {x: 447, y: 1368, w: 312, h: 150, r: 75};
const INV_COMPRAR: R = {x: 100, y: 160, w: 215, h: 340, r: 36};
const INV_VERTODO: R = {x: 800, y: 50, w: 300, h: 80, r: 30};
const TODO_VENDER: R = {x: 355, y: 940, w: 230, h: 340, r: 36};
const CT_CARD: R = {x: 100, y: 285, w: 1000, h: 280, r: 24};
const CT_HORARIO: R = {x: 70, y: 30, w: 1066, h: 230, r: 24};
const CT_PIE: R = {x: 80, y: 700, w: 1046, h: 140, r: 24};

const S1: React.FC = () => (
  <Scene a={A[0]} b={A[1]} kind="none" out="up">
    {(lt, f) => {
      const k = spr(f, 0.1, 10, 220, 0.6);
      return (
        <AbsoluteFill style={{transform: `scale(${lerp(1.06, 1, easeOut(lt / 0.5))})`}}>
          <div style={{...center(215), ...txt(70, 600, P.mute, 0.2)}}>EN TU APP ACTINVER</div>
          <div style={{...center(300), ...txt(200, 800, P.white, -0.05), opacity: cl(k * 3), transform: `scale(${lerp(1.3, 1, k)})`}}>3 TOQUES</div>
          <Pop at={T(0)} rot={-4} style={abs(90, 580)}>
            <div style={{...txt(70, 800, P.ink, 0.02), background: '#3EE0A1', padding: '10px 32px', borderRadius: 24}}>COMPRAR</div>
          </Pop>
          <Pop at={T(2)} rot={4} style={abs(580, 580)}>
            <div style={{...txt(70, 800, P.white, 0.02), background: '#FF5A5F', padding: '10px 32px', borderRadius: 24}}>VENDER</div>
          </Pop>
          <Rise at={0.5} dy={120} style={{position: 'absolute', left: 0, right: 0, top: 790}}>
            <div style={{position: 'relative', height: 470, overflow: 'hidden', width: 640, margin: '0 auto', borderRadius: '44px 44px 0 0', border: '12px solid rgba(255,255,255,0.92)', borderBottom: 'none'}}>
              <Img src={staticFile('tuto-fondos/s_inv.jpg')} style={{width: 616, display: 'block'}} />
            </div>
          </Rise>
        </AbsoluteFill>
      );
    }}
  </Scene>
);

const S2: React.FC = () => (
  <Scene a={A[1]} b={A[2]} kind="up" out="none">
    {(lt, f) => {
      const a = cl((f / FPS - (T(10) - 0.1)) / 0.3);
      return <Phone src="tuto-fondos/s_inv.jpg" nh={1631} dw={700} y={230} spot={INV_TAB} a={a} tapAt={T(11)} />;
    }}
  </Scene>
);

const S3: React.FC = () => (
  <Scene a={A[2]} b={A[3]} kind="none" out="none">
    {(lt, f) => {
      const a = cl((f / FPS - (T(15) - 0.1)) / 0.3);
      return (
        <>
          <Phone src="tuto-fondos/s_inv.jpg" nh={1631} dw={700} y={230} spot={INV_COMPRAR} a={a} tapAt={T(16)} />
          <Pop at={T(14)} rot={-4} style={abs(70, 1215)}>
            <div style={{...txt(56, 800, P.ink, 0.02), background: '#3EE0A1', padding: '8px 30px', borderRadius: 20}}>COMPRAR</div>
          </Pop>
        </>
      );
    }}
  </Scene>
);

const S4: React.FC = () => (
  <Scene a={A[3]} b={A[4]} kind="none" out="up">
    {(lt, f) => {
      const t = f / FPS;
      const sw = cl((t - (T(24) - 0.15)) / 0.3);
      const a1 = cl((t - (T(20) - 0.1)) / 0.3);
      const a2 = cl((t - (T(25) - 0.2)) / 0.3);
      return (
        <>
          <div style={{opacity: 1 - sw}}><Phone src="tuto-fondos/s_inv.jpg" nh={1631} dw={700} y={230} spot={INV_VERTODO} a={a1} tapAt={T(21) + 0.15} /></div>
          <div style={{opacity: sw}}><Phone src="tuto-fondos/s_todo.jpg" nh={1460} dw={700} y={230} spot={TODO_VENDER} a={a2} tapAt={T(25) + 0.2} /></div>
          <Pop at={T(19)} rot={4} style={abs(70, 1215)}>
            <div style={{...txt(56, 800, P.white, 0.02), background: '#FF5A5F', padding: '8px 30px', borderRadius: 20}}>VENDER</div>
          </Pop>
        </>
      );
    }}
  </Scene>
);

const S5: React.FC = () => (
  <Scene a={A[4]} b={A[7]} kind="up" out="up">
    {(lt, f) => {
      const t = f / FPS;
      // qué se resalta y cuándo
      const sp = t < T(31) - 0.2 ? {r: CT_CARD, a: cl((t - (T(28) - 0.1)) / 0.3)} : t < T(48) - 0.2 ? {r: CT_HORARIO, a: cl((t - (T(31) - 0.2)) / 0.3)} : {r: CT_PIE, a: cl((t - (T(48) - 0.2)) / 0.3)};
      return (
        <>
          <Phone src="tuto-fondos/s_contrato.jpg" nh={850} dw={800} y={250} spot={sp.r} a={sp.a} tapAt={T(30) - 0.2} dim />
          <Pop at={T(27)} rot={-3} style={abs(70, 840)}>
            <div style={{...txt(54, 800, P.ink, 0.02), background: P.white, padding: '8px 30px', borderRadius: 20}}>3 · ELIGE TU CONTRATO</div>
          </Pop>
          <Rise at={T(43)} dy={50} style={abs(90, 940, 900)}>
            <Card style={{padding: '20px 40px'}}>
              <div style={{...txt(34, 600, 'rgba(10,15,31,0.55)', 0.08)}}>HORARIO · HORA DE CIUDAD DE MÉXICO</div>
              <div style={{...txt(64, 800, P.ink, -0.02)}}>Lun a vie · 8:00 a 13:00</div>
            </Card>
          </Rise>
          <Rise at={T(58)} dy={50} style={abs(90, 1110, 900)}>
            <Card style={{padding: '20px 40px', background: '#FFF3D6'}}>
              <div style={{...txt(34, 600, 'rgba(10,15,31,0.55)', 0.08)}}>FUERA DE HORARIO</div>
              <div style={{...txt(58, 800, P.ink, -0.02)}}>Se atiende en el siguiente horario hábil</div>
            </Card>
          </Rise>
        </>
      );
    }}
  </Scene>
);

const S6: React.FC = () => {
  const its = [
    {l: 'PLAZO', s: 'Cuánto tiempo conviene dejarlo', at: 66},
    {l: 'RIESGO', s: 'El valor puede subir o bajar', at: 69},
  ];
  return (
    <Scene a={A[7]} b={A[8]} kind="left" out="up">
      {(lt, f) => (
        <>
          <Mask at={A[7] + 0.05} size={130} color={useBrand().accent} style={center(240)}>ANTES</Mask>
          <Mask at={A[7] + 0.2} size={130} style={center(390)}>DE DECIDIR</Mask>
          {its.map((it, k) => {
            const p = spr(f, T(it.at) - 0.1, 11, 200, 0.6);
            return (
              <div key={k} style={{...abs(90, 640 + k * 290, 900), height: 250, borderRadius: 40, background: 'rgba(255,255,255,0.1)', border: '3px solid rgba(255,255,255,0.3)', padding: '38px 50px', boxSizing: 'border-box', transform: `scale(${p})`, opacity: cl(p * 2)}}>
                <div style={{...txt(96, 800, P.white, -0.02)}}>{it.l}</div>
                <div style={{...txt(40, 500, P.mute, 0), marginTop: 10}}>{it.s}</div>
              </div>
            );
          })}
        </>
      )}
    </Scene>
  );
};

const S7: React.FC = () => (
  <Scene a={A[8]} b={TF_TOTAL + 1} kind="up" out="none">
    {(lt, f) => (
      <>
        <Mask at={A[8] + 0.05} size={170} color={useBrand().accent} style={center(220)}>ESCRÍBEME</Mask>
        <Rise at={T(75)} dy={40} style={center(450)}>
          <Chip bg={P.white} color={P.ink} size={32}>＋ SÍGUEME</Chip>
        </Rise>
        <Rise at={T(76)} dy={60} style={abs(70, 600, 940)}>
          <div style={{borderRadius: 30, background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.25)', padding: '28px 34px'}}>
            <div style={{...txt(24, 400, 'rgba(255,255,255,0.78)', 0), whiteSpace: 'normal', lineHeight: 1.3}}>{LEGAL}</div>
          </div>
        </Rise>
      </>
    )}
  </Scene>
);

const MOOD_AT = [
  {at: 0, mood: 'actinver'},
  {at: A[4], mood: 'steel'},
  {at: A[7], mood: 'actinver'},
];
const PASOS = [
  {at: A[1], label: 'PASO 1 DE 3'},
  {at: A[2], label: 'PASO 2 DE 3'},
  {at: A[4], label: 'PASO 3 DE 3'},
  {at: A[7], label: ''},
];

export const TutoFondosMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <Brand value={ACTINVER}>
    <AbsoluteFill style={{background: P.ink}}>
      <Backdrop moods={MOOD_AT} />
      <S1 /><S2 /><S3 /><S4 /><S5 /><S6 /><S7 />
      <Grain />
      <Frame serie="TUTORIAL · APP ACTINVER" total={TF_TOTAL} pasos={PASOS} nota="Capturas de la app Actinver; número de contrato oculto. Horario sujeto a cambios: confirma en tu app. Contenido educativo, no es recomendación de inversión." />
      <Captions groups={groups} keys={KEYS} />
      {audio && <Audio src={staticFile('tuto-fondos/voz_mix.wav')} />}
    </AbsoluteFill>
  </Brand>
);

export const TutoFondosCover: React.FC = () => (
  <Brand value={ACTINVER}>
    <AbsoluteFill style={{background: P.ink}}>
      <Backdrop moods={[{at: 0, mood: 'actinver'}]} />
      <div style={{...center(210), ...txt(62, 600, P.mute, 0.2)}}>EN TU APP ACTINVER</div>
      <div style={{...center(290), ...txt(250, 800, P.white, -0.05)}}>3 TOQUES</div>
      <div style={{...abs(110, 600), ...txt(88, 800, P.ink, 0.02), background: '#3EE0A1', padding: '10px 38px', borderRadius: 24, transform: 'rotate(-4deg)'}}>COMPRAR</div>
      <div style={{...abs(530, 600), ...txt(88, 800, P.white, 0.02), background: '#FF5A5F', padding: '10px 38px', borderRadius: 24, transform: 'rotate(4deg)'}}>VENDER</div>
      <div style={{position: 'absolute', left: 220, top: 800, width: 640, height: 640, overflow: 'hidden', borderRadius: '44px 44px 0 0', border: '12px solid rgba(255,255,255,0.92)', borderBottom: 'none'}}>
        <Img src={staticFile('tuto-fondos/s_inv.jpg')} style={{width: 616, display: 'block'}} />
      </div>
      <div style={{...center(1500)}}><Chip size={30}>TUTORIAL · FONDOS</Chip></div>
      <Grain />
    </AbsoluteFill>
  </Brand>
);

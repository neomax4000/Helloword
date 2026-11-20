// PLAN B — Carrusel de noticias 2026-11-19 (protocolo-noticias.md §10). 4 imágenes fijas 1080×1920.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Backdrop, Card, Chip, FONT, Grain, P} from './pro';

// Zona segura de FOTOS en TikTok (medida con la captura del carrusel del 19 nov):
// arriba la barra «Buscar» tapa hasta ~y 340; a la derecha los botones desde ~x 900; abajo los puntos y la descripción desde ~y 1560.
// Todo el contenido va en una caja de diseño de 880 px de ancho escalada a S, desde (70, 360).
const S = 0.8;
const Zona: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{position: 'absolute', left: 70, top: 360, width: 880, transformOrigin: 'top left', transform: `scale(${S})`, display: 'flex', flexDirection: 'column', gap: 18}}>{children}</div>
);
const Cabeza: React.FC<{pag?: string}> = ({pag}) => (
  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: '0.2em', color: P.mute}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 14}}><span style={{width: 16, height: 16, borderRadius: 99, background: P.amber, display: 'inline-block'}} />NOTICIAS · 19 NOV</div>
    {pag && <div style={{color: P.ink, background: P.amber, borderRadius: 999, padding: '6px 24px', letterSpacing: '0.1em'}}>{pag}</div>}
  </div>
);
const Nota: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{fontFamily: FONT, fontWeight: 400, fontSize: 24, lineHeight: 1.3, color: 'rgba(255,255,255,0.55)'}}>{children}</div>
);

const NOTA = 'Contenido educativo, no es recomendación de inversión.';

type CardT = {k: string; v: string; sub?: string; color?: string};
type SlideP = {idx: number; mood: string; tag: string; title: string; big: string; bigSub: string; cards: CardT[]; puente: string; fuentes: string; pregunta?: string};

const Slide: React.FC<SlideP> = ({idx, mood, tag, title, big, bigSub, cards, puente, fuentes, pregunta}) => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={[{at: 0, mood}]} />
    <Zona>
      <Cabeza pag={`${idx}/3`} />
      <div><Chip size={28} bg={P.amber} color={P.ink}>{tag}</Chip></div>
      <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 76, lineHeight: 1.04, color: P.white, letterSpacing: '-0.02em'}}>{title}</div>
      <Card style={{padding: '30px 40px', textAlign: 'center'}}>
        <div style={{fontWeight: 800, fontSize: 160, lineHeight: 1.12, letterSpacing: '-0.03em', color: P.ink}}>{big}</div>
        <div style={{fontWeight: 600, fontSize: 36, lineHeight: 1.2, color: '#4A4F5E', marginTop: 18}}>{bigSub}</div>
      </Card>
      <div style={{display: 'flex', gap: 24}}>
        {cards.map((c, i) => (
          <Card key={i} style={{flex: 1, padding: '24px 28px', borderRadius: 36}}>
            <div style={{fontWeight: 700, fontSize: 26, letterSpacing: '0.04em', color: '#6B6F7C'}}>{c.k}</div>
            <div style={{fontWeight: 800, fontSize: 58, lineHeight: 1.05, color: c.color ?? P.ink, marginTop: 4}}>{c.v}</div>
            {c.sub && <div style={{fontWeight: 500, fontSize: 27, lineHeight: 1.2, color: '#4A4F5E', marginTop: 6}}>{c.sub}</div>}
          </Card>
        ))}
      </div>
      <div style={{background: 'rgba(255,255,255,0.10)', border: '2px solid rgba(255,255,255,0.25)', borderRadius: 36, padding: '24px 32px'}}>
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 28, letterSpacing: '0.14em', color: P.amber}}>PARA TU DINERO EN MÉXICO</div>
        <div style={{fontFamily: FONT, fontWeight: 500, fontSize: 34, lineHeight: 1.28, color: P.white, marginTop: 8}}>{puente}</div>
      </div>
      {pregunta && (
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 34, lineHeight: 1.2, color: P.ink, background: P.amber, borderRadius: 30, padding: '16px 28px', textAlign: 'center'}}>{pregunta}</div>
      )}
      <Nota>{NOTA} Fuentes: {fuentes}</Nota>
    </Zona>
    <Grain />
  </AbsoluteFill>
);

export const Carrusel1: React.FC = () => (
  <Slide
    idx={1} mood="navy" tag="BANXICO · MINUTA DEL 19 NOV"
    title="Banxico recortó con la junta partida"
    big="3 a 2" bigSub="así votó la junta el 5 de noviembre"
    cards={[
      {k: 'TASA AHORA', v: '6.25 %', sub: 'bajó de 6.50 %; se queda ahí «por un tiempo prolongado»'},
      {k: 'INFLACIÓN', v: '3.62 %', sub: '1ª quincena de oct.; la meta es 3 %'},
    ]}
    puente="Borja y Heath votaron en contra: menos ventaja de tasa frente a EE. UU. puede hacer más volátil al peso. Si tienes crédito a tasa variable o ahorro a plazo, la junta no anticipa más bajas pronto. Próxima decisión: 17 dic."
    fuentes="minuta del 19 nov vía EFE/Infobae; decisión del 5 nov, Expansión."
  />
);

export const Carrusel2: React.FC = () => (
  <Slide
    idx={2} mood="plum" tag="FED · MINUTAS DEL 18 NOV"
    title="La Fed no descarta subir tasas otra vez"
    big="25 pb" bigSub="puntos base (0.25 %): alza que el mercado ve probable antes de fin de año"
    cards={[
      {k: 'INFLACIÓN PCE (SEP)', v: '3.6 %', sub: 'subyacente: 3.1 %'},
      {k: 'DESEMPLEO (SEP)', v: '4.2 %', sub: 'EE. UU.'},
    ]}
    puente="Tasas más altas en EE. UU. suelen fortalecer al dólar frente al peso. Si tienes deudas en dólares o compras en línea en dólares, puede salirte más caro. Es un escenario, no una predicción."
    fuentes="Fed, minutas del FOMC 27–28 oct (publicadas 18 nov, 2:00 pm ET)."
  />
);

export const Carrusel3: React.FC = () => (
  <Slide
    idx={3} mood="ember" tag="EMPLEO · AUTOPARTES"
    title="Autopartes perdió 90,000 empleos"
    big="90,000" bigSub="empleos menos en 2 años, según la INA con datos de Inegi"
    cards={[
      {k: 'KPMG · PARA 2035', v: '50 %', sub: 'de los puestos del sector podrían automatizarse', color: P.coral},
      {k: 'LO QUE ESTÁ EN JUEGO', v: '3.5 M', sub: 'empleos en la cadena automotriz'},
    ]}
    puente="La INA aclara que el ajuste no se debe solo a aranceles. Si tu ingreso depende de este sector: arma tu fondo de emergencia y suma habilidades técnicas o digitales."
    fuentes="INA vía Expansión (3 sep); KPMG vía Expansión (17 nov)."
    pregunta="¿Cuál de las 3 te toca más? Cuéntame en comentarios"
  />
);

export const CarruselCover: React.FC = () => (
  <AbsoluteFill style={{background: P.ink}}>
    <Backdrop moods={[{at: 0, mood: 'navy'}]} />
    <Zona>
      <Cabeza />
      <div style={{fontFamily: FONT, marginTop: 30}}>
      <div style={{fontWeight: 700, fontSize: 60, letterSpacing: '0.3em', color: P.mute}}>3 NOTICIAS</div>
      <div style={{fontWeight: 800, fontSize: 150, lineHeight: 1.0, letterSpacing: '-0.03em', color: P.white, marginTop: 10}}>QUE TOCAN</div>
      <div style={{fontWeight: 800, fontSize: 150, lineHeight: 1.0, letterSpacing: '-0.03em', color: P.amber}}>TU DINERO</div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 22, marginTop: 90}}>
        {[['1', 'Banxico recortó con la junta partida'], ['2', 'La Fed no descarta subir tasas'], ['3', 'Autopartes: 90,000 empleos menos']].map(([n, t]) => (
          <Card key={n} style={{display: 'flex', alignItems: 'center', gap: 28, padding: '26px 34px', borderRadius: 36}}>
            <div style={{fontWeight: 800, fontSize: 84, color: P.amberDeep, lineHeight: 1, width: 64, flexShrink: 0, textAlign: 'center'}}>{n}</div>
            <div style={{fontWeight: 700, fontSize: 40, lineHeight: 1.15}}>{t}</div>
          </Card>
        ))}
      </div>
      <div style={{marginTop: 60, fontWeight: 600, fontSize: 40, color: P.mute}}>Desliza →</div>
      </div>
      <Nota>{NOTA}</Nota>
    </Zona>
    <Grain />
  </AbsoluteFill>
);

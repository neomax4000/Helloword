// PORTADA con titular corto y UNA palabra resaltada (para la portada puesta a mano en TikTok).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Backdrop, P} from '../pro';
import {txt} from './comun';
import {Personaje} from './Personaje';

export const PortadaTitular: React.FC<{
  antes: string;
  resaltada: string;
  despues?: string;
  mood?: string;
  personaje?: 'anfitrion' | 'puerquito' | 'ambos';
}> = ({antes, resaltada, despues, mood = 'navy', personaje = 'ambos'}) => (
  <AbsoluteFill>
    <Backdrop moods={[{at: 0, mood}]} />
    <div style={{position: 'absolute', left: 70, right: 70, top: 190, textAlign: 'center'}}>
      <div style={txt(96, 800, P.white, -0.04)}>{antes}</div>
      <div style={{display: 'inline-block', marginTop: 16, padding: '4px 34px 12px', background: P.amber, borderRadius: 26, transform: 'rotate(-2deg)', ...txt(124, 800, P.ink, -0.045)}}>{resaltada}</div>
      {despues && <div style={{...txt(96, 800, P.white, -0.04), marginTop: 16}}>{despues}</div>}
    </div>
    {(personaje === 'anfitrion' || personaje === 'ambos') && <Personaje quien="anfitrion" vista="senala" x={personaje === 'ambos' ? 650 : 540} y={1580} alto={640} entra="none" vida={false} />}
    {(personaje === 'puerquito' || personaje === 'ambos') && <Personaje quien="puerquito" vista="front" x={personaje === 'ambos' ? 230 : 540} y={1580} alto={personaje === 'ambos' ? 300 : 520} entra="none" vida={false} />}
  </AbsoluteFill>
);

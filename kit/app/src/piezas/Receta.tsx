// RECETA: arma una escena a partir de datos JSON, sin escribir código nuevo.
// {"a":0,"b":6,"mood":"navy","piezas":[{"pieza":"Duelo","props":{...}}, ...]}
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Backdrop} from '../pro';
import {Ventana} from './comun';
import {Chat} from './Chat';
import {Contador} from './Contador';
import {Cuenta} from './Cuenta';
import {Duelo} from './Duelo';
import {LineaTiempo} from './LineaTiempo';
import {Personaje} from './Personaje';
import {StickerLegal} from './StickerLegal';

export const PIEZAS: Record<string, React.FC<any>> = {Chat, Contador, Cuenta, Duelo, LineaTiempo, Personaje, StickerLegal};

export type EscenaReceta = {a: number; b?: number; piezas: {pieza: keyof typeof PIEZAS; props: Record<string, unknown>}[]};
export type Receta = {moods: {at: number; mood: string}[]; escenas: EscenaReceta[]};

export const RecetaVideo: React.FC<{receta: Receta}> = ({receta}) => (
  <AbsoluteFill>
    <Backdrop moods={receta.moods} />
    {receta.escenas.map((e, i) => (
      <Ventana key={i} a={e.a} b={e.b}>
        {e.piezas.map((p, k) => {
          const C = PIEZAS[p.pieza as string];
          return C ? <C key={k} {...p.props} /> : null;
        })}
      </Ventana>
    ))}
  </AbsoluteFill>
);

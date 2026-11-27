// Elenco del canal: anfitrión (hombre 2D, traje azul, corbata verde) y puerquito alcancía dorado.
// Las figuras vienen de pruebas/identidad/hoja-personajes y hoja-expresiones (elenco-data.ts, generado).
// Uso: <Personaje quien="anfitrion" vista="senala" x={540} y={1450} alto={760} at={1.2} />
import React from 'react';
import {FPS, cl, lerp, spr} from '../pro';
import {ELENCO} from './elenco-data';
import {useT} from './comun';

export type Quien = 'anfitrion' | 'puerquito';
export type Vista = 'front' | 'tq' | 'side' | 'back' | 'senala' | 'moneda' | 'abre';
export type Expr = 'guino' | 'alegre' | 'sorpresa' | 'duda' | 'preocupado' | 'dormido';

const DEFS =
  '<defs><linearGradient id="gold" x1=".1" y1="0" x2=".9" y2="1"><stop offset="0" stop-color="#FFE98C"/><stop offset=".5" stop-color="#F4BC33"/><stop offset="1" stop-color="#C98A12"/></linearGradient>' +
  '<linearGradient id="gold2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F8CF55"/><stop offset="1" stop-color="#B97D0E"/></linearGradient></defs>';

// viewBox [x, y, w, h]; la base de la caja es el suelo (pies / sombra)
const VB: Record<string, [number, number, number, number]> = {
  anfitrion: [-300, -620, 600, 640],
  busto: [-150, -600, 300, 300],
  puerquito: [-190, -190, 380, 390],
};

export const clave = (quien: Quien, vista: Vista, expr: Expr): string => {
  if (quien === 'anfitrion' && (vista === 'senala' || vista === 'moneda' || vista === 'abre')) return `anfitrion.${vista}`;
  const k = `${quien}.${vista}.${expr}`;
  return ELENCO[k] ? k : `${quien}.${vista}.alegre`;
};

export const Personaje: React.FC<{
  quien: Quien;
  vista?: Vista;
  expr?: Expr;
  /** centro horizontal y suelo (px, lienzo 1080×1920) */
  x: number;
  y: number;
  /** alto de la caja en px (anfitrión ≈ 760 de cuerpo entero; puerquito ≈ 380) */
  alto: number;
  /** solo anfitrión: recorta a busto (cabeza y hombros) */
  busto?: boolean;
  at?: number;
  entra?: 'pop' | 'rise' | 'none';
  /** movimiento continuo: respirar / rebotar */
  vida?: boolean;
  flip?: boolean;
  /** segundo en que sale (se desvanece) */
  hasta?: number;
}> = ({quien, vista = 'front', expr = 'alegre', x, y, alto, busto, at = 0, entra = 'pop', vida = true, flip, hasta}) => {
  const {f, t} = useT();
  if (t < at - 0.01) return null;
  const k = clave(quien, vista, expr);
  const vb = busto && quien === 'anfitrion' ? VB.busto : VB[quien];
  const ancho = (alto * vb[2]) / vb[3];
  const p = entra === 'none' ? 1 : spr(f, at, 11, 190, 0.7);
  const sc = entra === 'pop' ? lerp(0.5, 1, p) : 1;
  const dy = entra === 'rise' ? (1 - p) * 120 : 0;
  const respira = vida ? 1 + Math.sin((f / FPS) * 2.4) * 0.012 : 1;
  const rebote = vida && quien === 'puerquito' && expr !== 'dormido' ? Math.abs(Math.sin((f / FPS) * 3)) * -10 : 0;
  const salida = hasta !== undefined ? cl((t - hasta) / 0.2) : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - ancho / 2,
        top: y - alto,
        width: ancho,
        height: alto,
        opacity: cl(p * 2.5) * (1 - salida),
        transform: `translateY(${dy + rebote}px) scale(${sc * respira}) scaleX(${flip ? -1 : 1})`,
        transformOrigin: '50% 100%',
      }}
    >
      <svg width={ancho} height={alto} viewBox={vb.join(' ')} style={{overflow: 'visible'}} dangerouslySetInnerHTML={{__html: DEFS + ELENCO[k]}} />
    </div>
  );
};

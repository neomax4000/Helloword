// Utilidades compartidas de las piezas. Tiempos en SEGUNDOS, absolutos dentro de la composición
// (si la pieza va dentro de un <Sequence>, usa tiempos locales de esa secuencia).
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FONT, FPS, P, cl} from '../pro';

export const useT = () => {
  const f = useCurrentFrame();
  return {f, t: f / FPS};
};

export const txt = (size: number, weight = 800, color: string = P.white, ls = -0.02): React.CSSProperties => ({
  fontFamily: FONT,
  fontWeight: weight,
  fontSize: size,
  color,
  letterSpacing: `${ls}em`,
  lineHeight: 1.08,
});

/** Muestra a sus hijos entre a y b (s) con entrada y salida suaves. b = Infinity → se queda. */
export const Ventana: React.FC<{a: number; b?: number; children: React.ReactNode}> = ({a, b = Infinity, children}) => {
  const {t} = useT();
  if (t < a - 0.01 || t > b + 0.25) return null;
  const pin = a <= 0 ? 1 : cl((t - a) / 0.12);
  const pout = Number.isFinite(b) ? cl((t - b) / 0.16) : 0;
  return <div style={{position: 'absolute', inset: 0, opacity: pin * (1 - pout)}}>{children}</div>;
};

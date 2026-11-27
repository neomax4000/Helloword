// CONTADOR: una cifra gigante que sube o baja entre dos valores (cuenta en vivo).
import React from 'react';
import {P, cl, easeIO, lerp, prog, spr} from '../pro';
import {txt, useT} from './comun';

const fmt = (n: number, dec: number) => n.toLocaleString('en-US', {minimumFractionDigits: dec, maximumFractionDigits: dec});

export const Contador: React.FC<{
  desde: number;
  hasta: number;
  /** segundo en que empieza y dura el conteo */
  at: number;
  dur?: number;
  prefijo?: string;
  sufijo?: string;
  decimales?: number;
  color?: string;
  tam?: number;
  y?: number;
  etiqueta?: string;
}> = ({desde, hasta, at, dur = 2, prefijo = '$', sufijo = '', decimales = 0, color = P.amber, tam = 200, y = 640, etiqueta}) => {
  const {f, t} = useT();
  if (t < at - 0.01) return null;
  const v = lerp(desde, hasta, easeIO(prog(t, at, at + dur)));
  const golpe = spr(f, at, 9, 240, 0.55);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', opacity: cl(golpe * 3)}}>
      {etiqueta && <div style={{...txt(46, 700, P.mute, 0.04), marginBottom: 10}}>{etiqueta}</div>}
      <div style={{...txt(tam, 800, color, -0.045), transform: `scale(${lerp(1.12, 1, golpe)})`, textShadow: '0 20px 60px rgba(0,0,0,0.55)'}}>
        {prefijo}
        {fmt(v, decimales)}
        {sufijo}
      </div>
    </div>
  );
};

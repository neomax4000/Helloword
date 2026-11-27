// LÍNEA DE TIEMPO vertical: una línea que crece y nodos con título y detalle (cronología, día 1 → día 90).
import React from 'react';
import {P, cl, lerp, prog, spr} from '../pro';
import {txt, useT} from './comun';

export type Nodo = {at: number; titulo: string; detalle?: string; color?: string};

export const LineaTiempo: React.FC<{nodos: Nodo[]; top?: number; paso?: number}> = ({nodos, top = 300, paso = 270}) => {
  const {f, t} = useT();
  const ultimo = nodos.filter((n) => t >= n.at).length;
  const hasta = ultimo === 0 ? 0 : ultimo - 1 + (nodos[ultimo] ? prog(t, nodos[ultimo - 1].at, nodos[ultimo].at) : 1);
  const largo = (nodos.length - 1) * paso;
  return (
    <>
      <div style={{position: 'absolute', left: 160, top: top + 40, width: 12, height: largo, background: 'rgba(255,255,255,0.14)', borderRadius: 9}} />
      <div style={{position: 'absolute', left: 160, top: top + 40, width: 12, height: Math.min(largo, hasta * paso), background: P.amber, borderRadius: 9}} />
      {nodos.map((n, k) => {
        if (t < n.at - 0.01) return null;
        const p = spr(f, n.at, 13, 190, 0.65);
        const c = n.color ?? P.amber;
        return (
          <div key={k} style={{position: 'absolute', left: 100, right: 80, top: top + k * paso, opacity: cl(p * 2.4)}}>
            <div style={{position: 'absolute', left: 0, top: 6, width: 132, height: 132, borderRadius: 99, background: c, transform: `scale(${lerp(0.4, 1, p)})`}} />
            <div style={{position: 'absolute', left: 0, top: 6, width: 132, height: 132, ...txt(52, 800, P.ink, -0.03), display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${lerp(0.4, 1, p)})`}}>{k + 1}</div>
            <div style={{marginLeft: 180, transform: `translateX(${(1 - p) * 50}px)`}}>
              <div style={txt(70, 800, P.white, -0.03)}>{n.titulo}</div>
              {n.detalle && <div style={{...txt(40, 500, P.mute, 0), marginTop: 8}}>{n.detalle}</div>}
            </div>
          </div>
        );
      })}
    </>
  );
};

// CUENTA EN VIVO: tarjeta tipo ticket donde cada fila aparece a su tiempo (operaciones con cifras).
import React from 'react';
import {P, cl, lerp, spr} from '../pro';
import {txt, useT} from './comun';

export type Fila = {at: number; izq: string; der: string; color?: string; fuerte?: boolean};

export const Cuenta: React.FC<{filas: Fila[]; y?: number; titulo?: string; at?: number}> = ({filas, y = 420, titulo, at = 0}) => {
  const {f, t} = useT();
  if (t < at - 0.01) return null;
  const pc = spr(f, at, 14, 180, 0.7);
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: y, background: P.paper, borderRadius: 40, padding: '38px 48px 30px', boxShadow: '0 30px 70px rgba(0,0,0,0.4)', opacity: cl(pc * 2.5), transform: `translateY(${(1 - pc) * 50}px)`}}>
      {titulo && <div style={{...txt(34, 700, 'rgba(10,15,31,0.55)', 0.08), marginBottom: 14}}>{titulo.toUpperCase()}</div>}
      {filas.map((r, k) => {
        if (t < r.at - 0.01) return null;
        const p = spr(f, r.at, 14, 200, 0.6);
        return (
          <div key={k} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 0', borderTop: k ? '3px dashed rgba(10,15,31,0.14)' : 'none', opacity: cl(p * 2.4), transform: `translateX(${(1 - p) * 40}px)`}}>
            <span style={txt(r.fuerte ? 52 : 44, r.fuerte ? 800 : 600, P.ink, -0.01)}>{r.izq}</span>
            <span style={txt(r.fuerte ? 78 : 56, 800, r.color ?? P.ink, -0.03)}>{r.der}</span>
          </div>
        );
      })}
    </div>
  );
};

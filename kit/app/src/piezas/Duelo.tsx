// DUELO A vs B: dos mitades con una cifra grande cada una y un «VS» al centro.
import React from 'react';
import {P, cl, lerp, spr} from '../pro';
import {txt, useT} from './comun';

export type Lado = {etiqueta: string; valor: string; sub?: string; color?: string; at?: number};

const Mitad: React.FC<{d: Lado; top: number; h: number; fondo: string; at: number}> = ({d, top, h, fondo, at}) => {
  const {f} = useT();
  const p = spr(f, d.at ?? at, 13, 190, 0.7);
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top, height: h, borderRadius: 44, background: fondo, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: cl(p * 2.2), transform: `translateY(${(1 - p) * 60}px) scale(${lerp(0.92, 1, p)})`, boxShadow: '0 24px 60px rgba(0,0,0,0.35)'}}>
      <div style={txt(44, 700, 'rgba(10,15,31,0.7)', 0.04)}>{d.etiqueta}</div>
      <div style={txt(200, 800, d.color ?? P.ink, -0.045)}>{d.valor}</div>
      {d.sub && <div style={txt(38, 500, 'rgba(10,15,31,0.65)', 0)}>{d.sub}</div>}
    </div>
  );
};

export const Duelo: React.FC<{a: Lado; b: Lado; at?: number; top?: number; alto?: number; vs?: string; fondo?: string}> = ({a, b, at = 0, top = 230, alto = 1180, vs = 'VS', fondo = P.paper}) => {
  const {f} = useT();
  const h = (alto - 30) / 2;
  const pv = spr(f, (b.at ?? at + 0.6) - 0.1, 9, 260, 0.6);
  return (
    <>
      <Mitad d={a} top={top} h={h} fondo={fondo} at={at} />
      <Mitad d={b} top={top + h + 30} h={h} fondo={fondo} at={at + 0.6} />
      <div style={{position: 'absolute', left: 540 - 66, top: top + h - 36, width: 132, height: 132, borderRadius: 99, background: P.ink, border: `8px solid ${P.amber}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pv})`, ...txt(48, 800, P.amber, 0)}}>{vs}</div>
    </>
  );
};

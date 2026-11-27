// STICKER: etiqueta rotada dentro de la escena («EJEMPLO», «NO ES RECOMENDACIÓN», «REVISA LA VIGENTE»).
import React from 'react';
import {P, cl, lerp, spr} from '../pro';
import {txt, useT} from './comun';

export const StickerLegal: React.FC<{texto: string; at?: number; hasta?: number; rot?: number; x?: number; y?: number; fondo?: string; color?: string; tam?: number}> = ({texto, at = 0, hasta, rot = -6, x = 540, y = 1380, fondo = P.amber, color = P.ink, tam = 44}) => {
  const {f, t} = useT();
  if (t < at - 0.01) return null;
  const p = spr(f, at, 9, 260, 0.6);
  const out = hasta !== undefined ? cl((t - hasta) / 0.15) : 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${lerp(1.6, 1, p)})`, opacity: cl(p * 3) * (1 - out), background: fondo, borderRadius: 18, padding: '14px 34px', boxShadow: '0 10px 0 rgba(0,0,0,0.28)', whiteSpace: 'nowrap', ...txt(tam, 800, color, 0.03)}}>
      {texto.toUpperCase()}
    </div>
  );
};

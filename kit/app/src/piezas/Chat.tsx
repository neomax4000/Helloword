// CHAT tipo mensajería: burbujas entrantes (blancas) y salientes (verdes) que aparecen a su tiempo.
import React from 'react';
import {FONT, cl, lerp, spr} from '../pro';
import {txt, useT} from './comun';

export type Msg = {at: number; lado: 'in' | 'out'; texto: string; hora?: string; fondo?: string; color?: string};

const TINTA = '#1B2B2A';
const VERDE = '#D7F5C9';

const Burbuja: React.FC<{m: Msg}> = ({m}) => (
  <div style={{display: 'flex', justifyContent: m.lado === 'in' ? 'flex-start' : 'flex-end'}}>
    <div style={{background: m.fondo ?? (m.lado === 'in' ? '#FFFFFF' : VERDE), borderRadius: m.lado === 'in' ? '8px 34px 34px 34px' : '34px 8px 34px 34px', padding: '22px 30px 24px', maxWidth: 780, boxShadow: '0 4px 0 rgba(0,0,0,0.12)'}}>
      <span style={{...txt(48, 600, m.color ?? TINTA, 0), fontFamily: FONT}}>{m.texto}</span>
      {m.hora && <span style={{...txt(24, 500, 'rgba(27,43,42,0.45)', 0), marginLeft: 16, float: 'right', marginTop: 14}}>{m.hora}</span>}
    </div>
  </div>
);

const Fila: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
  const {f, t} = useT();
  if (t < at - 0.001) return null;
  const p = spr(f, at, 14, 190, 0.7);
  return (
    <div style={{display: 'grid', gridTemplateRows: `${cl(p, 0, 1.02)}fr`, opacity: cl(p * 2.2)}}>
      <div style={{minHeight: 0, overflow: 'hidden'}}>
        <div style={{paddingBottom: 26, transform: `scale(${lerp(0.88, 1, p)})`, transformOrigin: '0 100%'}}>{children}</div>
      </div>
    </div>
  );
};

const Puntos: React.FC = () => {
  const {f} = useT();
  return (
    <div style={{display: 'flex', gap: 12, background: '#fff', borderRadius: '8px 34px 34px 34px', padding: '26px 34px', width: 140}}>
      {[0, 1, 2].map((k) => (
        <span key={k} style={{width: 18, height: 18, borderRadius: 99, background: '#8A9A97', display: 'inline-block', transform: `translateY(${Math.sin(f / 4 - k * 0.9) * 7}px)`}} />
      ))}
    </div>
  );
};

export const Chat: React.FC<{
  msgs: Msg[];
  top?: number;
  alto?: number;
  /** muestra «escribiendo…» antes de cada mensaje entrante (1 s antes) */
  escribiendo?: boolean;
  fondo?: string;
  /** nombre del contacto arriba */
  contacto?: string;
}> = ({msgs, top = 330, alto = 960, escribiendo = true, fondo = '#E8DFD0', contacto}) => {
  const {t} = useT();
  const sig = msgs.find((m) => m.lado === 'in' && t >= m.at - 1 && t < m.at);
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: top - 20, height: alto + 40, background: fondo}} />
      {contacto && (
        <div style={{position: 'absolute', left: 0, right: 0, top: top - 20 - 120, height: 120, background: '#1F8A70', display: 'flex', alignItems: 'center', paddingLeft: 60, ...txt(44, 700, '#fff', 0)}}>{contacto}</div>
      )}
      <div style={{position: 'absolute', left: 50, right: 50, top, height: alto, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 12%)'}}>
        {msgs.map((m, k) => (
          <Fila key={k} at={m.at}>
            <Burbuja m={m} />
          </Fila>
        ))}
        {escribiendo && sig && (
          <Fila at={sig.at - 1}>
            <Puntos />
          </Fila>
        )}
      </div>
    </>
  );
};

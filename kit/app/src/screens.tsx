import React from 'react';
import {Img, staticFile} from 'remotion';
import {C, FONT, K, SC_H, SC_W} from './theme';
import {Check, P, PL, sp} from './common';

const px = (v: number) => v * K;

/* ===== Piezas reutilizables ===== */
export const LoginShot: React.FC<{dim?: number}> = ({dim = 0}) => (
  <div style={{position: 'absolute', inset: 0}}>
    <Img src={staticFile('login.jpg')} style={{width: SC_W, height: SC_H, objectFit: 'cover'}} />
    {dim > 0 && <div style={{position: 'absolute', inset: 0, background: `rgba(3,6,12,${dim})`}} />}
  </div>
);

// zonas de la captura de login (coordenadas ya en pantalla)
export const ZONES = {
  field: {x: px(60), y: px(878), w: px(1086), h: px(144)},
  link: {x: px(50), y: px(655), w: px(720), h: px(70)},
  toggleRow: {x: px(46), y: px(1128), w: px(690), h: px(122)},
  toggle: {x: px(60), y: px(1142), w: px(153), h: px(93)},
};

export const Spot: React.FC<{x: number; y: number; w: number; h: number; r?: number; a: number; f: number}> = ({x, y, w, h, r = 14, a, f}) => {
  const pulse = 0.5 + 0.5 * Math.sin(f / 6);
  return (
    <>
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, boxShadow: `0 0 0 1600px rgba(3,6,12,${0.62 * a})`}} />
      <div
        style={{
          position: 'absolute',
          left: x - 4,
          top: y - 4,
          width: w + 8,
          height: h + 8,
          borderRadius: r + 4,
          border: `3px solid ${C.gold}`,
          opacity: a * (0.65 + 0.35 * pulse),
          boxShadow: `0 0 ${16 + 14 * pulse}px rgba(179,163,105,0.55)`,
        }}
      />
    </>
  );
};

export const Zoom: React.FC<{scale: number; ox: number; oy: number; children: React.ReactNode}> = ({scale, ox, oy, children}) => (
  <div style={{position: 'absolute', inset: 0, transform: `scale(${scale})`, transformOrigin: `${ox}px ${oy}px`}}>{children}</div>
);

const GoldBar: React.FC = () => <div style={{position: 'absolute', left: 0, top: 30, width: 27, height: 112, background: C.gold}} />;

const Title: React.FC<{children: React.ReactNode; top?: number}> = ({children, top = 168}) => (
  <div style={{position: 'absolute', left: 27, top, fontFamily: FONT, fontWeight: 300, fontSize: 33, color: '#fff', letterSpacing: 0}}>{children}</div>
);

const Label: React.FC<{top: number; children: React.ReactNode}> = ({top, children}) => (
  <div style={{position: 'absolute', left: 27, top, fontFamily: FONT, fontWeight: 500, fontSize: 18, color: '#fff'}}>{children}</div>
);

const Field: React.FC<{top: number; dots?: number; ok?: number; h?: number}> = ({top, dots = 0, ok = 0, h = 66}) => (
  <div style={{position: 'absolute', left: 27, top, width: 486, height: h, background: C.field, borderBottom: '2px solid #CFC29A', boxSizing: 'border-box'}}>
    <div style={{position: 'absolute', left: 18, top: 0, height: h, display: 'flex', alignItems: 'center', gap: 9}}>
      {Array.from({length: dots}).map((_, i) => (
        <div key={i} style={{width: 12, height: 12, borderRadius: '50%', background: '#fff', opacity: 0.92}} />
      ))}
    </div>
    <div style={{position: 'absolute', right: 16, top: 0, height: h, display: 'flex', alignItems: 'center'}}>
      {ok > 0 ? (
        <div style={{width: 34, height: 34, borderRadius: '50%', background: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${ok})`}}>
          <Check size={22} p={1} color="#0A1018" stroke={7} />
        </div>
      ) : (
        <svg width="30" height="30" viewBox="0 0 30 30" opacity="0.8">
          <path d="M2 15 C7 7 23 7 28 15 C23 23 7 23 2 15 Z" fill="none" stroke="#fff" strokeWidth="2" />
          <circle cx="15" cy="15" r="4" fill="none" stroke="#fff" strokeWidth="2" />
        </svg>
      )}
    </div>
  </div>
);

const Btn: React.FC<{top: number; text: string; on: number; f?: number}> = ({top, text, on, f = 0}) => {
  const bg = on > 0.5 ? C.gold : C.grey;
  return (
    <div
      style={{
        position: 'absolute',
        left: 27,
        top,
        width: 486,
        height: 66,
        borderRadius: 33,
        background: bg,
        color: on > 0.5 ? '#0A1018' : '#8c8c8c',
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: on > 0.5 ? `scale(${1 + 0.015 * Math.sin(f / 4)})` : 'none',
        boxShadow: on > 0.5 ? '0 0 26px rgba(179,163,105,0.45)' : 'none',
      }}
    >
      {text}
    </div>
  );
};

/* ===== Pantalla de inicio (paso 1) ===== */
const PASTELS = ['#5b6fb5', '#d98c6a', '#6bb28f', '#c06a8c', '#8a7ad6', '#d6b25e', '#5aa7c7', '#a0a8b8'];

export const HomeScreen: React.FC<{f: number; slotPulse: number; iconIn: number; ring: number; done: number}> = ({f, slotPulse, iconIn, ring, done}) => {
  const pitch = 122.67;
  const slots: React.ReactNode[] = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 4; c++) {
      if (r === 2 && c === 1) continue;
      const i = r * 4 + c;
      slots.push(
        <div key={i} style={{position: 'absolute', left: 36 + c * pitch, top: 110 + r * 150, width: 100}}>
          <div style={{width: 100, height: 100, borderRadius: 24, background: PASTELS[i % PASTELS.length], opacity: 0.82}} />
          <div style={{margin: '14px auto 0', width: 54, height: 9, borderRadius: 5, background: 'rgba(255,255,255,0.55)'}} />
        </div>,
      );
    }
  }
  const cx = 36 + pitch + 50;
  const cy = 110 + 300 + 50;
  const pulse = 0.5 + 0.5 * Math.sin(f / 7);
  const pop = done > 0 ? 1 + 0.16 * Math.sin(Math.min(1, done) * Math.PI) : 1;
  return (
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(165deg,#2c3b6e 0%,#58699b 46%,#b3aab9 100%)'}}>
      {slots}
      {/* dock */}
      <div style={{position: 'absolute', left: 30, right: 30, top: 846, height: 112, borderRadius: 38, background: 'rgba(255,255,255,0.22)'}} />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{position: 'absolute', left: 52 + i * 122, top: 862, width: 80, height: 80, borderRadius: 20, background: PASTELS[(i * 3 + 1) % PASTELS.length], opacity: 0.9}} />
      ))}
      {/* hueco vacío */}
      {iconIn < 0.05 && (
        <div
          style={{
            position: 'absolute',
            left: cx - 50,
            top: cy - 50,
            width: 100,
            height: 100,
            borderRadius: 24,
            border: `3px dashed ${C.gold}`,
            opacity: 0.45 + 0.55 * pulse * slotPulse,
            transform: `scale(${1 + 0.05 * pulse * slotPulse})`,
          }}
        />
      )}
      {iconIn > 0.02 && (
        <div style={{position: 'absolute', left: cx - 50, top: cy - 50, width: 100, transform: `scale(${(0.6 + 0.4 * iconIn) * pop})`, opacity: iconIn}}>
          <Img src={staticFile('icono.png')} style={{width: 100, height: 100, opacity: 0.45 + 0.55 * Math.min(1, done * 4 + (ring >= 1 ? 1 : 0))}} />
          <div style={{textAlign: 'center', marginTop: 8, fontFamily: FONT, fontWeight: 600, fontSize: 17, color: '#fff'}}>Actinver</div>
          {ring > 0 && ring < 1 && (
            <svg width="148" height="148" viewBox="0 0 148 148" style={{position: 'absolute', left: -24, top: -24}}>
              <circle cx="74" cy="74" r="66" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="6" />
              <circle
                cx="74"
                cy="74"
                r="66"
                fill="none"
                stroke={C.gold}
                strokeWidth="7"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - ring}
                transform="rotate(-90 74 74)"
              />
            </svg>
          )}
          {done > 0 && done < 1 && (
            <div
              style={{
                position: 'absolute',
                left: -30,
                top: -30,
                width: 160,
                height: 160,
                borderRadius: 40,
                border: `4px solid ${C.gold}`,
                opacity: 1 - done,
                transform: `scale(${0.8 + done * 0.5})`,
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

/* ===== Permiso de ubicación (ilustrativo) ===== */
export const PermDialog: React.FC<{f: number; enter: number; badge: number; press: number; exit: number}> = ({f, enter, badge, press, exit}) => {
  const bob = Math.sin(f / 8) * 5;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: 1 - exit}}>
      <div style={{position: 'absolute', inset: 0, background: `rgba(3,6,12,${0.66 * enter})`}} />
      <div
        style={{
          position: 'absolute',
          left: 50,
          top: 250,
          width: 440,
          borderRadius: 34,
          background: '#F3F5FA',
          padding: '34px 30px 26px',
          boxSizing: 'border-box',
          transform: `translateY(${(1 - enter) * 120}px) scale(${0.9 + 0.1 * enter})`,
          opacity: enter,
          boxShadow: '0 30px 70px rgba(0,0,0,0.5)',
          textAlign: 'center',
          fontFamily: FONT,
        }}
      >
        <div style={{width: 92, height: 92, borderRadius: '50%', background: '#0B1F44', margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `translateY(${bob}px)`}}>
          <svg width="50" height="56" viewBox="0 0 50 56">
            <path d="M25 3 C14 3 6 11 6 21 C6 35 25 53 25 53 C25 53 44 35 44 21 C44 11 36 3 25 3 Z" fill={C.gold} />
            <circle cx="25" cy="21" r="8" fill="#0B1F44" />
          </svg>
        </div>
        <div style={{fontWeight: 800, fontSize: 28, color: '#0B1118', marginBottom: 10}}>Permitir ubicación</div>
        <div style={{fontWeight: 500, fontSize: 18, lineHeight: 1.35, color: '#4A5468', marginBottom: 24}}>Actinver necesita saber dónde estás para continuar.</div>
        <div
          style={{
            height: 62,
            borderRadius: 31,
            background: '#0B1F44',
            color: '#fff',
            fontWeight: 800,
            fontSize: 21,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
            boxShadow: badge > 0 ? `0 0 0 ${3 + 3 * Math.sin(f / 5)}px rgba(179,163,105,0.9), 0 0 24px rgba(179,163,105,0.6)` : 'none',
            transform: `scale(${1 - 0.05 * Math.sin(Math.min(1, press) * Math.PI)})`,
          }}
        >
          Permitir
        </div>
        <div style={{height: 50, color: '#6b7488', fontWeight: 600, fontSize: 19, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>No permitir</div>
        <div
          style={{
            position: 'absolute',
            right: -14,
            top: -22,
            padding: '8px 18px',
            borderRadius: 18,
            background: C.gold,
            color: '#0A1018',
            fontWeight: 800,
            fontSize: 19,
            transform: `rotate(6deg) scale(${badge})`,
            opacity: badge,
            boxShadow: '0 10px 24px rgba(0,0,0,0.4)',
          }}
        >
          Indispensable
        </div>
      </div>
    </div>
  );
};

/* ===== Código SMS (ilustrativo) ===== */
export const CodeScreen: React.FC<{f: number; filled: number; on: number}> = ({f, filled, on}) => (
  <div style={{position: 'absolute', inset: 0, background: C.appBg}}>
    <GoldBar />
    <Title top={176}>Verifica tu número</Title>
    <div style={{position: 'absolute', left: 27, top: 236, fontFamily: FONT, fontWeight: 500, fontSize: 19, color: C.mute, width: 460, lineHeight: 1.35}}>
      Ingresa el código que te enviamos por SMS.
    </div>
    <div style={{position: 'absolute', left: 27, top: 340, display: 'flex', gap: 10}}>
      {Array.from({length: 6}).map((_, i) => {
        const on1 = i < filled;
        const s = on1 ? sp(f, 0, 12, 200) : 0;
        return (
          <div
            key={i}
            style={{
              width: 71,
              height: 92,
              borderRadius: 14,
              background: C.field,
              borderBottom: `3px solid ${i === Math.floor(filled) ? C.gold : '#3b4456'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {on1 && <div style={{width: 16, height: 16, borderRadius: '50%', background: '#fff', transform: `scale(${Math.min(1, s)})`}} />}
          </div>
        );
      })}
    </div>
    <Btn top={520} text="Continuar" on={on} f={f} />
  </div>
);

/* ===== Contraseña (ilustrativo) ===== */
const REQ = ['Una letra mayúscula', 'Una letra minúscula', 'Un número', 'Un carácter especial'];
const CHIPS = ['.', ',', '-', '_', '*', '#', '$', '?', '!'];

export const PassScreen: React.FC<{f: number; typed: number; len: number; reqs: number[]; chips: number; hi: number}> = ({f, typed, len, reqs, chips, hi}) => (
  <div style={{position: 'absolute', inset: 0, background: C.appBg}}>
    <GoldBar />
    <Title top={168}>Crea tu contraseña</Title>
    <Label top={246}>Contraseña</Label>
    <Field top={276} dots={typed} />
    <div style={{position: 'absolute', left: 27, top: 350, fontFamily: FONT, fontWeight: 600, fontSize: 17, color: len > 0 ? C.gold : C.mute, opacity: 0.4 + 0.6 * len}}>
      Entre 8 y 20 caracteres
    </div>
    {REQ.map((t, i) => {
      const p = reqs[i];
      return (
        <div key={t} style={{position: 'absolute', left: 27, top: 410 + i * 58, display: 'flex', alignItems: 'center', gap: 16, opacity: 0.5 + 0.5 * p}}>
          <div style={{width: 34, height: 34, borderRadius: '50%', border: `2.5px solid ${p > 0.2 ? C.gold : '#4a5366'}`, background: p > 0.2 ? C.gold : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + 0.18 * Math.sin(Math.min(1, p) * Math.PI)})`}}>
            <Check size={22} p={p} color="#0A1018" stroke={7} />
          </div>
          <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 21, color: '#fff'}}>{t}</div>
        </div>
      );
    })}
    <div style={{position: 'absolute', left: 27, top: 664, fontFamily: FONT, fontWeight: 600, fontSize: 17, color: C.mute, opacity: chips}}>Caracteres especiales</div>
    {CHIPS.map((ch, i) => {
      const row = Math.floor(i / 5);
      const col = i % 5;
      const s = PL(chips, i * 0.07, i * 0.07 + 0.35);
      const rec = ch === '.' || ch === '-';
      const dim = hi > 0 && !rec ? 1 - 0.55 * hi : 1;
      const on = rec && hi > 0;
      return (
        <div
          key={ch}
          style={{
            position: 'absolute',
            left: 27 + col * 91,
            top: 700 + row * 92,
            width: 76,
            height: 76,
            borderRadius: 20,
            background: on ? C.gold : C.field,
            color: on ? '#0A1018' : '#fff',
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: s * dim,
            transform: `scale(${(0.6 + 0.4 * s) * (on ? 1 + 0.1 * hi + 0.03 * Math.sin(f / 4) : 1)})`,
            boxShadow: on ? '0 0 26px rgba(179,163,105,0.65)' : 'none',
          }}
        >
          {ch}
        </div>
      );
    })}
    {hi > 0 && (
      <div style={{position: 'absolute', left: 27 + 4 * 91 - 8 + 0, top: 786, fontFamily: FONT, fontWeight: 700, fontSize: 17, color: C.gold, opacity: hi, width: 150}}>
        ← De preferencia
      </div>
    )}
  </div>
);

/* ===== Confirmar y aceptar (ilustrativo) ===== */
export const ConfirmScreen: React.FC<{f: number; typed2: number; match: number; terms: number; on: number; success: number}> = ({f, typed2, match, terms, on, success}) => (
  <div style={{position: 'absolute', inset: 0, background: C.appBg}}>
    <GoldBar />
    <Title top={168}>Confirma tu contraseña</Title>
    <Label top={254}>Contraseña</Label>
    <Field top={284} dots={10} />
    <Label top={384}>Confirmar contraseña</Label>
    <Field top={414} dots={typed2} ok={match} />
    <div style={{position: 'absolute', left: 27, top: 534, width: 486, display: 'flex', alignItems: 'center', gap: 16}}>
      <div style={{width: 40, height: 40, borderRadius: 11, border: `2.5px solid ${terms > 0.1 ? C.gold : '#5b6477'}`, background: terms > 0.1 ? C.gold : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: `scale(${1 + 0.2 * Math.sin(Math.min(1, terms) * Math.PI)})`}}>
        <Check size={28} p={terms} color="#0A1018" stroke={7} />
      </div>
      <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 20, color: '#fff', lineHeight: 1.3}}>Acepto las condiciones de servicio</div>
    </div>
    <Btn top={660} text="Continuar" on={on} f={f} />
    {/* éxito */}
    <div style={{position: 'absolute', inset: 0, background: C.appBg, opacity: P(success, 0, 1), display: success > 0 ? 'flex' : 'none', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28}}>
      <div style={{width: 168, height: 168, borderRadius: '50%', background: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${sp(success * 40, 0, 12, 140)})`, boxShadow: '0 0 60px rgba(179,163,105,0.5)'}}>
        <Check size={110} p={PL(success, 0.25, 0.7)} color="#0A1018" stroke={6} />
      </div>
      <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 40, color: '#fff', opacity: PL(success, 0.4, 0.8)}}>App instalada</div>
    </div>
  </div>
);

/* ===== Interruptor "Recordar mi usuario" sobre la captura ===== */
export const ToggleOverlay: React.FC<{on: number}> = ({on}) => {
  const z = ZONES.toggle;
  const w = z.w + 4;
  const h = z.h + 4;
  const knob = h - 10;
  const knobX = 5 + on * (w - knob - 10);
  return (
    <div style={{position: 'absolute', left: z.x - 2, top: z.y - 2, width: w, height: h, borderRadius: 999, background: on > 0.5 ? C.gold : '#757575'}}>
      <div style={{position: 'absolute', left: knobX, top: 5, width: knob, height: knob, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.35)'}} />
    </div>
  );
};

/* ===== Iconos biométricos ===== */
export const Fingerprint: React.FC<{size?: number; color?: string}> = ({size = 120, color = C.gold}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="4.5" strokeLinecap="round">
    <path d="M22 30 C28 16 44 10 58 14 C72 18 82 30 80 46" />
    <path d="M14 48 C14 36 18 30 22 25" />
    <path d="M30 40 C32 30 42 24 52 26 C62 28 68 36 66 48 C65 58 66 68 72 78" />
    <path d="M22 52 C22 66 26 78 34 88" />
    <path d="M38 52 C38 44 44 40 50 42 C56 44 56 52 54 60 C52 70 56 80 62 86" />
    <path d="M46 56 C46 66 46 76 50 90" />
    <path d="M80 56 C80 66 82 74 86 82" />
  </svg>
);

export const FaceId: React.FC<{size?: number; color?: string}> = ({size = 120, color = C.gold}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 34 V22 a10 10 0 0 1 10 -10 H34" />
    <path d="M66 12 H78 a10 10 0 0 1 10 10 V34" />
    <path d="M88 66 V78 a10 10 0 0 1 -10 10 H66" />
    <path d="M34 88 H22 a10 10 0 0 1 -10 -10 V66" />
    <path d="M36 38 V46" />
    <path d="M64 38 V46" />
    <path d="M50 40 V56 H45" />
    <path d="M36 68 C44 76 56 76 64 68" />
  </svg>
);

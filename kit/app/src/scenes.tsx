import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT, FPS, H, W} from './theme';
import {Captions, Check, Header, P, PL, Phone, Ripple, SceneFrame, Sentence, sp} from './common';
import {
  CodeScreen,
  ConfirmScreen,
  FaceId,
  Fingerprint,
  HomeScreen,
  LoginShot,
  PassScreen,
  PermDialog,
  Spot,
  ToggleOverlay,
  ZONES,
} from './screens';

export type SceneData = {id: string; start: number; end: number; sentences: Sentence[]};
export type Props = {sc: SceneData; dur: number; first?: boolean; last?: boolean};

const frames = (sc: SceneData) => sc.sentences.map((s) => ({a: (s.start - sc.start) * FPS, b: (s.end - sc.start) * FPS}));

const Tag: React.FC<{f: number; children?: React.ReactNode}> = ({f}) => (
  <Img src={staticFile('logo_blanco.png')} style={{position: 'absolute', top: 110, left: (W - 400) / 2, width: 400, opacity: P(f, 0, 18)}} />
);

/* ===================== INTRO ===================== */
export const Intro: React.FC<Props> = (p) => {
  const f = useCurrentFrame();
  const S = frames(p.sc);
  const ringP = P(f, 6, 30);
  const checkP = P(f, 22, 40);
  const t1 = sp(f, 18, 14, 100);
  const t2 = P(f, 40, 62);
  const cardS = sp(f, S[1].a + 2, 16, 90);
  const burstP = PL(f, 28, 62);
  const coinLand = [0, 1, 2].map((i) => S[1].a + 14 + i * 24 + 26);
  const glow = Math.max(0, ...coinLand.map((tl) => (f >= tl ? 1 - PL(f, tl, tl + 16) : 0)));
  return (
    <SceneFrame dur={p.dur} first={p.first} last={p.last}>
      <Tag f={f} />
      {/* burst */}
      {Array.from({length: 14}).map((_, i) => {
        const ang = (i / 14) * Math.PI * 2;
        const r = 150 + burstP * 190;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 540 + Math.cos(ang) * r - 7,
              top: 510 + Math.sin(ang) * r - 7,
              width: i % 2 ? 10 : 14,
              height: i % 2 ? 10 : 14,
              borderRadius: '50%',
              background: i % 3 === 0 ? '#fff' : C.gold,
              opacity: burstP > 0 ? 1 - burstP : 0,
            }}
          />
        );
      })}
      <svg width="260" height="260" viewBox="0 0 260 260" style={{position: 'absolute', left: (W - 260) / 2, top: 380, transform: `scale(${0.85 + 0.15 * ringP})`}}>
        <circle cx="130" cy="130" r="112" fill="rgba(179,163,105,0.08)" />
        <circle cx="130" cy="130" r="112" fill="none" stroke={C.gold} strokeWidth="9" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ringP} transform="rotate(-90 130 130)" />
        <path d="M80 135 L116 170 L184 92" fill="none" stroke="#fff" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - checkP} />
      </svg>
      <div style={{position: 'absolute', top: 690, width: W, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 92, letterSpacing: 0, color: C.text, opacity: Math.min(1, t1 * 1.5), transform: `translateY(${(1 - t1) * 50}px) scale(${0.92 + 0.08 * t1})`}}>
        ¡FELICIDADES!
      </div>
      <div style={{position: 'absolute', top: 850, width: W, textAlign: 'center', fontFamily: FONT, fontWeight: 300, fontSize: 42, color: C.mute, opacity: t2, transform: `translateY(${(1 - t2) * 20}px)`}}>
        Tu cuenta Actinver está activada
      </div>
      {/* tarjeta de cuenta */}
      <div
        style={{
          position: 'absolute',
          left: 160,
          top: 1010,
          width: 760,
          height: 300,
          borderRadius: 40,
          background: 'linear-gradient(135deg,#16347a,#0c1b45)',
          border: `2px solid rgba(179,163,105,${0.35 + 0.55 * glow})`,
          boxShadow: `0 30px 70px rgba(0,0,0,0.45), 0 0 ${20 + 50 * glow}px rgba(179,163,105,${0.1 + 0.5 * glow})`,
          opacity: cardS,
          transform: `translateY(${(1 - cardS) * 190}px) scale(${1 + 0.018 * glow})`,
          fontFamily: FONT,
        }}
      >
        <Img src={staticFile('icono.png')} style={{position: 'absolute', left: 40, top: 40, width: 88, height: 88}} />
        <div style={{position: 'absolute', left: 152, top: 44, fontWeight: 600, fontSize: 38, color: '#fff'}}>Cuenta Actinver</div>
        <div style={{position: 'absolute', left: 152, top: 104, fontWeight: 400, fontSize: 22, color: C.mute}}>Lista para recibir recursos</div>
        <div style={{position: 'absolute', right: 40, bottom: 44, fontWeight: 700, fontSize: 34, letterSpacing: 6, color: 'rgba(255,255,255,0.55)'}}>•••• •••• ••••</div>
        <div style={{position: 'absolute', left: 40, bottom: 40, width: 82, height: 60, borderRadius: 14, background: 'linear-gradient(135deg,#E6D49A,#A98F4E)'}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 29, height: 2, background: 'rgba(0,0,0,0.25)'}} />
          <div style={{position: 'absolute', top: 0, bottom: 0, left: 40, width: 2, background: 'rgba(0,0,0,0.25)'}} />
        </div>
        <div style={{position: 'absolute', right: 36, top: 168, padding: '6px 18px', borderRadius: 20, background: 'rgba(121,210,176,0.16)', color: C.ok, fontWeight: 800, fontSize: 24, display: 'flex', alignItems: 'center', gap: 10}}>
          <div style={{width: 12, height: 12, borderRadius: '50%', background: C.ok}} />
          Activada
        </div>
      </div>
      {/* monedas */}
      {[0, 1, 2].map((i) => {
        const t0 = S[1].a + 14 + i * 24;
        const q = PL(f, t0, t0 + 26);
        if (q <= 0 || q >= 1) return null;
        const y = 890 + q * q * 270;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 540 + (i - 1) * 120 - 38,
              top: y,
              width: 76,
              height: 76,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%,#F4E6B0,#C9B87C 55%,#9C8E57)',
              border: '4px solid #E8D9A3',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 38,
              color: '#6b5d2a',
              opacity: 1 - PL(q, 0.82, 1),
              transform: `rotateY(${q * 540}deg)`,
            }}
          >
            $
          </div>
        );
      })}
      <Captions f={f} sentences={p.sc.sentences} sceneStart={p.sc.start} />
    </SceneFrame>
  );
};

/* ===================== PASO 1: DESCARGA ===================== */
export const Paso1: React.FC<Props> = (p) => {
  const f = useCurrentFrame();
  const S = frames(p.sc);
  const iconIn = P(f, S[1].a - 2, S[1].a + 16);
  const ring = P(f, S[1].a + 18, S[1].b - 6);
  const done = PL(f, S[1].b - 6, S[1].b + 16);
  const z = P(f, S[1].a - 14, S[1].a + 18);
  const sc = 1 + 1.05 * z;
  const cx = 36 + 122.67 + 50;
  const cy = 110 + 300 + 50;
  const px = cx + (270 - cx) * z;
  const py = cy + (430 - cy) * z;
  return (
    <SceneFrame dur={p.dur} first={p.first} last={p.last}>
      <Header f={f} dur={p.dur} label="PASO 1 DE 3" title="DESCARGA LA|APP" seg={0} fill0={0} fill1={0.5} />
      <Phone f={f} enter>
        <div style={{position: 'absolute', inset: 0, transform: `translate(${px - sc * cx}px, ${py - sc * cy}px) scale(${sc})`, transformOrigin: '0 0'}}>
          <HomeScreen f={f} slotPulse={1} iconIn={iconIn} ring={ring} done={done} />
        </div>
      </Phone>
      <Captions f={f} sentences={p.sc.sentences} sceneStart={p.sc.start} />
    </SceneFrame>
  );
};

/* ===================== PASO 1: PERMISOS ===================== */
export const Permisos: React.FC<Props> = (p) => {
  const f = useCurrentFrame();
  const S = frames(p.sc);
  const enter = sp(f, S[0].a + 4, 16, 100);
  const badge = sp(f, S[1].a + 10, 11, 170);
  const tap = S[1].b - 8;
  const press = PL(f, tap - 4, tap + 8);
  const exit = P(f, tap + 12, tap + 28);
  return (
    <SceneFrame dur={p.dur} first={p.first} last={p.last}>
      <Header f={f} dur={p.dur} label="PASO 1 DE 3" title="ACTIVA TU|UBICACIÓN" seg={0} fill0={0.5} fill1={1} />
      <Phone f={f}>
        <LoginShot />
        <PermDialog f={f} enter={enter} badge={badge} press={press} exit={exit} />
        <Ripple x={270} y={546} f={f} at={tap} />
      </Phone>
      <Captions f={f} sentences={p.sc.sentences} sceneStart={p.sc.start} />
    </SceneFrame>
  );
};

/* ===================== PASO 2: NÚMERO DE CLIENTE ===================== */
export const Paso2: React.FC<Props> = (p) => {
  const f = useCurrentFrame();
  const S = frames(p.sc);
  const spot = P(f, S[0].a + 8, S[0].a + 26);
  const zs = 1;
  const card = sp(f, S[1].a + 4, 15, 90);
  const sweep = P(f, S[1].a + 40, S[1].a + 66);
  const pageTag = sp(f, S[1].b - 52, 11, 170);
  const zn = ZONES.field;
  return (
    <SceneFrame dur={p.dur} first={p.first} last={p.last}>
      <Header f={f} dur={p.dur} label="PASO 2 DE 3" title="TU NÚMERO DE|CLIENTE" seg={1} fill0={0} fill1={0.5} />
      <Phone f={f}>
        <div style={{position: 'absolute', inset: 0, transform: `scale(${zs})`, transformOrigin: '270px 425px'}}>
          <LoginShot />
          <Spot x={zn.x} y={zn.y} w={zn.w} h={zn.h} r={10} a={spot} f={f} />
        </div>
      </Phone>
      {/* copia del contrato */}
      <div
        style={{
          position: 'absolute',
          left: 56,
          top: 900,
          width: 350,
          height: 470,
          borderRadius: 22,
          background: '#F7F8FB',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
          transform: `translate(${(1 - card) * -420}px, ${(1 - card) * 120}px) rotate(${-6 + (1 - card) * -10}deg)`,
          opacity: Math.min(1, card * 2),
          fontFamily: FONT,
          overflow: 'hidden',
        }}
      >
        <div style={{height: 78, background: '#0B1F44', padding: '16px 24px', boxSizing: 'border-box'}}>
          <div style={{fontWeight: 800, fontSize: 25, color: '#fff', letterSpacing: 4}}>CONTRATO</div>
          <div style={{fontWeight: 600, fontSize: 15, color: C.gold, marginTop: 4}}>Copia para el cliente</div>
        </div>
        <div style={{padding: '24px 24px 0'}}>
          {[0.92, 0.7, 0.84].map((w, i) => (
            <div key={i} style={{height: 12, width: `${w * 100}%`, borderRadius: 6, background: '#DDE1EA', marginBottom: 14}} />
          ))}
          <div style={{position: 'relative', marginTop: 26, padding: '12px 14px', borderRadius: 12, border: '2px solid #CFC29A'}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${sweep * 100}%`, background: 'rgba(179,163,105,0.38)', borderRadius: 10}} />
            <div style={{position: 'relative', fontWeight: 800, fontSize: 18, color: '#0B1F44'}}>Número de cliente</div>
            <div style={{position: 'relative', fontWeight: 800, fontSize: 28, letterSpacing: 7, color: '#0B1F44', marginTop: 4}}>● ● ● ● ● ●</div>
          </div>
          {[0.8, 0.9, 0.55, 0.7].map((w, i) => (
            <div key={i} style={{height: 12, width: `${w * 100}%`, borderRadius: 6, background: '#E6E9F0', marginTop: 16}} />
          ))}
        </div>
        <div
          style={{
            position: 'absolute',
            right: 18,
            bottom: 18,
            padding: '8px 18px',
            borderRadius: 16,
            background: C.gold,
            color: '#0A1018',
            fontWeight: 800,
            fontSize: 22,
            opacity: pageTag,
            transform: `scale(${pageTag}) rotate(4deg)`,
          }}
        >
          Página 1
        </div>
      </div>
      <Captions f={f} sentences={p.sc.sentences} sceneStart={p.sc.start} />
    </SceneFrame>
  );
};

/* ===================== PASO 2: CÓDIGO SMS ===================== */
export const Sms: React.FC<Props> = (p) => {
  const f = useCurrentFrame();
  const S = frames(p.sc);
  const b0 = S[0].b;
  const ban = sp(f, 10, 14, 120);
  const banOut = P(f, 72, 92);
  const codeA = PL(f, 70, 88);
  const filled = Math.floor(PL(f, 96, 96 + 6 * 7) * 6.999);
  const tap = Math.round(b0 * 0.86);
  const on = f >= tap - 6 ? 1 : 0;
  return (
    <SceneFrame dur={p.dur} first={p.first} last={p.last}>
      <Header f={f} dur={p.dur} label="PASO 2 DE 3" title="CÓDIGO POR|SMS" seg={1} fill0={0.5} fill1={1} />
      <Phone f={f}>
        <LoginShot />
        <div style={{position: 'absolute', inset: 0, opacity: codeA}}>
          <CodeScreen f={f} filled={filled} on={on} />
        </div>
        <Ripple x={270} y={553} f={f} at={tap} />
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 56,
            width: 500,
            height: 112,
            borderRadius: 28,
            background: 'rgba(244,246,251,0.97)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
            transform: `translateY(${(1 - ban) * -190 - banOut * 190}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            padding: '0 22px',
            boxSizing: 'border-box',
            fontFamily: FONT,
          }}
        >
          <div style={{width: 64, height: 64, borderRadius: 16, background: '#0B1F44', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
            <svg width="36" height="34" viewBox="0 0 36 34">
              <path d="M4 4 H32 a2 2 0 0 1 2 2 V22 a2 2 0 0 1 -2 2 H16 L8 31 V24 H4 a2 2 0 0 1 -2 -2 V6 a2 2 0 0 1 2 -2 Z" fill={C.gold} />
            </svg>
          </div>
          <div>
            <div style={{fontWeight: 700, fontSize: 15, color: '#6b7488', letterSpacing: 1}}>SMS · ahora</div>
            <div style={{fontWeight: 800, fontSize: 21, color: '#0B1118', marginTop: 4, lineHeight: 1.25}}>Tu código de verificación es ● ● ● ● ● ●</div>
          </div>
        </div>
      </Phone>
      <Captions f={f} sentences={p.sc.sentences} sceneStart={p.sc.start} />
    </SceneFrame>
  );
};

/* ===================== PASO 3: CONTRASEÑA ===================== */
export const Paso3: React.FC<Props> = (p) => {
  const f = useCurrentFrame();
  const S = frames(p.sc);
  const typed = Math.floor(PL(f, S[0].a + 14, S[0].b - 6) * 12.999);
  const len = P(f, S[0].a + 34, S[0].a + 54);
  const d1 = S[1].b - S[1].a;
  const marks = [0.36, 0.52, 0.66, 0.88];
  const reqs = marks.map((m) => P(f, S[1].a + d1 * m, S[1].a + d1 * m + 10));
  const chips = PL(f, S[2].a + 4, S[2].a + 36);
  const hi = P(f, S[3].a, S[3].a + 12);
  return (
    <SceneFrame dur={p.dur} first={p.first} last={p.last}>
      <Header f={f} dur={p.dur} label="PASO 3 DE 3" title="CREA TU|CONTRASEÑA" seg={2} fill0={0} fill1={0.5} />
      <Phone f={f}>
        <PassScreen f={f} typed={typed} len={len} reqs={reqs} chips={chips} hi={hi} />
      </Phone>
      <Captions f={f} sentences={p.sc.sentences} sceneStart={p.sc.start} />
    </SceneFrame>
  );
};

/* ===================== PASO 3: CONFIRMAR ===================== */
export const Confirmar: React.FC<Props> = (p) => {
  const f = useCurrentFrame();
  const S = frames(p.sc);
  const typed2 = Math.floor(PL(f, S[0].a + 8, S[0].b - 14) * 10.999);
  const match = P(f, S[0].b - 12, S[0].b + 4);
  const d1 = S[1].b - S[1].a;
  const terms = P(f, S[1].a + d1 * 0.22, S[1].a + d1 * 0.22 + 10);
  const onAt = S[1].a + d1 * 0.55;
  const on = f >= onAt ? 1 : 0;
  const tap = onAt + 14;
  const success = PL(f, tap + 6, tap + 34);
  return (
    <SceneFrame dur={p.dur} first={p.first} last={p.last}>
      <Header f={f} dur={p.dur} label="PASO 3 DE 3" title="CONFIRMA Y|ACEPTA" seg={2} fill0={0.5} fill1={1} />
      <Phone f={f}>
        <ConfirmScreen f={f} typed2={typed2} match={match} terms={terms} on={on} success={success} />
        <Ripple x={270} y={693} f={f} at={Math.round(tap)} />
      </Phone>
      <Captions f={f} sentences={p.sc.sentences} sceneStart={p.sc.start} />
    </SceneFrame>
  );
};

/* ===================== PRÓXIMO INICIO ===================== */
export const Biometricos: React.FC<Props> = (p) => {
  const f = useCurrentFrame();
  const S = frames(p.sc);
  const split = S[0].a + (S[0].b - S[0].a) * 0.5;
  const card = sp(f, S[0].a + 6, 14, 110);
  const cardOut = P(f, split - 10, split + 4);
  const spot = P(f, split + 8, split + 26);
  const tog = P(f, split + 44, split + 58);
  const zr = ZONES.toggleRow;
  return (
    <SceneFrame dur={p.dur} first={p.first} last={p.last}>
      <Header f={f} dur={p.dur} label="LA PRÓXIMA VEZ" title="TU PRÓXIMO|INICIO" seg={3} fill0={1} fill1={1} />
      <Phone f={f}>
        <LoginShot />
        <ToggleOverlay on={tog} />
        <Spot x={zr.x} y={zr.y} w={zr.w} h={zr.h} r={26} a={spot} f={f} />
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 310,
            width: 460,
            height: 330,
            borderRadius: 38,
            background: 'rgba(11,21,48,0.96)',
            border: `2px solid ${C.gold}`,
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
            opacity: Math.min(1, card * 1.6) * (1 - cardOut),
            transform: `translateY(${(1 - card) * 120 + cardOut * -40}px) scale(${0.92 + 0.08 * card})`,
            fontFamily: FONT,
            textAlign: 'center',
          }}
        >
          <div style={{marginTop: 26, fontWeight: 800, fontSize: 30, color: '#fff'}}>Entra con biométricos</div>
          <div style={{display: 'flex', justifyContent: 'center', gap: 54, marginTop: 30}}>
            <div>
              <div style={{transform: `scale(${1 + 0.05 * Math.sin(f / 6)})`}}>
                <Fingerprint size={120} />
              </div>
              <div style={{marginTop: 10, fontWeight: 700, fontSize: 20, color: C.mute}}>Huella</div>
            </div>
            <div>
              <div style={{transform: `scale(${1 + 0.05 * Math.sin(f / 6 + 2)})`}}>
                <FaceId size={120} />
              </div>
              <div style={{marginTop: 10, fontWeight: 700, fontSize: 20, color: C.mute}}>Rostro</div>
            </div>
          </div>
        </div>
      </Phone>
      <Captions f={f} sentences={p.sc.sentences} sceneStart={p.sc.start} />
    </SceneFrame>
  );
};

/* ===================== CIERRE ===================== */
export const Outro: React.FC<Props> = (p) => {
  const f = useCurrentFrame();
  const icon = sp(f, 4, 13, 100);
  const chk = sp(f, 22, 12, 170);
  const chkP = P(f, 26, 44);
  const t = P(f, 16, 40);
  const t2 = P(f, 30, 56);
  return (
    <SceneFrame dur={p.dur} first={p.first} last={p.last}>
      <Tag f={f} />
      {[0, 1, 2].map((i) => {
        const q = ((f + i * 28) % 84) / 84;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 540 - 150,
              top: 690 - 150,
              width: 300,
              height: 300,
              borderRadius: '50%',
              border: `3px solid ${C.gold}`,
              opacity: (1 - q) * 0.5 * icon,
              transform: `scale(${0.8 + q * 1.5})`,
            }}
          />
        );
      })}
      <div style={{position: 'absolute', left: 540 - 130, top: 690 - 130, width: 260, height: 260, transform: `scale(${icon})`, opacity: Math.min(1, icon * 2)}}>
        <Img src={staticFile('icono.png')} style={{width: 260, height: 260, filter: 'drop-shadow(0 24px 40px rgba(0,0,0,0.5))'}} />
        <div style={{position: 'absolute', right: -28, bottom: -28, width: 96, height: 96, borderRadius: '50%', background: C.gold, border: `6px solid ${C.bg1}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${chk})`}}>
          <Check size={60} p={chkP} color="#0A1018" stroke={7} />
        </div>
      </div>
      <div style={{position: 'absolute', top: 920, width: W, textAlign: 'center', fontFamily: FONT, fontWeight: 300, fontSize: 80, letterSpacing: 0, color: C.text, opacity: t, transform: `translateY(${(1 - t) * 30}px)`}}>
        TU APP ESTÁ <span style={{fontWeight: 700}}>LISTA</span>
      </div>
      <div style={{position: 'absolute', top: 1066, left: 140, right: 140, textAlign: 'center', fontFamily: FONT, fontWeight: 300, fontSize: 40, lineHeight: 1.4, color: C.mute, opacity: t2, transform: `translateY(${(1 - t2) * 20}px)`}}>
        Ya puedes recibir recursos y poner a trabajar tu dinero.
      </div>
    </SceneFrame>
  );
};
